import { useNavigate } from "react-router-dom";
import Button from "../../../components/atom/Button";
import Input from "../../../components/atom/Input";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to login");
      }

      navigateTo("/admin/schedules");
      reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to login");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-center text-4xl/9 font-bold  text-indigo-600">Roost</h1>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login as an Admin</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              // error={errors.email?.message}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              // error={errors.password?.message}
            />

            <Button
              text="Login"
              type="submit"
            />
          </form>
        </div>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
    </>
  );
}
