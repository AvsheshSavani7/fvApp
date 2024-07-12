import React, { useEffect, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import {
  setActiveRefinishingCheckListId,
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
import CheckListProjectFloors from "../UI/CheckList/CheckListBtns/CheckListProjectFloors";
import { refishingCheckList } from "../../utils/checkList";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import SubQuestionHeader from "../UI/CheckList/SubQuestionHeader";
import SubQueGrid from "../UI/QuestionTypes/SubQueGrid";
import SubofSubQueGrid from "../UI/QuestionTypes/SubofSubQueGrid";
import CheckListProjectFloorSummary from "../UI/CheckList/CheckListBtns/CheckListProjectFloorSummary";
import GetIconFile from "../../assets/GetIconFile";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import RoomArea from "../RoomAreaComponent/RoomArea";
import { Constants } from "../../utils/Constants";
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
  padding: "11px 24px 0 31px",
  overflow: "hidden",
  maxHeight: "400px",
});

const SubOfSubGrid = styled(Grid)((props) => ({
  padding: "2px 0 0 9px",
  overflowY: "auto",
  overflowX: "hidden",
  maxHeight: `${props.maxHeight}`, // Use the dynamic maxHeight prop here
  marginTop: "-3px",
}));

const ProjectGrid = styled(Grid)({
  padding: "16px 0",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});

const CarouselContainer = styled("div")({
  minHeight: "624px",
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

const CheckListForm = () => {
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
  const activeRefinihsingChecklistId = useSelector(
    (state) => state.customerReducer.activeRefinihsingChecklistId
  );
  const store = useSelector((state) => state.customerReducer);

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
    // setDebouncedDialogOpen(false);
  };

  useEffect(() => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (activeBtnKey === "checklist" && checkListActiveBtn === "refinishing") {
      if (singleCustomerData.refinishing_checklists?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: refishingCheckList,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms.map((room) => ({
            ...room,
            refinishing_checklists_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.refinishing_checklists = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveRefinishingCheckListId(newCheckList.id));

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  }, [activeBtnKey, checkListActiveBtn]);

  useEffect(() => {
    if (
      activeBtnKey === "checklist" &&
      checkListActiveBtn === "refinishing" &&
      singleCustomerData.refinishing_checklists?.length > 0
    ) {
      dispatch(
        setActiveRefinishingCheckListId(
          singleCustomerData.refinishing_checklists[0].id
        )
      );
    }
  }, []);

  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [subQuesionsShow, setSubQuesionsShow] = React.useState(false);
  const [subQuestions, setSubQuestions] = React.useState({});
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

  const index = singleCustomerData?.refinishing_checklists?.findIndex(
    (item) => item?.id === activeRefinihsingChecklistId
  );

  const [showKey, setShowKey] = useState("");
  const [showQue, setShowQue] = useState("");

  const [summeryFloor, setSummeryFloor] = useState([]);
  useEffect(() => {
    setSummeryFloor(addedFloors);
    setShowKey("");
    setShowQue("");
  }, [singleCustomerData]);

  const onClickQuestion = (Question, type) => {
    if (showKey === type) {
      setShowKey("");
      setShowQue("");
      setSummeryFloor(addedFloors);
    } else {
      let floors = JSON.parse(JSON.stringify(addedFloors));

      if (store.checkListActiveBtn === "refinishing") {
        for (let index = 0; index < floors.length; index++) {
          for (let j = 0; j < floors[index].rooms.length; j++) {
            const refinishingCheckListId =
              floors[index].rooms[j].refinishing_checklists_id;

            if (
              refinishingCheckListId &&
              refinishingCheckListId !== "OutOfScope"
            ) {
              let checklistObject =
                singleCustomerData.refinishing_checklists.find(
                  ({ id }) => id === refinishingCheckListId
                );

              let questionObj = checklistObject?.all_questions.find(
                ({ question }) => question === Question
              );

              if (questionObj?.answer === true) {
                floors[index].rooms[j] = {
                  ...floors[index].rooms[j],
                  bgColor: "#1E2E5A",
                };
              } else if (questionObj?.answer === "none") {
                floors[index].rooms[j] = {
                  ...floors[index].rooms[j],
                  bgColor: "#D8D8D8",
                };
              } else {
                floors[index].rooms[j] = {
                  ...floors[index].rooms[j],
                  bgColor: "#E57D1D",
                };
              }
            } else if (refinishingCheckListId === "OutOfScope") {
              floors[index].rooms[j] = {
                ...floors[index].rooms[j],
                bgColor: "#D8D8D8",
              };
            } else {
              floors[index].rooms[j] = {
                ...floors[index].rooms[j],
                bgColor: "",
              };
            }
          }
        }

        setSummeryFloor(floors);
      }

      setShowKey(type);
      setShowQue(Question);
    }
  };

  const handleProjectLevel = () => {
    let checkListIdArray = [];
    singleCustomerData.scope.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        checkListIdArray.push(room.refinishing_checklists_id);
      });
    });
    const isAllRoomSameId = checkListIdArray.every(
      (item) => item === activeRefinihsingChecklistId
    );
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (isAllRoomSameId) {
      let refinishingIds = [];
      updatedSingleCustomer?.scope?.floors.map((entry) =>
        entry.rooms.map((room) =>
          refinishingIds.push(room.refinishing_checklists_id)
        )
      );

      const isChecklistUsed =
        updatedSingleCustomer?.refinishing_checklists?.every((checklist) =>
          refinishingIds.includes(checklist.id)
        );

      let newColor;
      if (singleCustomerData.refinishing_checklists.length >= 1) {
        if (singleCustomerData.refinishing_checklists.length < 5) {
          let existingColors = singleCustomerData.refinishing_checklists.map(
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
          updatedSingleCustomer?.refinishing_checklists?.map((CheckList) =>
            usedColor.push(CheckList.color)
          );
          newColor = generateRandomColor(usedColor);
        }

        let refinishingImport = JSON.parse(JSON.stringify(refishingCheckList));

        function updateIds(obj) {
          obj.id = uuidv4();

          if (obj.subQuestion && obj.subQuestion.length > 0) {
            for (const subQ of obj.subQuestion) {
              updateIds(subQ);
            }
          }
        }

        for (const item of refinishingImport) {
          updateIds(item);
        }

        let newCheckList = {
          id: uuidv4(),
          color: newColor,
          all_questions: refinishingImport,
        };
        // let floors = [...updatedSingleCustomer.scope.floors];

        // const updatedData = floors.map((item) => ({
        //   ...item,
        //   rooms: item.rooms.map((room) => ({
        //     ...room,
        //     refinishing_checklists_id:
        //       room.id === roomId ? "" : room.refinishing_checklists_id,
        //   })),
        // }));

        const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
          (item) => ({
            ...item,
            refinishing_checklists_id: "",
          })
        );

        updatedSingleCustomer.scope.floors[index] = {
          ...updatedSingleCustomer.scope.floors[index],
          rooms: updatedData,
        };
        if (isChecklistUsed) {
          updatedSingleCustomer.refinishing_checklists = [
            ...updatedSingleCustomer.refinishing_checklists,
            newCheckList,
          ];
        }
        // updatedSingleCustomer.scope.floors = updatedData;

        // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
      updatedSingleCustomer.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          room.refinishing_checklists_id = "";
        });
      });

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    } else {
      updatedSingleCustomer.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          room.refinishing_checklists_id = activeRefinihsingChecklistId;
        });
      });

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    }
  };

  const removeCheckList = (checkList) => {
    // e.stopPropagation();
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    const updatedCheckListArray =
      updatedSingleCustomer.refinishing_checklists.filter(
        (singleRefinishingCL) => singleRefinishingCL.id !== checkList.id
      );
    updatedSingleCustomer.refinishing_checklists = updatedCheckListArray;

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    if (updatedSingleCustomer?.refinishing_checklists?.length > 0) {
      if (
        checkListActiveBtn === "refinishing" &&
        activeRefinihsingChecklistId === checkList.id
      ) {
        dispatch(
          setActiveRefinishingCheckListId(
            updatedSingleCustomer.refinishing_checklists[
              updatedSingleCustomer.refinishing_checklists.length - 1
            ].id
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
          {checkListActiveBtn === "refinishing" && " Refinishing"}
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
                  {/* {existingScope?.refinishing?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "refinishing" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setCheckListActiveBtn("refinishing"))
                      }
                    >
                      R
                    </Button>
                  )}
                  {existingScope?.installation?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "installation" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setCheckListActiveBtn("installation"))
                      }
                    >
                      I
                    </Button>
                  )} */}
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
                    {checkListActiveBtn === "refinishing"
                      ? singleCustomerData?.refinishing_checklists?.length >
                          1 &&
                        singleCustomerData?.refinishing_checklists.map(
                          (item, index) => {
                            let color = item.color;

                            function isRefinishingIdPresent() {
                              return singleCustomerData.scope.floors.some(
                                (floor) =>
                                  floor.rooms.some(
                                    (room) =>
                                      room.refinishing_checklists_id === item.id
                                  )
                              );
                            }

                            // Check if the valid refinishing ID is present in any room
                            const isPresent = isRefinishingIdPresent();
                            return (
                              <div className="relative">
                                <Button
                                  key={item?.id}
                                  className={`checklist`}
                                  onClick={() => {
                                    dispatch(
                                      setActiveRefinishingCheckListId(item.id)
                                    );
                                    setSubQuesionsShow(false);
                                  }}
                                  style={
                                    activeRefinihsingChecklistId !== item.id
                                      ? { border: `5px solid ${color}` }
                                      : { backgroundColor: `${color}` }
                                  }
                                >
                                  {" "}
                                </Button>
                                {!isPresent && (
                                  <button
                                    className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                    onClick={(e) => handleRemoveClick(e, item)}
                                    // onTouchStart={(e) => removeCheckList(e, item)}
                                  >
                                    <GetIconFile
                                      data={{ width: "20px", height: "20px" }}
                                      iconName="remove-icon"
                                    />
                                  </button>
                                )}
                              </div>
                            );
                          }
                        )
                      : ""}
                  </div>
                </div>
              </div>

              <QueGrid container spacing={subQuesionsShow ? 1 : 2}>
                {checkListActiveBtn == "refinishing" ? (
                  !subQuesionsShow ? (
                    singleCustomerData?.refinishing_checklists?.[
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
                          storeKeyToUpdate="refinishing_checklists"
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
                              storeKeyToUpdate="refinishing_checklists"
                              setIsDragEnabled={setIsDragEnabled}
                            />
                          </>
                        );
                      })}
                      <SubOfSubGrid
                        container
                        spacing={1}
                        maxHeight={
                          subQuestions?.mainQuestion ===
                          "Excessive damage (ex. pet stains,cracked boards)"
                            ? "170px"
                            : subQuestions?.mainQuestion ===
                              "Surface issues ( ex. mastic, paint, wax)"
                            ? "224px"
                            : "224px"
                        }
                      >
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
                              storeKeyToUpdate="refinishing_checklists"
                              setIsDragEnabled={setIsDragEnabled}
                            />
                          );
                        })}
                      </SubOfSubGrid>
                    </>
                  )
                ) : (
                  ""
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
                            <CheckListProjectFloors
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
            {/* <div
              className={` h-[390px] absolute -right-[1px] translate-x-[-1px] top-0 sm:h-[645px] lg:h-[584px] flex justify-center items-center w-[2px] m-auto bg-gray-300 pt-6`}
            ></div> */}
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
              {/* <div className="flex items-center justify-between gap-[8px] pl-0 pb-[36px]"> */}
              {/* <div className="space-x-2">
                  <Button
                    className={`round-small-btn ${
                      checkListActiveBtn === "refinishing" &&
                      "!bg-[#009DC2] !text-white"
                    } !text-[28px] !font-medium`}
                    onClick={() =>
                      dispatch(setCheckListActiveBtn("refinishing"))
                    }
                  >
                    R
                  </Button>
                  <Button
                    className={`round-small-btn ${
                      checkListActiveBtn === "installation" &&
                      "!bg-[#009DC2] !text-white"
                    }  !text-[28px] !font-medium`}
                    onClick={() =>
                      dispatch(setCheckListActiveBtn("installation"))
                    }
                  >
                    I
                  </Button>
                </div> */}
              {/* </div> */}
              <Text
                className="text-[21px] h-[40px] mt-[98px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>

              <ProjectGrid container spacing={1}>
                {summeryFloor.length > 0 &&
                  summeryFloor.map((floor, index) => {
                    return (
                      <CheckListProjectFloorSummary
                        key={floor?.id}
                        addedFloors={summeryFloor}
                        floor={floor}
                        index={index}
                      />
                    );
                  })}
              </ProjectGrid>
            </SecondGrid>
            <VerticalDivider />
            <Grid
              item
              xs={12}
              md={6}
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
                marginTop: "100px",
                alignItems: "top",
                padding: "10px",
                gap: "14px",
                height: "350px",
              }}
            >
              {/* First Bubble */}
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    onClickQuestion("Can Floor be buffed & recoated?", "A")
                  }
                  className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full flex justify-center items-center text-sm ${
                    showKey === "A" ? "text-white" : "text-black"
                  }`}
                  style={showKey === "A" ? { backgroundColor: "#1E2E5A" } : {}}
                >
                  Buffed & Recoated
                </motion.div>
                <div className="block absolute" style={{ left: "-35%" }}>
                  <Collapse in={showKey === "A" ? true : false}>
                    <div className="w-[2px] h-[51px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="w-[94px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="flex gap-x-3">
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium bg-[#1E2E5A] text-white text-sm
                              `}
                        >
                          Yes
                        </Button>
                      </div>
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] bg-[#E57D1D] p-2 text-xs text-white font-medium `}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    onClickQuestion(
                      "Confirmation of enough material for sanding?",
                      "B"
                    )
                  }
                  className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full flex justify-center items-center text-sm ${
                    showKey === "B" ? "text-white" : "text-black"
                  }`}
                  style={showKey === "B" ? { backgroundColor: "#1E2E5A" } : {}}
                >
                  Enough material for sanding?
                </motion.div>
                <div className="block absolute" style={{ left: "-35%" }}>
                  <Collapse in={showKey === "B" ? true : false}>
                    <div className="w-[2px] h-[51px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="w-[94px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="flex gap-x-3">
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium bg-[#1E2E5A] text-white
                              `}
                          s
                        >
                          Yes
                        </Button>
                      </div>
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] bg-[#E57D1D] p-2 text-xs text-white font-medium `}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    onClickQuestion(
                      "Excessive damage (ex. pet stains,cracked boards)",
                      "C"
                    )
                  }
                  className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full flex justify-center items-center text-sm ${
                    showKey === "C" ? "text-white" : "text-black"
                  }`}
                  style={showKey === "C" ? { backgroundColor: "#1E2E5A" } : {}}
                >
                  Excessive damage
                </motion.div>
                <div className="block absolute" style={{ left: "-35%" }}>
                  <Collapse in={showKey === "C" ? true : false}>
                    <div className="w-[2px] h-[51px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="w-[94px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="flex gap-x-3">
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium bg-[#1E2E5A] text-white text-sm
                              `}
                          s
                        >
                          Yes
                        </Button>
                      </div>
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] bg-[#E57D1D] p-2 text-xs text-white font-medium `}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    onClickQuestion(
                      "Surface issued ( ex. mastic, paint, wax)",
                      "D"
                    )
                  }
                  className={`w-[100px] h-[100px] border-[#AEAEAE] border-2 rounded-full flex justify-center items-center text-sm ${
                    showKey === "D" ? "text-white" : "text-black"
                  }`}
                  style={showKey === "D" ? { backgroundColor: "#1E2E5A" } : {}}
                >
                  Surface issued
                </motion.div>
                <div className="block absolute" style={{ left: "-35%" }}>
                  <Collapse in={showKey === "D" ? true : false}>
                    <div className="w-[2px] h-[51px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="w-[94px] h-[2px] flex m-auto justify-center bg-[#20202033]"></div>
                    <div className="flex gap-x-3">
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] p-2 text-xs font-medium bg-[#1E2E5A] text-white text-sm
                              `}
                          s
                        >
                          Yes
                        </Button>
                      </div>
                      <div>
                        <div className="w-[2px] h-[50px] flex m-auto justify-center bg-[#20202033]"></div>
                        <Button
                          className={`rounded-full w-[80px] h-[80px] border-solid border-2 border-[#AEAEAE] bg-[#E57D1D] p-2 text-xs text-white font-medium `}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </Grid>
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

export default CheckListForm;
