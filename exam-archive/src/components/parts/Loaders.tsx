import { useEffect, useState,CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

export default function Loader(){
    return(
        <ClipLoader className=" flex justify-center items-center"
    color="#ffffff"
    // loading={loading}
    cssOverride={override}
    size={150}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
    )
}