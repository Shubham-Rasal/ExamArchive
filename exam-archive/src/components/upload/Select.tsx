import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ISelectProps {
  control: any;
  name: string;
  label: string;
  id: string;
  options: Record<string, Record<string, string> | string>;
  placeholder: string;
}

const capitaliseString = (params: string, groupLabel: boolean) => {
  return groupLabel
    ? params.toUpperCase()
    : params.charAt(0).toUpperCase().concat(params.slice(1));
};

export default function SelectComponent({
  control,
  name,
  label,
  id,
  options,
  placeholder,
}: ISelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} id={id} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(options).map(
                  ([category, option], index: number) => {
                    return (
                      <SelectGroup key={index}>
                        {typeof option === "string" && (
                          <SelectItem value={option} key={category}>
                            {capitaliseString(option, false)}
                          </SelectItem>
                        )}
                        {typeof option === "object" &&
                          Array.isArray(option) === false &&
                          option !== null && (
                            <>
                              <SelectLabel>
                                {capitaliseString(category, true)}
                              </SelectLabel>
                              {Object.entries(option).map(([key, value]) => {
                                return (
                                  <SelectItem value={value} key={key}>
                                    {capitaliseString(value, false)}
                                  </SelectItem>
                                );
                              })}
                            </>
                          )}
                      </SelectGroup>
                    );
                  }
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
