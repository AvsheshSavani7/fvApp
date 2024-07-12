import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import MuiButton from "./MuiButton";
import NoRecordFound from "./NoRecordFound";
import Text from "./Text";

const MuiTable = ({
  title,
  tableColumns,
  tableRows = [],
  page,
  rowsPerPage,
  totalItems,
  handleChangePage,
  handleChangeRowsPerPage,
  handleClick,
  loading,
}) => {
  return (
    <Paper
      sx={{
        width: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 56px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center my-6 px-4">
        <Text className="text-[26px] text-start font-medium">{title}</Text>
        <MuiButton
          color="primary"
          size="small"
          variant="contained"
          style={{ gap: 6, padding: "6px 20px" }}
          onClick={handleClick}
        >
          <AddIcon style={{ fontSize: "18px" }} />
          Add
        </MuiButton>
      </div>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableColumns?.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    whiteSpace: "nowrap",
                    border: "none",
                    backgroundColor: "#ebebeb",
                    minWidth: column.minWidth,
                    textAlign: "start",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && tableRows?.length > 0 ? (
              tableRows?.map((row, idx) => {
                return (
                  <TableRow key={idx} hover>
                    {tableColumns.map((column) => {
                      const value = row[column.dataField];
                      return (
                        <TableCell
                          key={column.id}
                          sx={{
                            border: "none",
                            textAlign: "start",
                          }}
                        >
                          {column?.formatter ? column?.formatter(row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <NoRecordFound
                loading={loading}
                noOfColumns={tableColumns?.length || 5}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default MuiTable;

MuiTable.propTypes = {
  title: PropTypes.string,
  tableColumns: PropTypes.array,
  tableRows: PropTypes.array,
  page: PropTypes.number,
  totalItems: PropTypes.number,
  rowsPerPage: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
  handleClick: PropTypes.func,
  loading: PropTypes.bool,
};
