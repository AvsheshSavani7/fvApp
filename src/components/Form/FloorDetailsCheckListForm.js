import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import {
  setActiveExistingFloorDetailsChecklistId,
  setActiveMoldingChecklistId,
  setActiveSubFloorFloorDetailsChecklistId,
  setCheckListActiveBtn,
  updateSingleCustomerApi,
} from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import MuiSnackbar from "../UI/MuiSnackbar";
import Button from "../UI/Button";
import {
  floorDetailsCheckList,
  subFloorCheckList,
} from "../../utils/floorDetailsCheckList";
import { moldingChecklist } from "../../utils/moldingChecklist";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import SubQuestionHeader from "../UI/CheckList/SubQuestionHeader";
import SubQueGrid from "../UI/QuestionTypes/SubQueGrid";
import SubofSubQueGrid from "../UI/QuestionTypes/SubofSubQueGrid";
import CLFloorDetailsProjectFloors from "../UI/CheckList/FloorDetailsCheckListBtns/CLFloorDetailsProjectFloors";
import CLFloorDetailsProjectFloorSummary from "../UI/CheckList/FloorDetailsCheckListBtns/CLFloorDetailsProjectFloorSummary";
import SFMainQueGrid from "../UI/QuestionTypes/SubFloorGrid/SFMainQueGrid";
import SFSubQueGrid from "../UI/QuestionTypes/SubFloorGrid/SFSubQueGrid";
import GetIconFile from "../../assets/GetIconFile";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import { updateSummaryFloorsAndQuestion } from "../../helper/helper";
import NodeChart from "../UI/NodeChart";
import SummaryCard from "../UI/SummaryCard";
import RoomArea from "../RoomAreaComponent/RoomArea";
import MoldingSummary from "../UI/CheckList/FloorDetailsCheckListBtns/MoldingSummary";
import { Constants } from "../../utils/Constants";
import WithinBtn from "../UI/CheckList/Repair/WithinBtn";
import OutOfScopeBtn from "../UI/OutOfScopeBtn";
import { usePreview } from "react-dnd-preview";

const StyledGrid = styled(Grid)({
  height: "100%",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  height: "100%",
});

const QueGrid = styled(Grid)({
  padding: "16px 24px 0 31px",
});

const SubOfSubGrid = styled(Grid)({
  padding: "8px 0 0 9px",
});

const ProjectGrid = styled(Grid)({
  padding: "16px 0",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});

const CarouselContainer = styled("div")({
  // minHeight: "624px",
});

let customDotStyles = `
    .slick-dots {
      bottom: -74px;
    }

    .slick-dots li button:before {
      color: gray; 
      font-size: 20px !important;
    }

    .slick-list{
      overflow:visible;
    }

  `;

const FloorDetailsCheckListForm = () => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const existingScope = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );

  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );

  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const activeExistingFloorDetailsChecklistId = useSelector(
    (state) => state.customerReducer.activeExistingFloorDetailsChecklistId
  );
  const activeSubFloorFloorDetailsChecklistId = useSelector(
    (state) => state.customerReducer.activeSubFloorFloorDetailsChecklistId
  );
  const activeMoldingChecklistId = useSelector(
    (state) => state.customerReducer.activeMoldingChecklistId
  );
  const store = useSelector((state) => state.customerReducer);

  const [showQuestion, setShowQuestion] = useState({});
  const [showKey, setShowKey] = useState("");
  const [roomMolding, setRoomMolding] = useState({ roomId: "", molding: {} });

  useEffect(() => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "existingMaterials"
    ) {
      if (singleCustomerData.existing_materials?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: floorDetailsCheckList,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms.map((room) => ({
            ...room,
            existing_material_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.existing_materials = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveExistingFloorDetailsChecklistId(newCheckList.id));

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "subFloor"
    ) {
      if (singleCustomerData.subfloor_details?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: subFloorCheckList,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms.map((room) => ({
            ...room,
            subfloor_detail_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.subfloor_details = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveSubFloorFloorDetailsChecklistId(newCheckList.id));
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "molding"
    ) {
      if (singleCustomerData.molding?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: moldingChecklist,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms.map((room) => ({
            ...room,
            molding_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.molding = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveMoldingChecklistId(newCheckList.id));
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  }, [activeBtnKey, checkListActiveBtn]);

  useEffect(() => {
    setShowQuestion({});
    setSummeryFloor(addedFloors);
    setShowKey("");
    if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "existingMaterials" &&
      singleCustomerData.existing_materials?.length > 0
    ) {
      dispatch(
        setActiveExistingFloorDetailsChecklistId(
          singleCustomerData.existing_materials[0].id
        )
      );
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "subFloor" &&
      singleCustomerData.subfloor_details?.length > 0
    ) {
      dispatch(
        setActiveSubFloorFloorDetailsChecklistId(
          singleCustomerData.subfloor_details[0].id
        )
      );
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "molding" &&
      singleCustomerData.molding?.length > 0
    ) {
      dispatch(
        setActiveMoldingChecklistId(singleCustomerData.molding?.[0]?.id)
      );
    }
  }, [checkListActiveBtn, activeBtnKey]);

  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [subQuesionsShow, setSubQuesionsShow] = React.useState(false);
  const [subFLoorSubQuestionsShow, setSubFLoorSubQuestionsShow] =
    React.useState(false);
  const [subQuestions, setSubQuestions] = React.useState({});
  const [subFloorSubQuestions, setSubFloorSubQuestions] = React.useState({});
  const [subofSubQuestionObj, setSubofSubQuestionObj] = React.useState({});
  const [subofSubQuestions, setSubofSubQuestions] = React.useState([]);
  const [activeRoomobj, setActiveRoomobj] = React.useState({});

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    touchMove: isDragEnabled,
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (checkListActiveBtn === "existingMaterials") {
      if (singleCustomerData?.existing_materials?.length > 0) {
        setIndex(
          singleCustomerData?.existing_materials?.findIndex(
            (item) => item?.id === activeExistingFloorDetailsChecklistId
          )
        );
      }
    } else if (checkListActiveBtn === "subFloor") {
      if (singleCustomerData?.subfloor_details?.length > 0) {
        setIndex(
          singleCustomerData?.subfloor_details?.findIndex(
            (item) => item?.id === activeSubFloorFloorDetailsChecklistId
          )
        );
      }
    } else if (checkListActiveBtn === "molding") {
      if (singleCustomerData?.molding?.length > 0) {
        setIndex(
          singleCustomerData?.molding?.findIndex(
            (item) => item?.id === activeMoldingChecklistId
          )
        );
      }
    }
  }, [
    checkListActiveBtn,
    activeExistingFloorDetailsChecklistId,
    activeSubFloorFloorDetailsChecklistId,
    activeMoldingChecklistId,
  ]);

  const [summeryFloor, setSummeryFloor] = useState([]);
  useEffect(() => {
    setSummeryFloor(addedFloors);
    setShowKey("");
    setRoomMolding({ roomId: "", molding: [] });

    setShowQuestion({});
  }, [singleCustomerData]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRemoveClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setTimeout(() => {
      setDialogOpen(true);
    }, 20);
  };

  const handleConfirmRemove = () => {
    setDialogOpen(false);
    removeCheckList(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const summaryQuestions = [
    { questionToShow: "Type", question: "Type", quesType: "DropDown" },
    {
      questionToShow: "Bevels",
      question: "Are there any bevels",
      quesType: "BOOLEAN",
    },
    {
      questionToShow: "Species",
      question: "Species",
      quesType: "DROPDOWN",
    },
    {
      questionToShow: "Layout",
      question: "Layout",
      quesType: "DROPDOWN",
    },
    {
      questionToShow: "Exposed",
      question: "Exposed or Covered",
      quesType: "DROPDOWN",
    },
  ];
  const summarySubFloorQuestions = [
    { questionToShow: "Type", question: "Type", quesType: "DropDown" },
    {
      questionToShow: "Covering",
      question: "Floor Covering",
      quesType: "DropDown",
    },
  ];

  const onQuesClick = (Question, type, questionToShow) => {
    if (showKey === Question) {
      setShowKey("");
      setSummeryFloor(addedFloors);
      setShowQuestion({});
    } else {
      let floor = [];
      let oneQuestion1 = {};
      if (store.checkListActiveBtn === "existingMaterials") {
        const { floors, oneQuestion } = updateSummaryFloorsAndQuestion(
          addedFloors,
          singleCustomerData,
          questionToShow,
          Question,
          "existing_materials",
          "existing_material_id"
        );
        floor = floors;
        oneQuestion1 = oneQuestion;
      } else if (store.checkListActiveBtn === "subFloor") {
        const { floors, oneQuestion } = updateSummaryFloorsAndQuestion(
          addedFloors,
          singleCustomerData,
          questionToShow,
          Question,
          "subfloor_details",
          "subfloor_detail_id"
        );
        floor = floors;
        oneQuestion1 = oneQuestion;
      }
      setSummeryFloor(floor);
      setShowQuestion(oneQuestion1);
      setShowKey(Question);
    }
  };

  const handleProjectLevel = () => {
    if (checkListActiveBtn === "existingMaterials") {
      let checkListIdArray = [];
      singleCustomerData.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          checkListIdArray.push(room.existing_material_id);
        });
      });
      const isAllRoomSameId = checkListIdArray.every(
        (item) => item === activeExistingFloorDetailsChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
        let existingMaterialCheckList = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) =>
            existingMaterialCheckList.push(room.existing_material_id)
          )
        );

        const isChecklistUsed =
          updatedSingleCustomer?.existing_materials?.every((checklist) =>
            existingMaterialCheckList.includes(checklist.id)
          );
        let newColor;
        if (singleCustomerData.existing_materials.length >= 1) {
          if (singleCustomerData.existing_materials.length < 5) {
            let existingColors = singleCustomerData.existing_materials.map(
              (e) => e.color
            );
            const filteredColors = store.checkListDefaultColor.filter(
              (color) => !existingColors.includes(color)
            );

            newColor = filteredColors[0];
          } else {
            // Generate random color
            function generateRandomColor(existingColors) {
              const characters = "0123456789ABCDEF";
              let color;
              let isUnique = false;

              // Function to generate a random color
              const getRandomColor = () => {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                  color += characters[Math.floor(Math.random() * 16)];
                }
                return color;
              };

              // Keep generating random colors until a unique color is found
              while (!isUnique) {
                color = getRandomColor();
                isUnique = !existingColors.includes(color);
              }

              return color;
            }
            let usedColor = [];
            updatedSingleCustomer?.existing_materials?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let existingImport = JSON.parse(
            JSON.stringify(floorDetailsCheckList)
          );

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of existingImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: existingImport,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.existing_materials = [
              ...updatedSingleCustomer.existing_materials,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }

        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.existing_material_id = "";
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.existing_material_id = activeExistingFloorDetailsChecklistId;
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
    if (checkListActiveBtn === "subFloor") {
      let checkListIdArray = [];
      singleCustomerData.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          checkListIdArray.push(room.subfloor_detail_id);
        });
      });
      const isAllRoomSameId = checkListIdArray.every(
        (item) => item === activeSubFloorFloorDetailsChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
        let subFloorCheckList1 = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) =>
            subFloorCheckList1.push(room.subfloor_detail_id)
          )
        );

        const isChecklistUsed = updatedSingleCustomer?.subfloor_details?.every(
          (checklist) => subFloorCheckList1.includes(checklist.id)
        );

        let newColor;
        if (singleCustomerData.subfloor_details.length >= 1) {
          if (singleCustomerData.subfloor_details.length < 5) {
            let existingColors = singleCustomerData.subfloor_details.map(
              (e) => e.color
            );
            const filteredColors = store.checkListDefaultColor.filter(
              (color) => !existingColors.includes(color)
            );

            newColor = filteredColors[0];
          } else {
            // Generate random color
            function generateRandomColor(existingColors) {
              const characters = "0123456789ABCDEF";
              let color;
              let isUnique = false;

              // Function to generate a random color
              const getRandomColor = () => {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                  color += characters[Math.floor(Math.random() * 16)];
                }
                return color;
              };

              // Keep generating random colors until a unique color is found
              while (!isUnique) {
                color = getRandomColor();
                isUnique = !existingColors.includes(color);
              }

              return color;
            }

            let usedColor = [];
            updatedSingleCustomer?.subfloor_details?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let subFloorImport = JSON.parse(JSON.stringify(subFloorCheckList));

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of subFloorImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: subFloorImport,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.subfloor_details = [
              ...updatedSingleCustomer.subfloor_details,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }

        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.subfloor_detail_id = "";
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.subfloor_detail_id = activeSubFloorFloorDetailsChecklistId;
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
    if (checkListActiveBtn === "molding") {
      let checkListIdArray = [];
      singleCustomerData.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          checkListIdArray.push(room?.molding_id);
        });
      });
      const isAllRoomSameId = checkListIdArray?.every(
        (item) => item === activeMoldingChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
        let moldingCheckList1 = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) => moldingCheckList1.push(room.molding_id))
        );

        const isChecklistUsed = updatedSingleCustomer?.molding?.every(
          (checklist) => moldingCheckList1.includes(checklist.id)
        );

        let newColor;
        if (singleCustomerData.molding.length >= 1) {
          if (singleCustomerData.molding.length < 5) {
            let existingColors = singleCustomerData?.molding?.map(
              (e) => e.color
            );
            const filteredColors = store?.checkListDefaultColor?.filter(
              (color) => !existingColors.includes(color)
            );

            newColor = filteredColors[0];
          } else {
            // Generate random color
            function generateRandomColor(existingColors) {
              const characters = "0123456789ABCDEF";
              let color;
              let isUnique = false;

              // Function to generate a random color
              const getRandomColor = () => {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                  color += characters[Math.floor(Math.random() * 16)];
                }
                return color;
              };

              // Keep generating random colors until a unique color is found
              while (!isUnique) {
                color = getRandomColor();
                isUnique = !existingColors.includes(color);
              }

              return color;
            }

            let usedColor = [];
            updatedSingleCustomer?.molding?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let moldingImport = JSON.parse(JSON.stringify(moldingChecklist));

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj?.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj?.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of moldingImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: moldingImport,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.molding = [
              ...updatedSingleCustomer.molding,
              newCheckList,
            ];
          }
        }
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.molding_id = "";
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.molding_id = activeMoldingChecklistId;
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  };

  const removeCheckList = (checkList) => {
    if (checkListActiveBtn === "existingMaterials") {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );

      const updatedCheckListArray =
        updatedSingleCustomer.existing_materials.filter(
          (e) => e.id !== checkList.id
        );
      updatedSingleCustomer.existing_materials = updatedCheckListArray;
      setIndex(
        updatedSingleCustomer?.existing_materials?.findIndex(
          (item) => item?.id === activeExistingFloorDetailsChecklistId
        )
      );

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      if (
        updatedSingleCustomer?.existing_materials?.length > 0 &&
        activeExistingFloorDetailsChecklistId === checkList.id
      ) {
        dispatch(
          setActiveExistingFloorDetailsChecklistId(
            updatedSingleCustomer.existing_materials[
              updatedSingleCustomer.existing_materials.length - 1
            ].id
          )
        );
      }
    } else if (checkListActiveBtn === "subFloor") {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );

      const updatedCheckListArray =
        updatedSingleCustomer.subfloor_details.filter(
          (e) => e.id !== checkList.id
        );
      updatedSingleCustomer.subfloor_details = updatedCheckListArray;

      setIndex(
        updatedSingleCustomer?.subfloor_details?.findIndex(
          (item) => item?.id === activeSubFloorFloorDetailsChecklistId
        )
      );

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      if (
        updatedSingleCustomer?.subfloor_details?.length > 0 &&
        activeSubFloorFloorDetailsChecklistId === checkList.id
      ) {
        dispatch(
          setActiveSubFloorFloorDetailsChecklistId(
            updatedSingleCustomer.subfloor_details[
              updatedSingleCustomer.subfloor_details.length - 1
            ].id
          )
        );
      }
    } else if (checkListActiveBtn === "molding") {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );

      const updatedCheckListArray = updatedSingleCustomer?.molding?.filter(
        (e) => e.id !== checkList.id
      );
      updatedSingleCustomer.molding = updatedCheckListArray;

      setIndex(
        updatedSingleCustomer?.molding?.findIndex(
          (item) => item?.id === activeMoldingChecklistId
        )
      );

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      if (
        updatedSingleCustomer?.molding?.length > 0 &&
        activeMoldingChecklistId === checkList.id
      ) {
        dispatch(
          setActiveMoldingChecklistId(
            updatedSingleCustomer.molding?.[
              updatedSingleCustomer?.molding?.length - 1
            ]?.id
          )
        );
      }
    }
  };

  const handleClickRoomArea = (e, roomObj) => {
    e.stopPropagation();
    setActiveRoomobj(roomObj);
  };
  const MyPreview = () => {
    const preview = usePreview();
    if (!preview.display) {
      return null;
    }
    const { itemType, item, style } = preview;
    return (
      <div style={style} className="z-[9999]">
        <motion.button
          className={`round-small-btn 
          !text-black !text-[9px]   !w-[78px] !h-[78px] !bg-[#D8D8D8] mb-[15px] z-[5000]`}
          animate={{
            opacity: 0.7,
          }}
        >
          Out of Scope <br />
          For
          <br />
          {checkListActiveBtn === "existingMaterials" && " Refinishing"}
          {checkListActiveBtn === "subFloor" && " Installation"}
          {checkListActiveBtn === "molding" && " Molding"}
        </motion.button>
      </div>
    );
  };

  return (
    <>
      <style>{customDotStyles}</style>
      <MyPreview />
      <CarouselContainer>
        <MuiSnackbar
          open={open}
          message={message || ""}
          type={type || ""}
          onClose={handleClose}
        />
        <Slider {...carouselSettings} className="h-[510px]">
          {/* {Fist Slide} */}
          <StyledGrid
            container
            key="slide1"
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <FirstGrid item xs={12} md={6} sx={{ width: "597px" }}>
              <div className="flex items-center justify-between gap-[134px] p-[20px]">
                <div className="space-x-2 flex">
                  {existingScope?.refinishing?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "existingMaterials" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[28px] !font-medium`}
                      onClick={() => {
                        dispatch(setCheckListActiveBtn("existingMaterials"));
                        setSubQuesionsShow(false);
                        setSubFLoorSubQuestionsShow(false);
                      }}
                    >
                      E
                    </Button>
                  )}
                  {existingScope?.installation?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "subFloor" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() => {
                        dispatch(setCheckListActiveBtn("subFloor"));
                      }}
                    >
                      S
                    </Button>
                  )}
                  <Button
                    className={`round-small-btn ${
                      checkListActiveBtn === "molding" &&
                      "!bg-[#009DC2] !text-white"
                    }  !text-[28px] !font-medium`}
                    onClick={() => {
                      dispatch(setCheckListActiveBtn("molding"));
                      setSubQuesionsShow(false);
                      setSubFLoorSubQuestionsShow(false);
                    }}
                  >
                    M
                  </Button>
                </div>
                <div
                  className="flex overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div
                    className="space-x-2.5 flex h-[66px] mt-[5px] mr-[5px]"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {checkListActiveBtn === "existingMaterials" &&
                      singleCustomerData?.existing_materials?.length > 1 &&
                      singleCustomerData?.existing_materials.map(
                        (item, index) => {
                          let color = item.color;
                          function isExistingMaterialPresent() {
                            return singleCustomerData.scope.floors.some(
                              (floor) =>
                                floor.rooms.some(
                                  (room) =>
                                    room.existing_material_id === item.id
                                )
                            );
                          }

                          // Check if the valid refinishing ID is present in any room
                          const isPresent = isExistingMaterialPresent();
                          return (
                            <div className="relative">
                              <Button
                                key={item?.id}
                                className={`checklist`}
                                onClick={() => {
                                  dispatch(
                                    setActiveExistingFloorDetailsChecklistId(
                                      item.id
                                    )
                                  );
                                  setSubQuesionsShow(false);
                                  setSubFLoorSubQuestionsShow(false);
                                }}
                                style={
                                  activeExistingFloorDetailsChecklistId !==
                                  item.id
                                    ? { border: `5px solid ${color}` }
                                    : { backgroundColor: `${color}` }
                                }
                              ></Button>
                              {!isPresent && (
                                <div
                                  className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                  onClick={(e) => handleRemoveClick(e, item)}
                                  // onTouchStart={(e) => removeCheckList(e, item)}
                                >
                                  <GetIconFile
                                    data={{ width: "20px", height: "20px" }}
                                    iconName="remove-icon"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    {checkListActiveBtn === "subFloor" &&
                      singleCustomerData?.subfloor_details?.length > 1 &&
                      singleCustomerData?.subfloor_details?.map(
                        (item, index) => {
                          let color = item.color;
                          function isSubFloorMaterialPresent() {
                            return singleCustomerData.scope.floors.some(
                              (floor) =>
                                floor.rooms.some(
                                  (room) => room.subfloor_detail_id === item.id
                                )
                            );
                          }

                          // Check if the valid refinishing ID is present in any room
                          const isPresent = isSubFloorMaterialPresent();
                          return (
                            <div className="relative">
                              <Button
                                key={item?.id}
                                className={`checklist`}
                                onClick={() => {
                                  dispatch(
                                    setActiveSubFloorFloorDetailsChecklistId(
                                      item.id
                                    )
                                  );
                                  setSubQuesionsShow(false);
                                  setSubFLoorSubQuestionsShow(false);
                                }}
                                style={
                                  activeSubFloorFloorDetailsChecklistId !==
                                  item.id
                                    ? { border: `5px solid ${color}` }
                                    : { backgroundColor: `${color}` }
                                }
                              ></Button>
                              {!isPresent && (
                                <div
                                  className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                  onClick={(e) => handleRemoveClick(e, item)}
                                  // onTouchStart={(e) => handleRemoveClick(e, item)}
                                >
                                  <GetIconFile
                                    data={{ width: "20px", height: "20px" }}
                                    iconName="remove-icon"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    {checkListActiveBtn === "molding" &&
                      singleCustomerData?.molding?.length > 1 &&
                      singleCustomerData?.molding?.map((item, index) => {
                        let color = item.color;
                        function isSubFloorMaterialPresent() {
                          return singleCustomerData.scope.floors.some((floor) =>
                            floor.rooms.some(
                              (room) => room.molding_id === item.id
                            )
                          );
                        }

                        // Check if the valid refinishing ID is present in any room
                        const isPresent = isSubFloorMaterialPresent();
                        return (
                          <div className="relative">
                            <Button
                              key={item?.id}
                              className={`checklist`}
                              onClick={() => {
                                dispatch(setActiveMoldingChecklistId(item.id));
                              }}
                              style={
                                activeMoldingChecklistId !== item.id
                                  ? { border: `5px solid ${color}` }
                                  : { backgroundColor: `${color}` }
                              }
                            ></Button>
                            {!isPresent && (
                              <div
                                className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                onClick={(e) => handleRemoveClick(e, item)}
                                // onTouchStart={(e) => handleRemoveClick(e, item)}
                              >
                                <GetIconFile
                                  data={{ width: "20px", height: "20px" }}
                                  iconName="remove-icon"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <QueGrid container spacing={subQuesionsShow ? 1 : 2}>
                {checkListActiveBtn === "existingMaterials" &&
                  (!subQuesionsShow ? (
                    singleCustomerData?.existing_materials?.[
                      index
                    ]?.all_questions?.map((queObj) => {
                      return (
                        <MainQueGrid
                          key={queObj?.id}
                          queObj={queObj}
                          checkListIndex={index}
                          setSubQuesionsShow={setSubQuesionsShow}
                          setSubQuestions={setSubQuestions}
                          setSubofSubQuestions={setSubofSubQuestions}
                          storeKeyToUpdate="existing_materials"
                        />
                      );
                    })
                  ) : (
                    <>
                      {subQuestions?.subQuestions?.map((subQueObj, ind) => {
                        return (
                          <>
                            {ind == 0 && (
                              <SubQuestionHeader
                                key={subQueObj?.id}
                                question={subQuestions?.mainQuestion}
                                answer={subQuestions?.mainQuestionAnswer}
                                setSubQuesionsShow={setSubQuesionsShow}
                                checkListIndex={index}
                              />
                            )}
                            <SubQueGrid
                              queObj={subQueObj}
                              questionId={subQuestions?.questionId}
                              checkListIndex={index}
                              setSubQuesionsShow={setSubQuesionsShow}
                              setSubofSubQuestions={setSubofSubQuestions}
                              setSubofSubQuestionObj={setSubofSubQuestionObj}
                              subQuestions={subQuestions}
                              setSubQuestions={setSubQuestions}
                              storeKeyToUpdate="existing_materials"
                              hadMargin={true}
                            />
                          </>
                        );
                      })}
                      <SubOfSubGrid container spacing={1}>
                        {subofSubQuestions?.map((subofSubQue) => {
                          return (
                            <SubofSubQueGrid
                              key={subofSubQue?.id}
                              queObj={subofSubQue}
                              questionId={subQuestions?.questionId}
                              checkListIndex={index}
                              setSubQuesionsShow={setSubQuesionsShow}
                              subofSubQuestions={subofSubQuestions}
                              setSubofSubQuestions={setSubofSubQuestions}
                              storeKeyToUpdate="existing_materials"
                              hadMargin={true}
                            />
                          );
                        })}
                      </SubOfSubGrid>
                    </>
                  ))}
                {checkListActiveBtn === "subFloor" &&
                  (!subFLoorSubQuestionsShow ? (
                    singleCustomerData?.subfloor_details?.[
                      index
                    ]?.all_questions?.map((queObj) => {
                      return (
                        <SFMainQueGrid
                          key={queObj?.id}
                          queObj={queObj}
                          checkListIndex={index}
                          setSubFLoorSubQuestionsShow={
                            setSubFLoorSubQuestionsShow
                          }
                          setSubFloorSubQuestions={setSubFloorSubQuestions}
                          setSubofSubQuestions={setSubofSubQuestions}
                          storeKeyToUpdate="subfloor_details"
                        />
                      );
                    })
                  ) : (
                    <>
                      <SubQuestionHeader
                        question={subFloorSubQuestions?.mainQuestion}
                        answer={subFloorSubQuestions?.mainQuestionAnswer}
                        setSubQuesionsShow={setSubFLoorSubQuestionsShow}
                        checkListIndex={index}
                      />
                      <SFSubQueGrid
                        questionId={subFloorSubQuestions?.questionId}
                        checkListIndex={index}
                        setSubQuesionsShow={setSubQuesionsShow}
                        setSubofSubQuestions={setSubofSubQuestions}
                        setSubofSubQuestionObj={setSubofSubQuestionObj}
                        subQuestions={subQuestions}
                        subFloorSubQuestions={subFloorSubQuestions}
                        setSubFloorSubQuestions={setSubFloorSubQuestions}
                        setSubQuestions={setSubQuestions}
                        storeKeyToUpdate="subfloor_details"
                        hadMargin={false}
                        setIsDragEnabled={setIsDragEnabled}
                        setOpen={setOpen}
                        setType={setType}
                        setMessage={setMessage}
                      />
                    </>
                  ))}
                {checkListActiveBtn === "molding" &&
                  singleCustomerData?.molding?.[index]?.all_questions?.map(
                    (queObj) => {
                      return (
                        <MainQueGrid
                          key={queObj?.id}
                          queObj={queObj}
                          checkListIndex={index}
                          setSubofSubQuestions={setSubofSubQuestions}
                          storeKeyToUpdate="molding"
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      );
                    }
                  )}
              </QueGrid>
            </FirstGrid>
            <VerticalDivider />
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{
                width: "597px",
                pt: `${
                  Object.keys(activeRoomobj).length > 0 &&
                  `${Constants.PADDING_TOP_OF_ROOM_AREA} !important`
                } `,
              }}
            >
              {/* <div className="flex justify-start">
                {" "}
                <Button
                  // key={item?.id}
                  className={`checklist`}
                  onClick={() => {
                    // dispatch(
                    //   setActiveSubFloorFloorDetailsChecklistId(
                    //     item.id
                    //   )
                    // );
                    setSubQuesionsShow(false);
                    setSubFLoorSubQuestionsShow(false);
                  }}
                  style={{ backgroundColor: `#D8D8D8` }}
                ></Button>
              </div> */}
              {Object.keys(activeRoomobj).length > 0 ? (
                <div className="pr-[20px] pl-[20px] pb-[20px] ">
                  <RoomArea
                    setActiveRoomobj={setActiveRoomobj}
                    activeRoomobj={activeRoomobj}
                    setOpen={setOpen}
                    setMessage={setMessage}
                    setType={setType}
                    setIsDragEnabled={setIsDragEnabled}
                    hasHeader={true}
                  />
                </div>
              ) : (
                <>
                  <div className="flex gap-2 justify-center items-center w-full p-[20px]">
                    <OutOfScopeBtn
                      setIsDragEnabled={(value) => setIsDragEnabled(value)}
                      // itemKeyValue={name: "Out"}
                      type={"OutofScope"}
                      storeKey="levellings"
                      itemKey="OutOfScope"
                    />
                  </div>
                  <div className="pr-[20px] pl-[20px] pb-[20px] ">
                    <Button
                      className="text-[21px] m-auto !w-[540px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                      style={{ fontWeight: 500 }}
                      onClick={() => handleProjectLevel()}
                    >
                      Project
                    </Button>
                    <ProjectGrid container spacing={1}>
                      {addedFloors?.length > 0 &&
                        addedFloors.map((floor, index) => {
                          return (
                            <CLFloorDetailsProjectFloors
                              key={floor?.id}
                              addedFloors={addedFloors}
                              floor={floor}
                              index={index}
                              handleClickRoomArea={handleClickRoomArea}
                            />
                          );
                        })}
                    </ProjectGrid>
                  </div>
                </>
              )}
            </SecondGrid>
          </StyledGrid>

          {/* {Second Slide} */}
          <StyledGrid
            container
            key="slide2"
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{ width: "597px", padding: "20px 24px 30px 24px !important" }}
            >
              <div className="flex items-center justify-between gap-[8px] pl-0 pb-[10px]">
                <div className="space-x-2">
                  {existingScope?.refinishing?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "existingMaterials" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setCheckListActiveBtn("existingMaterials"))
                      }
                    >
                      E
                    </Button>
                  )}
                  {existingScope?.installation?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "subFloor" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setCheckListActiveBtn("subFloor"))
                      }
                    >
                      S
                    </Button>
                  )}
                  {(existingScope?.refinishing?.is_part ||
                    existingScope?.installation?.is_part) && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "molding" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() => dispatch(setCheckListActiveBtn("molding"))}
                    >
                      M
                    </Button>
                  )}
                </div>
              </div>
              <Text
                className="text-[21px] h-[40px] mt-[23px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>

              <ProjectGrid container spacing={1}>
                {summeryFloor.length > 0 &&
                  summeryFloor.map((floor, index) => {
                    return (
                      <CLFloorDetailsProjectFloorSummary
                        key={floor?.id}
                        addedFloors={summeryFloor}
                        floor={floor}
                        index={index}
                        setRoomMolding={setRoomMolding}
                        roomMolding={roomMolding}
                      />
                    );
                  })}
              </ProjectGrid>
            </SecondGrid>
            <VerticalDivider />
            {(checkListActiveBtn === "existingMaterials" ||
              checkListActiveBtn === "subFloor") && (
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "80px",
                  alignItems: "top",
                  padding: "10px",
                  gap: "14px",
                  height: "400px",
                  flexDirection: "column",
                }}
              >
                <div className="flex justify-center gap-3 mb-5">
                  {existingScope?.refinishing?.is_part &&
                    store.checkListActiveBtn === "existingMaterials" &&
                    summaryQuestions?.map((que) => {
                      return (
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            onQuesClick(
                              que?.question,
                              que?.quesType,
                              que?.questionToShow
                            )
                          }
                          className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full flex mx-1 justify-center items-center text-sm ${
                            showKey === que?.question
                              ? "text-white"
                              : "text-black"
                          }`}
                          style={
                            showKey === que?.question
                              ? { backgroundColor: "#1E2E5A" }
                              : {}
                          }
                        >
                          {que?.questionToShow}
                        </motion.div>
                      );
                    })}
                  {existingScope?.installation?.is_part &&
                    store.checkListActiveBtn === "subFloor" &&
                    summarySubFloorQuestions?.map((que) => {
                      return (
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            onQuesClick(
                              que?.question,
                              que?.quesType,
                              que?.questionToShow
                            )
                          }
                          className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full mx-3 flex justify-center items-center text-sm ${
                            showKey === que?.question
                              ? "text-white"
                              : "text-black"
                          }`}
                          style={
                            showKey === que?.question
                              ? { backgroundColor: "#1E2E5A" }
                              : {}
                          }
                        >
                          {que?.questionToShow}
                        </motion.div>
                      );
                    })}
                </div>
                {showQuestion?.questionName && (
                  <NodeChart
                    setIsDragEnabled={setIsDragEnabled}
                    o={showQuestion}
                  />
                )}
              </Grid>
            )}
            {checkListActiveBtn === "molding" && (
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "80px",
                  alignItems: "top",
                  padding: "10px",
                  gap: "14px",
                  height: "400px",
                  flexDirection: "column",
                }}
              >
                <>
                  <Text className="mt-[10px] text-[20px] font-semibold">
                    Summary
                  </Text>
                  {roomMolding?.roomId ? (
                    <>
                      {Object.keys(roomMolding?.molding || {}).length !== 0 ? (
                        <MoldingSummary
                          activeSummary={roomMolding}
                          setIsDragEnabled={setIsDragEnabled}
                          objectKey="molding"
                        />
                      ) : (
                        <div className="h-[300px] flex justify-center items-center">
                          <h3>No summary in this room</h3>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-[300px] flex justify-center items-center">
                      <h3>Please select room</h3>
                    </div>
                  )}
                </>
              </Grid>
            )}
          </StyledGrid>
        </Slider>
      </CarouselContainer>
      {dialogOpen && (
        <RemoveDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemove}
          text="Are you sure you want to remove this checklist ?"
          title="Remove Confirmation"
        />
      )}
    </>
  );
};

export default FloorDetailsCheckListForm;
