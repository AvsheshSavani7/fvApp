import _ from "lodash";
import { setImageQuestionId, updateSingleCustomerApi } from "../redux/customer";

const removeImageFromQuestions = (questions, questionId, image) => {
  return questions.map((que) => {
    if (que.id === questionId && que.type === "IMAGE") {
      return {
        ...que,
        answer: que.answer.filter((url) => url !== image),
      };
    }
    if (que.subQuestion) {
      return {
        ...que,
        subQuestion: removeImageFromQuestions(
          que.subQuestion,
          questionId,
          image
        ),
      };
    }
    return que;
  });
};

export const removeImageFromStore = async (
  singleCustomerData,
  questionId,
  type,
  checkListIndex,
  storeKeyToUpdate,
  image,
  roomId,
  dispatch
) => {
  const cloneSingleCustomerData = _.cloneDeep(singleCustomerData);

  if (type === "CHECKLIST") {
    let updatedQuestions =
      cloneSingleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]
        ?.all_questions;

    if (updatedQuestions) {
      updatedQuestions = removeImageFromQuestions(
        updatedQuestions,
        questionId,
        image
      );
    }
    cloneSingleCustomerData[storeKeyToUpdate][checkListIndex].all_questions =
      updatedQuestions;
  } else if (type === "BUILDING") {
    let buildingUpdatedQuestions =
      cloneSingleCustomerData?.customer?.buildingType?.subQuestion;
    if (buildingUpdatedQuestions) {
      buildingUpdatedQuestions = removeImageFromQuestions(
        buildingUpdatedQuestions,
        questionId,
        image
      );
    }

    cloneSingleCustomerData.customer.buildingType.subQuestion =
      buildingUpdatedQuestions;

    dispatch(setImageQuestionId(Math.random()));
  } else if (type === "ROOM") {
    let scopeFloors = cloneSingleCustomerData?.scope?.floors;

    const updatedFloors = scopeFloors?.map((floor) => ({
      ...floor,
      rooms: floor?.rooms?.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            images: room.images?.filter((url) => url !== image),
          };
        }
        return room;
      }),
    }));

    cloneSingleCustomerData.scope.floors = updatedFloors;
  }

  await dispatch(updateSingleCustomerApi(cloneSingleCustomerData));
};
