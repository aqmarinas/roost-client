import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function OTPModal({ onSubmit, onBack, onResend }) {
  const [otp, setOtp] = useState("");
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
      // onResend?.();
      setCountdown(60);
    }
  };

  return (
    <div>
      <Input
        id="otp"
        label="Enter OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value)}
      />
      <div className="mt-4 text-sm text-gray-500">
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
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={() => onSubmit(otp)}>Verify & Book</Button>
      </div>
    </div>
  );
}
