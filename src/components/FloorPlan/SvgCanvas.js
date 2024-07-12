import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import MergeIcon from "@mui/icons-material/Merge";
import LockIcon from "@mui/icons-material/Lock";
import CancelIcon from "@mui/icons-material/Cancel";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  selectMethod,
  setRoomToDraw,
  setUpdateFloors,
} from "../../redux/floorPlan";
import FloorPlanButton from "../UI/FloorPlanButton";
import WallLengthField from "../UI/WallLengthField";
import RoomWithCorners from "./RoomWithCorners";
import CancelConfirmationModal from "./CancelConfirmationModal";
import { Constants } from "../../utils/Constants";
import StaircaseInSvg from "./StaircaseInSvg";
import {
  calculateCenters,
  calculateDistance,
  calculateOffsetVertices,
  distanceToLineSegment,
  snapRoomToHighlightedWall,
  snapToNearest45,
} from "../../utils/svgFunctions";
import {
  getIncreamentedAngle,
  isStaircaseInRoom,
} from "../../helper/svgHelper";
import RotationIcon from "./RotationIcon";

export const SvgCanvas = () => {
  const dispatch = useDispatch();
  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const selectedMethod = useSelector((state) => state.floorPlan.selectedMethod);
  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);
  const selectedRoomToDraw = useSelector(
    (state) => state.floorPlan.selectedRoomToDraw
  );

  const rooms = drawingRooms?.[selectedFloor?.name];

  const setRooms = (rooms) => {
    dispatch(
      setUpdateFloors({
        rooms: rooms,
        floorName: selectedFloor?.name,
      })
    );
    // handleStateChange(rooms)
  };

  const svgRef = useRef(null);
  const groupRef = useRef(null);
  const staircaseRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [selectedWall, setSelectedWall] = useState(null);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [hoveredVertex, setHoveredVertex] = useState(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [zooming, setZooming] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const [isRotating, setIsRotating] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [manualWallLength, setManualWallLength] = useState(null);
  const [confirmLengthChange, setConfirmLengthChange] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [gridLines, setGridLines] = useState([]);
  const [highlightedWalls, setHighlightedWalls] = useState([]);
  const selectionRadius = 6;
  const redDotRadius = 3;
  const dimensionOffset = 26;
  const doorDimensionOffset = 13;
  const closeRadius = 20;
  const doorWidth = 16;
  const innerOffset = 4;

  const defaultRotationalColor = "#3a80c7";
  const [originalVertices, setOriginalVertices] = useState(null);

  const [draggingMoveIcon, setDraggingMoveIcon] = useState(false);
  const [elasticLine, setElasticLine] = useState(null);
  const [mergeCandidates, setMergeCandidates] = useState([]);
  const [nearestVertices, setNearestVertices] = useState([]);
  const [draggingIconPosition, setDraggingIconPosition] = useState(null);
  const [draggingIconColor, setDraggingIconColor] = useState("#3a80c7");
  const [oldRooms, setOldRooms] = useState([]);

  const [initialDistance, setInitialDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [rotationIconColor, setRotationIconColor] = useState(
    defaultRotationalColor
  );

  const [resizingDoor, setResizingDoor] = useState(false);
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [initialTouchDoorLength, setInitialTouchDoorLength] = useState(null);

  const [manualChangeRooms, setManualChangeRooms] = useState({
    rooms: [],
    roomIndex: null,
    wallIndex: null,
    lengthDiff: null,
    innerOffset,
  });

  /**
   * States for the drawing room with defined corners
   */
  const [cancelDrawingRoomModal, setCancelDrawingRoomModal] = useState(false);
  const [definedCorners, setDefinedCorners] = useState([]);
  const [clickedOutside, setClickedOutside] = useState([]);

  const [selectedDoor, setSelectedDoor] = useState(null);
  const [draggingDoor, setDraggingDoor] = useState(false);

  const [staircases, setStaircases] = useState([]);
  const [selectedStaircase, setSelectedStaircase] = useState(null);
  const [initialDimensions, setInitialDimensions] = useState({});
  const [isStaircaseDragging, setIsStaircaseDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedWallDoors, setSelectedWallDoors] = useState([]); // doors on selected wall

  const floorName = useMemo(() => {
    return selectedFloor?.name || "";
  }, [selectedFloor]);

  const calculateRoomsBoundingBox = () => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    rooms?.forEach((room) => {
      room?.vertices?.forEach((v) => {
        if (v.x < minX) minX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.x > maxX) maxX = v.x;
        if (v.y > maxY) maxY = v.y;
      });
    });

    return { minX, minY, maxX, maxY };
  };

  const resetScale = () => {
    const { minX, minY, maxX, maxY } = calculateRoomsBoundingBox(rooms);

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

  const setRoomIndex = useCallback(() => {
    if (
      selectedRoomToDraw &&
      selectedFloor &&
      (selectedMethod === "square" || selectedMethod === null)
    ) {
      const selectedRoomIndex = rooms?.findIndex(
        (room) => room.id === selectedRoomToDraw?.id
      );

      handlePolygonClick(rooms, selectedRoomIndex);
    }
  }, [rooms, selectedFloor, selectedRoomToDraw, selectedMethod]);

  useEffect(() => {
    if (selectedFloor) {
      setRoomIndex();
    }
  }, [selectedRoomToDraw]);

  useEffect(() => {
    if (selectedMethod === "corner") {
      setActiveRoomIndex(null);
      // resetScale();
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [selectedMethod]);

  useEffect(() => {
    if (selectedFloor) {
      setActiveRoomIndex(null);
      dispatch(setRoomToDraw(null));
      dispatch(selectMethod(null));
      setSelectedWall(null);
      resetScale();
    }
  }, [selectedFloor]);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const handleStateChange = (newRooms) => {
    setUndoStack([...undoStack, oldRooms]);

    setRooms(newRooms);
    setOldRooms(newRooms);
    setRedoStack([]); // Clear redo stack on new action
  };

  const undo = () => {
    console.log(undoStack);

    setUndoStack((prevUndoStack) => {
      if (prevUndoStack.length > 0) {
        return prevUndoStack.slice(0, prevUndoStack.length - 1);
      }
      return prevUndoStack;
    });
    const previousState = undoStack[undoStack.length - 1];

    setRooms(previousState);
    setRedoStack((prevRedoStack) => [...prevRedoStack, rooms]);
  };

  const redo = () => {
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length > 0) {
        return prevRedoStack.slice(0, prevRedoStack.length - 1);
      }
      return prevRedoStack;
    });
    const nextState = redoStack[redoStack.length - 1];
    setRooms(nextState);
    setUndoStack((prevUndoStack) => [...prevUndoStack, rooms]);
  };

  const handleTouchStart = (e) => {
    // if (selectedStaircase === null) return;
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches[0], e.touches[1]);

      if (selectedStaircase) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        setInitialDistance(distance);
        setInitialDimensions({
          width: selectedStaircase?.width,
          height: selectedStaircase?.height,
        });
        return;
      }

      if (selectedDoor) {
        const { roomIndex, doorIndex } = selectedDoor;
        const door = rooms[roomIndex].doors[doorIndex];
        const doorLength = Math.sqrt(
          (door.end.x - door.start.x) ** 2 + (door.end.y - door.start.y) ** 2
        );
        setInitialTouchDistance(distance);
        setInitialTouchDoorLength(doorLength);
        setResizingDoor(true);
      } else {
        setInitialDistance(distance);
        setInitialScale(scale);
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      if (selectedStaircase && initialDistance !== null) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const deltaX = Math.abs(touch2.clientX - touch1.clientX);
        const deltaY = Math.abs(touch2.clientY - touch1.clientY);

        if (!resizeDirection) {
          setResizeDirection(deltaX > deltaY ? "horizontal" : "vertical");
        }

        const distance = Math.hypot(deltaX, deltaY);
        const scale = distance / initialDistance;

        const newDimensions = { ...initialDimensions };
        let newSteps = selectedStaircase.steps;

        if (resizeDirection === "horizontal") {
          newDimensions.width = initialDimensions.width * scale;
        } else if (resizeDirection === "vertical") {
          newDimensions.height = initialDimensions.height * scale;
          newSteps = Math.floor(newDimensions.height / 20); // Ensure minimum step height is 20
        }

        setStaircases((prev) => ({
          ...prev,
          [floorName]: prev[floorName]?.map((staircase, i) =>
            i === selectedStaircase.index
              ? { ...staircase, ...newDimensions, steps: newSteps }
              : staircase
          ),
        }));
        setSelectedStaircase((prev) => ({
          ...prev,
          ...newDimensions,
          steps: newSteps,
        }));

        return;
      }

      const distance = calculateDistance(e.touches[0], e.touches[1]);
      const scaleFactor = distance / initialDistance;

      if (resizingDoor && initialTouchDistance && selectedDoor) {
        const newDoorLength =
          initialTouchDoorLength * (distance / initialTouchDistance);

        const { roomIndex, doorIndex } = selectedDoor;
        const room = rooms[roomIndex];
        const door = room.doors[doorIndex];

        const wallDirection = {
          x: door.end.x - door.start.x,
          y: door.end.y - door.start.y,
        };
        const wallLength = Math.sqrt(
          wallDirection.x ** 2 + wallDirection.y ** 2
        );

        console.log("initialTouchDoorLength:", initialTouchDoorLength);
        console.log("distance:", distance);
        console.log("initialTouchDistance:", initialTouchDistance);
        console.log("newDoorLength:", newDoorLength);
        console.log("wallLength:", wallLength);

        const wallUnitVector = {
          x: wallDirection.x / wallLength,
          y: wallDirection.y / wallLength,
        };

        const doorCenter = {
          x: (door.start.x + door.end.x) / 2,
          y: (door.start.y + door.end.y) / 2,
        };

        let newLength = Math.min(newDoorLength, wallLength); // Ensure new door length does not exceed wall length

        const halfLengthVector = {
          x: (newDoorLength / 2) * wallUnitVector.x,
          y: (newDoorLength / 2) * wallUnitVector.y,
        };

        let newDoorStart = {
          x: doorCenter.x - halfLengthVector.x,
          y: doorCenter.y - halfLengthVector.y,
        };
        let newDoorEnd = {
          x: doorCenter.x + halfLengthVector.x,
          y: doorCenter.y + halfLengthVector.y,
        };

        console.log("newDoorStart:", newDoorStart);
        console.log("newDoorEnd:", newDoorEnd);

        console.log("finalDoorStart:", newDoorStart);
        console.log("finalDoorEnd:", newDoorEnd);

        const updatedRooms = rooms.map((r, i) =>
          i === roomIndex
            ? {
              ...r,
              doors: r.doors.map((d, j) =>
                j === doorIndex
                  ? { ...d, start: newDoorStart, end: newDoorEnd }
                  : d
              ),
            }
            : r
        );

        setRooms(updatedRooms);
        return; // Return early to skip the zoom functionality
      }

      // Zoom functionality if not resizing the door
      if (!resizingDoor && initialDistance) {
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

  console.log("rooms", rooms);

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setInitialDistance(null);
      setInitialTouchDistance(null);
      setInitialTouchDoorLength(null);
      setResizingDoor(false);
      setIsStaircaseDragging(false);
    }
    setResizeDirection(null);
  };

  const prepareMergeRoom = () => {
    if (activeRoomIndex === null) return;

    const selectedRoom = rooms[activeRoomIndex];
    const candidates = [];

    const isPointNearLine = (x, y, x1, y1, x2, y2, tolerance) => {
      const A = x - x1;
      const B = y - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      const param = lenSq !== 0 ? dot / lenSq : -1;

      let xx, yy;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = x - xx;
      const dy = y - yy;
      return dx * dx + dy * dy <= tolerance * tolerance;
    };

    const checkVerticesNearWalls = (room1, room2, status) => {
      const intersectionPoints = [];

      for (let vertex of room1.vertices) {
        for (let i = 0; i < room2.vertices.length; i++) {
          const vertex1 = room2.vertices[i];
          const vertex2 = room2.vertices[(i + 1) % room2.vertices.length];
          if (
            isPointNearLine(
              vertex.x,
              vertex.y,
              vertex1.x,
              vertex1.y,
              vertex2.x,
              vertex2.y,
              10
            )
          ) {
            intersectionPoints.push({ x: vertex.x, y: vertex.y });
          }
        }
      }
      // Remove duplicate points
      const uniqueIntersectionPoints = intersectionPoints.filter(
        (point, index, self) =>
          index === self.findIndex((p) => p.x === point.x && p.y === point.y)
      );

      if (intersectionPoints.length == 0) return false;
      if (
        intersectionPoints.length == 2 &&
        uniqueIntersectionPoints?.length === 1
      )
        return false;

      return true;
    };

    rooms.forEach((room, roomIndex) => {
      if (roomIndex !== activeRoomIndex) {
        // Check if any vertex of the current room is near the walls of the active room
        let isCandidate = checkVerticesNearWalls(room, selectedRoom);

        // Check if any vertex of the active room is near the walls of the current room
        let isCandidatReverse = checkVerticesNearWalls(selectedRoom, room);

        if (isCandidate || isCandidatReverse) {
          candidates.push({
            roomIndex,
            centroid: calculateCentroid(room.vertices),
          });
        }
      }
    });

    setMergeCandidates(candidates);
  };

  const calculateArea = (vertices, doors, innerOffset = 8) => {
    const adjustedVertices = vertices?.map((vertex, index) => {
      const nextVertex = vertices[(index + 1) % vertices.length];
      const angle = Math.atan2(
        nextVertex.y - vertex.y,
        nextVertex.x - vertex.x
      );
      const innerOffsetX = innerOffset * Math.cos(angle);
      const innerOffsetY = innerOffset * Math.sin(angle);
      return {
        x: vertex.x + innerOffsetX,
        y: vertex.y + innerOffsetY,
      };
    });

    // Calculate the area of the polygon formed by the adjusted vertices
    let area = 0;
    const n = adjustedVertices?.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += adjustedVertices[i].x * adjustedVertices[j].y;
      area -= adjustedVertices[j].x * adjustedVertices[i].y;
    }
    area = Math.abs(area) / 2;

    // Add the area of the door segments
    doors?.forEach((door) => {
      const doorWidth = Math.sqrt(
        Math.pow(door.end.x - door.start.x, 2) +
        Math.pow(door.end.y - door.start.y, 2)
      );
      const doorHeight = 8; // Assuming the door height as 4 units
      const doorArea = doorWidth * doorHeight;
      area += doorArea;
    });

    // Convert area to square feet (assuming 1 grid unit = 1 foot)
    const gridSize = 20;
    const areaInSqFt = area / (gridSize * gridSize);

    return areaInSqFt;
  };

  const rotatePoint = (point, center, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
      x: cos * dx - sin * dy + center.x,
      y: sin * dx + cos * dy + center.y,
    };
  };

  // Function to calculate the centroid of a set of vertices
  const calculateCentroid = (vertices) => {
    let x = 0,
      y = 0;
    vertices?.forEach((v) => {
      x += v.x;
      y += v.y;
    });
    return { x: x / vertices?.length, y: y / vertices?.length };
  };

  const convertToFeetAndInches = (pixels) => {
    const gridSize = 20;
    const totalInches = Math.round((pixels / gridSize) * 12);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
  };

  const getMousePosition = (evt) => {
    const CTM = svgRef.current.getScreenCTM();
    const clientX = evt.clientX || evt.touches[0].clientX;
    const clientY = evt.clientY || evt.touches[0].clientY;
    return {
      x: (clientX - CTM.e - translate.x) / (CTM.a * scale),
      y: (clientY - CTM.f - translate.y) / (CTM.d * scale),
    };
  };

  const isPointNearLine = (x, y, x1, y1, x2, y2, tolerance) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return dx * dx + dy * dy <= tolerance * tolerance;
  };

  // Mouse Down
  const handleMouseDown = (e) => {

    setOldRooms(rooms);

    if (selectedStaircase) {
      const isTouchEvent = e.type === "touchstart";
      const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

      setDragOffset({
        x: clientX - selectedStaircase.x,
        y: clientY - selectedStaircase.y,
      });

      setIsStaircaseDragging(true);
      return;
    }

    const pos = getMousePosition(e);
    if (activeRoomIndex === null) {
      setPanning(true);
      setPanStart({
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      });
      setIsRotating(false);
      return;
    }

    let pointSelected = false;
    const room = rooms[activeRoomIndex];
    const center = calculateCentroid(room?.vertices);

    // Check if a door is clicked
    room?.doors?.forEach((door, doorIndex) => {
      if (
        isPointNearLine(
          pos.x,
          pos.y,
          door.start.x,
          door.start.y,
          door.end.x,
          door.end.y,
          selectionRadius
        )
      ) {
        setSelectedDoor({ roomIndex: activeRoomIndex, doorIndex });
        setDraggingDoor(true);
        pointSelected = true;
      }
    });

    // Check if the mouse is down on the rotate icon
    if (isRotating) {
      // if (selectedStaircase) {
      //   const stCenter = {
      //     x: selectedStaircase.x + selectedStaircase.width / 2,
      //     y: selectedStaircase.y + selectedStaircase.height / 2,
      //   };
      //   const rotateIconPosition = {
      //     x:
      //       stCenter.x +
      //       50 * Math.cos(selectedStaircase.rotationAngle || 0) -
      //       50 * Math.sin(selectedStaircase.rotationAngle || 0),
      //     y:
      //       stCenter.y +
      //       50 * Math.sin(selectedStaircase.rotationAngle || 0) +
      //       50 * Math.cos(selectedStaircase.rotationAngle || 0),
      //   };

      //   if (
      //     Math.abs(pos.x - rotateIconPosition.x) < selectionRadius &&
      //     Math.abs(pos.y - rotateIconPosition.y) < selectionRadius
      //   ) {
      //     setDragging(true);
      //     setCurrentPoint({
      //       type: "rotate",
      //       stIndex: selectedStaircase.index,
      //       offsetX: pos.x - center.x,
      //       offsetY: pos.y - center.y,
      //     });
      //     pointSelected = true;
      //   }
      //   return;
      // }

      const rotateIconPosition = {
        x:
          center.x +
          50 * Math.cos(room.rotationAngle || 0) -
          50 * Math.sin(room.rotationAngle || 0),
        y:
          center.y +
          50 * Math.sin(room.rotationAngle || 0) +
          50 * Math.cos(room.rotationAngle || 0),
      };

      if (
        Math.abs(pos.x - rotateIconPosition.x) < selectionRadius &&
        Math.abs(pos.y - rotateIconPosition.y) < selectionRadius
      ) {
        setDragging(true);
        setCurrentPoint({
          type: "rotate",
          roomIndex: activeRoomIndex,
          offsetX: pos.x - center.x,
          offsetY: pos.y - center.y,
        });
        pointSelected = true;
      }
    }
    let selectedDoors = [];
    room?.vertices?.forEach((vertex, vertexIndex) => {
      if (
        Math.abs(pos.x - vertex.x) < selectionRadius &&
        Math.abs(pos.y - vertex.y) < selectionRadius
      ) {
        setDragging(true);
        setCurrentPoint({
          type: "vertex",
          roomIndex: activeRoomIndex,
          index: vertexIndex,
          offsetX: pos.x - vertex.x,
          offsetY: pos.y - vertex.y,
        });
        pointSelected = true;
        const nextVertex =
          rooms[activeRoomIndex]?.vertices[
          (vertexIndex + 1) % rooms[activeRoomIndex].vertices.length
          ];
        rooms[activeRoomIndex]?.doors?.forEach((door, doorIndex) => {
          if (isDoorOnWall(door, vertex, nextVertex)) {
            selectedDoors.push(doorIndex);
          }
        });

        setSelectedWallDoors(selectedDoors);
      }
    });

    if (!pointSelected) {
      room?.vertices?.forEach((vertex, vertexIndex) => {
        const nextVertex =
          room.vertices[(vertexIndex + 1) % room.vertices.length];
        if (
          isPointNearLine(
            pos.x,
            pos.y,
            vertex.x,
            vertex.y,
            nextVertex.x,
            nextVertex.y,
            selectionRadius
          )
        ) {
          setDragging(true);
          setCurrentPoint({
            type: "wall",
            roomIndex: activeRoomIndex,
            index: vertexIndex,
            offsetX: pos.x,
            offsetY: pos.y,
          });
          pointSelected = true;
        }
      });
    }

    if (!pointSelected && isMoving) {
      const moveIconPosition = calculateCentroid(room.vertices);

      if (
        Math.abs(pos.x - moveIconPosition.x) < selectionRadius &&
        Math.abs(pos.y - moveIconPosition.y) < selectionRadius
      ) {
        setDragging(true);
        setDraggingMoveIcon(true);

        setCurrentPoint({
          type: "room",
          roomIndex: activeRoomIndex,
          offsetX: pos.x - moveIconPosition.x,
          offsetY: pos.y - moveIconPosition.y,
        });
        pointSelected = true;
      }
    }

    if (!pointSelected && isRotating) {
      const rotateIconPosition = calculateCentroid(room.vertices);

      if (
        Math.abs(pos.x - rotateIconPosition.x) < selectionRadius &&
        Math.abs(pos.y - rotateIconPosition.y) < selectionRadius
      ) {
        setDragging(true);
        setCurrentPoint({
          type: "rotate",
          roomIndex: activeRoomIndex,
          offsetX: pos.x - rotateIconPosition.x,
          offsetY: pos.y - rotateIconPosition.y,
        });
        pointSelected = true;
      }
    }

    if (!pointSelected) {
      setDragging(false);
      setCurrentPoint(null);
      setSelectedDoor(null);
    }
  };

  // Utility function to check if the door is on the given wall
  const isDoorOnWall = (door, wallStart, wallEnd) => {
    const tolerance = 20; // Adjust as needed
    const isStartMatch =
      pointToSegmentDistance(door.start, wallStart, wallEnd) < tolerance;
    const isEndMatch =
      pointToSegmentDistance(door.end, wallStart, wallEnd) < tolerance;

    return isStartMatch && isEndMatch;
  };

  // Utility function to calculate the distance from a point to a line segment
  const pointToSegmentDistance = (point, segStart, segEnd) => {
    const px = segEnd.x - segStart.x;
    const py = segEnd.y - segStart.y;
    const norm = px * px + py * py;
    let u = ((point.x - segStart.x) * px + (point.y - segStart.y) * py) / norm;
    u = Math.max(Math.min(u, 1), 0);
    const x = segStart.x + u * px;
    const y = segStart.y + u * py;
    const dx = x - point.x;
    const dy = y - point.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  //MouseMove
  const handleMouseMove = (e) => {
    if (selectedStaircase && isStaircaseDragging) {
      const isTouchEvent = e.type === "touchmove";
      const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;

      setStaircases((prev) => {
        return {
          ...prev,
          [floorName]: prev[floorName]?.map((staircase, i) =>
            i === selectedStaircase.index
              ? { ...staircase, x: newX, y: newY }
              : staircase
          ),
        };
      });
      setSelectedStaircase((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
      return;
    }

    if (activeRoomIndex === null) {
      if (panning) {
        e.preventDefault();
        const isTouch = e.touches ? true : false;

        const event = isTouch ? e.touches?.[0] : e;
        const dx = event.clientX - panStart.x;
        const dy = event.clientY - panStart.y;

        const newTranslate = {
          x: translate.x + dx,
          y: translate.y + dy,
        };

        setTranslate(newTranslate);
        setPanStart({ x: event.clientX, y: event.clientY });
      }

      return;
    }

    if (draggingDoor && selectedDoor) {
      const pos = getMousePosition(e);
      const { roomIndex, doorIndex } = selectedDoor;
      const room = rooms[roomIndex];
      const door = room.doors[doorIndex];

      let nearestWall = null;
      let minDistance = Infinity;
      let bestT = 0;

      // Find the nearest wall to the cursor position
      room?.vertices?.forEach((vertex, vertexIndex) => {
        const nextVertex =
          room.vertices[(vertexIndex + 1) % room.vertices.length];
        const dx = nextVertex.x - vertex.x;
        const dy = nextVertex.y - vertex.y;
        const wallLength = Math.sqrt(dx * dx + dy * dy);
        const t =
          ((pos.x - vertex.x) * dx + (pos.y - vertex.y) * dy) /
          (wallLength * wallLength);
        const clampedT = Math.max(0, Math.min(1, t));
        const closestPoint = {
          x: vertex.x + clampedT * dx,
          y: vertex.y + clampedT * dy,
        };
        const distance = Math.sqrt(
          (pos.x - closestPoint.x) ** 2 + (pos.y - closestPoint.y) ** 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestWall = { start: vertex, end: nextVertex };
          bestT = clampedT;
        }
      });

      if (nearestWall) {
        const doorLength = Math.sqrt(
          (door.end.x - door.start.x) ** 2 + (door.end.y - door.start.y) ** 2
        );
        const wallDirection = {
          x: nearestWall.end.x - nearestWall.start.x,
          y: nearestWall.end.y - nearestWall.start.y,
        };
        const wallUnitVector = {
          x:
            wallDirection.x /
            Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
          y:
            wallDirection.y /
            Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
        };
        const doorStart = {
          x:
            nearestWall.start.x +
            bestT * wallDirection.x -
            (doorLength / 2) * wallUnitVector.x,
          y:
            nearestWall.start.y +
            bestT * wallDirection.y -
            (doorLength / 2) * wallUnitVector.y,
        };

        const doorEnd = {
          x: doorStart.x + doorLength * wallUnitVector.x,
          y: doorStart.y + doorLength * wallUnitVector.y,
        };

        const updatedRooms = rooms.map((r, i) =>
          i === roomIndex
            ? {
              ...r,
              doors: r.doors.map((d, j) =>
                j === doorIndex ? { ...d, start: doorStart, end: doorEnd } : d
              ),
            }
            : r
        );

        setRooms(updatedRooms);
      }
      return;
    }

    if (!dragging || !currentPoint) return;
    const pos = getMousePosition(e);
    if (currentPoint.type === "rotate") {
      const room = rooms[currentPoint.roomIndex];
      const center = calculateCentroid(room.vertices);
      const initialAngle = room.rotationAngle || 0;

      const { angle, angleIncrement, rotatePoint } = getIncreamentedAngle(
        pos,
        center,
        initialAngle,
        setRotationIconColor
      );

      const updatedVertices = room.vertices.map((vertex) =>
        rotatePoint(vertex, center, angleIncrement)
      );
      const updatedDoors = room?.doors?.map((door) => {
        const rotatedStart = rotatePoint(door.start, center, angleIncrement);
        const rotatedEnd = rotatePoint(door.end, center, angleIncrement);

        return {
          ...door,
          start: rotatedStart,
          end: rotatedEnd,
        };
      });

      const updatedRooms = rooms.map((r, i) =>
        i === currentPoint.roomIndex
          ? {
            ...r,
            vertices: updatedVertices,
            doors: updatedDoors,
            centers: calculateCenters(updatedVertices),
            rotationAngle: angle,
          }
          : r
      );

      setRooms(updatedRooms);

      setStaircases((prev) => {
        return {
          ...prev,
          [floorName]: prev[floorName]?.map((staircase, i) => {
            if (staircase.roomId === room.id) {
              const stCentroid = {
                x: staircase.x + staircase.width / 2,
                y: staircase.y + staircase.height / 2,
              };
              const rotatedStaircaseCenter = rotatePoint(
                stCentroid,
                center,
                angleIncrement
              );
              return {
                ...staircase,
                x: rotatedStaircaseCenter.x - staircase.width / 2,
                y: rotatedStaircaseCenter.y - staircase.height / 2,
                rotationAngle: (staircase.rotationAngle || 0) + angleIncrement,
              };
            }
            return staircase;
          }),
        };
      });

      currentPoint.offsetX = pos.x;
      currentPoint.offsetY = pos.y;

      return;
    }

    const updateFeetAndInches = (vertex1, vertex2) => {
      const length = Math.sqrt(
        Math.pow(vertex2.x - vertex1.x, 2) + Math.pow(vertex2.y - vertex1.y, 2)
      );
      const angle = Math.atan2(vertex2.y - vertex1.y, vertex2.x - vertex1.x);
      const innerOffsetX = innerOffset * Math.cos(angle);
      const innerOffsetY = innerOffset * Math.sin(angle);

      // Adjusted start and end points
      const adjustedStart = {
        x: vertex1.x + innerOffsetX,
        y: vertex1.y + innerOffsetY,
      };
      const adjustedEnd = {
        x: vertex2.x - innerOffsetX,
        y: vertex2.y - innerOffsetY,
      };
      // Calculate the adjusted length
      const adjustedLength = Math.sqrt(
        Math.pow(adjustedEnd.x - adjustedStart.x, 2) +
        Math.pow(adjustedEnd.y - adjustedStart.y, 2)
      );
      const { feet, inches } = convertToFeetAndInches(adjustedLength);
      setFeet(feet);
      setInches(inches);
    };

    let updatedRooms;
    if (
      currentPoint.type === "wall" &&
      selectedWall &&
      selectedWall.roomIndex === currentPoint.roomIndex &&
      selectedWall.index === currentPoint.index
    ) {
      updatedRooms = rooms.map((room, roomIndex) => {
        if (roomIndex === currentPoint.roomIndex) {
          let newVertices = [...room.vertices];
          if (!originalVertices) {
            setOriginalVertices(JSON.parse(JSON.stringify(newVertices)));
          }
          const prevVertexIndex = currentPoint.index;
          const nextVertexIndex =
            (currentPoint.index + 1) % room.vertices.length;

          const dx = pos.x - currentPoint.offsetX;
          const dy = pos.y - currentPoint.offsetY;

          const dirX =
            room.vertices[nextVertexIndex].x - room.vertices[prevVertexIndex].x;
          const dirY =
            room.vertices[nextVertexIndex].y - room.vertices[prevVertexIndex].y;

          const length = Math.sqrt(dirX * dirX + dirY * dirY);
          const unitDirX = dirX / length;
          const unitDirY = dirY / length;

          const perpDirX = -unitDirY;
          const perpDirY = unitDirX;

          const perpMoveDist = dx * perpDirX + dy * perpDirY;

          const newPrevVertex = {
            x: newVertices[prevVertexIndex].x + perpMoveDist * perpDirX,
            y: newVertices[prevVertexIndex].y + perpMoveDist * perpDirY,
          };

          const newNextVertex = {
            x: newVertices[nextVertexIndex].x + perpMoveDist * perpDirX,
            y: newVertices[nextVertexIndex].y + perpMoveDist * perpDirY,
          };

          newVertices[prevVertexIndex] = newPrevVertex;
          newVertices[nextVertexIndex] = newNextVertex;

          if (currentPoint.type === "wall") {
            currentPoint.offsetX = pos.x;
            currentPoint.offsetY = pos.y;
          }

          // Update the door positions based on the moved wall vertices
          const updatedDoors = room?.doors?.map((door) => {
            const doorCenter = {
              x: (door.start.x + door.end.x) / 2,
              y: (door.start.y + door.end.y) / 2,
            };

            let nearestWall = null;
            let minDistance = Infinity;
            let bestT = 0;

            // Check both previous to current and current to next walls
            const checkWall = (startVertex, endVertex) => {
              const dx = endVertex.x - startVertex.x;
              const dy = endVertex.y - startVertex.y;
              const wallLength = Math.sqrt(dx * dx + dy * dy);
              const t =
                ((doorCenter.x - startVertex.x) * dx +
                  (doorCenter.y - startVertex.y) * dy) /
                (wallLength * wallLength);
              const clampedT = Math.max(0, Math.min(1, t));
              const closestPoint = {
                x: startVertex.x + clampedT * dx,
                y: startVertex.y + clampedT * dy,
              };
              const distance = Math.sqrt(
                (doorCenter.x - closestPoint.x) ** 2 +
                (doorCenter.y - closestPoint.y) ** 2
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearestWall = { start: startVertex, end: endVertex };
                bestT = clampedT;
              }
            };

            const isDoorOnRelevantWall =
              isDoorOnWall(
                door,
                room.vertices[prevVertexIndex],
                room.vertices[currentPoint.index]
              ) ||
              isDoorOnWall(
                door,
                room.vertices[currentPoint.index],
                room.vertices[nextVertexIndex]
              ) ||
              isDoorOnWall(
                door,
                room.vertices[
                (prevVertexIndex - 1 + room.vertices.length) %
                room.vertices.length
                ],
                room.vertices[prevVertexIndex]
              ) ||
              isDoorOnWall(
                door,
                room.vertices[nextVertexIndex],
                room.vertices[(nextVertexIndex + 1) % room.vertices.length]
              );

            if (isDoorOnRelevantWall) {
              checkWall(
                newVertices[prevVertexIndex],
                newVertices[currentPoint.index]
              );
              checkWall(
                newVertices[currentPoint.index],
                newVertices[nextVertexIndex]
              );
              checkWall(
                newVertices[
                (prevVertexIndex - 1 + room.vertices.length) %
                room.vertices.length
                ],
                newVertices[prevVertexIndex]
              );
              checkWall(
                newVertices[nextVertexIndex],
                newVertices[(nextVertexIndex + 1) % room.vertices.length]
              );
            }

            if (nearestWall) {
              const doorLength = Math.sqrt(
                (door.end.x - door.start.x) ** 2 +
                (door.end.y - door.start.y) ** 2
              );
              const wallDirection = {
                x: nearestWall.end.x - nearestWall.start.x,
                y: nearestWall.end.y - nearestWall.start.y,
              };
              const wallUnitVector = {
                x:
                  wallDirection.x /
                  Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
                y:
                  wallDirection.y /
                  Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
              };
              const doorStart = {
                x:
                  nearestWall.start.x +
                  bestT * wallDirection.x -
                  (doorLength / 2) * wallUnitVector.x,
                y:
                  nearestWall.start.y +
                  bestT * wallDirection.y -
                  (doorLength / 2) * wallUnitVector.y,
              };
              const doorEnd = {
                x: doorStart.x + doorLength * wallUnitVector.x,
                y: doorStart.y + doorLength * wallUnitVector.y,
              };

              return { ...door, start: doorStart, end: doorEnd };
            }

            return door;
          });

          updateFeetAndInches(newPrevVertex, newNextVertex);

          return {
            ...room,
            vertices: newVertices,
            doors: updatedDoors,
            centers: calculateCenters(newVertices),
          };
        }
        return room;
      });

      setRooms(updatedRooms);
      highlightNearestVertex(
        updatedRooms[currentPoint.roomIndex],
        currentPoint.roomIndex,
        pos,
        6
      );
      highlightNearestParallelWalls(
        updatedRooms[currentPoint.roomIndex],
        currentPoint.roomIndex,
        pos,
        3
      );
    } else if (currentPoint.type === "vertex" || currentPoint.type === "room") {
      if (currentPoint.type === "room" && !draggingMoveIcon) return;
      updatedRooms = rooms.map((room, roomIndex) => {
        if (roomIndex === currentPoint.roomIndex) {
          let newVertices = [...room.vertices];
          let oldVertices = JSON.parse(JSON.stringify([...room.vertices]));
          let updatedDoors = room?.doors ? [...room?.doors] : [];

          if (currentPoint.type === "vertex") {
            setSelectedWall(null);
            if (!originalVertices) {
              setOriginalVertices(JSON.parse(JSON.stringify(newVertices)));
            }
            newVertices[currentPoint.index] = {
              x: pos.x - currentPoint.offsetX,
              y: pos.y - currentPoint.offsetY,
            };

            const prevVertexIndex =
              (currentPoint.index - 1 + room.vertices.length) %
              room.vertices.length;
            const nextVertexIndex =
              (currentPoint.index + 1) % room.vertices.length;

            const prevVertex = newVertices[prevVertexIndex];
            const nextVertex = newVertices[nextVertexIndex];

            if (
              Math.abs(newVertices[currentPoint.index].x - prevVertex.x) <
              selectionRadius
            ) {
              newVertices[currentPoint.index].x = prevVertex.x;
            } else if (
              Math.abs(newVertices[currentPoint.index].y - prevVertex.y) <
              selectionRadius
            ) {
              newVertices[currentPoint.index].y = prevVertex.y;
            } else if (
              Math.abs(newVertices[currentPoint.index].x - nextVertex.x) <
              selectionRadius
            ) {
              newVertices[currentPoint.index].x = nextVertex.x;
            } else if (
              Math.abs(newVertices[currentPoint.index].y - nextVertex.y) <
              selectionRadius
            ) {
              newVertices[currentPoint.index].y = nextVertex.y;
            }

            // Update the door positions based on the moved vertices
            updatedDoors = room?.doors?.map((door, doorIndex) => {
              const doorCenter = {
                x: (door.start.x + door.end.x) / 2,
                y: (door.start.y + door.end.y) / 2,
              };

              let nearestWall = null;
              let minDistance = Infinity;
              let bestT = 0;

              // Check both previous to current and current to next walls
              const checkWall = (startVertex, endVertex) => {
                const dx = endVertex.x - startVertex.x;
                const dy = endVertex.y - startVertex.y;
                const wallLength = Math.sqrt(dx * dx + dy * dy);
                const t =
                  ((doorCenter.x - startVertex.x) * dx +
                    (doorCenter.y - startVertex.y) * dy) /
                  (wallLength * wallLength);
                const clampedT = Math.max(0, Math.min(1, t));
                const closestPoint = {
                  x: startVertex.x + clampedT * dx,
                  y: startVertex.y + clampedT * dy,
                };
                const distance = Math.sqrt(
                  (doorCenter.x - closestPoint.x) ** 2 +
                  (doorCenter.y - closestPoint.y) ** 2
                );

                if (distance < minDistance) {
                  minDistance = distance;
                  nearestWall = { start: startVertex, end: endVertex };
                  bestT = clampedT;
                }
              };

              const isDoorOnRelevantWall =
                isDoorOnWall(
                  door,
                  newVertices[prevVertexIndex],
                  newVertices[currentPoint.index]
                ) ||
                isDoorOnWall(
                  door,
                  newVertices[currentPoint.index],
                  newVertices[nextVertexIndex]
                );

              if (isDoorOnRelevantWall) {
                checkWall(
                  newVertices[prevVertexIndex],
                  newVertices[currentPoint.index]
                );
                checkWall(
                  newVertices[currentPoint.index],
                  newVertices[nextVertexIndex]
                );
              }

              if (nearestWall) {
                const doorLength = Math.sqrt(
                  (door.end.x - door.start.x) ** 2 +
                  (door.end.y - door.start.y) ** 2
                );
                const wallDirection = {
                  x: nearestWall.end.x - nearestWall.start.x,
                  y: nearestWall.end.y - nearestWall.start.y,
                };
                const wallUnitVector = {
                  x:
                    wallDirection.x /
                    Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
                  y:
                    wallDirection.y /
                    Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
                };
                const doorStart = {
                  x:
                    nearestWall.start.x +
                    bestT * wallDirection.x -
                    (doorLength / 2) * wallUnitVector.x,
                  y:
                    nearestWall.start.y +
                    bestT * wallDirection.y -
                    (doorLength / 2) * wallUnitVector.y,
                };
                const doorEnd = {
                  x: doorStart.x + doorLength * wallUnitVector.x,
                  y: doorStart.y + doorLength * wallUnitVector.y,
                };

                return { ...door, start: doorStart, end: doorEnd };
              }

              return door;
            });

            updateFeetAndInches(newVertices[currentPoint.index], nextVertex);
          } else if (currentPoint.type === "room") {
            setStaircases((prev) => {
              return {
                ...prev,
                [floorName]: prev[floorName]?.map((st) => {
                  if (st.roomId === room.id) {
                    return {
                      ...st,
                      x: st.x + dx,
                      y: st.y + dy,
                    };
                  }
                  return st;
                }),
              };
            });

            const dx = pos.x - calculateCentroid(newVertices).x;
            const dy = pos.y - calculateCentroid(newVertices).y;

            newVertices = newVertices.map((vertex) => ({
              x: vertex.x + dx,
              y: vertex.y + dy,
            }));
            // Update door positions based on room movement
            updatedDoors = room?.doors?.map((door) => ({
              ...door,
              start: { x: door.start.x + dx, y: door.start.y + dy },
              end: { x: door.end.x + dx, y: door.end.y + dy },
            }));

            setSelectedWall(null);
            setClickPosition(null);
          }
          console.log("updatedDoors", updatedDoors);
          return {
            ...room,
            vertices: newVertices,
            doors: updatedDoors,
            centers: calculateCenters(newVertices),
          };
        }
        return room;
      });

      setRooms(updatedRooms);
      if (currentPoint.type === "room") {
        highlightNearestParallelWalls(
          updatedRooms[currentPoint.roomIndex],
          currentPoint.roomIndex,
          pos
        );
        highlightNearestVertex(
          updatedRooms[currentPoint.roomIndex],
          currentPoint.roomIndex,
          pos
        );
      }
    }

    // Check if vertex is near another room vertex
    if (currentPoint.type === "vertex") {
      let isNearOtherVertex = false;
      rooms.forEach((room, roomIndex) => {
        if (roomIndex !== currentPoint.roomIndex) {
          room?.vertices?.forEach((otherVertex) => {
            const distance = Math.sqrt(
              Math.pow(pos.x - otherVertex.x, 2) +
              Math.pow(pos.y - otherVertex.y, 2)
            );
            if (distance < selectionRadius) {
              isNearOtherVertex = true;
            }
          });
        }
      });

      // Change color based on proximity
      setDraggingIconColor(isNearOtherVertex ? "#9DDE8B" : "#3a80c7");

      // Show SVG icon when dragging a vertex
      setDraggingIconPosition({ x: pos.x, y: pos.y });
    }

    // Update elastic line coordinates
    if (highlightedWalls.length > 0 && currentPoint.type === "room") {
      const { movedWall, otherWall } = highlightedWalls[0];

      setElasticLine({
        start: {
          x: (movedWall.x1 + movedWall.x2) / 2,
          y: (movedWall.y1 + movedWall.y2) / 2,
        },
        end: {
          x: (otherWall.x1 + otherWall.x2) / 2,
          y: (otherWall.y1 + otherWall.y2) / 2,
        },
      });
    } else {
      setElasticLine(null);
    }

    let hovered = false;
    rooms.forEach((room, roomIndex) => {
      room?.vertices?.forEach((vertex, vertexIndex) => {
        if (
          Math.abs(pos.x - vertex.x) < selectionRadius &&
          Math.abs(pos.y - vertex.y) < selectionRadius &&
          !(
            currentPoint &&
            currentPoint.roomIndex === roomIndex &&
            currentPoint.index === vertexIndex
          )
        ) {
          setHoveredVertex({ roomIndex, index: vertexIndex, ...vertex });
          hovered = true;
        }
      });
    });

    if (!hovered) {
      setHoveredVertex(null);
    }
  };

  // Example of wrapping setRooms with handleStateChange
  const stopDragging = () => {
    setDragging(false);
    setPanning(false);
    setDraggingMoveIcon(false);
    setDraggingIconPosition(null);
    setDraggingIconColor("#3a80c7");

    if (!currentPoint) return;
    let isLockedWallChanged = false;
    let updatedRooms = JSON.parse(JSON.stringify(rooms)); // Deep copy of rooms
    let modifiedLockedWalls = {};

    const updateDoors = (room, offsetX, offsetY) => {
      return room?.doors?.map((door) => {
        const newDoorStart = {
          x: door.start.x + offsetX,
          y: door.start.y + offsetY,
        };
        const newDoorEnd = {
          x: door.end.x + offsetX,
          y: door.end.y + offsetY,
        };

        return { ...door, start: newDoorStart, end: newDoorEnd };
      });
    };

    const snapVertices = (room, offsets) => {
      const averageOffsetX =
        offsets.reduce((acc, offset) => acc + offset.offsetX, 0) /
        offsets.length;
      const averageOffsetY =
        offsets.reduce((acc, offset) => acc + offset.offsetY, 0) /
        offsets.length;

      return {
        averageOffsetX,
        averageOffsetY,
        newVertices: room.vertices.map((vertex) => ({
          x: vertex.x + averageOffsetX,
          y: vertex.y + averageOffsetY,
        })),
      };
    };

    const rotateDoors = (doors, center, angleIncrement) => {
      return doors?.map((door) => {
        const rotatedStart = rotatePoint(door.start, center, angleIncrement);
        const rotatedEnd = rotatePoint(door.end, center, angleIncrement);

        return { ...door, start: rotatedStart, end: rotatedEnd };
      });
    };

    if (currentPoint.type === "room" && nearestVertices.length > 0) {
      const offsets = nearestVertices.map((nearestVertex) => ({
        offsetX: nearestVertex.otherVertex.x - nearestVertex.movedVertex.x,
        offsetY: nearestVertex.otherVertex.y - nearestVertex.movedVertex.y,
      }));

      updatedRooms = updatedRooms.map((room, roomIndex) => {
        if (roomIndex === activeRoomIndex) {
          const { averageOffsetX, averageOffsetY, newVertices } = snapVertices(
            room,
            offsets
          );
          const updatedDoors = updateDoors(
            room,
            averageOffsetX,
            averageOffsetY
          );
          return {
            ...room,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
            doors: updatedDoors,
          };
        }
        return room;
      });
    } else if (
      currentPoint &&
      (currentPoint.type === "vertex" ||
        currentPoint.type === "wall" ||
        currentPoint.type === "room")
    ) {
      let originalRoom = rooms[currentPoint.roomIndex];
      let originalLengths = calculateWallLengths(originalRoom.vertices);

      updatedRooms = updatedRooms.map((room, roomIndex) => {
        if (roomIndex === currentPoint.roomIndex) {
          let newVertices = [...room.vertices];
          let averageOffsetX = 0;
          let averageOffsetY = 0;

          rooms?.forEach((otherRoom, otherRoomIndex) => {
            if (otherRoomIndex !== roomIndex) {
              otherRoom?.vertices?.forEach((vertex) => {
                const distance = Math.sqrt(
                  Math.pow(vertex.x - newVertices[currentPoint.index]?.x, 2) +
                  Math.pow(vertex.y - newVertices[currentPoint.index]?.y, 2)
                );

                if (distance < selectionRadius) {
                  averageOffsetX = vertex.x - newVertices[currentPoint.index].x;
                  averageOffsetY = vertex.y - newVertices[currentPoint.index].y;
                  newVertices[currentPoint.index] = {
                    x: vertex.x,
                    y: vertex.y,
                  };
                }
              });
            }
          });

          const updatedDoors = updateDoors(
            room,
            averageOffsetX,
            averageOffsetY
          );

          return {
            ...room,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
            doors: updatedDoors,
          };
        }
        return room;
      });

      let newLengths = calculateWallLengths(
        updatedRooms[currentPoint.roomIndex].vertices
      );
      let lockedWalls = originalRoom.lockedWalls || {};
      for (let index in lockedWalls) {
        if (Math.abs(newLengths[index] - originalLengths[index]) > 0.9) {

          isLockedWallChanged = true;
          modifiedLockedWalls[index] = newLengths[index];
        }
      }
    }

    if (currentPoint.type === "rotate") {
      const room = rooms[currentPoint.roomIndex];
      const angleInDegrees = room.rotationAngle * (180 / Math.PI);

      if (
        angleInDegrees >= 350 ||
        angleInDegrees <= 10 ||
        (angleInDegrees >= 35 && angleInDegrees <= 55) ||
        (angleInDegrees >= 80 && angleInDegrees <= 100) ||
        (angleInDegrees >= 125 && angleInDegrees <= 145) ||
        (angleInDegrees >= 170 && angleInDegrees <= 190) ||
        (angleInDegrees >= 215 && angleInDegrees <= 235) ||
        (angleInDegrees >= 260 && angleInDegrees <= 280) ||
        (angleInDegrees >= 305 && angleInDegrees <= 325)
      ) {
        const snappedAngle = snapToNearest45(angleInDegrees) * (Math.PI / 180);

        const center = calculateCentroid(room.vertices);

        const updatedVertices = room.vertices.map((vertex) =>
          rotatePoint(vertex, center, snappedAngle - room.rotationAngle)
        );

        const updatedDoors = rotateDoors(
          room.doors,
          center,
          snappedAngle - room.rotationAngle
        );

        updatedRooms = updatedRooms.map((r, i) =>
          i === currentPoint.roomIndex
            ? {
              ...r,
              vertices: updatedVertices,
              centers: calculateCenters(updatedVertices),
              rotationAngle: 0,
              doors: updatedDoors,
            }
            : r
        );

        setStaircases((prev) => {
          return {
            ...prev,
            [floorName]: prev[floorName]?.map((staircase, i) => {
              if (staircase.roomId === room.id) {
                const stCentroid = {
                  x: staircase.x + staircase.width / 2,
                  y: staircase.y + staircase.height / 2,
                };
                const rotatedStaircaseCenter = rotatePoint(
                  stCentroid,
                  center,
                  snappedAngle - room.rotationAngle
                );
                const newRotationAngle =
                  staircase.rotationAngle + snappedAngle - room.rotationAngle;
                return {
                  ...staircase,
                  x: rotatedStaircaseCenter.x - staircase.width / 2,
                  y: rotatedStaircaseCenter.y - staircase.height / 2,
                  rotationAngle: newRotationAngle,
                };
              }
              return staircase;
            }),
          };
        });

        setRotationIconColor(defaultRotationalColor);
      } else {
        updatedRooms = rooms.map((r, i) =>
          i === currentPoint.roomIndex ? { ...r, rotationAngle: 0 } : r
        );
      }

      setRooms(updatedRooms);
      setIsRotating(false);
    }

    if (currentPoint.type === "wall" && nearestVertices.length > 0) {
      const offsets = nearestVertices.map((nearestVertex) => ({
        offsetX: nearestVertex.otherVertex.x - nearestVertex.movedVertex.x,
        offsetY: nearestVertex.otherVertex.y - nearestVertex.movedVertex.y,
      }));

      updatedRooms = updatedRooms.map((room, roomIndex) => {
        if (roomIndex === activeRoomIndex) {
          const { averageOffsetX, averageOffsetY, newVertices } = snapVertices(
            room,
            offsets
          );
          const updatedDoors = updateDoors(
            room,
            averageOffsetX,
            averageOffsetY
          );
          return {
            ...room,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
            doors: updatedDoors,
          };
        }
        return room;
      });
    }

    if (highlightedWalls.length > 0) {
      updatedRooms = snapRoomToHighlightedWall(
        updatedRooms,
        highlightedWalls,
        rooms,
        activeRoomIndex
      );

      // Update doors positions after snapping to highlighted walls
      updatedRooms = updatedRooms.map((room) => {
        const updatedDoors = updateDoors(room, 0, 0);
        return { ...room, doors: updatedDoors };
      });
    }

    if (isLockedWallChanged) {
      setManualWallLength({
        roomIndex: currentPoint.roomIndex,
        lengths: modifiedLockedWalls,
      });
      setConfirmLengthChange(true);
    } else {
      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      } // Use handleStateChange instead of setRooms

      if (
        currentPoint &&
        (currentPoint.type === "vertex" ||
          currentPoint.type === "wall" ||
          currentPoint.type === "room")
      ) {
        setOriginalVertices(updatedRooms[currentPoint.roomIndex].vertices);
      }
    }

    setHighlightedWalls([]);
    setNearestVertices([]);
    setCurrentPoint(null);
  };

  const handleMouseUp = () => {
    setDraggingDoor(false);
    setIsStaircaseDragging(false);
    stopDragging();

    if (selectedStaircase) {
      let curStaircases = { ...staircases };

      rooms?.forEach((r) => {
        curStaircases[floorName]?.forEach((st) => {
          const offsetVerticesofRoom = calculateOffsetVertices(r.vertices, 8);
          if (isStaircaseInRoom(st, offsetVerticesofRoom)) {
            st.roomId = r.id;
          } else {
            st.roomId = null;
          }
        });
      });

      setStaircases(curStaircases);
    }
    // setSelectedDoor(null)
  };

  const handleWheel = (e) => {
    if (selectedMethod === "square" || selectedMethod === null) {
      setZooming(true);
      e.preventDefault();
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
    }
  };

  const handleLengthChange = () => {
    if (selectedWall) {
      setManualChangeRooms({ rooms: [] });
      const lengthInFeet = parseInt(feet) * 12;
      const lengthInInches = parseInt(inches);
      const totalLengthInInches = lengthInFeet + lengthInInches;
      const lengthInPixels = (totalLengthInInches / 12) * 20;
      handleWallLengthChange(lengthInPixels);
    }
  };


  const handleWallLengthChange = (length) => {
    if (
      selectedWall &&
      rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] === undefined
    ) {
      const { roomIndex, index } = selectedWall;
      const room = rooms[roomIndex];
      const vertex1 = room.vertices[index];
      const vertex2 = room.vertices[(index + 1) % room.vertices.length];
      const originalLength = Math.sqrt(
        Math.pow(vertex2.x - vertex1.x, 2) + Math.pow(vertex2.y - vertex1.y, 2)
      );

      const angle = Math.atan2(vertex2.y - vertex1.y, vertex2.x - vertex1.x);

      // Define the inner offset value
      const innerOffset = -4;

      // Calculate the length change for each side
      const lengthChange = (length + 8 - originalLength) / 2;

      // Calculate new positions for both vertices with inner offset
      const newVertex1 = {
        x: vertex1.x - lengthChange * Math.cos(angle),
        y: vertex1.y - lengthChange * Math.sin(angle),
      };
      const newVertex2 = {
        x: vertex2.x + lengthChange * Math.cos(angle),
        y: vertex2.y + lengthChange * Math.sin(angle),
      };

      const newVertices = [...room.vertices];
      newVertices[index] = newVertex1;
      newVertices[(index + 1) % newVertices.length] = newVertex2;

      // Store old room vertices for door position check
      const oldVertices = [...room.vertices];

      const isSameLength = Math.abs(length + 8 - originalLength) <= 1;

      // Update the door positions based on the adjacent walls
      const updatedDoors = room?.doors?.map((door) => {
        let prevWallIndex, nextWallIndex;
        if (index === room.vertices.length - 1) {
          prevWallIndex = room.vertices.length - 2;
          nextWallIndex = 0;
        } else {
          prevWallIndex = (index - 1 + oldVertices.length) % oldVertices.length;
          nextWallIndex = (index + 1) % oldVertices.length;
        }

        const prevWallStart = oldVertices[prevWallIndex];
        const prevWallEnd = oldVertices[(prevWallIndex + 1) % oldVertices.length];
        const nextWallStart = oldVertices[nextWallIndex];
        const nextWallEnd = oldVertices[(nextWallIndex + 1) % oldVertices.length];

        const isDoorOnPrevWall = isDoorOnWall(door, prevWallStart, prevWallEnd);
        const isDoorOnNextWall = isDoorOnWall(door, nextWallStart, nextWallEnd);

        if (!isDoorOnPrevWall && !isDoorOnNextWall) {
          return door; // Return the door as is if it is not on the adjacent walls
        }

        if (isSameLength) {
          return door; // Skip if the length change is not more than 1 unit
        }

        const wallStart = isDoorOnPrevWall ? newVertices[prevWallIndex] : newVertices[nextWallIndex];
        const wallEnd = isDoorOnPrevWall ? newVertices[(prevWallIndex + 1) % newVertices.length] : newVertices[(nextWallIndex + 1) % newVertices.length];

        const doorLength = Math.sqrt(
          (door.end.x - door.start.x) ** 2 + (door.end.y - door.start.y) ** 2
        );

        const doorCenter = {
          x: door.start.x,
          y: door.start.y,
        };

        let nearestWall = null;
        let minDistance = Infinity;
        let bestT = 0;

        // Find the nearest wall to the door center position
        newVertices?.forEach((vertex, vertexIndex) => {
          const nextVertex = newVertices[(vertexIndex + 1) % newVertices.length];
          const dx = nextVertex.x - vertex.x;
          const dy = nextVertex.y - vertex.y;
          const wallLength = Math.sqrt(dx * dx + dy * dy);
          const t =
            ((doorCenter.x - vertex.x) * dx + (doorCenter.y - vertex.y) * dy) /
            (wallLength * wallLength);
          const clampedT = Math.max(0, Math.min(1, t));
          const closestPoint = {
            x: vertex.x + clampedT * dx,
            y: vertex.y + clampedT * dy,
          };
          const distance = Math.sqrt(
            (doorCenter.x - closestPoint.x) ** 2 + (doorCenter.y - closestPoint.y) ** 2
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestWall = { start: vertex, end: nextVertex };
            bestT = clampedT;
          }
        });

        if (nearestWall) {
          const doorLength = Math.sqrt(
            (door.end.x - door.start.x) ** 2 + (door.end.y - door.start.y) ** 2
          );
          const wallDirection = {
            x: nearestWall.end.x - nearestWall.start.x,
            y: nearestWall.end.y - nearestWall.start.y,
          };
          const wallUnitVector = {
            x: wallDirection.x / Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
            y: wallDirection.y / Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
          };
          const doorStart = {
            x: nearestWall.start.x + bestT * wallDirection.x - (doorLength / 2) * wallUnitVector.x,
            y: nearestWall.start.y + bestT * wallDirection.y - (doorLength / 2) * wallUnitVector.y,
          };

          const doorEnd = {
            x: doorStart.x + doorLength * wallUnitVector.x,
            y: doorStart.y + doorLength * wallUnitVector.y,
          };

          return { ...door, start: doorStart, end: doorEnd };
        }

        return door;
      });

      const updatedRooms = rooms.map((r, i) =>
        i === roomIndex
          ? {
            ...r,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
            doors: updatedDoors,
            lockedWalls: { ...r.lockedWalls, [index]: length + 8 },
          }
          : r
      );

      const lockedWallChanged = checkLockedWallLengths(
        updatedRooms,
        roomIndex,
        index,
        length + 8
      );

      if (lockedWallChanged) {
        setManualChangeRooms({
          rooms: updatedRooms,
          roomIndex,
          wallIndex: index,
          lengthDiff: length + 8 - originalLength,
          innerOffset,
        });
        setManualWallLength({ roomIndex, index, length: length + 8 });
        setConfirmLengthChange(true);
      } else {
        setRooms(updatedRooms);
        setManualWallLength({ roomIndex, index, length });
        // Check and update parallel wall
        if (!isSameLength) {
          checkAndUpdateParallelWall(
            updatedRooms,
            roomIndex,
            index,
            length + 8 - originalLength,
            innerOffset, oldVertices
          );
        }
      }
    }
  };


  const checkLockedWallLengths = (rooms, roomIndex, wallIndex, newLength) => {
    const room = rooms[roomIndex];
    let lockedWallChanged = false;

    for (let i = 0; i < room.vertices.length; i++) {
      if (i === wallIndex || room.lockedWalls[i] === undefined) continue;

      const vertex1 = room.vertices[i];
      const vertex2 = room.vertices[(i + 1) % room.vertices.length];
      const currentLength = Math.sqrt(
        Math.pow(vertex2.x - vertex1.x, 2) + Math.pow(vertex2.y - vertex1.y, 2)
      );

      if (Math.abs(currentLength - room.lockedWalls[i]) > 1) {
        lockedWallChanged = true;
        break;
      }
    }

    return lockedWallChanged;
  };

  const handleWallChangeConfirmation = (confirm) => {
    if (manualWallLength && manualWallLength.roomIndex !== null) {
      const { roomIndex } = manualWallLength;
      const room = rooms[roomIndex];

      if (confirm) {
        if (manualChangeRooms?.rooms?.length > 0) {
          setRooms(manualChangeRooms?.rooms);

          checkAndUpdateParallelWall(
            manualChangeRooms?.rooms,
            manualChangeRooms?.roomIndex,
            manualChangeRooms?.wallIndex,
            manualChangeRooms?.lengthDiff,
            manualChangeRooms?.innerOffset
          );
          setOriginalVertices(null);
          setManualChangeRooms(null)
        } else {
          const updatedRooms = rooms.map((r, i) => {
            if (i === roomIndex) {
              const newLockedWalls = { ...r.lockedWalls };
              for (let index in manualWallLength.lengths) {
                newLockedWalls[index] = manualWallLength.lengths[index];
              }
              return { ...r, lockedWalls: newLockedWalls };
            }
            return r;
          });
          setRooms(updatedRooms);
          setOriginalVertices(null);
        }
        setManualWallLength(null);
        setConfirmLengthChange(false);
      } else {
        const updatedRooms = rooms?.map((r, i) =>
          i === roomIndex
            ? {
              ...r,
              vertices: originalVertices,
              centers: calculateCenters(originalVertices),
            }
            : r
        );


        setRooms(updatedRooms);
        setOriginalVertices(null);
        setManualWallLength(null);
        setConfirmLengthChange(false);
      }

    }
  };
  console.log("modal", confirmLengthChange)

  const checkAndUpdateParallelWall = (
    rooms,
    roomIndex,
    wallIndex,
    lengthDiff,
    innerOffset
  ) => {
    const room = rooms[roomIndex];
    const currentWall = getWallVertices(room.vertices, wallIndex);

    const oldVertices = [...room.vertices];

    // Get the next wall index
    const nextWallIndex = (wallIndex + 2) % room.vertices.length;

    const nextWall = getWallVertices(room.vertices, nextWallIndex);

    const parallelWallIndex = findParallelWall(currentWall, [
      { ...nextWall, index: nextWallIndex },
    ]);

    if (parallelWallIndex !== -1 && !room.lockedWalls[parallelWallIndex]) {

      const parallelWall = getWallVertices(room.vertices, parallelWallIndex);
      const angle = Math.atan2(
        parallelWall.end.y - parallelWall.start.y,
        parallelWall.end.x - parallelWall.start.x
      );

      // Calculate the length change for each side
      const lengthChange = lengthDiff / 2;



      // Calculate new positions for both vertices of the parallel wall with inner offset
      const newParallelStart = {
        x: parallelWall.start.x - lengthChange * Math.cos(angle),
        y: parallelWall.start.y - lengthChange * Math.sin(angle),
      };
      const newParallelEnd = {
        x: parallelWall.end.x + lengthChange * Math.cos(angle),
        y: parallelWall.end.y + lengthChange * Math.sin(angle),
      };

      const newVertices = [...room.vertices];
      newVertices[parallelWallIndex] = newParallelStart;
      newVertices[(parallelWallIndex + 1) % newVertices.length] =
        newParallelEnd;

      const updatedRooms = rooms.map((r, i) =>
        i === roomIndex
          ? {
            ...r,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
          }
          : r
      );

      // Update the door positions after all walls have been updated
      const updatedDoors = room?.doors?.map((door) => {
        const prevWallIndex = (selectedWall.index - 1 + oldVertices.length) % oldVertices.length;
        const nextWallIndex = (selectedWall.index + 1) % oldVertices.length;

        const prevWallStart = oldVertices[prevWallIndex];
        const prevWallEnd = oldVertices[(prevWallIndex + 1) % oldVertices.length];
        const nextWallStart = oldVertices[nextWallIndex];
        const nextWallEnd = oldVertices[(nextWallIndex + 1) % oldVertices.length];

        const isDoorOnPrevWall = isDoorOnWall(door, prevWallStart, prevWallEnd);
        const isDoorOnNextWall = isDoorOnWall(door, nextWallStart, nextWallEnd);

        if (!isDoorOnPrevWall && !isDoorOnNextWall) {
          return door; // Return the door as is if it is not on the adjacent walls
        }

        const wallStart = isDoorOnPrevWall ? oldVertices[prevWallIndex] : oldVertices[nextWallIndex];
        const wallEnd = isDoorOnPrevWall ? oldVertices[(prevWallIndex + 1) % oldVertices.length] : newVertices[(nextWallIndex + 1) % newVertices.length];

        const doorCenter = {
          x: door.start.x,
          y: door.start.y,
        };

        let nearestWall = null;
        let minDistance = Infinity;
        let bestT = 0;

        // Find the nearest wall to the door center position
        newVertices?.forEach((vertex, vertexIndex) => {
          const nextVertex = newVertices[(vertexIndex + 1) % newVertices.length];
          const dx = nextVertex.x - vertex.x;
          const dy = nextVertex.y - vertex.y;
          const wallLength = Math.sqrt(dx * dx + dy * dy);
          const t =
            ((doorCenter.x - vertex.x) * dx + (doorCenter.y - vertex.y) * dy) /
            (wallLength * wallLength);
          const clampedT = Math.max(0, Math.min(1, t));
          const closestPoint = {
            x: vertex.x + clampedT * dx,
            y: vertex.y + clampedT * dy,
          };
          const distance = Math.sqrt(
            (doorCenter.x - closestPoint.x) ** 2 + (doorCenter.y - closestPoint.y) ** 2
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestWall = { start: vertex, end: nextVertex };
            bestT = clampedT;
          }
        });

        if (nearestWall) {
          const doorLength = Math.sqrt(
            (door.end.x - door.start.x) ** 2 + (door.end.y - door.start.y) ** 2
          );
          const wallDirection = {
            x: nearestWall.end.x - nearestWall.start.x,
            y: nearestWall.end.y - nearestWall.start.y,
          };
          const wallUnitVector = {
            x: wallDirection.x / Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
            y: wallDirection.y / Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2),
          };
          const doorStart = {
            x: nearestWall.start.x + bestT * wallDirection.x - (doorLength / 2) * wallUnitVector.x,
            y: nearestWall.start.y + bestT * wallDirection.y - (doorLength / 2) * wallUnitVector.y,
          };

          const doorEnd = {
            x: doorStart.x + doorLength * wallUnitVector.x,
            y: doorStart.y + doorLength * wallUnitVector.y,
          };

          return { ...door, start: doorStart, end: doorEnd };
        }

        return door;
      });

      const finalRooms = updatedRooms.map((r, i) =>
        i === roomIndex
          ? {
            ...r,
            doors: updatedDoors,
          }
          : r
      );

      setRooms(finalRooms);
    }
  };

  const getWallVertices = (vertices, index) => {
    const start = vertices[index];
    const end = vertices[(index + 1) % vertices.length];
    const length = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    return { start, end, length };
  };

  const findParallelWall = (currentWall, candidates) => {
    const angleTolerance = 1; // Adjust tolerance as needed
    const lengthTolerance = 20; // Adjust tolerance as needed

    for (const candidate of candidates) {
      const angleDiff = Math.abs(
        Math.atan2(
          candidate.end.y - candidate.start.y,
          candidate.end.x - candidate.start.x
        ) -
        Math.atan2(
          currentWall.end.y - currentWall.start.y,
          currentWall.end.x - currentWall.start.x
        )
      );

      if (
        angleDiff < angleTolerance ||
        Math.abs(angleDiff - Math.PI) < angleTolerance
      ) {
        const distance = pointToSegmentDistance1(
          candidate.start,
          currentWall.start,
          currentWall.end
        );

        if (distance > lengthTolerance) {
          return candidate.index;
        }
      }
    }

    return -1;
  };

  const pointToSegmentDistance1 = (p, v, w) => {
    const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    if (l2 === 0)
      return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
    const t = Math.max(
      0,
      Math.min(1, ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2)
    );
    return Math.sqrt(
      Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) +
      Math.pow(p.y - (v.y + t * (w.y - v.y)), 2)
    );
  };

  const addVertex = () => {
    if (selectedWall && clickPosition) {
      const { roomIndex, index } = selectedWall;
      const room = rooms[roomIndex];

      const newVertex1 = {
        x: clickPosition.x,
        y: clickPosition.y,
      };
      const newVertex2 = {
        x: clickPosition.x,
        y: clickPosition.y,
      };

      const newVertices = [
        ...room.vertices.slice(0, index + 1),
        newVertex1,
        newVertex2,
        ...room.vertices.slice(index + 1),
      ];

      const updatedRooms = rooms.map((r, i) => {
        if (i === roomIndex) {
          return {
            ...r,
            vertices: newVertices,
            centers: calculateCenters(newVertices),
          };
        }
        return r;
      });

      // setRooms(updatedRooms);
      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      }
      setSelectedWall({ roomIndex, index: index + 1 });
      // setSelectedVertex({ roomIndex, index: index + 1 });
      setClickPosition(null);
    }
  };

  const rotateRoom = () => {
    if (activeRoomIndex !== null) {
      setIsRotating(true);
      setIsMoving(false);
      setSelectedStaircase(null);
    }
  };

  const hideWall = () => {
    if (selectedWall) {
      const { roomIndex, index } = selectedWall;
      const updatedRooms = rooms.map((room, i) => {
        if (i === roomIndex) {
          const hiddenWalls = room.hiddenWalls ? [...room.hiddenWalls] : [];
          if (!hiddenWalls.includes(index)) {
            hiddenWalls.push(index);
          } else {
            const hiddenIndex = hiddenWalls.indexOf(index);
            hiddenWalls.splice(hiddenIndex, 1);
          }
          return { ...room, hiddenWalls };
        }
        return room;
      });

      setRooms(updatedRooms);
      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      }
      setSelectedWall(null);
    }
  };

  const deleteRoom = () => {
    if (activeRoomIndex !== null) {
      const updatedRooms = rooms.filter(
        (_, index) => index !== activeRoomIndex
      );
      setRooms(updatedRooms);
      setActiveRoomIndex(null);
      resetScale();
    }
  };

  const dispatchSeletedRoom = useCallback(
    (roomIndex) => {
      const selectedRoom = rooms[roomIndex];
      dispatch(setRoomToDraw(selectedRoom));
    },
    [rooms, setRoomToDraw]
  );

  const handlePolygonClick = (
    rooms,
    roomIndex,
    drawMethod = selectedMethod
  ) => {
    setSelectedStaircase(null);

    if (drawMethod === "corner") {
      setClickedOutside(true);
      return;
    }

    const room = rooms[roomIndex];

    setStaircases((prev) => ({
      ...prev,
      [floorName]: prev[floorName]?.map((st) => {
        const offsetVerticesofRoom = calculateOffsetVertices(room.vertices, 8);
        if (isStaircaseInRoom(st, offsetVerticesofRoom)) {
          return { ...st, roomId: room.id, shouldStaircaseVisible: true };
        }
        return { ...st, roomId: null, shouldStaircaseVisible: false };
      }),
    }));

    if (mergeCandidates.length > 0) return;
    setZooming(false);
    // e.stopPropagation();
    setActiveRoomIndex(roomIndex);
    setIsMoving(true);

    dispatchSeletedRoom(roomIndex);

    const centroid = calculateCentroid(room?.vertices || []);
    const newScale = 1.5; // Adjust the scale value as needed for the zoom level
    const newTranslate = {
      x: svgRef.current.clientWidth / 2 - centroid.x * newScale,
      y: svgRef.current.clientHeight / 2 - centroid.y * newScale,
    };

    setScale(newScale);
    setTranslate(newTranslate);
    // setTargetScale(newScale);
    // setTargetTranslate(newTranslate);
    const groupElement = document.getElementById(`group-${roomIndex}`);
    if (groupElement) {
      groupElement.classList.add("zoomable-group");
    }
  };

  const drawRoomWithCornerDefine = useCallback(
    (e) => {
      const newCorner = getMousePosition(e);

      const updatedVertices = [...definedCorners, newCorner];
      setDefinedCorners(updatedVertices);

      // Check if the first and last vertices are close to form a polygon
      if (
        updatedVertices.length > 2 &&
        distanceToLineSegment(
          updatedVertices[0],
          newCorner.x,
          newCorner.y,
          newCorner.x,
          newCorner.y
        ) < Constants.VERTEX_THRESHOLD_RADIUS
      ) {
        const newRoom = {
          id: selectedRoomToDraw.id,
          name: selectedRoomToDraw.name,
          vertices: definedCorners,
          centers: [],
          lockedWalls: {},
          rotationAngle: null,
          hiddenWalls: [],
        };
        dispatch(selectMethod("square"));
        const newRooms = [...rooms, newRoom];
        setRooms(newRooms);
        setDefinedCorners([]);

        const roomIndex = newRooms.length - 1;
        handlePolygonClick(newRooms, roomIndex, "square");
      }
    },
    [
      getMousePosition,
      setRooms,
      definedCorners,
      selectedRoomToDraw,
      selectedMethod,
    ]
  );

  const handleSvgClick = (e) => {
    setSelectedStaircase(null);

    setStaircases((prev) => ({
      ...prev,
      [floorName]: prev[floorName]?.map((st) => {
        return { ...st, shouldStaircaseVisible: true };
      }),
    }));

    if (selectedMethod === "corner" && selectedRoomToDraw) {
      drawRoomWithCornerDefine(e);
      setClickedOutside(false);
      return;
    }

    const pos = getMousePosition(e);

    let isInsideAnyRoom = false;
    rooms.forEach((room, index) => {
      if (isPointInPolygon(pos, room.vertices)) {
        isInsideAnyRoom = true;
      } else {
        const groupElement = document.getElementById(`group-${index}`);
        if (groupElement) {
          groupElement.classList.remove("zoomable-group");
        }
      }
    });

    if (!isInsideAnyRoom) {
      setActiveRoomIndex(null);
      setSelectedWall(null);
      setIsMoving(false);
      setSelectedVertex(null);
      setMergeCandidates([]);
      setIsRotating(false);

      dispatch(setRoomToDraw(null));
      resetScale();
    }

    if (isRotating && activeRoomIndex !== null) {
      const room = rooms[activeRoomIndex];
      const center = calculateCentroid(room.vertices);
      const angle = Math.atan2(pos.y - center.y, pos.x - center.x);
      const initialAngle = angle;

      const rotate = (e) => {
        if (!dragging) return; // Only rotate if dragging
        const newPos = getMousePosition(e);
        const newAngle = Math.atan2(newPos.y - center.y, newPos.x - center.x);
        const angleDiff = newAngle - initialAngle;
        const rotatedVertices = room.vertices.map((vertex) =>
          rotatePoint(vertex, center, angleDiff)
        );
        const updatedRooms = rooms.map((r, i) =>
          i === activeRoomIndex
            ? {
              ...r,
              vertices: rotatedVertices,
              centers: calculateCenters(rotatedVertices),
              rotationAngle: angleDiff,
            }
            : r
        );
        setRooms(updatedRooms);
      };

      const stopRotating = () => {
        window.removeEventListener("mousemove", rotate);
        window.removeEventListener("mouseup", stopRotating);
        window.removeEventListener("touchmove", rotate);
        window.removeEventListener("touchend", stopRotating);
      };

      window.addEventListener("mousemove", rotate);
      window.addEventListener("mouseup", stopRotating);
      window.addEventListener("touchmove", rotate);
      window.addEventListener("touchend", stopRotating);
    }
  };

  const selectWall = (e) => {
    if (activeRoomIndex === null) return;

    const pos = getMousePosition(e);
    let wallSelected = false;
    const selectedDoors = [];
    rooms[activeRoomIndex]?.vertices?.forEach((vertex, vertexIndex) => {
      const nextVertex =
        rooms[activeRoomIndex].vertices[
        (vertexIndex + 1) % rooms[activeRoomIndex].vertices.length
        ];
      if (
        isPointNearLine(
          pos.x,
          pos.y,
          vertex.x,
          vertex.y,
          nextVertex.x,
          nextVertex.y,
          selectionRadius
        )
      ) {
        setSelectedWall({ roomIndex: activeRoomIndex, index: vertexIndex });
        rooms[activeRoomIndex]?.doors?.forEach((door, doorIndex) => {
          if (isDoorOnWall(door, vertex, nextVertex)) {
            selectedDoors.push(doorIndex);
          }
        });

        setSelectedWallDoors(selectedDoors);

        // setOriginalVertices(JSON.parse(JSON.stringify(rooms[activeRoomIndex].vertices)));
        const dx = nextVertex.x - vertex.x;
        const dy = nextVertex.y - vertex.y;
        const t =
          ((pos.x - vertex.x) * dx + (pos.y - vertex.y) * dy) /
          (dx * dx + dy * dy);
        const clampedT = Math.max(0, Math.min(1, t));
        const newClickPosition = {
          x: vertex.x + clampedT * dx,
          y: vertex.y + clampedT * dy,
        };
        setClickPosition(newClickPosition);

        setSelectedVertex(null);
        wallSelected = true;
      }
    });

    if (!wallSelected) {
      setSelectedWall(null);
      setClickPosition(null);
      setSelectedWallDoors([]);
    }
  };
  const isPointInPolygon = (point, vertices) => {
    const { x, y } = point;
    let isInside = false;
    for (let i = 0, j = vertices?.length - 1; i < vertices?.length; j = i++) {
      const xi = vertices[i].x,
        yi = vertices[i].y;
      const xj = vertices[j].x,
        yj = vertices[j].y;
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };

  const onSegment = (p, q, r) => {
    return (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    );
  };

  const orientation = (p, q, r) => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // collinear
    return val > 0 ? 1 : 2; // clock or counterclock wise
  };

  const doIntersect = (p1, q1, p2, q2) => {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special Cases
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
  };
  const tolerance = 1; // Define a tolerance for snapping to the nearest vertex

  const isCloseToVertex = (point, vertices) => {
    return vertices.find((vertex) => {
      const distance = Math.sqrt(
        Math.pow(vertex.x - point.x, 2) + Math.pow(vertex.y - point.y, 2)
      );
      return distance < tolerance;
    });
  };

  const findIntersection = (p1, q1, p2, q2, vertices) => {
    const A1 = q1.y - p1.y;
    const B1 = p1.x - q1.x;
    const C1 = A1 * p1.x + B1 * p1.y;

    const A2 = q2.y - p2.y;
    const B2 = p2.x - q2.x;
    const C2 = A2 * p2.x + B2 * p2.y;

    const determinant = A1 * B2 - A2 * B1;

    if (determinant === 0) {
      // Lines are parallel
      return null;
    } else {
      const x = (B2 * C1 - B1 * C2) / determinant;
      const y = (A1 * C2 - A2 * C1) / determinant;
      const intersection = { x, y };

      // Check if the intersection is close to any of the room vertices
      const closeVertex = isCloseToVertex(intersection, vertices);
      return closeVertex || intersection;
    }
  };

  const drawDimensions = (vertices, roomIndex) => {
    const triangleSize = 3;
    const innerOffset = 4; // Define the inner offset value

    const drawTriangle = (x, y, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return `
      M ${x} ${y}
      L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos
        }
      L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos
        }
      Z
    `;
    };

    return vertices.map((vertex, index) => {
      const nextVertex = vertices[(index + 1) % vertices.length];
      const angle = Math.atan2(
        nextVertex.y - vertex.y,
        nextVertex.x - vertex.x
      );
      const offsetX = dimensionOffset * Math.cos(angle - Math.PI / 2);
      const offsetY = dimensionOffset * Math.sin(angle - Math.PI / 2);

      const innerOffsetX = innerOffset * Math.cos(angle);
      const innerOffsetY = innerOffset * Math.sin(angle);

      // Adjusted start and end points
      const adjustedStart = {
        x: vertex.x + innerOffsetX,
        y: vertex.y + innerOffsetY,
      };
      const adjustedEnd = {
        x: nextVertex.x - innerOffsetX,
        y: nextVertex.y - innerOffsetY,
      };

      // Calculate the adjusted length
      const adjustedLength = Math.sqrt(
        Math.pow(adjustedEnd.x - adjustedStart.x, 2) +
        Math.pow(adjustedEnd.y - adjustedStart.y, 2)
      );

      const midX = (adjustedStart.x + adjustedEnd.x) / 2;
      const midY = (adjustedStart.y + adjustedEnd.y) / 2;

      const { feet, inches } = convertToFeetAndInches(adjustedLength);
      const dimensionText = `${feet}'${inches}"`;
      const textX = midX + offsetX * 1.5;
      const textY = midY + offsetY * 1.5;

      const isLocked =
        rooms[roomIndex].lockedWalls &&
        rooms[roomIndex].lockedWalls[index] !== undefined;

      return (
        <g key={index}>
          {/* Reference dotted lines */}
          <line
            x1={vertex.x + innerOffsetX}
            y1={vertex.y + innerOffsetY}
            x2={vertex.x + innerOffsetX + offsetX}
            y2={vertex.y + innerOffsetY + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2"
          />
          <line
            x1={nextVertex.x - innerOffsetX}
            y1={nextVertex.y - innerOffsetY}
            x2={nextVertex.x - innerOffsetX + offsetX}
            y2={nextVertex.y - innerOffsetY + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2"
          />

          {/* Dimension line */}
          <line
            x1={vertex.x + innerOffsetX + offsetX}
            y1={vertex.y + innerOffsetY + offsetY}
            x2={nextVertex.x - innerOffsetX + offsetX}
            y2={nextVertex.y - innerOffsetY + offsetY}
            stroke="#5c5c5c"
            strokeWidth="1"
          />
          <path
            d={drawTriangle(
              vertex.x + innerOffsetX + offsetX,
              vertex.y + innerOffsetY + offsetY,
              angle + Math.PI
            )}
            fill="#5c5c5c"
          />
          <path
            d={drawTriangle(
              nextVertex.x - innerOffsetX + offsetX,
              nextVertex.y - innerOffsetY + offsetY,
              angle
            )}
            fill="#5c5c5c"
          />
          <text
            x={textX}
            y={textY}
            fontSize="8"
            fill="#5c5c5c"
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {dimensionText}
          </text>
          {isLocked && (
            <svg
              x={textX + 15}
              y={textY - 10}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </g>
      );
    });
  };

  const drawDoorDimensions = (doors) => {
    const triangleSize = 3;

    const drawTriangle = (x, y, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return `
      M ${x} ${y}
      L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos
        }
      L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos
        }
      Z
    `;
    };

    return doors.map((door, index) => {
      const length = Math.sqrt(
        Math.pow(door.end.x - door.start.x, 2) +
        Math.pow(door.end.y - door.start.y, 2)
      );
      const midX = (door.start.x + door.end.x) / 2;
      const midY = (door.start.y + door.end.y) / 2;
      const angle = Math.atan2(
        door.end.y - door.start.y,
        door.end.x - door.start.x
      );
      const offsetX = doorDimensionOffset * Math.cos(angle - Math.PI / 2);
      const offsetY = doorDimensionOffset * Math.sin(angle - Math.PI / 2);

      const { feet, inches } = convertToFeetAndInches(length);
      const dimensionText = `${feet}'${inches}"`;
      const textX = midX + offsetX * 1.5;
      const textY = midY + offsetY * 1.5;

      return (
        <g key={index}>
          {/* Reference dotted lines */}
          <line
            x1={door.start.x}
            y1={door.start.y}
            x2={door.start.x + offsetX}
            y2={door.start.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2"
          />
          <line
            x1={door.end.x}
            y1={door.end.y}
            x2={door.end.x + offsetX}
            y2={door.end.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2"
          />

          {/* Dimension line */}
          <line
            x1={door.start.x + offsetX}
            y1={door.start.y + offsetY}
            x2={door.end.x + offsetX}
            y2={door.end.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="1"
          />
          <path
            d={drawTriangle(
              door.start.x + offsetX,
              door.start.y + offsetY,
              angle + Math.PI
            )}
            fill="#5c5c5c"
          />
          <path
            d={drawTriangle(door.end.x + offsetX, door.end.y + offsetY, angle)}
            fill="#5c5c5c"
          />
          <text
            x={textX}
            y={textY}
            fontSize="8"
            fill="#5c5c5c"
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {dimensionText}
          </text>
        </g>
      );
    });
  };

  const drawGrid = useCallback(() => {
    const gridSize = 40;

    // const svg = svgRef.current;
    // if (!svg) return;
    // const width = svg.clientWidth;
    // const height = svg.clientHeight;
    const width = 1000; // Set a specific width
    const height = 1000; // Set a specific height

    const lines = [];
    const plusIcons = [];
    const dots = [];

    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        plusIcons.push(
          <text
            key={`plus${x}-${y}`}
            x={x}
            y={y}
            fill="gray"
            fontSize="8"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            +
          </text>
        );

        if (x + gridSize <= width) {
          dots.push(
            <circle
              key={`dotx${x}-${y}`}
              cx={x + gridSize / 2}
              cy={y}
              r={0.8}
              fill="gray"
            />
          );
        }
        if (y + gridSize <= height) {
          dots.push(
            <circle
              key={`doty${x}-${y}`}
              cx={x}
              cy={y + gridSize / 2}
              r={0.8}
              fill="gray"
            />
          );
        }
        if (x + gridSize <= width && y + gridSize <= height) {
          dots.push(
            <circle
              key={`dotxy${x}-${y}`}
              cx={x + gridSize / 2}
              cy={y + gridSize / 2}
              r={0.8}
              fill="gray"
            />
          );
        }
      }
    }

    setGridLines([...lines, ...plusIcons, ...dots]);
  }, [selectedFloor]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid, selectedFloor]);

  /**
   * Apply the transition animation while click the polygon
   */
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      staircaseRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      if (activeRoomIndex !== null && zooming) {
        groupRef.current.style.transition = "none";
        staircaseRef.current.style.transition = "none";
      } else {
        if (!panning && !zooming) {
          groupRef.current.style.transition = `transform ${scale === 1 ? "800ms" : "400ms"
            } ease-in-out`;
          staircaseRef.current.style.transition = `transform ${scale === 1 ? "800ms" : "400ms"
            } ease-in-out`;
        } else {
          setZooming(false);
          groupRef.current.style.transition = "none";
          staircaseRef.current.style.transition = "none";
        }
      }
    }
  }, [translate, scale, panning, zooming]);

  useEffect(() => {
    if (selectedWall) {
      const { roomIndex, index } = selectedWall;
      const room = rooms[roomIndex];
      const vertex1 = room.vertices[index];
      const vertex2 = room.vertices[(index + 1) % room.vertices.length];
      const angle = Math.atan2(vertex2.y - vertex1.y, vertex2.x - vertex1.x);

      const length = Math.sqrt(
        Math.pow(vertex2.x - vertex1.x, 2) + Math.pow(vertex2.y - vertex1.y, 2)
      );
      const innerOffsetX = innerOffset * Math.cos(angle);
      const innerOffsetY = innerOffset * Math.sin(angle);

      // Adjusted start and end points
      const adjustedStart = {
        x: vertex1.x + innerOffsetX,
        y: vertex1.y + innerOffsetY,
      };
      const adjustedEnd = {
        x: vertex2.x - innerOffsetX,
        y: vertex2.y - innerOffsetY,
      };
      // Calculate the adjusted length
      const adjustedLength = Math.sqrt(
        Math.pow(adjustedEnd.x - adjustedStart.x, 2) +
        Math.pow(adjustedEnd.y - adjustedStart.y, 2)
      );
      const { feet, inches } = convertToFeetAndInches(adjustedLength);
      setFeet(feet);
      setInches(inches);
    }
  }, [selectedWall]);

  const unlockWall = () => {
    if (selectedWall) {
      const { roomIndex, index } = selectedWall;
      const updatedRooms = rooms.map((room, i) => {
        if (i === roomIndex) {
          const newLockedWalls = { ...room.lockedWalls };
          delete newLockedWalls[index];
          return { ...room, lockedWalls: newLockedWalls };
        }
        return room;
      });
      setRooms(updatedRooms);
    }
  };

  const calculateWallLengths = (vertices) => {
    const lengths = {};
    vertices?.forEach((vertex, index) => {
      const nextVertex = vertices[(index + 1) % vertices.length];
      const length = Math.sqrt(
        Math.pow(nextVertex.x - vertex.x, 2) +
        Math.pow(nextVertex.y - vertex.y, 2)
      );
      lengths[index] = length;
    });
    return lengths;
  };

  const areWallsParallel = (wall1, wall2) => {
    const angle1 = Math.atan2(wall1.y2 - wall1.y1, wall1.x2 - wall1.x1);
    const angle2 = Math.atan2(wall2.y2 - wall2.y1, wall2.x2 - wall2.x1);
    const angleDifference = Math.abs(angle1 - angle2);
    return (
      angleDifference < 0.174533 ||
      Math.abs(angleDifference - Math.PI) < 0.174533
    ); // 10 degrees in radians
  };
  const distanceBetweenLines = (line1, line2) => {
    const distance1 = distanceToLineSegment(
      { x: line1.x1, y: line1.y1 },
      line2.x1,
      line2.y1,
      line2.x2,
      line2.y2
    );
    const distance2 = distanceToLineSegment(
      { x: line1.x2, y: line1.y2 },
      line2.x1,
      line2.y1,
      line2.x2,
      line2.y2
    );
    const distance3 = distanceToLineSegment(
      { x: line2.x1, y: line2.y1 },
      line1.x1,
      line1.y1,
      line1.x2,
      line1.y2
    );
    const distance4 = distanceToLineSegment(
      { x: line2.x2, y: line2.y2 },
      line1.x1,
      line1.y1,
      line1.x2,
      line1.y2
    );

    return Math.min(distance1, distance2, distance3, distance4);
  };

  const highlightNearestParallelWalls = (
    movedRoom,
    movedRoomIndex,
    pos,
    distance
  ) => {
    const nearestWalls = [];
    let minDistance = distance || 20; // Increased distance to detect near walls

    // Iterate over the walls of the moved room
    movedRoom?.vertices?.forEach((vertex, vertexIndex) => {
      const nextVertex =
        movedRoom.vertices[(vertexIndex + 1) % movedRoom.vertices.length];
      const movedWall = {
        x1: vertex.x,
        y1: vertex.y,
        x2: nextVertex.x,
        y2: nextVertex.y,
      };

      // Iterate over all the rooms to find the nearest wall
      rooms.forEach((room, roomIndex) => {
        if (roomIndex !== movedRoomIndex) {
          room?.vertices?.forEach((otherVertex, otherVertexIndex) => {
            const otherNextVertex =
              room.vertices[(otherVertexIndex + 1) % room.vertices.length];
            const otherWall = {
              x1: otherVertex.x,
              y1: otherVertex.y,
              x2: otherNextVertex.x,
              y2: otherNextVertex.y,
            };

            // Check if the walls are parallel
            if (areWallsParallel(movedWall, otherWall)) {
              // Calculate the distance between the walls
              const distance = Math.min(
                distanceBetweenLines(movedWall, otherWall),
                distanceToLineSegment(
                  pos,
                  otherWall.x1,
                  otherWall.y1,
                  otherWall.x2,
                  otherWall.y2
                )
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearestWalls.length = 0; // Clear previous nearest walls
                nearestWalls.push({
                  roomIndex: roomIndex,
                  vertexIndex: otherVertexIndex,
                  movedWall: movedWall,
                  otherWall: otherWall,
                });
              }
            }
          });
        }
      });
    });

    setHighlightedWalls(nearestWalls);
  };
  const highlightNearestVertex = (movedRoom, movedRoomIndex, pos, distance) => {
    const nearestVertices = [];
    let minDistance = distance || 18;

    // Iterate over the vertices of the moved room
    movedRoom?.vertices?.forEach((vertex, vertexIndex) => {
      rooms.forEach((room, roomIndex) => {
        if (roomIndex !== movedRoomIndex) {
          room?.vertices?.forEach((otherVertex, otherVertexIndex) => {
            const distance = Math.sqrt(
              Math.pow(vertex.x - otherVertex.x, 2) +
              Math.pow(vertex.y - otherVertex.y, 2)
            );

            if (distance < minDistance) {
              minDistance = distance;
              // nearestVertices.length = 0; // Clear previous nearest vertices
              nearestVertices.push({
                roomIndex: roomIndex,
                vertexIndex: otherVertexIndex,
                movedVertex: vertex,
                otherVertex: otherVertex,
              });
            }
          });
        }
      });
    });

    setNearestVertices(nearestVertices);
  };

  const mergeRoom = (targetRoomIndex) => {
    if (activeRoomIndex === null) return;

    const mergedVertices = mergeRoomsVertices(
      rooms[activeRoomIndex],
      rooms[targetRoomIndex]
    );

    const mergedDoors = [
      ...rooms[activeRoomIndex]?.doors,
      ...rooms[targetRoomIndex].doors,
    ];

    const updatedRooms = rooms
      .filter(
        (_, index) => index !== activeRoomIndex && index !== targetRoomIndex
      )
      .concat([
        {
          ...rooms[activeRoomIndex],
          vertices: mergedVertices,
          centers: calculateCenters(mergedVertices),
          doors: mergedDoors,
        },
      ]);

    setRooms(updatedRooms);
    setActiveRoomIndex(updatedRooms.length - 1);
    setMergeCandidates([]);
  };

  const shiftVertices = (vertices, otherVertices) => {
    if (vertices.length === 0) return vertices;

    let shiftedVertices = vertices;
    const otherVerticesStrSet = new Set(
      otherVertices.map((v) => JSON.stringify(v))
    );

    let newVertex = shiftedVertices[shiftedVertices.length - 1];
    if (otherVerticesStrSet.has(JSON.stringify(newVertex))) {
      // Rotate by two steps if the newVertex is found
      shiftedVertices = [
        shiftedVertices[shiftedVertices.length - 2],
        shiftedVertices[shiftedVertices.length - 1],
        ...shiftedVertices.slice(0, shiftedVertices.length - 2),
      ];
    } else {
      // Rotate by one step if the newVertex is not found
      shiftedVertices = [
        shiftedVertices[shiftedVertices.length - 1],
        ...shiftedVertices.slice(0, shiftedVertices.length - 1),
      ];
    }

    return shiftedVertices;
  };

  const mergeRoomsVertices = (room1, room2) => {
    const vertices1 = room1.vertices;
    const vertices2 = room2.vertices;

    const combinedVertices = [];
    const intersectionPoints = [];

    // Find and add intersection points
    for (let i = 0; i < vertices1.length; i++) {
      const vertex1 = vertices1[i];
      const nextVertex1 = vertices1[(i + 1) % vertices1.length];

      for (let j = 0; j < vertices2.length; j++) {
        const vertex2 = vertices2[j];
        const nextVertex2 = vertices2[(j + 1) % vertices2.length];

        if (doIntersect(vertex1, nextVertex1, vertex2, nextVertex2)) {
          // When calling findIntersection, pass the vertices of the rooms
          const intersection = findIntersection(
            vertex1,
            nextVertex1,
            vertex2,
            nextVertex2,
            [...vertices1, ...vertices2]
          );
          if (intersection) {
            intersectionPoints.push(intersection);
          }
        }
      }
    }

    // Integrate intersection points into vertices1
    const addIntersections = (vertices, intersections) => {
      const newVertices = [];

      const isBetween = (point, start, end) => {
        if (
          JSON.stringify(point) === JSON.stringify(start) ||
          JSON.stringify(point) === JSON.stringify(end)
        ) {
          return false;
        }

        const crossProduct =
          (point.y - start.y) * (end.x - start.x) -
          (point.x - start.x) * (end.y - start.y);
        if (Math.abs(crossProduct) > Number.EPSILON) return false;

        const dotProduct =
          (point.x - start.x) * (end.x - start.x) +
          (point.y - start.y) * (end.y - start.y);
        if (dotProduct < 0) return false;

        const squaredLength =
          (end.x - start.x) * (end.x - start.x) +
          (end.y - start.y) * (end.y - start.y);
        if (dotProduct > squaredLength) return false;

        return true;
      };

      const distance = (p1, p2) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };

      for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const nextVertex = vertices[(i + 1) % vertices.length];
        newVertices.push(vertex);

        const pointsBetween = intersections.filter((point) =>
          isBetween(point, vertex, nextVertex)
        );

        pointsBetween.sort((a, b) => distance(vertex, a) - distance(vertex, b));

        pointsBetween.forEach((point) => {
          if (
            !newVertices.some(
              (v) => JSON.stringify(v) === JSON.stringify(point)
            )
          ) {
            newVertices.push(point);
          }
        });
      }

      return newVertices;
    };

    const newVertices1 = addIntersections(vertices1, intersectionPoints);
    const newVertices2 = addIntersections(vertices2, intersectionPoints);

    // Combine all vertices
    combinedVertices.push(...newVertices1, ...newVertices2);

    // Remove duplicate vertices
    const uniqueVertices1 = shiftVertices(
      Array.from(new Set(newVertices1.map((v) => JSON.stringify(v)))).map(
        (str) => JSON.parse(str)
      ),
      room2.vertices
    );
    const uniqueVertices2 = shiftVertices(
      Array.from(new Set(newVertices2.map((v) => JSON.stringify(v)))).map(
        (str) => JSON.parse(str)
      ),
      room1.vertices
    );

    // Function to merge vertices from two arrays based on common points
    const mergeVerticesBasedOnCommonPoints = (arr1, arr2) => {
      const mergedArray = [];

      for (let i = 0; i < arr1.length; i++) {
        const vertex1 = arr1[i];
        const vertex1Str = JSON.stringify(vertex1);

        // Check if the current vertex is found in arr2
        const indexInArr2 = arr2.findIndex(
          (vertex2) => JSON.stringify(vertex2) === vertex1Str
        );

        if (indexInArr2 === -1) {
          // If not found in arr2 and not already added in mergedArray, add the vertex to the mergedArray
          if (!mergedArray.some((v) => JSON.stringify(v) === vertex1Str)) {
            mergedArray.push(vertex1);
          }
        } else {
          // If found in arr2, add the current vertex
          const vertex2Str = JSON.stringify(arr2[indexInArr2]);
          if (!mergedArray.some((v) => JSON.stringify(v) === vertex2Str)) {
            mergedArray.push(arr2[indexInArr2]);
          }

          // Check the next vertex in arr2
          const nextIndex = (indexInArr2 + 1) % arr2.length;
          const nextVertexStr = JSON.stringify(arr2[nextIndex]);

          // If the next vertex is found in the intermediate vertices, skip the logic and return to the main loop
          if (arr1.some((vertex) => JSON.stringify(vertex) === nextVertexStr)) {
            continue;
          }

          // Add the remaining vertices from arr2 starting from the common point
          for (let j = nextIndex; j < arr2.length; j++) {
            const vertex2Str = JSON.stringify(arr2[j]);
            if (!mergedArray.some((v) => JSON.stringify(v) === vertex2Str)) {
              mergedArray.push(arr2[j]);
            }
          }
          // Then add the vertices from the start of arr2 to the common point
          for (let j = 0; j < indexInArr2; j++) {
            const vertex2Str = JSON.stringify(arr2[j]);
            if (!mergedArray.some((v) => JSON.stringify(v) === vertex2Str)) {
              mergedArray.push(arr2[j]);
            }
          }
        }
      }

      return mergedArray;
    };

    // Merge vertices from both arrays based on common points
    const combinedVerticesFinal = mergeVerticesBasedOnCommonPoints(
      uniqueVertices1,
      uniqueVertices2
    );
    const finalVertex = Array.from(
      new Set(combinedVerticesFinal.map((v) => JSON.stringify(v)))
    ).map((str) => JSON.parse(str));

    // Sort vertices in clockwise order
    const sortedVertices = sortVerticesClockwise(finalVertex);

    return combinedVerticesFinal;
  };

  const sortVerticesClockwise = (vertices) => {
    const center = calculateCentroid(vertices);

    return vertices.slice().sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x);
      const angleB = Math.atan2(b.y - center.y, b.x - center.x);

      if (angleA === angleB) {
        // This case handles collinear points
        const distanceA = Math.sqrt(
          (a.x - center.x) ** 2 + (a.y - center.y) ** 2
        );
        const distanceB = Math.sqrt(
          (b.x - center.x) ** 2 + (b.y - center.y) ** 2
        );
        return distanceA - distanceB;
      }

      return angleA - angleB;
    });
  };

  const calculateAngle = (point1, point2) => {
    return (
      Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI)
    );
  };

  const drawTextInsideRoom = (
    roomName,
    sqft,
    centroid,
    vertices,
    initialFontSize
  ) => {
    let fontSize = initialFontSize;

    const calculateBoundingBox = (text, x, y, fontSize) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const textElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textElement.setAttribute("x", x);
      textElement.setAttribute("y", y);
      textElement.setAttribute("font-size", fontSize);
      textElement.textContent = text;
      svg.appendChild(textElement);
      document.body.appendChild(svg);
      const bbox = textElement.getBBox();
      document.body.removeChild(svg);
      return bbox;
    };

    const isBoundingBoxInsidePolygon = (bbox, vertices) => {
      const points = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
        { x: bbox.x, y: bbox.y + bbox.height },
      ];

      return points.every((point) => isPointInPolygon(point, vertices));
    };

    const getAdjustedTextPosition = (
      text1,
      text2,
      x,
      y,
      vertices,
      initialFontSize
    ) => {
      let fontSize = initialFontSize;
      let bbox1 = calculateBoundingBox(text1, x, y, fontSize);
      let bbox2 = calculateBoundingBox(text2, x, y + 15, fontSize);

      while (
        !(
          isBoundingBoxInsidePolygon(bbox1, vertices) &&
          isBoundingBoxInsidePolygon(bbox2, vertices)
        ) &&
        fontSize > 6
      ) {
        fontSize -= 1;
        bbox1 = calculateBoundingBox(text1, x, y, fontSize);
        bbox2 = calculateBoundingBox(text2, x, y + 15, fontSize);
      }

      return { x, y, fontSize };
    };

    const {
      x,
      y,
      fontSize: adjustedFontSize,
    } = getAdjustedTextPosition(
      roomName,
      sqft,
      centroid.x,
      centroid.y,
      vertices,
      fontSize
    );

    return (
      <>
        <text
          x={x}
          y={y}
          textAnchor="middle"
          fontSize={adjustedFontSize}
          fill="#000000"
        >
          {roomName}
        </text>
        <text
          x={x}
          y={y + 15}
          textAnchor="middle"
          fontSize={adjustedFontSize - 4}
          fill="#000000"
        >
          {sqft}
        </text>
      </>
    );
  };

  const restoreWall = () => {
    if (selectedWall) {
      const { roomIndex, index } = selectedWall;
      const updatedRooms = rooms.map((room, i) => {
        if (i === roomIndex) {
          const hiddenWalls = room.hiddenWalls ? [...room.hiddenWalls] : [];
          const hiddenIndex = hiddenWalls.indexOf(index);
          if (hiddenIndex !== -1) {
            hiddenWalls.splice(hiddenIndex, 1);
          }
          return { ...room, hiddenWalls };
        }
        return room;
      });

      setRooms(updatedRooms);
      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      }
      setSelectedWall(null);
    }
  };

  const openCancelDrawingRoomModal = () => {
    setCancelDrawingRoomModal(true);
  };

  const closeCancelDrawingRoomModal = () => {
    setCancelDrawingRoomModal(false);
  };

  const cancelDrawingRoomWithCorner = useCallback(() => {
    dispatch(selectMethod("square"));
    setDefinedCorners([]);
    closeCancelDrawingRoomModal();
  }, [setDefinedCorners, selectMethod]);

  useEffect(() => {
    function preventBehavior(e) {
      e.preventDefault();
    }
    setRedoStack([]);
    setUndoStack([]);

    document.addEventListener("touchmove", preventBehavior, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventBehavior);
    };
  }, []);

  const shiftRoomLayerUp = () => {
    if (activeRoomIndex !== null && activeRoomIndex > 0) {
      const updatedRooms = [...rooms];
      const temp = updatedRooms[activeRoomIndex];
      updatedRooms[activeRoomIndex] = updatedRooms[activeRoomIndex - 1];
      updatedRooms[activeRoomIndex - 1] = temp;
      setRooms(updatedRooms);

      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      }
      setActiveRoomIndex(activeRoomIndex - 1);
    }
  };

  console.log("redoStack", redoStack, undoStack);

  const shiftRoomLayerDown = () => {
    if (activeRoomIndex !== null && activeRoomIndex < rooms.length - 1) {
      const updatedRooms = [...rooms];
      const temp = updatedRooms[activeRoomIndex];
      updatedRooms[activeRoomIndex] = updatedRooms[activeRoomIndex + 1];
      updatedRooms[activeRoomIndex + 1] = temp;

      if (!_.isEqual(updatedRooms, oldRooms)) {
        handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms
      }
      setRooms(updatedRooms);
      setActiveRoomIndex(activeRoomIndex + 1);
    }
  };

  const addDoor = () => {
    if (activeRoomIndex === null) return; // Ensure there's an active room selected

    const room = rooms[activeRoomIndex];

    const addDoorToWall = (vertex1, vertex2, roomIndex) => {
      const doorLengthInFeet = 40 / 12; // 2 feet 7 inches in feet
      const doorLengthInPixels = ((doorLengthInFeet * 12) / 20) * 20; // Convert to pixels (assuming grid size of 20 pixels)

      const dx = vertex2.x - vertex1.x;
      const dy = vertex2.y - vertex1.y;
      const wallLength = Math.sqrt(dx * dx + dy * dy);

      // Calculate door position on the wall
      const ratio = doorLengthInPixels / wallLength;
      const doorStartX = vertex1.x + (dx * (1 - ratio)) / 2;
      const doorStartY = vertex1.y + (dy * (1 - ratio)) / 2;
      const doorEndX = vertex1.x + (dx * (1 + ratio)) / 2;
      const doorEndY = vertex1.y + (dy * (1 + ratio)) / 2;

      // Add the new door to the room's doors array
      const updatedRooms = rooms.map((r, i) =>
        i === roomIndex
          ? {
            ...r,
            doors: [
              ...(r.doors || []),
              {
                start: { x: doorStartX, y: doorStartY },
                end: { x: doorEndX, y: doorEndY },
              },
            ],
          }
          : r
      );

      setRooms(updatedRooms);
      setSelectedDoor({
        roomIndex,
        doorIndex: updatedRooms[roomIndex].doors.length - 1,
      }); // Select the newly added door
      setDraggingDoor(true); // Start dragging the door
    };

    if (!selectedWall) {
      // Add door to the first wall of the active room
      const vertex1 = room.vertices[0];
      const vertex2 = room.vertices[1];
      addDoorToWall(vertex1, vertex2, activeRoomIndex);
    } else {
      // Use the selected wall
      const { roomIndex, index } = selectedWall;
      const room = rooms[roomIndex];
      const vertex1 = room.vertices[index];
      const vertex2 = room.vertices[(index + 1) % room.vertices.length];
      addDoorToWall(vertex1, vertex2, roomIndex);
    }
  };
  const drawTriangle = (x, y, angle) => {
    const triangleSize = 3;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return `
      M ${x} ${y}
      L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos
      }
      L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos
      }
      Z
    `;
  };

  const handleDeleteDoor = (roomIndex, doorIndex) => {
    const updatedRooms = rooms.map((room, rIndex) => {
      if (rIndex === roomIndex) {
        const updatedDoors = room.doors.filter(
          (_, dIndex) => dIndex !== doorIndex
        );
        return { ...room, doors: updatedDoors };
      }
      return room;
    });

    setRooms(updatedRooms);
    setSelectedDoor(null);
  };

  const addStaircase = () => {
    const staircase = {
      x: 10,
      y: 10,
      width: 80,
      height: 180,
      steps: 8,
      rotationAngle: 0,
      floorName: floorName,
      roomId: null,
      shouldStaircaseVisible: true,
    };
    setStaircases((prev) => ({
      ...prev,
      [floorName]: prev[floorName]
        ? [...prev[floorName], staircase]
        : [staircase],
    }));
  };

  const deleteStaircase = useCallback(() => {
    const prevStaircases = { ...staircases };
    prevStaircases?.[floorName]?.splice(selectedStaircase.index, 1);
    setStaircases(prevStaircases);
    setSelectedStaircase(null);
  }, [selectedStaircase, staircases, setStaircases]);

  const onSelect = (st) => {
    console.log(st, "st**");
    if (st.roomId) {
      if (activeRoomIndex != null) {
        setSelectedStaircase(st);
      }
    } else {
      setSelectedStaircase(st);
      setActiveRoomIndex(null);
      dispatch(setRoomToDraw(null));
    }
    setSelectedWall(null);
  };

  const floorWiseStaircases = useMemo(() => {
    return staircases[floorName];
  }, [staircases, floorName]);

  console.log(floorWiseStaircases, "floorWiseStaircases");

  return (
    <>
      {rooms?.length > 0 || selectedMethod === "corner" ? (
        <>
          <div
            style={{ height: "100%", position: "relative", width: "100%" }}
            onTouchStart={(e) => {
              handleMouseDown(e);
              handleTouchStart(e);
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => {
              handleMouseMove(e);
              handleTouchMove(e);
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={(e) => {
              handleMouseUp(e);
              handleTouchEnd(e);
            }}
            onWheel={handleWheel}
            onClick={handleSvgClick}
            onTouchCancel={handleMouseUp}
          >
            <svg
              ref={svgRef}
              width={"100%"}
              height={"100%"}
              style={{
                // border: "1px solid #000",
                overflow: "hidden",
                userSelect: "none",
              }}
            >
              {gridLines}
              {selectedMethod === "corner" && (
                <RoomWithCorners
                  definedCorners={definedCorners}
                  clickedOutside={clickedOutside}
                />
              )}

              <defs>
                {rooms.map((room, roomIndex) => {
                  // Create a composite mask that excludes the current room
                  const otherRooms = rooms.filter(
                    (_, index) => index !== roomIndex
                  );

                  return (
                    <mask id={`maskRoom-${roomIndex}`} key={roomIndex}>
                      <rect
                        width="350%"
                        height="350%"
                        fill="white"
                        x="-120%"
                        y="-120%"
                      />
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
                  const offsetVertices = calculateOffsetVertices(
                    room.vertices,
                    8
                  ); // Adjust the offset value as needed
                  const verticeCircle = calculateOffsetVertices(
                    room.vertices,
                    -4
                  ); // Adjust the offset value as needed

                  // Adjust the offset value as needed
                  return (
                    <g
                      key={roomIndex}
                      id={`group-${roomIndex}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePolygonClick(rooms, roomIndex);
                      }}
                      transform={
                        activeRoomIndex === roomIndex && isRotating
                          ? `rotate(${room.rotationAngle || 0} ${centroid.x} ${centroid.y
                          })`
                          : ""
                      }
                    >
                      <polygon
                        points={offsetVertices
                          .map((v) => `${v.x},${v.y}`)
                          .join(" ")}
                        fillOpacity={0}
                        stroke={
                          currentPoint?.type === "room" &&
                            currentPoint?.roomIndex === roomIndex
                            ? ""
                            : activeRoomIndex !== null
                              ? "#B7B7B7"
                              : "#000000"
                        }
                        strokeWidth="8"
                        mask={`url(#maskRoom-${roomIndex})`}
                      />

                      <polygon
                        points={room?.vertices
                          ?.map((v) => `${v.x},${v.y}`)
                          .join(" ")}
                        fill={"#F5F5F5"}
                        // fill={`url(#${patternId})`}
                        fillOpacity={activeRoomIndex === roomIndex ? 0.5 : 1}
                        stroke={
                          currentPoint?.type === "room" &&
                            currentPoint?.roomIndex === roomIndex
                            ? "#A0DEFF"
                            : activeRoomIndex !== null &&
                              activeRoomIndex !== roomIndex
                              ? "#B7B7B7"
                              : "#000000"
                        }
                        strokeWidth="8"
                      />
                      {room?.vertices?.map((vertex, vertexIndex) => {
                        const isSelectedWall =
                          selectedWall &&
                          selectedWall.roomIndex === roomIndex &&
                          selectedWall.index === vertexIndex;

                        const isHighlightedWall = highlightedWalls.some(
                          (wall) =>
                            wall.roomIndex === roomIndex &&
                            wall.vertexIndex === vertexIndex
                        );

                        const isHiddenWall =
                          room.hiddenWalls &&
                          room.hiddenWalls.includes(vertexIndex);
                        const nextVertex =
                          room?.vertices[
                          (vertexIndex + 1) % room.vertices.length
                          ];
                        const dx = nextVertex.x - vertex.x;
                        const dy = nextVertex.y - vertex.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const unitDx = dx / length;
                        const unitDy = dy / length;
                        const halfThickness = 4; // Half the wall thickness, adjust if needed

                        const reducedStartX = vertex.x + unitDx * halfThickness;
                        const reducedStartY = vertex.y + unitDy * halfThickness;
                        const reducedEndX =
                          nextVertex.x - unitDx * halfThickness;
                        const reducedEndY =
                          nextVertex.y - unitDy * halfThickness;

                        return (
                          <g key={vertexIndex}>
                            {isSelectedWall && isHiddenWall && (
                              <path
                                d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}
                                stroke="white"
                                strokeWidth={"8"}
                              />
                            )}
                            <path
                              d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}
                              stroke={
                                isSelectedWall
                                  ? "#A0DEFF"
                                  : isHighlightedWall
                                    ? "#40A578"
                                    : isHiddenWall
                                      ? "#FFFFFF"
                                      : currentPoint?.type === "room" &&
                                        currentPoint?.roomIndex === roomIndex
                                        ? "#A0DEFF"
                                        : activeRoomIndex !== null &&
                                          activeRoomIndex !== roomIndex
                                          ? "#B7B7B7"
                                          : "black"
                              }
                              strokeWidth={
                                isSelectedWall || isHighlightedWall
                                  ? "8"
                                  : isHiddenWall
                                    ? "8"
                                    : "8"
                              }
                              strokeDasharray={
                                isSelectedWall && isHiddenWall ? "8, 5" : ""
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                selectWall(e);
                              }}
                            />
                          </g>
                        );
                      })}
                      {activeRoomIndex === roomIndex &&
                        room?.doors &&
                        drawDoorDimensions(room?.doors)}

                      {activeRoomIndex === roomIndex &&
                        room?.vertices &&
                        room.vertices.map((vertex, vertexIndex) => {
                          const nextVertexIndex =
                            (vertexIndex + 1) % room.vertices.length;
                          const nextVertex = room.vertices[nextVertexIndex];

                          // Function to check if the door is on the wall segment
                          const isDoorOnSegment = (door, vertex1, vertex2) => {
                            const isBetween = (value, min, max) =>
                              value >= min && value <= max;

                            // Check if door's start and end points are within the bounding box of the wall segment
                            return (
                              isBetween(
                                door.start.x,
                                Math.min(vertex1.x, vertex2.x),
                                Math.max(vertex1.x, vertex2.x)
                              ) &&
                              isBetween(
                                door.start.y,
                                Math.min(vertex1.y, vertex2.y),
                                Math.max(vertex1.y, vertex2.y)
                              ) &&
                              isBetween(
                                door.end.x,
                                Math.min(vertex1.x, vertex2.x),
                                Math.max(vertex1.x, vertex2.x)
                              ) &&
                              isBetween(
                                door.end.y,
                                Math.min(vertex1.y, vertex2.y),
                                Math.max(vertex1.y, vertex2.y)
                              )
                            );
                          };

                          // // Find doors on this wall segment
                          // const doorsOnSegment = room?.doors?.filter((door) => {
                          //   // First, check if the door is on the segment
                          //   if (isDoorOnSegment(door, vertex, nextVertex)) {
                          //     return (
                          //       (door.start.x >= Math.min(vertex.x, nextVertex.x) &&
                          //         door.start.x <= Math.max(vertex.x, nextVertex.x) &&
                          //         door.start.y >= Math.min(vertex.y, nextVertex.y) &&
                          //         door.start.y <= Math.max(vertex.y, nextVertex.y)) ||
                          //       (door.end.x >= Math.min(vertex.x, nextVertex.x) &&
                          //         door.end.x <= Math.max(vertex.x, nextVertex.x) &&
                          //         door.end.y >= Math.min(vertex.y, nextVertex.y) &&
                          //         door.end.y <= Math.max(vertex.y, nextVertex.y))
                          //     );
                          //   }
                          //   return false;
                          // });
                          // console.log("doorsOnSegment", doorsOnSegment, vertex)
                          // // Only show dimensions if there are doors on the segment
                          // if (doorsOnSegment?.length === 0 || !room?.doors || room?.doors?.length === 0) {
                          //   return null;
                          // }
                          // Find doors on this wall segment
                          const doorsOnSegment = room?.doors?.filter((door) =>
                            isDoorOnWall(door, vertex, nextVertex)
                          );

                          // Only show dimensions if there are doors on the segment
                          if (
                            doorsOnSegment?.length === 0 ||
                            !room?.doors ||
                            room?.doors?.length === 0
                          ) {
                            return null;
                          }

                          // Split wall into segments based on doors
                          const segments = [];
                          if (doorsOnSegment?.length > 0) {
                            doorsOnSegment.forEach((door, index) => {
                              if (index === 0) {
                                segments.push({
                                  start: vertex,
                                  end: door.start,
                                });
                              }
                              if (index === doorsOnSegment.length - 1) {
                                segments.push({
                                  start: door.end,
                                  end: nextVertex,
                                });
                              }
                              if (index > 0) {
                                segments.push({
                                  start: doorsOnSegment[index - 1].end,
                                  end: door.start,
                                });
                              }
                            });
                          } else {
                            segments.push({
                              start: vertex,
                              end: nextVertex,
                            });
                          }

                          return segments?.map((segment, segmentIndex) => {
                            const angle = Math.atan2(
                              segment.end.y - segment.start.y,
                              segment.end.x - segment.start.x
                            );
                            const offsetX =
                              doorDimensionOffset *
                              Math.cos(angle - Math.PI / 2);
                            const offsetY =
                              doorDimensionOffset *
                              Math.sin(angle - Math.PI / 2);

                            const innerOffset = 4; // Define the inner offset value
                            const innerOffsetX = innerOffset * Math.cos(angle);
                            const innerOffsetY = innerOffset * Math.sin(angle);

                            // Adjusted start and end points
                            const adjustedStart = {
                              x:
                                segment.start.x +
                                (segment.start === vertex ? innerOffsetX : 0),
                              y:
                                segment.start.y +
                                (segment.start === vertex ? innerOffsetY : 0),
                            };
                            const adjustedEnd = {
                              x:
                                segment.end.x -
                                (segment.end === nextVertex ? innerOffsetX : 0),
                              y:
                                segment.end.y -
                                (segment.end === nextVertex ? innerOffsetY : 0),
                            };

                            // Calculate the adjusted length
                            const adjustedLength = Math.sqrt(
                              Math.pow(adjustedEnd.x - adjustedStart.x, 2) +
                              Math.pow(adjustedEnd.y - adjustedStart.y, 2)
                            );

                            const midX = (adjustedStart.x + adjustedEnd.x) / 2;
                            const midY = (adjustedStart.y + adjustedEnd.y) / 2;

                            const { feet, inches } =
                              convertToFeetAndInches(adjustedLength);
                            const dimensionText = `${feet}'${inches}"`;
                            const textX = midX + offsetX * 1.5;
                            const textY = midY + offsetY * 1.5;

                            // Ensure correct offset only from vertices
                            const isAdjustedFromVertex = (point, vertex) =>
                              point.x === vertex.x && point.y === vertex.y;

                            return (
                              <g key={`${vertexIndex}-${segmentIndex}`}>
                                {/* Reference dotted lines */}
                                <line
                                  x1={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.x
                                      : segment.start.x
                                  }
                                  y1={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.y
                                      : segment.start.y
                                  }
                                  x2={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.x + offsetX
                                      : segment.start.x + offsetX
                                  }
                                  y2={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.y + offsetY
                                      : segment.start.y + offsetY
                                  }
                                  stroke="#5c5c5c"
                                  strokeWidth="0.5"
                                  strokeDasharray="1.5,1.2"
                                />
                                <line
                                  x1={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.x
                                      : segment.end.x
                                  }
                                  y1={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.y
                                      : segment.end.y
                                  }
                                  x2={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.x + offsetX
                                      : segment.end.x + offsetX
                                  }
                                  y2={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.y + offsetY
                                      : segment.end.y + offsetY
                                  }
                                  stroke="#5c5c5c"
                                  strokeWidth="0.5"
                                  strokeDasharray="1.5,1.2"
                                />

                                {/* Dimension line */}
                                <line
                                  x1={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.x + offsetX
                                      : segment.start.x + offsetX
                                  }
                                  y1={
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.y + offsetY
                                      : segment.start.y + offsetY
                                  }
                                  x2={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.x + offsetX
                                      : segment.end.x + offsetX
                                  }
                                  y2={
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.y + offsetY
                                      : segment.end.y + offsetY
                                  }
                                  stroke="#5c5c5c"
                                  strokeWidth="1"
                                />
                                <path
                                  d={drawTriangle(
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.x + offsetX
                                      : segment.start.x + offsetX,
                                    isAdjustedFromVertex(segment.start, vertex)
                                      ? adjustedStart.y + offsetY
                                      : segment.start.y + offsetY,
                                    angle + Math.PI
                                  )}
                                  fill="#5c5c5c"
                                />
                                <path
                                  d={drawTriangle(
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.x + offsetX
                                      : segment.end.x + offsetX,
                                    isAdjustedFromVertex(
                                      segment.end,
                                      nextVertex
                                    )
                                      ? adjustedEnd.y + offsetY
                                      : segment.end.y + offsetY,
                                    angle
                                  )}
                                  fill="#5c5c5c"
                                />
                                <text
                                  x={textX}
                                  y={textY}
                                  fontSize="8"
                                  fill="#5c5c5c"
                                  alignmentBaseline="middle"
                                  textAnchor="middle"
                                >
                                  {dimensionText}
                                </text>
                              </g>
                            );
                          });
                        })}

                      {offsetVertices.map((vertex, vertexIndex) => {
                        const isHiddenWall =
                          room.hiddenWalls &&
                          room.hiddenWalls.includes(vertexIndex);
                        const nextVertex =
                          offsetVertices[
                          (vertexIndex + 1) % offsetVertices.length
                          ];
                        const dx = nextVertex.x - vertex.x;
                        const dy = nextVertex.y - vertex.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const unitDx = dx / length;
                        const unitDy = dy / length;
                        const halfThickness = 4; // Half the wall thickness, adjust if needed

                        const reducedStartX = vertex.x + unitDx * halfThickness;
                        const reducedStartY = vertex.y + unitDy * halfThickness;
                        const reducedEndX =
                          nextVertex.x - unitDx * halfThickness;
                        const reducedEndY =
                          nextVertex.y - unitDy * halfThickness;

                        return (
                          <g key={vertexIndex}>
                            {isHiddenWall && (
                              <path
                                d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}
                                stroke="white"
                                strokeWidth={"8"}
                              />
                            )}
                          </g>
                        );
                      })}

                      {drawTextInsideRoom(
                        room.name,
                        `${calculateArea(room?.vertices, room?.doors).toFixed(
                          2
                        )} sq ft`,
                        centroid,
                        room.vertices,
                        16
                      )}

                      {activeRoomIndex === roomIndex &&
                        drawDimensions(room.vertices, roomIndex)}
                      {activeRoomIndex === roomIndex &&
                        verticeCircle.map((vertex, vertexIndex) => (
                          <g key={vertexIndex}>
                            <circle
                              cx={vertex.x}
                              cy={vertex.y}
                              r={selectionRadius - 1} // Reduce the size of the circle by subtracting 2 from selectionRadius
                              fill={
                                hoveredVertex &&
                                  hoveredVertex.roomIndex !== roomIndex &&
                                  Math.abs(hoveredVertex.x - vertex.x) <
                                  selectionRadius &&
                                  Math.abs(hoveredVertex.y - vertex.y) <
                                  selectionRadius
                                  ? "#9DDE8B"
                                  : selectedVertex &&
                                    selectedVertex.roomIndex === roomIndex &&
                                    selectedVertex.index === vertexIndex
                                    ? "#FF0000"
                                    : "#FFFFFF"
                              }
                              stroke="#000000"
                              strokeWidth="1"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                const pos = getMousePosition(e);
                                setDragging(true);
                                setCurrentPoint({
                                  type: "vertex",
                                  roomIndex,
                                  index: vertexIndex,
                                  offsetX: pos.x - vertex.x,
                                  offsetY: pos.y - vertex.y,
                                });
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                const pos = getMousePosition(e);
                                setDragging(true);
                                setCurrentPoint({
                                  type: "vertex",
                                  roomIndex,
                                  index: vertexIndex,
                                  offsetX: pos.x - vertex.x,
                                  offsetY: pos.y - vertex.y,
                                });
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setSelectedVertex({
                                  roomIndex,
                                  index: vertexIndex,
                                });
                              }}
                            />
                            {draggingIconPosition && (
                              <svg
                                x={draggingIconPosition?.x - 30}
                                y={draggingIconPosition?.y - 30}
                                width="60"
                                height="60"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill={draggingIconColor}
                                  d="M238.51,126.95l-21.19-29.92c-1.02-1.44-3.29-.72-3.29,1.05v13.11h-69.22V41.97h13.11c1.76,0,2.49-2.27,1.05-3.29l-29.92-21.19c-.63-.44-1.47-.44-2.09,0l-29.92,21.19c-1.44,1.02-.72,3.29,1.05,3.29h13.11v69.22H41.97v-13.11c0-1.76-2.27-2.49-3.29-1.05l-21.19,29.92c-.44.63-.44,1.47,0,2.09l21.19,29.92c1.02,1.44,3.29.72,3.29-1.05v-13.11h69.22v69.22h-13.11c-1.76,0-2.49,2.27-1.05,3.29l29.92,21.19c.63.44,1.47.44,2.09,0l29.92-21.19c1.44-1.02.72-3.29-1.05-3.29h-13.11v-69.22h69.22v13.11c0,1.76,2.27,2.49,3.29,1.05l21.19-29.92c.44-.63.44-1.47,0-2.09Z"
                                />
                              </svg>
                            )}
                          </g>
                        ))}

                      {mergeCandidates.length > 0 &&
                        activeRoomIndex === roomIndex && (
                          <svg
                            x={centroid.x - 20}
                            y={centroid.y - 20}
                            width="40"
                            height="40"
                            viewBox="0 0 256 256"
                            fill="#d80e0e"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                fill="#d80e0e"
                                d="M128,99.45c-15.77,0-28.55,12.78-28.55,28.55s12.78,28.55,28.55,28.55,28.55-12.78,28.55-28.55-12.78-28.55-28.55-28.55Z"
                              />
                              <path
                                fill="#d80e0e"
                                d="M128,57.37c-38.94,0-70.63,31.68-70.63,70.63s31.68,70.63,70.63,70.63,70.63-31.68,70.63-70.63-31.68-70.63-70.63-70.63ZM128,179.69c-28.55,0-51.69-23.14-51.69-51.69s23.14-51.69,51.69-51.69,51.69,23.14,51.69,51.69-23.14,51.69-51.69,51.69Z"
                              />
                              <path
                                fill="#d80e0e"
                                d="M128,17.1c-61.15,0-110.9,49.75-110.9,110.9s49.75,110.9,110.9,110.9,110.9-49.75,110.9-110.9S189.15,17.1,128,17.1ZM128,219.96c-50.79,0-91.96-41.17-91.96-91.96s41.17-91.96,91.96-91.96,91.96,41.17,91.96,91.96-41.17,91.96-91.96,91.96Z"
                              />
                            </g>
                          </svg>
                        )}
                      {!isRotating &&
                        !draggingIconPosition &&
                        isMoving &&
                        mergeCandidates?.length == 0 &&
                        activeRoomIndex === roomIndex && (
                          <svg
                            x={centroid.x - 30}
                            y={centroid.y - 30}
                            width="60"
                            height="60"
                            viewBox="0 0 256 256"
                            fill="#3a80c7"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const pos = getMousePosition(e);
                              setDragging(true);
                              setDraggingMoveIcon(true);
                              setCurrentPoint({
                                type: "room",
                                roomIndex,
                                offsetX: pos.x - centroid.x,
                                offsetY: pos.y - centroid.y,
                              });
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              const pos = getMousePosition(e);
                              setDragging(true);
                              setDraggingMoveIcon(true);
                              setCurrentPoint({
                                type: "room",
                                roomIndex,
                                offsetX: pos.x - centroid.x,
                                offsetY: pos.y - centroid.y,
                              });
                            }}
                          >
                            <defs>
                              <style>
                                {`.cls-10 { fill: #3a80c7; stroke-width: 0px; }`}
                              </style>
                            </defs>
                            <path
                              className="cls-10"
                              d="M238.51,126.95l-21.19-29.92c-1.02-1.44-3.29-.72-3.29,1.05v13.11h-69.22V41.97h13.11c1.76,0,2.49-2.27,1.05-3.29l-29.92-21.19c-.63-.44-1.47-.44-2.09,0l-29.92,21.19c-1.44,1.02-.72,3.29,1.05,3.29h13.11v69.22H41.97v-13.11c0-1.76-2.27-2.49-3.29-1.05l-21.19,29.92c-.44.63-.44,1.47,0,2.09l21.19,29.92c1.02,1.44,3.29.72,3.29-1.05v-13.11h69.22v69.22h-13.11c-1.76,0-2.49,2.27-1.05,3.29l29.92,21.19c.63.44,1.47.44,2.09,0l29.92-21.19c1.44-1.02.72-3.29-1.05-3.29h-13.11v-69.22h69.22v13.11c0,1.76,2.27,2.49,3.29,1.05l21.19-29.92c.44-.63.44-1.47,0-2.09Z"
                            />
                          </svg>
                        )}
                      {activeRoomIndex === roomIndex && isRotating && (
                        <RotationIcon
                          x={
                            centroid.x +
                            50 * Math.cos(room.rotationAngle || 0) -
                            30
                          }
                          y={
                            centroid.y +
                            50 * Math.sin(room.rotationAngle || 0) -
                            30
                          }
                          fill="#3a80c7"
                          transform={`rotate(${(room.rotationAngle || 0) * (180 / Math.PI) + 90
                            } ${centroid.x} ${centroid.y})`}
                          rotationIconColor={rotationIconColor}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const pos = getMousePosition(e);
                            setDragging(true);
                            setCurrentPoint({
                              type: "rotate",
                              roomIndex,
                              offsetX: pos.x - centroid.x,
                              offsetY: pos.y - centroid.y,
                            });
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            const pos = getMousePosition(e);
                            setDragging(true);
                            setCurrentPoint({
                              type: "rotate",
                              roomIndex,
                              offsetX: pos.x - centroid.x,
                              offsetY: pos.y - centroid.y,
                            });
                          }}
                          iconTransform={`rotate(${(room.rotationAngle || 0) * (180 / Math.PI)
                            } 128 128)`}
                        />
                      )}
                    </g>
                  );
                })}
                {rooms?.map((room, roomIndex) => {
                  const centroid = calculateCentroid(room.vertices);

                  return (
                    <g
                      key={roomIndex}
                      id={`group-${roomIndex}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePolygonClick(rooms, roomIndex);
                      }}
                      transform={
                        activeRoomIndex === roomIndex && isRotating
                          ? `rotate(${room.rotationAngle || 0} ${centroid.x} ${centroid.y
                          })`
                          : ""
                      }
                    >
                      {" "}
                      {room?.doors &&
                        room.doors.map((door, doorIndex) => {
                          const isSelected =
                            selectedDoor &&
                            selectedDoor.roomIndex === roomIndex &&
                            selectedDoor.doorIndex === doorIndex;

                          // Calculate direction vector
                          const direction = {
                            x: door.end.x - door.start.x,
                            y: door.end.y - door.start.y,
                          };

                          // Calculate the length of the direction vector
                          const length = Math.sqrt(
                            direction.x ** 2 + direction.y ** 2
                          );

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

                          // Calculate the center of the door
                          const centerX = (door.start.x + door.end.x) / 2;
                          const centerY = (door.start.y + door.end.y) / 2;

                          // Calculate the angle of rotation in degrees
                          const angle =
                            Math.atan2(direction.y, direction.x) *
                            (180 / Math.PI);

                          // Calculate the width and height of the rectangle
                          const margin = 8; // Margin amount on each side
                          const rectWidth = length + margin * 2;
                          const rectHeight = 16; // Adjust as needed

                          return (
                            <g
                              key={doorIndex}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setSelectedDoor({ roomIndex, doorIndex });
                                setDraggingDoor(true);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                setSelectedDoor({ roomIndex, doorIndex });
                                setDraggingDoor(true);
                              }}
                            >
                              {isSelected && (
                                <rect
                                  x={centerX - rectWidth / 2}
                                  y={centerY - rectHeight / 2}
                                  width={rectWidth}
                                  height={rectHeight}
                                  fill="none"
                                  stroke="#3a80c7"
                                  strokeWidth="1"
                                  transform={`rotate(${angle}, ${centerX}, ${centerY})`}
                                />
                              )}
                              <line
                                x1={door.start.x}
                                y1={door.start.y}
                                x2={door.end.x}
                                y2={door.end.y}
                                stroke={
                                  activeRoomIndex !== null ? "white" : "#F5F5F5"
                                }
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
                    </g>
                  );
                })}
                {clickPosition && selectedWall && (
                  <circle
                    cx={clickPosition.x}
                    cy={clickPosition.y}
                    r={redDotRadius}
                    fill="#7469B6"
                    stroke="black"
                    strokeWidth="0.3"
                  />
                )}

                {highlightedWalls.length > 0 && elasticLine && (
                  <>
                    {highlightedWalls.map((highlightedWall, index) => {
                      const { movedWall, otherWall } = highlightedWall;

                      // Define a small offset value
                      const offset = 20;

                      // Function to adjust points slightly away along the wall
                      const adjustPointOnWall = (x1, y1, x2, y2, offset) => {
                        const length = Math.sqrt(
                          (x2 - x1) ** 2 + (y2 - y1) ** 2
                        );
                        const unitDx = (x2 - x1) / length;
                        const unitDy = (y2 - y1) / length;
                        return {
                          x1: x1 + unitDx * offset,
                          y1: y1 + unitDy * offset,
                          x2: x2 - unitDx * offset,
                          y2: y2 - unitDy * offset,
                        };
                      };

                      // Adjust points slightly away from the original vertices along the wall direction
                      const adjustedMovedWall = adjustPointOnWall(
                        movedWall.x1,
                        movedWall.y1,
                        movedWall.x2,
                        movedWall.y2,
                        offset
                      );
                      const adjustedOtherWall = adjustPointOnWall(
                        otherWall.x1,
                        otherWall.y1,
                        otherWall.x2,
                        otherWall.y2,
                        offset
                      );

                      // Define the four points of the polygon
                      const polygonPoints = [
                        { x: adjustedMovedWall.x1, y: adjustedMovedWall.y1 },
                        { x: adjustedMovedWall.x2, y: adjustedMovedWall.y2 },
                        { x: adjustedOtherWall.x1, y: adjustedOtherWall.y1 },
                        { x: adjustedOtherWall.x2, y: adjustedOtherWall.y2 },
                      ];

                      // Define the path data for the curved polygon
                      const pathData = `
      M ${polygonPoints[0].x},${polygonPoints[0].y}
      Q ${(polygonPoints[0].x + polygonPoints[1].x) / 2},${(polygonPoints[0].y + polygonPoints[1].y) / 2
                        } ${polygonPoints[1].x},${polygonPoints[1].y}
      L ${polygonPoints[2].x},${polygonPoints[2].y}
      Q ${(polygonPoints[2].x + polygonPoints[3].x) / 2},${(polygonPoints[2].y + polygonPoints[3].y) / 2
                        } ${polygonPoints[3].x},${polygonPoints[3].y}
      Z
    `;

                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill="rgba(157, 222, 139, 0.5)"
                          stroke="green"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </>
                )}

                {highlightedWalls.length > 0 && selectedWall && (
                  <>
                    {highlightedWalls.map((highlightedWall, index) => {
                      const { movedWall, otherWall } = highlightedWall;

                      // Define a small offset value
                      const offset = 20;

                      // Function to adjust points slightly away along the wall
                      const adjustPointOnWall = (x1, y1, x2, y2, offset) => {
                        const length = Math.sqrt(
                          (x2 - x1) ** 2 + (y2 - y1) ** 2
                        );
                        const unitDx = (x2 - x1) / length;
                        const unitDy = (y2 - y1) / length;
                        return {
                          x1: x1 + unitDx * offset,
                          y1: y1 + unitDy * offset,
                          x2: x2 - unitDx * offset,
                          y2: y2 - unitDy * offset,
                        };
                      };

                      // Adjust points slightly away from the original vertices along the wall direction
                      const adjustedMovedWall = adjustPointOnWall(
                        movedWall.x1,
                        movedWall.y1,
                        movedWall.x2,
                        movedWall.y2,
                        offset
                      );
                      const adjustedOtherWall = adjustPointOnWall(
                        otherWall.x1,
                        otherWall.y1,
                        otherWall.x2,
                        otherWall.y2,
                        offset
                      );

                      // Define the four points of the polygon
                      const polygonPoints = [
                        { x: adjustedMovedWall.x1, y: adjustedMovedWall.y1 },
                        { x: adjustedMovedWall.x2, y: adjustedMovedWall.y2 },
                        { x: adjustedOtherWall.x1, y: adjustedOtherWall.y1 },
                        { x: adjustedOtherWall.x2, y: adjustedOtherWall.y2 },
                      ];

                      // Define the path data for the curved polygon
                      const pathData = `
                        M ${polygonPoints[0].x},${polygonPoints[0].y}
                        Q ${(polygonPoints[0].x + polygonPoints[1].x) / 2},${(polygonPoints[0].y + polygonPoints[1].y) / 2
                        } ${polygonPoints[1].x},${polygonPoints[1].y}
                        L ${polygonPoints[2].x},${polygonPoints[2].y}
                        Q ${(polygonPoints[2].x + polygonPoints[3].x) / 2},${(polygonPoints[2].y + polygonPoints[3].y) / 2
                        } ${polygonPoints[3].x},${polygonPoints[3].y}
                        Z
                      `;

                      return (
                        <path
                          key={index}
                          d={pathData}
                          fill="rgba(157, 222, 139, 0.5)"
                          stroke="green"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </>
                )}

                {nearestVertices.length > 0 &&
                  nearestVertices.map((vertexPair, index) => (
                    <g key={index}>
                      <line
                        x1={vertexPair.movedVertex.x}
                        y1={vertexPair.movedVertex.y}
                        x2={vertexPair.otherVertex.x}
                        y2={vertexPair.otherVertex.y}
                        stroke="#28B463"
                        strokeWidth="2"
                      />
                      <circle
                        cx={vertexPair.movedVertex.x}
                        cy={vertexPair.movedVertex.y}
                        r={selectionRadius}
                        fill="#58D68D"
                        stroke="#28B463"
                        strokeWidth="1"
                      />
                      <circle
                        cx={vertexPair.otherVertex.x}
                        cy={vertexPair.otherVertex.y}
                        r={selectionRadius}
                        fill="#58D68D"
                        stroke="#28B463"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                {mergeCandidates.map((candidate, index) => {
                  const activeRoomCentroid = calculateCentroid(
                    rooms[activeRoomIndex].vertices
                  );
                  const angle = calculateAngle(
                    activeRoomCentroid,
                    candidate.centroid
                  );

                  return (
                    <svg
                      key={index}
                      x={candidate.centroid.x - 30} // Increase the x offset for a larger clickable area
                      y={candidate.centroid.y - 30} // Increase the y offset for a larger clickable area
                      width="50" // Increase the width for a larger clickable area
                      height="50" // Increase the height for a larger clickable area
                      viewBox="0 0 256 256"
                      onClick={() => mergeRoom(candidate.roomIndex)}
                    >
                      <title>merge</title>
                      <rect
                        x="0"
                        y="0"
                        width="50"
                        height="50"
                        fill="transparent"
                        style={{ cursor: "pointer" }}
                      />
                      <g
                        id="Layer_1"
                        data-name="Layer 1"
                        transform={`rotate(${angle - 90}, 128, 128)`}
                      >
                        <path
                          style={{ fill: "#6cb159" }}
                          d="M178.56,80.62l-48.62-62.51c-.98-1.26-2.89-1.26-3.88,0l-48.62,62.51c-1.36,1.75.12,4.27,2.31,3.93l28.18-4.35v98.62c-8.07,6.09-13.32,15.74-13.32,26.64,0,18.44,14.95,33.39,33.39,33.39s33.39-14.95,33.39-33.39c0-10.9-5.24-20.54-13.32-26.64v-98.62l28.18,4.35c2.19.34,3.68-2.18,2.31-3.93Z"
                        />
                      </g>
                    </svg>
                  );
                })}
              </g>

              {/* Render staircase in top of room layer */}
              <g ref={staircaseRef}>
                {floorWiseStaircases?.map((staircase, index) => {
                  if (staircase.shouldStaircaseVisible) {
                    return (
                      <StaircaseInSvg
                        ref={svgRef}
                        key={index}
                        index={index}
                        isSelected={selectedStaircase?.index === index}
                        setStaircases={setStaircases}
                        floorName={floorName}
                        onSelect={onSelect}
                        onTouchStart={(e) => {
                          handleMouseDown(e);
                          handleTouchStart(e);
                        }}
                        onMouseMove={handleMouseMove}
                        onTouchMove={(e) => {
                          handleMouseMove(e);
                          handleTouchMove(e);
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchEnd={(e) => {
                          handleMouseUp(e);
                          handleTouchEnd(e);
                        }}
                        translate={translate}
                        scale={scale}
                        {...staircase}
                      />
                    );
                  }
                  return null;
                })}
              </g>
            </svg>

            <Modal
              open={confirmLengthChange}
              onClose={() => setConfirmLengthChange(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  p: 4,
                  backgroundColor: "#fff",
                  borderRadius: "5px",
                  margin: "auto",
                  width: "300px",
                  top: "50%",
                  position: "absolute",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Confirm Length Change
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Are you sure you want to change the length of the wall? This
                  wall is locked.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleWallChangeConfirmation(true)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleWallChangeConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </div>
          <div className="absolute top-[35%] left-0 flex flex-col space-y-3 z-[1000]">
            {selectedWall && (
              <FloorPlanButton
                onClick={addVertex}
                disabled={!selectedWall}
                className="!justify-start gap-1"
              >
                <img src="/images/corner.svg" className="w-5 h-5" />
                Add Corner
              </FloorPlanButton>
            )}

            {activeRoomIndex !== null && (
              <>
                <FloorPlanButton
                  onClick={rotateRoom}
                  disabled={activeRoomIndex === null}
                  className="gap-1"
                >
                  <img src="/images/rotate-icon.svg" className="!w-4 !h-4" />
                  Rotate Room
                </FloorPlanButton>
                {rooms?.length > 1 && (
                  <FloorPlanButton
                    onClick={prepareMergeRoom}
                    disabled={activeRoomIndex === null}
                    className="!justify-start !px-2"
                  >
                    <MergeIcon className="!w-5 !h-5" />
                    Merge Room
                  </FloorPlanButton>
                )}

                <FloorPlanButton
                  onClick={addDoor}
                  disabled={activeRoomIndex === null}
                  className="!justify-start !px-2"
                >
                  <img src="/images/door.svg" className="w-5 h-5" />
                  Add Door
                </FloorPlanButton>
                {activeRoomIndex !== null && selectedDoor && (
                  <FloorPlanButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDoor(
                        selectedDoor?.roomIndex,
                        selectedDoor?.doorIndex
                      );
                    }}
                    disabled={activeRoomIndex === null}
                    className="gap-1 text-red-500 !justify-start"
                  >
                    <img src="/images/delete-icon.svg" className="!w-4 !h-4" />
                    Delete Door...
                  </FloorPlanButton>
                )}
              </>
            )}
            {activeRoomIndex !== null && (
              <>
                {activeRoomIndex !== rooms.length - 1 && (
                  <FloorPlanButton
                    onClick={shiftRoomLayerDown}
                    disabled={activeRoomIndex === rooms.length - 1}
                    className={`!justify-start gap-1  `}
                  >
                    <img src="/images/layerUp.svg" className="w-5 h-5" />
                    Layer Up
                  </FloorPlanButton>
                )}{" "}
                {activeRoomIndex !== 0 && (
                  <FloorPlanButton
                    onClick={shiftRoomLayerUp}
                    disabled={activeRoomIndex === 0}
                    className={`!justify-start gap-1 `}
                  >
                    <img src="/images/layerDown.svg" className="w-5 h-5" />
                    Layer Down
                  </FloorPlanButton>
                )}
              </>
            )}
            {selectedWall && (
              <FloorPlanButton
                onClick={
                  selectedWall &&
                    rooms[selectedWall.roomIndex].hiddenWalls.includes(
                      selectedWall.index
                    )
                    ? restoreWall
                    : hideWall
                }
                disabled={!selectedWall}
                className="gap-1 text-red-500 !justify-start"
              >
                {selectedWall &&
                  rooms[selectedWall.roomIndex].hiddenWalls.includes(
                    selectedWall.index
                  ) ? (
                  <>
                    <img src="/images/restore-icon.svg" className="!w-4 !h-4" />
                    Restore Wall
                  </>
                ) : (
                  <>
                    <img src="/images/delete-icon.svg" className="!w-4 !h-4" />
                    Delete Wall
                  </>
                )}
              </FloorPlanButton>
            )}

            {(undoStack.length !== 0 || redoStack.length !== 0) && (
              <>
                <FloorPlanButton
                  FloorPlanButton
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className={`gap-1  !justify-start ${undoStack?.length === 0 && "text-gray-400"
                    }`}
                >
                  <img src="/images/undo.svg" className="!w-4 !h-4" />
                  Undo
                </FloorPlanButton>
                <FloorPlanButton
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className={`gap-1 !justify-start ${redoStack?.length === 0 && "text-gray-400"
                    }`}
                >
                  <img src="/images/redo.svg" className="!w-4 !h-4" />
                  Redo
                </FloorPlanButton>
              </>
            )}

            {activeRoomIndex !== null && (
              <FloorPlanButton
                onClick={deleteRoom}
                disabled={activeRoomIndex === null}
                className="gap-1 text-red-500 !justify-start"
              >
                <img src="/images/delete-icon.svg" className="!w-4 !h-4" />
                Delete Room...
              </FloorPlanButton>
            )}

            <FloorPlanButton
              onClick={addStaircase}
              disabled={activeRoomIndex === -1}
              className={`!justify-center gap-1 `}
            >
              <img src="/images/stairs-icon.svg" className="w-5 h-5" />
              Add Staircase
            </FloorPlanButton>

            {selectedStaircase && (
              <FloorPlanButton
                onClick={deleteStaircase}
                disabled={!selectedStaircase}
                className={`!justify-center gap-1 text-red-500`}
              >
                <>
                  <img src="/images/delete-icon.svg" className="!w-4 !h-4" />
                  Delete Staircase
                </>
              </FloorPlanButton>
            )}

            {selectedMethod === "corner" && (
              <FloorPlanButton
                onClick={openCancelDrawingRoomModal}
                className="gap-1 !justify-start"
              >
                <CancelIcon className="!w-5 !h-5" />
                Cancel...
              </FloorPlanButton>
            )}
          </div>
          {selectedWall && (
            <div className="absolute top-[10px] left-[10px] w-[170px] bg-white p-[10px] border-[1px] border-gray-300 rounded-md space-y-3">
              <div className="!text-[16px]">Wall Length</div>
              <Stack direction="row" spacing={1}>
                <WallLengthField
                  label="Feet"
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  disabled={
                    rooms[selectedWall.roomIndex].lockedWalls[
                    selectedWall.index
                    ] !== undefined
                  }
                />
                <WallLengthField
                  label="Inches"
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  disabled={
                    rooms[selectedWall.roomIndex].lockedWalls[
                    selectedWall.index
                    ] !== undefined
                  }
                />
              </Stack>
              <Button
                onClick={handleLengthChange}
                variant="contained"
                color="primary"
                sx={{ fontSize: "10px", gap: "6px", mt: "10px" }}
                disabled={
                  rooms[selectedWall.roomIndex].lockedWalls[
                  selectedWall.index
                  ] !== undefined
                }
              >
                <LockIcon className="!w-4 !h-4" />
                Lock Wall
              </Button>
              {rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] !==
                undefined && (
                  <Button
                    onClick={unlockWall}
                    variant="contained"
                    color="primary"
                    sx={{ fontSize: "10px", gap: "6px", mt: "10px" }}
                  >
                    <LockOpenIcon className="!w-4 !h-4" />
                    Unlock Wall
                  </Button>
                )}
            </div>
          )}

          <CancelConfirmationModal
            open={cancelDrawingRoomModal}
            onClose={closeCancelDrawingRoomModal}
            cancelDrawingRoomWithCorner={cancelDrawingRoomWithCorner}
          />
        </>
      ) : (
        "Kindly select a room to draw a plan"
      )}
    </>
  );
};

export default SvgCanvas;
