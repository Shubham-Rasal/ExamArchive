import { z } from "zod";

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

export default loginFormSchema;
