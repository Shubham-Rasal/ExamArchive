import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useRef } from "react";

interface FileInputProps {
  control: any;
  name: string;
  id: string;
  label: string;
}

export default function FileInput({
  control,
  name,
  id,
  label,
}: FileInputProps) {
  const inputFieldRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <FormControl>
              <div>
                <Input
                  id={id}
                  type="file"
                  accept="application/pdf"
                  ref={inputFieldRef}
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
                <Button
                  type="button"
                  onClick={() => {
                    (inputFieldRef.current as HTMLInputElement).value = "";
                    field.onChange(new File([], ""));
                  }}
                >
                  Delete
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
