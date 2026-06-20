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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "demo@carbontwin.ai",
      password: "password123",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const supabase = getSupabaseBrowserClient();

          if (!supabase) {
            toast.info("Supabase keys are missing, so the platform stays in demo mode.");
            router.push("/dashboard");
            return;
          }

          const { error } = await supabase.auth.signInWithPassword(values);

          if (error) {
            toast.error(error.message);
            return;
          }

          toast.success("Welcome back to CarbonTwin AI.");
          router.push("/dashboard");
        });
      })}
    >
      <Input placeholder="Email address" {...form.register("email")} />
      <Input
        placeholder="Password"
        type="password"
        {...form.register("password")}
      />
      <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Continue to dashboard"
        )}
      </Button>
      <p className="text-sm text-muted">
        Add Supabase credentials to `.env.local` to switch from demo mode to live auth.
      </p>
    </form>
  );
}
