"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PaymentModal from "@/app/components/PaymentModal";

const BOARDS = [
  { id: "cbse", name: "CBSE" },
  { id: "icse", name: "ICSE" },
  { id: "haryana", name: "Haryana Board" },
  { id: "punjab", name: "Punjab Board" },
  { id: "bihar", name: "Bihar Board" },
  { id: "up", name: "UP Board" },
  { id: "other", name: "Other" },
];

export default function ContactPage() {
  const [priority, setPriority] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [customBoard, setCustomBoard] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    contact_number: "",
    address: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const board =
      selectedBoard === "other" ? customBoard.trim() : selectedBoard;

    if (!form.name || !form.contact_number || !form.address || !board || !file) {
      setError("All fields are required.");
      return;
    }

    if (priority && !paymentScreenshot) {
      setError("Please upload your payment screenshot for priority processing.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("contact_number", form.contact_number);
      fd.append("address", form.address);
      fd.append("board", board);
      fd.append("ticket_type", "offline");
      fd.append("priority", String(priority));
      fd.append("document", file);
      if (paymentScreenshot) fd.append("payment_screenshot", paymentScreenshot);

      await api.post("/tickets", fd);

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!success) return;
    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    const timeout = setTimeout(() => router.push("/"), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [success, router]);

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center flex flex-col items-center gap-4 p-8">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Details Submitted!
          </h2>
          <p className="text-gray-500">
            Our team will reach out to you shortly.
          </p>
          <p className="text-sm text-blue-500 font-medium">
            Redirecting to home in {countdown}…
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Get in Touch
            </h1>
            <p className="mt-2 text-gray-500">
              Fill in your details and we will reach out to you shortly.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col gap-6"
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Board */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Board *
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              >
                <option value="" disabled>
                  Select your board
                </option>
                {BOARDS.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
              {selectedBoard === "other" && (
                <input
                  type="text"
                  value={customBoard}
                  onChange={(e) => setCustomBoard(e.target.value)}
                  placeholder="Enter your board name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Address *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 12, Main Street, Delhi, 110001"
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Upload Result */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Upload Result *
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">✅</span>
                    <span className="text-sm font-medium text-blue-700">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      Click to change
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">📄</span>
                    <span className="text-sm font-medium text-blue-600">
                      Click to upload result
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, or PDF
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* Priority Toggle */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-semibold text-gray-700">
                    Priority
                  </div>

                  <div className="text-xs text-gray-400 mt-0.5">
                    {priority
                      ? "Team will contact you the same day"
                      : "May take 2+ days to process"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPriority(!priority)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    priority ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
                      priority ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {priority && (
                <div className="rounded-2xl overflow-hidden border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-100 p-5 flex flex-col items-center gap-3">
                  <div className="text-4xl">⚡</div>
                  <div className="font-bold text-blue-800 text-lg">
                    Priority Processing Fee
                  </div>
                  <p className="text-red-600 font-medium">
                    ⚠️ If you are unable to make the payment, our system will
                    automatically close and cancel your query. Please ensure
                    that you complete a valid payment to avoid any interruption.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowPayModal(true)}
                    className="mt-1 px-5 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow hover:bg-green-600 active:scale-95 transition-all"
                  >
                    Pay ₹200
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 font-medium text-center">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition text-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Send Details"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted by our team regarding
              board exam assistance.
            </p>
          </form>
        </div>
      </main>
      {/* Payment Modal */}
      {showPayModal && (
        <PaymentModal
          onClose={() => setShowPayModal(false)}
          onConfirm={(screenshot) => setPaymentScreenshot(screenshot)}
        />
      )}
    </>
  );
}
