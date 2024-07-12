import React, { useState } from "react";
import PropTypes from "prop-types";
// import Image from "./Image";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import GetFurnitureIcon from "../../../../assets/GetFurnitureIcon";

const CLFurnitureButton = ({
  furniture,
  className,
  setIsDragEnabled,
  isDragEnabled,
  setFurniture,
  furnitureLocal,
  defaultSize,
}) => {
  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "FURNITURE_TYPE",
    item: { furniture, type: "FURNITURE_TYPE" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  const handleChangeSize = (size) => {
    let newFurnitureArray = [...furnitureLocal];
    const furnitureIndex = newFurnitureArray.findIndex(
      (e) => e.name === furniture.name
    );
    if (furniture?.size === size) {
      if (furnitureIndex !== -1) {
        newFurnitureArray[furnitureIndex].size = defaultSize;
        setFurniture(newFurnitureArray);
      } else {
      }
    } else {
      if (furnitureIndex !== -1) {
        newFurnitureArray[furnitureIndex].size = size;
        setFurniture(newFurnitureArray);
      } else {
      }
    }
  };

  return (
    <div ref={preview} className="flex justify-center relative">
      <motion.button
        ref={drag}
        className={`flex items-center border-2 border-[#D8D8D8]  rounded-full py-0 pr-[8px] pl-[10px] h-[42px] min-w-[150px]  gap-[8px] cursor-move ${className}`}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
        animate={{
          opacity: isDragging ? 0.7 : 1,
        }}
      >
        <GetFurnitureIcon
          iconName={furniture.name}
          data={{ color: "", secondColor: "" }}
        />
        <Text className="text-ellipsis overflow-hidden absolute ml-[27px] text-[13px]">
          {furniture.name}
        </Text>
      </motion.button>
      <div className="absolute -top-2 right-4 flex gap-1 w-[50px]  justify-end">
        {furniture?.otherSize.length > 0 &&
          furniture?.otherSize?.map((size) => {
            return (
              <motion.div
                className={`${
                  furniture.size === size
                    ? " !bg-[#009DC2]   text-black font-semibold rounded-full padding-2 w-[19px] h-[17px] text-[11px]"
                    : "bg-[#009DC2] rounded-full  w-[18px] h-[17px] text-[10px] text-white"
                } flex justify-center items-center `}
                transition={{ duration: 1 }}
                onClick={() => handleChangeSize(size)}
                style={
                  furniture.size === size
                    ? {
                        boxShadow:
                          "rgba(0, 0, 0, 0.4) 3px 4px 6px, rgba(0, 0, 0, 0.3) 3px 12px 16px -3px, rgba(0, 0, 0, 0.4) 0px -5px 5px inset",
                      }
                    : {}
                }
              >
                {size}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default CLFurnitureButton;

CLFurnitureButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
};
