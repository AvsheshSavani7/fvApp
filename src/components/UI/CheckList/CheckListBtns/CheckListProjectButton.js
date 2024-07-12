import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { v4 as uuidv4 } from "uuid";
import { refishingCheckList } from "../../../../utils/checkList";
import {
  setCheckListColorUpdate,
  updateSingleCustomerApi,
} from "../../../../redux/customer";
import ProjectMotionBtn from "../../ProjectMotionBtn";
import { useDrop } from "react-dnd";

const CheckListProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
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

  var bgColor = "";
  if (checkListActiveBtn === "refinishing") {
    let checkListObj = singleCustomerData.refinishing_checklists.find(
      (checklist) => checklist.id === roomObj.refinishing_checklists_id
    );
    if (checkListObj) {
      bgColor = checkListObj?.color;
    } else if (roomObj?.refinishing_checklists_id === "OutOfScope") {
      bgColor = "#D8D8D8";
    }
  } else if (checkListActiveBtn === "installation") {
    let checkListObj = singleCustomerData.installation_checklists.find(
      (checklist) => checklist.id === roomObj.installation_checklist_id
    );
    if (checkListObj) {
      bgColor = checkListObj?.color;
    }
  }

  const [{ isOver }, drop] = useDrop({
    accept: ["OutOfScope"],
    drop: async (item) => {
      if (item.type === "OutofScope") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor

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
            if (checkListActiveBtn === "refinishing") {
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].refinishing_checklists_id = "OutOfScope";
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].existing_material_id = "OutOfScope";
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].matching_refinishing_checklists_id = "OutOfScope";
            }
          }
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleRoomClick = (roomId, roomData) => {
    if (activeBtnKey === "checklist" && checkListActiveBtn === "refinishing") {
      if (!roomData.refinishing_checklists_id) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.refinishing_checklists.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              refinishing_checklists_id:
                room.id === roomId
                  ? activeRefinihsingChecklistId
                  : room.refinishing_checklists_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.refinishing_checklists_id === activeRefinihsingChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        let refinishingIds = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) =>
            refinishingIds.push(room.refinishing_checklists_id)
          )
        );

        const isChecklistUsed =
          updatedSingleCustomer?.refinishing_checklists?.every((checklist) =>
            refinishingIds.includes(checklist.id)
          );

        let newColor;
        if (singleCustomerData.refinishing_checklists.length >= 1) {
          if (singleCustomerData.refinishing_checklists.length < 5) {
            let existingColors = singleCustomerData.refinishing_checklists.map(
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
            updatedSingleCustomer?.refinishing_checklists?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );
            newColor = generateRandomColor(usedColor);
          }

          let refinishingImport = JSON.parse(
            JSON.stringify(refishingCheckList)
          );

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
              refinishing_checklists_id:
                room.id === roomId ? "" : room.refinishing_checklists_id,
            })),
          }));
          if (isChecklistUsed) {
            updatedSingleCustomer.refinishing_checklists = [
              ...updatedSingleCustomer.refinishing_checklists,
              newCheckList,
            ];
          }
          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.refinishing_checklists_id !== activeRefinihsingChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.refinishing_checklists.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              refinishing_checklists_id:
                room.id === roomId
                  ? activeRefinihsingChecklistId
                  : room.refinishing_checklists_id,
              existing_material_id:
                room.id === roomId &&
                room?.existing_material_id === "OutOfScope"
                  ? ""
                  : room?.existing_material_id,
              matching_refinishing_checklists_id:
                room.id === roomId &&
                room?.matching_refinishing_checklists_id === "OutOfScope"
                  ? ""
                  : room?.matching_refinishing_checklists_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    }
  };

  return (
    <>
      <div
        style={{
          opacity: isOver ? 0.5 : 1,
          transform: `scale(${isOver ? 0.95 : 1})`,
        }}
      >
        <ProjectMotionBtn
          ref={drop}
          className={`
          decoration-black ${className} `}
          style={
            bgColor
              ? {
                  backgroundColor: `${bgColor}`,
                  zIndex: "1 !important",
                  opacity: isOver ? 0.5 : 1,
                }
              : {
                  backgroundColor: "#CF1200",
                  zIndex: "1 !important",
                  opacity: isOver ? 0.5 : 1,
                }
          }
          type={type}
          onClick={() => handleRoomClick(roomObj.id, roomObj)}
          shouldExpandIconShow={true}
          handleClickRoomArea={(e) => handleClickRoomArea(e, roomObj)}
        >
          <GetRoomIcon
            iconName={roomObj?.type}
            data={bgColor ? { color: "white" } : { color: "white" }}
          />
          <Text
            className={`${bgColor ? "!text-white" : "text-white"} text-[13px]`}
          >
            {roomObj?.name}
          </Text>
        </ProjectMotionBtn>
      </div>
    </>
  );
};

export default CheckListProjectButton;

CheckListProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
