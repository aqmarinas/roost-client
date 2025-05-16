import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "@/lib/axios";

export function useOtp() {
  const sendOtpMutation = useMutation({
    mutationFn: async ({ bookerEmail, bookerName }) => {
      const response = await axios.post("/otp/send", {
        bookerEmail,
        bookerName,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ bookerEmail, otp }) => {
      const response = await axios.post("/otp/verify", {
        bookerEmail,
        otp,
      });
      return response.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    },
  });

  // const isVerifiedQuery = (bookerEmail) =>
  //   useQuery({
  //     queryKey: ["isVerified", bookerEmail],
  //     queryFn: async () => {
  //       const response = await axios.get(`/otp/is-verified`, {
  //         params: { bookerEmail },
  //       });
  //       return response.data.verified;
  //     },
  //     enabled: !!bookerEmail,
  //   });

  const checkIsVerified = async (bookerEmail) => {
    try {
      const response = await axios.get("/otp/is-verified", {
        params: { bookerEmail },
      });

      return response.data.verified;
    } catch (error) {
      toast.error("Failed to check email verification");
      return false;
    }
  };
  return {
    sendOtpMutation,
    verifyOtpMutation,
    // isVerifiedQuery,
    checkIsVerified,
  };
}
