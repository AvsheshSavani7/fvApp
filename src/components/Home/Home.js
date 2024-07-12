import React, { useCallback, useEffect, useState } from "react";
import "./Home.css";
import HomeComponent from "./HomeComponent";
import { useParams } from "react-router-dom";
import { getCustomerById } from "../../services/customers.service";
import { getAuth } from "../../services/identity.service";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveRoomId,
  setCLFloorDetailsColorUpdate,
  setCheckListColorUpdate,
  setCustomerId,
  singleCustomer,
  updateActiveBtnKey,
  updateBtnArray,
} from "../../redux/customer";
import sampleJson from "../../utils/sampleJson.json";
import { BuildingType } from "../../utils/buildingTypeQuestion";
import {
  checkMandatoryForChecklist,
  checkMandatoryForCustomerDetails,
  checkMandatoryForFloorDetails,
  checkMandatoryForFurniture,
  checkMandatoryForLeveling,
  checkMandatoryForMatching,
  checkMandatoryForProjectScope,
  checkMandatoryForRepair,
  checkMandatoryForStaricase,
  checkMandatoryForTransition,
} from "../../utils/checkMandatory";
import {
  setDrawingRoomsInFloor,
  setInitialDataForDrawingRooms,
  setIsFloorPlanDataExistForCustomer,
} from "../../redux/floorPlan";
import { setInitialProducts } from "../../redux/product";

const Home = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const btnArray = useSelector((state) => state.customerReducer.btnArray);
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const notFilledOutBtns = useSelector(
    (state) => state.customerReducer.notFilledOutBtns
  );
  const store = useSelector((state) => state.customerReducer);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.customerId) {
      getCustomer(params?.customerId);
    } else {
      let updatedSampleJsonWithBuildingType = { ...sampleJson };
      updatedSampleJsonWithBuildingType.customer = {
        ...updatedSampleJsonWithBuildingType?.customer,
        buildingType: BuildingType,
      };
      dispatch(singleCustomer(updatedSampleJsonWithBuildingType));
      dispatch(setCustomerId(""));
      dispatch(updateActiveBtnKey(""));
      dispatch(
        updateBtnArray([
          // {
          //   name: "Checklist",
          //   key: "checklist",
          //   className: "round-btn-bottom",
          // },
          {
            name: "Floor Details",
            key: "floorDetails",
            className: "round-btn-bottom",
          },
        ])
      );

      setLoading(false);
    }
    dispatch(
      setActiveRoomId({
        floorId: "",
        roomId: "",
        images: [],
        area: "",
        linear: "",
      })
    );
  }, [params?.customerId]);

  const getCustomer = useCallback(async (customerId) => {
    setLoading(true);
    const auth = getAuth();
    const customerRes = await getCustomerById(customerId, auth?.token);
    const customer = customerRes?.data?.entity;
    if (customerRes?.data?.status) {
      const data = customer.customer_floor_plan_data;
      dispatch(setIsFloorPlanDataExistForCustomer(data));

      if (data) {
        const clonedFloorPlanData = JSON.parse(
          JSON.stringify(data.floor_plan_data)
        );
        dispatch(setInitialDataForDrawingRooms(clonedFloorPlanData));
        dispatch(setDrawingRoomsInFloor(clonedFloorPlanData));

        const updateInitialProds = customer.fv_data?.all_products || [];
        dispatch(setInitialProducts(updateInitialProds));
      }

      let newBtnArray = [];

      // Function to add missing keys
      const addMissingKeys = (originalObject, sampleObject) => {
        const result = { ...originalObject };

        Object.keys(sampleObject).forEach((key) => {
          if (!(key in result)) {
            result[key] = sampleObject[key]; // You can set a default value for the missing key
          }
        });

        return result;
      };

      // Use the function to add missing keys
      const updatedFvData = addMissingKeys(customer?.fv_data, sampleJson);

      console.log(updatedFvData);
      // debugger;
      dispatch(singleCustomer(updatedFvData));
      dispatch(setCustomerId(customer?.id));
      if (customer.fv_data.scope?.refinishing?.is_part) {
        newBtnArray.push({
          name: "Checklist",
          key: "checklist",
          className: "round-btn-bottom",
        });
        newBtnArray.push({
          name: "Floor Details",
          key: "floorDetails",
          className: "round-btn-bottom",
        });
      } else {
        newBtnArray.push({
          name: "Floor Details",
          key: "floorDetails",
          className: "round-btn-bottom",
        });
      }
      if (customer.fv_data.scope?.furniture.kasa_is_moving) {
        newBtnArray.push({
          name: "Furniture",
          key: "furniture",
          className: "round-btn-bottom",
        });
      }
      if (
        customer.fv_data.scope?.refinishing.are_we_matching ||
        customer.fv_data.scope?.installation.are_we_matching
      ) {
        newBtnArray.push({
          name: "Matching",
          key: "matching",
          className: "round-btn-bottom",
        });
      }

      if (customer.fv_data.scope?.installation.are_we_levelling) {
        newBtnArray.push({
          name: "Leveling",
          key: "leveling",
          className: "round-btn-bottom",
        });
      }

      if (customer.fv_data.scope?.is_repair) {
        newBtnArray.push({
          name: "Items of Interest",
          key: "repaire",
          className: "round-btn-bottom",
        });
      }
      if (customer.fv_data.scope?.is_staircase) {
        newBtnArray.push({
          name: "Staircase",
          key: "staircase",
          className: "round-btn-bottom",
        });
      }
      if (customer.fv_data.scope?.is_transition) {
        newBtnArray.push({
          name: "Transition",
          key: "transitions",
          className: "round-btn-bottom",
        });
      }
      dispatch(updateBtnArray(newBtnArray));

      if (customer.fv_data.refinishing_checklists.length > 0) {
        let colorArray = customer.fv_data.refinishing_checklists.map(
          (item) => item.color
        );
        // dispatch(
        //   setCheckListColorUpdate({
        //     CLRefinishingDefaultColor:
        //       store?.checkListBtnColor?.CLRefinishingDefaultColor.filter(
        //         (hex) => colorArray.filter((item) => item !== hex)
        //       ),
        //     CLRefinishingUsedColor: colorArray,
        //   })
        // );
      }
      if (customer.fv_data.existing_materials.length > 0) {
        let colorArray = customer.fv_data.existing_materials.map(
          (item) => item.color
        );
        // dispatch(
        //   setCLFloorDetailsColorUpdate({
        //     ...store?.CLFloorDetailsBtnColor,
        //     CLFloorDetailsDefaultColor:
        //       store?.CLFloorDetailsBtnColor.CLFloorDetailsDefaultColor.filter(
        //         (hex) => colorArray.filter((item) => item !== hex)
        //       ),
        //     CLFloorDetailsUsedColor: colorArray,
        //   })
        // );
      }
      if (customer.fv_data.subfloor_details?.length > 0) {
        let colorArray = customer.fv_data.subfloor_details?.map(
          (item) => item.color
        );
        // dispatch(
        //   setCLFloorDetailsColorUpdate({
        //     ...store?.CLFloorDetailsBtnColor,
        //     CLSubFloorDetailsDefaultColor:
        //       store?.CLFloorDetailsBtnColor.CLSubFloorDetailsDefaultColor?.filter(
        //         (hex) => colorArray.filter((item) => item !== hex)
        //       ),
        //     CLSubFloorDetailsUsedColor: colorArray,
        //   })
        // );
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const promises = [
      checkMandatoryForCustomerDetails(
        dispatch,
        singleCustomerData,
        notFilledOutBtns
      ),
      checkMandatoryForProjectScope(
        dispatch,
        singleCustomerData,
        notFilledOutBtns
      ),
      checkMandatoryForChecklist(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForFloorDetails(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForFurniture(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForMatching(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForLeveling(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForRepair(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForStaricase(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
      checkMandatoryForTransition(
        dispatch,
        singleCustomerData,
        activeBtnKey,
        notFilledOutBtns
      ),
    ];

    Promise.all(promises)
      .then(() => {})
      .catch((error) => {
        console.log(error, "error--");
      });
  }, [singleCustomerData, activeBtnKey, notFilledOutBtns]);

  return <div>{!loading ? <HomeComponent /> : <h1></h1>}</div>;
};

export default Home;
