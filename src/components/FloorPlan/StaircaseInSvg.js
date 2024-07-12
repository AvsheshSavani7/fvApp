import React, { forwardRef, useMemo, useState } from "react";
import {
  changeRotationIconColor,
  getAngleInDergreeCondition,
} from "../../helper/svgHelper";
import { snapToNearest45 } from "../../utils/svgFunctions";
import RotationIcon from "./RotationIcon";

const calculateCentroid = (x, y, width, height) => {
  return {
    x: x + width / 2,
    y: y + height / 2,
  };
};

const StaircaseInSvg = forwardRef(
  (
    {
      x,
      y,
      index,
      width,
      height,
      rotationAngle = 0,
      steps,
      roomId,
      isSelected,
      onSelect,
      onTouchStart,
      onMouseMove,
      setStaircases,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      floorName,
      translate,
      scale,
    },
    ref
  ) => {
    const [isStaircaseRotating, setIsStaircaseRotating] = useState(false);
    const [isStaircaseMoving, setIsStaircaseMoving] = useState(false);
    const [rotationIconColor, setRotationIconColor] = useState("#3a80c7");

    const getMousePosition = (event) => {
      const CTM = ref.current?.getScreenCTM();
      const clientX = event.clientX || event.touches[0].clientX;
      const clientY = event.clientY || event.touches[0].clientY;
      return {
        x: (clientX - CTM.e - translate.x) / (CTM.a * scale),
        y: (clientY - CTM.f - translate.y) / (CTM.d * scale),
      };
    };

    const generateSteps = (stepsCount, width, height) => {
      const stepHeight = height / (stepsCount + 1);
      const lines = [];
      for (let i = 1; i <= stepsCount; i++) {
        lines.push(
          <line
            key={i}
            x1="0"
            y1={i * stepHeight}
            x2={width}
            y2={i * stepHeight}
            stroke="black"
            strokeWidth="1"
          />
        );
      }
      return lines;
    };

    const lines = useMemo(
      () => generateSteps(steps, width, height),
      [steps, width, height]
    );

    const arrowWidth = 40;
    const arrowHeight = 40;
    const arrowX = width / 2;
    const arrowY = height - arrowHeight - 20;

    const handleMouseMove = (e) => {
      if (isStaircaseRotating) {
        setIsStaircaseMoving(false);
        const pos = getMousePosition(e);
        const center = calculateCentroid(x, y, width, height);
        let currentAngle = Math.atan2(pos.y - center.y, pos.x - center.x);
        if (currentAngle < 0) {
          currentAngle += 2 * Math.PI;
        }

        const angleInDegrees = Math.abs(currentAngle * (180 / Math.PI));
        changeRotationIconColor(angleInDegrees, setRotationIconColor);

        setStaircases((prev) => ({
          ...prev,
          [floorName]: prev[floorName]?.map((st, idx) =>
            idx === index ? { ...st, rotationAngle: currentAngle } : st
          ),
        }));
      } else {
        setIsStaircaseMoving(true);
      }
    };

    const handleMouseUp = (e) => {
      e.stopPropagation();
      setIsStaircaseRotating(false);
      setIsStaircaseMoving(false);

      const angleInDegrees = Math.abs(rotationAngle * (180 / Math.PI));
      const angleInDegreesCondition =
        getAngleInDergreeCondition(angleInDegrees);

      if (angleInDegreesCondition) {
        const snappedAngle = snapToNearest45(angleInDegrees) * (Math.PI / 180);

        setStaircases((prev) => ({
          ...prev,
          [floorName]: prev[floorName]?.map((st, idx) =>
            idx === index ? { ...st, rotationAngle: snappedAngle } : st
          ),
        }));
        setRotationIconColor("#3a80c7");
      } else {
        setStaircases((prev) => ({
          ...prev,
          [floorName]: prev[floorName]?.map((st, idx) =>
            idx === index ? { ...st, rotationAngle } : st
          ),
        }));
      }
    };

    // Calculate the centroid and icon position
    const { iconX, iconY } = useMemo(() => {
      const centroid = calculateCentroid(x, y, width, height);
      const iconDistance = 70;

      const offsetX = iconDistance * Math.cos(rotationAngle);
      const offsetY = iconDistance * Math.sin(rotationAngle);

      return {
        iconX: centroid.x + offsetX,
        iconY: centroid.y + offsetY,
      };
    }, [x, y, width, height, rotationAngle]);

    return (
      <>
        <g
          transform={`translate(${x}, ${y}) rotate(${
            (rotationAngle || 0) * (180 / Math.PI)
          } ${width / 2} ${height / 2})`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ roomId, x, y, width, height, index, steps });
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onMouseMove={onMouseMove}
          onTouchMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchEnd={onTouchEnd}
        >
          {isSelected && (
            <rect
              x="-5"
              y="-5"
              width={width + 10}
              height={height + 10}
              stroke="#2dabefe3"
              strokeWidth={3}
              fill="none"
            />
          )}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="white"
            stroke="black"
            strokeWidth="1"
          />
          {lines}
          <polygon
            points={`
              ${arrowX},${arrowY} 
              ${arrowX + arrowWidth / 2},${arrowY + arrowHeight / 2} 
              ${arrowX + arrowWidth / 4},${arrowY + arrowHeight / 2} 
              ${arrowX + arrowWidth / 4},${arrowY + arrowHeight} 
              ${arrowX - arrowWidth / 4},${arrowY + arrowHeight} 
              ${arrowX - arrowWidth / 4},${arrowY + arrowHeight / 2} 
              ${arrowX - arrowWidth / 2},${arrowY + arrowHeight / 2}
            `}
            fill="gray"
            stroke="black"
            strokeWidth="1"
          />
        </g>
        {isSelected && !isStaircaseMoving && (
          <RotationIcon
            x={iconX - 30} // Adjust to center the icon
            y={iconY - 30} // Adjust to center the icon
            fill={rotationIconColor}
            rotationIconColor={rotationIconColor}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseUp}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsStaircaseRotating(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setIsStaircaseRotating(true);
            }}
            iconTransform={`rotate(${
              (rotationAngle || 0) * (180 / Math.PI)
            } 128 128)`}
          />
        )}
      </>
    );
  }
);

export default StaircaseInSvg;
