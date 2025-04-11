import React, { useState, useRef } from "react";

export default function InputOTP({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputs.current[index] = el)}
          style={{ width: "40px", margin: "5px", textAlign: "center" }}
        />
      ))}
    </div>
  );
}
