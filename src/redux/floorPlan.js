import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { DRAWING_ROOM_DEFAULT_DATA_TO_STORE } from "../utils/Constants";

const floorsObj = { Basement: [], "Floor 1": [], "Floor 2": [], "Floor 3": [] };

const floorPlanSlice = createSlice({
  name: "floorPlan",
  initialState: {
    isFloorPlanDataExistForCustomer: false,
    selectedFloor: null,
    selectedRoomToDraw: null,
    selectedMethod: null,
    selectedMode: "drawing",
    drawingRooms: floorsObj,
    floorStaircases: floorsObj,
    initialDrawingRooms: floorsObj,
    initialFloorStaircases: floorsObj,
  },
  reducers: {
    setIsFloorPlanDataExistForCustomer: (state, action) => {
      const isExist = action.payload ? true : false;
      state.isFloorPlanDataExistForCustomer = isExist;
    },
    setMode: (state, action) => {
      state.selectedMode = action.payload;
    },
    setFloor: (state, action) => {
      state.selectedFloor = action.payload;
      state.selectedRoomToDraw = null;
    },
    setRoomToDraw: (state, action) => {
      state.selectedRoomToDraw = action.payload;
    },
    selectMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
    setInitialDataForDrawingRooms: (state, action) => {
      state.initialDrawingRooms = action.payload;
    },
    setDrawingRoomsInFloor: (state, action) => {
      if (_.has(action.payload, "room")) {
        const newRoom = action.payload.room;
        const floorName = action.payload.floorName;
        const newRoomToAdd = {
          id: newRoom.id,
          name: newRoom.name,
          ...DRAWING_ROOM_DEFAULT_DATA_TO_STORE,
        };

        let curRoomsInFloor = state.drawingRooms[floorName] || [];

        let updatedRooms = _.uniqBy(
          [...curRoomsInFloor, newRoomToAdd],
          (room) => room.id
        );

        state.drawingRooms[floorName] = updatedRooms;
      } else {
        state.drawingRooms = action.payload;
      }
    },
    setUpdateFloors: (state, action) => {
      state.drawingRooms[action?.payload.floorName] = action.payload.rooms;
    },
    setStaircases: (state, action) => {
      state.floorStaircases = action.payload;
    },
    updateStaircases: (state, action) => {
      const type = action.payload.TYPE;
      let tmpStaircases = state.floorStaircases;

      switch (type) {
        case "ADD":
          const newSt = action.payload.staircase;

          if (
            !_.some(
              tmpStaircases[action.payload.floorName],
              (st) => st.id === newSt.id
            )
          ) {
            tmpStaircases[action.payload.floorName] = [
              ...tmpStaircases[action.payload.floorName],
              newSt,
            ];
            state.floorStaircases = tmpStaircases;
          }
          break;

        case "DELETE":
          const stId = action.payload.staircaseId;
          if (
            _.some(
              tmpStaircases[action.payload.floorName],
              (st) => st.id === stId
            )
          ) {
            tmpStaircases[action.payload.floorName] = _.filter(
              tmpStaircases[action.payload.floorName],
              (st) => st.id !== stId
            );
            state.floorStaircases = tmpStaircases;
          }

        default:
          break;
      }
    },

    clearlAllStates: (state, _action) => {
      state.selectedFloor = null;
      state.selectedRoomToDraw = null;
      state.selectedMethod = null;
      state.drawingRooms = {};
    },
  },
});

export const {
  setFloor,
  setMode,
  setRoomToDraw,
  selectMethod,
  setInitialDataForDrawingRooms,
  setDrawingRoomsInFloor,
  clearlAllStates,
  setUpdateFloors,
  setIsFloorPlanDataExistForCustomer,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;
