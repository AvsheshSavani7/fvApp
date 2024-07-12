import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import productJson from "../components/product-catalogue/static-products/product_12th_Mar_24.json";

const productSlice = createSlice({
  name: "productReducer",
  initialState: {
    products: productJson.data,
    selectedProduct: null,
    selectedProducts: [],
    initialProducts: [],
  },
  reducers: {
    onProductSelection: (state, action) => {
      const productId = action.payload;
      if (productId) {
        state.selectedProduct = productId;
      } else {
        // clear all
        state.selectedProduct = null;
      }
    },
    setInitialProducts: (state, action) => {
      state.selectedProducts = action.payload;
      state.initialProducts = action.payload;
    },
    updateProducts: (state, action) => {
      const type = action.payload.TYPE;

      let clonedProducts = JSON.parse(JSON.stringify(state.selectedProducts));

      switch (type) {
        case "ADD":
          const { product, floorName, room } = action.payload.ITEM;
          if (!product || !floorName || !room) return;

          const existingProdIndex = clonedProducts.findIndex(
            (p) => p.id === product.id
          );

          if (existingProdIndex === -1) {
            const productToAdd = {
              ...product,
              floors: [{ name: floorName, rooms: [room] }],
            };
            clonedProducts.push(productToAdd);
          } else {
            const existingFloorIndex = clonedProducts[
              existingProdIndex
            ].floors.findIndex((f) => f.name === floorName);

            if (existingFloorIndex === -1) {
              const floorToAdd = { name: floorName, rooms: [room] };

              clonedProducts[existingProdIndex] = {
                ...clonedProducts[existingProdIndex],
                quantity: product.quantity,
                originalQty: product.originalQty,
                floors: [
                  ...clonedProducts[existingProdIndex].floors,
                  floorToAdd,
                ],
              };
            } else {
              const existingRoomIndex = clonedProducts[
                existingProdIndex
              ].floors[existingFloorIndex].rooms.findIndex(
                (r) => r.id === room.id
              );

              if (existingRoomIndex === -1) {
                clonedProducts[existingProdIndex] = {
                  ...clonedProducts[existingProdIndex],
                  quantity: product.quantity,
                  originalQty: product.originalQty,
                  floors: clonedProducts[existingProdIndex].floors.map((f) => {
                    if (f.name === floorName) {
                      return { ...f, rooms: [...f.rooms, room] };
                    }
                    return f;
                  }),
                };
              }
            }
          }

          state.selectedProducts = clonedProducts;
          break;

        case "DELETE":
          const pr = action.payload.ITEM.product;
          let filteredProds = clonedProducts.filter((p) => p.id !== pr.id);
          state.selectedProducts = filteredProds;
          break;

        case "DELETE_ROOM_FROM_PRODUCT":
          const item = action.payload.ITEM;

          let updatedProducts = clonedProducts
            .map((product) => {
              if (product.id !== item.product.id) {
                return product;
              } else {
                product.floors = product.floors
                  .map((floor) => {
                    if (floor.name !== item.floorName) {
                      return floor;
                    } else {
                      floor.rooms = floor.rooms.filter(
                        (room) => room.id !== item.room.id
                      );
                      return floor;
                    }
                  })
                  ?.filter((floor) => floor.rooms.length > 0);

                return product;
              }
            })
            ?.filter((product) => product.floors.length > 0)
            ?.map((product) => {
              let newQuantity = product.floors.reduce((total, floor) => {
                return (
                  total +
                  floor.rooms.reduce((sum, room) => sum + Number(room.area), 0)
                );
              }, 0);

              newQuantity = parseFloat(newQuantity.toFixed(2));

              if (product.Scrap_Rate) {
                newQuantity *= 1 + product.Scrap_Rate / 100;
              }

              return {
                ...product,
                quantity: newQuantity,
              };
            });

          state.selectedProducts = updatedProducts;
          break;

        default:
          break;
      }
    },
  },
});

export const { onProductSelection, updateProducts, setInitialProducts } =
  productSlice.actions;

export default productSlice.reducer;
