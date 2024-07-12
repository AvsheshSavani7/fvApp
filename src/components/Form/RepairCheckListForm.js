import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, TextField } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import { setImageLoading, updateSingleCustomerApi } from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import _, { debounce } from "lodash";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import MuiSnackbar from "../UI/MuiSnackbar";
import Button from "../UI/Button";
import DropZone from "../UI/DropZone";
import GetIconFile from "../../assets/GetIconFile";
import CLRepairProjectFloors from "../UI/CheckList/Repair/CLRepairProjectFloors";
import WithinBtn from "../UI/CheckList/Repair/WithinBtn";
import { uploadImage } from "../../services/customers.service";
import { usePreview } from "react-dnd-preview";
import { Controller } from "react-hook-form";
import CLRepairProjectFloorSummary from "../UI/CheckList/Repair/CLRepairProjectFloorSummary";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import RoomArea from "../RoomAreaComponent/RoomArea";
import ImageSliderPopup from "../UI/ImageSliderPopup";
import { Constants } from "../../utils/Constants";
import { handleImageCompression } from "../../helper/helper";
import STDropButton from "../UI/CheckList/Repair/STDropButton";

const StyledGrid = styled(Grid)({
  height: "100%",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  padding: "16px 20px",
  height: "100%",
});

const QueGrid = styled(Grid)({
  padding: "12px 30px 17px 30px",
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

const RepairCheckListForm = () => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );
  const staircases = useSelector(
    (state) => state.customerReducer.singleCustomer.staircases
  );

  const activeRefinihsingChecklistId = useSelector(
    (state) => state.customerReducer.activeRefinihsingChecklistId
  );
  const imageLoading = useSelector(
    (state) => state.customerReducer.imageLoading
  );

  const { register, errors, watch, getValues, setValue, control } =
    useReactHookForm({
      defaultValues: {
        repair_description: "",
      },
      mode: "onBlur",
    });
  const NoteTextField = styled(TextField)(({ filledOut }) => ({
    "&.MuiTextField-root": {
      "& .MuiInputBase-input": {
        padding: "12px",
        fontSize: "16px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "10px",
        borderColor: !filledOut && Constants.MANDATE_BORDER_COLOR,
      },
      "& .MuiInputLabel-root": {
        color: "#202020",
        fontSize: "13px",
        top: "2px",
        marginTop: "3px",
      },
      "& .MuiInputLabel-shrink": {
        fontSize: "16px",
        marginTop: "0",
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset>legend": {
        fontSize: "12px",
      },
    },
  }));

  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [activeRoomobj, setActiveRoomobj] = React.useState({});
  const [activeTab, setActiveTab] = React.useState("rooms");

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
  const [showQue, setShowQue] = useState("");

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

  const [activeRepairId, setActiveRepairId] = useState("");
  const [descFilledOut, setDescFilledOut] = useState(false);
  const [imageFilledOut, setImageFilledOut] = useState(false);
  const [activeRepairObj, setActiveRepairObj] = useState({
    id: "",
    images: [],
    repair_description: "",
    within_room_id: "",
  });
  useEffect(() => {
    if (!activeRepairId && singleCustomerData?.repairs?.length > 0) {
      setActiveRepairId(singleCustomerData.repairs[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeRepairId) {
      let findObj = singleCustomerData.repairs.find(
        ({ id }) => id === activeRepairId
      );
      if (findObj) {
        setActiveRepairObj(findObj);
        setValue("repair_description", findObj?.repair_description);
        if (findObj?.repair_description !== "") {
          setDescFilledOut(true);
        } else {
          setDescFilledOut(false);
        }
        if (findObj?.images?.length > 0) {
          setImageFilledOut(true);
        } else {
          setImageFilledOut(false);
        }
      } else {
        setActiveRepairObj({
          id: "",
          images: [],
          repair_description: "",
          within_room_id: "",
        });
        setValue("repair_description", "");
        setActiveRepairId("");
      }
    }
  }, [activeRepairId, singleCustomerData]);

  const [summeryFloor, setSummeryFloor] = useState([]);
  useEffect(() => {
    setSummeryFloor(addedFloors);
    setRoomRepairs({ roomId: "", repairs: [] });
    setShowQue("");
  }, [singleCustomerData]);

  const handleRepairValue = async (data, type) => {
    const updateRepair = [...singleCustomerData.repairs];
    const repairIndex =
      updateRepair.length > 0 &&
      updateRepair.findIndex((repair) => repair.id === activeRepairId);

    if (type === "img") {
      let updatedRepairObj = {};
      dispatch(setImageLoading(true));
      const compressedFile = await handleImageCompression(data);

      let formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("originalname", data?.name);

      let imageUploaded = await uploadImage(formData);
      if (imageUploaded.data.status) {
        updatedRepairObj = {
          ...updateRepair[repairIndex],
          images: [
            ...updateRepair[repairIndex]?.images,
            imageUploaded?.data?.entity,
          ],
        };
      } else {
        setOpen(true);
        setMessage(imageUploaded?.data?.message || "Something went wrong");
        setType("error");
      }
      dispatch(setImageLoading(false));

      updateRepair[repairIndex] = updatedRepairObj;

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          repairs: updateRepair,
        })
      );
    } else {
      let updatedRepairObj = {};

      updatedRepairObj = {
        ...updateRepair[repairIndex],
        repair_description: getValues().repair_description,
      };
      updateRepair[repairIndex] = updatedRepairObj;
      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          repairs: updateRepair,
        })
      );
    }
  };

  const addMoreRepair = () => {
    const createNewStaircase = () => {
      return {
        id: uuidv4(),
        images: [],
        repair_description: "",
        within_room_id: "",
        within_staircase_id: "",
      };
    };

    const lastRepairs =
      singleCustomerData.repairs[singleCustomerData.repairs.length - 1];

    if (singleCustomerData.repairs.length === 0 || lastRepairs.within_room_id) {
      const newRepair = createNewStaircase();

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          repairs: [...singleCustomerData.repairs, newRepair],
        })
      );
      setActiveRepairId(newRepair.id);
    }
  };

  const removeImg = (img) => {
    const updateRepair = [...singleCustomerData.repairs];
    const repairIndex =
      updateRepair.length > 0 &&
      updateRepair.findIndex((repair) => repair.id === activeRepairId);
    let updatedRepairObj = {};

    updatedRepairObj = {
      ...updateRepair[repairIndex],
      images: updateRepair[repairIndex]?.images.filter(
        (image) => image !== img
      ),
    };
    updateRepair[repairIndex] = updatedRepairObj;

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        repairs: updateRepair,
      })
    );
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
          Within
        </motion.button>
      </div>
    );
  };

  const removeRepair = (repair) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    const updatedRepairArray = updatedSingleCustomer.repairs.filter(
      (singleRepair) => singleRepair.id !== repair.id
    );
    updatedSingleCustomer.repairs = updatedRepairArray;
    const roomId = repair.within_room_id;
    const repairIdToRemove = repair.id;
    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            repair_ids: room.repair_ids.filter((id) => id !== repairIdToRemove),
          };
        }
        return room;
      }),
    }));
    updatedSingleCustomer.scope.floors = updatedFloor;

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    if (updatedSingleCustomer?.repairs?.length > 0) {
      setActiveRepairId(
        updatedSingleCustomer?.repairs?.[
          updatedSingleCustomer?.repairs?.length - 1
        ]?.id
      );
    } else {
      setActiveRepairId("");
    }
  };

  const reverseImgArray = activeRepairObj?.images
    ? [...activeRepairObj?.images]?.reverse()
    : [];

  const handleRepairValueDebounced = debounce((e, valueType) => {
    handleRepairValue(e, valueType);
  }, 200);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupInitialSlide, setPopupInitialSlide] = useState(0);

  const handleImageClick = (clickedImage, index) => {
    setPopupImages(reverseImgArray); // Set images for the popup
    setPopupInitialSlide(index); // Set initial slide based on clicked image index
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupImages([]);
    setPopupInitialSlide(0);
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
                    singleCustomerData.repairs.length > 0 && "min-w-[90px]"
                  } min-h-[90px]`}
                >
                  <div
                    className="space-x-2 flex justify-center items-center mx-3"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {singleCustomerData.repairs.length > 0 &&
                      singleCustomerData.repairs.map((repair, index) => {
                        const isFilled =
                          repair?.images?.length > 0 &&
                          repair.repair_description;
                        return (
                          <button
                            className={`round-small-btn ${
                              repair.id === activeRepairId
                                ? "!w-[78px] !h-[78px] "
                                : ""
                            } ${isFilled ? "!bg-[#009DC2] !text-white" : ""}
                     !text-[28px] !font-medium relative `}
                            onClick={() => setActiveRepairId(repair.id)}
                            onTouchStart={() => setActiveRepairId(repair.id)}
                          >
                            {index + 1}
                            <div
                              className={`absolute ${
                                repair.id === activeRepairId
                                  ? "-top-1 -right-1"
                                  : "-top-0.5 -right-0.5"
                              }
                                  
                              } rounded-full bg-white padding-2.5`}
                              onClick={(e) => handleRemoveClick(e, repair)}
                              onTouchStart={(e) => handleRemoveClick(e, repair)}
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
              {activeRepairId && (
                <QueGrid
                  container
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <div className="flex justify-center mb-[25px]">
                    {!imageLoading ? (
                      <DropZone
                        className="!min-w-[238px] h-[178px] rounded-md border-2 m-auto flex justify-center items-center"
                        setImagePreview={(data) =>
                          handleRepairValue(data, "img")
                        }
                        style={
                          imageFilledOut
                            ? { borderColor: "#D8D8D8" }
                            : {
                                borderColor: Constants.MANDATE_BORDER_COLOR,
                              }
                        }
                      />
                    ) : (
                      <div className="w-[238px] h-[178px] rounded-md border-2 border-[#AEAEAE] m-auto flex justify-center items-center">
                        <CircularProgress size={20} />
                      </div>
                    )}
                    <div className="flex max-w-[275px] overflow-x-auto">
                      <div
                        className="space-x-2 flex justify-center items-center "
                        onMouseEnter={() => setIsDragEnabled(false)}
                        onMouseLeave={() => setIsDragEnabled(true)}
                        onTouchStart={() => setIsDragEnabled(false)}
                        onTouchEnd={() => setIsDragEnabled(true)}
                      >
                        {activeRepairObj?.images?.length > 0 &&
                          reverseImgArray?.map((img, i) => {
                            return (
                              <div className="relative">
                                <img
                                  src={img}
                                  alt="Preview"
                                  className="!min-w-[238px] h-[178px] rounded-lg border-2 border-[#D8D8D8]"
                                  onClick={() => handleImageClick(img, i)}
                                  onTouchStart={() => handleImageClick(img, i)}
                                />
                                <ImageSliderPopup
                                  images={popupImages}
                                  initialSlide={popupInitialSlide}
                                  open={isPopupOpen}
                                  onClose={closePopup}
                                />
                                <div
                                  className={`absolute top-1 right-3
                                      rounded-full bg-white padding-2.5`}
                                  onClick={() => removeImg(img)}
                                  onTouchStart={() => removeImg(img)}
                                >
                                  <GetIconFile
                                    data={{ width: "24px", height: "24px" }}
                                    iconName="remove-icon"
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <Controller
                    name="repair_description"
                    control={control}
                    render={({ field }) => (
                      <NoteTextField
                        {...field}
                        filledOut={descFilledOut}
                        type="text"
                        variant="outlined"
                        fullWidth
                        size="small"
                        label="Repair Description"
                        multiline={true}
                        maxRows={4}
                        minRows={4}
                        onBlur={(e) => {
                          field.onBlur();
                          handleRepairValueDebounced(e, "text");
                        }}
                        disabled={imageLoading}
                      />
                    )}
                  />
                </QueGrid>
              )}
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
                  <WithinBtn
                    setIsDragEnabled={(value) => setIsDragEnabled(value)}
                    itemKeyValue={activeRepairObj}
                    type={"Within"}
                    storeKey="repairs"
                    itemKey="repair"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <Button
                      className={`${
                        activeTab === "rooms"
                          ? "bg-bgprimary text-white"
                          : "bg-white text-black border-bgprimary"
                      } text-sm m-auto w-full h-[40px] border-[1px] rounded-lg flex justify-center items-center `}
                      style={{ fontWeight: 500 }}
                      onClick={() => {
                        setActiveTab("rooms");
                      }}
                    >
                      Rooms
                    </Button>
                    <Button
                      className={`${
                        activeTab === "staircases"
                          ? "bg-bgprimary text-white"
                          : "bg-white text-black border-bgprimary"
                      } text-sm m-auto w-full h-[40px] border-[1px] rounded-lg flex justify-center items-center `}
                      style={{ fontWeight: 500 }}
                      onClick={() => {
                        setActiveTab("staircases");
                      }}
                    >
                      Staircases
                    </Button>
                  </div>
                  <Text
                    className="text-[21px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                    style={{ fontWeight: 500 }}
                  >
                    Project
                  </Text>
                  {activeTab === "rooms" && (
                    <ProjectGrid container spacing={1}>
                      {addedFloors?.length > 0 &&
                        addedFloors.map((floor, index) => {
                          return (
                            <CLRepairProjectFloors
                              addedFloors={addedFloors}
                              floor={floor}
                              index={index}
                              activeRepairObj={activeRepairObj}
                              handleClickRoomArea={handleClickRoomArea}
                            />
                          );
                        })}
                    </ProjectGrid>
                  )}
                  {activeTab === "staircases" && (
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        width: "100%",
                        maxHeight: "310px",
                        overflowY: "auto",
                        my: 1,
                      }}
                    >
                      {staircases?.length > 0 &&
                        staircases.map((st, index) => {
                          return (
                            <Grid
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                margin: "auto",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <STDropButton
                                staircaseName={
                                  st?.all_questions?.[0]?.answer ||
                                  `Staircase ${index + 1}`
                                }
                                stObj={st}
                                activeRepairObj={activeRepairObj}
                                className="justify-center"
                              />
                            </Grid>
                          );
                        })}
                    </Grid>
                  )}
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
                // padding: "80px 30px 30px 30px !important",
              }}
            >
              <Text
                className="text-[21px] h-[40px] mt-[92px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>

              <ProjectGrid container spacing={1}>
                {summeryFloor.length > 0 &&
                  summeryFloor.map((floor, index) => {
                    return (
                      <CLRepairProjectFloorSummary
                        addedFloors={summeryFloor}
                        floor={floor}
                        index={index}
                        setRoomRepairs={setRoomRepairs}
                        roomRepairs={roomRepairs}
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
                height: "100vh",
                overflowX: "auto",
                flexDirection: "column",
              }}
            >
              {activeRepairId ? (
                <>
                  <div className="text-[21px] font-medium	">Summary</div>
                  {roomRepairs?.repairs.length > 0 ? (
                    <div
                      className="flex gap-2 p-2"
                      style={{
                        maxWidth: "calc(100% - 8px)",
                        overflowX: "auto",
                      }}
                      onMouseEnter={() => setIsDragEnabled(false)}
                      onMouseLeave={() => setIsDragEnabled(true)}
                      onTouchStart={() => setIsDragEnabled(false)}
                      onTouchEnd={() => setIsDragEnabled(true)}
                    >
                      {roomRepairs?.repairs.length > 0 &&
                        roomRepairs.repairs.map((repair, index) => {
                          return (
                            <Grid
                              item
                              xs
                              style={{
                                border: "2px solid #AEAEAE",
                                minWidth: "127px",
                                borderRadius: "8px",
                                padding: "4px 8px 8px 8px",
                                maxWidth: "250px",
                                maxHeight: "450px",
                                overflowY: "auto",
                                height: "100vh",
                              }}
                            >
                              <div className="flex flex-col	">
                                <div className="h-[33px] p-2.5 text-lg">
                                  {index + 1}
                                </div>
                                <div className="flex flex-col">
                                  {repair?.images.length > 0 &&
                                    repair?.images.map((img, imgIndex) => (
                                      <img
                                        className="py-1 w-full rounded-lg"
                                        key={imgIndex}
                                        src={img}
                                        alt="img"
                                      />
                                    ))}
                                </div>
                                <div className=" p-2.5 text-xs">
                                  {repair.repair_description}
                                </div>
                              </div>
                            </Grid>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[400px]">
                      No repairs in this room
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center h-[400px]">
                  Please select any room to see repairs
                </div>
              )}
            </Grid>
          </StyledGrid>
        </Slider>
      </CarouselContainer>
      <RemoveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        text="Are you sure you want to remove this Repair ?"
        title="Remove Confirmation"
      />
    </>
  );
};

export default RepairCheckListForm;
