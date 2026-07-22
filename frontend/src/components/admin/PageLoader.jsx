export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Simple modern spinner */}
      <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-teal-600 animate-spin" />

      {/* subtle text */}
      <p className="mt-4 text-sm text-slate-500">
        {text}
      </p>

    </div>
  );
}