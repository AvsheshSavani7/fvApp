import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CheckListProjectButton from "./CheckListProjectButton";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import { refishingCheckList } from "../../../../utils/checkList";
import { v4 as uuidv4 } from "uuid";
import { useDrop } from "react-dnd";

const CheckListProjectFloors = ({
  addedFloors,
  floor,
  index,
  handleClickRoomArea,
}) => {
  const activeRefinihsingChecklistId = useSelector(
    (state) => state.customerReducer.activeRefinihsingChecklistId
  );
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
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

        if (checkListActiveBtn === "refinishing") {
          updatedSingleCustomer.scope.floors[index].rooms.forEach((item) => {
            item.refinishing_checklists_id = "OutOfScope";
            item.existing_material_id = "OutOfScope";
            item.matching_refinishing_checklists_id = "OutOfScope";
          });
        }
        console.log("updatedSingleCustomer", updatedSingleCustomer);

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleFloorClick = () => {
    let checkListIds = floor.rooms.map((id) => id.refinishing_checklists_id);
    const isAllRoomSameId = checkListIds.every(
      (item) => item === activeRefinihsingChecklistId
    );
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (isAllRoomSameId) {
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

        let refinishingImport = JSON.parse(JSON.stringify(refishingCheckList));

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
        // let floors = [...updatedSingleCustomer.scope.floors];

        // const updatedData = floors.map((item) => ({
        //   ...item,
        //   rooms: item.rooms.map((room) => ({
        //     ...room,
        //     refinishing_checklists_id:
        //       room.id === roomId ? "" : room.refinishing_checklists_id,
        //   })),
        // }));

        const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
          (item) => ({
            ...item,
            refinishing_checklists_id: "",
          })
        );

        updatedSingleCustomer.scope.floors[index] = {
          ...updatedSingleCustomer.scope.floors[index],
          rooms: updatedData,
        };
        if (isChecklistUsed) {
          updatedSingleCustomer.refinishing_checklists = [
            ...updatedSingleCustomer.refinishing_checklists,
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
          refinishing_checklists_id: activeRefinihsingChecklistId,
          existing_material_id:
            item?.existing_material_id === "OutOfScope"
              ? ""
              : item?.existing_material_id,
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
            <CheckListProjectButton
              src={room?.icon}
              buttonName={room?.name}
              type="button"
              room={room}
              roomObj={roomObj}
              floor={floor}
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

export default CheckListProjectFloors;
