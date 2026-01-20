"use client";

import { useEffect, useState } from "react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const { handleVerifyOtp, loading } = useAuth();

  //  Timer
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // canResend value is derived from timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // derive canResend using another effect
  useEffect(() => {
    setCanResend(timer === 0);
  }, [timer]);

  // Input handler
  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email") || "";

    const res = await handleVerifyOtp(otpCode, email);

    if (res?.success) {
      toast.success("OTP verified successfully!");

      const token = urlParams.get("token");

      setTimeout(() => {
        router.push(
          `/reset-password?token=${encodeURIComponent(token || "")}&email=${encodeURIComponent(email)}`,
        );
      }, 1000);
    } else {
      toast.error(res?.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-md p-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#0B3B36] mb-4">
            Verify Your Account
          </h2>
          <p className="text-[#343A40] mb-6">
            Enter the 6-digit code sent to your email to continue.
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex items-center gap-3 justify-center mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className={`w-14 h-14 text-2xl text-center border rounded-lg outline-none transition
                ${
                  digit
                    ? "border-red-600 text-red-600"
                    : "border-gray-300 text-gray-700"
                }`}
            />
          ))}
        </div>

        <button
          className={`w-full bg-[#07589E] text-white py-3 rounded-md text-lg font-medium transition
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#07589E] cursor-pointer"}
  `}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
