import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { v4 as uuidv4 } from "uuid";
import { updateSingleCustomerApi } from "../../../../redux/customer";

import { useDrop } from "react-dnd";
import GetIconFile from "../../../../assets/GetIconFile";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLTransitionProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  activeTransitionObj,
  roomIndex,
  index,
  handleClickRoomArea,
  // drop
}) => {
  const dispatch = useDispatch();

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const [{ isOver }, drop] = useDrop({
    accept: ["STAIRCASE"],
    drop: async (item) => {
      if (item.type === "From") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (item?.transition?.within_room_id) {
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.within_room_id
              )
          );

          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.within_room_id
            );

            if (oldRoomIndex !== -1) {
              let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex]?.transition_within_ids.includes(
                item.transition.id
              );

              if (isIncludeInTransitionTo) {
                const transitionIndex =
                  updatedSingleCustomer.transitions.findIndex(
                    (e) => e.id === item?.transition.id
                  );
                updatedSingleCustomer.transitions[
                  transitionIndex
                ].within_room_id = "";
                updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                  oldRoomIndex
                ].transition_within_ids = updatedSingleCustomer.scope.floors[
                  oldFloorIndex
                ].rooms[oldRoomIndex].transition_within_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }
          }
        }

        if (!item?.transition?.from_room_id) {
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item?.transition.id
          );

          updatedSingleCustomer.transitions[transitionIndex].from_room_id =
            roomObj.id;
          updatedSingleCustomer.scope.floors[index].rooms[
            roomIndex
          ].transition_from_ids = [
            ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
              .transition_from_ids,
            item.transition.id,
          ];
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        } else if (item?.transition?.from_room_id !== roomObj.id) {
          //Find Old Floor Index to remove transition id(from)
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.from_room_id
              )
          );
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item.transition.id
          );
          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.from_room_id
            );

            if (oldRoomIndex !== -1) {
              updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                oldRoomIndex
              ].transition_from_ids = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex].transition_from_ids?.filter(
                (e) => e !== item?.transition?.id
              );
              //Find Old Floor Index to remove StairCase id(To)

              //If staircase-to-ids have same staircase id then remove from staircase_to_ids array also update Staircase Object with empty string
              //For To to From Change
              let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
                index
              ].rooms[roomIndex]?.transition_to_ids.includes(
                item.transition.id
              );

              if (isIncludeInTransitionTo) {
                updatedSingleCustomer.transitions[transitionIndex].to_room_id =
                  "";
                updatedSingleCustomer.scope.floors[index].rooms[
                  roomIndex
                ].transition_to_ids = updatedSingleCustomer.scope.floors[
                  index
                ].rooms[roomIndex].transition_to_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }

            updatedSingleCustomer.transitions[transitionIndex].from_room_id =
              roomObj.id;
            updatedSingleCustomer.scope.floors[index].rooms[
              roomIndex
            ].transition_from_ids = [
              ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
                .transition_from_ids,
              item.transition.id,
            ];
          }
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (item.type === "To") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );
        if (item?.transition?.within_room_id) {
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.within_room_id
              )
          );

          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.within_room_id
            );

            if (oldRoomIndex !== -1) {
              let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex]?.transition_within_ids.includes(
                item.transition.id
              );

              if (isIncludeInTransitionTo) {
                const transitionIndex =
                  updatedSingleCustomer.transitions.findIndex(
                    (e) => e.id === item?.transition.id
                  );
                updatedSingleCustomer.transitions[
                  transitionIndex
                ].within_room_id = "";
                updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                  oldRoomIndex
                ].transition_within_ids = updatedSingleCustomer.scope.floors[
                  oldFloorIndex
                ].rooms[oldRoomIndex].transition_within_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }
          }
        }

        if (!item?.transition?.to_room_id) {
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item?.transition.id
          );

          updatedSingleCustomer.transitions[transitionIndex].to_room_id =
            roomObj.id;
          updatedSingleCustomer.scope.floors[index].rooms[
            roomIndex
          ].transition_to_ids = [
            ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
              .transition_to_ids,
            item.transition.id,
          ];
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        } else if (item?.transition?.to_room_id !== roomObj.id) {
          //Find Old Floor Index to remove StairCase id(from)
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.to_room_id
              )
          );
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item.transition.id
          );
          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.to_room_id
            );

            if (oldRoomIndex !== -1) {
              updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                oldRoomIndex
              ].transition_to_ids = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex].transition_to_ids?.filter(
                (e) => e !== item?.transition?.id
              );
              //Find Old Floor Index to remove StairCase id(To)

              //If staircase-to-ids have same staircase id then remove from staircase_to_ids array also update Staircase Object with empty string
              //For To to From Change
              let isIncludeInTransitionFrom =
                updatedSingleCustomer.scope.floors[index].rooms[
                  roomIndex
                ]?.transition_from_ids.includes(item.transition.id);

              if (isIncludeInTransitionFrom) {
                updatedSingleCustomer.transitions[
                  transitionIndex
                ].from_room_id = "";
                updatedSingleCustomer.scope.floors[index].rooms[
                  roomIndex
                ].transition_from_ids = updatedSingleCustomer.scope.floors[
                  index
                ].rooms[roomIndex].transition_from_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }

            updatedSingleCustomer.transitions[transitionIndex].to_room_id =
              roomObj.id;
            updatedSingleCustomer.scope.floors[index].rooms[
              roomIndex
            ].transition_to_ids = [
              ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
                .transition_to_ids,
              item.transition.id,
            ];
          }
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (item.type === "Within") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );
        //remove from_room_id
        if (item?.transition?.from_room_id) {
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.from_room_id
              )
          );

          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.from_room_id
            );

            if (oldRoomIndex !== -1) {
              let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex]?.transition_from_ids.includes(
                item.transition.id
              );

              if (isIncludeInTransitionTo) {
                const transitionIndex =
                  updatedSingleCustomer.transitions.findIndex(
                    (e) => e.id === item?.transition.id
                  );
                updatedSingleCustomer.transitions[
                  transitionIndex
                ].from_room_id = "";
                updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                  oldRoomIndex
                ].transition_from_ids = updatedSingleCustomer.scope.floors[
                  oldFloorIndex
                ].rooms[oldRoomIndex].transition_from_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }
          }
        }

        //remove_to_room id
        if (item?.transition?.to_room_id) {
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.to_room_id
              )
          );

          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.to_room_id
            );

            if (oldRoomIndex !== -1) {
              let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex]?.transition_to_ids.includes(
                item.transition.id
              );

              if (isIncludeInTransitionTo) {
                const transitionIndex =
                  updatedSingleCustomer.transitions.findIndex(
                    (e) => e.id === item?.transition.id
                  );
                updatedSingleCustomer.transitions[transitionIndex].to_room_id =
                  "";
                updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                  oldRoomIndex
                ].transition_to_ids = updatedSingleCustomer.scope.floors[
                  oldFloorIndex
                ].rooms[oldRoomIndex].transition_to_ids?.filter(
                  (e) => e !== item?.transition?.id
                );
              }
            }
          }
        }

        if (!item?.transition?.within_room_id) {
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item?.transition.id
          );

          updatedSingleCustomer.transitions[transitionIndex].within_room_id =
            roomObj.id;
          updatedSingleCustomer.scope.floors[index].rooms[
            roomIndex
          ].transition_within_ids = [
            ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
              .transition_within_ids,
            item.transition.id,
          ];
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        } else if (item?.transition?.within_room_id !== roomObj.id) {
          //Find Old Floor Index to remove transition id(from)
          const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (floor) =>
              floor.rooms.some(
                (room) => room.id === item?.transition?.within_room_id
              )
          );
          const transitionIndex = updatedSingleCustomer.transitions.findIndex(
            (e) => e.id === item.transition.id
          );
          if (oldFloorIndex !== -1) {
            const oldRoomIndex = updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].rooms.findIndex(
              (room) => room.id === item?.transition?.within_room_id
            );

            if (oldRoomIndex !== -1) {
              updatedSingleCustomer.scope.floors[oldFloorIndex].rooms[
                oldRoomIndex
              ].transition_within_ids = updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms[oldRoomIndex].transition_within_ids?.filter(
                (e) => e !== item?.transition?.id
              );
              //Find Old Floor Index to remove StairCase id(To)

              //If staircase-to-ids have same staircase id then remove from staircase_to_ids array also update Staircase Object with empty string
              //For To to From Change
              // let isIncludeInTransitionTo = updatedSingleCustomer.scope.floors[
              //   index
              // ].rooms[roomIndex]?.transition_to_ids.includes(
              //   item.transition.id
              // );

              // if (isIncludeInTransitionTo) {
              //   updatedSingleCustomer.transitions[transitionIndex].to_room_id =
              //     "";
              //   updatedSingleCustomer.scope.floors[index].rooms[
              //     roomIndex
              //   ].transition_to_ids = updatedSingleCustomer.scope.floors[
              //     index
              //   ].rooms[roomIndex].transition_to_ids?.filter(
              //     (e) => e !== item?.transition?.id
              //   );
              // }
            }

            updatedSingleCustomer.transitions[transitionIndex].within_room_id =
              roomObj.id;
            updatedSingleCustomer.scope.floors[index].rooms[
              roomIndex
            ].transition_within_ids = [
              ...updatedSingleCustomer.scope.floors[index].rooms[roomIndex]
                .transition_within_ids,
              item.transition.id,
            ];
          }
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const removeTransition = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove room id from transition
    const transitionIndex = updatedSingleCustomer.transitions.findIndex(
      ({ id }) => id === activeTransitionObj?.id
    );

    if (
      updatedSingleCustomer.transitions[transitionIndex].from_room_id ===
      roomObj.id
    ) {
      updatedSingleCustomer.transitions[transitionIndex] = {
        ...updatedSingleCustomer.transitions[transitionIndex],
        from_room_id: "",
      };

      // Remove repair id from room array =>> repair_ids
      const roomId = activeTransitionObj.from_room_id;
      const transitionIdToRemove = activeTransitionObj?.id;

      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                transition_from_ids: room.transition_from_ids.filter(
                  (id) => id !== transitionIdToRemove
                ),
              }
            : room
        ),
      }));

      updatedSingleCustomer.scope.floors = updatedFloor;
    } else if (
      updatedSingleCustomer?.transitions[transitionIndex]?.to_room_id ===
      roomObj?.id
    ) {
      updatedSingleCustomer.transitions[transitionIndex] = {
        ...updatedSingleCustomer.transitions[transitionIndex],
        to_room_id: "",
      };
      // Remove repair id from room array =>> repair_ids
      const roomId = activeTransitionObj.to_room_id;
      const transitionIdToRemove = activeTransitionObj?.id;

      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                transition_to_ids: room.transition_to_ids.filter(
                  (id) => id !== transitionIdToRemove
                ),
              }
            : room
        ),
      }));
      updatedSingleCustomer.scope.floors = updatedFloor;
    } else {
      updatedSingleCustomer.transitions[transitionIndex] = {
        ...updatedSingleCustomer.transitions[transitionIndex],
        within_room_id: "",
      };

      // Remove repair id from room array =>> repair_ids
      const roomId = activeTransitionObj.within_room_id;
      const transitionIdToRemove = activeTransitionObj?.id;

      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                transition_within_ids: room.transition_within_ids.filter(
                  (id) => id !== transitionIdToRemove
                ),
              }
            : room
        ),
      }));
      updatedSingleCustomer.scope.floors = updatedFloor;
    }
    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
  };

  return (
    <div
      style={{
        opacity: isOver ? 0.5 : 1,
        transform: `scale(${isOver ? 0.95 : 1})`,
      }}
    >
      <ProjectMotionBtn
        ref={drop}
        className={`decoration-black ${className} relative`}
        style={
          activeTransitionObj?.from_room_id === roomObj.id
            ? {
                backgroundColor: `${"#8EC24A"}`,
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
            : activeTransitionObj?.to_room_id === roomObj.id
            ? {
                backgroundColor: `${"#F8842F"}`,
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
            : activeTransitionObj?.within_room_id === roomObj.id
            ? {
                backgroundColor: `${"#1A65D6"}`,
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
            : {
                backgroundColor: "white",
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
        }
        type={type}
        shouldExpandIconShow={true}
        handleClickRoomArea={(e) => handleClickRoomArea(e, roomObj)}
      >
        <GetRoomIcon
          iconName={buttonName}
          data={
            roomObj.transition_from_ids.includes(activeTransitionObj.id) ||
            roomObj.transition_to_ids.includes(activeTransitionObj.id) ||
            roomObj.transition_within_ids.includes(activeTransitionObj.id)
              ? { color: "white" }
              : { color: "#505050" }
          }
        />
        <Text
          className={`${
            roomObj.transition_from_ids.includes(activeTransitionObj.id) ||
            roomObj.transition_to_ids.includes(activeTransitionObj.id) ||
            roomObj.transition_within_ids.includes(activeTransitionObj.id)
              ? "!text-white"
              : "text-black"
          } text-[13px]`}
        >
          {roomObj?.name}
        </Text>
        {(roomObj.transition_from_ids?.includes(activeTransitionObj?.id) ||
          roomObj.transition_to_ids?.includes(activeTransitionObj?.id) ||
          roomObj.transition_within_ids?.includes(activeTransitionObj?.id)) && (
          <motion.div
            className={`absolute -top-1.5 -right-0.5 rounded-full bg-white padding-2.5`}
            transition={{ duration: 1 }}
            onClick={() => removeTransition(roomObj)}
          >
            <GetIconFile
              data={{ width: "20px", height: "20px" }}
              iconName="remove-icon"
            />
          </motion.div>
        )}
      </ProjectMotionBtn>
    </div>
  );
};

export default CLTransitionProjectButton;

CLTransitionProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
