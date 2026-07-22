import { useCallback, useEffect, useState } from "react";

const HEALTH_URL = "http://localhost:5000/api/health";
const CHECK_INTERVAL = 10000;
const REQUEST_TIMEOUT = 5000;

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverReachable, setServerReachable] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkServer = useCallback(async () => {
    if (!navigator.onLine) {
      setServerReachable(false);
      return;
    }

    setChecking(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const res = await fetch(HEALTH_URL, {
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeout);
      setServerReachable(res.ok);
    } catch {
      setServerReachable(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkServer();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setServerReachable(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkServer();
    const interval = setInterval(checkServer, CHECK_INTERVAL);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkServer]);

  return { isOnline, serverReachable, checking, retry: checkServer };
}
