export const getIncreamentedAngle = (
  pos,
  center,
  initialAngle,
  setRotationIconColor
) => {
  let angle = Math.atan2(pos.y - center.y, pos.x - center.x);

  if (angle < 0) {
    angle += 2 * Math.PI;
  }
  const angleIncrement = angle - initialAngle;
  const angleDegrees = Math.abs(angle * (180 / Math.PI));

  changeRotationIconColor(angleDegrees, setRotationIconColor);

  const rotatePoint = (point, center, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
      x: center.x + dx * cos - dy * sin,
      y: center.y + dx * sin + dy * cos,
    };
  };

  return { angle, angleIncrement, rotatePoint };
};

export const changeRotationIconColor = (angleDegrees, setRotationIconColor) => {
  const angleInDegreesCondition = getAngleInDergreeCondition(angleDegrees);
  if (angleInDegreesCondition) {
    setRotationIconColor("#9DDE8B");
  } else {
    setRotationIconColor("#3a80c7");
  }
};

export const getAngleInDergreeCondition = (angleDegrees) => {
  return (
    angleDegrees >= 350 ||
    angleDegrees <= 10 ||
    (angleDegrees >= 35 && angleDegrees <= 55) ||
    (angleDegrees >= 80 && angleDegrees <= 100) ||
    (angleDegrees >= 125 && angleDegrees <= 145) ||
    (angleDegrees >= 170 && angleDegrees <= 190) ||
    (angleDegrees >= 215 && angleDegrees <= 235) ||
    (angleDegrees >= 260 && angleDegrees <= 280) ||
    (angleDegrees >= 305 && angleDegrees <= 325)
  );
};

export const getBoundingBox = (vertices) => {
  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);
  return {
    x1: Math.min(...xs),
    y1: Math.min(...ys),
    x2: Math.max(...xs),
    y2: Math.max(...ys),
  };
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

export const doBoundingBoxesIntersect = (staircase, roomVertices) => {
  const roomBoundingBox = getBoundingBox(roomVertices);
  const staircaseBoundingBox = {
    x1: staircase.x,
    y1: staircase.y,
    x2: staircase.x + staircase.width,
    y2: staircase.y + staircase.height,
  };

  return !(
    staircaseBoundingBox.x2 < roomBoundingBox.x1 ||
    staircaseBoundingBox.x1 > roomBoundingBox.x2 ||
    staircaseBoundingBox.y2 < roomBoundingBox.y1 ||
    staircaseBoundingBox.y1 > roomBoundingBox.y2
  );
};

export const isStaircaseInRoom = (staircase, roomVertices) => {
  return (
    areAllCornersInPolygon(staircase, roomVertices) ||
    doBoundingBoxesIntersect(staircase, roomVertices)
  );
};

export const areAllCornersInPolygon = (staircase, roomVertices) => {
  const corners = [
    { x: staircase.x, y: staircase.y }, // top-left
    { x: staircase.x + staircase.width, y: staircase.y }, // top-right
    { x: staircase.x, y: staircase.y + staircase.height }, // bottom-left
    { x: staircase.x + staircase.width, y: staircase.y + staircase.height }, // bottom-right
  ];

  const centroid = {
    x: staircase.x + staircase.width / 2,
    y: staircase.y + staircase.height / 2,
  };

  const isCentroidInPolygon = isPointInPolygon(centroid, roomVertices);
  const areCornersInPolygon = corners.every((corner) =>
    isPointInPolygon(corner, roomVertices)
  );

  return isCentroidInPolygon || areCornersInPolygon;
};
