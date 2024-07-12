import React, { useEffect } from "react";
import MotionButton from "../UI/MotionButton";
import { useDispatch, useSelector } from "react-redux";
import { setFloor } from "../../redux/floorPlan";

const FloorChip = (props) => {
  const { floors, idx, floor } = props;
  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const dispatch = useDispatch();

  const changeFloor = () => {
    dispatch(setFloor(floor));
  };

  return (
    <div>
      <MotionButton
        className={`text-black border-[1px] 
        ${selectedFloor?.name === floor.name
            ? `!bg-[#007FFF] text-white`
            : "!bg-[##d8cacf87]"
          } 
        ${idx !== floors.length - 1 && "rounded-r-none"}
        ${idx !== 0 && "rounded-l-none"}
        `}
        onClick={changeFloor}
      >
        {floor.name}
      </MotionButton>
    </div>
  );
};

export default FloorChip;
