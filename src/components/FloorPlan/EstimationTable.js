import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import "./table-style.css";
import { updateProducts } from "../../redux/product";
import { singleCustomer } from "../../redux/customer";

const EstimationTable = () => {
  const columns = [
    { id: (_prod, idx) => idx + 1, label: "NO." },
    { id: "Product_Name", label: "Product Name", maxWidth: 350 },
    {
      id: "quantity",
      label: "Qty",
      align: "right",
      minWidth: 80,
      format: (value) => value.toFixed(2),
    },
    {
      id: (prod) => prod?.Unit_Price + " " + prod?.Usage_Unit || "SF",
      label: "Price",
      align: "right",
      format: (value) => value.toFixed(2),
      minWidth: 80,
    },
    {
      id: (prod) => prod?.quantity * prod?.Unit_Price,
      label: "Total",
      align: "right",
      format: (value) => "$" + value.toFixed(2),
      minWidth: 80,
    },
    {
      id: (prod) => {
        return (
          <div
            className="flex items-center justify-center"
            onClick={() => deleteProduct(prod)}
          >
            <img src="/images/CrossIcon.svg" />
          </div>
        );
      },
      label: "Action",
      align: "right",
      minWidth: 80,
    },
  ];

  const selectedProducts = useSelector(
    (state) => state.productReducer.selectedProducts
  );
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const dispatch = useDispatch();

  const Subtotal = React.useMemo(() => {
    return selectedProducts.reduce((acc, prod) => {
      return acc + prod?.quantity * prod?.Unit_Price;
    }, 0);
  }, [selectedProducts]);

  const deleteProduct = (prod) => {
    const roomIds = prod?.floors?.flatMap((f) => f.rooms)?.map((r) => r.id);

    const clonedCustomer = JSON.parse(JSON.stringify(singleCustomerData));
    const floors = clonedCustomer.scope.floors;

    const updatedFloors = floors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms.map((r) => {
        if (roomIds.includes(r.id)) {
          const filetredProds = r.products.filter((p) => p.id !== prod.id);
          return { ...r, products: filetredProds };
        }
        return r;
      }),
    }));

    clonedCustomer.scope.floors = updatedFloors;

    dispatch(singleCustomer(clonedCustomer));
    dispatch(updateProducts({ TYPE: "DELETE", ITEM: { product: prod } }));
  };

  return (
    <>
      {selectedProducts.length > 0 ? (
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid #6685ac",
          }}
        >
          <TableContainer
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 140px)" }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              sx={{ maxWidth: "800px !important" }}
              className="thin-border-table"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        maxWidth: column.maxWidth,
                        minWidth: column.minWidth,
                        // borderColor: "#6685ac",
                        fontWeight: "bold",
                      }}
                      className="thin-border"
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts?.map((prod, idx) => {
                  console.log(prod, "prod3");
                  return (
                    <TableRow tabIndex={-1} key={prod.id || idx}>
                      {columns.map((column) => {
                        const value = prod[column.id];
                        const columnId = column.id;
                        const valueToRender =
                          typeof columnId === "function"
                            ? columnId(prod, idx)
                            : value;

                        const rooms = prod.floors?.flatMap(
                          (floor) => floor.rooms
                        );

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              maxWidth: column.maxWidth,
                              borderColor: "#6685ac",
                            }}
                            className="thin-border"
                          >
                            {column.format && typeof valueToRender === "number"
                              ? column.format(valueToRender)
                              : valueToRender}

                            {columnId === "Product_Name" && (
                              <div className="flex items-center gap-1">
                                <span>-</span>
                                <div className="font-semibold text-[12px] pt-[2px]">
                                  {rooms?.map((room) => room.name).join(", ")}
                                </div>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}

                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="right"
                    style={{
                      borderColor: "#6685ac",
                      fontWeight: "bold",
                    }}
                    className="thin-border"
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      borderColor: "#6685ac",
                      fontWeight: "bold",
                    }}
                    className="thin-border"
                  >
                    ${Subtotal?.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <div className="flex justify-center items-center text-lg h-full">
          Please add products in any room to see the estimation
        </div>
      )}
    </>
  );
};

export default EstimationTable;
