import React from "react";

export default function InputAddOn() {
  // blm diimplementasiin
  return (
    <>
      <div>
        <label
          htmlFor="bookerPhone"
          className="block text-sm/6 font-semibold text-gray-900 mt-3"
        >
          Phone Number <span className="text-red-500"> *</span>
        </label>
        <div className="mt-2 flex">
          <div className="flex shrink-0 items-center rounded-l-md bg-white px-3 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6">+62</div>
          <input
            id="bookerPhone"
            name="bookerPhone"
            type="text"
            placeholder="1234567890"
            className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...register("bookerPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^8[0-9]{8,13}$/,
                message: "Invalid phone number format",
              },
            })}
          />
        </div>
        {errors.bookerPhone && <p className="text-red-500 text-sm">{errors.bookerPhone.message}</p>}
      </div>
    </>
  );
}
