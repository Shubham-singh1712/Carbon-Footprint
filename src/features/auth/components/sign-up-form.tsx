"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const supabase = getSupabaseBrowserClient();

          if (!supabase) {
            toast.info("Supabase keys are missing — redirecting to onboarding in demo mode.");
            router.push("/onboarding");
            return;
          }

          const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });

          if (error) {
            toast.error(error.message);
            return;
          }

          toast.success("Account created! Let's set up your carbon profile.");
          router.push("/onboarding");
        });
      })}
    >
      <Input
        placeholder="Email address"
        type="email"
        {...form.register("email")}
        aria-invalid={!!form.formState.errors.email}
      />
      {form.formState.errors.email ? (
        <p className="text-xs text-danger">{form.formState.errors.email.message}</p>
      ) : null}

      <Input
        placeholder="Password"
        type="password"
        {...form.register("password")}
        aria-invalid={!!form.formState.errors.password}
      />
      {form.formState.errors.password ? (
        <p className="text-xs text-danger">{form.formState.errors.password.message}</p>
      ) : null}

      <Input
        placeholder="Confirm password"
        type="password"
        {...form.register("confirmPassword")}
        aria-invalid={!!form.formState.errors.confirmPassword}
      />
      {form.formState.errors.confirmPassword ? (
        <p className="text-xs text-danger">{form.formState.errors.confirmPassword.message}</p>
      ) : null}

      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
      <p className="text-sm text-muted">
        Add Supabase credentials to `.env.local` to enable live authentication.
      </p>
    </form>
  );
}
