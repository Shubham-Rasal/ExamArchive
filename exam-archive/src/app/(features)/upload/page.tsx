"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import uploadFileSchema from "./uploadFileSchema";
import { ReactElement, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/hooks/upload/useMultiStepForm";
import getMultiStepComponents from "@/helpers/upload/getMultiStepComponent";
import FileUpload from "@/components/upload/FileUpload";
import { EXAM_TYPES } from "@/constants/constants";
import uploadfileAction from "@/actions/upload/POST/uploadFiles";

export type TUploadFile = z.infer<typeof uploadFileSchema>;
const MAX_LENGTH_OF_FILES_INFO_ARRAY = 2;

export default function UploadPage() {
  const formProps = useForm<TUploadFile>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      examType:
        "" as (typeof EXAM_TYPES.INSTITUTIONAL)[keyof typeof EXAM_TYPES.INSTITUTIONAL],
      year: "",
      semester: "",
      tags: "",
      branch: "",
      subjectCode: "",
      subjectName: "",
      institution: "",
      file: new File([], ""),
    },
  });
  const [components, setComponents] = useState<ReactElement[]>([]);
  const { currentStepIndex, lastIndex, componentToRender, next, back, goTo } =
    useMultiStepForm(components);
  const [filesInfo, setFilesInfo] = useState<TUploadFile[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const exam = formProps.watch("examType");
    const multiStepComponent = getMultiStepComponents(
      exam,
      formProps.control
    ) as ReactElement[];

    setComponents(() => [
      <FileUpload control={formProps.control} key="file_upload" />,
      ...multiStepComponent,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formProps.watch("examType")]);

  const handleFormSubmit = async (values: TUploadFile) => {
    filesInfo.push(values);
    const formdata = new FormData();

    filesInfo.forEach((details, index) => {
      Object.entries(details).forEach(([key, value]) => {
        formdata.append(`${key}:${index}`, value);
      });
    });

    const res = await uploadfileAction(formdata);

    if (res.hasError) {
      setError(res.message as string);
      return;
    }
    setFilesInfo([]);
    goTo(0);
    formProps.reset();
  };

  const handleAnotherFileEvent = (values: TUploadFile) => {
    if (filesInfo.length === MAX_LENGTH_OF_FILES_INFO_ARRAY) return;
    setFilesInfo((prevInfo) => [...prevInfo, values]);
    goTo(0);
    formProps.reset();
  };

  return (
    <Form {...formProps}>
      <form onSubmit={formProps.handleSubmit(handleFormSubmit)}>
        {componentToRender}
        {currentStepIndex === 0 && (
          <div>
            <Button type="button" onClick={next}>
              Next
            </Button>
          </div>
        )}
        {currentStepIndex !== 0 && currentStepIndex !== lastIndex && (
          <div>
            <Button type="button" onClick={back}>
              Previous
            </Button>
            <Button type="button" onClick={next}>
              Next
            </Button>
          </div>
        )}
        {currentStepIndex === lastIndex && (
          <div>
            {error.length > 0 && <div>{error}</div>}
            <Button type="button" onClick={back}>
              Previous
            </Button>
            <Button
              type="submit"
              onClick={formProps.handleSubmit(handleAnotherFileEvent)}
              disabled={filesInfo.length + 1 === MAX_LENGTH_OF_FILES_INFO_ARRAY}
            >
              Add another file
            </Button>
            <Button type="submit">
              {formProps.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
