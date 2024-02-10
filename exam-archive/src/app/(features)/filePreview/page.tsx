"use client";
import { getPostInfo } from "@/actions/filePreview/data/GET/getPostInfo";
import { useEffect, useState,CSSProperties } from "react";
import PdfViewer from "@/components/parts/PdfViewer";
import { updateNoOfViews } from "@/actions/filePreview/data/UPDATE/updateNoOfViews";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ClipLoader from "react-spinners/ClipLoader";
import mongoose from "mongoose"; // Import mongoose if not already imported
import Discuss from "@/components/parts/Discuss"

import Loader from "@/components/parts/Loaders";



const filePreviewPage = ({ postId, userId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  postId="65c71559efffa87c4299992e"
  userId = "65be04e59c987a439e5fbf77"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fileInfo = await getPostInfo({
          postId: postId,
          userId: userId,
        });

        const parsedData = JSON.parse(fileInfo.docInfo);
        console.log(parsedData);

        setData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching PDF info:", error);
        setLoading(false);
      }
    };

    fetchData();
    updateNoOfViews(postId, userId); 

  }, []);

  if (loading) {
    return (
      <Loader />
    )
  } else {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          File Preview Page
        </h1>

        <div className="flex justify-center mb-8">
          <PdfViewer url={data.file.url} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className=" text-center">PDF Information</CardTitle>
          </CardHeader>
        </Card>

        <div className="mt-8">
          {/* <h2 className="text-2xl font-bold mb-4 text-center">
            Discussion Forum
          </h2> */}
         <Discuss />
        </div>
      </div>
    );
  }
};

export default filePreviewPage;



// {_id: '65b1665f17a88a562246c777', uploaded_by: null, year: '2024', exam_type: 'Midsem', tags: Array(11), …}
// branch
// : 
// "CSE"
// createdAt
// : 
// "2024-01-09T12:47:59.434Z"
// exam_type
// : 
// "Midsem"
// filename
// : 
// {url: 'https://res.cloudinary.com/dzorpsnmn/image/upload/…72luie:ARCHIVE/1704804469848_college_fees.pdf.pdf'}
// institution_name
// : 
// "NITK"
// rating
// : 
// (3) [{…}, {…}, {…}]
// semester
// : 
// "III"
// subject_code
// : 
// "MA609"
// subject_name
// : 
// "Operating Systems"
// tags
// : 
// (11) ['Operating Systems', 'Paging', 'Segmentation', 'Paging', 'Segmentation', 'Paging', 'Segmentation', 'Paging', 'Segmentation', 'paging', 'segmentation']
// updatedAt
// : 
// "2024-01-26T20:27:06.482Z"
// uploaded_by
// : 
// null
// year
// : 
// "2024"
// _id
// : 
// "65b1665f17a88a562246c777"
// [[Prototype]]
// : 
// Object