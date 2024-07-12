import React, { useEffect } from "react";
import _ from "lodash";
import GlobalRemainingContent from "./GlobalRemainingContent";
import NewRemainingCustomerDetails from "./NewRemainingCustomerDetails";
import { mandateBuildingTypeFilledOut } from "../../../utils/getRemainingMandatoryFields";
import NewRemainingProjectScope from "./NewRemainingProjectScope";
import NewRemainingnRepair from "./NewRemainingnRepair";
import RemainingFurniture from "./RemainingFurniture";
import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";

const ActiobButton = styled(Button)(() => ({
  fontWeight: 500,
  border: "1px solid #1e2e5a",
}));

const GlobalRemainingDetails = ({
  remainingQueObj,
  updatedSingleCustomerData,
  customerDetailsObj,
  projectScopeObj,
  onClose,
  submitDataToZoho,
  Title,
}) => {
  const mandatoryQues = React.useMemo(() => {
    const filteredMandatoryQuesObj = _.pickBy(
      remainingQueObj.mandatory,
      (value) => !_.isEmpty(value)
    );
    return filteredMandatoryQuesObj;
  }, [remainingQueObj]);

  const importantQues = React.useMemo(() => {
    const filteredImportantQuesObj = _.pickBy(
      remainingQueObj.important,
      (value) => !_.isEmpty(value)
    );
    return filteredImportantQuesObj;
  }, [remainingQueObj]);

  let oneIsExist = React.useMemo(() => {
    const refinishingChecklistlIsPart =
      updatedSingleCustomerData?.scope?.refinishing?.is_part;
    const installationIsPart =
      updatedSingleCustomerData?.scope?.installation?.is_part;

    if (refinishingChecklistlIsPart || installationIsPart) {
      return true;
    } else {
      return false;
    }
  }, [updatedSingleCustomerData]);

  const getMandateFilledoutForBuildingType = React.useCallback(
    (type) => {
      if (customerDetailsObj.hasOwnProperty("Building Type")) {
        if (typeof customerDetailsObj["Building Type"] === "object") {
          const isValid = mandateBuildingTypeFilledOut(
            customerDetailsObj,
            type
          );
          return isValid;
        } else {
          return false;
        }
      } else if (
        type === "important" &&
        (customerDetailsObj.hasOwnProperty("Address") ||
          customerDetailsObj.hasOwnProperty("Email"))
      ) {
        return false;
      } else {
        return true;
      }
    },
    [customerDetailsObj]
  );

  const isBuildingTypeMandateFilledout = React.useMemo(() => {
    return getMandateFilledoutForBuildingType("mandatory");
  }, [customerDetailsObj]);

  const isBuildingTypeImportantFilledout = React.useMemo(() => {
    return getMandateFilledoutForBuildingType("important");
  }, [customerDetailsObj]);

  const { inValidRepairs, isValidRepairForm } = React.useMemo(() => {
    const inValidRepairs = [];
    let isValidRepairForm = true;
    const repairs = updatedSingleCustomerData?.repairs;

    if (repairs?.length > 0) {
      for (const checklistItem of repairs) {
        if (
          checklistItem?.repair_description === "" ||
          checklistItem?.images?.length === 0
        ) {
          isValidRepairForm = false;
          break;
        }
      }
    }

    if (repairs?.length > 0) {
      repairs?.map((repair, idx) => {
        if (
          repair?.within_room_id === "" &&
          repair?.within_staircase_id === ""
        ) {
          let rpr = `repair ${idx + 1}`;
          inValidRepairs?.push(rpr);
        }
      });
    }

    return { inValidRepairs, isValidRepairForm };
  }, [updatedSingleCustomerData]);

  const importantRenderCondition =
    _.size(mandatoryQues || {}) === 0 &&
    isValidRepairForm &&
    inValidRepairs.length === 0 &&
    isBuildingTypeMandateFilledout &&
    oneIsExist;

  const allFilledOut =
    importantRenderCondition &&
    isBuildingTypeImportantFilledout &&
    _.size(importantQues || {}) === 0 &&
    oneIsExist;

  useEffect(() => {
    if (importantRenderCondition) {
      submitDataToZoho();
    }
  }, []);

  return (
    <>
      <div>
        {!importantRenderCondition ? (
          <Title>Below fields are mandatory and not filled out</Title>
        ) : !allFilledOut ? (
          <Title>
            Below fields are important and not filled out, even the data is
            being pushed to the zoho!
          </Title>
        ) : (
          <Title>All fields are filled out.</Title>
        )}
      </div>
      <div
        style={{
          maxHeight: "calc(100vh - 255px)",
          overflowY: "auto",
          margin: "10px 0",
          padding: "10px 20px",
        }}
      >
        {(!isBuildingTypeMandateFilledout || !oneIsExist) && (
          <NewRemainingCustomerDetails
            singleCustomerData={updatedSingleCustomerData}
            customerDetailsObj={customerDetailsObj}
            mode="mandatory"
            oneIsExist={oneIsExist}
          />
        )}
        {importantRenderCondition && !isBuildingTypeImportantFilledout && (
          <NewRemainingCustomerDetails
            singleCustomerData={updatedSingleCustomerData}
            customerDetailsObj={customerDetailsObj}
            mode="important"
            oneIsExist={oneIsExist}
          />
        )}
        <NewRemainingProjectScope
          singleCustomerData={updatedSingleCustomerData}
          projectScopeObj={projectScopeObj}
        />

        {mandatoryQues && _.size(mandatoryQues) > 0 ? (
          <GlobalRemainingContent clObject={mandatoryQues} />
        ) : _.size(importantQues) > 0 && importantRenderCondition ? (
          <GlobalRemainingContent clObject={importantQues} />
        ) : (
          <></>
        )}

        {(inValidRepairs.length > 0 || !isValidRepairForm) && (
          <NewRemainingnRepair
            singleCustomerData={updatedSingleCustomerData}
            inValidRepairs={inValidRepairs}
            isValidRepairForm={isValidRepairForm}
          />
        )}

        {importantRenderCondition && (
          <RemainingFurniture singleCustomerData={updatedSingleCustomerData} />
        )}
      </div>
      <div className="flex justify-end gap-2 p-4">
        <ActiobButton color="inherit" onClick={onClose}>
          Ok
        </ActiobButton>
      </div>
    </>
  );
};

export default GlobalRemainingDetails;
