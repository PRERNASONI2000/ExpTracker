// WelcomePopup.jsx
import { useEffect, useState } from "react";
import { UserPlus, Sparkles, X } from "lucide-react";

function WelcomePopup({ onRegister }) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");

    // Only set popup timers if the user is NOT logged in
    if (!token) {
      // 1. Appear after 5 seconds
      const showTimer = setTimeout(() => {
        setIsRendered(true);
        // Micro-delay to allow DOM mount before transition starts
        setTimeout(() => setIsVisible(true), 50);
      }, 5000);

      // Clean up show timer
      return () => clearTimeout(showTimer);
    }
  }, []);

  // 2. Auto dismiss after 10 seconds of being visible
  useEffect(() => {
    if (isVisible) {
      const dismissTimer = setTimeout(() => {
        handleDismiss();
      }, 10000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for transition duration to unmount component
    setTimeout(() => setIsRendered(false), 500);
  };

  const handleRegisterClick = () => {
    handleDismiss();
    if (onRegister) {
      onRegister();
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#090d16]/90 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out sm:max-w-md ${
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-4 scale-95 opacity-0"
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl -z-10 animate-pulse" />
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl -z-10 animate-pulse" />

      {/* Dismiss Icon */}
      <button
        onClick={handleDismiss}
        className="absolute right-3.5 top-3.5 rounded-lg p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white cursor-pointer"
        aria-label="Close welcome alert"
      >
        <X size={16} />
      </button>

      <div className="flex gap-4">
        {/* Smile Emoji Badge */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 text-2xl border border-indigo-500/25 shadow-lg shadow-indigo-500/5 select-none animate-float">
          😊
        </div>

        <div className="min-w-0 pr-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            Welcome to SpendFlow!
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          </h3>
          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
            Register now to track your expenses smarter, unlock custom analytics, and manage your wealth securely.
          </p>

          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={handleRegisterClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/15 transition duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <UserPlus size={12} />
              Register
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-white/5 bg-zinc-950/20 px-3.5 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;
