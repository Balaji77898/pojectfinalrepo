"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderConfirmedPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Guest");
  const [tableNumber, setTableNumber] = useState("1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const name = localStorage.getItem("customerName") || "Guest";
    const table = localStorage.getItem("tableNumber") || "1";
    const id = localStorage.getItem("lastOrderId") || null;
    setCustomerName(name);
    setTableNumber(table);
    setOrderId(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2e1a] via-[#0f4d2b] to-[#0a2e1a] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-emerald-500/10 animate-ping-slow" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-emerald-400/10 animate-ping-slower" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-emerald-300/10 animate-ping-slowest" />
      </div>

      {/* Sparkle dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md text-center animate-pop-in">

        {/* Big checkmark circle */}
        <div className="mx-auto w-32 h-32 mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse-glow" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_60px_rgba(52,211,153,0.5)] animate-scale-in">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-5xl font-bold text-white mb-3 animate-fade-up"
          style={{ fontFamily: "'Playfair Display', serif", animationDelay: "0.2s" }}
        >
          Order Confirmed!
        </h1>

        {/* Subtitle */}
        <p
          className="text-emerald-300 text-lg mb-8 animate-fade-up"
          style={{ fontFamily: "'Poppins', sans-serif", animationDelay: "0.35s" }}
        >
          Thank you, <span className="font-bold text-white">{customerName}</span>!<br />
          Your order for Table <span className="font-bold text-white">#{tableNumber}</span> has been placed.
        </p>

        {/* Order ID chip */}
        {orderId && (
          <div
            className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 rounded-full px-5 py-2 mb-8 animate-fade-up"
            style={{ fontFamily: "'Poppins', sans-serif", animationDelay: "0.45s" }}
          >
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            <span className="text-emerald-300 text-sm font-medium">Order ID:</span>
            <span className="text-white text-sm font-bold font-mono">{orderId.slice(0, 8).toUpperCase()}…</span>
          </div>
        )}

        {/* Info cards */}
        <div
          className="grid grid-cols-3 gap-3 mb-8 animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          {[
            { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", label: "Placed", color: "emerald" },
            { icon: "M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z", label: "Preparing", color: "yellow" },
            { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "On the way", color: "orange" },
          ].map((step, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-emerald-500/30" : "bg-white/10"}`}>
                <svg className={`w-4 h-4 ${i === 0 ? "text-emerald-400" : "text-white/30"}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d={step.icon} />
                </svg>
              </div>
              <span className={`text-xs font-medium ${i === 0 ? "text-emerald-300" : "text-white/30"}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div
          className="flex flex-col gap-3 animate-fade-up"
          style={{ animationDelay: "0.65s" }}
        >
          <button
            onClick={() => router.push("/customer/order-status")}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all duration-300"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #059669, #047857)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            TRACK ORDER STATUS
          </button>

          <button
            onClick={() => router.push("/customer/menu")}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 border-2 border-emerald-500/40"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "rgba(255,255,255,0.05)",
              color: "#6ee7b7",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
            </svg>
            Add More Items
          </button>
        </div>

        {/* Estimated time */}
        <p
          className="mt-6 text-emerald-400/60 text-sm animate-fade-up"
          style={{ fontFamily: "'Poppins', sans-serif", animationDelay: "0.75s" }}
        >
          🍽️ Estimated preparation time: <strong className="text-emerald-300">15–20 mins</strong>
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8) translateY(30px); }
          70% { transform: scale(1.02) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in { animation: pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes scale-in {
          0% { transform: scale(0) rotate(-30deg); }
          60% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-scale-in { animation: scale-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; opacity: 0; }

        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

        @keyframes ping-slow {
          0% { transform: scale(0.5); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 3s ease-out infinite; }
        .animate-ping-slower { animation: ping-slow 4s ease-out infinite 0.5s; }
        .animate-ping-slowest { animation: ping-slow 5s ease-out infinite 1s; }

        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0); }
        }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
