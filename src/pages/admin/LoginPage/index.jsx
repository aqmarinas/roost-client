import { useLocation, useNavigate } from "react-router-dom";
import Input from "@/components/form/input";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/config";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/bookings";
  const [error, setError] = useState(location.state?.error);
  const [showPassword, setShowPassword] = useState(false);

  console.log(auth);
  useEffect(() => {
    if (auth?.accessToken) {
      navigate(from, { replace: true });
    }
  }, [auth, from, location]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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

      setAuth({
        email: result.data?.email,
        name: result.data?.name,
        role: result.data?.role,
        accessToken: result.data?.accessToken,
      });

      navigate(from, { replace: true });
      reset();
    } catch (error) {
      setError(error.message);
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
          {error && <div className="bg-red-50 p-4 text-red-600 rounded-xl text-sm">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              required
              autofocus
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                required
                error={errors.password?.message}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center mt-8">
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              fullWidth
              className="mt-4"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
