import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import { updateSingleCustomerApi } from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import MuiSnackbar from "../UI/MuiSnackbar";
import Button from "../UI/Button";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import GetIconFile from "../../assets/GetIconFile";
import { usePreview } from "react-dnd-preview";
import CLRepairProjectFloorSummary from "../UI/CheckList/Repair/CLRepairProjectFloorSummary";
import FromToBtn from "../UI/CheckList/StairCaseCheckListBtns/FromToBtn";
import { transitionCheckList } from "../../utils/transitionCheckList";
import CLTransitionProjectFloors from "../UI/CheckList/TransitionCheckListBtns/CLTransitionProjectFloors";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import SummaryCard from "../UI/SummaryCard";
import CLCommonSummaryButton from "../UI/CLCommonSummaryButton";
import RoomArea from "../RoomAreaComponent/RoomArea";
import TransitionSummary from "../UI/CheckList/TransitionCheckListBtns/TransitionSummary";
import { Constants } from "../../utils/Constants";

const StyledGrid = styled(Grid)({
  height: "100%",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  padding: "27px 20px",
  height: "100%",
});

const QueGrid = styled(Grid)({
  padding: "6px 24px 17px 24px",
});

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
      bottom: -72px;
    }

    .slick-dots li button:before {
      color: gray; 
      font-size: 20px !important;
    }
    .slick-list{
      overflow:visible;
    }
  `;

const TransitionCheckListForm = () => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );

  const { register, errors, watch, getValues, setValue, control } =
    useReactHookForm({
      defaultValues: {
        repair_description: "",
      },
      mode: "onBlur",
    });

  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
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

  const [roomRepairs, setRoomRepairs] = useState({ roomId: "", repairs: [] });

  const [activeTransitionId, setActiveTransitionId] = useState("");
  const [activeTransitionSummary, setActiveTransitionSummary] = useState({});
  const [activeTransitionObj, setActiveTransitionObj] = useState({
    id: "",
    from_room_id: "",
    to_room_id: "",
    within_room_id: "",
    all_questions: [],
  });

  useEffect(() => {
    if (!activeTransitionId && singleCustomerData?.transitions?.length > 0) {
      setActiveTransitionId(singleCustomerData.transitions[0].id);
    }
  }, []);

  const index = React.useMemo(() => {
    return (
      singleCustomerData?.transitions?.findIndex(
        (item) => item?.id === activeTransitionId
      ) || 0
    );
  }, [activeTransitionId]);

  useEffect(() => {
    if (activeTransitionId) {
      let findObj = singleCustomerData.transitions.find(
        ({ id }) => id === activeTransitionId
      );
      if (findObj) {
        /**
         *  we have set the question "Length" in all old customers, and now we want to render the question "Length" as below, so we are just updating it run time, but it will be pushed to the backend as a "Length" not as a "Length (in feet)".
         */
        const udpateTransitionWithQueObj = {
          ...findObj,
          all_questions: findObj.all_questions.map((item) => {
            if (item.question === "Length") {
              return { ...item, question: "Length (in feet)" };
            }
            return item;
          }),
          id: uuidv4(),
        };

        setActiveTransitionObj(udpateTransitionWithQueObj);
        setValue("repair_description", findObj?.repair_description);
      } else {
        setActiveTransitionObj({
          id: "",
          from_room_id: "",
          to_room_id: "",
          within_room_id: "",
          all_questions: [],
        });
        setValue("repair_description", "");
        setActiveTransitionId("");
      }
    }
  }, [activeTransitionId, singleCustomerData]);

  const [summeryFloor, setSummeryFloor] = useState([]);

  useEffect(() => {
    setSummeryFloor(addedFloors);
    setActiveTransitionSummary({});
    setRoomRepairs({ roomId: "", repairs: [] });
  }, [singleCustomerData]);

  const addMoreTransition = () => {
    const createNewTransition = () => {
      let transitionImport = JSON.parse(JSON.stringify(transitionCheckList));

      function updateIds(obj) {
        obj.id = uuidv4();

        if (obj.subQuestion && obj.subQuestion.length > 0) {
          for (const subQ of obj.subQuestion) {
            updateIds(subQ);
          }
        }
      }

      for (const item of transitionImport) {
        updateIds(item);
      }

      return {
        id: uuidv4(),
        from_room_id: "",
        within_room_id: "",
        to_room_id: "",
        all_questions: transitionImport,
      };
    };

    const lastStaircase =
      singleCustomerData.transitions[singleCustomerData.transitions.length - 1];

    if (
      singleCustomerData.transitions.length === 0 ||
      (lastStaircase.from_room_id && lastStaircase.to_room_id) ||
      lastStaircase.within_room_id
    ) {
      const newTransition = createNewTransition();

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          transitions: [...singleCustomerData.transitions, newTransition],
        })
      );

      setActiveTransitionId(newTransition.id);
    }
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
          !text-white !text-[16px] !font-medium !w-[78px] !h-[78px]  ${
            item.type === "From"
              ? "!bg-[#8EC24A]"
              : item.type === "Within"
              ? "!bg-[#1A65D6]"
              : "!bg-[#F8842F]"
          } mb-[15px] z-[5000]`}
          animate={{
            opacity: 0.7,
          }}
        >
          {item.type}
        </motion.button>
      </div>
    );
  };

  const removeTransition = (transition) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    const updatedTransitionArray = updatedSingleCustomer.transitions.filter(
      (singleTransition) => singleTransition.id !== transition.id
    );
    updatedSingleCustomer.transitions = updatedTransitionArray;

    const transitionIdToRemove = transition.id;
    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      transition_from_ids: floor.transition_from_ids?.filter(
        (id) => id !== transitionIdToRemove
      ),
      transition_to_ids: floor.transition_to_ids?.filter(
        (id) => id !== transitionIdToRemove
      ),
      transition_within_ids: floor.transition_within_ids?.filter(
        (id) => id !== transitionIdToRemove
      ),
    }));

    updatedSingleCustomer.scope.floors = updatedFloor;

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    if (updatedSingleCustomer?.transitions?.length > 0) {
      setActiveTransitionId(
        updatedSingleCustomer?.transitions?.[
          updatedSingleCustomer?.transitions?.length - 1
        ]?.id
      );
    } else {
      setActiveTransitionId("");
      setActiveTransitionObj({
        id: "",
        from_room_id: "",
        to_room_id: "",
        within_room_id: "",
        all_questions: [],
      });
    }
  };

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
    removeTransition(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleClickRoomArea = (e, roomObj) => {
    e.stopPropagation();
    setActiveRoomobj(roomObj);
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
            <FirstGrid item xs={12} md={6} sx={{ maxWidth: "590px" }}>
              <div className="flex items-center justify-center gap-[15px] pt-[10px] m-[20px]">
                <div
                  className={`flex max-w-[430px] overflow-x-auto ${
                    singleCustomerData.transitions.length > 0 && "min-w-[90px]"
                  } min-h-[90px]`}
                >
                  <div
                    className="space-x-2 flex justify-center items-center mx-3"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {singleCustomerData.transitions.length > 0 &&
                      singleCustomerData.transitions.map((stair, index) => {
                        const areAllQuestionsAnswered = (questionsArray) => {
                          for (const question of questionsArray) {
                            if (
                              typeof question.answer === "string" &&
                              question.answer.trim() === ""
                            ) {
                              return false;
                            }

                            if (
                              Array.isArray(question.answer) &&
                              question.answer.length === 0
                            ) {
                              return false;
                            }

                            if (
                              question.subQuestion &&
                              question.subQuestion.length > 0
                            ) {
                              if (
                                !areAllQuestionsAnswered(question.subQuestion)
                              ) {
                                return false;
                              }
                            }
                          }

                          return true;
                        };

                        const isStaircaseValid = (stair) => {
                          return areAllQuestionsAnswered(stair.all_questions);
                        };

                        const isValid = isStaircaseValid(stair);
                        return (
                          <button
                            className={`round-small-btn ${
                              stair.id === activeTransitionId
                                ? "!w-[78px] !h-[78px] "
                                : ""
                            } ${isValid ? "!bg-[#009DC2] !text-white" : ""}
                     !text-[28px] !font-medium relative `}
                            onClick={() => setActiveTransitionId(stair.id)}
                            onTouchStart={() => setActiveTransitionId(stair.id)}
                          >
                            {index + 1}
                            <div
                              className={`absolute ${
                                stair.id === activeTransitionId
                                  ? "-top-1 -right-1"
                                  : "-top-0.5 -right-0.5"
                              }
                                  
                              } rounded-full bg-white padding-2.5`}
                              onClick={(e) => handleRemoveClick(e, stair)}
                              onTouchStart={(e) => handleRemoveClick(e, stair)}
                            >
                              <GetIconFile
                                data={{ width: "24px", height: "24px" }}
                                iconName="remove-icon"
                              />
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
                <Button
                  className={`round-small-btn 
                      !text-[#D8D8D8] !text-[28px] !font-medium !w-[64px]`}
                  onClick={() => addMoreTransition()}
                >
                  +
                </Button>
              </div>
              <QueGrid container spacing={1}>
                {activeTransitionObj?.all_questions?.length > 0 &&
                  activeTransitionObj?.all_questions?.map((queObj) => {
                    return (
                      <MainQueGrid
                        key={queObj?.id}
                        queObj={queObj}
                        checkListIndex={index}
                        setIsDragEnabled={setIsDragEnabled}
                        setSubQuesionsShow={() => {}}
                        storeKeyToUpdate="transitions"
                      />
                    );
                  })}
              </QueGrid>
            </FirstGrid>
            <VerticalDivider />
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{
                width: "590px",
                pt: `${
                  Object.keys(activeRoomobj).length > 0 &&
                  `${Constants.PADDING_TOP_OF_ROOM_AREA} !important`
                } `,
              }}
            >
              {Object.keys(activeRoomobj).length > 0 ? (
                <RoomArea
                  setActiveRoomobj={setActiveRoomobj}
                  activeRoomobj={activeRoomobj}
                  setOpen={setOpen}
                  setMessage={setMessage}
                  setType={setType}
                  setIsDragEnabled={setIsDragEnabled}
                  hasHeader={true}
                />
              ) : (
                <>
                  <div className="flex gap-2 justify-center items-center w-full">
                    {["From", "Within", "To"].map((type, idx) => {
                      return (
                        <FromToBtn
                          key={idx}
                          setIsDragEnabled={(value) => setIsDragEnabled(value)}
                          itemKeyValue={activeTransitionObj}
                          type={type}
                          storeKey="transitions"
                          itemKey="transition"
                        />
                      );
                    })}
                  </div>
                  <Text
                    className="text-[21px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                    style={{ fontWeight: 500 }}
                  >
                    Project
                  </Text>
                  <ProjectGrid container spacing={1}>
                    {addedFloors?.length > 0 &&
                      addedFloors.map((floor, index) => {
                        return (
                          <CLTransitionProjectFloors
                            key={floor?.id}
                            addedFloors={addedFloors}
                            floor={floor}
                            index={index}
                            activeTransitionObj={activeTransitionObj}
                            handleClickRoomArea={handleClickRoomArea}
                          />
                        );
                      })}
                  </ProjectGrid>
                </>
              )}
            </SecondGrid>
          </StyledGrid>

          {/* {Second Slide} */}
          <StyledGrid container>
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{
                width: "597px",
                // padding: "100px 30px 30px 30px !important",
              }}
            >
              <Text
                className="text-[21px] h-[40px] mt-[92px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                style={{ fontWeight: 500 }}
              >
                Transitions
              </Text>

              <ProjectGrid container spacing={1}>
                {singleCustomerData?.transitions?.length > 0 &&
                  singleCustomerData?.transitions?.map((transition, index) => {
                    return (
                      <CLCommonSummaryButton
                        key={transition?.id}
                        activeObjKey="transition"
                        storeKeyValue={transition}
                        index={index + 1}
                        setActiveTransitionSummary={setActiveTransitionSummary}
                        activeTransitionSummary={activeTransitionSummary}
                        type="button"
                        className="justify-center max-w-[130px]"
                        buttonName="Transition"
                        within_id="within_room_id"
                        from_id="from_room_id"
                        to_id="to_room_id"
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
                width: "590px",
                display: "flex",
                justifyContent: "start",
                marginTop: "10px",
                alignItems: "center",
                padding: "10px",
                gap: "14px",
                height: "100%",
                overflowX: "auto",
                flexDirection: "column",
              }}
            >
              {activeTransitionSummary?.transition?.id && (
                <>
                  <Text className="mt-[105px] text-[20px] font-semibold">
                    {activeTransitionSummary?.buttonName}
                  </Text>
                  <TransitionSummary
                    activeSummary={activeTransitionSummary}
                    setIsDragEnabled={setIsDragEnabled}
                    objectKey="transition"
                  />
                </>
              )}
            </Grid>
          </StyledGrid>
        </Slider>
      </CarouselContainer>
      <RemoveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        text="Are you sure you want to remove this Transition ?"
        title="Remove Confirmation"
      />
    </>
  );
};

export default TransitionCheckListForm;
