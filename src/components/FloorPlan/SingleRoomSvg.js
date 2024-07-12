import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import _ from "lodash";
import { singleCustomer } from "../../redux/customer";
import { updateProducts } from "../../redux/product";

const SingleRoomSvg = (props) => {
  const {
    roomIndex,
    setHoveredRoomIndex,
    room,
    calculateCentroid,
    calculateArea,
    setOpen,
    setMessage,
    setType,
    offsetVertices,
  } = props;

  const products = useSelector((state) => state.productReducer.products);

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const selectedProducts = useSelector(
    (state) => state.productReducer.selectedProducts
  );
  const selectedProduct = useSelector(
    (state) => state.productReducer.selectedProduct
  );

  const dispatch = useDispatch();
  const dimensionOffset = 26;
  const doorDimensionOffset = 13;

  const checkIfroomIsExistInProd = useCallback(() => {
    const existingProd =
      selectedProducts?.find((p) => p.id === selectedProduct) || [];
    return existingProd?.floors
      ?.flatMap((f) => f.rooms)
      .some((r) => r.id === room.id);
  }, [selectedProducts, selectedProduct, room]);

  const clickRoom = useCallback(() => {
    if (!selectedProduct) return;

    const roomIsExistInProd = checkIfroomIsExistInProd();
    const existingProd = selectedProducts?.find(
      (p) => p.id === selectedProduct
    );
    const mainProduct = products?.find((p) => p.id === selectedProduct);

    if (!roomIsExistInProd) {
      const qtyToConsider = existingProd
        ? existingProd.originalQty + parseFloat(area)
        : parseFloat(area);
      const scrapRate = mainProduct.Scrap_Rate;

      const newQuantity = getQty("withScrapRate", scrapRate, qtyToConsider);
      const originalQty = getQty("original", scrapRate, qtyToConsider);

      addProductInRoom(originalQty, newQuantity, mainProduct);
    } else {
      const clonedCustomer = JSON.parse(JSON.stringify(singleCustomerData));
      const floors = clonedCustomer.scope.floors;

      const updatedFloors = floors?.map((floor) => ({
        ...floor,
        rooms: floor?.rooms.map((r) => {
          if (r.id === room.id) {
            const filetredProds = r.products.filter(
              (p) => p.id !== selectedProduct
            );
            return { ...r, products: filetredProds };
          }
          return r;
        }),
      }));

      clonedCustomer.scope.floors = updatedFloors;

      dispatch(singleCustomer(clonedCustomer));

      const itemToRemove = {
        product: existingProd,
        floorName: selectedFloor.name,
        room: { ...room, area },
      };

      dispatch(
        updateProducts({
          TYPE: "DELETE_ROOM_FROM_PRODUCT",
          ITEM: itemToRemove,
        })
      );

      setOpen(true);
      setMessage("Product deleted from room!");
      setType("success");
    }
  }, [
    selectedProducts,
    selectedProduct,
    selectedFloor,
    singleCustomerData,
    setOpen,
    setMessage,
    setType,
  ]);

  const centroid = useMemo(() => {
    return calculateCentroid(room.vertices);
  }, [calculateCentroid, room]);

  const area = useMemo(() => {
    return calculateArea(room.vertices)?.toFixed(2);
  }, [calculateArea, room]);

  console.log(selectedProducts, "selectedProducts");

  const addProductInRoom = async (
    originalQty,
    newQuantityWithScrapRate,
    product
  ) => {
    const productObject = {
      id: product.id,
      name: product.Product_Name,
      quantity: area,
      short_code: product.Short_Code,
      usage_unit: product.Usage_Unit,
      scrapRate: product.Scrap_Rate,
    };

    const clonedCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    const floors = clonedCustomer.scope.floors;

    let isProdExistInRoom = false;
    const updatedFloors = floors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms.map((r) => {
        if (r.id === room.id) {
          if (_.has(r, "products")) {
            if (r.products.some((p) => p.id === product.id)) {
              isProdExistInRoom = true;
            }

            const newProds = _.uniqBy(
              [...r.products, productObject],
              (p) => p.id
            );
            return { ...r, products: newProds };
          } else {
            return { ...r, products: [productObject] };
          }
        }
        return r;
      }),
    }));

    console.log(isProdExistInRoom, floors, "floors66");

    clonedCustomer.scope.floors = updatedFloors;

    const itemToAdd = {
      product: {
        ...product,
        originalQty,
        quantity: parseFloat(newQuantityWithScrapRate?.toFixed(2)),
      },
      floorName: selectedFloor.name,
      room: { ...room, area },
    };

    dispatch(singleCustomer(clonedCustomer));
    if (!isProdExistInRoom) {
      dispatch(updateProducts({ TYPE: "ADD", ITEM: itemToAdd }));
      setOpen(true);
      setMessage("Product added to the room!");
      setType("success");
    } else {
      setOpen(true);
      setMessage("Product already exist in room!");
      setType("error");
    }
  };

  const qtyWithScrapRate = (qty, scrapRate) => {
    const qtyWithScrapRate = qty * (1 + scrapRate / 100);
    return parseFloat(qtyWithScrapRate?.toFixed(2));
  };

  const getQty = (type, scrapRate, qtyToConsider) => {
    switch (type) {
      case "original":
        return qtyToConsider;

      case "withScrapRate":
        const newQtyWithScrapRate = scrapRate
          ? qtyWithScrapRate(qtyToConsider, scrapRate)
          : qtyToConsider;
        return newQtyWithScrapRate;

      default:
        return null;
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: "PRODUCT",
    drop: (item) => {
      const product = item?.item;

      const existingProd = selectedProducts?.find((p) => p.id === product.id);

      const qtyToConsider = existingProd
        ? existingProd.originalQty + parseFloat(area)
        : parseFloat(area);
      const scrapRate = product.Scrap_Rate;

      const newQuantity = getQty("withScrapRate", scrapRate, qtyToConsider);
      const originalQty = getQty("original", scrapRate, qtyToConsider);

      addProductInRoom(originalQty, newQuantity, product);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });


  const convertToFeetAndInches = (pixels) => {
    const gridSize = 20;
    const totalInches = Math.round((pixels / gridSize) * 12);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
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

      const isLocked = room?.lockedWalls &&
        room?.lockedWalls[index] !== undefined;

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
            strokeDasharray="1.5,1.2" />
          <line
            x1={nextVertex.x}
            y1={nextVertex.y}
            x2={nextVertex.x + offsetX}
            y2={nextVertex.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2" />

          {/* Dimension line */}
          <line
            x1={vertex.x + offsetX}
            y1={vertex.y + offsetY}
            x2={nextVertex.x + offsetX}
            y2={nextVertex.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="1" />
          <path
            d={drawTriangle(
              vertex.x + offsetX,
              vertex.y + offsetY,
              angle + Math.PI
            )}
            fill="#5c5c5c" />
          <path
            d={drawTriangle(
              nextVertex.x + offsetX,
              nextVertex.y + offsetY,
              angle
            )}
            fill="#5c5c5c" />
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
                strokeLinejoin="round" />
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
      L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos}
      L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos}
      Z
    `;
    };

    return doors?.map((door, index) => {
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
            strokeDasharray="1.5,1.2" />
          <line
            x1={door.end.x}
            y1={door.end.y}
            x2={door.end.x + offsetX}
            y2={door.end.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="0.5"
            strokeDasharray="1.5,1.2" />

          {/* Dimension line */}
          <line
            x1={door.start.x + offsetX}
            y1={door.start.y + offsetY}
            x2={door.end.x + offsetX}
            y2={door.end.y + offsetY}
            stroke="#5c5c5c"
            strokeWidth="1" />
          <path
            d={drawTriangle(
              door.start.x + offsetX,
              door.start.y + offsetY,
              angle + Math.PI
            )}
            fill="#5c5c5c" />
          <path
            d={drawTriangle(door.end.x + offsetX, door.end.y + offsetY, angle)}
            fill="#5c5c5c" />
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

  const drawTriangle = (x, y, angle) => {
    const triangleSize = 3;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return `
      M ${x} ${y}
      L ${x - triangleSize * cos + triangleSize * sin} ${y - triangleSize * sin - triangleSize * cos}
      L ${x - triangleSize * cos - triangleSize * sin} ${y - triangleSize * sin + triangleSize * cos}
      Z
    `;
  };
  return (
    <>
      <g
        key={roomIndex}
        onMouseEnter={() => setHoveredRoomIndex(roomIndex)}
        onMouseLeave={() => setHoveredRoomIndex(null)}
        ref={drop}
      >
        <polygon
          points={offsetVertices.map((v) => `${v.x},${v.y}`).join(" ")}
          fillOpacity={0}
          stroke={"#000000"}
          strokeWidth="8"
          mask={`url(#maskRoom-${roomIndex})`}
        />
        <polygon
          points={room.vertices.map((v) => `${v.x},${v.y}`).join(" ")}
          fill={
            checkIfroomIsExistInProd()
              ? "#F28C28"
              : isOver
                ? "#d3d3d3"
                : "#F5F5F5"
          }
          stroke={"#000000"}
          strokeWidth="8"
          onClick={clickRoom}
        />
        <text
          x={centroid?.x}
          y={centroid?.y}
          textAnchor="middle"
          fontSize="16"
          fill="#000000"
          onClick={clickRoom}
        >
          {room.name}
        </text>
        <text
          x={centroid?.x}
          y={centroid?.y + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#000000"
          onClick={clickRoom}
        >
          {`${area} sq ft`}
        </text>
        {/* {drawDimensions(room.vertices, roomIndex)} */}
        {/* {drawDoorDimensions(room?.doors)} */}

      </g>
    </>
  );
};

export default SingleRoomSvg;
