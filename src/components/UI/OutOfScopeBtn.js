import React from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const OutOfScopeBtn = ({
  itemKey,
  itemKeyValue,
  setIsDragEnabled,
  type,
  storeKey,
}) => {
  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "OutOfScope",
    item: { [itemKey]: itemKeyValue, type: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const matchingActiveBtn = useSelector(
    (state) => state.customerReducer.matchingActiveBtn
  );

  return (
    <>
      {/* <motion.button
      ref={drag}
      className={`round-small-btn 
                      !text-black !text-[14px] !font-medium !w-[78px] !h-[78px] 
                          !bg-[#D8D8D8]  `}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsDragEnabled(false)}
      onMouseLeave={() => setIsDragEnabled(true)}
      onTouchStart={() => setIsDragEnabled(false)}
      onTouchEnd={() => setIsDragEnabled(true)}
      animate={{
        opacity: isDragging ? 0.7 : 1,
      }}
    >
          Out of <br/> Scope
    </motion.button> */}
      <motion.button
        ref={drag}
        className={`round-small-btn 
                      !text-black !text-[9px]  !w-[78px] !h-[78px] 
                          !bg-[#D8D8D8] !rounded-full`}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
        animate={{
          opacity: isDragging ? 0.7 : 1,
        }}
      >
        Out of Scope <br />
        For
        <br />
        {activeBtnKey === "floorDetails" &&
          checkListActiveBtn === "existingMaterials" &&
          " Refinishing"}
        {activeBtnKey === "floorDetails" &&
          checkListActiveBtn === "subFloor" &&
          " Installation"}
        {activeBtnKey === "floorDetails" &&
          checkListActiveBtn === "molding" &&
          " Molding"}
        {activeBtnKey === "checklist" &&
          checkListActiveBtn === "refinishing" &&
          " Refinishing"}
        {activeBtnKey === "matching" &&
          matchingActiveBtn === "refinishing" &&
          " Refinishing"}
        {activeBtnKey === "matching" &&
          matchingActiveBtn === "installation" &&
          " Installation"}
      </motion.button>
    </>
  );
};

export default OutOfScopeBtn;
