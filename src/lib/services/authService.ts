// src/lib/services/authService.ts
import axiosInstance from "../instance/axios-instance";

// Forgot Password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forget-password", {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Request failed",
    };
  }
};

// Verify OTP
export const verifyOtp = async (payload: { otp: string; email: string }) => {
  try {
    const response = await axiosInstance.post("/auth/verify-code", payload);

    return { success: true, data: response.data };
  } catch {
    return {
      success: false,
      message: "Verification failed",
    };
  }
};

// Resend Forgot OTP
export const resendForgotOtp = async (tokenFromURL: string) => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-password",
      {},
      {
        headers: {
          _customToken: tokenFromURL,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Failed to resend OTP",
    };
  }
};

// Reset Password
export const resetPassword = async (payload: {
  email: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", payload);

    return { success: true, data: response.data };
  } catch {
    return { success: false, message: "Reset password failed" };
  }
};
