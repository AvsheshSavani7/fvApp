import React from "react";
import Text from "../UI/Text";
import Image from "../UI/Image";
import { pdfStyle } from "../../utils/Constants";

const CustomerDetails = ({ customerDetails1 }) => {
  // const {temperature,humidity,buildingType} = customerDetails?.fv_data?.customer

  let allQuestions =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.customer?.buildingType?.subQuestion]
      : [];

  const question1 = allQuestions.find(
    (question) => question.question === "Confirmation of 220V Power Source ?"
  );
  const question2 = allQuestions.find(
    (question) =>
      question.question === "Discussed 220w/ customer & included in Scope"
  );
  const question3 = allQuestions.find(
    (question) => question.question === "COI Required for Project"
  );
  const question4 = allQuestions.find(
    (question) => question.question === "Apt Parking instructions:"
  );
  const question5 = allQuestions.find(
    (question) =>
      question.question ===
      "Are there any Metal Doors where wood will be scored?"
  );
  const question6 = allQuestions.find(
    (question) => question.question === "Floor Level of Apartment building"
  );

  return (
    <>
      <div
        className={`bg-[${pdfStyle?.headingBgColor}]  pl-2 p-1.5 rounded-lg `}
      >
        <Text
          className={`text-black text-[${pdfStyle.headingSize}px] font-semibold text-start`}
        >
          Customer Details
        </Text>
      </div>
      {/* 1st line */}
      <div className="my-3">
        <div className={`flex py-${pdfStyle?.paddingY}`}>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className={`flex items-center justify-start`}>
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Name
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.customer_name}
              </span>
            </div>
          </div>
          <div className={`w-[1px] bg-[#D8D8D8] rounded-full`}></div>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className={`flex items-center justify-start`}>
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Phone no.{" "}
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.mobile}
              </span>
            </div>
          </div>
        </div>
        <div className={`w-full h-[1px] bg-[#D8D8D8] rounded-full`}></div>
        {/* 2nd line */}
        <div className={`flex py-${pdfStyle?.paddingY}`}>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className="flex items-center justify-start">
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Email
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.email}
              </span>
            </div>
          </div>
          <div className={`w-[1px] bg-[#D8D8D8] rounded-full`}></div>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className={`flex items-center justify-start`}>
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Temperature
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.fv_data?.customer?.temperature || ""}
              </span>
            </div>
          </div>
        </div>
        <div className={`w-full h-[1px] bg-[#D8D8D8] rounded-full`}></div>
        {/* 3rd line */}
        <div className={`flex py-${pdfStyle?.paddingY}`}>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className="flex items-center justify-start">
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Address
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.address}
              </span>
            </div>
          </div>
          <div className={`w-[1px] bg-[#D8D8D8] rounded-full`}></div>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className="flex items-center justify-start">
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Humidity
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.fv_data?.customer?.humidity || ""}
              </span>
            </div>
          </div>
        </div>
        <div className={`w-full h-[1px] bg-[#D8D8D8] rounded-full`}></div>
        {/* 4rd line */}
        <div className={`flex py-${pdfStyle?.paddingY}`}>
          <div
            className={`flex flex-col items-start justify-center my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
          >
            <div className="flex items-center justify-start">
              <Text
                className={`w-[150px] text-[${pdfStyle?.questionTextSize}px] text-start`}
              >
                Building Type
              </Text>
              <span
                className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
              >
                : {customerDetails1?.fv_data?.customer?.buildingType?.answer}
              </span>
            </div>
          </div>
          {customerDetails1?.fv_data?.customer?.buildingType?.answer &&
            customerDetails1?.fv_data?.customer?.buildingType?.answer ===
              "Apartment/Condo" && (
              <>
                <div className="w-[1px] bg-[#D8D8D8] rounded-full"></div>
                <div
                  className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-${pdfStyle?.paddingL} w-1/2`}
                >
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      220V Power Source
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      :{" "}
                      {question1?.answer === true
                        ? "Yes"
                        : question1?.answer === false
                        ? "No"
                        : "none"}
                    </span>
                  </div>
                  <div
                    className={`w-full h-[1px] bg-[#D8D8D8] rounded-full`}
                  ></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      Discussed 220w/ customer & included in Scope
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      :{" "}
                      {question2?.answer === true
                        ? "Yes"
                        : question2?.answer === false
                        ? "No"
                        : "none"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      COI Required for Project
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.questionTextSize}px]`}
                    >
                      : {question3?.answer || "NA"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      Apt Parking instructions
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question4?.answer || "NA"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px]  text-start`}
                    >
                      Are there any Metal Doors where wood will be scored
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      :{" "}
                      {question5?.answer === true
                        ? "Yes"
                        : question5?.answer === false
                        ? "No"
                        : "none"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div
                    className={`flex items-center justify-start my-${pdfStyle?.marginY}`}
                  >
                    <Text
                      className={`w-[250px] text-[${pdfStyle?.questionTextSize}px] text-start`}
                    >
                      Floor Level of Apartment building
                    </Text>
                    <span
                      className={`font-semibold text-[${pdfStyle?.answerTextSize}px]`}
                    >
                      : {question6?.answer || "NA"}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-[#D8D8D8] rounded-full"></div>
                  <div className="flex flex-wrap items-center justify-start">
                    {question1?.subQuestion?.[0]?.answer?.map((src, index) => (
                      <img
                        className={`w-[${pdfStyle?.imageW}px] h-[${pdfStyle?.imageH}px] rounded-md p-1`}
                        src={src}
                        alt={"src"}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
