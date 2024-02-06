import { EXAM_TYPES } from "@/constants/constants";
import InstitutionalExamMetadata from "@/components/upload/InstitutionalExam";

const getMultiStepComponents = (exam: string, control: any) => {
  let examType = Object.entries(EXAM_TYPES).find(([_, types]) =>
    Object.values(types).includes(exam as any)
  )?.[0] as keyof typeof EXAM_TYPES | undefined;

  if (examType === undefined) examType = "INSTITUTIONAL";

  switch (examType) {
    case "INSTITUTIONAL":
      return [
        <div key="institutional">
          <InstitutionalExamMetadata control={control} />
        </div>,
      ];
  }
};

export default getMultiStepComponents;
