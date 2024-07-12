import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import GetIconFile from "../../../../assets/GetIconFile";

const CLStairCaseProjectFloors = ({
  addedFloors,
  floor,
  index,
  activeStairCaseObj,
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

        if (!item?.stairCase?.from_floor_id) {
          const staircaseIndex = updatedSingleCustomer.staircases.findIndex(
            (e) => e.id === item?.stairCase.id
          );
          updatedSingleCustomer.staircases[staircaseIndex].from_floor_id =
            floor.id;
          updatedSingleCustomer.scope.floors[index].staircase_from_ids = [
            ...updatedSingleCustomer.scope.floors[index].staircase_from_ids,
            item.stairCase.id,
          ];
        } else if (item?.stairCase?.from_floor_id !== floor.id) {
          //Find Old Floor Index to remove StairCase id(from)
          let oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (e) => e.id === item?.stairCase?.from_floor_id
          );
          updatedSingleCustomer.scope.floors[oldFloorIndex].staircase_from_ids =
            updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].staircase_from_ids?.filter((e) => e !== item?.stairCase?.id);
          const staircaseIndex = updatedSingleCustomer.staircases.findIndex(
            (e) => e.id === item.stairCase.id
          );
          //Find Old Floor Index to remove StairCase id(To)

          //If staircase-to-ids have same staircase id then remove from staircase_to_ids array also update Staircase Object with empty string
          //For To to From Change
          let isInlcudeInStaircaseTo = updatedSingleCustomer.scope.floors[
            index
          ]?.staircase_to_ids.includes(item.stairCase.id);

          if (isInlcudeInStaircaseTo) {
            updatedSingleCustomer.staircases[staircaseIndex].to_floor_id = "";
            updatedSingleCustomer.scope.floors[index].staircase_to_ids =
              updatedSingleCustomer.scope.floors[
                index
              ].staircase_to_ids?.filter((e) => e !== item?.stairCase?.id);
          }

          updatedSingleCustomer.staircases[staircaseIndex].from_floor_id =
            floor.id;
          updatedSingleCustomer.scope.floors[index].staircase_from_ids = [
            ...updatedSingleCustomer.scope.floors[index].staircase_from_ids,
            item.stairCase.id,
          ];
        }
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else if (item.type === "To") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        if (!item?.stairCase?.to_floor_id) {
          const staircaseIndex = updatedSingleCustomer.staircases.findIndex(
            (e) => e.id === item?.stairCase.id
          );
          updatedSingleCustomer.staircases[staircaseIndex].to_floor_id =
            floor.id;
          updatedSingleCustomer.scope.floors[index].staircase_to_ids = [
            ...updatedSingleCustomer.scope.floors[index].staircase_to_ids,
            item.stairCase.id,
          ];
        } else if (item?.stairCase?.to_floor_id !== floor.id) {
          //Find Old Floor Index to remove StairCase id(To)
          let oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
            (e) => e.id === item?.stairCase?.to_floor_id
          );
          updatedSingleCustomer.scope.floors[oldFloorIndex].staircase_to_ids =
            updatedSingleCustomer.scope.floors[
              oldFloorIndex
            ].staircase_to_ids?.filter((e) => e !== item?.stairCase?.id);

          //Find Old Floor Index to remove StairCase id(From)

          const staircaseIndex = updatedSingleCustomer.staircases.findIndex(
            (e) => e.id === item.stairCase.id
          );

          //If staircase-to-ids have same staircase id then remove from staircase_to_ids array also update Staircase Object with empty string
          //For To to From Change
          let isInlcudeInStaircaseFrom = updatedSingleCustomer.scope.floors[
            index
          ]?.staircase_from_ids.includes(item.stairCase.id);

          if (isInlcudeInStaircaseFrom) {
            updatedSingleCustomer.staircases[staircaseIndex].from_floor_id = "";
            updatedSingleCustomer.scope.floors[index].staircase_from_ids =
              updatedSingleCustomer.scope.floors[
                index
              ].staircase_from_ids?.filter((e) => e !== item?.stairCase?.id);
          }
          updatedSingleCustomer.staircases[staircaseIndex].to_floor_id =
            floor.id;
          updatedSingleCustomer.scope.floors[index].staircase_to_ids = [
            ...updatedSingleCustomer.scope.floors[index].staircase_to_ids,
            item.stairCase.id,
          ];
        }
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  //remove staircase checklist
  const removeStaircase = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove within_room id from repair
    const stairCaseIndex = updatedSingleCustomer.staircases.findIndex(
      ({ id }) => id === activeStairCaseObj?.id
    );

    if (
      updatedSingleCustomer.staircases[stairCaseIndex].from_floor_id ===
      floor.id
    ) {
      updatedSingleCustomer.staircases[stairCaseIndex] = {
        ...updatedSingleCustomer.staircases[stairCaseIndex],
        from_floor_id: "",
      };
      // Remove staircase id from room array =>> repair_ids
      const floorId = activeStairCaseObj.from_floor_id;
      const staircaseIdToRemove = activeStairCaseObj?.id;

      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        staircase_from_ids:
          floor.id === floorId
            ? floor?.staircase_from_ids?.filter(
                (id) => id !== staircaseIdToRemove
              )
            : floor.staircase_from_ids,
      }));

      updatedSingleCustomer.scope.floors = updatedFloor;
    } else {
      updatedSingleCustomer.staircases[stairCaseIndex] = {
        ...updatedSingleCustomer.staircases[stairCaseIndex],
        to_floor_id: "",
      };

      // Remove staircase id from room array =>> repair_ids
      const floorId = activeStairCaseObj.to_floor_id;
      const staircaseIdToRemove = activeStairCaseObj?.id;

      const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
        ...floor,
        staircase_to_ids:
          floor.id === floorId
            ? floor?.staircase_to_ids?.filter(
                (id) => id !== staircaseIdToRemove
              )
            : floor.staircase_to_ids,
      }));

      updatedSingleCustomer.scope.floors = updatedFloor;
    }

    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
  };
  return (
    <Grid
      ref={drop}
      item
      xs={12}
      md={addedFloors.length === 4 ? 3 : 4}
      key={`${floor.name}+${index}`}
      style={{
        position: "relative",
        opacity: isOver ? 0.5 : 1,
        transform: `scale(${isOver ? 0.95 : 1})`,
      }}
    >
      <div
        className={`${
          activeStairCaseObj?.from_floor_id === floor.id
            ? "!bg-[#8EC24A] text-white"
            : activeStairCaseObj?.to_floor_id === floor.id
            ? "!bg-[#F8842F] text-white"
            : "!bg-white"
        } flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]`}
      >
        <Text>{floor.name}</Text>
        {(activeStairCaseObj?.from_floor_id === floor.id ||
          activeStairCaseObj?.to_floor_id === floor.id) && (
          <div
            className={`absolute -top-1 -right-1`}
            onClick={() => removeStaircase(floor.name)}
          >
            <GetIconFile iconName="remove-icon" />
          </div>
        )}
      </div>
    </Grid>
  );
};

export default CLStairCaseProjectFloors;
