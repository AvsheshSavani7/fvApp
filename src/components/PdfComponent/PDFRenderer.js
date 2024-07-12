import React, { useImperativeHandle } from "react";
import CustomerDetailsNew from "./customerDetailsNew";
import ProjectScopeNew from "./ProjectScopeNew";
import RefinishingCheckListPdfNew from "./RefinishingCheckListPdfNew";
import ExistingMaterialPdfNew from "./ExistingMaterialPdfNew";
import MoldingPdfNew from "./MoldingPdfNew";
import SubFloorPdfnew from "./SubFloorPdfNew";
import MatchingRefinishingPdfNew from "./MatchingRefinishingPdfNew";
import LevelingCheckListPdfNew from "./LevelingCheckListPdfNew";
import RepairPdfNew from "./RepairPdfNew";
import StaircasePdfNew from "./StaircasePdfNew";
import TransitionPdfNew from "./TransitionPdfNew";
import MatchingInstallationPdfNew from "./MatchingInstallationPdfNew";
import _ from "lodash";
import ProjectScopeinDetail from "./ProjectScopeinDetail";
import SpecialItemsNew from "./SpecialItemsNew";
import FloorPlan from "./FloorPlan";
import axios from "axios";

const PDFRenderer = React.forwardRef((props, ref) => {
  const {
    customerDetails1,
    floorPlan,
    setLoading,
    setMessage,
    setOpen,
    setType,
  } = props;

  const downloadPdf = async () => {
    setLoading(true);
    let customerName = customerDetails1?.customer_name?.replace(/\s+/g, "");
    const oldHtml = document.documentElement.outerHTML;
    const dom = `<!DOCTYPE html>${oldHtml}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(dom, "text/html");

    const appContainer = doc.getElementById("App");
    const pdfRootContainer = doc.getElementById("pdf-root-container");

    if (appContainer) {
      appContainer.style.overflow = "auto";
      appContainer.style.textAlign = "center";
      appContainer.classList.remove("App");
    }

    if (pdfRootContainer) {
      pdfRootContainer.style.height = "100%";
      pdfRootContainer.classList.remove("h-[90vh]");
    }

    const buttonToRemove = doc.querySelector("#pdfbutton");

    // Remove the button if found
    if (buttonToRemove) {
      buttonToRemove.parentNode.removeChild(buttonToRemove);
    }

    const html = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;

    try {
      const response = await axios.post(
        "https://api.pdfshift.io/v3/convert/pdf",
        {
          source: html,
          margin: {
            top: "10px",
            right: "10px",
            bottom: "10px",
            left: "10px",
          },
        },
        {
          auth: {
            username: "api",
            password: process.env.REACT_APP_PDFSHIFT_API_KEY,
          },
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200) {
        // Convert arrayBuffer to blob (response.data must be an array buffer)
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${customerName}.pdf`;

        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link from the document
        document.body.removeChild(link);
        setOpen(true);
        setType("success");
        setMessage("Pdf downloaded successfully!!");
      } else {
        setOpen(true);
        setType("error");
        setMessage(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      setOpen(true);
      setType("error");
      setMessage(error?.message || "Something went wrong");
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    downloadPdf,
  }));

  return (
    <div>
      <CustomerDetailsNew customerDetails1={customerDetails1} />
      <ProjectScopeNew customerDetails1={customerDetails1} />
      {_.size(floorPlan) > 0 && <FloorPlan floorPlan={floorPlan} />}
      <RefinishingCheckListPdfNew customerDetails1={customerDetails1} />
      <ExistingMaterialPdfNew customerDetails1={customerDetails1} />
      <SubFloorPdfnew customerDetails1={customerDetails1} />
      <MoldingPdfNew customerDetails1={customerDetails1} />
      <MatchingRefinishingPdfNew customerDetails1={customerDetails1} />
      <MatchingInstallationPdfNew customerDetails1={customerDetails1} />
      <LevelingCheckListPdfNew customerDetails1={customerDetails1} />
      {
        customerDetails1?.fv_data?.scope?.is_repair &&
        <RepairPdfNew customerDetails1={customerDetails1} />
      }
      {
        customerDetails1?.fv_data?.scope?.is_staircase &&
        <StaircasePdfNew customerDetails1={customerDetails1} />
      }
      {
        customerDetails1?.fv_data?.scope?.is_transition &&
        <TransitionPdfNew customerDetails1={customerDetails1} />
      }
      <ProjectScopeinDetail customerDetails1={customerDetails1} />
      <SpecialItemsNew customerDetails1={customerDetails1} />
    </div>
  );
});

export default PDFRenderer;
