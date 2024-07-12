import React, { useState } from "react";
import Image from "../../Image";
import Text from "../../Text";
import ImageSliderPopup from "../../ImageSliderPopup";
import ImageSlider from "./ImageSlider";

const KitchenSummary = ({
  activeSummary,
  setIsDragEnabled,
  objectKey,
  className,
}) => {
  let allQuestions = [...activeSummary?.[objectKey]?.all_questions];

  // Question 1
  const question1 = allQuestions.find(
    (question) => question.question === "Refrigerator"
  );
  const question1_1 = question1?.subQuestion?.find(
    (question) => question.question === "Any water hookups"
  );
  const question1_2 = question1?.subQuestion?.find(
    (question) => question.question === "Any potential clearance issues"
  );
  const question1_3 = question1?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question1_4 = question1?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 2
  const question2 = allQuestions.find(
    (question) => question.question === "Dishwasher"
  );
  const question2_1 = question2?.subQuestion?.find(
    (question) => question.question === "Any potential clearance issues"
  );
  const question2_2 = question2?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question2_3 = question2?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 3
  const question3 = allQuestions.find(
    (question) => question.question === "Stove"
  );
  const question3_1 = question3?.subQuestion?.find(
    (question) => question.question === "Any Gas or Water hookups"
  );
  const question3_2 = question2?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question3_3 = question2?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  // Question 4
  const question4 = allQuestions.find(
    (question) => question.question === "Washer"
  );

  const question4_1 = question4?.subQuestion?.find(
    (question) => question.question === "Any Gas or Water hookups"
  );
  const question4_2 = question4?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question4_3 = question4?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 5
  const question5 = allQuestions.find(
    (question) => question.question === "Dryer"
  );
  const question5_1 = question5?.subQuestion?.find(
    (question) => question.question === "Any Gas or Water hookups"
  );
  const question5_2 = question5?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question5_3 = question5?.subQuestion?.find(
    (question) => question.question === "Add Images"
  );

  //Question 6
  const question6 = allQuestions.find(
    (question) => question.question === "Toilet"
  );
  const question6_1 = question6?.subQuestion?.find(
    (question) => question.question === "Notes"
  );
  const question6_2 = question6?.subQuestion?.find(
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
                      {question1?.answer ? "Refrigerator" : "No Refrigerator"}{" "}
                    </Text>
                    {question1?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question1_1?.answer
                            ? "- water hookups"
                            : "- No water hookups"}{" "}
                        </Text>
                        <Text className="text-sm text-start ml-[10px]">
                          {question1_2?.answer
                            ? "- potential clearance issues"
                            : "- No potential clearance issues"}{" "}
                        </Text>
                        {question1_3?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question1_3?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question1_4 || []}
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
                      {question2?.answer ? "Dishwasher" : "No Dishwasher"}{" "}
                    </Text>
                    {question2?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question2_1?.answer
                            ? "- potential clearance issues"
                            : "- No potential clearance issues"}{" "}
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
                      {question3?.answer ? "Stove" : "No Stove"}{" "}
                    </Text>
                    {question3?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question3_1?.answer
                            ? "- Gas or Water hookups"
                            : "- No Gas or Water hookups"}{" "}
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
                      {question4?.answer ? "Washer" : "No Washer"}{" "}
                    </Text>
                    {question4?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question4_1?.answer
                            ? "- Any Gas or Water hookups"
                            : "- No Any Gas or Water hookups"}{" "}
                        </Text>
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
                      {question5?.answer ? "Dryer" : "No Dryer"}{" "}
                    </Text>
                    {question5?.answer && (
                      <>
                        <Text className="text-sm text-start ml-[10px]">
                          {question5_1?.answer
                            ? "- Gas or Water hookups"
                            : "- No Gas or Water hookups"}{" "}
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
                      {question6?.answer ? "Toilet" : "No Toilet"}{" "}
                    </Text>
                    {question6?.answer && (
                      <>
                        {question6_1?.answer && (
                          <Text className="text-sm text-start ml-[10px]">
                            - Notes: {question6_1?.answer}
                          </Text>
                        )}
                        <ImageSlider
                          images={question6_2 || []}
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

export default KitchenSummary;
