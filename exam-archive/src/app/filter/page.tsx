"use client"
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
interface FilterData {
  institute_name: string;
  year: string;
  exam_name: string;
  category: string;
  location: string;
}

interface FilterProps {
  handleChanger: (data: FilterData) => void;
}

export default function Filter(props: FilterProps): JSX.Element {
    const router = useRouter();
  const [data, setData] = useState<FilterData>({
    institute_name: "",
    year: "",
    exam_name: "",
    category: "",
    location: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(data)

      props.handleChanger(data);
    
    router.push("/");
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Filter
        </h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Institute Name:</label>
          <input
            type="text"
            name="institute_name"
            value={data.institute_name}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-800"
            placeholder="Enter Institute Name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Year:</label>
          <input
            type="text"
            name="year"
            value={data.year}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-800"
            placeholder="Enter Year"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Exam Name:</label>
          <input
            type="text"
            name="exam_name"
            value={data.exam_name}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-800"
            placeholder="Enter Exam Name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Category:</label>
          <input
            type="text"
            name="category"
            value={data.category}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-800"
            placeholder="Enter Category"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Location:</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-800"
            placeholder="Enter Location"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
