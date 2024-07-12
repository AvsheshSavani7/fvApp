import { Snackbar } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => {
  return (
    <MuiAlert elevation={6} ref={ref} variant={props.variant} {...props} />
  );
});

const MuiSnackbar = ({
  message,
  open,
  duration = 8000,
  onClose,
  type = "error",
  variant = "filled",
  vertical = "bottom",
  horizontal = "center",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        sx={{ width: "100%" }}
        variant={variant}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MuiSnackbar;

MuiSnackbar.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool,
  duration: PropTypes.number,
  onClose: PropTypes.func,
};
