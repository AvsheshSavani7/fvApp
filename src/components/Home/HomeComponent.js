import React, { useState } from "react";
import "./Home.css";
import FormGroup from "../FormGroup/FormGroup";
import ButtonGroup from "../UI/ButtonGroup";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerId,
  setNotFilledOutBtns,
  setStep,
  singleCustomer,
  updateActiveBtnKey,
  updateBtnArray,
} from "../../redux/customer";
import GetIconFile from "../../assets/GetIconFile";
import { useNavigate, useParams } from "react-router-dom";
import CheckListFormGroup from "../FormGroup/CheckListFormGroup";
import CheckListButtonGroup from "../UI/CheckList/CheckListBtns/CheckListButtonGroup";
import sampleJson from "../../utils/sampleJson.json";
import Button from "../UI/Button";
import SubmitComponent from "../SubmitComponent/SubmitComponent";
import { clearlAllStates } from "../../redux/floorPlan";

const HomeComponent = () => {
  const [paddingTopValue, setPaddingTopValue] = useState("257px"); // New state for padding value
  const [widthValue, setWidthValue] = useState(1); // New state for padding value
  const params = useParams();

  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const step = useSelector((state) => state.customerReducer.step);
  const { customer, isBgChangedBtnArray } = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const btnArray = useSelector((state) => state.customerReducer.btnArray);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!activeBtnKey) {
      setPaddingTopValue("");
      setWidthValue(0.5);
    } else {
      setPaddingTopValue("257px");
      setWidthValue(1);
    }
  }, [activeBtnKey]);

  const handleButtonClick = (btnKey) => {
    // setShowBottomButtonGroup((prev) => !prev);
    dispatch(updateActiveBtnKey(btnKey));

    dispatch(setStep(1));
    // setPaddingTopValue(!!activeBtnKey ? "257px" : "40px");
    // setWidthValue(!!activeBtnKey ? 1 : 0.5);
  };

  const naviGateToCustomerPage = () => {
    dispatch(singleCustomer(sampleJson));
    dispatch(setNotFilledOutBtns([]));
    dispatch(setCustomerId(""));
    dispatch(updateActiveBtnKey(""));
    dispatch(clearlAllStates());
    dispatch(
      updateBtnArray([
        // {
        //   name: "Checklist",
        //   key: "checklist",
        //   className: "round-btn-bottom",
        // },
        {
          name: "Floor Details",
          key: "floorDetails",
          className: "round-btn-bottom",
        },
      ])
    );
    navigate("/customers");
  };

  const handleImageButtonClick = () => {
    navigate(`/home/${params?.customerId}/images-pdf`);
  };

  return (
    <div className="w-full h-[100vh] relative">
      {activeBtnKey && (
        //For Name plate
        <>
          {params?.customerId && (
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 1.2 }}
              className="w-[285px] h-[158px] absolute top-0 left-0 bg-[#20202080] flex flex-col items-start px-5 py-4 justify-around rounded-br-[8px] rounded-tr-[8px]"
            >
              <h1 className="text-white text-[16px] font-normal text-start">
                {customer.name}
              </h1>
              <h1 className="text-white opacity-80 text-[16px] font-normal text-start">
                {customer.address}
              </h1>
              <h1 className="text-white opacity-80 text-[16px] font-normal text-start">
                {customer.phone}
              </h1>
              <h1 className="text-white opacity-80 text-[16px] font-normal text-start">
                {customer.email}
              </h1>
            </motion.div>
          )}
          <div
            className="absolute top-3 right-3"
            onClick={() => handleButtonClick("")}
          >
            <GetIconFile iconName="home-icon" />
          </div>
        </>
      )}
      {/* For Home page to cutomer detail page button */}
      {!activeBtnKey && (
        <>
          <div
            className="absolute top-3 right-3"
            onClick={naviGateToCustomerPage}
          >
            <GetIconFile iconName="home-icon" />
          </div>
        </>
      )}

      {step == 1 ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 1 }}
            className={`flex justify-between  m-auto`}
            style={{
              // width: 404,
              paddingTop: paddingTopValue, // Use the paddingTopValue state for smooth transition
              transition:
                "padding-top 0.5s ease-in-out ,transform 0.5s ease-in-out", // Set transition property and duration

              transformOrigin: "left", // Specify the transform origin to left for scaleX animation
              transform: `scaleX(${widthValue})`,
              height: !paddingTopValue && "calc(100vh - 584px)",
            }}
          >
            <ButtonGroup
              // initial={{ opacity: 0, y: -50 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -50 }}
              // transition={{ duration: 1 }}
              className={`flex justify-between   m-auto`}
              BtnChildren={[
                {
                  name: "Customer Details",
                  key: "customerDetails",
                  className: `${
                    !activeBtnKey
                      ? "round-btn"
                      : activeBtnKey == "customerDetails"
                      ? "round-btn"
                      : "round-schrink-btn p-4" // define round-schrink-btn class in Home.css
                  } transition-all ease-in-out duration-700`,
                  // handleClickBtn: () => handleButtonClick("customerDetails"),
                },
                {
                  name: "Project Scope",
                  key: "projectScope",
                  className: `${
                    !activeBtnKey
                      ? "round-btn"
                      : activeBtnKey == "projectScope"
                      ? "round-btn"
                      : "round-schrink-btn p-4" // define round-schrink-btn class in Home.css
                  } transition-all ease-in-out duration-700`,
                  // handleClickBtn: () => handleButtonClick("projectScope"),
                },
                {
                  name: "Measurement",
                  key: "measurement",
                  className: `${
                    !activeBtnKey
                      ? "round-btn"
                      : activeBtnKey == "measurement"
                      ? "round-btn"
                      : "round-schrink-btn p-4 !text-[14px]" // define round-schrink-btn class in Home.css
                  } transition-all ease-in-out duration-700 
                  `,
                  // handleClickBtn: () => handleButtonClick("projectScope"),
                },
              ]}
            />
          </motion.div>
          {!activeBtnKey && (
            <motion.div
              className="flex justify-center  m-auto mt-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1 }}
            >
              <ButtonGroup
                className="flex justify-between min-w-[284px] gap-6 m-auto mt-10"
                // initial={{ opacity: 0, y: -50 }}
                // animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -100 }}
                // transition={{ duration: 1 }}
                BtnChildren={btnArray}
                isChild="false"
              />
            </motion.div>
          )}
          <FormGroup />
        </>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              // initial={{
              //   opacity: 1,
              //   x: -400,
              //   y: 600,
              // }}
              // animate={{ opacity: 1, x: 40, y: 30 }}
              // exit={{ opacity: 1, x: 40, y: 30 }}
              transition={{ duration: 1 }}
              className={`flex justify-between  m-auto`}
              style={{
                width: 404,
                paddingTop: paddingTopValue, // Use the paddingTopValue state for smooth transition
                transition:
                  "padding-top 0.5s ease-in-out ,transform 0.5s ease-in-out", // Set transition property and duration

                transformOrigin: "left", // Specify the transform origin to left for scaleX animation
                transform: `scaleX(${widthValue})`,
                height: !paddingTopValue && "calc(100vh - 584px)",
              }}
            >
              <CheckListButtonGroup
                className={`flex items-center justify-center m-auto`}
                BtnChildren={btnArray}
              />
            </motion.div>
          </AnimatePresence>
          {!activeBtnKey && (
            <motion.div
              className="flex justify-center  m-auto mt-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1 }}
            >
              <CheckListButtonGroup
                className="flex justify-between min-w-[284px] gap-6 m-auto mt-10"
                // initial={{ opacity: 0, y: -50 }}
                // animate={{ opacity: 1, y: 0 }}
                // exit={{ opacity: 0, y: -100 }}
                // transition={{ duration: 1 }}
                BtnChildren={[
                  {
                    name: "Customer Details",
                    key: "customerDetails",
                    className: `${
                      !activeBtnKey
                        ? "round-btn"
                        : activeBtnKey == "customerDetails"
                        ? "round-btn"
                        : "round-schrink-btn p-4" // define round-schrink-btn class in Home.css
                    } transition-all ease-in-out duration-700`,
                    // handleClickBtn: () => handleButtonClick("customerDetails"),
                  },
                  {
                    name: "Project Scope",
                    key: "projectScope",
                    className: `${
                      !activeBtnKey
                        ? "round-btn"
                        : activeBtnKey == "projectScope"
                        ? "round-btn"
                        : "round-schrink-btn p-4" // define round-schrink-btn class in Home.css
                    } transition-all ease-in-out duration-700`,
                    // handleClickBtn: () => handleButtonClick("projectScope"),
                  },
                  {
                    name: "Measurement",
                    key: "measurement",
                    className: `${
                      !activeBtnKey
                        ? "round-btn"
                        : activeBtnKey == "measurement"
                        ? "round-btn"
                        : "round-schrink-btn p-4" // define round-schrink-btn class in Home.css
                    } transition-all ease-in-out duration-700 `,
                    // handleClickBtn: () => handleButtonClick("projectScope"),
                  },
                ]}
                isChild="false"
              />
            </motion.div>
          )}
          <CheckListFormGroup />
        </>
      )}
    </div>
  );
};

export default HomeComponent;
