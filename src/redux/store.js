import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customer";
import floorPlan from "./floorPlan";
import productReducer from "./product";

export default configureStore({
  reducer: { customerReducer, floorPlan, productReducer },
});
