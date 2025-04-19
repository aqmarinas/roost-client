import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/atom/Button";
import Input from "../../../components/atom/Input";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/schedules";
  const [error, setError] = useState(location.state?.error);

  // useEffect(() => {
  //   if (auth?.accessToken) {
  //     navigate(from, { replace: true });
  //   }
  // }, [auth, navigate, location]);

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
              error={errors.email?.message}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              required
              error={errors.password?.message}
            />

            <Button
              text="Login"
              type="submit"
            />
          </form>
        </div>
      </div>
    </>
  );
}
