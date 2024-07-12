import { createSlice } from "@reduxjs/toolkit";
import sampleJson from "../utils/sampleJson.json";
import { updateCustomerFVData } from "../services/customers.service";

const slice = createSlice({
  name: "customerList",
  initialState: {
    customerList: [],
    customerId: "",
    singleCustomer: sampleJson,
    btnArray: [
      // { name: "Checklist", key: "checklist", className: "round-btn-bottom" },
      {
        name: "Floor Details",
        key: "floorDetails",
        className: "round-btn-bottom",
      },
    ],
    notFilledOutBtns: [],
    activeBtnKey: "",
    step: 1,
    imageLoading: false,
    imageQuestionId: "",
    activeRoomId: {
      floorId: "",
      roomId: "",
      images: [],
      area: "",
      linear: "",
    },
    checkListActiveBtn: "",
    matchingActiveBtn: "",
    dividerToShow: true,
    activeRefinihsingChecklistId: "",
    activeMatchingRefinishingChecklistId: "",
    activeMatchingInstallationChecklistId: "",
    activeExistingFloorDetailsChecklistId: "",
    activeSubFloorFloorDetailsChecklistId: "",
    activeMoldingChecklistId: "",
    activeLevelingChecklistId: "",
    checkListDefaultColor: [
      "#1E2E5A",
      "#F9832C",
      "#004E6A",
      "#607D8B",
      "#795548",
    ],
    checklistColor: [],
    checkListBtnColor: {
      CLRefinishingDefaultColor: [
        "#1E2E5A",
        "#F9832C",
        "#004E6A",
        "#607D8B",
        "#795548",
      ],
      CLRefinishingUsedColor: [],
    },
    CLFloorDetailsBtnColor: {
      CLFloorDetailsDefaultColor: ["#F9832C", "#004E6A", "#607D8B", "#795548"],
      CLFloorDetailsUsedColor: [],
      CLSubFloorDetailsDefaultColor: [
        "#F9832C",
        "#004E6A",
        "#607D8B",
        "#795548",
      ],
      CLSubFloorDetailsUsedColor: [],
    },

    // loaded image states
    allLoadedImagesSrc: [],
    allImagesSrc: [],
    isImagesExist: false,
  },
  reducers: {
    getAllCustomer: (state, action) => {
      // Update the state with the row data
      state.customerList = action.payload;
    },
    singleCustomer: (state, action) => {
      state.singleCustomer = action.payload;
    },
    updateBtnArray: (state, action) => {
      state.btnArray = action.payload;
    },
    updateActiveBtnKey: (state, action) => {
      state.activeBtnKey = action.payload;
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    setActiveRoomId: (state, action) => {
      state.activeRoomId = action.payload;
    },
    setImageLoading: (state, action) => {
      state.imageLoading = action.payload;
    },
    setImageQuestionId: (state, action) => {
      state.imageQuestionId = action.payload;
    },
    setChangeBgBtnArray: (state, action) => {
      state.changeBgBtnArray = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setCheckListActiveBtn: (state, action) => {
      state.checkListActiveBtn = action.payload;
    },
    setMatchingActiveBtn: (state, action) => {
      state.matchingActiveBtn = action.payload;
    },
    setActiveRefinishingCheckListId: (state, action) => {
      state.activeRefinihsingChecklistId = action.payload;
    },
    setActiveMatchingRefinishingChecklistId: (state, action) => {
      state.activeMatchingRefinishingChecklistId = action.payload;
    },
    setActiveMatchingInstallationChecklistId: (state, action) => {
      state.activeMatchingInstallationChecklistId = action.payload;
    },
    setActiveExistingFloorDetailsChecklistId: (state, action) => {
      state.activeExistingFloorDetailsChecklistId = action.payload;
    },
    setActiveSubFloorFloorDetailsChecklistId: (state, action) => {
      state.activeSubFloorFloorDetailsChecklistId = action.payload;
    },
    setActiveMoldingChecklistId: (state, action) => {
      state.activeMoldingChecklistId = action.payload;
    },
    setActiveLevelingCheckListId: (state, action) => {
      state.activeLevelingChecklistId = action.payload;
    },
    setCheckListColorArray: (state, action) => {
      state.checklistColor = action.payload;
    },
    setCheckListDefaultColorArray: (state, action) => {
      state.checkListDefaultColor = action.payload;
    },
    setCheckListColorUpdate: (state, action) => {
      state.checkListBtnColor = action.payload;
    },
    setCLFloorDetailsColorUpdate: (state, action) => {
      state.CLFloorDetailsBtnColor = action.payload;
    },
    setDividerToShow: (state, action) => {
      state.dividerToShow = action.payload;
    },
    setNotFilledOutBtns: (state, action) => {
      state.notFilledOutBtns = action.payload;
    },
    setAllLoadedImagesSrc: (state, action) => {
      const src = action.payload;
      const curImges =
        state.allLoadedImagesSrc.length > 0
          ? [...state.allLoadedImagesSrc]
          : [];
      if (!curImges.includes(src)) {
        state.allLoadedImagesSrc = [...curImges, src];
      }
    },
    setAllImagesSrc: (state, action) => {
      const src = action.payload;
      const curImges =
        state.allImagesSrc.length > 0 ? [...state.allImagesSrc] : [];
      if (!curImges.includes(src)) {
        state.allImagesSrc = [...curImges, src];
      }
    },
    clearImages: (state, action) => {
      state.allImagesSrc = [];
      state.allLoadedImagesSrc = [];
    },
    setIsImagesExist: (state, action) => {
      state.isImagesExist = action.payload;
    },
  },
});

export const {
  getAllCustomer,
  singleCustomer,
  updateBtnArray,
  updateActiveBtnKey,
  setCustomerId,
  setActiveRoomId,
  setImageLoading,
  setImageQuestionId,
  setStep,
  setCheckListActiveBtn,
  setMatchingActiveBtn,
  setActiveRefinishingCheckListId,
  setCheckListDefaultColorArray,
  setCheckListColorArray,
  setCheckListColorUpdate,
  setCLFloorDetailsColorUpdate,
  setActiveExistingFloorDetailsChecklistId,
  setActiveSubFloorFloorDetailsChecklistId,
  setActiveMoldingChecklistId,
  setActiveLevelingCheckListId,
  setDividerToShow,
  setActiveMatchingRefinishingChecklistId,
  setActiveMatchingInstallationChecklistId,
  setNotFilledOutBtns,
  setAllLoadedImagesSrc,
  setAllImagesSrc,
  setIsImagesExist,
  clearImages,
} = slice.actions;

export const updateSingleCustomerApi =
  (fv_data) => async (dispatch, getState) => {
    let customerId = getState()?.customerReducer?.customerId;

    dispatch(singleCustomer(fv_data));
    if (customerId) {
      const fv_Updated = JSON.parse(JSON.stringify(fv_data));

      let array = fv_Updated?.isBgChangedBtnArray || [];
      if (
        fv_Updated.scope?.installation?.is_part ||
        fv_Updated?.scope?.refinishing?.is_part
      ) {
        if (!array?.includes("customerDetails"))
          fv_Updated?.isBgChangedBtnArray.push("customerDetails");
      } else {
        if (array?.includes("customerDetails")) {
          let newArray = array.filter((key) => key !== "customerDetails");

          fv_Updated["isBgChangedBtnArray"] = [...newArray];
        }
      }
      dispatch(singleCustomer(fv_Updated));
      let fvdataRes = await updateCustomerFVData(customerId, {
        fv_data: fv_Updated,
      });

      if (fvdataRes?.data?.status) {
      }
    }
  };

export default slice.reducer;
