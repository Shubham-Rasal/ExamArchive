"use client";
import React from 'react';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  url: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="w-screen">
      <div className="w-6/7">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PdfViewer;