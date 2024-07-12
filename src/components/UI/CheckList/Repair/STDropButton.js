import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import { useDrop } from "react-dnd";
import GetIconFile from "../../../../assets/GetIconFile";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const STDropButton = ({
  staircaseName,
  className,
  type = "button",
  stObj,
  activeRepairObj,
}) => {
  const dispatch = useDispatch();

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const [{ isOver }, drop] = useDrop({
    accept: ["REPAIR"],
    drop: async (item) => {
      if (item.type === "Within") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const repairId = item.repair?.id; // The new repair ID you want to add

        const updatedRapairs = updatedSingleCustomer?.repairs?.map((repair) => {
          if (repair?.id === repairId) {
            return {
              ...repair,
              within_staircase_id: stObj?.id,
              within_room_id: "",
            };
          }
          return repair;
        });

        const updatedFloor = updatedSingleCustomer.scope.floors.map(
          (floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) => {
              if (room?.repair_ids?.includes(repairId)) {
                return {
                  ...room,
                  repair_ids: room.repair_ids.filter((id) => id !== repairId),
                };
              }
              return room;
            }),
          })
        );

        const updatedStaircases = updatedSingleCustomer?.staircases?.map(
          (st) => {
            if (st?.id !== stObj?.id && st?.repair_ids?.length > 0) {
              if (st?.repair_ids?.includes(repairId)) {
                return {
                  ...st,
                  repair_ids: st?.repair_ids?.filter((id) => id !== repairId),
                };
              }
            } else if (
              st?.id === stObj?.id &&
              !st?.repair_ids?.includes(repairId)
            ) {
              return {
                ...st,
                repair_ids:
                  st?.repair_ids?.length > 0
                    ? [...st?.repair_ids, repairId]
                    : [repairId],
              };
            }
            return st;
          }
        );

        updatedSingleCustomer.repairs = updatedRapairs;
        updatedSingleCustomer.scope.floors = updatedFloor;
        updatedSingleCustomer.staircases = updatedStaircases;

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
      stObj?.repair_ids?.length > 0 &&
      stObj?.repair_ids?.includes(activeRepairObj?.id)
    ) {
      setBgColor("#1A65D6");
    } else {
      setBgColor("");
    }
  }, [singleCustomerData, activeRepairObj]);

  const removeRepair = (staircase) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove within_room id from repair
    const repairIndex = updatedSingleCustomer.repairs.findIndex(
      ({ id }) => id === activeRepairObj?.id
    );
    updatedSingleCustomer.repairs[repairIndex] = {
      ...updatedSingleCustomer.repairs[repairIndex],
      within_staircase_id: "",
    };

    const repairIdToRemove = activeRepairObj?.id;

    const updatedStaircases = updatedSingleCustomer?.staircases?.map((st) => {
      if (st?.id === staircase?.id) {
        return {
          ...st,
          repair_ids:
            st?.repair_ids?.filter((id) => id !== repairIdToRemove) || [],
        };
      }
      return st;
    });

    updatedSingleCustomer.staircases = updatedStaircases;
    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
  };

  return (
    <div
      style={{
        opacity: isOver ? 0.5 : 1,
        transform: `scale(${isOver ? 0.95 : 1})`,
        minWidth: "150px",
      }}
    >
      <ProjectMotionBtn
        ref={drop}
        className={`decoration-black ${className} relative`}
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
      >
        <GetRoomIcon
          iconName={stObj?.type || stObj?.name}
          data={bgColor ? { color: "white" } : { color: "#505050" }}
        />
        <Text
          className={`${
            bgColor ? "!text-white" : "text-black"
          } text-[13px] text-center`}
        >
          {staircaseName}
        </Text>
        {stObj.repair_ids?.includes(activeRepairObj?.id) && (
          <motion.div
            className={`absolute -top-1.5 -right-0.5 rounded-full bg-white padding-2.5`}
            onClick={() => removeRepair(stObj)}
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

export default STDropButton;

STDropButton.propTypes = {
  className: PropTypes.string,
  staircaseName: PropTypes.string,
  stObj: PropTypes.object,
  activeRepairObj: PropTypes.object,
  type: PropTypes.oneOf(["button", "submit"]),
};
