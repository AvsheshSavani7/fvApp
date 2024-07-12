import React from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const FromToBtn = ({
  itemKey,
  itemKeyValue,
  setIsDragEnabled,
  type,
  storeKey,
}) => {
  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "STAIRCASE",
    item: { [itemKey]: itemKeyValue, type: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
 
  return (
    <motion.button
      ref={drag}
      className={`round-small-btn 
                      !text-white !text-[16px] !font-medium !w-[78px] !h-[78px] ${
                        type === "From"
                          ? "!bg-[#8EC24A]"
                          : type === "Within"
                          ? "!bg-[#1A65D6]"
                          : "!bg-[#F8842F]"
                      } mb-[15px] ${
        singleCustomerData?.[storeKey]?.length > 0 ? "visible" : "invisible"
      }`}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsDragEnabled(false)}
      onMouseLeave={() => setIsDragEnabled(true)}
      onTouchStart={() => setIsDragEnabled(false)}
      onTouchEnd={() => setIsDragEnabled(true)}
      animate={{
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      {type}
    </motion.button>
  );
};

export default FromToBtn;
