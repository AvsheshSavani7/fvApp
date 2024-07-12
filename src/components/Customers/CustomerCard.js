import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Text from "../UI/Text";
import Image from "../UI/Image";
import Divider from "../UI/Divider";
import { useNavigate } from "react-router-dom";
import { downloadImagesPDF } from "../../services/customers.service";
import { checkIsAdmin, getAuth } from "../../services/identity.service";
import { useDispatch } from "react-redux";
import { setNotFilledOutBtns } from "../../redux/customer";
import { ImportantFieldQues } from "../../utils/importantFields";
import NewSubmitComponent from "../SubmitComponent/NewSubmitComponent";

const CustomerCard = ({
  data,
  setPdfLoader,
  pdfLoader,
  setOpen,
  setMessage,
  setType,
}) => {
  const { name, address, email, mobile, id, ZC_PO_ID, singleCustomerData } =
    data;
  const [updatedSingleCustomerData, setUpdatedSingleCustomerData] = useState(
    {}
  );

  const navigate = useNavigate();
  const auth = getAuth();
  const dispatch = useDispatch();

  const isAdmin = checkIsAdmin();

  const handleImagePdfDownload = async () => {
    setPdfLoader(true);
    const response = await downloadImagesPDF(id, auth?.token);
    if (response?.data?.status) {
      const pdfurl = response?.data?.entity;
      let trimedName = name?.replace(/\s+/g, "");

      if (pdfurl) {
        const link = document.createElement("a");
        link.href = pdfurl;
        link.setAttribute("download", `${trimedName}.pdf`);
        link.style.display = "none"; // Hide the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    setPdfLoader(false);
  };

  const updatedQueWithImportantKey = React.useCallback(
    (allQues) => {
      return allQues?.map((que) => {
        let subQues = [];
        if (que?.subQuestion) {
          subQues = updatedQueWithImportantKey(que?.subQuestion); // recursive call for subQuestions if exists
        }
        if (ImportantFieldQues.includes(que?.question)) {
          return {
            ...que,
            important: true,
            mandatory: false,
            subQuestion: subQues,
          };
        } else {
          return que;
        }
      });
    },
    [data]
  );

  const addImportantKey = React.useCallback(
    (checklist) => {
      return checklist?.map((cl) => ({
        ...cl,
        all_questions: updatedQueWithImportantKey(cl?.all_questions),
      }));
    },
    [data]
  );

  const addImportantKeyInQuestion = React.useCallback(() => {
    const cloneCustomer = _.cloneDeep(singleCustomerData);
    const refCL = cloneCustomer?.refinishing_checklists;
    const extCL = cloneCustomer?.existing_materials;
    const levellingCL = cloneCustomer?.levellings;
    const matchingInsCL = cloneCustomer?.matching_installation_checklists;
    const staircaseCL = cloneCustomer?.staircases;
    const transitionCL = cloneCustomer?.transitions;
    const kitchenFurnitureCL = cloneCustomer?.kitchen_furnitures;
    const specialItemFurnitureCL = cloneCustomer?.specialItem_furnitures;
    const buildingTypeCL = cloneCustomer?.customer?.buildingType?.subQuestion;

    const updatedRefCl = addImportantKey(refCL);
    const updatedExtCl = addImportantKey(extCL);
    const updatedLevellingCl = addImportantKey(levellingCL);
    const updatedMatchingInsCL = addImportantKey(matchingInsCL);
    const updatedstaircaseCL = addImportantKey(staircaseCL);
    const updatedtransitionCL = addImportantKey(transitionCL);
    const updatedKitchenFurnitureCL = addImportantKey(kitchenFurnitureCL);
    const updatedSpecialItemFurnitureCL = addImportantKey(
      specialItemFurnitureCL
    );
    const updatedbuildingTypeCL = updatedQueWithImportantKey(buildingTypeCL);

    cloneCustomer.refinishing_checklists = updatedRefCl || [];
    cloneCustomer.existing_materials = updatedExtCl || [];
    cloneCustomer.levellings = updatedLevellingCl || [];
    cloneCustomer.matching_installation_checklists = updatedMatchingInsCL || [];
    cloneCustomer.staircases = updatedstaircaseCL || [];
    cloneCustomer.transitions = updatedtransitionCL || [];
    cloneCustomer.kitchen_furnitures = updatedKitchenFurnitureCL || [];
    cloneCustomer.specialItem_furnitures = updatedSpecialItemFurnitureCL || [];
    cloneCustomer.customer.buildingType =
      {
        ...cloneCustomer?.customer?.buildingType,
        subQuestion: updatedbuildingTypeCL,
      } || [];

    setUpdatedSingleCustomerData(cloneCustomer);
  }, [data]);

  useEffect(() => {
    if (singleCustomerData) addImportantKeyInQuestion();
  }, [data]);

  return (
    <div className="my-5 relative bg-white w-[262px] h-[175px] rounded-lg border-[2px] pb-[12px] pt-[20px] px-[16px] shadow-md">
      {isAdmin && (
        <div className="absolute -top-5 right-[100px] cursor-pointer">
          <NewSubmitComponent
            singleCustomerData={singleCustomerData}
            updatedSingleCustomerData={updatedSingleCustomerData}
            id={id}
            ZC_PO_ID={ZC_PO_ID}
            setOpen={setOpen}
            setMessage={setMessage}
            setType={setType}
            floors={singleCustomerData?.scope?.floors || []}
          />
          {/* <SubmitComponent
            singleCustomerData={singleCustomerData}
            updatedSingleCustomerData={updatedSingleCustomerData}
            id={id}
            ZC_PO_ID={ZC_PO_ID}
            setOpen={setOpen}
            setMessage={setMessage}
            setType={setType}
          /> */}
        </div>
      )}
      {isAdmin && (
        <div
          className="absolute -top-5 right-[144px] cursor-pointer"
          onClick={pdfLoader ? null : handleImagePdfDownload}
        >
          <Image
            className="rounded-full p-2 border-[1px] bg-white"
            src="/images/image-file.svg"
          />
        </div>
      )}
      <div
        className="absolute -top-5 right-3 cursor-pointer"
        onClick={() => {
          dispatch(setNotFilledOutBtns([]));
          navigate(`/home/${id}`);
        }}
      >
        <Image
          className="rounded-full p-2 border-[1px] bg-white"
          src="/images/view.svg"
        />
      </div>
      {isAdmin && (
        <div
          className="absolute -top-5 right-14 cursor-pointer"
          onClick={() => navigate(`/home/${id}/pdf`)}
        >
          <Image
            className="rounded-full p-2 border-[1px] bg-white"
            src="/images/edit.svg"
          />
        </div>
      )}

      <div className="h-full overflow-y-auto">
        <Text className="font-semibold text-[18px] text-start mb-2">
          {name}
        </Text>
        <div className="flex items-center gap-2">
          <Image src="/images/i-call.svg" />
          <Text className="font-normal text-[12px]">{mobile || "-"}</Text>
        </div>
        <Divider className="my-2" />
        <div className="flex items-center gap-2">
          <Image src="/images/i-mail.svg" />
          <Text className="font-normal text-[12px]">{email || "-"}</Text>
        </div>
        <Divider className="my-2" />
        <div className="flex items-center gap-2">
          <Image src="/images/i-location.svg" />
          <Text className="font-normal text-[12px] text-start  line-clamp-2">
            {address}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;

CustomerCard.propTypes = {
  data: PropTypes.object,
  setPdfLoader: PropTypes.func,
  pdfLoader: PropTypes.bool,
  setOpen: PropTypes.func,
  setMessage: PropTypes.func,
  setType: PropTypes.func,
};
