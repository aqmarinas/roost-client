export default function Input({ id, name, type, placeholder, label, required = false, autofocus = false, register, error, ...props }) {
  return (
    <>
      <div>
        <label
          htmlFor={id}
          className={`block text-sm/6 font-semibold text-gray-900 mt-3`}
        >
          {label ?? ""}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </div>
      <div className="mt-2 grid grid-cols-1">
        <div className="relative">
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder ?? ""}
            autoFocus={autofocus}
            {...register}
            {...props}
            className={`block w-full rounded-md bg-white px-3 py-2 text-sm outline-none border ${
              error ? "border-red-500" : "border-gray-300"
            } placeholder:text-gray-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none checked:bg-indigo-600`}
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </>
  );
}
