import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { v4 as uuidv4 } from "uuid";
import { levelingCheckList } from "../../../../utils/levelingCheckList";
import {
  setCheckListColorUpdate,
  updateSingleCustomerApi,
} from "../../../../redux/customer";
import { useDrop } from "react-dnd";
import GetIconFile from "../../../../assets/GetIconFile";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const LevelingProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  activeLevelingObj,
  activeLevelingId,
  handleClickRoomArea,
}) => {
  const dispatch = useDispatch();

  const activeRefinihsingChecklistId = useSelector(
    (state) => state.customerReducer.activeRefinihsingChecklistId
  );
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const store = useSelector((state) => state.customerReducer);

  const [{ isOver }, drop] = useDrop({
    accept: ["REPAIR"],
    drop: async (item) => {
      if (item.type === "Within") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor
        const newLevelingId = item.levelings?.id; // The new repair ID you want to add

        const levelingIndex = updatedSingleCustomer.levellings.findIndex(
          ({ id }) => id === item.levelings?.id
        );
        if (levelingIndex !== -1) {
          updatedSingleCustomer.levellings[levelingIndex] = {
            ...updatedSingleCustomer.levellings[levelingIndex],
            within_room_id: [
              ...updatedSingleCustomer.levellings[levelingIndex].within_room_id,
              roomObj?.id,
            ],
          };
        }

        // // Find the floor index in the "floors" array
        const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
          (floor) => floor.name === floorName
        );

        if (floorIndex !== -1) {
          // Find the room index in the "rooms" array within the floor
          const roomIndex = updatedSingleCustomer.scope.floors[
            floorIndex
          ].rooms.findIndex((room) => room?.id === roomObj?.id);

          if (roomIndex !== -1) {
            // Add the new repair ID to the "repair_ids" array of the room
            updatedSingleCustomer.scope.floors[floorIndex].rooms[
              roomIndex
            ].levelling_id.push(newLevelingId);
          }
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    if (
      roomObj.levelling_id.length > 0 &&
      roomObj.levelling_id.includes(activeLevelingObj?.id)
    ) {
      setBgColor("#1A65D6");
    } else {
      setBgColor("");
    }
  }, [singleCustomerData, activeLevelingObj]);

  const handleRoomClick = (roomId, roomData) => {
    if (activeBtnKey === "leveling") {
      if (!roomData.levelling_id) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.levellings.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              levelling_id:
                room.id === roomId ? activeLevelingId : room.levelling_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (roomData.levelling_id === activeLevelingId) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        let refinishingIds = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) => refinishingIds.push(room.levelling_id))
        );

        const isChecklistUsed = updatedSingleCustomer?.levellings?.every(
          (checklist) => refinishingIds.includes(checklist.id)
        );

        let newColor;
        if (singleCustomerData.levellings.length >= 1) {
          if (singleCustomerData.levellings.length < 5) {
            let existingColors = singleCustomerData.levellings.map(
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
            updatedSingleCustomer?.levellings?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );
            newColor = generateRandomColor(usedColor);
          }

          let refinishingImport = JSON.parse(JSON.stringify(levelingCheckList));

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
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              levelling_id: room.id === roomId ? "" : room.levelling_id,
            })),
          }));
          if (isChecklistUsed) {
            updatedSingleCustomer.levellings = [
              ...updatedSingleCustomer.levellings,
              newCheckList,
            ];
          }
          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (roomData.levelling_id !== activeLevelingId) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.levellings.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              levelling_id:
                room.id === roomId ? activeLevelingId : room.levelling_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    }
  };

  const removeLeveling = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove within_room id from repair
    const levelingIndex = updatedSingleCustomer.levellings.findIndex(
      ({ id }) => id === activeLevelingObj?.id
    );
    updatedSingleCustomer.levellings[levelingIndex] = {
      ...updatedSingleCustomer.levellings[levelingIndex],
      within_room_id: updatedSingleCustomer?.levellings[
        levelingIndex
      ].within_room_id.filter((id) => id !== roomObj?.id),
    };

    // Remove repair id from room array =>> repair_ids
    const roomIdArray = activeLevelingObj.within_room_id;
    const repairIdToRemove = activeLevelingObj?.id;

    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === roomObj?.id
          ? {
              ...room,
              levelling_id: room.levelling_id.filter(
                (id) => id !== repairIdToRemove
              ),
            }
          : room
      ),
    }));

    updatedSingleCustomer.scope.floors = updatedFloor;
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
        className={`decoration-black ${className} `}
        style={
          bgColor
            ? {
                backgroundColor: `${bgColor}`,
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
        // onClick={() => handleRoomClick(roomObj.id, roomObj)}
      >
        <GetRoomIcon
          iconName={buttonName}
          data={bgColor ? { color: "white" } : { color: "black" }}
        />
        <Text
          className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}
        >
          {roomObj?.name}
        </Text>
        {roomObj.levelling_id?.includes(activeLevelingObj?.id) && (
          <motion.div
            className={`absolute -top-1.5 -right-0.5 rounded-full bg-white padding-2.5`}
            onClick={() => removeLeveling(roomObj)}
            transition={{ duration: 1 }}
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

export default LevelingProjectButton;

LevelingProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
