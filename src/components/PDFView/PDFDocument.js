import { Document } from "@react-pdf/renderer";
import React from "react";
import PDFView from "./PDFView";

const PDFDocument = ({ customerDetails1 }) => {
  return (
    <Document>
      <PDFView customerDetails1={customerDetails1} />
    </Document>
  );
};

export default PDFDocument;
