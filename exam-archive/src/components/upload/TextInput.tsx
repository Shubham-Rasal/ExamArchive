import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ITextInputProps {
  control: any;
  name: string;
  id: string;
  placeholder: string;
  label: string;
}

export default function TextInput({
  control,
  name,
  id,
  placeholder,
  label,
}: ITextInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <Label htmlFor={id}>{label}</Label>
            <FormControl>
              <Input
                type="text"
                placeholder={placeholder}
                id={id}
                {...field}
                autoComplete="off"
                
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
