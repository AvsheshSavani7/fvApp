import React, { useCallback, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import GetIconFile from "../../assets/GetIconFile";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import roomtypes from "../../utils/roomTypes.json";
import VerticalDivider from "../UI/VerticalDivider";
import RoomTypeButton from "../UI/RoomTypeButton";
import ProjectButton from "../UI/ProjectButton";
import { floors as staticFloors } from "../../utils/staticData";
import {
  setActiveRoomId,
  setImageLoading,
  updateSingleCustomerApi,
} from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import ProjectFloors from "../UI/ProjectFloors";
import { v4 as uuidv4 } from "uuid";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import {
  createFloorPlanData,
  uploadImage,
} from "../../services/customers.service";
import MuiSnackbar from "../UI/MuiSnackbar";
import Image from "../UI/Image";
import { usePreview } from "react-dnd-preview";
import { useDrop } from "react-dnd";
import RemoveDialog from "../UI/RemoveDialog";
import RoomArea from "../RoomAreaComponent/RoomArea";
import { handleImageCompression } from "../../helper/helper";
import ThirdSlideProjectButton from "../UI/ThirdSlideProjectButton";
import SubRoomArea from "../RoomAreaComponent/SubRoomArea";
import { checkIsAdmin, getAuth } from "../../services/identity.service";
import FloorPlanModal from "../FloorPlan/FloorPlanModal";
import { useParams } from "react-router-dom";
import { setIsFloorPlanDataExistForCustomer } from "../../redux/floorPlan";
import { setInitialProducts } from "../../redux/product";

const StyledGrid = styled(Grid)({
  padding: "48px 24px",
  display: "flex !important",
  position: "relative",
});

const SecondStyledGrid = styled(Grid)({
  padding: "48px 10px 48px 18px",
  display: "flex !important",
  position: "relative",
});

const ProjectGrid = styled(Grid)({
  padding: "10px 0 10px 24px",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});

const SecondProjectGrid = styled(Grid)({
  padding: "10px 24px 10px 0px",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});
const CarouselContainer = styled.div`
  // width: 100%;
  // margin: 0 auto;
`;

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
    .slick-slide{
      height:506px
    }
  `;

const ProjectScopeForm = ({ setHide }) => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );
  const imageLoading = useSelector(
    (state) => state.customerReducer.imageLoading
  );
  const isFloorPlanDataExistForCustomer = useSelector(
    (state) => state.floorPlan.isFloorPlanDataExistForCustomer
  );
  const activeRoomId = useSelector(
    (state) => state.customerReducer.activeRoomId
  );
  const { register, errors, watch, getValues, setValue } = useReactHookForm({
    defaultValues: {
      area: "",
      linear: "",
    },
    mode: "onchange",
  });

  const [isDragEnabled, setIsDragEnabled] = useState(true); // For stop slider event when any button is selected
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [activeRoomobj, setActiveRoomobj] = React.useState({});
  const [openFloorPlanDrawer, setOpenFloorPlanDrawer] = React.useState(false);
  const [thirdSlideActiveRoomobj, setThirdSlideActiveRoomobj] = React.useState(
    {}
  );

  const params = useParams();
  const isAdmin = checkIsAdmin();

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    touchMove: isDragEnabled,
  };

  const handleRoomValue = async (dataURL, type) => {
    // setImagePreview(dataURL);
    // Find the floor and room with activeRoomId in singleCustomerData
    const floorIndex = singleCustomerData.scope.floors.findIndex(
      (floor) => floor.name === activeRoomId.floorId
    );

    if (floorIndex !== -1) {
      const roomIndex = singleCustomerData.scope.floors[
        floorIndex
      ].rooms.findIndex((roomId) => roomId.id === activeRoomId.roomId);

      if (roomIndex !== -1) {
        const updatedRooms = [
          ...singleCustomerData.scope.floors[floorIndex].rooms,
        ];
        if (type === "img") {
          let updatedRoom = {};
          // let formData= new FormData()
          // formData.append("file",dataURL)

          // let imageUploaded = await uploadImage( formData );
          dispatch(setImageLoading(true));
          const compressedFile = await handleImageCompression(dataURL);

          let formData = new FormData();
          formData.append("file", compressedFile);
          formData.append("originalname", dataURL?.name);

          let imageUploaded = await uploadImage(formData);
          if (imageUploaded.data.status) {
            updatedRoom = {
              ...updatedRooms[roomIndex],
              images: [
                ...updatedRooms[roomIndex].images,
                imageUploaded?.data?.entity,
              ],
            };
            dispatch(
              setActiveRoomId({
                ...activeRoomId,
                images: [
                  ...updatedRooms[roomIndex].images,
                  imageUploaded?.data?.entity,
                ],
              })
            );
          } else {
            setOpen(true);
            setMessage(imageUploaded?.data?.message || "Something went wrong");
            setType("error");
          }
          dispatch(setImageLoading(false));

          updatedRooms[roomIndex] = updatedRoom;

          const updatedFloor = {
            ...singleCustomerData.scope.floors[floorIndex],
            rooms: updatedRooms,
          };

          const updatedScope = {
            ...singleCustomerData.scope,
            floors: singleCustomerData.scope.floors.map((floor, index) =>
              index === floorIndex ? updatedFloor : floor
            ),
          };

          dispatch(
            updateSingleCustomerApi({
              ...singleCustomerData,
              scope: updatedScope,
            })
          );
        }
        if (type === "number") {
          if (
            activeRoomId.area !== getValues("area") ||
            activeRoomId.linear_ft !== getValues("linear")
          ) {
            let updatedRoom = {};
            updatedRoom = {
              ...updatedRooms[roomIndex],
              area: getValues("area") || "",
              linear_ft: getValues("linear") || "",
            };
            dispatch(
              setActiveRoomId({
                ...activeRoomId,
                area: getValues("area") || "",
                linear_ft: getValues("linear") || "",
              })
            );

            updatedRooms[roomIndex] = updatedRoom;

            const updatedFloor = {
              ...singleCustomerData.scope.floors[floorIndex],
              rooms: updatedRooms,
            };

            const updatedScope = {
              ...singleCustomerData.scope,
              floors: singleCustomerData.scope.floors.map((floor, index) =>
                index === floorIndex ? updatedFloor : floor
              ),
            };

            dispatch(
              updateSingleCustomerApi({
                ...singleCustomerData,
                scope: updatedScope,
              })
            );
          }
        }
      } else {
        console.log("Room not found.");
      }
    } else {
      console.log("Floor not found.");
    }
  };

  const addFloor = (newFloor) => {
    let index;
    const updatedFloors = [...singleCustomerData.scope.floors];
    if (newFloor.name === "Basement") {
      index = 0;
    } else if (newFloor.name === "Floor 1") {
      index = 1;
    } else if (newFloor.name === "Floor 2") {
      index = 2;
    } else if (newFloor.name === "Floor 3") {
      index = 3;
    }
    // Insert the new floor at the specified index
    updatedFloors.splice(index, 0, { ...newFloor, id: uuidv4() });
    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors,
        },
      })
    );
  };

  const floors = React.useMemo(() => {
    let totalFloors = staticFloors;
    if (addedFloors.length > 0) {
      let floorNames = addedFloors.map((i) => i.name);
      totalFloors = totalFloors.filter((floor) => {
        return !floorNames.includes(floor.name);
      });
    }
    return totalFloors;
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
    if (!item) return null;

    return (
      <div style={style}>
        <motion.button
          className={`flex items-center rounded-full py-0 pr-[8px] pl-[10px] h-[44px] w-[117px] border-2 border-[#D8D8D8] gap-[8px] cursor-move `}
          animate={{
            opacity: 0.7,
          }}
        >
          <Image src={item?.room?.icon} />
          <Text className="">{item?.room?.name}</Text>
        </motion.button>
      </div>
    );
  };
  let outside = true;

  const removeRoomidFn = (store, roomId, key) => {
    if (key === "levelling") {
      return store?.map((leveling) => {
        if (leveling?.within_room_id?.includes(roomId)) {
          return {
            ...leveling,
            within_room_id: leveling?.within_room_id?.filter(
              (roomid) => roomid !== roomId
            ),
          };
        }
        return leveling;
      });
    } else if (key === "repair") {
      return store?.map((repair) => {
        if (repair?.within_room_id === roomId) {
          return {
            ...repair,
            within_room_id: "",
          };
        }
        return repair;
      });
    } else if (key === "transition") {
      return store?.map((transition) => {
        if (transition?.from_room_id === roomId) {
          return {
            ...transition,
            from_room_id: "",
          };
        } else if (transition?.within_room_id === roomId) {
          return {
            ...transition,
            within_room_id: "",
          };
        } else if (transition?.to_room_id === roomId) {
          return {
            ...transition,
            to_room_id: "",
          };
        }
        return transition;
      });
    } else if (key === "furniture") {
      return store?.filter((furniture) => furniture?.room_id !== roomId);
    }
  };

  console.log(singleCustomerData.scope.floors, "singleCustomerData");

  const [{ isOver }, drop] = useDrop({
    accept: ["FLOOR_INTERNAL"],
    drop: async (item) => {
      if (item.type === "FLOOR_INTERNAL" && outside) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        // Find the floor index using the correct condition (name === name)
        const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
          (e) => e.id === item.floor.id
        );

        if (floorIndex !== -1) {
          const removeRoomFromFloor = await updatedSingleCustomer.scope.floors[
            floorIndex
          ].rooms.filter((room) => room.id !== item.roomObj.id);

          updatedSingleCustomer.scope.floors[floorIndex].rooms = [
            ...removeRoomFromFloor,
          ];

          const droppedRoom = item?.roomObj;
          const isSubRoom = droppedRoom?.subRoomof;
          const isParentRoom = droppedRoom?.childRooms?.length > 0;
          const floors = updatedSingleCustomer.scope.floors;

          if (isSubRoom) {
            // remove childroom's id from childRooms array in parent room, if drop room is child
            const parentRoomIndex = floors?.[floorIndex]?.rooms?.findIndex(
              (room) => room?.id === isSubRoom?.parent_room_id
            );

            if (parentRoomIndex !== -1) {
              const updatedRoom = {
                ...floors[floorIndex].rooms[parentRoomIndex],
                childRooms: floors[floorIndex].rooms[
                  parentRoomIndex
                ]?.childRooms?.filter((child) => child !== droppedRoom?.id),
              };

              floors[floorIndex].rooms[parentRoomIndex] = updatedRoom;
            }
          } else if (isParentRoom) {
            // remove subRoomof key from all children rooms, if drop room is parent
            droppedRoom?.childRooms?.forEach((roomId) => {
              const childRoomIndex = floors[floorIndex].rooms?.findIndex(
                (room) => room.id === roomId
              );

              if (childRoomIndex !== -1) {
                delete floors[floorIndex].rooms[childRoomIndex].subRoomof;
              }
            });
          }

          const allRooms = updatedSingleCustomer.scope.floors.flatMap(
            (floor) => floor.rooms
          );

          updatedSingleCustomer.furnitures = removeRoomidFn(
            updatedSingleCustomer.furnitures,
            item.roomObj.id,
            "furniture"
          );

          updatedSingleCustomer.levellings = removeRoomidFn(
            updatedSingleCustomer.levellings,
            item.roomObj.id,
            "levelling"
          );

          updatedSingleCustomer.repairs = removeRoomidFn(
            updatedSingleCustomer.repairs,
            item.roomObj.id,
            "repair"
          );

          updatedSingleCustomer.transitions = removeRoomidFn(
            updatedSingleCustomer.transitions,
            item.roomObj.id,
            "transition"
          );

          const matchingRooms = allRooms.filter((room) =>
            room.type.includes(item.roomObj.name)
          );

          if (matchingRooms.length > 0) {
            let uniqueIndex = 1;

            updatedSingleCustomer.scope.floors.forEach((floor) => {
              matchingRooms.forEach((matchingRoom) => {
                const matchingRoomIndex = floor.rooms.findIndex(
                  (room) => room.id === matchingRoom.id
                );

                // Update room name with unique index
                if (matchingRoomIndex !== -1) {
                  if (matchingRooms.length === 1) {
                    floor.rooms[matchingRoomIndex].type = item.roomObj.name;
                  } else {
                    floor.rooms[
                      matchingRoomIndex
                    ].type = `${item.roomObj.name} - ${uniqueIndex}`;
                  }
                  uniqueIndex++;
                }
              });
            });
          }

          // Remove room from products array
          if (updatedSingleCustomer.all_products?.length > 0) {
            const allProds = updatedSingleCustomer.all_products;
            const updatedProducts = allProds
              ?.map((p) => {
                const updatedFloors = p.floors
                  .map((f) => ({
                    ...f,
                    rooms:
                      f.rooms?.filter((r) => r.id !== droppedRoom.id) || [],
                  }))
                  .filter((f) => f.rooms.length > 0);

                return {
                  ...p,
                  floors: updatedFloors,
                };
              })
              .filter((p) => p.floors.length > 0);

            updatedSingleCustomer.all_products = updatedProducts;

            dispatch(setInitialProducts(updatedProducts));
          }

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRemoveClick = (item, floorId) => {
    setSelectedItem({ name: item, floorId });
    setDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    setDialogOpen(false);
    removeFloor(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const removeFloor = ({ name, floorId }) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    const floor = updatedSingleCustomer.scope.floors.find(
      (e) => e.id === floorId
    );

    floor?.rooms?.map((room) => {
      updatedSingleCustomer.furnitures = removeRoomidFn(
        updatedSingleCustomer.furnitures,
        room.id,
        "furniture"
      );

      updatedSingleCustomer.levellings = removeRoomidFn(
        updatedSingleCustomer.levellings,
        room.id,
        "levelling"
      );

      updatedSingleCustomer.repairs = removeRoomidFn(
        updatedSingleCustomer.repairs,
        room.id,
        "repair"
      );

      updatedSingleCustomer.transitions = removeRoomidFn(
        updatedSingleCustomer.transitions,
        room.id,
        "transition"
      );
    });

    // Filter the floor index using the correct condition (name === name)
    const updatedFloorArray = updatedSingleCustomer.scope.floors.filter(
      (e) => e.name !== name
    );

    updatedSingleCustomer.staircases = updatedSingleCustomer?.staircases?.map(
      (staricase) => {
        if (staricase?.from_floor_id === floorId) {
          return {
            ...staricase,
            from_floor_id: "",
          };
        } else if (staricase?.to_floor_id === floorId) {
          return {
            ...staricase,
            to_floor_id: "",
          };
        }
        return staricase;
      }
    );

    updatedSingleCustomer.scope.floors = updatedFloorArray;
    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
  };

  const handleFloorPlanDrawer = useCallback(async () => {
    if (!isFloorPlanDataExistForCustomer) {
      const createFloorPlanDataRes = await createFloorPlanData(
        params?.customerId
      );

      const result = createFloorPlanDataRes.data?.entity;
      setOpen(true);
      if (createFloorPlanDataRes.data?.status) {
        setType("success");
        setMessage("Floor plan data created in database");
        dispatch(setIsFloorPlanDataExistForCustomer(true));
      } else {
        setMessage(
          result?.message ||
          "Something went wrong, please try again to create floor plan data"
        );
        setType("error");
      }
    }
    setOpenFloorPlanDrawer(true);
  }, [
    isFloorPlanDataExistForCustomer,
    setIsFloorPlanDataExistForCustomer,
    setOpenFloorPlanDrawer,
  ]);

  const floorPlanCanBeDrawn = useMemo(() => {
    if (addedFloors.length > 0) {
      return addedFloors.some((floor) => floor.rooms.length > 0);
    }
    return false;
  }, [addedFloors]);

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
        <Slider {...carouselSettings}>
          {/* {Fist Slide} */}
          <StyledGrid container>
            <Grid item xs={12} md={6} style={{ width: "50%" }} ref={drop}>
              <Grid container spacing={-4}>
                <Grid item xs={12} md={4}>
                  <Text
                    className="text-[21px] h-[40px]"
                    style={{ fontWeight: 500 }}
                  >
                    Floor
                  </Text>
                  <div className="space-y-2 mt-3">
                    {floors?.map((floor) => (
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 rounded-full p-1 h-[44px] w-[156px] border-2 border-[#009DC2]"
                        onClick={() => addFloor(floor)}
                      >
                        <GetIconFile
                          iconName="addIcon"
                          data={{ color: "", secondColor: "" }}
                        />
                        <Text>{floor?.name}</Text>
                      </motion.div>
                    ))}
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Text
                    className="text-[21px] h-[40px] font-semibold"
                    style={{ fontWeight: 500 }}
                  >
                    Room Type
                  </Text>
                  <motion.div className=" mt-3 grid grid-cols-3 gap-[8px]">
                    {roomtypes?.roomTypes?.map((room) => (
                      <RoomTypeButton
                        room={room}
                        src={room?.icon}
                        buttonName={room?.name}
                        setIsDragEnabled={(value) => setIsDragEnabled(value)}
                        isDragEnabled={isDragEnabled}
                      />
                    ))}
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>

            <VerticalDivider />

            <Grid item xs={12} md={6} style={{ width: "50%" }}>
              <div className="flex justify-end relative">
                <motion.button
                  className={`flex items-center justify-center absolute -top-8 right-0 rounded-md h-[35px] w-[117px] border-[1px] border-[#D8D8D8] cursor-move text-sm ${!floorPlanCanBeDrawn
                      ? "bg-gray-300 text-black"
                      : "bg-[#0061d9d4] text-white"
                    }`}
                  disabled={!floorPlanCanBeDrawn}
                  whileTap={{ scale: !floorPlanCanBeDrawn ? 1 : 0.9 }}
                  onClick={handleFloorPlanDrawer}
                >
                  Floor Plan
                </motion.button>
              </div>
              <Text
                className="text-[21px] h-[40px]"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>
              <ProjectGrid container spacing={1}>
                {addedFloors.length > 0 &&
                  addedFloors.map((floor, index) => {
                    return (
                      <ProjectFloors
                        addedFloors={addedFloors}
                        floor={floor}
                        index={index}
                        setIsDragEnabled={(value) => setIsDragEnabled(value)}
                        handleRemoveClick={(item, floorId) =>
                          handleRemoveClick(item, floorId)
                        }
                      />
                    );
                  })}
              </ProjectGrid>
            </Grid>
          </StyledGrid>

          {/* {Second Slide} */}
          <SecondStyledGrid container>
            <Grid item xs={12} md={6} style={{ width: "50%" }}>
              <Text
                className="text-[21px] h-[40px]"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>
              <SecondProjectGrid container spacing={1}>
                {addedFloors.length > 0 &&
                  addedFloors.map((floor, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        md={addedFloors.length === 4 ? 3 : 4}
                        key={`${floor.name}+${index}`}
                      >
                        <div className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]">
                          <Text>{floor.name}</Text>
                        </div>
                        <div className="space-y-2 my-2 overflow-y-auto	h-[326px]">
                          {floor.rooms.map((roomObj) => {
                            const room = roomtypes.roomTypes.find(
                              (e) => e.name === (roomObj?.type || roomObj?.name)
                            );
                            return (
                              <ProjectButton
                                src={room?.icon}
                                buttonName={room?.name}
                                type="button"
                                activeRoomobj={activeRoomobj}
                                onClick={() => {
                                  setActiveRoomobj(roomObj);
                                  dispatch(
                                    setActiveRoomId({
                                      floorId: floor.name,
                                      roomId: roomObj.id,
                                      images: roomObj.images || [],
                                      area: roomObj.area || "",
                                      linear_ft: roomObj.linear_ft || "",
                                    })
                                  );
                                  setValue("area", roomObj.area || "");
                                  setValue("linear", roomObj.linear_ft || "");
                                }}
                                pageType="imageSelection"
                                roomObj={roomObj}
                              />
                            );
                          })}
                        </div>
                      </Grid>
                    );
                  })}
              </SecondProjectGrid>
            </Grid>

            <VerticalDivider />

            <Grid
              item
              xs={12}
              md={6}
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                marginTop: "23px",
                padding: "0 5px",
                alignItems: "start",
              }}
            >
              {Object.keys(activeRoomobj).length > 0 && (
                <RoomArea
                  activeRoomobj={activeRoomobj}
                  setOpen={setOpen}
                  setMessage={setMessage}
                  setType={setType}
                  setIsDragEnabled={setIsDragEnabled}
                />
              )}
              {/* {activeRoomId.roomId ? (
                <>
                  {activeRoomId.images?.length > 0 ? (
                    <img
                      src={activeRoomId.images[0]}
                      alt="Preview"
                      className="w-[342px] h-[259px] rounded-lg border-2 border-[#D8D8D8]"
                    />
                  ) : !imageLoading ? (
                    <DropZone
                      className="w-[342px] h-[259px] rounded-md border-2 border-[#AEAEAE] m-auto flex justify-center items-center"
                      setImagePreview={(data) => handleRoomValue(data, "img")}
                    />
                  ) : (
                    <div className="w-[342px] h-[259px] rounded-md border-2 border-[#AEAEAE] m-auto flex justify-center items-center">
                      <CircularProgress size={20} />
                    </div>
                  )}

                  <div className="flex justify-between m-auto w-[244px] pt-[16px] pb-[4px] items-center">
                    <Input
                      id="area"
                      name="area"
                      className="w-[67px] h-[48px]"
                      type="number"
                      label={"Area (sq.ft)"}
                      register={register}
                      errors={errors}
                      hasPadding={true}
                      height="14px"
                      hasFixWidth={true}
                      onBlur={(data) => handleRoomValue(data, "number")}
                    />
                  </div>
                  <div className="flex justify-between m-auto w-[244px] pt-[8px] items-center border-t-2">
                    <Input
                      id="linear"
                      name="linear"
                      className="w-[67px] h-[44px] "
                      type="number"
                      label={"Linear (ft)"}
                      register={register}
                      errors={errors}
                      hasPadding={true}
                      height="24px"
                      hasFixWidth={true}
                      onBlur={(data) => handleRoomValue(data, "number")}
                    />
                  </div>
                </>
              ) : (
                <h4> Please select any room</h4>
              )} */}
            </Grid>
          </SecondStyledGrid>

          {/* {Third Slide for admin} */}
          {isAdmin && (
            <SecondStyledGrid container>
              <Grid item xs={12} md={6} style={{ width: "50%" }}>
                <Text
                  className="ml-2 mb-1 text-[21px] m-auto !w-[540px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                  style={{ fontWeight: 500 }}
                >
                  Project&nbsp;
                  <span className="text-lg">
                    {" "}
                    - {(singleCustomerData?.totalProjectSF || 0)?.toFixed(2) || 0} SF
                  </span>
                </Text>
                <SecondProjectGrid container spacing={1} sx={{ pr: "10px" }}>
                  {addedFloors.length > 0 &&
                    addedFloors.map((floor, index) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={addedFloors.length === 4 ? 3 : 4}
                          key={`${floor.name}+${index}`}
                        >
                          <div className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]">
                            <Text className="text-[11px]">
                              {floor.name} -{" "}
                              {floor?.totalFloorSF
                                ? floor?.totalFloorSF?.toFixed(2)
                                : 0}
                              SF
                            </Text>
                          </div>
                          <div className="space-y-2 my-2 overflow-y-auto	h-[326px]">
                            {floor.rooms.map((roomObj) => {
                              const room = roomtypes.roomTypes.find(
                                (e) =>
                                  e.name === (roomObj?.type || roomObj?.name)
                              );
                              return (
                                <ThirdSlideProjectButton
                                  src={room?.icon}
                                  buttonName={room?.name}
                                  type="button"
                                  activeRoomobj={
                                    thirdSlideActiveRoomobj?.roomObj
                                  }
                                  onClick={() => {
                                    setThirdSlideActiveRoomobj({
                                      roomObj,
                                      floorId: floor?.id,
                                    });
                                  }}
                                  pageType="imageSelection"
                                  roomObj={roomObj}
                                />
                              );
                            })}
                          </div>
                        </Grid>
                      );
                    })}
                </SecondProjectGrid>
              </Grid>

              <VerticalDivider />

              <Grid
                item
                xs={12}
                md={6}
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  marginTop: "23px",
                  padding: "0 0 0 10px",
                  alignItems: "start",
                }}
              >
                {Object.keys(thirdSlideActiveRoomobj?.roomObj || {}).length >
                  0 && (
                    <SubRoomArea
                      floorId={thirdSlideActiveRoomobj?.floorId}
                      activeRoomobj={thirdSlideActiveRoomobj?.roomObj}
                      setIsDragEnabled={setIsDragEnabled}
                    />
                  )}
              </Grid>
            </SecondStyledGrid>
          )}
        </Slider>
      </CarouselContainer>
      <RemoveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        text={`Are you sure you want to remove ${selectedItem?.name} ?`}
        title="Remove Confirmation"
      />
      {/* Floorplan drawer modal */}
      <FloorPlanModal
        open={openFloorPlanDrawer}
        setOpenFloorPlanDrawer={setOpenFloorPlanDrawer}
      />
    </>
  );
};

export default ProjectScopeForm;
