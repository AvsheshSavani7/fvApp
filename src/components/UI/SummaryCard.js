import React from "react";
import Image from "./Image";
import Text from "./Text";

const SummaryCard = ({
  activeSummary,
  setIsDragEnabled,
  objectKey,
  className,
}) => {
  let allQuestions = [...activeSummary?.[objectKey]?.all_questions];
  let findImageQueIndex = allQuestions?.findIndex(
    (que) => que?.type === "IMAGE"
  );
  let imageQue = allQuestions?.splice(findImageQueIndex, 1);
  let newQueArr = [...allQuestions, ...imageQue];


  return (
    <div
      className={`py-6 px-10 border-[1px] min-w-[400px] min-h-[300px] flex items-center bg-white text-black text-md rounded-md shadow-md ${className}`}
    >
      <ul className="space-y-2">
        {objectKey === "molding" ||
        objectKey === "matching" ||
        objectKey === "kitchen" ? (
          <></>
        ) : (
          <>
            {!!activeSummary?.withinRoomName && (
              <div className="custom-bullet-point flex items-center gap-2">
                <Text className="text-sm">Within:</Text>
                <Text className="text-sm font-semibold">
                  {activeSummary?.withinRoomName}
                </Text>
              </div>
            )}
            {!!activeSummary?.fromRoomName && (
              <div className="custom-bullet-point flex items-center gap-2">
                <Text className="text-sm">From:</Text>
                <Text className="text-sm font-semibold">
                  {activeSummary?.fromRoomName} to {activeSummary?.toRoomName}
                </Text>
              </div>
            )}
          </>
        )}
        {newQueArr?.map((question) => (
          <li className={`custom-bullet-point flex gap-2`}>
            {question?.type !== "IMAGE" ? (
              <Text className="text-sm text-start">
                {question?.question}:{" "}
                <span className="font-semibold">
                  {question?.answer === true
                    ? "Yes"
                    : question?.answer === false
                    ? "No"
                    : question?.answer}
                </span>
              </Text>
            ) : (
              <>
                <Text className="text-sm text-start">
                  {question?.question}:
                </Text>
                <div
                  className="w-[270px] !overflow-scroll flex items-center gap-2"
                  onMouseEnter={() => setIsDragEnabled(false)}
                  onMouseLeave={() => setIsDragEnabled(true)}
                  onTouchStart={() => setIsDragEnabled(false)}
                  onTouchEnd={() => setIsDragEnabled(true)}
                >
                  {question?.answer?.length > 0 ? (
                    question?.answer?.map((image) => (
                      <Image
                        className="w-[80px] h-[80px] rounded-lg"
                        src={image || ""}
                      />
                    ))
                  ) : (
                    <span className="text-sm">No images</span>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryCard;
