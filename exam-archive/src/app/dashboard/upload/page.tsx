"use client";
import { ChangeEvent, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { handleUpload } from "./_action";
import { examNames } from "@/helpers/examNames";
import { EXAM_TYPES } from "@/constants/constants";

export interface IForm {
  id: string | null;
  tag: string;
  file: File | null;
  year: string;
  examType: string;
  semester?: string;
  branch?: string;
  subjectName?: string;
  subjectCode?: string;
  institution?: string;
}

type TFormValueType = NonNullable<IForm[keyof IForm]>;

const initialValue: IForm = {
  tag: "",
  file: null,
  id: null,
  year: String(new Date().getFullYear()),
  examType: examNames(EXAM_TYPES)[0],
};

const MAX_INDEX = 4;

export default function Upload() {
  const [fileDetails, setFileDetails] = useState<IForm>(initialValue);
  const [fileArray, setFileArray] = useState<IForm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<number>(1);

  const inputFileField = useRef<HTMLInputElement>(null);

  const { pending } = useFormStatus();

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    fileDetails.id === null
      ? setFileDetails((prevState) => ({
          ...prevState,
          [event.target.name]:
            event.target.name === "file"
              ? (event.target.files as FileList)[0]
              : event.target.value,
          id: String(new Date().getTime()),
        }))
      : setFileDetails((prevState) => ({
          ...prevState,
          [event.target.name]:
            event.target.name === "file"
              ? (event.target.files as FileList)[0]
              : event.target.value,
        }));
  };

  const addAnotherFile = () => {
    if (index > MAX_INDEX) return;
    setFileArray((prevState) => [...prevState, fileDetails]);
    setFileDetails(initialValue);
    setIndex((prevIndex) => prevIndex + 1);
  };

  const deleteFile = () => {
    (inputFileField.current as HTMLInputElement).value = "";
    setFileDetails((prevState) => ({ ...prevState, file: null }));
  };

  async function handleSubmit() {
    fileArray.push(fileDetails);

    const formdata = new FormData();

    fileArray.forEach((details, index) => {
      Object.entries(details).forEach(
        ([key, value]: [string, TFormValueType]) => {
          formdata.append(`${key}:${index}`, value);
        }
      );
    });

    try {
      const res = await handleUpload(formdata);
      if (JSON.parse(res).isError === true)
        throw new Error("Something went wrong. Please try again later");
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError(null);
    (inputFileField.current as HTMLInputElement).value = "";
    setFileDetails(initialValue);
    setFileArray([]);
  }

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        value={fileDetails.tag as string}
        onChange={handleInput}
        name="tag"
      />
      <br />
      <input
        type="file"
        name="file"
        onChange={handleInput}
        accept="pdf"
        ref={inputFileField}
      />
      <button type="button" onClick={deleteFile}>
        Delete file
      </button>
      <br />
      <br />
      {error !== null && <div>{error}</div>}
      <input
        type="reset"
        value="Add another file?"
        onClick={addAnotherFile}
        disabled={index > MAX_INDEX}
        aria-disabled={index > MAX_INDEX}
      />
      <button type="submit" disabled={pending} aria-disabled={pending}>
        {pending ? `Submitting...` : `Submit`}
      </button>
    </form>
  );
}
