// Import necessary components and styles
// Import necessary components and styles
"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

// Main Upload component
export default function Upload(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);
  const [progress, setProgress] = useState(0);
  const [examInfo, setExamInfo] = useState<string>("");

  // Function to handle file change
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        setFileSizeError(true);
        return;
      }

      setFileSizeError(false);
      setSelectedFile(file);
      setName(file.name);
      setSize(file.size);
      setProgress(50);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFileSizeError(false);
    setName("");
    setProgress(0);
  };

  const handleNext = () => {
    if (currentPage === 1 && selectedFile && !fileSizeError) {
      setCurrentPage(2);
    }
  };

  const handleBefore = () => {
    if (currentPage === 2) {
      setCurrentPage(1);
    }
  };

  // Function to handle exam selection
  const handleExamSelect = (value: string) => {
    console.log("hello")
    setExamInfo(value);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-center text-3xl font-bold mb-8">Upload File</h1>

      {currentPage === 1 && (
        <div className="mb-8">
          <Label className="mb-4 text-lg font-semibold">Upload File</Label>
          <Input type="file" onChange={handleFileChange} className="mb-4" />
          {fileSizeError && (
            <p className="text-red-500">File size exceeds 5MB limit</p>
          )}

          {/* File preview */}
          {selectedFile && (
            <div>
              <Label>FileName</Label>
              <h3>{name}</h3>
              <Label>FileSize</Label>
              <h3>{(size / 1024).toFixed(2)} KB</h3>
              <Select >
                <SelectTrigger className="w-[180px] mt-4">
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent >
                <SelectGroup onChange={(selectedValue:any) => setExamInfo(selectedValue)}>
  <SelectLabel>Exams</SelectLabel>
  <SelectItem value="University/College">University/College</SelectItem>
  <SelectItem value="GATE">GATE</SelectItem>
  <SelectItem value="JEE Mains">JEE Mains</SelectItem>
  <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
  <SelectItem value="NEET">NEET</SelectItem>
</SelectGroup>
                </SelectContent>
              </Select>
              <div className="mt-6 space-x-2">
                <Button
                  onClick={handleCancelUpload}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Cancel Upload
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          <Progress value={progress} className="w-[60%] mb-4 mt-10" />
        </div>
      )}

      {currentPage === 2 && (
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Page 2 Content</h2>
          {examInfo === "University/College" && (
            <div>
              <Label>University/College Info</Label>
              <Input
                type="text"
                placeholder="Enter University/College Info"
                onChange={(e) => setExamInfo(e.target.value)}
                className="mb-4"
              />
            </div>
          )}

          {examInfo === "GATE" && (
            <div>
              <Label>GATE Info</Label>
              <Input
                type="text"
                placeholder="Enter GATE Info"
                onChange={(e) => setExamInfo(e.target.value)}
                className="mb-4"
              />
            </div>
          )}

          <div className="mt-6 space-x-2">
            <Button
              onClick={handleBefore}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Next
            </Button>
          </div>
          <Progress value={progress} className="w-[60%] mb-4 mt-6" />
        </div>
      )}

      {currentPage === 3 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Page 3 Content</h2>
          <Label>File Name</Label>
          <h3>{name}</h3>
          <Label>File Size</Label>
          <h3>{(size / 1024).toFixed(2)} KB</h3>
          <Label>Exam Info</Label>
          <h3>{examInfo}</h3>
          {/* Add relevant form fields, buttons, etc. */}
        </div>
      )}
    </div>
  );
}
