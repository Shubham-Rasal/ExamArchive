import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface ITextInputProps {
  name: string;
  control: any;
  placeholder: string;
  type: "text" | "password";
}

export default function TextInput({
  name,
  control,
  placeholder,
  type,
}: ITextInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormControl>
              <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
