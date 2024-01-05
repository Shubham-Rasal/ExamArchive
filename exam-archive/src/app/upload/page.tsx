"use client"
import { useState } from "react";

interface Data {
  file: File;
  name: string;
  institution: string;
  year: number;
}

export default function Upload(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [year, setYear] = useState<number>();
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileData, setFileData] = useState<Data[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUploadClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files) {
      const newData: Data[] = Array.from(files).map((file) => ({
        file,
        name,
        institution,
        year: year || 0,
      }));
      setFileData((data) => [...data, ...newData]);
    }
    setFiles(null);
    setName("");
    setInstitution("");
    setYear(undefined);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstitution(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(e.target.value));
  };

  const handleDelete = (index: number) => {
    const updatedData = [...fileData];
    updatedData.splice(index, 1);
    setFileData(updatedData);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    console.log(fileData);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white py-8">
      <h1 className="text-3xl text-cyan-300 mb-8 font-bold">Upload Files/Folder Page</h1>
      <form onSubmit={handleUploadClick} className="w-full max-w-lg bg-gray-700 p-6 rounded-lg shadow-md">
        <label className="block mb-2 text-cyan-300">Name of the Paper</label>
        <input
          type="text"
          className="border rounded px-3 py-2 mb-3 w-full bg-gray-900 text-white"
          value={name}
          onChange={handleNameChange}
        />

        <label className="block mb-2 text-cyan-300">Institution</label>
        <input
          type="text"
          className="border rounded px-3 py-2 mb-3 w-full bg-gray-900 text-white"
          value={institution}
          onChange={handleInstitutionChange}
        />

        <label className="block mb-2 text-cyan-300">Year</label>
        <input
          type="number"
          className="border rounded px-3 py-2 mb-6 w-full bg-gray-900 text-white"
          value={year || ""}
          onChange={handleYearChange}
        />

        <label className="block mb-2 text-cyan-300">Browse</label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-full block mb-4"
        >
          Add
        </button>
      </form>
      <div className="w-full max-w-lg bg-gray-700 p-6 rounded-lg shadow-md mt-6">
        {fileData.map((file, index) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <span>{`${file.name} `}</span>
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300 ease-in-out"
            >
              Delete
            </button>
          </div>
        ))}
        {fileData.length > 0 && (
          <div className="flex justify-between">
            <button onClick={handleClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-1/2 mb-2 mr-2">
              Upload
            </button>
            <button onClick={handleClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out w-1/2 mb-2 ml-2">
              BookMark as folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
