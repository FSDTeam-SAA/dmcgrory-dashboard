// src/lib/hooks/useAuth.ts

// src/lib/hooks/useAuth.ts
"use client";

import { useState } from "react";
import {
  forgotPassword,
  resendForgotOtp,
  resetPassword,
  verifyOtp,
} from "../services/authService";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const res = await forgotPassword(email);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Handle OTP verification
  const handleVerifyOtp = async (otp: string, email: string) => {
    setLoading(true);
    setError(null);

    const res = await verifyOtp({ otp, email });

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  //  NEW — Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token") || "";

    if (!tokenFromURL) {
      setError("Invalid or missing token");
      setLoading(false);
      return { success: false, message: "No token found in URL" };
    }

    const res = await resendForgotOtp(tokenFromURL);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  // Reset Password hook
  const handleResetPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);

    // Get email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email") || "";

    if (!email) {
      setError("Email not found");
      setLoading(false);
      return { success: false, message: "Email not found in URL" };
    }

    const res = await resetPassword({ email, newPassword });

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message || "Something went wrong");
    }

    setLoading(false);
    return res;
  };

  return {
    loading,
    result,
    error,
    handleVerifyOtp,
    handleForgotPassword,
    handleResendOtp,
    handleResetPassword,
  };
}
