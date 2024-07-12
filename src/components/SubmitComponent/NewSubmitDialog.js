import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "@emotion/styled";
import GlobalRemainingDetails from "./Remainings/GlobalRemainingDetails";

const CustomDialog = styled(Dialog)(({}) => ({
  "& .MuiDialog-paper": {
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

const NewSubmitDialog = ({
  open,
  onClose,
  updatedNotFilledOutBtns,
  remainingQueObj,
  updatedSingleCustomerData,
  customerDetailsObj,
  projectScopeObj,
  submitDataToZoho,
  uploadLoading,
}) => {
  const isMandatoryQuesExist = React.useMemo(() => {
    const check = _.some(remainingQueObj.mandatory, (checklist) => {
      return !_.isEmpty(checklist);
    });
    return check;
  }, [remainingQueObj]);

  const isImportantQuesExist = React.useMemo(() => {
    const check = _.some(remainingQueObj.important, (checklist) => {
      return !_.isEmpty(checklist);
    });
    return check;
  }, [remainingQueObj]);

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      updatednotfilledoutbtns={updatedNotFilledOutBtns}
    >
      <DialogContent sx={{ padding: 0 }}>
        <GlobalRemainingDetails
          Title={Title}
          remainingQueObj={remainingQueObj}
          updatedSingleCustomerData={updatedSingleCustomerData}
          customerDetailsObj={customerDetailsObj}
          projectScopeObj={projectScopeObj}
          onClose={onClose}
          submitDataToZoho={submitDataToZoho}
          uploadLoading={uploadLoading}
        />
      </DialogContent>
    </CustomDialog>
  );
};

export default NewSubmitDialog;

NewSubmitDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  customerDetailsObj: PropTypes.object,
  projectScopeObj: PropTypes.object,
  singleCustomerData: PropTypes.object,
};
