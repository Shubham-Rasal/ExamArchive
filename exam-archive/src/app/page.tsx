// "use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";

interface Paper {
  title: string;
  year: number;
  institution: string;
  term: string;
  id: string;
}

async function getPapers(): Promise<Paper[]> {
  try {
    const result = await fetch("http://localhost:5000/papers");
    console.log(result);

    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// function handleFilter(e: any){
//   e.preventDefault();

// }

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  console.log(e.currentTarget); // Using currentTarget instead of target
};



export default async function SearchPage(): Promise<JSX.Element> {
  const papers = await getPapers();

  // const [name,setName]=useState("")
  // const [institution,setInstitution]=useState("")
  // const [year,setYear]=useState(0)
  // const [term,setTerm]=useState("")
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-10">
      <div className="w-full p-4 space-x-2">
        <div className="flex justify-center space-x-2">
          <Input className="w-100 px-4 py-2 text-lg rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Most Viewed</DropdownMenuItem>
                <DropdownMenuItem>Most Rated</DropdownMenuItem>
                <DropdownMenuItem>Most Downloaded</DropdownMenuItem>
                <DropdownMenuItem>Recently Uploaded</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="text-lg rounded-full bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition duration-300"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="relative">
          <h1 className="text-center p-4">Paper Filters</h1>

          {/* Paper Name Filter */}
          <div className="m-6 p-2  rounded-full">
            <Label className="m-6"  >Paper Name</Label>
            <Input
              className="w-50 m-4 text-lg rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
              
              placeholder="Add paper name"
            />
          </div>

          {/* Institute Name Filter */}
          <div className="m-6 p-2  rounded-full">
            <Label className="m-6">Institute Name</Label>
            <Input
              className="w-50 m-4 text-lg rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Add Institute name"
            />
          </div>

          {/* Year Filter */}
          <div className="m-6 p-2  rounded-full">
            <Label className="m-6">Year</Label>
            <Input
              className="w-50 m-4 text-lg rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Add Year"
            />
          </div>

          {/* Term Filter */}
          <div className="m-6 p-2 rounded-full">
            <Label className="m-6">Term</Label>
            <Input
              className="w-50 m-4 text-lg rounded-full border border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Add Term"
            />
          </div>
          <Button className=" m-6 p-2 rounded-full flex justify-center" >Apply</Button>
        </div>

        {/* Displaying Papers */}
        <div className="grid grid-cols-3 gap-8 p-4">
          {papers.map((paper) => (
            <Card
              key={paper.id}
              className="flex flex-col justify-between p-4 rounded-lg shadow-md"
            >
              <div className="flex-row gap-4 items-center">
                <div>
                  <h2 className="text-lg font-semibold">{paper.title}</h2>
                  <p className="text-sm text-gray-500">{paper.year}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-700">{paper.institution}</p>
                <p className="text-gray-700">{paper.term}</p>
              </div>

              <div className="flex justify-between mt-2">
                <button className="text-blue-500 hover:underline focus:outline-none">
                  View Paper
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
