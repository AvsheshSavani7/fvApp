import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth } from "../../services/identity.service";
import { getAllData } from "../../services/customers.service";
import CustomerCard from "./CustomerCard";
import SearchAndAdd from "./SearchAndAdd";
import { CircularProgress, Grid } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "../UI/SlickSlider";
import { debounce } from "lodash";
import MuiSnackbar from "../UI/MuiSnackbar";

const Customers = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [localSearchKey, setLocalSearchKey] = useState("");
  const [pdfLoader, setPdfLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");

  const auth = getAuth();

  const fetchAllData = useCallback(
    async (rowsPerPage, page, searchKey) => {
      setLoading(true);

      let dataRes = await getAllData(auth?.token, rowsPerPage, page, searchKey);

      if (dataRes?.data?.status) {
        let reduceData = dataRes?.data?.entity?.data?.reduce(
          (acc, cur, idx) => {
            let obj = {};
            obj.sno = rowsPerPage * page + idx + 1;
            obj.id = cur?.id || "";
            obj.name = cur?.customer_name || "";
            obj.address = cur?.address || "";
            obj.email = cur?.email || "";
            obj.mobile = cur?.mobile || "";
            obj.ZC_PO_ID = cur?.ZC_PO_ID || "";
            obj.singleCustomerData = cur?.fv_data || {};
            acc.push(obj);
            return acc;
          },
          []
        );
        if (searchKey) {
          setTableData(reduceData);
        } else {
          if (localSearchKey) {
            setTableData(reduceData);
            setLocalSearchKey("");
          } else {
            let prevTableData = [...tableData];
            prevTableData.push(...reduceData);
            setTableData(prevTableData);
          }
        }
      } else {
        setOpen(true);
        setMessage(
          dataRes?.error === "Request failed with status code 401"
            ? "Access Denied!"
            : dataRes?.error
        );
        setType("error");
      }
      setLoading(false);
    },
    [tableData]
  );

  let debouncedSearch = debounce((searchKey) => {
    fetchAllData(rowsPerPage, page, searchKey);
  }, 600);

  useEffect(() => {
    if (searchKey) {
      debouncedSearch(searchKey);
    } else {
      fetchAllData(rowsPerPage, page, searchKey);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [page, searchKey]);

  const sliderSettings = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  let chunkedCustomers = useMemo(() => {
    return tableData?.reduce((acc, _, idx) => {
      if (idx % 12 === 0) acc.push(tableData.slice(idx, idx + 12));
      return acc;
    }, []);
  }, [tableData]);

  const handleChangeSearch = useCallback(
    (search) => {
      setSearchKey(search);
      setPage(0);
      if (search) {
        setLocalSearchKey(search);
      }
    },
    [searchKey]
  );

  const handleAfterChange = (currentIndex) => {
    if (currentIndex === chunkedCustomers?.length - 1) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      {pdfLoader && (
        <div className="fixed left-[50%] top-[50%] z-[1000]">
          <CircularProgress size={30} />
        </div>
      )}
      <MuiSnackbar
        open={open}
        message={message || ""}
        type={type || ""}
        onClose={() => setOpen(false)}
        duration={5000}
      />
      <div className={`p-7 ${pdfLoader && "blur-[2px] pointer-events-none"}`}>
        <SearchAndAdd onChange={handleChangeSearch} />
        {chunkedCustomers?.length > 0 && (
          <SlickSlider
            {...sliderSettings}
            handleAfterChange={handleAfterChange}
          >
            {chunkedCustomers?.map((customerSet, index) => (
              <div>
                <Grid container key={index} spacing={2}>
                  {customerSet.map((customer, idx) => (
                    <Grid key={idx} item xs={12} sm={6} md={3}>
                      <CustomerCard
                        data={customer}
                        setPdfLoader={setPdfLoader}
                        pdfLoader={pdfLoader}
                        setOpen={setOpen}
                        setMessage={setMessage}
                        setType={setType}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </SlickSlider>
        )}
      </div>
    </>
  );
};

export default Customers;
