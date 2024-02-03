import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AsyncCreatableSelect from "react-select/async-creatable";
import addValuesToCache from "@/actions/upload/POST/postValuesToCache";
import { REDIS_COLLECTION_NAME } from "@/constants/constants";

interface IOptions {
  label: string;
}

interface AsyncCreatableSelectComponentProps {
  name: string;
  id: string;
  label: string;
  control: any;
  options: IOptions[];
  placeholder: string;
}

export default function AsyncCreatableSelectComponent({
  name,
  id,
  label,
  options,
  placeholder,
  control,
}: AsyncCreatableSelectComponentProps) {
  const filterOptions = (inputValue: string): typeof options => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = async (inputValue: string) => {
    return new Promise<typeof options>((resolve) => {
      setTimeout(() => {
        resolve(filterOptions(inputValue));
      }, 1000);
    });
  };

  const handleOnChangeEvent = async (inputValue: any, actionMeta: any) => {
    if (actionMeta.action === "create-option") {
      const { label } = inputValue;
      const transformedLabel: string = label
        .split(" ")
        .filter(Boolean)
        .map((value: string) =>
          value.charAt(0).toUpperCase().concat(value.slice(1))
        )
        .join(" ");

      await addValuesToCache({
        setName: REDIS_COLLECTION_NAME.INSTITUTIONS,
        value: transformedLabel,
      });
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <FormControl>
              <AsyncCreatableSelect
                isClearable
                cacheOptions
                defaultOptions
                id={id}
                placeholder={placeholder}
                loadOptions={promiseOptions}
                onChange={(value, actionMeta) => {
                  handleOnChangeEvent(value, actionMeta);
                  field.onChange(value?.label);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
