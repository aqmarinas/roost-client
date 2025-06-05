import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import LoginForm from "./LoginForm";
import { useLogin } from "@/hooks/useLogin";
import { Toaster } from "react-hot-toast";

export default function Login() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/bookings";
  const [error, setError] = useState(location.state?.error);

  const loginMutation = useLogin();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate(from, { replace: true });
    }
  }, [auth, from]);

  const handleLogin = (data, resetForm) => {
    loginMutation.mutate(data, {
      onSuccess: (userData) => {
        setAuth({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          accessToken: userData.accessToken,
        });
        resetForm();
        navigate(from, { replace: true });
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-4xl font-bold text-indigo-600">Roost</h1>
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Login as an Admin</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm
          onSubmit={handleLogin}
          error={error}
        />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
    </div>
  );
}
