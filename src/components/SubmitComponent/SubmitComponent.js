import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  getFieldsForCustomerDetails,
  getFieldsForProectScope,
} from "../../utils/getRemainingMandatoryFields";
import SubmitDialog from "./SubmitDialog";
import Image from "../UI/Image";
import { setNotFilledOutBtns } from "../../redux/customer";
import {
  reduceQuestions,
  reduceQuestionsForSubfloor,
} from "../../helper/helper";
import { pushFVDatatoZoho } from "../../services/customers.service";

const SubmitComponent = ({
  singleCustomerData,
  id,
  ZC_PO_ID,
  setOpen,
  setMessage,
  setType,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [customerDetailsObj, setCustomerDetailsObj] = useState({});
  const [projectScopeObj, setProjectScopeObj] = useState({});
  const [updatedNotFilledOutBtns, setUpdatedNotFilledOutBtns] = useState([]);

  const dispatch = useDispatch();
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );

  useEffect(() => {
    setUpdatedNotFilledOutBtns(notFilledOutBtns);
  }, [notFilledOutBtns]);

  const resetNotFilledBtns = useCallback(() => {
    dispatch(setNotFilledOutBtns([]));
  }, [openModal]);

  let asyncFunc = useCallback(async () => {
    let data = await getReducedData();
    let reducedData = await finalReducedData(data); //remove checklist array if not in scope
    let reducedData1 = await finalReducedData1(reducedData); //remove checklist id if checklist empty for zoho

    return reducedData1;
  }, [openModal, singleCustomerData]);

  const getReducedData = useCallback(() => {
    let customer = singleCustomerData?.customer;

    let reducedCustomer = JSON.parse(
      JSON.stringify(singleCustomerData?.customer)
    );

    let reducedRefinishing = JSON.parse(
      JSON.stringify(singleCustomerData?.refinishing_checklists)
    );

    let reducedExistingMaterial = JSON.parse(
      JSON.stringify(singleCustomerData?.existing_materials)
    );

    let reducedSubfloor = JSON.parse(
      JSON.stringify(singleCustomerData?.subfloor_details)
    );

    let reducedMolding = JSON.parse(
      JSON.stringify(singleCustomerData?.molding)
    );

    let reducedKitchenFurniture = JSON.parse(
      JSON.stringify(singleCustomerData?.kitchen_furnitures)
    );

    let reducedSpecialItems = JSON.parse(
      JSON.stringify(singleCustomerData?.specialItem_furnitures)
    );

    let reduceMatchingRefinishing = JSON.parse(
      JSON.stringify(singleCustomerData?.matching_refinishing_checklists)
    );

    let reduceMatchingInstalltion = JSON.parse(
      JSON.stringify(singleCustomerData?.matching_installation_checklists)
    );

    let levellings = JSON.parse(JSON.stringify(singleCustomerData?.levellings));

    let staircases = JSON.parse(JSON.stringify(singleCustomerData?.staircases));

    let transitions = JSON.parse(
      JSON.stringify(singleCustomerData?.transitions)
    );

    let building = {};

    building["id"] = customer.buildingType?.id;
    building["question"] = customer.buildingType?.question;
    building["answer"] = customer.buildingType?.answer;
    building["type"] = customer.buildingType?.type;

    let reducedSubQuestions = customer.buildingType?.subQuestion
      ? customer.buildingType?.subQuestion?.map((subQue) => {
          const { id, question, answer, type, subQuestion } = subQue;
          if (subQuestion) {
            let subOfSub = subQuestion?.map((subofsub) => {
              const { id, question, answer, type } = subofsub;
              return { id, question, answer, type };
            });
            return { id, question, answer, type, subQuestion: subOfSub };
          } else {
            return { id, question, answer, type };
          }
        })
      : {};

    building["subQuestion"] = reducedSubQuestions;

    reducedCustomer = { ...reducedCustomer, buildingType: building };

    if (reducedRefinishing?.length > 0) {
      reducedRefinishing = reduceQuestions(reducedRefinishing);
    }

    if (reducedExistingMaterial?.length > 0) {
      reducedExistingMaterial = reduceQuestions(reducedExistingMaterial);
    }

    if (reducedSubfloor?.length > 0) {
      reducedSubfloor = reduceQuestionsForSubfloor(reducedSubfloor);
    }

    if (reducedMolding?.length > 0) {
      reducedMolding = reduceQuestions(reducedMolding);
    }

    if (reducedKitchenFurniture?.length > 0) {
      reducedKitchenFurniture = reduceQuestions(reducedKitchenFurniture);
    }

    if (reducedSpecialItems?.length > 0) {
      reducedSpecialItems = reduceQuestions(reducedSpecialItems);
    }

    if (reduceMatchingRefinishing?.length > 0) {
      reduceMatchingRefinishing = reduceQuestions(reduceMatchingRefinishing);
    }

    if (reduceMatchingInstalltion?.length > 0) {
      reduceMatchingInstalltion = reduceQuestions(reduceMatchingInstalltion);
    }

    if (levellings?.length > 0) {
      levellings = reduceQuestions(levellings);
    }

    if (staircases?.length > 0) {
      staircases = reduceQuestions(staircases);
    }

    if (transitions?.length > 0) {
      transitions = reduceQuestions(transitions);
    }

    return {
      customer: reducedCustomer,
      refinishing_checklists: reducedRefinishing,
      existing_materials: reducedExistingMaterial,
      subfloor_details: reducedSubfloor,
      molding: reducedMolding,
      kitchen_furnitures: reducedKitchenFurniture,
      specialItem_furnitures: reducedSpecialItems,
      matching_refinishing_checklists: reduceMatchingRefinishing,
      matching_installation_checklists: reduceMatchingInstalltion,
      levellings,
      staircases,
      transitions,
    };
  }, [openModal, singleCustomerData]);

  const addInExclude = React.useCallback(
    (data) => {
      const scope = data?.scope;
      const excludeArray = [];
      if (!scope.refinishing.is_part) {
        excludeArray.push(
          "refinishing_checklists",
          "matching_refinishing_checklists",
          "existing_materials"
        );
      } else if (!scope.refinishing.are_we_matching) {
        excludeArray.push("matching_refinishing_checklists");
      }

      if (!scope.installation.is_part) {
        excludeArray.push(
          "subfloor_details",
          "matching_installation_checklists",
          "levellings"
        );
      } else {
        if (!scope.installation.are_we_matching) {
          excludeArray.push("matching_installation_checklists");
        }
        if (!scope.installation.are_we_levelling) {
          excludeArray.push("levellings");
        }
      }

      if (!scope.is_repair) {
        excludeArray.push("repairs");
      }

      if (!scope.is_staircase) {
        excludeArray.push("staircases");
      }

      if (!scope.is_transition) {
        excludeArray.push("transitions");
      }

      return excludeArray;
    },
    [openModal, singleCustomerData]
  );

  const finalReducedData = useCallback(
    (data) => {
      let deeCopyCustomerData = JSON.parse(JSON.stringify(singleCustomerData));
      const excludeFromArray = addInExclude(deeCopyCustomerData);
      console.log("excludeFromArray-", excludeFromArray);

      let newReducedData = Object.keys(deeCopyCustomerData)?.reduce(
        (acc, cur) => {
          if (excludeFromArray.includes(cur)) {
            acc[cur] = [];
          } else {
            if (data.hasOwnProperty(cur)) {
              acc[cur] = data[cur];
            } else {
              acc[cur] = deeCopyCustomerData[cur];
            }
          }
          return acc;
        },
        {}
      );
      return newReducedData;
    },
    [openModal, singleCustomerData]
  );
  const finalReducedData1 = useCallback(
    (data) => {
      let deeCopyCustomerData = JSON.parse(JSON.stringify(data));
      let {
        matching_refinishing_checklists,
        matching_installation_checklists,
        refinishing_checklists,
        installation_checklists,
        subfloor_details,
        existing_materials,
        molding,
        levellings,
      } = data;

      let floors = [...deeCopyCustomerData?.scope.floors];
      const updatedData = floors.map((item) => ({
        ...item,
        rooms: item.rooms.map((room) => {
          return {
            ...room,
            matching_refinishing_checklists_id:
              matching_refinishing_checklists?.length === 0
                ? ""
                : room?.matching_refinishing_checklists_id,
            matching_installation_checklists_id:
              matching_installation_checklists?.length === 0
                ? ""
                : room?.matching_installation_checklists_id,
            refinishing_checklists_id:
              refinishing_checklists?.length === 0
                ? ""
                : room?.refinishing_checklists_id,
            installation_checklist_id:
              installation_checklists?.length === 0
                ? ""
                : room?.installation_checklist_id,
            subfloor_detail_id:
              subfloor_details?.length === 0 ? "" : room?.subfloor_detail_id,
            existing_material_id:
              existing_materials?.length === 0
                ? ""
                : room?.existing_material_id,
            molding_id: molding?.length === 0 ? "" : room?.molding_id,
            levelling_id: levellings?.length === 0 ? "" : room?.levelling_id,
          };
        }),
      }));

      deeCopyCustomerData.scope.floors = updatedData;

      return deeCopyCustomerData;
    },
    [openModal, singleCustomerData]
  );

  const handleSubmitData = async () => {
    await resetNotFilledBtns();

    let customerDetails = getFieldsForCustomerDetails(singleCustomerData);
    let projectScope = getFieldsForProectScope(singleCustomerData);
    setCustomerDetailsObj(customerDetails);
    setProjectScopeObj(projectScope);

    setOpenModal(true);
  };

  const onClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (openModal) {
        if (updatedNotFilledOutBtns.length === 0) {
          setOpenModal(false);
          setUploadLoading(true);
          let reducedData = await asyncFunc();
          const reqBody = {
            fv_data: reducedData,
            ZC_PO_ID: ZC_PO_ID,
            customer_id: id,
          };

          const pushToZoho = await pushFVDatatoZoho(reqBody);
          setOpen(true);
          setMessage(pushToZoho?.data?.message);

          if (pushToZoho?.data?.status) {
            setType("success");
          } else {
            setType("error");
          }
        } else {
          setOpenModal(true);
        }
        setUploadLoading(false);
      }
    };

    fetchData();
  }, [updatedNotFilledOutBtns]);

  return (
    <div>
      <Image
        className={`rounded-full p-2 border-[1px] bg-white ${
          uploadLoading && "opacity-[0.6] pointer-events-none"
        }`}
        src="/images/cloud-up-arrow.svg"
        onClick={handleSubmitData}
      />
      <SubmitDialog
        open={openModal}
        onClose={onClose}
        onConfirm={() => {}}
        customerDetailsObj={customerDetailsObj}
        projectScopeObj={projectScopeObj}
        singleCustomerData={singleCustomerData}
        updatedNotFilledOutBtns={updatedNotFilledOutBtns}
      />
    </div>
  );
};

export default SubmitComponent;

SubmitComponent.propTypes = {
  singleCustomerData: PropTypes.object,
  id: PropTypes.string,
  ZC_PO_ID: PropTypes.string,
  setOpen: PropTypes.func,
  setMessage: PropTypes.func,
  setType: PropTypes.func,
};
