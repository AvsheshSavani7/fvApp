import React from "react";
import Image from "./Image";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  addCustomerFVData,
  getAllData,
} from "../../services/customers.service";
import MuiSnackbar from "./MuiSnackbar";
import { BuildingType } from "../../utils/buildingTypeQuestion";
import { getAuth } from "../../services/identity.service";

const SearchField = ({ onChange }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [addCustomerLoading, setAddCustomerLoading] = React.useState(false);

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const auth = getAuth();

  const addNewCustomer = async () => {
    setAddCustomerLoading(true);
    let getAllCustomers = await getAllData(
      auth?.token,
      1000000000000000,
      0,
      ""
    );
    let totalCustomer = 0;
    if (getAllCustomers?.data?.status) {
      totalCustomer = getAllCustomers?.data?.entity?.totalItems;
    }

    const updatedCustomerData = {
      name: `Customer-${totalCustomer + 1}`,
      address: "",
      email: "",
      phone: "",
      temperature: "",
      humidity: "",
      buildingType: BuildingType,
    };

    const body = {
      customer_name: `Customer-${totalCustomer + 1}`,
      mobile: "",
      email: "",
      address: "",
      fv_data: { ...singleCustomerData, customer: updatedCustomerData },
    };

    let fvdataRes = await addCustomerFVData(body);

    if (fvdataRes?.data?.status) {
      navigate(`/home/${fvdataRes?.data?.entity?.id}`);
    } else {
      setOpen(true);
      setMessage(fvdataRes?.data?.message);
      setType("error");
      setAddCustomerLoading(false);
    }
  };

  return (
    <div className="relative rounded-full max-w-md flex justify-center m-auto w-[374px]">
      <MuiSnackbar
        open={open}
        message={message || ""}
        type={type || ""}
        onClose={() => setOpen(false)}
      />
      <input
        type="text"
        placeholder="Search"
        className="rounded-lg w-full py-2 pl-4 pr-10 h-[50px] text-black focus:outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-y-0 -right-2 flex items-center pr-3 pointer-events-none">
        <Image src="/images/searchIcon.svg" />
      </div>
      <div
        className={`absolute inset-y-0 -right-16 flex items-center pr-3 cursor-pointer ${
          addCustomerLoading && "blur-[1px] pointer-events-none"
        }`}
        onClick={addNewCustomer}
      >
        <Image src="/images/newCustomer.svg" />
      </div>
    </div>
  );
};

export default SearchField;

SearchField.propTypes = {
  onChange: PropTypes.func,
};
