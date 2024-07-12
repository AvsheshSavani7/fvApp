import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, Grid, styled } from "@mui/material";
import { motion } from "framer-motion";
import FloorPlanDrawer from "./FloorPlanDrawer";
import Floors from "./Floors";
import SaveConfirmationModal from "./SaveConfirmationModal";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateFloorPlanData } from "../../services/customers.service";
import { setInitialDataForDrawingRooms } from "../../redux/floorPlan";
import MuiSnackbar from "../UI/MuiSnackbar";
import { usePreview } from "react-dnd-preview";
import { Card, Typography } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import { Constants } from "../../utils/Constants";

const DRAG_ICON_STYLE = {
  cursor: "grab",
  fontSize: "20px",
  color: "white",
  zIndex: 10,
  marginRight: "9px",
  marginLeft: "11px",
  marginTop: "2px",
  width: "15px",
};

const CustomDialog = styled(Dialog)({
  overflow: "visible",
  "& .MuiDialog-paper": {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    margin: 0,
  },
});

const CustomDialogContent = styled(DialogContent)({
  width: "100%",
  height: "100%",
});

const FloorPlanModal = (props) => {
  const { open, setOpenFloorPlanDrawer } = props;
  const [saveConfirmationModalOpen, setSaveConfirmationModalOpen] =
    useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const params = useParams();
  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);
  const dispatch = useDispatch();

  const onClose = () => {
    setSaveConfirmationModalOpen(true);
  };

  const saveFloorPlanData = useCallback(async () => {
    setIsSaving(true);
    const createFloorPlanDataRes = await updateFloorPlanData(
      params?.customerId,
      { floor_plan_data: drawingRooms }
    );

    const result = createFloorPlanDataRes?.data;
    setOpenSnackbar(true);
    if (result?.status) {
      setType("success");
      setMessage("Floor plan data updated!");
    } else {
      setMessage(
        result?.message ||
          "Something went wrong, please try again to udpated floor plan data"
      );
      setType("error");
    }
    dispatch(setInitialDataForDrawingRooms(drawingRooms));
    setIsSaving(false);
  }, [drawingRooms, setInitialDataForDrawingRooms, setIsSaving]);

  const MyPreview = () => {
    const preview = usePreview();
    if (!preview.display) {
      return null;
    }
    const { item, style } = preview;

    if (!item) return null;

    return (
      <motion.div style={style} className="w-[220px] z-[10000]">
        <Card
          bordered={false}
          style={{
            width: "100%",
            backgroundColor: Constants.TEXT_COLOR,
            margin: "5px 0",
            height: "40px",
            fontFamily: Constants.FONT_FAMILY_POPPINS,
          }}
          bodyStyle={{
            padding: "10px 4px",
            display: "flex",
            justifyContent: "left",
          }}
        >
          <div>
            <AiOutlineMenu style={DRAG_ICON_STYLE} />
          </div>

          <Typography.Paragraph
            ellipsis={{
              rows: 1,
              expandable: false,
            }}
            style={{
              marginBottom: "0",
              fontFamily: Constants.FONT_FAMILY_POPPINS,
              color: "white",
            }}
          >
            {item?.item?.Product_Name}
          </Typography.Paragraph>
        </Card>
      </motion.div>
    );
  };

  return (
    <CustomDialog open={open}>
      <MyPreview />
      <CustomDialogContent sx={{ p: 1 }}>
        <Grid container spacing={1} sx={{ height: "100%" }}>
          <Grid item xs={9.5}>
            <FloorPlanDrawer />
          </Grid>
          <Grid item xs={2.5} className="!border-l-[1px] border-gray-400">
            <Floors
              closeMainModal={onClose}
              saveFloorPlanData={saveFloorPlanData}
              isSaving={isSaving}
            />
          </Grid>
        </Grid>
      </CustomDialogContent>
      <SaveConfirmationModal
        open={saveConfirmationModalOpen}
        onClose={() => setSaveConfirmationModalOpen(false)}
        setOpenFloorPlanDrawer={setOpenFloorPlanDrawer}
        saveFloorPlanData={saveFloorPlanData}
      />
      <MuiSnackbar
        open={openSnackbar}
        message={message || ""}
        type={type || ""}
        onClose={() => setOpenSnackbar(false)}
      />
    </CustomDialog>
  );
};

export default FloorPlanModal;
