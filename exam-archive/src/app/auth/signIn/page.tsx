/* eslint-disable react/no-unescaped-entities */
"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/route";
import loginFormSchema from "./loginSchema";
import TextInput from "@/components/auth/TextInput";
import signInAction from "@/actions/auth/signIn/POST/signIn";

export type TLogin = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formProps = useForm<TLogin>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleSubmit = async (values: TLogin) => {
    const { username, password } = values;
    const res = await signInAction({ username, password });

    if (res.hasError) {
      setError(res.message as string);
      return;
    }

    setError(null);
    formProps.reset();
    router.push(PageRoutes.search);
  };

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(handleSubmit)}>
        <TextInput
          control={formProps.control}
          name="username"
          placeholder="Enter your username or email"
          type="text"
        />
        <TextInput
          control={formProps.control}
          name="password"
          type="password"
          placeholder="Enter password"
        />
        {error !== null && <div>{error}</div>}
        <Link href={PageRoutes.auth.reset}>
          Forgot Password? <span>Reset</span>
        </Link>
        <br />
        <br />
        <Button type="submit" disabled={formProps.formState.isSubmitting}>
          {formProps.formState.isSubmitting ? "Verifying..." : "Login"}
        </Button>
        <Link href={PageRoutes.auth.newUser}>
          Don't have an account? <span>Register</span>
        </Link>
      </form>
    </Form>
  );
}
