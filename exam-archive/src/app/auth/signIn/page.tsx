/* eslint-disable react/no-unescaped-entities */
"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginFormSchema = z
  .object({
    username: z.string().trim(),
    password: z
      .string()
      .trim()
      .min(6, { message: "Minimum length of the password must be 6" })
      .max(8, { message: "Maximum length of the password must be 8" })
      .refine(
        (password) => {
          const digitRegex = /\d/;
          const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
          return digitRegex.test(password) && symbolRegex.test(password);
        },
        { message: "Password must contain atleast one digit and one symbol" }
      ),
  })
  .required();

export type TLogin = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formProps = useForm<TLogin>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleSubmit = async (values: TLogin) => {
    const res = await fetch("/api/auth/signIn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      cache: "no-store",
    });

    if (!res.ok) {
      const { message } = (await res.json()) as IResponse;
      setError(message);
      return;
    }

    setError(null);
    formProps.reset();

    router.push("/dashboard");
  };

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(handleSubmit)}>
        <FormField
          control={formProps.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username or email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={formProps.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {error !== null && <div>{error}</div>}
        <Link href={"/auth/reset"}>
          Forgot Password? <span>Reset</span>
        </Link>
        <br />
        <br />
        <Button type="submit" disabled={formProps.formState.isSubmitting}>
          {formProps.formState.isSubmitting ? "Verifying..." : "Login"}
        </Button>
        <Link href={"/auth/newUser"}>
          Don't have an account? <span>Register</span>
        </Link>
      </form>
    </Form>
  );
}
