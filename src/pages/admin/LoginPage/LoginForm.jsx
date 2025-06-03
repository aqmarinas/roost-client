import { useForm } from "react-hook-form";
import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm({ onSubmit, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, reset))}>
      {error && <div className="bg-red-50 p-4 text-red-600 rounded-xl text-sm mb-4">{error}</div>}

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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-4"
      >
        {isSubmitting ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
