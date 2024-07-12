import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";

const Svg = ({ rooms, setRooms }) => {
    const svgRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [currentPoint, setCurrentPoint] = useState(null);
    const [selectedWall, setSelectedWall] = useState(null);
    const [selectedVertex, setSelectedVertex] = useState(null);
    const [hoveredVertex, setHoveredVertex] = useState(null);
    const [activeRoomIndex, setActiveRoomIndex] = useState(null);
    const [scale, setScale] = useState(1);
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
    const dimensionOffset = 20;
    const [originalVertices, setOriginalVertices] = useState(null);

    const [draggingMoveIcon, setDraggingMoveIcon] = useState(false);
    const [elasticLine, setElasticLine] = useState(null);
    const [mergeCandidates, setMergeCandidates] = useState([]);

    const [initialDistance, setInitialDistance] = useState(null);
    const [initialScale, setInitialScale] = useState(1);


    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);


    const handleStateChange = (newRooms) => {
        setUndoStack([...undoStack, rooms]);
        setRooms(newRooms);
        setRedoStack([]); // Clear redo stack on new action
    };



    console.log(selectedWall, rooms)


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
                setScale(initialScale * scaleFactor);
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (e.touches.length < 2) {
            setInitialDistance(null);
        }
    };



    const prepareMergeRoom = () => {
        if (activeRoomIndex === null) return;

        const selectedRoom = rooms[activeRoomIndex];
        const candidates = [];

        const convertPixelsToFeet = (pixels) => {
            const gridSize = 20; // Assuming 20 pixels per foot
            return pixels / gridSize;
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

        const checkVerticesNearWalls = (room1, room2) => {
            const intersectionPoints = [];

            for (let vertex of room1.vertices) {
                for (let i = 0; i < room2.vertices.length; i++) {
                    const vertex1 = room2.vertices[i];
                    const vertex2 = room2.vertices[(i + 1) % room2.vertices.length];
                    if (isPointNearLine(vertex.x, vertex.y, vertex1.x, vertex1.y, vertex2.x, vertex2.y, 10)) {
                        intersectionPoints.push({ x: vertex.x, y: vertex.y });
                    }
                }
            }

            if (intersectionPoints.length < 2) return true;

            for (let i = 0; i < intersectionPoints.length - 1; i++) {
                for (let j = i + 1; j < intersectionPoints.length; j++) {
                    const distance = Math.sqrt(
                        Math.pow(intersectionPoints[i].x - intersectionPoints[j].x, 2) +
                        Math.pow(intersectionPoints[i].y - intersectionPoints[j].y, 2)
                    );
                    if (convertPixelsToFeet(distance) < 1) {
                        return false;
                    }
                }
            }

            return true;
        };

        rooms.forEach((room, roomIndex) => {
            if (roomIndex !== activeRoomIndex) {
                // Check if any vertex of the current room is near the walls of the active room
                let isCandidate = checkVerticesNearWalls(room, selectedRoom);

                // Check if any vertex of the active room is near the walls of the current room
                if (isCandidate) {
                    isCandidate = checkVerticesNearWalls(selectedRoom, room);
                }

                if (isCandidate) {
                    candidates.push({
                        roomIndex,
                        centroid: calculateCentroid(room.vertices),
                    });
                }
            }
        });

        setMergeCandidates(candidates);
    };




    const calculateCenters = (vertices) => {
        const centers = [];
        vertices.forEach((vertex, index) => {
            const nextVertex = vertices[(index + 1) % vertices.length];
            centers.push({
                x: (vertex.x + nextVertex.x) / 2,
                y: (vertex.y + nextVertex.y) / 2,
            });
        });
        return centers;
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
        let x = 0, y = 0;
        vertices.forEach(v => {
            x += v.x;
            y += v.y;
        });
        return { x: x / vertices.length, y: y / vertices.length };
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

    const handleMouseDown = (e) => {
        const pos = getMousePosition(e);
        if (activeRoomIndex === null) {
            setPanning(true);
            setPanStart({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });
            setIsRotating(false)
            return;
        }

        let pointSelected = false;
        const room = rooms[activeRoomIndex];
        const center = calculateCentroid(room.vertices);

        // Check if the mouse is down on the rotate icon
        if (isRotating) {
            const rotateIconPosition = {
                x: center.x + 50 * Math.cos(room.rotationAngle || 0) - 50 * Math.sin(room.rotationAngle || 0),
                y: center.y + 50 * Math.sin(room.rotationAngle || 0) + 50 * Math.cos(room.rotationAngle || 0),
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

        room.vertices.forEach((vertex, vertexIndex) => {
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
            }
        });

        if (!pointSelected) {
            room.vertices.forEach((vertex, vertexIndex) => {
                const nextVertex = room.vertices[(vertexIndex + 1) % room.vertices.length];
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
        }
    };


    console.log(rooms)
    const handleMouseMove = (e) => {
        if (activeRoomIndex === null) {
            if (panning) {
                e.preventDefault();
                const isTouch = e.touches ? true : false;

                const event = isTouch ? e.touches?.[0] : e;
                const dx = event.clientX - panStart.x;
                const dy = event.clientY - panStart.y;

                const rect = svgRef.current.getBoundingClientRect();
                const mousePos = {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };

                const newTranslate = {
                    x: translate.x + dx,
                    y: translate.y + dy,
                };

                setTranslate(newTranslate);
                setPanStart({ x: event.clientX, y: event.clientY });
            }

            return;
        }
        if (!dragging || !currentPoint) return;
        const pos = getMousePosition(e);
        if (currentPoint.type === "rotate") {
            const room = rooms[currentPoint.roomIndex];
            const center = calculateCentroid(room.vertices);
            const initialAngle = room.rotationAngle || 0;
            const angle = Math.atan2(pos.y - center.y, pos.x - center.x);

            // Calculate the rotation increment based on the initial angle
            const angleIncrement = angle - initialAngle;

            // Rotate vertices
            const updatedVertices = room.vertices.map(vertex =>
                rotatePoint(vertex, center, angleIncrement)
            );

            // Update rooms with new vertices and rotation angle
            const updatedRooms = rooms.map((r, i) =>
                i === currentPoint.roomIndex
                    ? { ...r, vertices: updatedVertices, centers: calculateCenters(updatedVertices), rotationAngle: angle }
                    : r
            );

            setRooms(updatedRooms);

            // Update the initial angle for the next calculation
            currentPoint.offsetX = pos.x;
            currentPoint.offsetY = pos.y;

            return;
        }


        const updateFeetAndInches = (vertex1, vertex2) => {
            const length = Math.sqrt(
                Math.pow(vertex2.x - vertex1.x, 2) +
                Math.pow(vertex2.y - vertex1.y, 2)
            );
            const { feet, inches } = convertToFeetAndInches(length);
            setFeet(feet);
            setInches(inches);
        };

        let updatedRooms;
        if (currentPoint.type === "wall" && selectedWall && selectedWall.roomIndex === currentPoint.roomIndex && selectedWall.index === currentPoint.index) {
            updatedRooms = rooms.map((room, roomIndex) => {
                if (roomIndex === currentPoint.roomIndex) {
                    let newVertices = [...room.vertices];
                    if (!originalVertices) {
                        setOriginalVertices(JSON.parse(JSON.stringify(newVertices)));
                    }
                    const prevVertexIndex = currentPoint.index;
                    const nextVertexIndex = (currentPoint.index + 1) % room.vertices.length;

                    const dx = pos.x - currentPoint.offsetX;
                    const dy = pos.y - currentPoint.offsetY;

                    const dirX = room.vertices[nextVertexIndex].x - room.vertices[prevVertexIndex].x;
                    const dirY = room.vertices[nextVertexIndex].y - room.vertices[prevVertexIndex].y;

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

                    updateFeetAndInches(newPrevVertex, newNextVertex);

                    return {
                        ...room,
                        vertices: newVertices,
                        centers: calculateCenters(newVertices),
                    };
                }
                return room;
            });

            setRooms(updatedRooms);
        } else if (currentPoint.type === "vertex" || currentPoint.type === "room") {
            if (currentPoint.type === "room" && !draggingMoveIcon) return;
            updatedRooms = rooms.map((room, roomIndex) => {
                if (roomIndex === currentPoint.roomIndex) {
                    let newVertices = [...room.vertices];

                    if (currentPoint.type === "vertex") {
                        if (!originalVertices) {
                            setOriginalVertices(JSON.parse(JSON.stringify(newVertices)));
                        }
                        newVertices[currentPoint.index] = { x: pos.x - currentPoint.offsetX, y: pos.y - currentPoint.offsetY };

                        const prevVertexIndex = (currentPoint.index - 1 + room.vertices.length) % room.vertices.length;
                        const nextVertexIndex = (currentPoint.index + 1) % room.vertices.length;

                        const prevVertex = newVertices[prevVertexIndex];
                        const nextVertex = newVertices[nextVertexIndex];

                        if (Math.abs(newVertices[currentPoint.index].x - prevVertex.x) < selectionRadius) {
                            newVertices[currentPoint.index].x = prevVertex.x;
                        } else if (Math.abs(newVertices[currentPoint.index].y - prevVertex.y) < selectionRadius) {
                            newVertices[currentPoint.index].y = prevVertex.y;
                        } else if (Math.abs(newVertices[currentPoint.index].x - nextVertex.x) < selectionRadius) {
                            newVertices[currentPoint.index].x = nextVertex.x;
                        } else if (Math.abs(newVertices[currentPoint.index].y - nextVertex.y) < selectionRadius) {
                            newVertices[currentPoint.index].y = nextVertex.y;
                        }

                        updateFeetAndInches(newVertices[currentPoint.index], nextVertex);

                    } else if (currentPoint.type === "room") {
                        const dx = pos.x - calculateCentroid(newVertices).x;
                        const dy = pos.y - calculateCentroid(newVertices).y;

                        newVertices = newVertices.map(vertex => ({
                            x: vertex.x + dx,
                            y: vertex.y + dy
                        }));

                    }

                    return {
                        ...room,
                        vertices: newVertices,
                        centers: calculateCenters(newVertices),
                    };
                }
                return room;
            });

            setRooms(updatedRooms);
            if (currentPoint.type === "room") {
                highlightNearestParallelWalls(updatedRooms[currentPoint.roomIndex], currentPoint.roomIndex, pos);
            }

        }

        // Update elastic line coordinates
        if (highlightedWalls.length > 0 && currentPoint.type === "room") {
            const { movedWall, otherWall } = highlightedWalls[0];

            setElasticLine({
                start: { x: (movedWall.x1 + movedWall.x2) / 2, y: (movedWall.y1 + movedWall.y2) / 2 },
                end: { x: (otherWall.x1 + otherWall.x2) / 2, y: (otherWall.y1 + otherWall.y2) / 2 },
            });
        } else {
            setElasticLine(null);
        }

        let hovered = false;
        rooms.forEach((room, roomIndex) => {
            room.vertices.forEach((vertex, vertexIndex) => {
                if (
                    Math.abs(pos.x - vertex.x) < selectionRadius &&
                    Math.abs(pos.y - vertex.y) < selectionRadius &&
                    !(currentPoint && currentPoint.roomIndex === roomIndex && currentPoint.index === vertexIndex)
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

        if (!currentPoint) return;
        let isLockedWallChanged = false;
        let updatedRooms = [...rooms];
        let modifiedLockedWalls = {};
        if (currentPoint.type === "rotate") {
            setIsRotating(false);
        }
        if (currentPoint && (currentPoint.type === "vertex" || currentPoint.type === "wall" || currentPoint.type === "room")) {
            let originalRoom = rooms[currentPoint.roomIndex];
            let originalLengths = calculateWallLengths(originalRoom.vertices);

            updatedRooms = rooms.map((room, roomIndex) => {
                if (roomIndex === currentPoint.roomIndex) {
                    let newVertices = [...room.vertices];

                    rooms.forEach((otherRoom, otherRoomIndex) => {
                        if (otherRoomIndex !== roomIndex) {
                            otherRoom.vertices.forEach((vertex) => {
                                const distance = Math.sqrt(
                                    Math.pow(vertex.x - newVertices[currentPoint.index]?.x, 2) +
                                    Math.pow(vertex.y - newVertices[currentPoint.index]?.y, 2)
                                );

                                if (distance < selectionRadius) {
                                    newVertices[currentPoint.index] = { x: vertex.x, y: vertex.y };
                                }
                            });
                        }
                    });

                    return {
                        ...room,
                        vertices: newVertices,
                        centers: calculateCenters(newVertices),
                    };
                }
                return room;
            });

            let newLengths = calculateWallLengths(updatedRooms[currentPoint.roomIndex].vertices);
            let lockedWalls = originalRoom.lockedWalls || {};

            for (let index in lockedWalls) {
                if (Math.abs(newLengths[index] - lockedWalls[index]) > 0.1) {
                    isLockedWallChanged = true;
                    modifiedLockedWalls[index] = newLengths[index];
                }
            }
        }

        if (highlightedWalls.length > 0) {
            updatedRooms = snapRoomToHighlightedWall(updatedRooms, highlightedWalls);
        }

        if (isLockedWallChanged) {
            setManualWallLength({ roomIndex: currentPoint.roomIndex, lengths: modifiedLockedWalls });
            setConfirmLengthChange(true);
        } else {
            handleStateChange(updatedRooms); // Use handleStateChange instead of setRooms

            if (currentPoint && (currentPoint.type === "vertex" || currentPoint.type === "wall" || currentPoint.type === "room")) {
                setOriginalVertices(updatedRooms[currentPoint.roomIndex].vertices);
            }
        }

        setHighlightedWalls([]);
        setCurrentPoint(null);
    };


    const snapRoomToHighlightedWall = (updatedRooms, highlightedWall) => {
        if (!highlightedWall.length) return updatedRooms;

        const { roomIndex: targetRoomIndex, vertexIndex: targetVertexIndex } = highlightedWall[0];
        const targetRoom = rooms[targetRoomIndex];
        const targetVertex1 = targetRoom.vertices[targetVertexIndex];
        const targetVertex2 = targetRoom.vertices[(targetVertexIndex + 1) % targetRoom.vertices.length];

        const currentRoom = updatedRooms[activeRoomIndex];
        let nearestVertex = null;
        let minDistance = Infinity;

        currentRoom.vertices.forEach((vertex) => {
            const distance = distanceToLineSegment(vertex, targetVertex1.x, targetVertex1.y, targetVertex2.x, targetVertex2.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestVertex = vertex;
            }
        });

        if (nearestVertex && targetVertex1 && targetVertex2) {
            const nearestPointOnWall = getNearestPointOnLineSegment(nearestVertex, targetVertex1, targetVertex2);
            const offsetX = nearestPointOnWall.x - nearestVertex.x;
            const offsetY = nearestPointOnWall.y - nearestVertex.y;

            const newVertices = currentRoom.vertices.map(vertex => ({
                x: vertex.x + offsetX,
                y: vertex.y + offsetY,
            }));

            updatedRooms[activeRoomIndex] = {
                ...currentRoom,
                vertices: newVertices,
                centers: calculateCenters(newVertices),
            };
        }

        return updatedRooms;
    };

    const getNearestPointOnLineSegment = (point, lineStart, lineEnd) => {
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        const param = lenSq !== 0 ? dot / lenSq : -1;

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        return { x: xx, y: yy };
    };



    const handleMouseUp = () => {
        stopDragging();
    };

    const handleWheel = (e) => {
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
    };

    const handleLengthChange = () => {
        if (selectedWall) {
            const lengthInFeet = parseInt(feet) * 12;
            const lengthInInches = parseInt(inches);
            const totalLengthInInches = lengthInFeet + lengthInInches;
            const lengthInPixels = (totalLengthInInches / 12) * 20;

            handleWallLengthChange(lengthInPixels);
        }
    };

    const handleWallLengthChange = (length) => {
        if (selectedWall && rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] === undefined) {
            const { roomIndex, index } = selectedWall;
            const room = rooms[roomIndex];
            const vertex1 = room.vertices[index];
            const vertex2 = room.vertices[(index + 1) % room.vertices.length];

            const angle = Math.atan2(vertex2.y - vertex1.y, vertex2.x - vertex1.x);
            const newVertex2 = {
                x: vertex1.x + length * Math.cos(angle),
                y: vertex1.y + length * Math.sin(angle),
            };

            const newVertices = [...room.vertices];
            newVertices[(index + 1) % newVertices.length] = newVertex2;

            const updatedRooms = rooms.map((r, i) =>
                i === roomIndex
                    ? {
                        ...r,
                        vertices: newVertices,
                        centers: calculateCenters(newVertices),
                        lockedWalls: { ...r.lockedWalls, [index]: length }
                    }
                    : r
            );

            setRooms(updatedRooms);
            setManualWallLength({ roomIndex, index, length });
        }
    };

    const handleWallChangeConfirmation = (confirm) => {
        if (manualWallLength && manualWallLength.roomIndex !== null) {
            const { roomIndex } = manualWallLength;
            const room = rooms[roomIndex];

            if (confirm) {
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
            } else {
                const updatedRooms = rooms.map((r, i) =>
                    i === roomIndex ? { ...r, vertices: originalVertices, centers: calculateCenters(originalVertices) } : r
                );
                // debugger

                setRooms(updatedRooms);
                setOriginalVertices(null);
            }

            setManualWallLength(null);
            setConfirmLengthChange(false);
        }
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

            setRooms(updatedRooms);
            setSelectedWall({ roomIndex, index: index + 1 });
            setSelectedVertex({ roomIndex, index: index + 1 });
            setClickPosition(null);
        }
    };

    const rotateRoom = () => {
        if (activeRoomIndex !== null) {
            setIsRotating(true);
            setIsMoving(false);
        }
    };


    const hideWall = () => {
        if (selectedWall) {
            const { roomIndex, index } = selectedWall;
            const updatedRooms = rooms.map((room, i) => {
                if (i === roomIndex) {
                    const hiddenWalls = room.hiddenWalls || [];
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
            setSelectedWall(null);
        }
    };


    const deleteRoom = () => {
        if (activeRoomIndex !== null) {
            const updatedRooms = rooms.filter((_, index) => index !== activeRoomIndex);
            setRooms(updatedRooms);
            setActiveRoomIndex(null);
        }
    };

    const handlePolygonClick = (e, roomIndex) => {
        if (mergeCandidates.length > 0) return;
        e.stopPropagation();
        setActiveRoomIndex(roomIndex);
        setIsMoving(true)

        const room = rooms[roomIndex];
        const centroid = calculateCentroid(room.vertices);
        const newScale = 1.5; // Adjust the scale value as needed for the zoom level
        const newTranslate = {
            x: svgRef.current.clientWidth / 2 - centroid.x * newScale,
            y: svgRef.current.clientHeight / 2 - centroid.y * newScale,
        };

        setScale(newScale);
        setTranslate(newTranslate);

        const groupElement = document.getElementById(`group-${roomIndex}`);
        if (groupElement) {
            groupElement.classList.add("zoomable-group");
        }
    };

    console.log("isRotating", isRotating)

    const handleSvgClick = (e) => {
        // if (isAddingCorners) {
        //     const pos = getMousePosition(e);
        //     const updatedVertices = [...newRoomVertices, pos];
        //     setNewRoomVertices(updatedVertices);

        //     // Check if the first and last vertices are close to form a polygon
        //     if (updatedVertices.length > 2 && distanceToLineSegment(updatedVertices[0], pos.x, pos.y, pos.x, pos.y) < selectionRadius) {
        //         const newRoom = {
        //             name: `Room ${rooms.length + 1}`,
        //             vertices: updatedVertices,
        //             centers: calculateCenters(updatedVertices),
        //             lockedWalls: {}
        //         };
        //         setRooms([...rooms, newRoom]);
        //         setIsAddingCorners(false);
        //         setNewRoomVertices([]);
        //     }
        //     return;
        // }
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
            setIsRotating(false)
            // setScale(1)
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
                        ? { ...r, vertices: rotatedVertices, centers: calculateCenters(rotatedVertices), rotationAngle: angleDiff }
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
        rooms[activeRoomIndex].vertices.forEach((vertex, vertexIndex) => {
            const nextVertex = rooms[activeRoomIndex].vertices[(vertexIndex + 1) % rooms[activeRoomIndex].vertices.length];
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

                // setOriginalVertices(JSON.parse(JSON.stringify(rooms[activeRoomIndex].vertices)));

                const dx = nextVertex.x - vertex.x;
                const dy = nextVertex.y - vertex.y;
                const t = ((pos.x - vertex.x) * dx + (pos.y - vertex.y) * dy) / (dx * dx + dy * dy);
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
        }
    };
    const isPointInPolygon = (point, vertices) => {
        const { x, y } = point;
        let isInside = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
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
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
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
        return vertices.find(vertex => {
            const distance = Math.sqrt(Math.pow(vertex.x - point.x, 2) + Math.pow(vertex.y - point.y, 2));
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

        const drawTriangle = (x, y, angle) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return `
                M ${x} ${y}
                L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos}
                L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos}
                Z
            `;
        };

        return vertices.map((vertex, index) => {
            const nextVertex = vertices[(index + 1) % vertices.length];
            const length = Math.sqrt(
                Math.pow(nextVertex.x - vertex.x, 2) +
                Math.pow(nextVertex.y - vertex.y, 2)
            );
            const midX = (vertex.x + nextVertex.x) / 2;
            const midY = (vertex.y + nextVertex.y) / 2;
            const angle = Math.atan2(
                nextVertex.y - vertex.y,
                nextVertex.x - vertex.x
            );
            const offsetX = dimensionOffset * Math.cos(angle - Math.PI / 2);
            const offsetY = dimensionOffset * Math.sin(angle - Math.PI / 2);

            const { feet, inches } = convertToFeetAndInches(length);
            const dimensionText = `${feet}'${inches}"`;
            const textX = midX + offsetX * 1.5;
            const textY = midY + offsetY * 1.5;

            const isLocked = rooms[roomIndex].lockedWalls && rooms[roomIndex].lockedWalls[index] !== undefined;

            return (
                <g key={index}>
                    {/* Reference dotted lines */}
                    <line
                        x1={vertex.x}
                        y1={vertex.y}
                        x2={vertex.x + offsetX}
                        y2={vertex.y + offsetY}
                        stroke="#5c5c5c"
                        strokeWidth="0.5"
                        strokeDasharray="1.5,1.2"
                    />
                    <line
                        x1={nextVertex.x}
                        y1={nextVertex.y}
                        x2={nextVertex.x + offsetX}
                        y2={nextVertex.y + offsetY}
                        stroke="#5c5c5c"
                        strokeWidth="0.5"
                        strokeDasharray="1.5,1.2"
                    />

                    {/* Dimension line */}
                    <line
                        x1={vertex.x + offsetX}
                        y1={vertex.y + offsetY}
                        x2={nextVertex.x + offsetX}
                        y2={nextVertex.y + offsetY}
                        stroke="#5c5c5c"
                        strokeWidth="1"
                    />
                    <path
                        d={drawTriangle(vertex.x + offsetX, vertex.y + offsetY, angle + Math.PI)}
                        fill="#5c5c5c"
                    />
                    <path
                        d={drawTriangle(nextVertex.x + offsetX, nextVertex.y + offsetY, angle)}
                        fill="#5c5c5c"
                    />
                    <text x={textX} y={textY} fontSize="8" fill="#5c5c5c" alignmentBaseline="middle" textAnchor="middle">
                        {dimensionText}
                    </text>
                    {isLocked && (
                        <svg x={textX + 15} y={textY - 10} width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </g>
            );
        });
    };

    const drawGrid = () => {
        const gridSize = 40;
        const svg = svgRef.current;
        if (!svg) return;

        const width = svg.clientWidth;
        const height = svg.clientHeight;

        const lines = [];
        const plusIcons = [];
        const dots = [];

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
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

                if (x + gridSize < width) {
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
                if (y + gridSize < height) {
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
                if (x + gridSize < width && y + gridSize < height) {
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
    };

    useEffect(() => {
        drawGrid();
    }, [translate, scale]);

    useEffect(() => {
        if (selectedWall) {
            const { roomIndex, index } = selectedWall;
            const room = rooms[roomIndex];
            const vertex1 = room.vertices[index];
            const vertex2 = room.vertices[(index + 1) % room.vertices.length];

            const length = Math.sqrt(
                Math.pow(vertex2.x - vertex1.x, 2) + Math.pow(vertex2.y - vertex1.y, 2)
            );
            const { feet, inches } = convertToFeetAndInches(length);
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
        vertices.forEach((vertex, index) => {
            const nextVertex = vertices[(index + 1) % vertices.length];
            const length = Math.sqrt(Math.pow(nextVertex.x - vertex.x, 2) + Math.pow(nextVertex.y - vertex.y, 2));
            lengths[index] = length;
        });
        return lengths;
    };

    const areWallsParallel = (wall1, wall2) => {
        const angle1 = Math.atan2(wall1.y2 - wall1.y1, wall1.x2 - wall1.x1);
        const angle2 = Math.atan2(wall2.y2 - wall2.y1, wall2.x2 - wall2.x1);
        const angleDifference = Math.abs(angle1 - angle2);
        return angleDifference < 0.174533 || Math.abs(angleDifference - Math.PI) < 0.174533; // 10 degrees in radians
    };
    const distanceBetweenLines = (line1, line2) => {
        const distance1 = distanceToLineSegment({ x: line1.x1, y: line1.y1 }, line2.x1, line2.y1, line2.x2, line2.y2);
        const distance2 = distanceToLineSegment({ x: line1.x2, y: line1.y2 }, line2.x1, line2.y1, line2.x2, line2.y2);
        const distance3 = distanceToLineSegment({ x: line2.x1, y: line2.y1 }, line1.x1, line1.y1, line1.x2, line1.y2);
        const distance4 = distanceToLineSegment({ x: line2.x2, y: line2.y2 }, line1.x1, line1.y1, line1.x2, line1.y2);

        return Math.min(distance1, distance2, distance3, distance4);
    };


    const highlightNearestParallelWalls = (movedRoom, movedRoomIndex, pos) => {
        const nearestWalls = [];
        let minDistance = 30; // Increased distance to detect near walls

        // Iterate over the walls of the moved room
        movedRoom.vertices.forEach((vertex, vertexIndex) => {
            const nextVertex = movedRoom.vertices[(vertexIndex + 1) % movedRoom.vertices.length];
            const movedWall = {
                x1: vertex.x,
                y1: vertex.y,
                x2: nextVertex.x,
                y2: nextVertex.y,
            };

            // Iterate over all the rooms to find the nearest wall
            rooms.forEach((room, roomIndex) => {
                if (roomIndex !== movedRoomIndex) {
                    room.vertices.forEach((otherVertex, otherVertexIndex) => {
                        const otherNextVertex = room.vertices[(otherVertexIndex + 1) % room.vertices.length];
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
                                distanceToLineSegment(pos, otherWall.x1, otherWall.y1, otherWall.x2, otherWall.y2)
                            );

                            if (distance < minDistance) {
                                minDistance = distance;
                                nearestWalls.length = 0; // Clear previous nearest walls
                                nearestWalls.push({
                                    roomIndex: roomIndex,
                                    vertexIndex: otherVertexIndex,
                                    movedWall: movedWall,
                                    otherWall: otherWall
                                });
                            }
                        }
                    });
                }
            });
        });

        setHighlightedWalls(nearestWalls);
    };
    const mergeRoom = (targetRoomIndex) => {
        if (activeRoomIndex === null) return;

        const mergedVertices = mergeRoomsVertices(rooms[activeRoomIndex], rooms[targetRoomIndex]);

        const updatedRooms = rooms
            .filter((_, index) => index !== activeRoomIndex && index !== targetRoomIndex)
            .concat([
                {
                    ...rooms[activeRoomIndex],
                    vertices: mergedVertices,
                    centers: calculateCenters(mergedVertices),
                },
            ]);

        setRooms(updatedRooms);
        setActiveRoomIndex(updatedRooms.length - 1);
        setMergeCandidates([]);
    };
    const shiftVertices = (vertices, otherVertices) => {
        if (vertices.length === 0) return vertices;

        let shiftedVertices = vertices;
        const otherVerticesStrSet = new Set(otherVertices.map(v => JSON.stringify(v)));

        let newVertex = shiftedVertices[shiftedVertices.length - 1];
        if (otherVerticesStrSet.has(JSON.stringify(newVertex))) {
            // Rotate by two steps if the newVertex is found
            shiftedVertices = [
                shiftedVertices[shiftedVertices.length - 2],
                shiftedVertices[shiftedVertices.length - 1],
                ...shiftedVertices.slice(0, shiftedVertices.length - 2)
            ];
        } else {
            // Rotate by one step if the newVertex is not found
            shiftedVertices = [
                shiftedVertices[shiftedVertices.length - 1],
                ...shiftedVertices.slice(0, shiftedVertices.length - 1)
            ];
        }

        return shiftedVertices;
    };


    const mergeRoomsVertices = (room1, room2) => {
        const vertices1 = room1.vertices;
        const vertices2 = room2.vertices;
        console.log("initialVertex", room1.vertices, room2.vertices)
        const combinedVertices = [];
        const intersectionPoints = [];
        console.log("intersectionPoints", intersectionPoints)

        // Find and add intersection points
        for (let i = 0; i < vertices1.length; i++) {
            const vertex1 = vertices1[i];
            const nextVertex1 = vertices1[(i + 1) % vertices1.length];

            for (let j = 0; j < vertices2.length; j++) {
                const vertex2 = vertices2[j];
                const nextVertex2 = vertices2[(j + 1) % vertices2.length];

                if (doIntersect(vertex1, nextVertex1, vertex2, nextVertex2)) {

                    // When calling findIntersection, pass the vertices of the rooms
                    const intersection = findIntersection(vertex1, nextVertex1, vertex2, nextVertex2, [...vertices1, ...vertices2]);
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
                if (JSON.stringify(point) === JSON.stringify(start) || JSON.stringify(point) === JSON.stringify(end)) {
                    return false;
                }

                const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y);
                if (Math.abs(crossProduct) > Number.EPSILON) return false;

                const dotProduct = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y);
                if (dotProduct < 0) return false;

                const squaredLength = (end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y);
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

                const pointsBetween = intersections.filter(point => isBetween(point, vertex, nextVertex));

                pointsBetween.sort((a, b) => distance(vertex, a) - distance(vertex, b));

                pointsBetween.forEach(point => {
                    if (!newVertices.some(v => JSON.stringify(v) === JSON.stringify(point))) {
                        newVertices.push(point);
                    }
                });
            }

            return newVertices;
        };



        const newVertices1 = addIntersections(vertices1, intersectionPoints);
        const newVertices2 = addIntersections(vertices2, intersectionPoints);
        console.log("newVertices1,2", newVertices1, newVertices2)
        // Combine all vertices
        combinedVertices.push(...newVertices1, ...newVertices2);

        // Remove duplicate vertices
        const uniqueVertices1 = shiftVertices(Array.from(new Set(newVertices1.map(v => JSON.stringify(v)))).map(str => JSON.parse(str)), room2.vertices);
        const uniqueVertices2 = shiftVertices(Array.from(new Set(newVertices2.map(v => JSON.stringify(v)))).map(str => JSON.parse(str)), room1.vertices);

        console.log("uniqueVertices1,2", uniqueVertices1, uniqueVertices2)

        // Function to merge vertices from two arrays based on common points
        const mergeVerticesBasedOnCommonPoints = (arr1, arr2) => {
            const mergedArray = [];

            for (let i = 0; i < arr1.length; i++) {
                const vertex1 = arr1[i];
                const vertex1Str = JSON.stringify(vertex1);

                // Check if the current vertex is found in arr2
                const indexInArr2 = arr2.findIndex(vertex2 => JSON.stringify(vertex2) === vertex1Str);

                if (indexInArr2 === -1) {
                    // If not found in arr2 and not already added in mergedArray, add the vertex to the mergedArray
                    if (!mergedArray.some(v => JSON.stringify(v) === vertex1Str)) {
                        mergedArray.push(vertex1);
                    }
                } else {
                    // If found in arr2, add the current vertex
                    const vertex2Str = JSON.stringify(arr2[indexInArr2]);
                    if (!mergedArray.some(v => JSON.stringify(v) === vertex2Str)) {
                        mergedArray.push(arr2[indexInArr2]);
                    }

                    // Check the next vertex in arr2
                    const nextIndex = (indexInArr2 + 1) % arr2.length;
                    const nextVertexStr = JSON.stringify(arr2[nextIndex]);

                    // If the next vertex is found in the intermediate vertices, skip the logic and return to the main loop
                    if (arr1.some(vertex => JSON.stringify(vertex) === nextVertexStr)) {
                        continue;
                    }

                    // Add the remaining vertices from arr2 starting from the common point
                    for (let j = nextIndex; j < arr2.length; j++) {
                        const vertex2Str = JSON.stringify(arr2[j]);
                        if (!mergedArray.some(v => JSON.stringify(v) === vertex2Str)) {
                            mergedArray.push(arr2[j]);
                        }
                    }
                    // Then add the vertices from the start of arr2 to the common point
                    for (let j = 0; j < indexInArr2; j++) {
                        const vertex2Str = JSON.stringify(arr2[j]);
                        if (!mergedArray.some(v => JSON.stringify(v) === vertex2Str)) {
                            mergedArray.push(arr2[j]);
                        }
                    }
                }
            }

            return mergedArray;
        };




        // Merge vertices from both arrays based on common points
        const combinedVerticesFinal = mergeVerticesBasedOnCommonPoints(uniqueVertices1, uniqueVertices2);
        const finalVertex = Array.from(new Set(combinedVerticesFinal.map(v => JSON.stringify(v)))).map(str => JSON.parse(str));
        console.log("combinedVerticesFinal", combinedVerticesFinal)


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
                const distanceA = Math.sqrt((a.x - center.x) ** 2 + (a.y - center.y) ** 2);
                const distanceB = Math.sqrt((b.x - center.x) ** 2 + (b.y - center.y) ** 2);
                return distanceA - distanceB;
            }

            return angleA - angleB;
        });
    };


    const distanceToLineSegment = (point, x1, y1, x2, y2) => {
        const A = point.x - x1;
        const B = point.y - y1;
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

        const dx = point.x - xx;
        const dy = point.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };
    const calculateAngle = (point1, point2) => {
        return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
    };



    const calculateBoundingBox = (text, x, y, fontSize) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
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

        return points.every(point => isPointInPolygon(point, vertices));
    };

    const getAdjustedTextPosition = (text, x, y, vertices, fontSize) => {
        let bbox = calculateBoundingBox(text, x, y, fontSize);

        while (!isBoundingBoxInsidePolygon(bbox, vertices) && fontSize > 6) {
            fontSize -= 1;
            bbox = calculateBoundingBox(text, x, y, fontSize);
        }

        return { x, y, fontSize };
    };

    const drawTextInsideRoom = (roomName, sqft, centroid, vertices, initialFontSize) => {
        let fontSize = initialFontSize;

        const calculateBoundingBox = (text, x, y, fontSize) => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
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

            return points.every(point => isPointInPolygon(point, vertices));
        };

        const getAdjustedTextPosition = (text1, text2, x, y, vertices, initialFontSize) => {
            let fontSize = initialFontSize;
            let bbox1 = calculateBoundingBox(text1, x, y, fontSize);
            let bbox2 = calculateBoundingBox(text2, x, y + 15, fontSize);

            while (!(isBoundingBoxInsidePolygon(bbox1, vertices) && isBoundingBoxInsidePolygon(bbox2, vertices)) && fontSize > 6) {
                fontSize -= 1;
                bbox1 = calculateBoundingBox(text1, x, y, fontSize);
                bbox2 = calculateBoundingBox(text2, x, y + 15, fontSize);
            }

            return { x, y, fontSize };
        };

        const { x, y, fontSize: adjustedFontSize } = getAdjustedTextPosition(roomName, sqft, centroid.x, centroid.y, vertices, fontSize);

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
                    fontSize={adjustedFontSize}
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
                    const hiddenWalls = room.hiddenWalls || [];
                    const hiddenIndex = hiddenWalls.indexOf(index);
                    if (hiddenIndex !== -1) {
                        hiddenWalls.splice(hiddenIndex, 1);
                    }
                    return { ...room, hiddenWalls };
                }
                return room;
            });

            setRooms(updatedRooms);
            setSelectedWall(null);
        }
    };



    return (
        <>
            <div
                style={{ height: "94%", position: "relative" }}
                onTouchStart={(e) => { handleMouseDown(e); handleTouchStart(e); }}
                onMouseMove={handleMouseMove}
                onTouchMove={(e) => { handleMouseMove(e); handleTouchMove(e); }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchEnd={(e) => { handleMouseUp(e); handleTouchEnd(e); }}
                onWheel={handleWheel}
                onClick={handleSvgClick}
                onTouchCancel={handleMouseUp}
            >

                <svg
                    ref={svgRef}
                    width={"88vw"}
                    height={"100%"}
                    style={{ border: "1px solid #000", overflow: "hidden", userSelect: "none" }}
                >
                    {gridLines}
                    <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>

                        {rooms.map((room, roomIndex) => {
                            const centroid = calculateCentroid(room.vertices);

                            return (
                                <g
                                    key={roomIndex}
                                    id={`group-${roomIndex}`}
                                    onClick={(e) => handlePolygonClick(e, roomIndex)}
                                    fillOpacity={activeRoomIndex === roomIndex ? 1 : 0.5}
                                    className={activeRoomIndex !== null && activeRoomIndex !== roomIndex ? "opacity-60" : ""}
                                    transform={activeRoomIndex === roomIndex && isRotating ? `rotate(${room.rotationAngle || 0} ${centroid.x} ${centroid.y})` : ""}
                                >

                                    <polygon
                                        points={room.vertices.map((v) => `${v.x},${v.y}`).join(" ")}
                                        fill="#d3d3d3"
                                        stroke="#000000"
                                        strokeWidth="8"
                                    />

                                    {room.vertices.map((vertex, vertexIndex) => {
                                        const isSelectedWall =
                                            selectedWall &&
                                            selectedWall.roomIndex === roomIndex &&
                                            selectedWall.index === vertexIndex;

                                        const isHighlightedWall = highlightedWalls.some(
                                            (wall) =>
                                                wall.roomIndex === roomIndex &&
                                                wall.vertexIndex === vertexIndex
                                        );

                                        const isHiddenWall = room.hiddenWalls && room.hiddenWalls.includes(vertexIndex);
                                        const nextVertex = room.vertices[(vertexIndex + 1) % room.vertices.length];
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
                                                {isSelectedWall && isHiddenWall && <path
                                                    d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}
                                                    stroke="white"
                                                    strokeWidth={"8"}
                                                />}
                                                <path
                                                    d={`M ${reducedStartX} ${reducedStartY} L ${reducedEndX} ${reducedEndY}`}

                                                    stroke={isSelectedWall ? "#A0DEFF" : isHighlightedWall ? "#FF69B4" : isHiddenWall ? "#FFFFFF" : "black"}
                                                    strokeWidth={isSelectedWall || isHighlightedWall ? "8" : isHiddenWall ? "8" : "8"}
                                                    strokeDasharray={isSelectedWall && isHiddenWall ? "8, 5" : ""}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        selectWall(e);
                                                    }}
                                                />


                                            </g>
                                        );
                                    })}


                                    {drawTextInsideRoom(room.name, `${calculateArea(room.vertices).toFixed(2)} sq ft`, centroid, room.vertices, 16)}

                                    {activeRoomIndex === roomIndex && drawDimensions(room.vertices, roomIndex)}
                                    {activeRoomIndex === roomIndex &&
                                        room.vertices.map((vertex, vertexIndex) => (
                                            <g key={vertexIndex}>
                                                <circle
                                                    cx={vertex.x}
                                                    cy={vertex.y}
                                                    r={selectionRadius - 2.4} // Reduce the size of the circle by subtracting 2 from selectionRadius
                                                    fill={
                                                        hoveredVertex &&
                                                            hoveredVertex.roomIndex !== roomIndex &&
                                                            Math.abs(hoveredVertex.x - vertex.x) < selectionRadius &&
                                                            Math.abs(hoveredVertex.y - vertex.y) < selectionRadius
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
                                                            index: vertexIndex
                                                        });
                                                    }}
                                                />
                                                {selectedVertex && selectedVertex.roomIndex === roomIndex && selectedVertex.index === vertexIndex && (
                                                    <svg
                                                        x={vertex.x - 10}
                                                        y={vertex.y - 10}
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 512 512"
                                                        fill="#000000"
                                                    >
                                                        <path style={{ fill: "#9DDE8B" }} d="M493.121,235.927l-70.858-70.857c-5.34-5.34-12.441-8.281-19.992-8.281 c-7.553,0-14.652,2.94-19.993,8.281c-5.34,5.34-8.282,12.441-8.282,19.992c0,7.554,2.941,14.653,8.282,19.993l22.59,22.59H284.273 V106.734l22.59,22.59c5.34,5.34,12.441,8.282,19.993,8.282s14.652-2.941,19.993-8.283c5.339-5.34,8.281-12.44,8.281-19.992 c0-7.553-2.941-14.653-8.281-19.992L275.993,18.48c-5.342-5.339-12.442-8.281-19.994-8.281c-7.553,0-14.652,2.941-19.992,8.281 L165.15,89.338c-5.34,5.34-8.281,12.441-8.281,19.992c0,7.553,2.94,14.652,8.281,19.992c5.34,5.34,12.441,8.282,19.992,8.282 c7.554,0,14.653-2.941,19.993-8.282l22.59-22.59v120.913H107.131l22.59-22.59c5.34-5.34,8.282-12.441,8.282-19.993 s-2.941-14.652-8.283-19.993c-5.34-5.34-12.44-8.281-19.992-8.281c-7.553,0-14.653,2.941-19.992,8.281l-70.858,70.857 c-5.339,5.34-8.281,12.44-8.281,19.992c0,7.553,2.941,14.653,8.281,19.992l70.858,70.857c5.34,5.34,12.441,8.281,19.992,8.281 c7.551,0,14.652-2.94,19.992-8.281s8.282-12.441,8.282-19.992c0-7.554-2.941-14.653-8.282-19.993l-22.59-22.59h120.594v121.073 l-22.59-22.59c-5.34-5.34-12.441-8.282-19.993-8.282c-7.553,0-14.653,2.941-19.993,8.283c-5.34,5.34-8.281,12.44-8.281,19.992 c0,7.553,2.941,14.653,8.281,19.992l70.857,70.858c5.341,5.342,12.442,8.284,19.995,8.284c7.552,0,14.652-2.941,19.992-8.281l70.857-70.858 c5.34-5.34,8.281-12.441,8.281-19.992c0-7.553-2.94-14.652-8.281-19.992c-5.34-5.34-12.441-8.282-19.992-8.282 c-7.554,0-14.653,2.941-19.993,8.282l-22.59,22.59V284.195h120.594l-22.59,22.59c-5.34,5.341-8.282,12.441-8.282,19.993 c0,7.553,2.941,14.652,8.283,19.993c5.34,5.34,12.44,8.281,19.992,8.281c7.553,0,14.652-2.941,19.992-8.281l70.858-70.857 c5.339-5.34,8.281-12.44,8.281-19.992C501.402,248.367,498.461,241.267,493.121,235.927z" />
                                                    </svg>
                                                )}
                                            </g>
                                        ))}

                                    {mergeCandidates.length > 0 && activeRoomIndex === roomIndex && (
                                        <svg
                                            x={centroid.x - 20}
                                            y={centroid.y - 20}
                                            width="40"
                                            height="40"
                                            viewBox="0 0 256 256"
                                            fill="#d80e0e"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path fill="#d80e0e" d="M128,99.45c-15.77,0-28.55,12.78-28.55,28.55s12.78,28.55,28.55,28.55,28.55-12.78,28.55-28.55-12.78-28.55-28.55-28.55Z" />
                                                <path fill="#d80e0e" d="M128,57.37c-38.94,0-70.63,31.68-70.63,70.63s31.68,70.63,70.63,70.63,70.63-31.68,70.63-70.63-31.68-70.63-70.63-70.63ZM128,179.69c-28.55,0-51.69-23.14-51.69-51.69s23.14-51.69,51.69-51.69,51.69,23.14,51.69,51.69-23.14,51.69-51.69,51.69Z" />
                                                <path fill="#d80e0e" d="M128,17.1c-61.15,0-110.9,49.75-110.9,110.9s49.75,110.9,110.9,110.9,110.9-49.75,110.9-110.9S189.15,17.1,128,17.1ZM128,219.96c-50.79,0-91.96-41.17-91.96-91.96s41.17-91.96,91.96-91.96,91.96,41.17,91.96,91.96-41.17,91.96-91.96,91.96Z" />
                                            </g>
                                        </svg>
                                    )}
                                    {!isRotating && isMoving && mergeCandidates?.length == 0 && activeRoomIndex === roomIndex && (
                                        <svg
                                            x={centroid.x - 30}
                                            y={centroid.y - 30}
                                            width="60"
                                            height="60"
                                            viewBox="0 0 256 256"
                                            fill="##3a80c7"
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
                                                    {`.cls-1 { fill: #3a80c7; stroke-width: 0px; }`}
                                                </style>
                                            </defs>
                                            <path className="cls-1" d="M238.51,126.95l-21.19-29.92c-1.02-1.44-3.29-.72-3.29,1.05v13.11h-69.22V41.97h13.11c1.76,0,2.49-2.27,1.05-3.29l-29.92-21.19c-.63-.44-1.47-.44-2.09,0l-29.92,21.19c-1.44,1.02-.72,3.29,1.05,3.29h13.11v69.22H41.97v-13.11c0-1.76-2.27-2.49-3.29-1.05l-21.19,29.92c-.44.63-.44,1.47,0,2.09l21.19,29.92c1.02,1.44,3.29.72,3.29-1.05v-13.11h69.22v69.22h-13.11c-1.76,0-2.49,2.27-1.05,3.29l29.92,21.19c.63.44,1.47.44,2.09,0l29.92-21.19c1.44-1.02.72-3.29-1.05-3.29h-13.11v-69.22h69.22v13.11c0,1.76,2.27,2.49,3.29,1.05l21.19-29.92c.44-.63.44-1.47,0-2.09Z" />
                                        </svg>
                                    )}
                                    {activeRoomIndex === roomIndex && isRotating && (
                                        <svg
                                            x={centroid.x + 50 * Math.cos(room.rotationAngle || 0) - 30}
                                            y={centroid.y + 50 * Math.sin(room.rotationAngle || 0) - 30}
                                            width="60"
                                            height="60"
                                            viewBox="0 0 256 256"
                                            fill="#3a80c7"
                                            transform={`rotate(${(room.rotationAngle || 0) * (180 / Math.PI)} ${centroid.x + 50 * Math.cos(room.rotationAngle || 0)} ${centroid.y + 50 * Math.sin(room.rotationAngle || 0)})`}
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
                                        >
                                            <defs>
                                                <style>
                                                    {`.cls-1 { fill: #3a80c7; stroke-width: 0px; }`}
                                                </style>
                                            </defs>
                                            <path
                                                className="cls-1"
                                                d="M170.5,201.05l-27.92-.82c15.15-48.15,15.15-96.31,0-144.46l27.92-.82c.92-.03,1.22-1.25.42-1.7L106.88,17.27c-.49-.27-1.1-.05-1.3.48l-20.91,56.23c-.29.78.53,1.51,1.27,1.12l17.68-9.19c12.2,41.29,12.19,82.72.18,124.28l-17.85-9.28c-.74-.38-1.56.34-1.27,1.12l20.91,56.23c.19.52.81.75,1.3.48l64.04-35.98c.8-.45.5-1.67-.42-1.7Z"
                                            />
                                        </svg>
                                    )}








                                </g>
                            )
                        })
                        }

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
                                <line
                                    x1={elasticLine.start.x}
                                    y1={elasticLine.start.y}
                                    x2={elasticLine.end.x}
                                    y2={elasticLine.end.y}
                                    stroke="green"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                />
                                <svg
                                    x={Math.min(elasticLine.start.x, elasticLine.end.x) - 12}
                                    y={Math.min(elasticLine.start.y, elasticLine.end.y) - 12}
                                    width={Math.abs(elasticLine.end.x - elasticLine.start.x) + 24}
                                    height={Math.abs(elasticLine.end.y - elasticLine.start.y) + 24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M16 18.5C16 19.8807 17.1193 21 18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16M16 18.5C16 17.1193 17.1193 16 18.5 16M16 18.5H8M18.5 16V8M8 18.5C8 19.8807 6.88071 21 5.5 21C4.11929 21 3 19.8807 3 18.5C3 17.1193 4.11929 16 5.5 16M8 18.5C8 17.1193 6.88071 16 5.5 16M5.5 16V8M5.5 8C4.11929 8 3 6.88071 3 5.5C3 4.11929 4.11929 3 5.5 3C6.88071 3 8 4.11929 8 5.5M5.5 8C6.88071 8 8 6.88071 8 5.5M8 5.5H16M18.5 8C17.1193 8 16 6.88071 16 5.5M18.5 8C19.8807 8 21 6.88071 21 5.5C21 4.11929 19.8807 3 18.5 3C17.1193 3 16 4.11929 16 5.5"
                                        fill="green"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </>
                        )}

                        {hoveredVertex && (
                            <circle
                                cx={hoveredVertex.x}
                                cy={hoveredVertex.y}
                                r={redDotRadius}
                                fill="#FF0000"
                                stroke="black"
                                strokeWidth="0.3"
                            />
                        )}
                        {mergeCandidates.map((candidate, index) => {
                            const activeRoomCentroid = calculateCentroid(rooms[activeRoomIndex].vertices);
                            const angle = calculateAngle(activeRoomCentroid, candidate.centroid);

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
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <g id="Layer_1" data-name="Layer 1" transform={`rotate(${angle - 90}, 128, 128)`}>
                                        <path style={{ fill: "#6cb159" }} d="M178.56,80.62l-48.62-62.51c-.98-1.26-2.89-1.26-3.88,0l-48.62,62.51c-1.36,1.75.12,4.27,2.31,3.93l28.18-4.35v98.62c-8.07,6.09-13.32,15.74-13.32,26.64,0,18.44,14.95,33.39,33.39,33.39s33.39-14.95,33.39-33.39c0-10.9-5.24-20.54-13.32-26.64v-98.62l28.18,4.35c2.19.34,3.68-2.18,2.31-3.93Z" />
                                    </g>
                                </svg>
                            );
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
                            Are you sure you want to change the length of the wall? This wall is locked.
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={() => handleWallChangeConfirmation(true)}>
                                Confirm
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => handleWallChangeConfirmation(false)}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </Modal>
            </div >
            {selectedWall && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "200px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        border: "1px solid #000",
                        borderRadius: "5px",
                    }}
                >
                    <Typography variant="h6">Wall Length</Typography>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            label="Feet"
                            type="number"
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            disabled={rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] !== undefined}
                        />
                        <TextField
                            label="Inches"
                            type="number"
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                            disabled={rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] !== undefined}
                        />
                    </Stack>
                    <Button
                        onClick={handleLengthChange}
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                        disabled={rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] !== undefined}
                    >
                        Lock Wall
                    </Button>
                    {rooms[selectedWall.roomIndex].lockedWalls[selectedWall.index] !== undefined && (
                        <Button
                            onClick={unlockWall}
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: "10px" }}
                        >
                            Unlock Wall
                        </Button>
                    )}
                </div>
            )
            }
            {
                selectedWall &&

                <button
                    onClick={addVertex}
                    disabled={!selectedWall}
                    className={`p-1 border-[1px] border-black rounded ${!selectedWall ? "bg-slate-200 text-slate-600" : "bg-slate-500 text-white"} mx-1`}
                >
                    Add Vertex
                </button>
            }

            {
                activeRoomIndex !== null && <>
                    <button
                        onClick={rotateRoom}
                        disabled={activeRoomIndex === null}
                        className={`p-1 border-[1px] border-black rounded ${activeRoomIndex === null ? "bg-slate-200 text-slate-600" : "bg-slate-500 text-white"} mx-1`}
                    >
                        Rotate Room
                    </button>

                    <button
                        onClick={prepareMergeRoom}
                        disabled={activeRoomIndex === null}
                        className={`p-1 border-[1px] border-black rounded ${activeRoomIndex === null ? "bg-slate-200 text-slate-600" : "bg-slate-500 text-white"} mx-1`}
                    >
                        Merge Room
                    </button>
                </>
            }
            {
                selectedWall &&
                <button
                    onClick={selectedWall && rooms[selectedWall.roomIndex].hiddenWalls.includes(selectedWall.index) ? restoreWall : hideWall}
                    disabled={!selectedWall}
                    className={`p-1 border-[1px] border-black rounded mx-1 ${!selectedWall ? "bg-slate-200 text-slate-600" : "bg-slate-500 text-white"}`}
                >
                    {selectedWall && rooms[selectedWall.roomIndex].hiddenWalls.includes(selectedWall.index) ? "Restore Wall" : "Delete Wall"}
                </button>
            }
            {
                activeRoomIndex !== null &&
                <button
                    onClick={deleteRoom}
                    disabled={activeRoomIndex === null}
                    className={`p-1 border-[1px] border-black rounded ${activeRoomIndex === null ? "bg-slate-200 text-slate-600" : "bg-slate-500 text-white"}  mx-1`}
                >
                    Delete Room
                </button>
            }

        </>
    );
};

export default Svg;
