"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dashboardHome, routes } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { handleFormError } from "@/lib/form-errors";
import { loginSchema, type LoginValues } from "@/validations/auth.schema";
import { Button, FormField, Input } from "@/components/ui";

/** Only allow same-site relative redirects (prevents open-redirects via ?next=). */
export const safeNext = (next: string | null) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : null;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values);
      console.log(user, "user");
      console.log(
        safeNext(searchParams.get("next")),
        "safeNext(searchParams.get('next'))"
      );
      // router.replace(
      //   safeNext(searchParams.get("next")) ?? dashboardHome(user.role)
      // );
      router.replace("/");
      // router.refresh();
    } catch (error) {
      handleFormError(error, setError, ["email", "password"]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register("password")}
        />
      </FormField>
      <Button
        type="submit"
        variant="dark"
        size="lg"
        className="w-full"
        loading={isSubmitting}
      >
        Log in
      </Button>
      <p className="text-center text-sm text-zinc-500">
        New here?{" "}
        <Link
          href={routes.register}
          className="font-medium text-brand-700 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
