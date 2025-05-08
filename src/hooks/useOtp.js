import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/config/config";
import toast from "react-hot-toast";

export function useOtp() {
  const sendOtpMutation = useMutation({
    mutationFn: async ({ bookerEmail, bookerName }) => {
      const response = await fetch(`${API_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookerEmail, bookerName }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }

      return result;
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ bookerEmail, otp }) => {
      const response = await fetch(`${API_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookerEmail, otp }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      return result;
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
  };
}
