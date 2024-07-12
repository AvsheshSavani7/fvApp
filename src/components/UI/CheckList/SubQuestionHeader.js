import React from "react";
import GetIconFile from "../../../assets/GetIconFile";
import Text from "../Text";

const SubQuestionHeader = ({ question, answer, setSubQuesionsShow }) => {
  return (
    <div className="w-full flex items-center gap-4 h-[48px] px-[20px] mb-[3px] bg-[#F8F8F8]">
      <div className="flex justify-start">
        <GetIconFile
          iconName="back-icon"
          onClick={() => setSubQuesionsShow(false)}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Text className="text-[14px] font-medium">{question}</Text>
        <span>:</span>
        <span className="text-[14px] font-normal">
          {typeof answer === "boolean" ? (answer ? "Yes" : "No") : answer}
        </span>
      </div>
    </div>
  );
};

export default SubQuestionHeader;
