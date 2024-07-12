import { CircularProgress, TableCell, TableRow } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import Text from "./Text";

const NoRecordFound = ({ noOfColumns, loading }) => {
  return (
    <TableRow>
      <TableCell colSpan={noOfColumns} style={{ textAlign: "center" }}>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Text>No Record found</Text>
        )}
      </TableCell>
    </TableRow>
  );
};

export default NoRecordFound;

NoRecordFound.propTypes = {
  noOfColumns: PropTypes.number,
  loading: PropTypes.bool,
};
