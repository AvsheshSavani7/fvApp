import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { v4 as uuidv4 } from "uuid";
import {
  setCLFloorDetailsColorUpdate,
  updateSingleCustomerApi,
} from "../../../../redux/customer";
import {
  floorDetailsCheckList,
  subFloorCheckList,
} from "../../../../utils/floorDetailsCheckList";
import { moldingChecklist } from "../../../../utils/moldingChecklist";
import ProjectMotionBtn from "../../ProjectMotionBtn";
import { useDrop } from "react-dnd";

const CLFloorDetailsProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  handleClickRoomArea,
}) => {
  const dispatch = useDispatch();

  const activeExistingFloorDetailsChecklistId = useSelector(
    (state) => state.customerReducer.activeExistingFloorDetailsChecklistId
  );
  const activeSubFloorFloorDetailsChecklistId = useSelector(
    (state) => state.customerReducer.activeSubFloorFloorDetailsChecklistId
  );
  const activeMoldingChecklistId = useSelector(
    (state) => state.customerReducer.activeMoldingChecklistId
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
  if (checkListActiveBtn === "existingMaterials") {
    let checkListObj = singleCustomerData.existing_materials.find(
      (checklist) => checklist.id === roomObj.existing_material_id
    );
    if (checkListObj) {
      bgColor = checkListObj?.color;
    } else if (roomObj?.existing_material_id === "OutOfScope") {
      bgColor = "#D8D8D8";
    }
  } else if (checkListActiveBtn === "subFloor") {
    let checkListObj = singleCustomerData.subfloor_details.find(
      (checklist) => checklist.id === roomObj.subfloor_detail_id
    );
    if (checkListObj) {
      bgColor = checkListObj?.color;
    } else if (roomObj?.subfloor_detail_id === "OutOfScope") {
      bgColor = "#D8D8D8";
    }
  } else if (checkListActiveBtn === "molding") {
    let checkListObj = singleCustomerData.molding?.find(
      (checklist) => checklist.id === roomObj.molding_id
    );
    if (checkListObj) {
      bgColor = checkListObj?.color;
    } else if (roomObj?.molding_id === "OutOfScope") {
      bgColor = "#D8D8D8";
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
            if (checkListActiveBtn === "existingMaterials") {
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].existing_material_id = "OutOfScope";
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].refinishing_checklists_id = "OutOfScope";
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].matching_refinishing_checklists_id = "OutOfScope";
            }
            if (checkListActiveBtn === "subFloor") {
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].subfloor_detail_id = "OutOfScope";
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].matching_installation_checklists_id = "OutOfScope";
            }
            if (checkListActiveBtn === "molding") {
              updatedSingleCustomer.scope.floors[floorIndex].rooms[
                roomIndex
              ].molding_id = "OutOfScope";
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
    if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "existingMaterials"
    ) {
      if (!roomData.existing_material_id) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.existing_materials.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              existing_material_id:
                room.id === roomId
                  ? activeExistingFloorDetailsChecklistId
                  : room.existing_material_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.existing_material_id === activeExistingFloorDetailsChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        let existingMaterialCheckList = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) =>
            existingMaterialCheckList.push(room.existing_material_id)
          )
        );

        const isChecklistUsed =
          updatedSingleCustomer?.existing_materials?.every((checklist) =>
            existingMaterialCheckList.includes(checklist.id)
          );

        let newColor;
        if (singleCustomerData.existing_materials.length >= 1) {
          if (singleCustomerData.existing_materials.length < 5) {
            let existingColors = singleCustomerData.existing_materials.map(
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
            updatedSingleCustomer?.existing_materials?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let existingImport = JSON.parse(
            JSON.stringify(floorDetailsCheckList)
          );

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of existingImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: existingImport,
          };
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              existing_material_id:
                room.id === roomId ? "" : room.existing_material_id,
            })),
          }));

          if (isChecklistUsed) {
            updatedSingleCustomer.existing_materials = [
              ...updatedSingleCustomer.existing_materials,
              newCheckList,
            ];
          }
          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.existing_material_id !== activeExistingFloorDetailsChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.existing_materials.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              existing_material_id:
                room.id === roomId
                  ? activeExistingFloorDetailsChecklistId
                  : room.existing_material_id,
              matching_refinishing_checklists_id:
                room.id === roomId &&
                room?.matching_refinishing_checklists_id === "OutOfScope"
                  ? ""
                  : room?.matching_refinishing_checklists_id,
              refinishing_checklists_id:
                room.id === roomId &&
                room?.refinishing_checklists_id === "OutOfScope"
                  ? ""
                  : room.refinishing_checklists_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "subFloor"
    ) {
      if (!roomData.subfloor_detail_id) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.subfloor_details.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              subfloor_detail_id:
                room.id === roomId
                  ? activeSubFloorFloorDetailsChecklistId
                  : room.subfloor_detail_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.subfloor_detail_id === activeSubFloorFloorDetailsChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );
        let subFloorCheckList1 = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) =>
            subFloorCheckList1.push(room.subfloor_detail_id)
          )
        );

        const isChecklistUsed = updatedSingleCustomer?.subfloor_details?.every(
          (checklist) => subFloorCheckList1.includes(checklist.id)
        );

        let newColor;
        if (singleCustomerData.subfloor_details.length >= 1) {
          if (singleCustomerData.subfloor_details.length < 5) {
            let existingColors = singleCustomerData.subfloor_details.map(
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
            updatedSingleCustomer?.subfloor_details?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let subFloorImport = JSON.parse(JSON.stringify(subFloorCheckList));

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of subFloorImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: subFloorImport,
          };
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              subfloor_detail_id:
                room.id === roomId ? "" : room.subfloor_detail_id,
            })),
          }));

          if (isChecklistUsed) {
            updatedSingleCustomer.subfloor_details = [
              ...updatedSingleCustomer.subfloor_details,
              newCheckList,
            ];
          }
          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (
        roomData.subfloor_detail_id !== activeSubFloorFloorDetailsChecklistId
      ) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.subfloor_details.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              subfloor_detail_id:
                room.id === roomId
                  ? activeSubFloorFloorDetailsChecklistId
                  : room.subfloor_detail_id,
              matching_installation_checklists_id:
                room.id === roomId &&
                room?.matching_installation_checklists_id === "OutOfScope"
                  ? ""
                  : room?.matching_installation_checklists_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    } else if (
      activeBtnKey === "floorDetails" &&
      checkListActiveBtn === "molding"
    ) {
      if (!roomData.molding_id) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.molding.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              molding_id:
                room.id === roomId ? activeMoldingChecklistId : room.molding_id,
            })),
          }));

          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (roomData.molding_id === activeMoldingChecklistId) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );
        let moldingCheckList1 = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry.rooms.map((room) => moldingCheckList1.push(room.molding_id))
        );

        const isChecklistUsed = updatedSingleCustomer?.molding?.every(
          (checklist) => moldingCheckList1.includes(checklist.id)
        );

        let newColor;
        if (singleCustomerData.molding.length >= 1) {
          if (singleCustomerData.molding.length < 5) {
            let existingColors = singleCustomerData?.molding?.map(
              (e) => e.color
            );
            const filteredColors = store?.checkListDefaultColor?.filter(
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
            updatedSingleCustomer?.molding?.map((CheckList) =>
              usedColor.push(CheckList.color)
            );

            newColor = generateRandomColor(usedColor);
          }

          let moldingImport = JSON.parse(JSON.stringify(moldingChecklist));

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj?.subQuestion && obj.subQuestion.length > 0) {
              for (const subQ of obj?.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of moldingImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: moldingImport,
          };
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              molding_id: room.id === roomId ? "" : room.molding_id,
            })),
          }));

          if (isChecklistUsed) {
            updatedSingleCustomer.molding = [
              ...updatedSingleCustomer.molding,
              newCheckList,
            ];
          }
          updatedSingleCustomer.scope.floors = updatedData;

          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      } else if (roomData.molding_id !== activeMoldingChecklistId) {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (singleCustomerData.molding?.length >= 1) {
          let floors = [...updatedSingleCustomer.scope.floors];

          const updatedData = floors.map((item) => ({
            ...item,
            rooms: item.rooms.map((room) => ({
              ...room,
              molding_id:
                room.id === roomId ? activeMoldingChecklistId : room.molding_id,
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
          className={`decoration-black ${className} `}
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
            iconName={buttonName}
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

export default CLFloorDetailsProjectButton;

CLFloorDetailsProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
