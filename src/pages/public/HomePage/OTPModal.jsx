import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function OTPModal({ onSubmit, onResend }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(60);
      setError("");
      onResend();
      console.log("resend success");
    }
  };

  const handleVerify = () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setError("");
    onSubmit(otp);
  };

  return (
    <>
      <div className="text-center mt-6">
        <h2 className="text-xl font-bold text-gray-800">Verification Code</h2>
        <p className="text-gray-500 mt-2 text-sm">We've sent a 6-digit code to email. Enter the code below to verify.</p>
      </div>
      <Input
        id="otp"
        label="Enter OTP"
        value={otp}
        maxLength={6}
        required
        onChange={(e) => setOtp(e.target.value)}
        error={error}
      />
      <div className="mt-6 text-sm text-gray-500 text-center">
        Didn't receive the OTP?{" "}
        {countdown === 0 ? (
          <span
            onClick={handleResend}
            className="text-indigo-700 underline cursor-pointer font-medium underline-offset-2"
          >
            Resend
          </span>
        ) : (
          <span className="text-gray-500">Resend in {countdown} seconds</span>
        )}
      </div>
      <div className="flex justify-between mt-6">
        {/* <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button> */}
        <Button
          fullWidth
          onClick={handleVerify}
        >
          Verify & Book
        </Button>
      </div>
    </>
  );
}
