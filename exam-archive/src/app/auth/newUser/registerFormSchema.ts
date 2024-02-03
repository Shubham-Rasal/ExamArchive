import { z } from "zod";

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

export default registerFormSchema;
