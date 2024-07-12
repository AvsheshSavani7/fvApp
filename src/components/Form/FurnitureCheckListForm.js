import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import {
  setCheckListActiveBtn,
  updateSingleCustomerApi,
} from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import MuiSnackbar from "../UI/MuiSnackbar";
import { usePreview } from "react-dnd-preview";
import Button from "../UI/Button";
import {
  largeFurniture,
  mediumFurniture,
  smallFurniture,
} from "../../utils/furniture";
import GetFurnitureIcon from "../../assets/GetFurnitureIcon";
import CLFurnitureProjectFloors from "../UI/CheckList/FurnitureCheckListBtn/CLFurnitureProjectFloors";
import CLFurnitureButton from "../UI/CheckList/FurnitureCheckListBtn/CLFurnitureButton";
import CLFurnitureSummaryProjectFloors from "../UI/CheckList/FurnitureCheckListBtn/CLFurnitureSummaryProjectFloors";
import _ from "lodash";
import VerticalDivider from "../UI/VerticalDivider";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import { v4 as uuidv4 } from "uuid";
import SubQuestionHeader from "../UI/CheckList/SubQuestionHeader";
import SubQueGrid from "../UI/QuestionTypes/SubQueGrid";
import FromToBtn from "../UI/CheckList/StairCaseCheckListBtns/FromToBtn";
import SummaryCard from "../UI/SummaryCard";
import RoomArea from "../RoomAreaComponent/RoomArea";
import KitchenSummary from "../UI/CheckList/FurnitureCheckListBtn/KitchenSummary";
import SpecialItemSummary from "../UI/CheckList/FurnitureCheckListBtn/SpecialItemSummary";
import NoteField from "../UI/QuestionTypes/NoteField";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import { Constants } from "../../utils/Constants";
import { checkIsAdmin } from "../../services/identity.service";

const StyledGrid = styled(Grid)({
  // padding: "24px 24px 48px 24px",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  padding: "84px 24px 24px 24px",
  height: "100%",
});

const ProjectGrid = styled(Grid)({
  padding: "10px 0 10px 0",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});

const SecondProjectGrid = styled(Grid)({
  padding: "10px 24px 10px 24px",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});
const CarouselContainer = styled.div`
  // width: 100%;
  // margin: 0 auto;
`;

const QueGrid = styled(Grid)({
  padding: "18px 24px 17px 24px",
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

const FurnitureCheckListForm = () => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const furniturePermission = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );
  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );
  const specialItem = useSelector(
    (state) => state.customerReducer.singleCustomer.specialItem_furnitures
  );
  const kitchenItem = useSelector(
    (state) => state.customerReducer.singleCustomer.kitchen_furnitures
  );

  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  const [isDragEnabled, setIsDragEnabled] = useState(true); // For stop slider event when any button is selected
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [activeRoomFurnitureIds, setActiveRoomFurnitureIds] = React.useState(
    []
  );
  const [smallItems, setSmallItems] = React.useState([]);
  const [mediumItems, setMediumItems] = React.useState([]);
  const [largeItems, setLargeItems] = React.useState([]);
  const [adItems, setADItems] = React.useState([]);

  const [smallFurnitureLocal, setSmallFurniture] = useState([]);
  const [mediumFurnitureLocal, setMediumFurniture] = useState([]);
  const [largeFurnitureLocal, setLargeFurniture] = useState([]);
  const [subQuestions, setSubQuestions] = React.useState({});
  const [subQuesionsShow, setSubQuesionsShow] = React.useState(false);
  const [kitchen, setKitchen] = useState({ kitchen: kitchenItem[0] });
  const [specialItemState, setSpecialItemState] = useState({
    specialItemm: specialItem[0],
  });
  const [activeRoomobj, setActiveRoomobj] = React.useState({});

  const [kitchenQues, setKitchenQues] = useState([]);

  const isAdmin = checkIsAdmin();

  const { register, getValues, setValue } = useReactHookForm({
    defaultValues: { furnitureNote: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    setKitchen({ kitchen: kitchenItem[0] });
  }, [kitchenItem]);

  useEffect(() => {
    setSpecialItemState({ specialItemm: specialItem[0] });
  }, [specialItem]);

  useEffect(() => {
    setSmallFurniture(smallFurniture);
    setMediumFurniture(mediumFurniture);
    setLargeFurniture(largeFurniture);
    if (isAdmin) {
      dispatch(setCheckListActiveBtn("standerd"));
    } else {
      dispatch(setCheckListActiveBtn("kitchen"));
    }

    if (singleCustomerData?.kitchen_furnitures?.length > 0) {
      setKitchenQues(kitchenItem);
    }
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    touchMove: isDragEnabled,
  };

  useEffect(() => {
    getActiveFurnitures();
  }, [activeRoomFurnitureIds]);

  useEffect(() => {
    setSmallItems([]);
    setMediumItems([]);
    setLargeItems([]);
    setADItems([]);
    setActiveRoomFurnitureIds([]);
    setValue("furnitureNote", singleCustomerData?.furnitureNote);
  }, [singleCustomerData]);

  const handleClose = () => {
    setOpen(false);
  };

  const MyPreview = () => {
    const preview = usePreview();
    if (!preview.display) {
      return null;
    }
    const { itemType, item, style } = preview;
    return (
      <>
        {itemType === "FURNITURE_TYPE" && (
          <div style={style} className="z-[9999] ">
            <motion.button
              className={`flex items-center relative bg-[#D8D8D8] rounded-full py-0 pr-[8px] pl-[10px] h-[42px] w-[150px] border-2 border-[#8f8f8f] gap-[4px] cursor-move `}
              animate={{
                opacity: 0.7,
              }}
            >
              <GetFurnitureIcon
                iconName={item?.furniture?.name}
                data={{ color: "", secondColor: "" }}
              />
              <Text className="text-[13px]">{item?.furniture?.name}</Text>
              <div className="absolute -top-2 right-0.5  gap-1  ">
                {item.furniture?.otherSize.includes(item?.furniture?.size) && (
                  <motion.div
                    className={` !bg-[#009DC2]   text-black rounded-full padding-1.5 w-6 h-5 text-[14px]"} `}
                    transition={{ duration: 1 }}
                  >
                    {item?.furniture?.size}
                  </motion.div>
                )}
              </div>
            </motion.button>
          </div>
        )}
        {itemType === "STAIRCASE" && (
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
        )}
      </>
    );
  };

  const getActiveFurnitures = () => {
    let allFurnitures = [...singleCustomerData?.furnitures];

    let roomWiseFilteredFurniture = allFurnitures?.filter((furniture) =>
      activeRoomFurnitureIds?.includes(furniture?.room_id)
    );

    let tmpSmallItems = [];
    let tmpMediumItems = [];
    let tmpLargeItems = [];
    let tmpADItems = [];

    roomWiseFilteredFurniture?.map((roomFurniture) => {
      if (roomFurniture?.isAD) {
        if (!tmpADItems?.some((item) => item?.id === roomFurniture?.id)) {
          tmpADItems?.push(roomFurniture);
        }
      } else if (roomFurniture?.size == "S") {
        if (!tmpSmallItems?.some((item) => item?.id === roomFurniture?.id)) {
          tmpSmallItems?.push(roomFurniture);
        }
      } else if (roomFurniture?.size == "M") {
        if (!tmpMediumItems?.some((item) => item?.id === roomFurniture?.id)) {
          tmpMediumItems?.push(roomFurniture);
        }
      } else if (roomFurniture?.size == "L") {
        if (!tmpLargeItems?.some((item) => item?.id === roomFurniture?.id)) {
          tmpLargeItems?.push(roomFurniture);
        }
      }
    });
    setSmallItems(tmpSmallItems);
    setMediumItems(tmpMediumItems);
    setLargeItems(tmpLargeItems);
    setADItems(tmpADItems);
  };

  const handleClickProjectBtn = () => {
    if (checkListActiveBtn === "standerd") {
      let lstFurnitureIds = [...activeRoomFurnitureIds];

      let allRoomIds = [];
      addedFloors?.map((floor) => {
        floor?.rooms?.map((room) => {
          allRoomIds.push(room?.id);
        });
      });

      if (allRoomIds?.every((roomid) => lstFurnitureIds?.includes(roomid))) {
        lstFurnitureIds = [];
      } else {
        allRoomIds?.map((roomId) => {
          if (!lstFurnitureIds?.includes(roomId)) {
            lstFurnitureIds.push(roomId);
          }
        });
      }

      setActiveRoomFurnitureIds(lstFurnitureIds);
    }
  };

  const handleClickRoomArea = (e, roomObj) => {
    e.stopPropagation();
    setActiveRoomobj(roomObj);
  };

  const handleNoteBlur = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    updatedSingleCustomer.furnitureNote = getValues()?.furnitureNote;
    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
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
            <FirstGrid item xs={12} md={6} style={{ width: "50%" }}>
              <div className="flex items-center justify-between  mb-[10px] px-[24px] pt-[24px]">
                <div className="space-x-2 flex">
                  {isAdmin
                    ? furniturePermission?.furniture?.is_part && (
                        <Button
                          className={`round-small-btn ${
                            checkListActiveBtn === "standerd" &&
                            "!bg-[#009DC2] !text-white"
                          } !text-[12px] !font-medium`}
                          onClick={() => {
                            dispatch(setCheckListActiveBtn("standerd"));
                            setSubQuesionsShow(false);
                          }}
                        >
                          Standard
                        </Button>
                      )
                    : ""}
                  {furniturePermission?.furniture?.is_appliance && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "kitchen" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[12px] !font-medium`}
                      onClick={() => {
                        dispatch(setCheckListActiveBtn("kitchen"));
                        setSubQuesionsShow(false);
                      }}
                    >
                      Kitchen
                    </Button>
                  )}
                  {furniturePermission?.furniture?.special_items && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "specialitem" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[12px] !font-medium`}
                      onClick={() => {
                        dispatch(setCheckListActiveBtn("specialitem"));
                        setSubQuesionsShow(false);
                      }}
                    >
                      Special Items
                    </Button>
                  )}
                  {furniturePermission?.furniture?.is_part && (
                    <Button
                      className={`round-small-btn ${
                        checkListActiveBtn === "note" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[12px] !font-medium`}
                      onClick={() => {
                        dispatch(setCheckListActiveBtn("note"));
                        setSubQuesionsShow(false);
                      }}
                    >
                      Plan
                    </Button>
                  )}
                </div>
              </div>
              {isAdmin
                ? checkListActiveBtn === "standerd" && (
                    <Grid container sx={{ px: "30px" }}>
                      <Grid item xs={12} md={4}>
                        <Text
                          className="text-[21px] h-[40px] text-[#505050]"
                          style={{ fontWeight: 500 }}
                        >
                          Small
                        </Text>
                        <div className="space-y-2 mt-3">
                          {smallFurnitureLocal?.map((furniture) => (
                            <CLFurnitureButton
                              key={furniture?.id}
                              furniture={furniture}
                              setIsDragEnabled={(value) =>
                                setIsDragEnabled(value)
                              }
                              isDragEnabled={isDragEnabled}
                              setFurniture={setSmallFurniture}
                              furnitureLocal={smallFurnitureLocal}
                              defaultSize="S"
                            />
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Text
                          className="text-[21px] h-[40px] text-[#505050]"
                          style={{ fontWeight: 500 }}
                        >
                          Medium
                        </Text>
                        <div className="space-y-2 mt-3">
                          {mediumFurnitureLocal?.map((furniture) => (
                            <CLFurnitureButton
                              key={furniture?.id}
                              furniture={furniture}
                              setIsDragEnabled={(value) =>
                                setIsDragEnabled(value)
                              }
                              isDragEnabled={isDragEnabled}
                              setFurniture={setMediumFurniture}
                              furnitureLocal={mediumFurnitureLocal}
                              defaultSize="M"
                            />
                          ))}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Text
                          className="text-[21px] h-[40px] text-[#505050]"
                          style={{ fontWeight: 500 }}
                        >
                          Large
                        </Text>
                        <div className="space-y-2 mt-3">
                          {largeFurnitureLocal?.map((furniture) => (
                            <CLFurnitureButton
                              key={furniture?.id}
                              furniture={furniture}
                              setIsDragEnabled={(value) =>
                                setIsDragEnabled(value)
                              }
                              isDragEnabled={isDragEnabled}
                              setFurniture={setLargeFurniture}
                              furnitureLocal={largeFurnitureLocal}
                              defaultSize="L"
                            />
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                  )
                : ""}

              {checkListActiveBtn === "kitchen" ? (
                !subQuesionsShow ? (
                  <QueGrid container spacing={2}>
                    {kitchenItem?.length > 0 &&
                      kitchenItem[0]?.all_questions?.map((queObj) => {
                        return (
                          <MainQueGrid
                            key={queObj?.id}
                            queObj={queObj}
                            checkListIndex={0}
                            setIsDragEnabled={setIsDragEnabled}
                            setSubQuestions={setSubQuestions}
                            setSubQuesionsShow={setSubQuesionsShow}
                            storeKeyToUpdate="kitchen_furnitures"
                            setSubofSubQuestions={() => {}}
                            setSubofSubQuestionObj={() => {}}
                          />
                        );
                      })}
                  </QueGrid>
                ) : (
                  <QueGrid container spacing={1.5}>
                    {subQuestions?.subQuestions?.map((subQueObj, ind) => {
                      return (
                        <>
                          {ind == 0 && (
                            <SubQuestionHeader
                              key={subQueObj?.id}
                              question={subQuestions?.mainQuestion}
                              answer={subQuestions?.mainQuestionAnswer}
                              setSubQuesionsShow={setSubQuesionsShow}
                              checkListIndex={0}
                            />
                          )}
                          <SubQueGrid
                            key={subQueObj?.id}
                            queObj={subQueObj}
                            questionId={subQuestions?.questionId}
                            checkListIndex={0}
                            setSubQuesionsShow={setSubQuesionsShow}
                            setSubofSubQuestions={() => {}}
                            setSubofSubQuestionObj={() => {}}
                            subQuestions={subQuestions}
                            setSubQuestions={setSubQuestions}
                            storeKeyToUpdate="kitchen_furnitures"
                            setIsDragEnabled={setIsDragEnabled}
                          />
                        </>
                      );
                    })}
                  </QueGrid>
                )
              ) : (
                <></>
              )}

              {checkListActiveBtn === "specialitem" ? (
                !subQuesionsShow ? (
                  <QueGrid container spacing={2}>
                    {specialItem?.length > 0 &&
                      specialItem[0]?.all_questions?.map((queObj) => {
                        return (
                          <MainQueGrid
                            key={queObj?.id}
                            queObj={queObj}
                            checkListIndex={0}
                            setIsDragEnabled={setIsDragEnabled}
                            setSubQuestions={setSubQuestions}
                            setSubQuesionsShow={setSubQuesionsShow}
                            storeKeyToUpdate="specialItem_furnitures"
                            setSubofSubQuestions={() => {}}
                            setSubofSubQuestionObj={() => {}}
                          />
                        );
                      })}
                  </QueGrid>
                ) : (
                  <QueGrid container spacing={1.5}>
                    {subQuestions?.subQuestions?.map((subQueObj, ind) => {
                      return (
                        <>
                          {ind == 0 && (
                            <SubQuestionHeader
                              key={subQueObj?.id}
                              question={subQuestions?.mainQuestion}
                              answer={subQuestions?.mainQuestionAnswer}
                              setSubQuesionsShow={setSubQuesionsShow}
                              checkListIndex={0}
                            />
                          )}
                          <SubQueGrid
                            key={subQueObj?.id}
                            queObj={subQueObj}
                            questionId={subQuestions?.questionId}
                            checkListIndex={0}
                            setSubQuesionsShow={setSubQuesionsShow}
                            setSubofSubQuestions={() => {}}
                            setSubofSubQuestionObj={() => {}}
                            subQuestions={subQuestions}
                            setSubQuestions={setSubQuestions}
                            storeKeyToUpdate="specialItem_furnitures"
                            setIsDragEnabled={setIsDragEnabled}
                          />
                        </>
                      );
                    })}
                  </QueGrid>
                )
              ) : (
                <></>
              )}

              {checkListActiveBtn === "note" ? (
                <QueGrid container spacing={1.5}>
                  <Grid item xs={12}>
                    <NoteField
                      question="Furniture Plan"
                      value={singleCustomerData?.furnitureNote || ""}
                      handleNoteBlur={handleNoteBlur}
                      register={register}
                      id="furnitureNote"
                      name="furnitureNote"
                      type="text"
                      fullHeight={true}
                      multiline={true}
                      maxRows={10}
                      minRows={10}
                      filledOut={true}
                    />
                  </Grid>
                </QueGrid>
              ) : (
                <></>
              )}
            </FirstGrid>

            <VerticalDivider />

            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{
                width: "50%",
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
                  <Button
                    className={`text-[21px] mt-[14px] !w-[537px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white`}
                    style={{ fontWeight: 500 }}
                  >
                    Project
                  </Button>
                  <ProjectGrid container spacing={1}>
                    {addedFloors.length > 0 &&
                      addedFloors.map((floor, index) => {
                        return (
                          <CLFurnitureProjectFloors
                            key={floor?.id}
                            addedFloors={addedFloors}
                            floor={floor}
                            index={index}
                            setIsDragEnabled={(value) =>
                              setIsDragEnabled(value)
                            }
                            activeRepairObj={specialItem?.[0]}
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
            <>
              <FirstGrid item xs={12} md={6} style={{ width: "50%" }}>
                <div className="flex items-center justify-between  mb-[10px] px-[24px] pt-[24px]">
                  <div className="space-x-2 flex">
                    {isAdmin
                      ? furniturePermission?.furniture?.is_part && (
                          <Button
                            className={`round-small-btn ${
                              checkListActiveBtn === "standerd" &&
                              "!bg-[#009DC2] !text-white"
                            } !text-[12px] !font-medium`}
                            onClick={() => {
                              dispatch(setCheckListActiveBtn("standerd"));
                              setSubQuesionsShow(false);
                            }}
                          >
                            Standard
                          </Button>
                        )
                      : ""}
                    {furniturePermission?.furniture?.is_appliance && (
                      <Button
                        className={`round-small-btn ${
                          checkListActiveBtn === "kitchen" &&
                          "!bg-[#009DC2] !text-white"
                        }  !text-[12px] !font-medium`}
                        onClick={() => {
                          dispatch(setCheckListActiveBtn("kitchen"));
                          setSubQuesionsShow(false);
                        }}
                      >
                        Kitchen
                      </Button>
                    )}
                    {furniturePermission?.furniture?.special_items && (
                      <Button
                        className={`round-small-btn ${
                          checkListActiveBtn === "specialitem" &&
                          "!bg-[#009DC2] !text-white"
                        }  !text-[12px] !font-medium`}
                        onClick={() => {
                          dispatch(setCheckListActiveBtn("specialitem"));
                          setSubQuesionsShow(false);
                        }}
                      >
                        Special Items
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  className={`text-[21px] mt-[4px] ml-[24px] !w-[537px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white`}
                  style={{ fontWeight: 500 }}
                  onClick={handleClickProjectBtn}
                >
                  Project
                </Button>
                <SecondProjectGrid container spacing={1}>
                  {addedFloors.length > 0 &&
                    addedFloors.map((floor, index) => {
                      return (
                        <CLFurnitureSummaryProjectFloors
                          addedFloors={addedFloors}
                          floor={floor}
                          index={index}
                          setActiveRoomFurnitureIds={setActiveRoomFurnitureIds}
                          activeRoomFurnitureIds={activeRoomFurnitureIds}
                          setIsDragEnabled={(value) => setIsDragEnabled(value)}
                        />
                      );
                    })}
                </SecondProjectGrid>
              </FirstGrid>

              <VerticalDivider />
              {checkListActiveBtn === "standerd" && (
                <Grid item xs={12} md={6} sx={{ mt: "30px" }}>
                  <div>
                    <Text className="text-[21px] font-normal">Summary</Text>
                  </div>
                  <Grid container spacing={1} sx={{ mt: "16px" }}>
                    <Grid item xs={3}>
                      <Text className="h-[40px] text-[21px] font-normal">
                        Small
                      </Text>
                      <div className="ml-10 space-y-[50px] h-[345px] overflow-y-auto">
                        {_.chain(smallItems)
                          .groupBy("name")
                          .map((group, name, idx) => {
                            return group.map((item, idx) => {
                              if (idx === 0) {
                                return (
                                  <div className="relative" key={group?.id}>
                                    <div className="w-[80px] h-[80px]">
                                      <GetFurnitureIcon
                                        iconName={name}
                                        data={{
                                          width: "37px",
                                          height: "70px",
                                        }}
                                        // data={{ width: "52px", height: "70px" }}
                                      />
                                      <div className="rounded-full w-[30px] h-[30px] bg-[#D8D8D8] p-1 absolute bottom-6 right-[42px]">
                                        {group?.length}
                                      </div>
                                    </div>
                                    <Text className="text-sm text-start w-full">
                                      {name}
                                    </Text>
                                  </div>
                                );
                              }
                            });
                          })
                          .value()}
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Text className="h-[40px] text-[21px] font-normal">
                        Medium
                      </Text>
                      <div className="ml-10 space-y-[50px] h-[345px] overflow-y-auto">
                        {_.chain(mediumItems)
                          .groupBy("name")
                          .map((group, name, idx) => {
                            return group.map((item, idx) => {
                              if (idx === 0) {
                                return (
                                  <div className="relative" key={group?.id}>
                                    <div className="w-[80px] h-[80px]">
                                      <GetFurnitureIcon
                                        iconName={name}
                                        // data={{ width: "46px", height: "66px" }}
                                        data={{ width: "52px", height: "70px" }}
                                      />
                                      <div className="rounded-full w-[30px] h-[30px] bg-[#D8D8D8] p-1 absolute bottom-6 right-[42px]">
                                        {group?.length}
                                      </div>
                                    </div>
                                    <Text className="text-sm text-start w-full">
                                      {name}
                                    </Text>
                                  </div>
                                );
                              }
                            });
                          })
                          .value()}
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Text className="h-[40px] text-[21px] font-normal">
                        Large
                      </Text>
                      <div className="ml-10 space-y-[50px] h-[345px] overflow-y-auto">
                        {_.chain(largeItems)
                          .groupBy("name")
                          .map((group, name, idx) => {
                            return group.map((item, idx) => {
                              if (idx === 0) {
                                return (
                                  <div className="relative" key={group?.id}>
                                    <div className="w-[80px] h-[80px]">
                                      <GetFurnitureIcon
                                        iconName={name}
                                        data={{ width: "52px", height: "70px" }}
                                      />
                                      <div className="rounded-full w-[30px] h-[30px] bg-[#D8D8D8] p-1 absolute bottom-6 right-[42px]">
                                        {group?.length}
                                      </div>
                                    </div>
                                    <Text className="text-sm text-start w-full">
                                      {name}
                                    </Text>
                                  </div>
                                );
                              }
                            });
                          })
                          .value()}
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Text className="h-[40px] text-[21px] font-normal">
                        A/D
                      </Text>
                      <div className="ml-10 space-y-[50px] h-[345px] overflow-y-auto">
                        {_.chain(adItems)
                          .groupBy("name")
                          .map((group, name, idx) => {
                            return group.map((item, idx) => {
                              if (idx === 0) {
                                return (
                                  <div className="!space-y-2">
                                    <div className="relative" key={group?.id}>
                                      <div className="w-[80px] h-[80px]">
                                        <GetFurnitureIcon
                                          iconName={name}
                                          // data={{ width: "37px", height: "70px" }}
                                          data={{
                                            width: "52px",
                                            height: "70px",
                                          }}
                                        />
                                        <div className="rounded-full w-[30px] h-[30px] bg-[#D8D8D8] p-1 absolute bottom-0 right-[38px]">
                                          {group?.length}
                                        </div>
                                      </div>
                                    </div>
                                    <Text className="text-sm text-start w-full">
                                      {name}
                                    </Text>
                                  </div>
                                );
                              }
                            });
                          })
                          .value()}
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {checkListActiveBtn === "kitchen" && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "50px",
                    alignItems: "center",
                    padding: "10px 10px 10px 34px",
                    gap: "14px",
                    height: "450px",
                    flexDirection: "column",
                  }}
                >
                  <>
                    {/* <Text className="mt-[10px] text-[20px] font-semibold">
                      Summary
                    </Text> */}

                    <>
                      {Object.keys(kitchen?.kitchen || {}).length !== 0 ? (
                        <KitchenSummary
                          activeSummary={kitchen}
                          setIsDragEnabled={setIsDragEnabled}
                          objectKey="kitchen"
                        />
                      ) : (
                        <div className="h-[300px] flex justify-center items-center">
                          <h3>No summary in this room</h3>
                        </div>
                      )}
                    </>
                  </>
                </Grid>
              )}
              {checkListActiveBtn === "specialitem" && (
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "50px",
                    alignItems: "center",
                    padding: "10px 10px 10px 34px",
                    gap: "14px",
                    height: "450px",
                    flexDirection: "column",
                  }}
                >
                  <>
                    {/* <Text className="mt-[10px] text-[20px] font-semibold">
                      Summary
                    </Text> */}

                    <>
                      {Object.keys(specialItemState?.specialItemm || {})
                        .length !== 0 ? (
                        <SpecialItemSummary
                          activeSummary={specialItemState}
                          setIsDragEnabled={setIsDragEnabled}
                          objectKey="specialItemm"
                        />
                      ) : (
                        <div className="h-[300px] flex justify-center items-center">
                          <h3>No summary in this room</h3>
                        </div>
                      )}
                    </>
                  </>
                </Grid>
              )}
            </>
          </StyledGrid>
        </Slider>
      </CarouselContainer>
    </>
  );
};

export default FurnitureCheckListForm;
