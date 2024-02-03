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
import registerFormSchema from "./registerFormSchema";
import { registerNewUser } from "@/actions/auth/newUser/POST/registerNewUser";
import TextInput from "@/components/auth/TextInput";

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
    const { email, password, username } = values;
    const res = await registerNewUser({ email, password, username });

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
          placeholder="Enter your username"
          type="text"
        />
        <TextInput
          control={formProps.control}
          name="email"
          placeholder="Enter your email address"
          type="text"
        />
        <TextInput
          control={formProps.control}
          name="password"
          type="password"
          placeholder="Enter password"
        />
        {error !== null && <div>{error}</div>}
        <Button type="submit" disabled={formProps.formState.isSubmitting}>
          {formProps.formState.isSubmitting ? "Registering..." : "Register"}
        </Button>
        <Link href={PageRoutes.auth.signIn}>
          Already have an account? <span>Login</span>
        </Link>
      </form>
    </Form>
  );
}
