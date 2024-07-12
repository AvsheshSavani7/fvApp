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
import _, { debounce } from "lodash";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import MuiSnackbar from "../UI/MuiSnackbar";
import Button from "../UI/Button";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import GetIconFile from "../../assets/GetIconFile";
import { usePreview } from "react-dnd-preview";
import CLRepairProjectFloorSummary from "../UI/CheckList/Repair/CLRepairProjectFloorSummary";
import { stairCaseCheckList } from "../../utils/stairCaseCheckList";
import FromToBtn from "../UI/CheckList/StairCaseCheckListBtns/FromToBtn";
import CLStairCaseProjectFloors from "../UI/CheckList/StairCaseCheckListBtns/CLStairCaseProjectFloors";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import SubQuestionHeader from "../UI/CheckList/SubQuestionHeader";
import SubQueGrid from "../UI/QuestionTypes/SubQueGrid";
import CLCommonSummaryButton from "../UI/CLCommonSummaryButton";
import SummaryCard from "../UI/SummaryCard";
import StairCaseSummary from "../UI/CheckList/StairCaseCheckListBtns/StairCaseSummary";

const StyledGrid = styled(Grid)({
  height: "100%",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  padding: "27px 24px",
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

const StairCaseCheckListForm = () => {
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
  const [subQuesionsShow, setSubQuesionsShow] = React.useState(false);
  const [subQuestions, setSubQuestions] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [activeStaircaseSummary, setActiveStaircaseSummary] = useState({});

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

  const [activeStairCaseId, setActiveStairCaseId] = useState("");
  const [activeStairCaseObj, setActiveStairCaseObj] = useState({
    id: "",
    from_floor_id: "",
    to_floor_id: "",
    all_questions: [],
  });

  useEffect(() => {
    if (!activeStairCaseId && singleCustomerData?.staircases?.length > 0) {
      setActiveStairCaseId(singleCustomerData.staircases[0].id);
    }
  }, []);

  const index = React.useMemo(() => {
    return (
      singleCustomerData?.staircases?.findIndex(
        (item) => item?.id === activeStairCaseId
      ) || 0
    );
  }, [activeStairCaseId]);

  useEffect(() => {
    if (activeStairCaseId) {
      let findObj = singleCustomerData.staircases.find(
        ({ id }) => id === activeStairCaseId
      );
      if (findObj) {
        setActiveStairCaseObj(findObj);
        setValue("repair_description", findObj?.repair_description);
      } else {
        setActiveStairCaseObj({
          id: "",
          from_floor_id: "",
          to_floor_id: "",
          all_questions: [],
        });
        setValue("repair_description", "");
        setActiveStairCaseId("");
      }
    }
  }, [activeStairCaseId, singleCustomerData]);

  const [summeryFloor, setSummeryFloor] = useState([]);

  useEffect(() => {
    setSummeryFloor(addedFloors);
    setActiveStaircaseSummary([]);
    setRoomRepairs({ roomId: "", repairs: [] });
  }, [singleCustomerData]);

  const addMoreRepair = () => {
    const createNewStaircase = () => {
      let stairCaseImport = JSON.parse(JSON.stringify(stairCaseCheckList));

      function updateIds(obj) {
        obj.id = uuidv4();
        if (obj?.question === "Name of Staircase") {
          const curStaircaseLength = singleCustomerData.staircases.length;
          obj.answer = `Staircase ${curStaircaseLength + 1}`;
        }

        if (obj.subQuestion && obj.subQuestion.length > 0) {
          for (const subQ of obj.subQuestion) {
            updateIds(subQ);
          }
        }
      }

      for (const item of stairCaseImport) {
        updateIds(item);
      }

      return {
        id: uuidv4(),
        from_floor_id: "",
        to_floor_id: "",
        repair_ids: [],
        all_questions: stairCaseImport,
      };
    };

    const lastStaircase =
      singleCustomerData.staircases[singleCustomerData.staircases.length - 1];

    if (
      singleCustomerData.staircases.length === 0 ||
      lastStaircase.from_floor_id ||
      lastStaircase.to_floor_id
    ) {
      const newStaircase = createNewStaircase();

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          staircases: [...singleCustomerData.staircases, newStaircase],
        })
      );

      setActiveStairCaseId(newStaircase.id);
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
            item.type === "From" ? "!bg-[#8EC24A]" : "!bg-[#F8842F]"
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

  const removeRepair = (stair) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    const updatedRepairArray = updatedSingleCustomer.staircases.filter(
      (singleStair) => singleStair.id !== stair.id
    );
    updatedSingleCustomer.staircases = updatedRepairArray;

    const stairIdToRemove = stair.id;
    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      staircase_from_ids: floor.staircase_from_ids?.filter(
        (id) => id !== stairIdToRemove
      ),
      staircase_to_ids: floor.staircase_to_ids?.filter(
        (id) => id !== stairIdToRemove
      ),
    }));

    updatedSingleCustomer.scope.floors = updatedFloor;

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    if (updatedSingleCustomer?.staircases?.length > 0) {
      setActiveStairCaseId(
        updatedSingleCustomer?.staircases?.[
          updatedSingleCustomer?.staircases?.length - 1
        ]?.id
      );
    } else {
      setActiveStairCaseId("");
      setActiveStairCaseObj({
        id: "",
        images: [],
        from_floor_id: "",
        to_floor_id: "",
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
    removeRepair(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
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
                    singleCustomerData.staircases.length > 0 && "min-w-[90px]"
                  } min-h-[90px]`}
                >
                  <div
                    className="space-x-2 flex justify-center items-center mx-3"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {singleCustomerData.staircases.length > 0 &&
                      singleCustomerData.staircases.map((stair, index) => {
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
                              stair.id === activeStairCaseId
                                ? "!w-[78px] !h-[78px] "
                                : ""
                            } ${isValid ? "!bg-[#009DC2] !text-white" : ""}
                     !text-[28px] !font-medium relative `}
                            onClick={() => setActiveStairCaseId(stair.id)}
                            onTouchStart={() => setActiveStairCaseId(stair.id)}
                          >
                            {index + 1}
                            <div
                              className={`absolute ${
                                stair.id === activeStairCaseId
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
                  onClick={() => addMoreRepair()}
                >
                  +
                </Button>
              </div>
              <QueGrid container spacing={1.5}>
                {activeStairCaseObj?.all_questions?.length > 0 &&
                  (!subQuesionsShow ? (
                    activeStairCaseObj?.all_questions?.map((queObj) => {
                      return (
                        <MainQueGrid
                          queObj={queObj}
                          checkListIndex={index}
                          setIsDragEnabled={setIsDragEnabled}
                          storeKeyToUpdate="staircases"
                          setSubQuesionsShow={setSubQuesionsShow}
                          setSubQuestions={setSubQuestions}
                          setSubofSubQuestions={() => {}}
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
                              setSubofSubQuestions={() => {}}
                              setSubofSubQuestionObj={() => {}}
                              subQuestions={subQuestions}
                              setSubQuestions={setSubQuestions}
                              storeKeyToUpdate="staircases"
                            />
                          </>
                        );
                      })}
                    </>
                  ))}
              </QueGrid>
            </FirstGrid>
            <VerticalDivider />
            <SecondGrid item xs={12} md={6} sx={{ width: "590px" }}>
              <div className="flex gap-2 justify-center items-center w-full">
                {["From", "To"].map((type) => {
                  return (
                    <FromToBtn
                      setIsDragEnabled={(value) => setIsDragEnabled(value)}
                      itemKeyValue={activeStairCaseObj}
                      type={type}
                      storeKey="staircases"
                      itemKey="stairCase"
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
                      <CLStairCaseProjectFloors
                        addedFloors={addedFloors}
                        floor={floor}
                        index={index}
                        activeStairCaseObj={activeStairCaseObj}
                      />
                    );
                  })}
              </ProjectGrid>
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
                Staircases
              </Text>

              <ProjectGrid container spacing={1}>
                {singleCustomerData?.staircases?.length > 0 &&
                  singleCustomerData?.staircases?.map((staircase, index) => {
                    return (
                      <CLCommonSummaryButton
                        activeObjKey="staircase"
                        storeKeyValue={staircase}
                        index={index + 1}
                        setActiveTransitionSummary={setActiveStaircaseSummary}
                        activeTransitionSummary={activeStaircaseSummary}
                        type="button"
                        className="justify-center max-w-[130px]"
                        buttonName="Staircase"
                        within_id=""
                        from_id="from_floor_id"
                        to_id="to_floor_id"
                        checkInFloor={true}
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
              {activeStaircaseSummary?.staircase?.id && (
                <>
                  <Text className="mt-[95px] text-[20px] font-semibold">
                    {activeStaircaseSummary?.stairCaseName
                      ? activeStaircaseSummary?.stairCaseName
                      : "Unknown"}
                  </Text>
                  <StairCaseSummary
                    activeSummary={activeStaircaseSummary}
                    setIsDragEnabled={setIsDragEnabled}
                    objectKey="staircase"
                    className="py-[12px] px-8"
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
        text="Are you sure you want to remove this Staircase ?"
        title="Remove Confirmation"
      />
    </>
  );
};

export default StairCaseCheckListForm;
