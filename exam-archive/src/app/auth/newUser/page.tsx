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

const registerFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email address" }),
    username: z
      .string()
      .trim()
      .min(5)
      .max(10, { message: "Username must be 10 or fewer characters long" }),
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

export type TRegister = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formProps = useForm<TRegister>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: TRegister) => {
    const res = await fetch("/api/auth/newUser", {
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
                    placeholder="Enter your username"
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
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
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
        <Button type="submit" disabled={formProps.formState.isSubmitting}>
          {formProps.formState.isSubmitting ? "Registering..." : "Register"}
        </Button>
        <Link href={"/auth/signIn"}>
          Already have an account? <span>Login</span>
        </Link>
      </form>
    </Form>
  );
}
