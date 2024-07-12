import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styled from "@emotion/styled";

const RemoveDialog = ({ open, onClose, onConfirm, text, title }) => {
  const CustomDeleteIcon = styled(DeleteOutlineIcon)`
  color: white;
  font-size:47px;
`;

const CustomDialog = styled(Dialog)`
.MuiDialog-paper {
  overflow:visible !important;
  border-top:10px solid #1E2E5A;
}
`

const RemoveButton = styled(Button)`
color:white;
background-color:#1E2E5A`
const CancleBtton = styled(Button)`
color:#1E2E5A;
font-weight:500;
border: 2px solid #1E2E5A;
 
`

const Buttons = styled(DialogActions)`
margin-bottom:15px
`

const Title = styled(DialogTitle)`
font-weight : 600;
font-size:26px;
color:#505050;
margin-top:30px
`



  return (
    <CustomDialog open={open} onClose={onClose}>
      <div className="flex flex-col items-center overflow-visible	">

      <div className="bg-[#1E2E5A] border-2 border-white border-solid w-[70px] h-[70px]  mt-[-36px] ml-auto mr-auto rounded-full flex items-center justify-center absolute top-0 start-50 translate-middle-x">

        <CustomDeleteIcon/> 
      </div>
      <Title>
        {title}
        {/* <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton> */}
      </Title>
      <DialogContent>
        
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <Buttons>
        <CancleBtton onClick={onClose} color="primary">
          Cancel
        </CancleBtton>
        <RemoveButton onClick={onConfirm} color="primary">
          Remove
        </RemoveButton>
      </Buttons>
      </div>
    </CustomDialog>
  );
};

export default RemoveDialog;
