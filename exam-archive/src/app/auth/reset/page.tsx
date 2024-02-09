"use client";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ACTION, AUTH_TOKEN } from "@/constants/constants";
import validateToken from "@/helpers/auth/validateToken";
import isEmail from "validator/lib/isEmail";
import isValidPassword from "@/helpers/auth/validatePassword";
import { PageRoutes } from "@/constants/route";
import TextInput from "@/components/auth/TextInput";
import resetAction, { TAction } from "@/actions/auth/reset/POST/reset";

export type TReset = { password: string; email?: string };

export default function Reset() {
  const [actionType, setActionType] = useState<TAction>(ACTION.EMAIL);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authToken = searchParams.get(AUTH_TOKEN);
    if (authToken === null) {
      // TODO : render an error page with a resend link button
      return;
    }
    validateToken(authToken).then((email: string | null) => {
      if (email !== null) {
        setEmail(email);
        setActionType(ACTION.RESET);
        return;
      }
      // TODO : render an error page with a resend link button
    });
  }, []);

  const formProps = useForm<TReset>({
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: TReset) => {
    if (actionType === ACTION.EMAIL) {
      const isEmailFieldValid = isEmail(values.email as string);
      if (isEmailFieldValid === false) {
        setError("Invalid email address");
        return;
      }
      Object.assign(values, { action: actionType });
    } else if (actionType === ACTION.RESET) {
      const isPasswordFieldValid = isValidPassword(values.password);
      if (isPasswordFieldValid === false) {
        setError("Please provide a valid password");
        return;
      }
      Object.assign(values, { action: actionType, email });
    }

    const res = await resetAction({
      email: values.email ?? email,
      password: values.password,
      action: actionType,
    });

    console.log(res);

    if (res.hasError) {
      setError(res.message as string);
      return;
    }

    setError(null);
    formProps.reset();

    if (actionType === ACTION.RESET) router.push(PageRoutes.search);
  };

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(handleSubmit)}>
        <FormField
          control={formProps.control}
          name="email"
          disabled={actionType === ACTION.RESET}
          render={({ field }) => {
            field.value =
              actionType === ACTION.RESET ? (email as string) : field.value;
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
        {actionType === ACTION.RESET ? (
          <TextInput
            control={formProps.control}
            name="password"
            type="password"
            placeholder="Enter Password"
          />
        ) : null}
        {error !== null && <div>{error}</div>}
        {actionType === ACTION.RESET ? (
          <Button type="submit" disabled={formProps.formState.isSubmitting}>
            {formProps.formState.isSubmitting
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        ) : (
          <Button type="submit" disabled={formProps.formState.isSubmitting}>
            {formProps.formState.isSubmitting
              ? "Generating..."
              : "Generate Email"}
          </Button>
        )}
      </form>
    </Form>
  );
}
