import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setMode } from "../../redux/floorPlan";
import FloorWithRooms from "./FloorWithRooms";
import { Catalogue } from "../product-catalogue/catalogue";
import ProductEstimation from "./ProductEstimation";

const MODES = [
  { key: "drawing", title: "Drawing" },
  { key: "products", title: "Products" },
  { key: "estimation", title: "Estimation" },
];

const Floors = (props) => {
  const { closeMainModal, saveFloorPlanData, isSaving } = props;

  const selectedMode = useSelector((state) => state.floorPlan.selectedMode);

  const dispatch = useDispatch();

  const changeMode = useCallback(
    (mode) => {
      dispatch(setMode(mode));
    },
    [setMode]
  );

  return (
    <div className="m-1 relative h-full">
      <div className="mt-2 mb-1 max-w-max">
        <div className="flex justify-center items-center gap-[2px]">
          {MODES.map((mode) => {
            return (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`text-[13px] border-[1px] rounded-md px-2 py-1 my-[2px] flex justify-center items-center ${
                  selectedMode === mode.key && "bg-[#007FFF] text-white"
                }`}
                onClick={() => changeMode(mode.key)}
              >
                {mode.title}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-400" />
      {selectedMode === "drawing" && (
        <FloorWithRooms
          isSaving={isSaving}
          saveFloorPlanData={saveFloorPlanData}
          closeMainModal={closeMainModal}
        />
      )}
      {selectedMode === "products" && <Catalogue />}
      {selectedMode === "estimation" && <ProductEstimation />}
    </div>
  );
};

export default Floors;
