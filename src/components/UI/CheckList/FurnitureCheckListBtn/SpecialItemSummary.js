import React, { useState } from "react";
import Image from "../../Image";
import Text from "../../Text";
import ImageSliderPopup from "../../ImageSliderPopup";
import ImageSlider from "./ImageSlider";

const SpecialItemSummary = ({
  activeSummary,
  setIsDragEnabled,
  objectKey,
  className,
}) => {
  let allQuestions = [...activeSummary?.[objectKey]?.all_questions];

  // Question 1
  const question1 = allQuestions.find(
    (question) => question.question === "Standard Pool Table"
  );
  const question1_1 = question1?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question1_2 = question1?.subQuestion?.find(
    (question) => question.question === "Notes"
  );

  const question1_3 = question1?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 2
  const question2 = allQuestions.find(
    (question) => question.question === "Full Size Pool Table"
  );
  const question2_1 = question2?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question2_2 = question2?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question2_3 = question2?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 3
  const question3 = allQuestions.find(
    (question) => question.question === "Grand Piano"
  );
  const question3_1 = question3?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question3_2 = question2?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question3_3 = question2?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  // Question 4
  const question4 = allQuestions.find(
    (question) => question.question === "Baby Grand Piano"
  );

  const question4_1 = question4?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question4_2 = question4?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question4_3 = question4?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 5
  const question5 = allQuestions.find(
    (question) => question.question === " Upright Piano"
  );
  const question5_1 = question5?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question5_2 = question5?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question5_3 = question5?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 6
  const question6 = allQuestions.find(
    (question) => question.question === "Radiators Other"
  );
  const question6_1 = question5?.subQuestion?.find(
    (question) => question.question === "Quantity"
  );
  const question6_2 = question6?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question6_3 = question6?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  return (
    <>
      {(question1?.answer ||
        question2?.answer ||
        question3?.answer ||
        question4?.answer ||
        question5?.answer ||
        question6?.answer) && (
        <>
          <Text className="mt-[10px] text-[20px] font-semibold">Summary</Text>
          <div
            className={`py-6 !pr-[18px] !pl-[30px] border-[1px] min-w-[400px] w-[450px] h-[450px]  overflow-y-auto flex flex-col  !items-center bg-white text-black text-md rounded-md shadow-md ${className}`}
          >
            {/* First Question */}
            {question1?.answer && (
              <>
                <div className=" flex  w-full  mb-[5px] ">
                  <div className="flex flex-col justify-start items-start w-full">
                    <Text className="text-sm text-start custom-bullet-point">
                      {question1?.answer
                        ? "Standard Pool Table"
                        : "No Standard Pool Table"}{" "}
                    </Text>
                    {question1?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question1_1?.answer
                            ? `- Quantity : ${question1_1?.answer}`
                            : `- Quantity : NA`}{" "}
                        </Text>
                        {question1_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question1_2?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question1_3 || []}
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] border-[1px] bg-[#D8D8D8] rounded-full"></div>
              </>
            )}
            {/* Second Question */}
            {question2?.answer && (
              <>
                <div className=" flex  w-full  mb-[5px] mt-[5px]">
                  <div className="flex flex-col justify-start items-start w-full ">
                    <Text className="text-sm text-start custom-bullet-point">
                      {question2?.answer
                        ? "Full Size Pool Table"
                        : "No Full Size Pool Table"}{" "}
                    </Text>
                    {question2?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question2_1?.answer
                            ? `- Quantity : ${question2_1?.answer}`
                            : `- Quantity : NA`}{" "}
                        </Text>
                        {question2_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question2_2?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question2_3 || []}
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
              </>
            )}
            {/* Thrird Question */}
            {question3?.answer && (
              <>
                <div className=" flex  w-full  mb-[5px] mt-[5px]">
                  <div className="flex flex-col justify-start items-start w-full">
                    <Text className="text-sm text-start custom-bullet-point">
                      {question3?.answer ? "Grand Piano" : "No Grand Piano"}{" "}
                    </Text>
                    {question3?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question3_1?.answer
                            ? `- Quantity : ${question3_1?.answer}`
                            : `- Quantity : NA`}{" "}
                        </Text>

                        {question3_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question3_2?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question3_3 || []}
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
              </>
            )}
            {/* Forth Question */}
            {question4?.answer && (
              <>
                <div className=" flex  w-full  mb-[5px] mt-[5px]">
                  <div className="flex flex-col justify-start items-start w-full ">
                    <Text className="text-sm text-start custom-bullet-point ">
                      {question4?.answer
                        ? "Baby Grand Piano"
                        : "No Baby Grand Piano"}{" "}
                    </Text>
                    {question4?.answer && (
                      <>
                        {question4_1?.answer
                          ? `- Quantity : ${question4_1?.answer}`
                          : `- Quantity : NA`}{" "}
                        {question4_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question4_2?.answer}
                          </Text>
                        )}
                      </>
                    )}
                    <ImageSlider
                      images={question4_3 || []}
                      setIsDragEnabled={setIsDragEnabled}
                    />
                  </div>
                </div>
                <div className="w-full h-[1px] bg-[#D8D8D8] border-[1px] rounded-full"></div>
              </>
            )}

            {/* fifth question */}
            {question5?.answer && (
              <>
                <div className=" flex  w-full mb-[5px] mt-[5px]">
                  <div className="flex flex-col justify-start items-start w-full">
                    <Text className="text-sm text-start custom-bullet-point">
                      {question5?.answer ? "Upright Piano" : "No Upright Piano"}{" "}
                    </Text>
                    {question5?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question5_1?.answer
                            ? `- Quantity : ${question5_1?.answer}`
                            : `- Quantity : NA`}{" "}
                        </Text>

                        {question5_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question3_2?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question5_3 || []}
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-[#D8D8D8]  border-[1px] rounded-full"></div>
              </>
            )}
            {/* six question */}
            {question6?.answer && (
              <>
                <div className=" flex  w-full   mt-[5px]">
                  <div className="flex flex-col justify-start items-start w-full ">
                    <Text className="text-sm text-start custom-bullet-point">
                      {question6?.answer
                        ? "Radiators Other"
                        : "No Radiators Other"}{" "}
                    </Text>
                    {question6?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question6_1?.answer
                            ? `- Quantity : ${question6_1?.answer}`
                            : `- Quantity : NA`}{" "}
                        </Text>

                        {question6_2?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question6_2?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question6_3 || []}
                          setIsDragEnabled={setIsDragEnabled}
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SpecialItemSummary;
