import React, { useEffect, useMemo, useState } from "react";
import Input from "../UI/Input";
import * as yup from "yup";
import "./CustomerDetailForm";
import { useDispatch, useSelector } from "react-redux";
import {
  singleCustomer,
  updateBtnArray,
  updateSingleCustomerApi,
} from "../../redux/customer";
import InputMask from "react-input-mask";
import { useReactHookForm } from "../../hooks/useReactHookForm";
import {
  addCustomerFVData,
  updateCustomerFVData,
} from "../../services/customers.service";
import { useNavigate, useParams } from "react-router-dom";
import MuiSnackbar from "../UI/MuiSnackbar";
import {
  checkFilledOut,
  checkSubQueFilledOut,
  formCheckCondition,
} from "../../helper/helper";
import PhoneInput from "../UI/PhoneInput";
import { Grid } from "@mui/material";
import DropdownField from "../UI/QuestionTypes/DropdownField";
import BuildingTypeSubQueGrid from "../UI/QuestionTypes/BuildingTypeSubQueGrid";
import SubQuestionHeader from "../UI/CheckList/SubQuestionHeader";

const CustomerDetailForm = () => {
  const params = useParams();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  // default values of customer
  let defaultCustomerDetails = {
    name: singleCustomerData?.customer?.name || "",
    address: singleCustomerData?.customer?.address || "",
    email: singleCustomerData?.customer?.email || "",
    phone: singleCustomerData?.customer?.phone || "",
    temperature: singleCustomerData?.customer?.temperature || "",
    humidity: singleCustomerData?.customer?.humidity || "",
  };

  const EventSchema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^\d{3}-\d{3}-\d{4}$/, "Please enter a valid US phone number."),
    email: yup
      .string()
      .email("Please enter valid email")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        "Please enter valid email"
      ),
  });

  const { register, errors, watch, getValues, setValue, control, trigger } =
    useReactHookForm({
      validationSchema: EventSchema,
      defaultValues: defaultCustomerDetails,
      mode: "onBlur",
    });

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [subQuestionsShow, setSubQuestionsShow] = React.useState(false);
  const [subQuestions, setSubQuestions] = React.useState({});

  const [prevInputValues, setPrevInputValues] = useState({
    name: "", // Set the initial previous values here
    address: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Update previous input values whenever the singleCustomerData changes
    setPrevInputValues({
      name: singleCustomerData?.customer?.name || "",
      address: singleCustomerData?.customer?.address || "",
      email: singleCustomerData?.customer?.email || "",
      phone: singleCustomerData?.customer?.phone || "",
      temperature: singleCustomerData?.customer?.temperature || "",
      humidity: singleCustomerData?.customer?.humidity || "",
    });
  }, [singleCustomerData]);

  let buildingType = React.useMemo(() => {
    return singleCustomerData?.customer?.buildingType;
  }, [singleCustomerData]);

  let buildingTypeIsValid = React.useMemo(() => {
    let valid = checkFilledOut(singleCustomerData?.customer?.buildingType);
    return valid;
  }, [singleCustomerData]);

  let buildingTypeSubQueIsValid = React.useMemo(() => {
    let valid = checkSubQueFilledOut(
      singleCustomerData?.customer?.buildingType,
      "building"
    );
    return valid;
  }, [singleCustomerData]);

  const customer = useMemo(() => {
    let isValidName = false;
    let isValidAddress = false;
    let isValidEmail = false;
    let isValidPhone = true;

    if (singleCustomerData?.customer?.name !== "") {
      isValidName = true;
    }
    if (singleCustomerData?.customer?.address !== "") {
      isValidAddress = true;
    }
    if (singleCustomerData?.customer?.email !== "") {
      isValidEmail = true;
    }
    // if (singleCustomerData?.customer?.phone !== "") {
    //   isValidPhone = true;
    // }

    return {
      isValidName,
      isValidAddress,
      isValidEmail,
      isValidPhone,
    };
  }, [singleCustomerData]);

  // const handleBlur = async () => {
  //   const customerData = { ...singleCustomerData };
  //   const updatedCustomerData = {
  //     name: getValues("name"),
  //     address: getValues("address"),
  //     email: getValues("email"),
  //     phone: singleCustomerData?.customer?.phone,
  //     temperature: getValues("temperature"),
  //     humidity: getValues("humidity"),
  //     buildingType: buildingType,
  //   };

  //   let isValueChanged = formCheckCondition(
  //     updatedCustomerData,
  //     prevInputValues
  //   );

  //   // Compare current input values with previous input values
  //   if (isValueChanged) {
  //     // Dispatch the updateJsonData action with the updated customer data
  //     dispatch(
  //       singleCustomer({ ...customerData, customer: updatedCustomerData })
  //     );
  //   }

  //   if (isValueChanged) {
  //     if (
  //       updatedCustomerData.name &&
  //       updatedCustomerData.address &&
  //       updatedCustomerData.email &&
  //       singleCustomerData?.customer?.phone
  //     ) {
  //       const body = {
  //         customer_name: updatedCustomerData.name,
  //         mobile: singleCustomerData?.customer?.phone,
  //         email: updatedCustomerData.email,
  //         address: updatedCustomerData.address,
  //         fv_data: { ...singleCustomerData, customer: updatedCustomerData },
  //       };

  //       const isEmailValid = await trigger("email");
  //       if (!isEmailValid) {
  //         return; // Stop further operations if email is invalid
  //       } else {
  //         let fvdataRes;
  //         if (params?.customerId) {
  //           fvdataRes = await updateCustomerFVData(params?.customerId, body);
  //         } else {
  //           fvdataRes = await addCustomerFVData(body);
  //         }

  //         if (fvdataRes?.data?.status) {
  //           let customerResult = fvdataRes?.data?.entity;
  //           navigate(`/home/${customerResult?.id}`, { replace: true });
  //         } else {
  //           setOpen(true);
  //           setMessage(fvdataRes?.data?.message);
  //           setType("error");
  //         }
  //       }
  //     }
  //   }
  // };

  const handlePhoneBlur = async (e) => {
    const customerData = { ...singleCustomerData };
    const updatedCustomerData = {
      name: customerData?.customer?.name,
      address: customerData?.customer?.address,
      email: customerData?.customer?.email,
      temperature: customerData?.customer?.temperature,
      humidity: customerData?.customer?.humidity,
      phone: e.target.value,
      buildingType: buildingType,
    };

    // Dispatch the updateJsonData action with the updated customer data
    dispatch(
      singleCustomer({ ...customerData, customer: updatedCustomerData })
    );

    let isValueChanged = formCheckCondition(
      updatedCustomerData,
      prevInputValues
    );

    if (isValueChanged) {
      const body = {
        customer_name: updatedCustomerData.name,
        mobile: updatedCustomerData.phone,
        email: updatedCustomerData.email,
        address: updatedCustomerData.address,
        fv_data: { ...singleCustomerData, customer: updatedCustomerData },
      };

      let fvdataRes = await updateCustomerFVData(params?.customerId, body);

      if (fvdataRes?.data?.status) {
        // let customerResult = fvdataRes?.data?.entity;
        // navigate(`/home/${customerResult?.id}`, { replace: true });
      } else {
        setOpen(true);
        setMessage(fvdataRes?.data?.message);
        setType("error");
      }
    }
  };

  const handleBlur = async () => {
    const customerData = { ...singleCustomerData };
    const updatedCustomerData = {
      name: getValues("name"),
      address: getValues("address"),
      email: getValues("email"),
      phone: customerData?.customer?.phone,
      temperature: getValues("temperature"),
      humidity: getValues("humidity"),
      buildingType: buildingType,
    };

    let isValueChanged = formCheckCondition(
      updatedCustomerData,
      prevInputValues
    );

    // Compare current input values with previous input values
    if (isValueChanged) {
      // Dispatch the updateJsonData action with the updated customer data
      dispatch(
        singleCustomer({ ...customerData, customer: updatedCustomerData })
      );
      const body = {
        customer_name: updatedCustomerData?.name,
        mobile: updatedCustomerData?.phone,
        email: updatedCustomerData?.email,
        address: updatedCustomerData?.address,
        fv_data: { ...singleCustomerData, customer: updatedCustomerData },
      };

      let fvdataRes = await updateCustomerFVData(params?.customerId, body);

      if (fvdataRes?.data?.status) {
        // let customerResult = fvdataRes?.data?.entity;
        // navigate(`/home/${customerResult?.id}`, { replace: true });
      } else {
        setOpen(true);
        setMessage(fvdataRes?.data?.message);
        setType("error");
      }
    }
  };

  let shouldSubQueIconShow = React.useMemo(() => {
    return singleCustomerData?.customer?.buildingType?.subQuestion?.some(
      (subque) => subque?.whenToShow === buildingType?.answer
    );
  }, [singleCustomerData]);

  const getSubQuestions = (findQue, value) => {
    let filteredSubsQuestions =
      findQue?.subQuestion?.filter((que) => que?.whenToShow == value) || [];

    if (filteredSubsQuestions?.length > 0) {
      setSubQuestionsShow(true);
      setSubQuestions({
        mainQuestion: findQue?.question,
        mainQuestionAnswer: value,
        subQuestions: filteredSubsQuestions,
        questionId: findQue?.id,
      });
    } else {
      setSubQuestionsShow(false);
    }
  };

  const handleChangeDropdown = async (value, type) => {
    let updatedCustomer = { ...singleCustomerData?.customer };
    let findQue = updatedCustomer?.buildingType;
    if (type == "yesOrNo") {
      updatedCustomer.buildingType = {
        ...updatedCustomer.buildingType,
        answer: value,
      };
      if (params?.customerId) {
        dispatch(
          updateSingleCustomerApi({
            ...singleCustomerData,
            customer: updatedCustomer,
          })
        );
      } else {
        dispatch(
          singleCustomer({
            ...singleCustomerData,
            customer: updatedCustomer,
          })
        );
      }
      getSubQuestions(findQue, value);
    } else {
      getSubQuestions(findQue, value);
    }
  };

  const handleFocus = () => {
    let currentName = prevInputValues?.name;
    if (currentName?.startsWith("Customer")) {
      setValue("name", "");
    }
  };

  return (
    <div>
      <MuiSnackbar
        open={open}
        message={message || ""}
        type={type || ""}
        onClose={() => setOpen(false)}
      />
      {/* <div className="grid grid-cols-1 gap-[31px] px-10 pt-[98px]"> */}
      {!subQuestionsShow ? (
        <Grid container sx={{ pt: "98px", width: "527px" }} spacing={2}>
          <Grid item xs={6}>
            <Input
              id="name"
              name="name"
              type="text"
              label={""}
              placeholder={"Customer Name"}
              register={register}
              errors={errors}
              onBlur={handleBlur}
              onFocusEvent={handleFocus}
              isValid={customer?.isValidName}
            />
          </Grid>
          <Grid item xs={6}>
            <PhoneInput
              id="phone"
              name="phone"
              type="number"
              label={""}
              placeholder={"Phone Number"}
              register={register}
              errors={errors}
              onBlur={handlePhoneBlur}
              control={control}
              value={singleCustomerData?.customer?.phone || ""}
              isValid={customer?.isValidPhone}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              id="address"
              name="address"
              type="text"
              label={""}
              placeholder={"Address"}
              register={register}
              errors={errors}
              onBlur={handleBlur}
              isValid={customer?.isValidAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              id="email"
              name="email"
              type="email"
              label={""}
              placeholder={"Email"}
              register={register}
              errors={errors?.email}
              onBlur={async () => {
                const isEmailValid = await trigger("email");
                if (!isEmailValid) {
                  return; // Stop further operations if email is invalid
                } else {
                  handleBlur();
                }
              }}
              error={errors?.email || ""}
              isValid={customer?.isValidEmail}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              label={""}
              placeholder={"Temperature"}
              register={register}
              errors={errors}
              onBlur={handleBlur}
              isValid={true}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              id="humidity"
              name="humidity"
              type="number"
              label={""}
              placeholder={"Humidity"}
              register={register}
              errors={errors}
              onBlur={handleBlur}
              isValid={true}
            />
          </Grid>
          <Grid item xs={12}>
            <DropdownField
              level={buildingType?.level}
              question={buildingType?.question}
              value={buildingType?.answer}
              options={buildingType?.option}
              shouldSubQueIconShow={shouldSubQueIconShow}
              handleChangeDropdown={(e) =>
                handleChangeDropdown(e.target.value, "yesOrNo")
              }
              handleClickSbuQueIcon={() =>
                handleChangeDropdown(buildingType?.answer, "subQueIcon")
              }
              filledOut={buildingTypeIsValid}
              subQueFilledOut={buildingTypeSubQueIsValid}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container sx={{ pt: "58px", width: "527px" }} spacing={2}>
          <SubQuestionHeader
            question={subQuestions?.mainQuestion}
            answer={subQuestions?.mainQuestionAnswer}
            setSubQuesionsShow={setSubQuestionsShow}
          />
          <BuildingTypeSubQueGrid
            customerId={params?.customerId}
            subQuestions={subQuestions}
            setSubQuestions={setSubQuestions}
            hadMargin={false}
          />
        </Grid>
      )}
    </div>
    // </div>
  );
};

export default CustomerDetailForm;
