import React, { useCallback, useEffect, useState } from "react";
import GetIconFile from "../../assets/GetIconFile";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCustomerById,
  getFloorPlanZcPoId,
} from "../../services/customers.service";
import { getAuth } from "../../services/identity.service";
import ReactToPDF from "./ReactToPDF";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { clearImages, setIsImagesExist } from "../../redux/customer";

const PDFRootComponent = () => {
  const [customerDetails, setCustomerDetails] = useState({});
  const [floorPlan, setFloorPlan] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const auth = getAuth();
  const customerId = params?.customerId;

  const handleButtonClick = () => {
    navigate("/customers");
    dispatch(setIsImagesExist(false));
    dispatch(clearImages(false));
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = useCallback(async () => {
    setLoading(true);
    if (customerId) {
      const customerRes = await getCustomerById(customerId, auth?.token);
      const customer = customerRes?.data?.entity;
      if (customerRes?.data?.status) {
        setCustomerDetails(customer);
        if (customer?.ZC_PO_ID) {
          const customerRes = await getFloorPlanZcPoId(
            customer?.ZC_PO_ID,
            auth?.token
          );
          setFloorPlan(customerRes?.data?.entity);
        }
      }
    }
    setLoading(false);
  }, [customerId]);

  return (
    <div>
      <div className="absolute top-3 right-3" onClick={handleButtonClick}>
        <GetIconFile iconName="home-icon" />
      </div>
      <ReactToPDF
        customerDetails1={customerDetails}
        floorPlan={floorPlan}
        apiLoading={loading}
      />
    </div>
  );
};

export default PDFRootComponent;
