import React from "react";
import PropTypes from "prop-types";
import Text from "../UI/Text";
import Button from "../UI/Button";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "../PDFView/PDFDocument";
import CustomerDetails from "./CustomerDetails";
import ProjectScope from "./ProjectScope";

const CustomerDetailsPDF = ({ customerDetails1 }) => {
  return (
    <>
      <div className="flex justify-start space-y-4 flex-col items-center h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <PDFDownloadLink
            document={<PDFDocument customerDetails1={customerDetails1} />}
            fileName={`${customerDetails1?.customer_name}-details.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <Button className=" py-2 px-4 bg-white text-black text-md rounded-md shadow-md">
                {loading ? "Loading..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
        {/* <div className="p-8 shadow-md rounded-lg border-gray bg-white w-10/12">
          <CustomerDetails customerDetails1={customerDetails1} />
          <ProjectScope customerDetails1={customerDetails1} />
        </div> */}
        <PDFViewer width="100%" height="600" className="px-20">
          <PDFDocument customerDetails1={customerDetails1} />
        </PDFViewer>
      </div>
    </>
  );
};

export default CustomerDetailsPDF;

CustomerDetailsPDF.propTypes = {
  customerDetails: PropTypes.object,
};
