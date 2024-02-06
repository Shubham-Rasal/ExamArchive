import { EXAM_TYPES } from "@/constants/constants";
import SelectComponent from "./Select";
import FileInput from "./FileInput";

export default function FileUpload({ control }: { control: any }) {
  return (
    <div>
      <FileInput
        control={control}
        name="file"
        label="Upload question paper"
        id="file"
      />
      <SelectComponent
        control={control}
        name="examType"
        label="Type of examination"
        id="exam_type"
        options={EXAM_TYPES}
        placeholder="Select the type of examination"
      />
    </div>
  );
}
