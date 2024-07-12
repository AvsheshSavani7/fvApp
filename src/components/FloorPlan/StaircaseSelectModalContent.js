import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import MotionButton from "../UI/MotionButton";

const StaircaseSelectModalContent = (props) => {
  const { onClose } = props;

  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const floorStaircases = useSelector(
    (state) => state.floorPlan.floorStaircases
  );
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const [selectedStaircase, setSelectedStaircase] = useState({});
  const [openStaircaseTypeModal, setOpenStaircaseTypeModal] = useState(false);

  const dispatch = useDispatch();

  const floorName = useMemo(() => {
    return selectedFloor.name;
  }, [selectedFloor]);

  const staircases = useMemo(() => {
    const leftStaircases = _.filter(
      singleCustomerData?.staircases,
      (staircase) =>
        !_.some(floorStaircases?.[floorName], (st) => st.id === staircase.id)
    );

    return leftStaircases;
  }, [singleCustomerData, floorStaircases, floorName]);

  const selectStaircase = useCallback(
    (st) => {
      setSelectedStaircase(st);
    },
    [setSelectedStaircase]
  );

  const handleNextStep = useCallback(() => {
    setOpenStaircaseTypeModal(true);
    onClose();
  }, [setOpenStaircaseTypeModal, onClose]);

  const makeButtonActive = useMemo(() => {
    const selectedRoomIsInCurrentRooms = _.some(
      staircases,
      (s) => s?.id === selectedStaircase?.id
    );
    return selectedRoomIsInCurrentRooms;
  }, [staircases, selectedStaircase]);

  return (
    <>
      <div className="space-y-2 flex flex-col items-center mt-4">
        {staircases.map((s) => {
          const stName = _.find(
            s.all_questions,
            (que) => que.question === "Name of Staircase"
          ).question;
          return (
            <MotionButton
              key={s.id}
              className={`border-[1px] text-black shadow-none w-1/2 ${
                selectedStaircase?.id === s.id && "border-[#1e2e5a]"
              }`}
              onClick={() => selectStaircase(s)}
            >
              {stName}
            </MotionButton>
          );
        })}
      </div>
      <div className="flex gap-2 mt-10 mx-10">
        <MotionButton
          disabled={!makeButtonActive}
          className={`border-[1px] text-white border-gray-400 w-full ${
            makeButtonActive ? "bg-[#1e2e5a]" : "bg-gray-300 !text-black"
          }`}
          onClick={handleNextStep}
        >
          Continue
        </MotionButton>
      </div>
    </>
  );
};

export default StaircaseSelectModalContent;
