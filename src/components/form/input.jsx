import { cn } from "@/lib/utils";

export default function Input({ id, name, type = "text", placeholder, label, required = false, register, className, error, disabled = false, ...props }) {
  return (
    <>
      <div className="px-1">
        <label
          htmlFor={id}
          className={`block text-sm/6 font-semibold text-gray-900 mt-3`}
        >
          {label ?? ""}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <div className="mt-2 grid grid-cols-1">
          <div className="relative">
            <input
              id={id}
              name={name}
              type={type}
              placeholder={placeholder ?? ""}
              {...register}
              {...props}
              disabled={disabled}
              className={cn(
                `block w-full rounded-md bg-white px-3 py-2 text-sm outline-none border ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${
                  error ? "border-red-500" : "border-gray-300"
                } placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none checked:bg-indigo-600`,
                className
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    </>
  );
}
