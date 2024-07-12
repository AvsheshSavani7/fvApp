import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CLFloorDetailsProjectButton from "./CLFloorDetailsProjectButton";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import {
  floorDetailsCheckList,
  subFloorCheckList,
} from "../../../../utils/floorDetailsCheckList";
import { v4 as uuidv4 } from "uuid";
import { moldingChecklist } from "../../../../utils/moldingChecklist";
import { useDrop } from "react-dnd";

const CLFloorDetailsProjectFloors = ({
  addedFloors,
  floor,
  index,
  handleClickRoomArea,
}) => {
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
  const store = useSelector((state) => state.customerReducer);

  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: ["OutOfScope"],
    drop: async (item) => {
      if (item.type === "OutofScope") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (checkListActiveBtn === "existingMaterials") {
          updatedSingleCustomer.scope.floors[index].rooms.forEach((item) => {
            item.existing_material_id = "OutOfScope";
            item.matching_refinishing_checklists_id = "OutOfScope";
            item.refinishing_checklists_id = "OutOfScope";
          });
        } else if (checkListActiveBtn === "subFloor") {
          updatedSingleCustomer.scope.floors[index].rooms.forEach((item) => {
            item.subfloor_detail_id = "OutOfScope";
            item.matching_installation_checklists_id = "OutOfScope";
          });
        } else if (checkListActiveBtn === "molding") {
          updatedSingleCustomer.scope.floors[index].rooms.forEach((item) => {
            item.molding_id = "OutOfScope";
          });
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleFloorClick = () => {
    if (checkListActiveBtn === "existingMaterials") {
      let checkListIds = floor.rooms.map((id) => id.existing_material_id);
      const isAllRoomSameId = checkListIds.every(
        (item) => item === activeExistingFloorDetailsChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
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

          const updatedData = updatedSingleCustomer.scope.floors[
            index
          ].rooms.map((item) => ({
            ...item,
            existing_material_id: "",
          }));

          updatedSingleCustomer.scope.floors[index] = {
            ...updatedSingleCustomer.scope.floors[index],
            rooms: updatedData,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.existing_materials = [
              ...updatedSingleCustomer.existing_materials,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
          (item) => ({
            ...item,
            existing_material_id: activeExistingFloorDetailsChecklistId,
            refinishing_checklists_id:
              item?.refinishing_checklists_id === "OutOfScope"
                ? ""
                : item?.refinishing_checklists_id,

            matching_refinishing_checklists_id:
              item?.matching_refinishing_checklists_id === "OutOfScope"
                ? ""
                : item?.matching_refinishing_checklists_id,
          })
        );

        updatedSingleCustomer.scope.floors[index] = {
          ...updatedSingleCustomer.scope.floors[index],
          rooms: updatedData,
        };

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }

    if (checkListActiveBtn === "subFloor") {
      let checkListIds = floor.rooms.map((id) => id.subfloor_detail_id);
      const isAllRoomSameId = checkListIds.every(
        (item) => item === activeSubFloorFloorDetailsChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
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
          const updatedData = updatedSingleCustomer.scope.floors[
            index
          ].rooms.map((item) => ({
            ...item,
            subfloor_detail_id: "",
          }));

          updatedSingleCustomer.scope.floors[index] = {
            ...updatedSingleCustomer.scope.floors[index],
            rooms: updatedData,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.subfloor_details = [
              ...updatedSingleCustomer.subfloor_details,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
          (item) => ({
            ...item,
            subfloor_detail_id: activeSubFloorFloorDetailsChecklistId,
            matching_installation_checklists_id:
              item?.matching_installation_checklists_id === "OutOfScope"
                ? ""
                : item?.matching_installation_checklists_id,
          })
        );

        updatedSingleCustomer.scope.floors[index] = {
          ...updatedSingleCustomer.scope.floors[index],
          rooms: updatedData,
        };

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }

    if (checkListActiveBtn === "molding") {
      let checkListIds = floor.rooms.map((id) => id?.molding_id);
      const isAllRoomSameId = checkListIds?.every(
        (item) => item === activeMoldingChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
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

          const updatedData = updatedSingleCustomer.scope.floors?.[
            index
          ]?.rooms?.map((item) => ({
            ...item,
            molding_id: "",
          }));

          updatedSingleCustomer.scope.floors[index] = {
            ...updatedSingleCustomer.scope.floors[index],
            rooms: updatedData,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.molding = [
              ...updatedSingleCustomer.molding,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
          (item) => ({
            ...item,
            molding_id: activeMoldingChecklistId,
          })
        );

        updatedSingleCustomer.scope.floors[index] = {
          ...updatedSingleCustomer.scope.floors[index],
          rooms: updatedData,
        };

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  };
  return (
    <Grid
      item
      xs={12}
      md={addedFloors.length === 4 ? 3 : 4}
      key={`${floor.name}+${index}`}
      style={{ opacity: 1, position: "relative" }}
    >
      <div
        style={{
          opacity: isOver ? 0.5 : 1,
          transform: `scale(${isOver ? 0.95 : 1})`,
        }}
      >
        <div
          className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]"
          onClick={() => handleFloorClick()}
          ref={drop}
        >
          <Text>{floor.name}</Text>
        </div>
      </div>
      <div className="space-y-2 py-2 overflow-y-auto	h-[275px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <CLFloorDetailsProjectButton
              src={room?.icon}
              buttonName={room?.name}
              type="button"
              room={room}
              floor={floor}
              roomObj={roomObj}
              setIsDragEnabled={() => {}}
              onClick={() => {}}
              handleClickRoomArea={handleClickRoomArea}
            />
          );
        })}
      </div>
    </Grid>
  );
};

export default CLFloorDetailsProjectFloors;
