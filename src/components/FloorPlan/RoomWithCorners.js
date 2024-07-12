import React from "react";

const RoomWithCorners = (props) => {
  const { definedCorners, clickedOutside } = props;

  return (
    <>
      {definedCorners?.map((vertex, vertexIndex) => {
        const nextVertex =
          definedCorners[(vertexIndex + 1) % definedCorners.length];
        const dx = nextVertex.x - vertex.x;
        const dy = nextVertex.y - vertex.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitDx = dx / length;
        const unitDy = dy / length;
        const halfThickness = 4; // Half the wall thickness, adjust if needed

        const reducedStartX = vertex.x + unitDx * halfThickness;
        const reducedStartY = vertex.y + unitDy * halfThickness;
        const reducedEndX = nextVertex.x - unitDx * halfThickness;
        const reducedEndY = nextVertex.y - unitDy * halfThickness;

        return (
          <g key={vertexIndex}>
            <circle
              cx={vertex.x}
              cy={vertex.y}
              r={6} // Reduce the size of the circle by subtracting 2 from selectionRadius
              stroke="#000000"
              fill={clickedOutside ? "red" : "white"}
              strokeWidth="1"
            />
            {vertexIndex !== definedCorners.length - 1 && (
              <path
                d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}
                stroke="black"
                strokeWidth={8}
                strokeDasharray=""
              />
            )}
          </g>
        );
      })}
    </>
  );
};

export default RoomWithCorners;
