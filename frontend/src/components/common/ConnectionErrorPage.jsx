import { WifiOff, ServerCrash, RotateCw } from "lucide-react";

const TEAL = "#004953";

export default function ConnectionErrorPage({ variant, checking, onRetry }) {
  const isOffline = variant === "offline";

  const Icon = isOffline ? WifiOff : ServerCrash;
  const title = isOffline ? "You're offline" : "Server unavailable";
  const description = isOffline
    ? "Check your internet connection. We'll keep trying to reconnect automatically."
    : "We can't reach Crave24h right now. Our servers might be restarting or temporarily down.";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#F6FAFA] px-6">
      <div className="w-full max-w-sm text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{ background: "rgba(0,73,83,.08)" }}
        >
          <Icon size={36} style={{ color: TEAL }} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

        <button
          onClick={onRetry}
          disabled={checking}
          className="btn-press mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: TEAL }}
        >
          <RotateCw size={16} className={checking ? "animate-spin" : ""} />
          {checking ? "Checking…" : "Try again"}
        </button>
      </div>
    </div>
  );
}
