import React from "react";

export default function Button({ onClose, text, children, ...props }) {
  return (
    <>
      <button
        type="type"
        onClick={onClose}
        {...props}
        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-8"
      >
        {children || text}
        {/* {children} */}
      </button>
    </>
  );
}
