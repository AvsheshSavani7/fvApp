import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FloorChip from "./FloorChip";
import SvgCanvas from "./SvgCanvas";
import FloorPlanSvgDisplay from "./FloorPlanSvgDisplay";
import EstimationTable from "./EstimationTable";
import { setFloor } from "../../redux/floorPlan";

const FloorPlanDrawer = () => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const dispatch = useDispatch();

  const selectedMode = useSelector((state) => state.floorPlan.selectedMode);

  const floors = useMemo(() => {
    return singleCustomerData.scope.floors;
  }, [singleCustomerData]);
  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);

  useEffect(() => {
    if (selectedFloor === null && floors?.length > 0) {
      dispatch(setFloor(floors[0]));
    }
  }, []);

  return (
    <div className="h-full">
      <div className={`w-full flex justify-center items-center`}>
        {floors?.map((floor, idx) => (
          <FloorChip
            floors={floors}
            key={floor.id || idx}
            idx={idx}
            floor={floor}
          />
        ))}
      </div>
      <div
        className={`mr-1 flex-1 border-[1px] border-gray-400 border-dashed mt-1 relative flex flex-col items-center ${
          selectedMode === "estimation" ? "justify-start" : "justify-center"
        } `}
        style={{ height: "calc(100% - 46px)", width: "100%" }}
      >
        {selectedMode === "drawing" && <SvgCanvas />}
        {selectedMode === "products" && <FloorPlanSvgDisplay />}
        {selectedMode === "estimation" && (
          <div
            className="mt-10 h-full"
            // style={{ height: "calc(100vh - 100px)" }}
          >
            <EstimationTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlanDrawer;
