import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import ProjectMotionBtn from "./ProjectMotionBtn";
import Text from "./Text";

const CLCommonSummaryButton = ({
  activeObjKey,
  storeKeyValue,
  index,
  setActiveTransitionSummary,
  activeTransitionSummary,
  type,
  className,
  buttonName,
  within_id,
  from_id,
  to_id,
  checkInFloor,
  levelling,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  var bgColor =
    storeKeyValue?.id === activeTransitionSummary?.[activeObjKey]?.id
      ? "#1A65D6"
      : "";

  const handleRoomRepairsClick = () => {
    let withinRoomName = "";
    let fromRoomName = "";
    let toRoomName = "";

    if (checkInFloor) {
      singleCustomerData?.scope?.floors?.map((floor) => {
        if (floor?.id === storeKeyValue?.[from_id]) {
          fromRoomName = floor?.name;
        } else if (floor?.id === storeKeyValue?.[to_id]) {
          toRoomName = floor?.name;
        }
      });
    } else if (levelling) {
      let currentIndex = 0;
      singleCustomerData?.scope?.floors?.map((floor) => {
        floor?.rooms?.map((room) => {
          if (storeKeyValue?.[within_id]?.includes(room?.id)) {
            let lastIndex =
              currentIndex === storeKeyValue?.[within_id]?.length - 1;
            withinRoomName += !lastIndex ? room?.name + ",  " : room?.name;
            currentIndex++;
          }
        });
      });
    } else {
      singleCustomerData?.scope?.floors?.map((floor) => {
        floor?.rooms?.map((room) => {
          if (!!storeKeyValue?.within_room_id) {
            if (room?.id === storeKeyValue?.[within_id]) {
              withinRoomName = room?.name;
            }
          } else {
            if (room?.id === storeKeyValue?.[from_id]) {
              fromRoomName = room?.name;
            } else if (room?.id === storeKeyValue?.[to_id]) {
              toRoomName = room?.name;
            }
          }
        });
      });
    }

    let stairCaseName = storeKeyValue?.all_questions?.find(
      (que) => que?.question === "Name of Staircase"
    );

    setActiveTransitionSummary({
      buttonName: `${buttonName} ${index}`,
      [activeObjKey]: storeKeyValue,
      withinRoomName,
      fromRoomName,
      toRoomName,
      stairCaseName: stairCaseName?.answer,
    });
  };

  // const grid = React.useMemo(() => {
  //   let conditionalGrid = 12;
  //   if (
  //     singleCustomerData?.transitions?.length >= 4 &&
  //     singleCustomerData?.transitions?.length <= 8
  //   ) {
  //     conditionalGrid = 6;
  //   } else if (
  //     singleCustomerData?.transitions?.length > 8 &&
  //     singleCustomerData?.transitions?.length <= 12
  //   ) {
  //     conditionalGrid = 4;
  //   } else if (
  //     singleCustomerData?.transitions?.length > 12 &&
  //     singleCustomerData?.transitions?.length <= 16
  //   ) {
  //     conditionalGrid = 3;
  //   }

  //   return conditionalGrid;
  // }, [singleCustomerData?.transitions]);

  return (
    <Grid item xs={3}>
      <div className="flex justify-center">
        <ProjectMotionBtn
          className={` decoration-black ${className}`}
          style={
            bgColor
              ? { backgroundColor: `${bgColor}` }
              : { backgroundColor: "white" }
          }
          type={type}
          onClick={handleRoomRepairsClick}
        >
          <Text
            className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}
          >
            {buttonName} {index}
          </Text>
        </ProjectMotionBtn>
      </div>
    </Grid>
  );
};

export default CLCommonSummaryButton;

CLCommonSummaryButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  activeObjKey: PropTypes.string,
  storeKeyValue: PropTypes.object,
  index: PropTypes.number,
  setActiveTransitionSummary: PropTypes.func,
  activeTransitionSummary: PropTypes.object,
  activeTransitionSummary: PropTypes.object,
  within_id: PropTypes.string,
  from_id: PropTypes.string,
  to_id: PropTypes.string,
  type: PropTypes.string,
  checkInFloor: PropTypes.bool,
  levelling: PropTypes.bool,
};
