import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SingleRoomSvg from "./SingleRoomSvg";
import MuiSnackbar from "../UI/MuiSnackbar";

const FloorPlanSvgDisplay = () => {
  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);

  const rooms = drawingRooms[selectedFloor?.name];
  const svgRef = useRef(null);
  const groupRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredRoomIndex, setHoveredRoomIndex] = useState(null);

  // opening an alert after prodcut add
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");

  useEffect(() => {
    function preventBehavior(e) {
      e.preventDefault();
    }

    const currentElement = svgRef.current;

    if (currentElement) {
      currentElement.addEventListener("touchmove", preventBehavior, {
        passive: false,
      });
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener("touchmove", preventBehavior);
      }
    };
  }, []);

  const calculateRoomsBoundingBox = () => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    rooms.forEach((room) => {
      room.vertices.forEach((v) => {
        if (v.x < minX) minX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.x > maxX) maxX = v.x;
        if (v.y > maxY) maxY = v.y;
      });
    });

    return { minX, minY, maxX, maxY };
  };

  const resetScale = () => {
    const { minX, minY, maxX, maxY } = calculateRoomsBoundingBox();

    // calculate centroid of the rooms bounding box
    const bboxCenter = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };

    const newTranslate = {
      x: svgRef.current?.clientWidth / 2 - bboxCenter.x,
      y: svgRef.current?.clientHeight / 2 - bboxCenter.y,
    };

    setScale(1);
    setTranslate(newTranslate);
  };

  useEffect(() => {
    if (selectedFloor) {
      resetScale();
    }
  }, [selectedFloor]);

  const calculateCentroid = (vertices) => {
    let x = 0,
      y = 0;
    vertices.forEach((v) => {
      x += v.x;
      y += v.y;
    });
    return { x: x / vertices.length, y: y / vertices.length };
  };

  const calculateArea = (vertices) => {
    let area = 0;
    const n = vertices.length;
    for (let i = 0; i < n; i++) {
      const { x: x1, y: y1 } = vertices[i];
      const { x: x2, y: y2 } = vertices[(i + 1) % n];
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area / 2) / 400;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZooming(true);
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.max(0.1, scale + scaleAmount);

    const rect = e.target.getBoundingClientRect();
    const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    const newTranslate = {
      x: translate.x - (mousePos.x - translate.x) * (newScale / scale - 1),
      y: translate.y - (mousePos.y - translate.y) * (newScale / scale - 1),
    };

    setScale(newScale);
    setTranslate(newTranslate);
  };

  const handleMouseDown = (e) => {
    setPanning(true);
    setPanStart({
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (!panning) return;
    e.preventDefault();

    const isTouch = e.touches ? true : false;

    const event = isTouch ? e.touches?.[0] : e;
    const dx = event.clientX - panStart.x;
    const dy = event.clientY - panStart.y;

    const rect = svgRef.current.getBoundingClientRect();

    const newTranslate = {
      x: translate.x + dx,
      y: translate.y + dy,
    };

    setTranslate(newTranslate);
    setPanStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setPanning(false);
  };

  // useEffect(() => {
  //   if (groupRef.current) {
  //     groupRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  //     groupRef.current.style.transition = "transform 0.1s ease-out";
  //   }
  // }, [translate, scale]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      if (!panning && !zooming) {
        groupRef.current.style.transition = "transform 400ms ease-in-out";
      } else {
        setZooming(false);
        groupRef.current.style.transition = "none";
      }
    }
  }, [translate, scale, panning, zooming]);

  const [initialDistance, setInitialDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);

  const calculateDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
      setInitialScale(scale);
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches[0], e.touches[1]);
      if (initialDistance) {
        const scaleFactor = distance / initialDistance;
        const newScale = initialScale * scaleFactor;

        // Calculate the midpoint between the two touch points
        const midpoint = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };

        // Adjust translate values to zoom around the midpoint
        const rect = svgRef.current.getBoundingClientRect();
        const svgMidpoint = {
          x: (midpoint.x - rect.left - translate.x) / scale,
          y: (midpoint.y - rect.top - translate.y) / scale,
        };

        const newTranslate = {
          x: translate.x - svgMidpoint.x * (newScale - scale),
          y: translate.y - svgMidpoint.y * (newScale - scale),
        };

        setScale(newScale);
        setTranslate(newTranslate);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setInitialDistance(null);
    }
  };

  const calculateOffsetVertices = (vertices, offset) => {
    const offsetVertices = [];

    for (let i = 0; i < vertices.length; i++) {
      const prevVertex = vertices[(i - 1 + vertices.length) % vertices.length];
      const currentVertex = vertices[i];
      const nextVertex = vertices[(i + 1) % vertices.length];

      const vectorPrev = {
        x: currentVertex.x - prevVertex.x,
        y: currentVertex.y - prevVertex.y,
      };
      const vectorNext = {
        x: nextVertex.x - currentVertex.x,
        y: nextVertex.y - currentVertex.y,
      };

      const lengthPrev = Math.sqrt(vectorPrev.x ** 2 + vectorPrev.y ** 2);
      const lengthNext = Math.sqrt(vectorNext.x ** 2 + vectorNext.y ** 2);

      const unitVectorPrev = {
        x: vectorPrev.x / lengthPrev,
        y: vectorPrev.y / lengthPrev,
      };
      const unitVectorNext = {
        x: vectorNext.x / lengthNext,
        y: vectorNext.y / lengthNext,
      };

      const offsetVector = {
        x: unitVectorPrev.y + unitVectorNext.y,
        y: -(unitVectorPrev.x + unitVectorNext.x),
      };

      const lengthOffset = Math.sqrt(offsetVector.x ** 2 + offsetVector.y ** 2);

      const normalizedOffsetVector = {
        x: (offsetVector.x / lengthOffset) * offset,
        y: (offsetVector.y / lengthOffset) * offset,
      };

      offsetVertices.push({
        x: currentVertex.x + normalizedOffsetVector.x,
        y: currentVertex.y + normalizedOffsetVector.y,
      });
    }

    return offsetVertices;
  };
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={(e) => {
        handleMouseDown(e);
        handleTouchStart(e);
      }}
      onTouchMove={(e) => {
        handleMouseMove(e);
        handleTouchMove(e);
      }}
      onTouchEnd={(e) => {
        handleMouseUp(e);
        handleTouchEnd(e);
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ overflow: "hidden" }}
      >
        <defs>
          {rooms.map((room, roomIndex) => {
            // Create a composite mask that excludes the current room
            const otherRooms = rooms.filter((_, index) => index !== roomIndex);

            return (
              <mask id={`maskRoom-${roomIndex}`} key={roomIndex}>
                <rect width="100%" height="100%" fill="white" />
                {otherRooms.map((otherRoom, otherRoomIndex) => (
                  <polygon
                    key={otherRoomIndex}
                    points={otherRoom.vertices
                      .map((v) => `${v.x},${v.y}`)
                      .join(" ")}
                    fill="black"
                  />
                ))}
              </mask>
            );
          })}
        </defs>
        <g ref={groupRef}>
          {rooms?.map((room, roomIndex) => {
            const centroid = calculateCentroid(room.vertices);
            const offsetVertices = calculateOffsetVertices(room.vertices, 8);
            return (
              <SingleRoomSvg
                roomIndex={roomIndex}
                setHoveredRoomIndex={setHoveredRoomIndex}
                room={room}
                hoveredRoomIndex={hoveredRoomIndex}
                calculateCentroid={calculateCentroid}
                calculateArea={calculateArea}
                setOpen={setOpen}
                setMessage={setMessage}
                setType={setType}
                offsetVertices={offsetVertices}
              />
            );
          })}
          {rooms?.map((room, roomIndex) => {
            const centroid = calculateCentroid(room.vertices);

            return (
              <g
                key={roomIndex}
                id={`group-${roomIndex}`}

              > {room?.doors &&
                room.doors.map((door, doorIndex) => {

                  // Calculate direction vector
                  const direction = {
                    x: door.end.x - door.start.x,
                    y: door.end.y - door.start.y,
                  };

                  // Calculate the length of the direction vector
                  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);

                  // Normalize the direction vector
                  const unitDirection = {
                    x: direction.x / length,
                    y: direction.y / length,
                  };

                  // Calculate the perpendicular vector (for offsetting)
                  const perpendicular = {
                    x: -unitDirection.y,
                    y: unitDirection.x,
                  };

                  // Offset amount
                  const offsetAmount = -6; // Adjust as needed

                  // Calculate the offset start and end points
                  const offsetStart = {
                    x: door.start.x + perpendicular.x * offsetAmount,
                    y: door.start.y + perpendicular.y * offsetAmount,
                  };

                  const offsetEnd = {
                    x: door.end.x + perpendicular.x * offsetAmount,
                    y: door.end.y + perpendicular.y * offsetAmount,
                  };



                  return (
                    <g
                      key={doorIndex}

                    >

                      <line
                        x1={door.start.x}
                        y1={door.start.y}
                        x2={door.end.x}
                        y2={door.end.y}
                        stroke={"#F5F5F5"}
                        strokeWidth={"8.5"}
                      />
                      <line
                        x1={offsetStart.x}
                        y1={offsetStart.y}
                        x2={offsetEnd.x}
                        y2={offsetEnd.y}
                        stroke={"#F5F5F5"}
                        strokeWidth={"7.6"}
                        clipPath={`url(#clipRoom${roomIndex})`}
                      />
                    </g>
                  );
                })}

              </g>);
          })}
        </g>
      </svg>
      <MuiSnackbar
        open={open}
        message={message || ""}
        type={type || ""}
        onClose={() => setOpen(false)}
        duration={2000}
      />
    </div>
  );
};

export default FloorPlanSvgDisplay;
