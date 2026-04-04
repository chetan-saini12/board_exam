"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onConfirm: (screenshot: File) => void;
};

export default function PaymentModal({ onClose, onConfirm }: Props) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    if (!screenshot) {
      setError("Please upload your payment screenshot to continue.");
      return;
    }
    onConfirm(screenshot);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-2xl font-extrabold text-gray-900">Pay ₹200</div>
          <p className="text-sm text-gray-400 mt-1">
            Scan the QR code below to complete your priority payment
          </p>
        </div>

        {/* QR Code */}
        <div className="w-52 h-52 rounded-2xl border-2 border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50">
          <img
            src="/payment-qr.png"
            alt="Payment QR Code"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden flex-col items-center gap-2 text-gray-300">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
            <span className="text-xs">QR not found</span>
          </div>
        </div>

        <div className="w-full bg-blue-50 rounded-2xl px-4 py-3 flex flex-col gap-1 text-center">
          <span className="text-xs text-gray-400 font-medium">Amount</span>
          <span className="text-2xl font-extrabold text-blue-700">₹200</span>
          <span className="text-xs text-gray-400">One-time priority processing fee</span>
        </div>

        {/* Screenshot Upload */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Upload Payment Screenshot *
          </label>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setError(null);
                setScreenshot(e.target.files?.[0] ?? null);
              }}
            />
            {screenshot ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">✅</span>
                <span className="text-xs font-medium text-blue-700 max-w-[180px] truncate">
                  {screenshot.name}
                </span>
                <span className="text-xs text-gray-400">Click to change</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">📸</span>
                <span className="text-xs font-medium text-blue-600">
                  Click to upload screenshot
                </span>
              </div>
            )}
          </label>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
