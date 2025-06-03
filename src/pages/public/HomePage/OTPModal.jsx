import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function OTPModal({ onSubmit, onResend }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
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
    }
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("OTP is required and must be 6 digits");
      return;
    }

    setError("");
    setIsVerifying(true);

    onSubmit(otp)
      .then(() => {
        setIsVerifying(false);
      })
      .catch((err) => {
        setError("Failed to verify OTP");
        setIsVerifying(false);
      });
  };

  return (
    <>
      <div className="text-center mt-6">
        <h2 className="text-xl font-bold text-gray-800">Verification Code</h2>
        <p className="text-gray-500 mt-2 text-sm">
          We've sent a 6-digit code to email. Please check your inbox and spam folder. If you don't see the email in spam, please wait a few moments for it to arrive. Enter the code below to verify.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className={`size-12 text-base font-medium`}
                invalid={!!error}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

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
        <Button
          disabled={isVerifying}
          fullWidth
          onClick={handleVerify}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </>
  );
}
