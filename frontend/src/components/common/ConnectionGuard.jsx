import useNetworkStatus from "../../hooks/useNetworkStatus";
import ConnectionErrorPage from "./ConnectionErrorPage";

export default function ConnectionGuard({ children }) {
  const { isOnline, serverReachable, checking, retry } = useNetworkStatus();

  if (!isOnline || !serverReachable) {
    return (
      <ConnectionErrorPage
        variant={!isOnline ? "offline" : "server-down"}
        checking={checking}
        onRetry={retry}
      />
    );
  }

  return children;
}
