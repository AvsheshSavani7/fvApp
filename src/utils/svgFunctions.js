

export const handleMouseDown = (
    e,
    rooms,
    setRooms,
    activeRoomIndex,
    selectionRadius,
    isRotating,
    setIsRotating,
    isMoving,
    setIsMoving,
    setOldRooms,
    setPanning,
    setPanStart,
    setDragging,
    setDraggingMoveIcon,
    setDraggingDoor,
    setCurrentPoint,
    setSelectedDoor,
    svgRef, scale,
    translate
) => {
    setOldRooms(rooms);
    const pos = getMousePosition(e, svgRef, translate, scale);
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

    room.vertices?.forEach((vertex, vertexIndex) => {
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
        room.vertices?.forEach((vertex, vertexIndex) => {
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


// touchHandlers.js
export const handleTouchMove = (
    e,
    rooms,
    setRooms,
    resizingDoor,
    initialTouchDistance,
    selectedDoor,
    initialTouchDoorLength,
    initialDistance,
    initialScale,
    svgRef,
    translate,
    scale,
    setScale,
    setTranslate,
    calculateDistance
) => {
    if (e.touches.length === 2) {
        const distance = calculateDistance(e.touches[0], e.touches[1]);

        if (resizingDoor && initialTouchDistance && selectedDoor) {
            const scaleFactor = distance / initialTouchDistance;
            const newDoorLength = initialTouchDoorLength * scaleFactor;

            const { roomIndex, doorIndex } = selectedDoor;
            const room = rooms[roomIndex];
            const door = room.doors[doorIndex];

            const wallDirection = {
                x: door.end.x - door.start.x,
                y: door.end.y - door.start.y,
            };
            const wallLength = Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2);

            // Ensure the new door length does not exceed the wall length
            const adjustedDoorLength = Math.min(newDoorLength, wallLength);

            const wallUnitVector = {
                x: wallDirection.x / wallLength,
                y: wallDirection.y / wallLength,
            };

            const doorCenter = {
                x: (door.start.x + door.end.x) / 2,
                y: (door.start.y + door.end.y) / 2,
            };

            const halfLengthVector = {
                x: (adjustedDoorLength / 2) * wallUnitVector.x,
                y: (adjustedDoorLength / 2) * wallUnitVector.y,
            };

            const newDoorStart = {
                x: doorCenter.x - halfLengthVector.x,
                y: doorCenter.y - halfLengthVector.y,
            };
            const newDoorEnd = {
                x: doorCenter.x + halfLengthVector.x,
                y: doorCenter.y + halfLengthVector.y,
            };

            const updatedRooms = rooms.map((r, i) =>
                i === roomIndex
                    ? {
                        ...r,
                        doors: r.doors.map((d, j) =>
                            j === doorIndex ? { ...d, start: newDoorStart, end: newDoorEnd } : d
                        ),
                    }
                    : r
            );

            setRooms(updatedRooms);
            console.log("Resizing door", newDoorStart, newDoorEnd);
            return; // Return early to skip the zoom functionality
        }

        // Zoom functionality if not resizing the door
        if (!resizingDoor && initialDistance) {
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


// Function to calculate the centroid of a set of vertices
export const calculateCentroid = (vertices) => {
    let x = 0,
        y = 0;
    vertices?.forEach((v) => {
        x += v.x;
        y += v.y;
    });
    return { x: x / vertices?.length, y: y / vertices?.length };
};

export const getMousePosition = (evt, svgRef, translate, scale) => {
    const CTM = svgRef.current.getScreenCTM();
    const clientX = evt.clientX || evt.touches[0].clientX;
    const clientY = evt.clientY || evt.touches[0].clientY;
    return {
        x: (clientX - CTM.e - translate.x) / (CTM.a * scale),
        y: (clientY - CTM.f - translate.y) / (CTM.d * scale),
    };
};

export const isPointNearLine = (x, y, x1, y1, x2, y2, tolerance) => {
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


// dimension draw

export const drawTriangle = (x, y, angle, triangleSize) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return `
          M ${x} ${y}
          L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos}
          L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos}
          Z
      `;
};

export const drawDimensions = (
    vertices,
    roomIndex,
    rooms,
    dimensionOffset,
    convertToFeetAndInches
) => {
    const triangleSize = 3;

    return vertices.map((vertex, index) => {
        const nextVertex = vertices[(index + 1) % vertices.length];
        const length = Math.sqrt(
            Math.pow(nextVertex.x - vertex.x, 2) + Math.pow(nextVertex.y - vertex.y, 2)
        );
        const midX = (vertex.x + nextVertex.x) / 2;
        const midY = (vertex.y + nextVertex.y) / 2;
        const angle = Math.atan2(nextVertex.y - vertex.y, nextVertex.x - vertex.x);
        const offsetX = dimensionOffset * Math.cos(angle - Math.PI / 2);
        const offsetY = dimensionOffset * Math.sin(angle - Math.PI / 2);

        const { feet, inches } = convertToFeetAndInches(length);
        const dimensionText = `${feet}'${inches}"`;
        const textX = midX + offsetX * 1.5;
        const textY = midY + offsetY * 1.5;

        const isLocked =
            rooms[roomIndex].lockedWalls && rooms[roomIndex].lockedWalls[index] !== undefined;

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
                    d={drawTriangle(vertex.x + offsetX, vertex.y + offsetY, angle + Math.PI, triangleSize)}
                    fill="#5c5c5c"
                />
                <path
                    d={drawTriangle(nextVertex.x + offsetX, nextVertex.y + offsetY, angle, triangleSize)}
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
                    <svg x={textX + 15} y={textY - 10} width="16" height="16" viewBox="0 0 24 24" fill="none">
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


// Adjust point to ensure it stays within the room boundaries
export const adjustPointToRoom = (point, vertices) => {
    let adjustedPoint = { ...point };

    vertices?.forEach((vertex, index) => {
        const nextVertex = vertices[(index + 1) % vertices.length];
        const isPointInside = isPointInPolygon(adjustedPoint, vertices);

        if (!isPointInside) {
            // Logic to adjust the point to ensure it stays within the room boundaries
            const wallDirection = {
                x: nextVertex.x - vertex.x,
                y: nextVertex.y - vertex.y,
            };
            const wallLength = Math.sqrt(wallDirection.x ** 2 + wallDirection.y ** 2);
            const wallUnitVector = {
                x: wallDirection.x / wallLength,
                y: wallDirection.y / wallLength,
            };

            const vertexToStart = {
                x: adjustedPoint.x - vertex.x,
                y: adjustedPoint.y - vertex.y,
            };
            const dotProduct = vertexToStart.x * wallUnitVector.x + vertexToStart.y * wallUnitVector.y;
            const projection = {
                x: vertex.x + dotProduct * wallUnitVector.x,
                y: vertex.y + dotProduct * wallUnitVector.y,
            };

            adjustedPoint = projection;
        }
    });

    return adjustedPoint;
};

// Check if a point is inside a polygon
export const isPointInPolygon = (point, vertices) => {
    let isInside = false;
    const x = point.x;
    const y = point.y;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
};

export const highlightNearestVertex = (movedRoom, movedRoomIndex, pos, distance, setNearestVertices, rooms) => {
    const nearestVertices = [];
    let minDistance = distance || 18;

    // Iterate over the vertices of the moved room
    movedRoom.vertices?.forEach((vertex, vertexIndex) => {
        rooms?.forEach((room, roomIndex) => {
            if (roomIndex !== movedRoomIndex) {
                room.vertices?.forEach((otherVertex, otherVertexIndex) => {
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



export const snapRoomToHighlightedWall = (updatedRooms, highlightedWall, rooms, activeRoomIndex) => {
    if (!highlightedWall.length) return updatedRooms;

    const { roomIndex: targetRoomIndex, vertexIndex: targetVertexIndex } =
        highlightedWall[0];
    const targetRoom = rooms[targetRoomIndex];
    const targetVertex1 = targetRoom.vertices[targetVertexIndex];
    const targetVertex2 =
        targetRoom.vertices[(targetVertexIndex + 1) % targetRoom.vertices.length];

    const currentRoom = updatedRooms[activeRoomIndex];
    let nearestVertex = null;
    let minDistance = Infinity;

    currentRoom.vertices?.forEach((vertex) => {
        const distance = distanceToLineSegment(
            vertex,
            targetVertex1.x,
            targetVertex1.y,
            targetVertex2.x,
            targetVertex2.y
        );
        if (distance < minDistance) {
            minDistance = distance;
            nearestVertex = vertex;
        }
    });

    if (nearestVertex && targetVertex1 && targetVertex2) {
        const nearestPointOnWall = getNearestPointOnLineSegment(
            nearestVertex,
            targetVertex1,
            targetVertex2
        );
        const offsetX = nearestPointOnWall.x - nearestVertex.x;
        const offsetY = nearestPointOnWall.y - nearestVertex.y;

        const newVertices = currentRoom.vertices.map((vertex) => ({
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

export const distanceToLineSegment = (point, x1, y1, x2, y2) => {
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


export const getNearestPointOnLineSegment = (point, lineStart, lineEnd) => {
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

export const calculateCenters = (vertices) => {
    const centers = [];
    vertices?.forEach((vertex, index) => {
        const nextVertex = vertices[(index + 1) % vertices.length];
        centers.push({
            x: (vertex.x + nextVertex.x) / 2,
            y: (vertex.y + nextVertex.y) / 2,
        });
    });
    return centers;
};


export const calculateRoomsBoundingBox = (rooms) => {
    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    rooms?.forEach((room) => {
        room.vertices?.forEach((v) => {
            if (v.x < minX) minX = v.x;
            if (v.y < minY) minY = v.y;
            if (v.x > maxX) maxX = v.x;
            if (v.y > maxY) maxY = v.y;
        });
    });

    return { minX, minY, maxX, maxY };
};


export const snapToNearest45 = (angle) => {
    const snappedAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    return snappedAngles.reduce((prev, curr) =>
        Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
    );
};

export const calculateDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

export const calculateOffsetVertices = (vertices, offset) => {
    const offsetVertices = [];

    for (let i = 0; i < vertices?.length; i++) {
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
            x: vectorPrev.x / lengthPrev || 0,
            y: vectorPrev.y / lengthPrev || 0,
        };
        const unitVectorNext = {
            x: vectorNext.x / lengthNext || 0,
            y: vectorNext.y / lengthNext || 0,
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