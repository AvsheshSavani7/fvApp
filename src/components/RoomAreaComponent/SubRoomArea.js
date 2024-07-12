import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { updateSingleCustomerApi } from "../../redux/customer";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Button from "../UI/Button";
import Text from "../UI/Text";
import NoteField from "../UI/QuestionTypes/NoteField";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import ClosetDimension from "./ClosetDimension";
import RoomItem from "./RoomItem";

const SubRoomArea = ({ floorId, activeRoomobj, setIsDragEnabled }) => {
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

  const { register, setValue } = useReactHookForm({
    defaultValues: {
      totalRoomSF: currentRoom?.finalTotalSqFeet,
      linear_ft: currentRoom?.linear_ft
    },
    mode: "onchange"
  });

  useEffect(() => {
    setValue("totalRoomSF", currentRoom?.finalTotalSqFeet);
    setValue("linear_ft", currentRoom?.linear_ft);
  }, [currentRoom]);

  const handleAddCloset = () => {
    let closetObj = {
      id: uuidv4(),
      name: "Closet",
      SF: "",
      scope: false
    };

    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors?.map((floor) => {
      floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          return { ...room, subRooms: room.subRooms?.push(closetObj) };
        }
        return room;
      });
    });

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors
        }
      })
    );
  };
  const handleAddRoomItems = () => {
    let roomItemObj = {
      id: uuidv4(),
      name: "",
      SF: "",
      LF: "",
      isIncluded: true
    };

    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors?.map((floor) => {
      floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          if (room?.roomItems) {
            room.roomItems = [...room.roomItems, roomItemObj];
          } else {
            room.roomItems = [roomItemObj];
          }

          return { ...room };
        }
        return room;
      });
    });

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors
        }
      })
    );
  };
  console.log("singleCustomerData--", singleCustomerData);
  const handleClosetFieldBlur = (e, closetId, type) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          if (type === "totalSF") {
            let pasrsedCurrentVal =
              e.target.value === ""
                ? ""
                : parseFloat(Number(e.target.value)?.toFixed(2));
            return {
              ...room,
              finalTotalSqFeet: pasrsedCurrentVal
            };
          } else if (type === "linear_ft") {
            let pasrsedCurrentVal =
              e.target.value === ""
                ? ""
                : parseFloat(Number(e.target.value)?.toFixed(2));
            return {
              ...room,
              linear_ft: pasrsedCurrentVal
            };
          } else {
            return {
              ...room,
              // subRooms: room?.subRooms?.map((closet) => {
              //   if (closet?.id === closetId) {
              //     if (type === "name") {
              //       return {
              //         ...closet,
              //         name: e.target.value
              //       };
              //     } else if (type === "sf") {
              //       let pasrsedCurrentVal =
              //         e.target.value === ""
              //           ? ""
              //           : parseFloat(Number(e.target.value)?.toFixed(2));
              //       return {
              //         ...closet,
              //         SF: pasrsedCurrentVal
              //       };
              //     }
              //   }
              //   return closet;
              // }),
              roomItems: room?.roomItems?.map((closet) => {
                if (closet?.id === closetId) {
                  if (type === "name") {
                    return {
                      ...closet,
                      name: e.target.value
                    };
                  } else if (type === "SF") {
                    let pasrsedCurrentVal =
                      e.target.value === ""
                        ? ""
                        : parseFloat(Number(e.target.value)?.toFixed(2));
                    return {
                      ...closet,
                      SF: pasrsedCurrentVal
                    };
                  } else if (type === "LF") {
                    let pasrsedCurrentVal =
                      e.target.value === ""
                        ? ""
                        : parseFloat(Number(e.target.value)?.toFixed(2));
                    return {
                      ...closet,
                      LF: pasrsedCurrentVal
                    };
                  }
                }
                return closet;
              })
            };
          }
        }
        return room;
      })
    }));

    updatedFloors = updatedFloors?.map((floor) => {
      if (floor?.id === floorId) {
        let totalSF = floor.rooms?.reduce((acc, cur) => {
          if (cur?.finalTotalSqFeet) {
            acc += cur?.finalTotalSqFeet;
          }
          return acc;
        }, 0);
        return { ...floor, totalFloorSF: totalSF };
      }
      return floor;
    });

    let totalProjectSF = 0;
    updatedFloors?.map((floor) => {
      floor.rooms?.map((room) => {
        if (room?.finalTotalSqFeet) totalProjectSF += room?.finalTotalSqFeet;
      }, 0);
    });

    updatedSingleCustomer = {
      ...updatedSingleCustomer,
      totalProjectSF: totalProjectSF
    };

    dispatch(
      updateSingleCustomerApi({
        ...updatedSingleCustomer,
        scope: {
          ...updatedSingleCustomer.scope,
          floors: updatedFloors
        }
      })
    );
  };

  const handleRemoveCloset = (closetId) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          let filteredClosets = room?.subRooms?.filter(
            (closet) => closet?.id !== closetId
          );
          return {
            ...room,
            subRooms: filteredClosets
          };
        }
        return room;
      })
    }));

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors
        }
      })
    );
    setRemoved((prev) => !prev);
  };
  const handleRemoveItem = (closetId) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));

    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];
    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === activeRoomobj?.id) {
          let filteredClosets = room?.roomItems?.filter(
            (closet) => closet?.id !== closetId
          );
          return {
            ...room,
            roomItems: filteredClosets
          };
        }
        return room;
      })
    }));

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors
        }
      })
    );
    setRemoved((prev) => !prev);
  };

  const handleClickBoolean = (closetId, currentVal) => {
    let updatedSingleCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    let updatedFloors = [...updatedSingleCustomer?.scope?.floors];

    updatedFloors = updatedFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room?.id === currentRoom?.id) {
          return {
            ...room,
            subRooms: room?.subRooms?.map((closet) => {
              if (closet?.id === closetId) {
                return { ...closet, scope: !currentVal };
              }
              return closet;
            })
          };
        }
        return room;
      })
    }));

    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        scope: {
          ...singleCustomerData.scope,
          floors: updatedFloors
        }
      })
    );
  };

  return (
    <div className="w-full">
      <div className="text-[21px] m-auto !w-[540px] h-[70px] border-[1px] mt-4 px-6 rounded-[6px] flex justify-between items-center border-bgprimary">
        <Text className="text-black" style={{ fontWeight: 500 }}>
          {activeRoomobj?.name}
        </Text>
        <NoteField
          question="Total Room SF"
          value={currentRoom?.finalTotalSqFeet}
          handleNoteBlur={(e) =>
            handleClosetFieldBlur(e, "closet?.id", "totalSF")
          }
          register={register}
          id="totalRoomSF"
          name="totalRoomSF"
          type="number"
          filledOut={true}
        />
        <NoteField
          question="LF"
          value={currentRoom?.linear_ft}
          handleNoteBlur={(e) =>
            handleClosetFieldBlur(e, "closet?.id", "linear_ft")
          }
          register={register}
          id="linear_ft"
          name="linear_ft"
          type="number"
          filledOut={true}
        />
        {/* <Button
          className="round-small-btn !w-[30px] !h-[30px]"
          onClick={handleAddCloset}
        >
          <span className="text-[16px]">+</span>
        </Button> */}
        <Button
          className="round-small-btn !w-[30px] !h-[30px]"
          onClick={handleAddRoomItems}
        >
          <span className="text-[16px]">+</span>
        </Button>
      </div>
      <div
        className={`mt-3 pt-2 overflow-y-auto max-h-[352px] mx-4`}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
      >
        {/* {currentRoom?.subRooms?.map((closet) => (
          <ClosetDimension
            closet={closet}
            handleClosetFieldBlur={handleClosetFieldBlur}
            handleRemoveCloset={handleRemoveCloset}
            handleClickBoolean={handleClickBoolean}
            activeRoomobj={activeRoomobj}
            removed={removed}
            setIsDragEnabled={setIsDragEnabled}
          />
        ))} */}
        {currentRoom?.roomItems?.map((item) => (
          <RoomItem
            closet={item}
            handleClosetFieldBlur={handleClosetFieldBlur}
            handleRemoveCloset={handleRemoveItem}
            handleClickBoolean={handleClickBoolean}
            activeRoomobj={activeRoomobj}
            removed={removed}
            setIsDragEnabled={setIsDragEnabled}
          />
        ))}
      </div>
    </div>
  );
};

export default SubRoomArea;

SubRoomArea.propTypes = {
  floorId: PropTypes.string,
  activeRoomobj: PropTypes.object,
  setIsDragEnabled: PropTypes.func
};
