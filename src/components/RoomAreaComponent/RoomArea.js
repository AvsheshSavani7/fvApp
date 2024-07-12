import React, { useEffect, useMemo, useState } from "react";
import {
  setImageLoading,
  setImageQuestionId,
  updateSingleCustomerApi,
} from "../../redux/customer";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../services/customers.service";
import { Grid } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Button from "../UI/Button";
import Dimension from "./Dimension";
import Text from "../UI/Text";
import NoteField from "../UI/QuestionTypes/NoteField";
import ImageField from "../UI/QuestionTypes/ImageField";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import RoomAreaHeader from "./RoomAreaHeader";
import { handleImageCompression } from "../../helper/helper";

const RoomArea = ({
  setActiveRoomobj,
  activeRoomobj,
  setOpen,
  setMessage,
  setType,
  setIsDragEnabled,
  hasHeader,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();
  const [removed, setRemoved] = useState(false);

  let currentRoom = useMemo(() => {
    let findroom = {};
    singleCustomerData?.scope?.floors?.map((floor) => {
      return floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          findroom = room;
        }
      });
    });
    return findroom;
  }, [singleCustomerData, activeRoomobj, removed]);

  let currentRoomFurnitures = useMemo(() => {
    let findRoomFurnitures = singleCustomerData?.furnitures?.filter(
      (furniture) => currentRoom?.furniture_ids?.includes(furniture?.id)
    );
    return findRoomFurnitures;
  }, [singleCustomerData, activeRoomobj]);

  const { register, setValue } = useReactHookForm({
    defaultValues: {
      roomNote: currentRoom?.note,
    },
    mode: "onchange",
  });

  useEffect(() => {
    setValue("roomNote", currentRoom?.note);
  }, [currentRoom]);

  const handleRoomImages = async (dataURL, type, objId) => {
    dispatch(setImageLoading(true));
    if (type === "room") {
      dispatch(setImageQuestionId("roomImageUpload"));

      const compressedFile = await handleImageCompression(dataURL);

      let formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("originalname", dataURL?.name);

      let imageUploaded = await uploadImage(formData);

      if (imageUploaded?.data?.status) {
        let updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
        updatedFloors?.map((floor) => {
          floor?.rooms?.map((room) => {
            if (room?.id === activeRoomobj?.id) {
              return {
                ...room,
                images: room?.images?.push(imageUploaded?.data?.entity),
              };
            }
            return room;
          });
        });

        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            scope: {
              ...singleCustomerData.scope,
              floors: updatedFloors,
            },
          })
        );
      } else {
        setOpen(true);
        setMessage(imageUploaded?.data?.message || "Something went wrong");
        setType("error");
      }
    } else {
      dispatch(setImageQuestionId(objId));

      const compressedFile = await handleImageCompression(dataURL);

      let formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("originalname", dataURL?.name);

      let imageUploaded = await uploadImage(formData);

      if (imageUploaded.data.status) {
        let updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        let updatedFurnitures = [...updatedSingleCustomer?.furnitures];
        updatedFurnitures?.map((furniture) => {
          if (furniture?.id === objId) {
            return {
              ...furniture,
              images: furniture?.images?.push(imageUploaded?.data?.entity),
            };
          }
          return furniture;
        });

        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            furnitures: updatedFurnitures,
          })
        );
      } else {
        setOpen(true);
        setMessage(imageUploaded?.data?.message || "Something went wrong");
        setType("error");
      }
    }

    dispatch(setImageQuestionId(""));
    dispatch(setImageLoading(false));
  };

  const handleAddShape = () => {
    let dimesionObj = {
      id: uuidv4(),
      shape: "",
    };

    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors?.map((floor) => {
      floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          return { ...room, dimensions: room.dimensions?.push(dimesionObj) };
        }
        return room;
      });
    });

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

  const handleChangeDropdown = async (value, dimesionId) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          let findDim = room?.dimensions?.find((dim) => dim?.id === dimesionId);
          let total;
          if (findDim.hasOwnProperty("sqFeet")) {
            total = room?.totalSqFeet - findDim?.sqFeet;
          } else {
            total = room?.totalSqFeet;
          }
          return {
            ...room,
            totalSqFeet: parseFloat(total?.toFixed(2)),
            dimensions: room?.dimensions?.map((dim) => {
              if (dim?.id === dimesionId) {
                if (value == "Rectangle" || value == "Triangle") {
                  let updatedDim = { ...dim };
                  delete updatedDim?.radius1;
                  delete updatedDim?.radius2;
                  return {
                    ...updatedDim,
                    shape: value,
                    length: "",
                    width: "",
                    sqFeet: "",
                    closet: false,
                    scope: true,
                  };
                } else {
                  let updatedDim = { ...dim };
                  delete updatedDim?.length;
                  delete updatedDim?.width;
                  return {
                    ...updatedDim,
                    shape: value,
                    radius1: "",
                    radius2: "",
                    sqFeet: "",
                    closet: false,
                    scope: true,
                  };
                }
              }
              return dim;
            }),
          };
        }
        return room;
      }),
    }));

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

  const handleDimensionFieldBlur = (e, dimesionId, type) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          return {
            ...room,
            dimensions: room?.dimensions?.map((dim) => {
              if (dim?.id === dimesionId) {
                let pasrsedWidth = Number(dim?.width);
                let pasrsedLength = Number(dim?.length);
                let pasrsedRadius1 = Number(dim?.radius1);
                let pasrsedRadius2 = Number(dim?.radius2);
                let pasrsedCurrentVal =
                  e.target.value === ""
                    ? ""
                    : parseFloat(Number(e.target.value)?.toFixed(2));

                if (dim?.shape === "Rectangle") {
                  if (type === "length") {
                    return {
                      ...dim,
                      length: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        (pasrsedCurrentVal * pasrsedWidth)?.toFixed(2)
                      ),
                    };
                  } else if (type === "width") {
                    return {
                      ...dim,
                      width: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        (pasrsedCurrentVal * pasrsedLength)?.toFixed(2)
                      ),
                    };
                  }
                } else if (dim?.shape === "Triangle") {
                  if (type === "length") {
                    return {
                      ...dim,
                      length: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        ((1 / 2) * (pasrsedCurrentVal * pasrsedWidth))?.toFixed(
                          2
                        )
                      ),
                    };
                  } else if (type === "width") {
                    return {
                      ...dim,
                      width: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        (
                          (1 / 2) *
                          (pasrsedCurrentVal * pasrsedLength)
                        )?.toFixed(2)
                      ),
                    };
                  }
                } else {
                  if (type === "radius1") {
                    return {
                      ...dim,
                      radius1: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        (
                          Math.PI *
                          (pasrsedCurrentVal * pasrsedRadius2)
                        )?.toFixed(2)
                      ),
                    };
                  } else if (type === "radius2") {
                    return {
                      ...dim,
                      radius2: pasrsedCurrentVal,
                      sqFeet: parseFloat(
                        (
                          Math.PI *
                          (pasrsedCurrentVal * pasrsedRadius1)
                        )?.toFixed(2)
                      ),
                    };
                  }
                }
              }
              return dim;
            }),
          };
        }
        return room;
      }),
    }));

    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        let total = 0;
        room?.dimensions?.map((dim) => {
          if (dim?.sqFeet) total += dim?.sqFeet;
        });

        if (room?.id === activeRoomobj?.id) {
          return {
            ...room,
            totalSqFeet: parseFloat(total?.toFixed(2)),
          };
        }
        return room;
      }),
    }));

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

  const handleRemoveDim = (dimesionId) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          let filteredDimensions = room?.dimensions?.filter(
            (dim) => dim?.id !== dimesionId
          );

          let total = 0;
          filteredDimensions?.map((dim) => {
            if (dim?.sqFeet) total += dim?.sqFeet;
          });

          return {
            ...room,
            totalSqFeet: parseFloat(total?.toFixed(2)),
            dimensions: filteredDimensions,
          };
        }
        return room;
      }),
    }));

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors,
        },
      })
    );
    setRemoved((prev) => !prev);
  };

  const handleClickBoolean = (dimensionId, currentVal, type) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];

    if (type === "closet") {
      updatedFloors = updatedFloors?.map((floor) => ({
        ...floor,
        rooms: floor?.rooms?.map((room) => {
          if (room?.id === activeRoomobj?.id) {
            return {
              ...room,
              dimensions: room?.dimensions?.map((dim) => {
                if (dim?.id === dimensionId) {
                  return { ...dim, closet: !currentVal };
                }
                return dim;
              }),
            };
          }
          return room;
        }),
      }));
    } else {
      updatedFloors = updatedFloors?.map((floor) => ({
        ...floor,
        rooms: floor?.rooms?.map((room) => {
          if (room?.id === activeRoomobj?.id) {
            let findDim = room?.dimensions?.find(
              (dim) => dim?.id === dimensionId
            );
            let total;

            if (!currentVal) {
              total = room?.totalSqFeet + findDim?.sqFeet;

              return {
                ...room,
                totalSqFeet: parseFloat(total?.toFixed(2)),
                dimensions: room?.dimensions?.map((dim) => {
                  if (dim?.id === dimensionId) {
                    return { ...dim, scope: !currentVal };
                  }
                  return dim;
                }),
              };
            } else {
              total = room?.totalSqFeet - findDim?.sqFeet;
              return {
                ...room,
                totalSqFeet: parseFloat(total?.toFixed(2)),
                dimensions: room?.dimensions?.map((dim) => {
                  if (dim?.id === dimensionId) {
                    return { ...dim, scope: !currentVal };
                  }
                  return dim;
                }),
              };
            }
          }
          return room;
        }),
      }));
    }
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

  const handleNoteBlur = (e) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];

    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          return {
            ...room,
            note: e.target.value,
          };
        }
        return room;
      }),
    }));

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

  const handleRemoveFurniture = (furnitureId) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    let updatedFurnitures = [...updatedSingleCustomer?.furnitures];

    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          return {
            ...room,
            furniture_ids: room?.furniture_ids?.filter(
              (fid) => fid !== furnitureId
            ),
          };
        }
        return room;
      }),
    }));

    updatedFurnitures = updatedFurnitures?.filter(
      (furniture) => furniture?.id !== furnitureId
    );

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        furnitures: updatedFurnitures,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors,
        },
      })
    );
  };

  return (
    <div className="w-full">
      {hasHeader && (
        <div className="mt-1">
          <RoomAreaHeader
            title="Room Name"
            roomName={currentRoom?.name}
            handleAddShape={handleAddShape}
            currentRoom={currentRoom}
            setSubQuesionsShow={() => setActiveRoomobj({})}
          />
        </div>
      )}
      {!hasHeader && (
        <div className="flex justify-center items-center gap-5 mt-4 w-full">
          {/* <Button
            className="round-small-btn !w-[30px] !h-[30px]"
            onClick={handleAddShape}
          >
            <span className="text-[16px]">+</span>
          </Button> */}
          {/* <div className="flex items-center gap-2">
            <Text>Total SF:</Text>
            <Text className="font-semibold">
              {currentRoom?.totalSqFeet || 0}
            </Text>
          </div> */}
        </div>
      )}
      <div
        className={`mt-3 pt-2 px-[6px] overflow-y-auto ${
          hasHeader ? "max-h-[120px]" : "max-h-[118px]"
        } `}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
      >
        {currentRoom?.dimensions?.map((dimension) => (
          <Dimension
            dimension={dimension}
            handleChangeDropdown={handleChangeDropdown}
            handleDimensionFieldBlur={handleDimensionFieldBlur}
            handleRemoveDim={handleRemoveDim}
            handleClickBoolean={handleClickBoolean}
            activeRoomobj={activeRoomobj}
            removed={removed}
            setIsDragEnabled={setIsDragEnabled}
          />
        ))}
      </div>
      <Grid container spacing={1} sx={{ px: "6px", mt: "8px" }}>
        <Grid item xs={4}>
          <NoteField
            question="Notes"
            value={currentRoom?.note || ""}
            handleNoteBlur={handleNoteBlur}
            register={register}
            id="roomNote"
            name="roomNote"
            type="text"
            fullHeight={true}
            multiline={true}
            maxRows={3.8}
            minRows={3.8}
            filledOut={true}
          />
        </Grid>
        <Grid item xs={8}>
          <ImageField
            question="Room Images"
            questionId="roomImageUpload"
            handleFileChange={(e) =>
              handleRoomImages(e.target.files?.[0], "room")
            }
            files={currentRoom?.images || []}
            setIsDragEnabled={setIsDragEnabled}
            classname="max-w-[200px]"
            filledOut={true}
            type="ROOM"
            roomId={activeRoomobj?.id}
          />
        </Grid>
      </Grid>
      {currentRoomFurnitures?.length > 0 && (
        <div className="px-2">
          <div className="w-full h-[1px] mt-[10px] mb-2 bg-gray-300 " />
        </div>
      )}
      <div className="pt-1 space-y-1 h-[125px] overflow-y-auto overflow-x-hidden">
        {currentRoomFurnitures?.map((furniture) => (
          <Grid container spacing={1} sx={{ px: "6px" }}>
            <Grid
              item
              xs={0.8}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="flex justify-center items-center h-10">
                <Button
                  className="p-2 w-6 h-6 text-sm rounded-full bg-white text-red-700 border-[1px] border-gray-500 flex justify-center items-center"
                  onClick={() => handleRemoveFurniture(furniture?.id)}
                >
                  -
                </Button>
              </div>
            </Grid>
            <Grid item xs={3.2}>
              <div
                key={furniture?.id}
                className="flex justify-center items-center border-[1px] border-gray-300 rounded-lg w-full h-[105px] p-2"
              >
                <Text className="text-xs text-center">
                  {furniture?.name} ({furniture?.size})
                </Text>
              </div>
            </Grid>
            <Grid item xs={8}>
              <ImageField
                question="Furniture Images"
                questionId={furniture?.id}
                handleFileChange={(e) =>
                  handleRoomImages(
                    e.target.files?.[0],
                    "furniture",
                    furniture?.id
                  )
                }
                files={furniture?.images || []}
                setIsDragEnabled={setIsDragEnabled}
                classname="max-w-[200px]"
                filledOut={true}
              />
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
};

export default RoomArea;
