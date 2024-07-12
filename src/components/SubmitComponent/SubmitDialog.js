import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import RemainingCustomerDetails from "./Remainings/RemainingCustomerDetails";
import RemainingProjectScope from "./Remainings/RemainingProjectScope";
import RemainingChecklist from "./Remainings/RemainingChecklist";
import RemainingFloorDetails from "./Remainings/RemainingFloorDetails";
import RemainingFurniture from "./Remainings/RemainingFurniture";
import RemainingnMatching from "./Remainings/RemainingnMatching";
import RemainingnLeveling from "./Remainings/RemainingnLeveling";
import RemainingnRepair from "./Remainings/RemainingnRepair";
import RemainingnStaircase from "./Remainings/RemainingnStaircase";
import RemainingnTransition from "./Remainings/RemainingnTransition";

const CustomDialog = styled(Dialog)(({ updatednotfilledoutbtns }) => ({
  "& .MuiDialog-paper": {
    visibility: updatednotfilledoutbtns.length === 0 ? "hidden" : "visible",
    overflow: "visible !important",
    minWidth: "600px",
    display: "flex",
    justifyContent: "start",
  },
}));

const Title = styled(DialogTitle)(() => ({
  color: "black",
  fontWeight: 600,
  textAlign: "center",
  fontSize: "22px",
  borderBottom: "1px solid gray",
  marginBottom: "10px",
}));

const CancleBtton = styled(Button)(() => ({
  color: "black",
  fontWeight: 500,
  border: "1px solid #1e2e5a",
}));

const Buttons = styled(DialogActions)(() => ({
  margin: "5px 10px",
}));

const SubmitDialog = ({
  open,
  onClose,
  customerDetailsObj,
  projectScopeObj,
  singleCustomerData,
  updatedNotFilledOutBtns,
}) => {
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );

  return (
    <>
      <CustomDialog
        open={open}
        onClose={onClose}
        updatednotfilledoutbtns={updatedNotFilledOutBtns}
      >
        {notFilledOutBtns?.length > 0 ? (
          <Title>Below fields are mandatory and not filled out</Title>
        ) : (
          <Title>All fields are filled out.</Title>
        )}
        <DialogContent>
          <div className="">
            <div className="my-1">
              <RemainingCustomerDetails
                customerDetailsObj={customerDetailsObj}
                singleCustomerData={singleCustomerData}
              />
            </div>
            <div className="my-4">
              {(!projectScopeObj.floorExist ||
                !projectScopeObj.roomExist ||
                !projectScopeObj.imageExist ||
                !projectScopeObj.dimesionExist) && (
                <RemainingProjectScope
                  projectScopeObj={projectScopeObj}
                  singleCustomerData={singleCustomerData}
                />
              )}
            </div>
            <div className="my-4">
              <RemainingChecklist singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingFloorDetails singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingFurniture singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingnMatching singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingnLeveling singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingnRepair singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingnStaircase singleCustomerData={singleCustomerData} />
            </div>
            <div className="my-4">
              <RemainingnTransition singleCustomerData={singleCustomerData} />
            </div>
          </div>
        </DialogContent>
        <Buttons>
          <CancleBtton onClick={onClose} color="primary">
            OK
          </CancleBtton>
        </Buttons>
      </CustomDialog>
    </>
  );
};

export default SubmitDialog;

SubmitDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  customerDetailsObj: PropTypes.object,
  projectScopeObj: PropTypes.object,
  singleCustomerData: PropTypes.object,
};
