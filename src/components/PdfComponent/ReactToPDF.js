import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { useParams } from "react-router-dom";
import { getAuth } from "../../services/identity.service";
import MuiSnackbar from "../UI/MuiSnackbar";
import _ from "lodash";
import { CircularProgress } from "@mui/material";
import PDFRenderer from "./PDFRenderer";
import { useSelector } from "react-redux";

const ReactToPDF = ({ customerDetails1, floorPlan, apiLoading }) => {
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [delayedTrue, setDelayedTrue] = React.useState(false);

  const pdfRef = React.useRef(null);
  const params = useParams();
  const auth = getAuth();

  const allLoadedImagesSrc = useSelector(
    (state) => state.customerReducer.allLoadedImagesSrc
  );
  const allImagesSrc = useSelector(
    (state) => state.customerReducer.allImagesSrc
  );
  const isImagesExist = useSelector(
    (state) => state.customerReducer.isImagesExist
  );

  const allImageLoaded = React.useMemo(() => {
    if (isImagesExist) {
      if (allImagesSrc.length === allLoadedImagesSrc.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return delayedTrue;
    }
  }, [allLoadedImagesSrc, allImagesSrc, isImagesExist, delayedTrue]);

  useEffect(() => {
    if (apiLoading || loading || !allImageLoaded) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots === "..." ? "" : prevDots + "."));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [loading, apiLoading, allImageLoaded]);

  useEffect(() => {
    let timeoutId;
    if (!isImagesExist) {
      // Set delayedTrue to true after 6 seconds
      timeoutId = setTimeout(() => {
        setDelayedTrue(true);
      }, 6000);
    }

    return () => clearTimeout(timeoutId);
  }, [isImagesExist]);

  // OLD PDF DOWNLOAD FUNCTION
  // const handlePDFdownload = async () => {
  //   setLoading(true);
  //   const response = await downloadPDF(params?.customerId, auth?.token);
  //   if (response?.data?.status) {
  //     const pdfurl = response?.data?.entity;
  //     let trimedName = customerDetails1?.customer_name?.replace(/\s+/g, "");
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);

  //     if (pdfurl) {
  //       const link = document.createElement("a");
  //       link.href = pdfurl;
  //       link.setAttribute("download", `${trimedName}.pdf`);
  //       link.style.display = "none"; // Hide the link
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } else {
  //       setOpen(true);
  //       setMessage(response?.data?.message || "Something went wrong");
  //       setType("error");
  //       setTimeout(() => {
  //         setOpen(true);
  //       }, 2000);

  //       console.error("PDF URL is missing in the response.");
  //     }
  //   } else {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //     setOpen(true);
  //     setMessage(response?.data?.message || "Something went wrong");
  //     setType("error");

  //     setTimeout(() => {
  //       setOpen(true);
  //     }, 2000);

  //     console.error("Failed to generate PDF");
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className="flex justify-start  flex-col items-center h-[90vh] pt-3 overflow-y-auto"
      id="pdf-root-container"
    >
      <MuiSnackbar
        open={open}
        message={message || ""}
        type={type || ""}
        onClose={handleClose}
      />
      <div className="flex justify-start pb-4">
        <Button
          id="pdfbutton"
          className=" py-2 px-4 bg-white text-black text-md rounded-md shadow-md"
          onClick={() => {
            pdfRef.current.downloadPdf();
          }}
          // onClick={handlePDFdownload}
          disabled={apiLoading || loading || !allImageLoaded}
        >
          {apiLoading || loading || !allImageLoaded
            ? `Loading${dots}`
            : "Download PDF"}
        </Button>
      </div>
      <div className="p-4 shadow-md rounded-lg border-gray bg-white w-[794px] overflow-y-auto">
        {apiLoading || _.size(customerDetails1) === 0 ? (
          <div className="flex justify-center items-center h-[670px]">
            <CircularProgress size={30} />
          </div>
        ) : (
          <PDFRenderer
            ref={pdfRef}
            customerDetails1={customerDetails1}
            floorPlan={floorPlan}
            setLoading={setLoading}
            setMessage={setMessage}
            setOpen={setOpen}
            setType={setType}
          />
        )}
      </div>
    </div>
  );
};

export default ReactToPDF;
