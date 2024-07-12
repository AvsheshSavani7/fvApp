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
import WithinBtn from "../UI/CheckList/Repair/WithinBtn";
import { usePreview } from "react-dnd-preview";
import CLRepairProjectFloorSummary from "../UI/CheckList/Repair/CLRepairProjectFloorSummary";
import RemoveDialog from "../UI/RemoveDialog";
import { levelingCheckList } from "../../utils/levelingCheckList";
import LevelingProjectFloors from "../UI/CheckList/LevelingCheckListBtns/LevelingProjectFloors";
import VerticalDivider from "../UI/VerticalDivider";
import CLCommonSummaryButton from "../UI/CLCommonSummaryButton";
import SummaryCard from "../UI/SummaryCard";
import RoomArea from "../RoomAreaComponent/RoomArea";
import LevelingSummaryCard from "../UI/CheckList/LevelingCheckListBtns/LevelingSummaryCard";
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

const LevelingCheckListForm = () => {
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

  const [activeLevelingId, setActiveLevelingId] = useState("");
  const [activeLevelingObj, setActiveLevelingObj] = useState({
    id: "",
    color: "",
    within_room_id: [],
    all_questions: [],
  });

  useEffect(() => {
    if (!activeLevelingId && singleCustomerData?.levellings?.length > 0) {
      setActiveLevelingId(singleCustomerData.levellings?.[0].id);
    }
  }, []);

  const index = React.useMemo(() => {
    return (
      singleCustomerData?.levellings?.findIndex(
        (item) => item?.id === activeLevelingId
      ) || 0
    );
  }, [activeLevelingId]);

  useEffect(() => {
    if (activeLevelingId) {
      let findObj = singleCustomerData.levellings.find(
        ({ id }) => id === activeLevelingId
      );
      if (findObj) {
        setActiveLevelingObj(findObj);
      } else {
        setActiveLevelingObj({
          id: "",
          color: "",
          within_room_id: [],
          all_questions: [],
        });
        setActiveLevelingId("");
      }
    }
  }, [activeLevelingId, singleCustomerData]);

  const [activeStaircaseSummary, setActiveStaircaseSummary] = useState({});

  useEffect(() => {
    setActiveStaircaseSummary([]);
  }, [singleCustomerData]);

  const addMoreLeveling = () => {
    const createNewStaircase = () => {
      let levelingImport = JSON.parse(JSON.stringify(levelingCheckList));

      function updateIds(obj) {
        obj.id = uuidv4();

        if (obj.subQuestion && obj.subQuestion.length > 0) {
          for (const subQ of obj.subQuestion) {
            updateIds(subQ);
          }
        }
      }

      for (const item of levelingImport) {
        updateIds(item);
      }

      return {
        id: uuidv4(),
        color: "",
        within_room_id: [],
        all_questions: levelingImport,
      };
    };

    const lastStaircase =
      singleCustomerData?.levellings[
        singleCustomerData?.levellings?.length - 1
      ];

    if (
      singleCustomerData?.levellings?.length === 0 ||
      lastStaircase?.within_room_id?.length > 0
    ) {
      const newLeveling = createNewStaircase();

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          levellings: [...singleCustomerData?.levellings, newLeveling],
        })
      );

      setActiveLevelingId(newLeveling.id);
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
          !text-white !text-[16px] !font-medium !w-[78px] !h-[78px] !bg-[#1A65D6] mb-[15px] z-[5000]`}
          animate={{
            opacity: 0.7,
          }}
        >
          {item.type}
        </motion.button>
      </div>
    );
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
    // Perform the actual remove action here, using the selectedItem
    setDialogOpen(false);
    removeLeveling(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const removeLeveling = (leveling) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    const updatedLevelingArray = updatedSingleCustomer.levellings.filter(
      (singleLeveling) => singleLeveling.id !== leveling.id
    );
    updatedSingleCustomer.levellings = updatedLevelingArray;
    const roomIdsArray = leveling.within_room_id;
    const repairIdToRemove = leveling.id;
    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (roomIdsArray.includes(room.id)) {
          return {
            ...room,
            levelling_id: room.levelling_id.filter(
              (id) => id !== repairIdToRemove
            ),
          };
        }
        return room;
      }),
    }));
    updatedSingleCustomer.scope.floors = updatedFloor;

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    if (updatedSingleCustomer?.levellings?.length > 0) {
      setActiveLevelingId(
        updatedSingleCustomer?.levellings?.[
          updatedSingleCustomer?.levellings?.length - 1
        ]?.id
      );
    } else {
      setActiveLevelingId("");
      setActiveLevelingObj({
        id: "",
        color: "",
        within_room_id: [],
        all_questions: [],
      });
    }
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
              <div className="flex items-center justify-center gap-[15px] pt-[15px] m-[20px]">
                <div
                  className={`flex max-w-[430px] overflow-x-auto ${
                    singleCustomerData?.levellings?.length > 0 && "min-w-[90px]"
                  } min-h-[90px]`}
                >
                  <div
                    className="space-x-2 flex justify-center items-center mx-3"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {singleCustomerData.levellings.length > 0 &&
                      singleCustomerData.levellings.map((leveling, index) => {
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

                        const isStaircaseValid = (leveling) => {
                          return areAllQuestionsAnswered(
                            leveling.all_questions
                          );
                        };

                        const isValid = isStaircaseValid(leveling);
                        return (
                          <button
                            className={`round-small-btn ${
                              leveling.id === activeLevelingId
                                ? "!w-[78px] !h-[78px] "
                                : ""
                            } ${isValid ? "!bg-[#009DC2] !text-white" : ""}
                     !text-[28px] !font-medium relative `}
                            onClick={() => setActiveLevelingId(leveling.id)}
                            onTouchStart={() =>
                              setActiveLevelingId(leveling.id)
                            }
                          >
                            {index + 1}
                            <div
                              className={`absolute ${
                                leveling.id === activeLevelingId
                                  ? "-top-1 -right-1"
                                  : "-top-0.5 -right-0.5"
                              }
                                  
                              } rounded-full bg-white padding-2.5`}
                              onClick={(e) => handleRemoveClick(e, leveling)}
                              onTouchStart={(e) =>
                                handleRemoveClick(e, leveling)
                              }
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
                  onClick={() => addMoreLeveling()}
                >
                  +
                </Button>
              </div>
              <QueGrid container spacing={1.5}>
                {activeLevelingObj?.all_questions?.length > 0 &&
                  activeLevelingObj?.all_questions?.map((queObj) => {
                    return (
                      <MainQueGrid
                        queObj={queObj}
                        checkListIndex={index}
                        setIsDragEnabled={setIsDragEnabled}
                        setSubQuesionsShow={() => {}}
                        storeKeyToUpdate="levellings"
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
                    <WithinBtn
                      setIsDragEnabled={(value) => setIsDragEnabled(value)}
                      itemKeyValue={activeLevelingObj}
                      type={"Within"}
                      storeKey="levellings"
                      itemKey="levelings"
                    />
                  </div>
                  <Text
                    className="text-[21px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                    style={{ fontWeight: 500 }}
                    // onClick={() => handleProjectLevel()}
                  >
                    Project
                  </Text>
                  <ProjectGrid container spacing={1}>
                    {addedFloors?.length > 0 &&
                      addedFloors.map((floor, index) => {
                        return (
                          <LevelingProjectFloors
                            addedFloors={addedFloors}
                            floor={floor}
                            index={index}
                            activeLevelingObj={activeLevelingObj}
                            activeLevelingId={activeLevelingId}
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
                Levellings
              </Text>

              <ProjectGrid container spacing={1}>
                {singleCustomerData?.levellings?.length > 0 &&
                  singleCustomerData?.levellings?.map((levelling, index) => {
                    return (
                      <CLCommonSummaryButton
                        activeObjKey="levellings"
                        storeKeyValue={levelling}
                        index={index + 1}
                        setActiveTransitionSummary={setActiveStaircaseSummary}
                        activeTransitionSummary={activeStaircaseSummary}
                        type="button"
                        className="justify-center max-w-[130px]"
                        buttonName="Levelling"
                        within_id="within_room_id"
                        from_id=""
                        to_id=""
                        levelling={true}
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
              {activeStaircaseSummary?.levellings?.id && (
                <>
                  <Text className="mt-[95px] text-[20px] font-semibold">
                    {activeStaircaseSummary?.buttonName}
                  </Text>
                  <LevelingSummaryCard
                    activeSummary={activeStaircaseSummary}
                    setIsDragEnabled={setIsDragEnabled}
                    objectKey="levellings"
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
        text="Are you sure you want to remove this Leveling ?"
        title="Remove Confirmation"
      />
    </>
  );
};

export default LevelingCheckListForm;
