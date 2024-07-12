import { useDispatch } from "react-redux";
import { singleCustomer, updateSingleCustomerApi } from "../redux/customer";
import _, { drop } from "lodash";
import Compressor from "compressorjs";
import axios from "axios";

export const formCheckCondition = (updatedCustomerData, prevInputValues) => {
  let checked =
    updatedCustomerData.name !== prevInputValues.name ||
    updatedCustomerData.address !== prevInputValues.address ||
    updatedCustomerData.email !== prevInputValues.email ||
    updatedCustomerData.phone !== prevInputValues.phone ||
    updatedCustomerData.temperature !== prevInputValues.temperature ||
    updatedCustomerData.humidity !== prevInputValues.humidity;
  return checked;
};

export const findQueAndSetAnswer = (
  singleCustomerData,
  queObj,
  checkListIndex,
  answer,
  dispatch,
  storeKeyToUpdate
) => {
  let allQuestions = [
    ...singleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]?.all_questions,
  ];

  let findQue = allQuestions?.find((que) => que?.id == queObj?.id); // find question by id from refinishing checklist
  let findQueIndex = allQuestions?.findIndex((que) => que?.id == queObj?.id);

  let queWithUpdatedAns = { ...findQue, answer };
  allQuestions[findQueIndex] = queWithUpdatedAns;

  let updatedRefinishing = [...singleCustomerData[storeKeyToUpdate]];
  updatedRefinishing[checkListIndex] = {
    ...updatedRefinishing[checkListIndex],
    all_questions: allQuestions,
  };

  dispatch(
    updateSingleCustomerApi({
      ...singleCustomerData,
      [storeKeyToUpdate]: updatedRefinishing,
    })
  );

  return allQuestions;
};

export const findSubQueAndSetAnswer = (
  singleCustomerData,
  questionId,
  queObj,
  checkListIndex,
  answer,
  dispatch,
  storeKeyToUpdate
) => {
  const updatedRefinishing = singleCustomerData?.[storeKeyToUpdate]?.map(
    (checklist, index) => {
      if (index !== checkListIndex) return checklist;

      const updatedQuestions = checklist?.all_questions?.map((question) => {
        if (question.id !== questionId) return question;

        const updatedSubQuestions = question?.subQuestion?.map((subQue) => {
          if (subQue.id !== queObj.id) return subQue;

          return { ...subQue, answer };
        });

        return { ...question, subQuestion: updatedSubQuestions };
      });

      return { ...checklist, all_questions: updatedQuestions };
    }
  );

  dispatch(
    updateSingleCustomerApi({
      ...singleCustomerData,
      [storeKeyToUpdate]: updatedRefinishing,
    })
  );

  return updatedRefinishing;
};

export const findSubofSubQueAndSetAnswer = (
  singleCustomerData,
  questionId,
  queObj,
  checkListIndex,
  answer,
  dispatch,
  storeKeyToUpdate
) => {
  let allQuestions = [
    ...singleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]?.all_questions,
  ];

  let updatedAllQuestions = _.map(allQuestions, (question) => {
    return {
      ...question,
      subQuestion: _.map(question.subQuestion, (subQuestion) => {
        return {
          ...subQuestion,
          subQuestion: _.map(subQuestion.subQuestion, (subSubQuestion) => {
            if (subSubQuestion.id === queObj?.id) {
              return {
                ...subSubQuestion,
                answer: answer,
              };
            }
            return subSubQuestion;
          }),
        };
      }),
    };
  });

  let updatedRefinishing = [...singleCustomerData?.[storeKeyToUpdate]];
  updatedRefinishing[checkListIndex] = {
    ...updatedRefinishing[checkListIndex],
    all_questions: updatedAllQuestions,
  };

  dispatch(
    updateSingleCustomerApi({
      ...singleCustomerData,
      [storeKeyToUpdate]: updatedRefinishing,
    })
  );

  return updatedRefinishing;
};

// For Sub Floor sub question
export const subFloorfindSubQueAndSetAnswer = (
  singleCustomerData,
  questionId,
  queObj,
  checkListIndex,
  answer,
  dispatch,
  storeKeyToUpdate
) => {
  const updatedRefinishing = singleCustomerData?.[storeKeyToUpdate]?.map(
    (checklist, index) => {
      if (index !== checkListIndex) return checklist;

      const updatedQuestions = checklist?.all_questions?.map((question) => {
        if (question.id !== questionId) return question;

        const updatedSubQuestions = question?.subQuestion?.map(
          (subQuewithGrid) => ({
            ...subQuewithGrid,
            subQuestion: subQuewithGrid?.subQuestion?.map((subQue) => {
              if (subQue.id !== queObj.id) return subQue;
              return { ...subQue, answer };
            }),
          })
        );

        return { ...question, subQuestion: updatedSubQuestions };
      });

      return { ...checklist, all_questions: updatedQuestions };
    }
  );

  dispatch(
    updateSingleCustomerApi({
      ...singleCustomerData,
      [storeKeyToUpdate]: updatedRefinishing,
    })
  );

  return updatedRefinishing;
};

// Subfloor sub of sub question

export const subFloorfindSubofSubQueAndSetAnswer = (
  singleCustomerData,
  queObj,
  checkListIndex,
  answer,
  dispatch,
  storeKeyToUpdate
) => {
  let allQuestions = [
    ...singleCustomerData?.[storeKeyToUpdate]?.[checkListIndex]?.all_questions,
  ];

  let updatedAllQuestions = _.map(allQuestions, (question) => {
    return {
      ...question,
      subQuestion: _.map(question.subQuestion, (subQuestion) => {
        return {
          ...subQuestion,
          subQuestion: _.map(subQuestion.subQuestion, (subQuestionGrid) => {
            return {
              ...subQuestionGrid,
              subQuestion: _.map(
                subQuestionGrid.subQuestion,
                (subSubQuestion) => {
                  if (subSubQuestion.id === queObj?.id) {
                    return {
                      ...subSubQuestion,
                      answer: answer,
                    };
                  }
                  return subSubQuestion;
                }
              ),
            };
          }),
        };
      }),
    };
  });

  let updatedRefinishing = [...singleCustomerData?.[storeKeyToUpdate]];
  updatedRefinishing[checkListIndex] = {
    ...updatedRefinishing[checkListIndex],
    all_questions: updatedAllQuestions,
  };

  dispatch(
    updateSingleCustomerApi({
      ...singleCustomerData,
      [storeKeyToUpdate]: updatedRefinishing,
    })
  );

  return updatedRefinishing;
};

export const getSubQuestions = (
  checkListIndex,
  questionId,
  singleCustomerData
) => {
  let allQuestions = [
    ...singleCustomerData?.refinishing_checklists?.[checkListIndex]
      ?.all_questions,
  ];

  let findQue = allQuestions?.find((que) => que?.id == questionId);

  let filteredSubQuestions = findQue?.subQuestion?.filter(
    (subQue) => subQue?.whenToShow === findQue?.answer
  );
  return filteredSubQuestions;
};

export const getSubofSubQuestions = (
  checkListIndex,
  questionId,
  subQueId,
  singleCustomerData,
  subofSubQuestions
) => {
  let allQuestions = [
    ...singleCustomerData?.refinishing_checklists?.[checkListIndex]
      ?.all_questions,
  ];

  let findQue = allQuestions?.find((que) => que?.id == questionId);

  // debugger;
  let findSubQue = findQue?.subQuestion?.find(
    (subque) => subque?.id == subQueId
  );

  let filteredSubofSubQuestions = findSubQue?.subQuestion?.filter(
    (subSubQue) => subSubQue?.whenToShow === findSubQue?.answer
  );

  // let filteredSubQue = subofSubQuestions?.filter(
  //   (que) => que?.id != filteredSubofSubQuestions?.some((subQue) => subQue?.id)
  // );

  let tmpSubofSubQueArr = [...subofSubQuestions];

  if (filteredSubofSubQuestions?.length > 0) {
    const isAnyObjectInArray2 = _.some(tmpSubofSubQueArr, (item1) =>
      _.some(filteredSubofSubQuestions, (item2) => item1.id === item2.id)
    );
    if (!isAnyObjectInArray2)
      tmpSubofSubQueArr.push(...filteredSubofSubQuestions);
  } else {
    const updatedSubQuestions = _.differenceWith(
      tmpSubofSubQueArr,
      findSubQue?.subQuestion,
      _.isEqual
    );
    tmpSubofSubQueArr = updatedSubQuestions;
  }

  return tmpSubofSubQueArr;
};

export const setBuildingTypeSubQueAnswer = (
  singleCustomerData,
  dispatch,
  subQuqIndex,
  customerId,
  value
) => {
  let updatedBuildingTypeSubQue = [
    ...singleCustomerData?.customer?.buildingType?.subQuestion,
  ];
  updatedBuildingTypeSubQue[subQuqIndex] = {
    ...updatedBuildingTypeSubQue?.[subQuqIndex],
    answer: value,
  };
  if (customerId) {
    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        customer: {
          ...singleCustomerData.customer,
          buildingType: {
            ...singleCustomerData.customer.buildingType,
            subQuestion: updatedBuildingTypeSubQue,
          },
        },
      })
    );
  } else {
    dispatch(
      singleCustomer({
        ...singleCustomerData,
        customer: {
          ...singleCustomerData.customer,
          buildingType: {
            ...singleCustomerData.customer.buildingType,
            subQuestion: updatedBuildingTypeSubQue,
          },
        },
      })
    );
  }
};

export const setBuildingTypeSubofSubQueAnswer = (
  singleCustomerData,
  dispatch,
  subQuqIndex,
  subofSubQueid,
  customerId,
  value
) => {
  let updatedBuildingTypeSubQue = [
    ...singleCustomerData?.customer?.buildingType?.subQuestion,
  ];

  let updatedSubQue = updatedBuildingTypeSubQue?.map((subQue) => ({
    ...subQue,
    subQuestion: subQue?.subQuestion?.map((subofsubQue) => {
      if (subofsubQue?.id === subofSubQueid) {
        return { ...subofsubQue, answer: value };
      }
      return subofsubQue;
    }),
  }));
  if (customerId) {
    dispatch(
      updateSingleCustomerApi({
        ...singleCustomerData,
        customer: {
          ...singleCustomerData.customer,
          buildingType: {
            ...singleCustomerData.customer.buildingType,
            subQuestion: updatedSubQue,
          },
        },
      })
    );
  } else {
    dispatch(
      singleCustomer({
        ...singleCustomerData,
        customer: {
          ...singleCustomerData.customer,
          buildingType: {
            ...singleCustomerData.customer.buildingType,
            subQuestion: updatedSubQue,
          },
        },
      })
    );
  }
};

export const changeFloorNameByFloorIndex = (
  updatedSingleCustomer,
  droppedRoom
) => {
  const allRooms = updatedSingleCustomer.scope.floors.flatMap(
    (floor) => floor.rooms
  );

  const matchingRooms = allRooms.filter(
    (room) => room?.type === droppedRoom?.type
    // room.name.includes(
    //   droppedRoom.name === "Bed" &&  ? "Mas. Bed" : droppedRoom.name
    // )
  );

  if (matchingRooms.length > 1) {
    let uniqueIndex = 1;

    updatedSingleCustomer.scope.floors.forEach((floor) => {
      matchingRooms.forEach((matchingRoom) => {
        const matchingRoomIndex = floor.rooms.findIndex(
          (room) => room.id === matchingRoom.id
        );
        // debugger

        // Update room name with unique index
        if (matchingRoomIndex !== -1) {
          const updatedFloor = { ...floor };
          updatedFloor.rooms[matchingRoomIndex] = {
            ...updatedFloor.rooms[matchingRoomIndex],
            name: `${droppedRoom.name} - ${uniqueIndex}`,
            type: droppedRoom.name,
          };
          uniqueIndex++;
        }
      });
    });
  }
  return updatedSingleCustomer.scope;
};

export const updateSummaryFloorsAndQuestion = (
  addedFloors,
  singleCustomerData,
  questionToShow,
  Question,
  storeKey,
  checklistKey
) => {
  let floors = JSON.parse(JSON.stringify(addedFloors));
  const colorArray = [
    "#1E2E5A",
    "#F9832C",
    "#004E6A",
    "#607D8B",
    "#795548",
    "#F41FB3",
    "#EDD18E",
    "#41644A",
    "#E19898",
    "#A2678A",
    "#A1CCD1",
    "#7C9D96",
    "#E7B10A",
    "#898121",
    "#B7B7B7",
  ];

  const oneQuestion = {
    questionName: "",
    option: [],
  };
  let usedOptions = new Set();
  let updatedOptions = [];
  const matchingOption = (type, answer) => {
    if (type === "DROPDOWN") {
      if (answer) {
        usedOptions.add(answer);
      }
      return updatedOptions.find((option) => option.name === answer);
    } else if (type === "BOOLEAN") {
      return answer === true
        ? { color: "#1E2E5A" }
        : answer === "none"
        ? { color: "#D8D8D8" }
        : { color: "#E57D1D" };
    }
    return null;
  };
  for (let index = 0; index < floors.length; index++) {
    for (let j = 0; j < floors[index].rooms.length; j++) {
      const room = floors[index].rooms[j];
      const existingMaterialCheckListId = room?.[checklistKey];

      if (
        existingMaterialCheckListId &&
        existingMaterialCheckListId !== "OutOfScope"
      ) {
        const checklistObject = singleCustomerData?.[storeKey].find(
          ({ id }) => id === existingMaterialCheckListId
        );

        const questionObj = checklistObject.all_questions.find(
          ({ question }) => question === Question
        );

        if (questionObj) {
          updatedOptions = questionObj?.option?.map((option, i) => ({
            name: option,
            color: colorArray[i],
          }));

          const { type, answer } = questionObj;
          const option = matchingOption(type, answer);

          if (option) {
            room.bgColor = option.color;
          } else {
            room.bgColor = "";
          }

          oneQuestion.questionName = questionToShow;
          oneQuestion.option =
            type === "DROPDOWN"
              ? questionObj.option.map((opt, i) => ({
                  name: opt,
                  color: colorArray[i],
                }))
              : [
                  { name: "Yes", color: "#1E2E5A" },
                  { name: "No", color: "#E57D1D" },
                ];
        }
      } else if (existingMaterialCheckListId === "OutOfScope") {
        room.bgColor = "#D8D8D8";
      } else {
        room.bgColor = "";
      }
    }
  }

  if (
    (Question === "Species" ||
      Question === "Floor Covering" ||
      Question === "Type" ||
      Question === "Layout") &&
    usedOptions.size > 0
  ) {
    updatedOptions = updatedOptions.filter((option) =>
      usedOptions.has(option.name)
    );
    oneQuestion.option = updatedOptions;
  } else if (
    (Question === "Species" ||
      Question === "Floor Covering" ||
      Question === "Type" ||
      Question === "Layout") &&
    usedOptions.size === 0
  ) {
    oneQuestion.option = [];
  }

  return { floors, oneQuestion };
};

// check mandatory field is filled out or not
export const checkFilledOut = (queObj, type) => {
  let filled = false;
  if (queObj?.mandatory) {
    if (queObj?.type === "BOOLEAN") {
      if (type === "building") {
        if (queObj?.answer === true) {
          filled = true;
        }
      } else {
        if (queObj?.answer !== "none") {
          filled = true;
        }
      }
    } else {
      if (typeof queObj?.answer === "object" && queObj?.answer?.length > 0) {
        filled = true;
      } else if (queObj?.type === "RANGE" && queObj?.answer > 0) {
        filled = true;
      } else if (typeof queObj?.answer === "string" && queObj?.answer !== "") {
        filled = true;
      }
    }
  } else {
    filled = true;
  }
  return filled;
};

export const checkFilledOutFromAnswer = (queObj, answer, storeKeyToUpdate) => {
  let filled = false;

  if (queObj?.mandatory) {
    if (queObj?.type === "BOOLEAN") {
      if (
        storeKeyToUpdate === "existing_materials" ||
        storeKeyToUpdate === "staircases" ||
        storeKeyToUpdate === "kitchen_furnitures" ||
        storeKeyToUpdate === "building"
      ) {
        if (answer !== "none") {
          filled = true;
        }
      } else {
        if (answer !== "none" && answer === true) {
          filled = true;
        }
      }
    } else {
      if (typeof answer === "object" && answer?.length > 0) {
        filled = true;
      } else if (typeof answer === "string" && answer !== "") {
        filled = true;
      }
    }
  } else {
    filled = true;
  }
  return filled;
};

export const checkSubQueFilledOut = (queObj, type) => {
  let filled = true;
  if (type !== undefined && type === "subFloor") {
    let flatArray = queObj?.subQuestion?.flatMap((arr) => arr?.subQuestion);

    if (flatArray?.length > 0) {
      for (const subque of flatArray) {
        if (subque?.mandatory && subque?.whenToShow === queObj?.answer) {
          if (subque?.type === "BOOLEAN") {
            if (subque?.answer === "none") {
              filled = false;
              break;
            }
          } else if (
            typeof subque?.answer === "string" &&
            subque?.answer === ""
          ) {
            filled = false;
            break;
          } else if (
            typeof subque?.answer === "object" &&
            subque?.answer?.length === 0
          ) {
            filled = false;
            break;
          }
        }
      }
    }
    return filled;
  } else if (type === "building") {
    if (queObj?.subQuestion?.length > 0) {
      for (const subque of queObj?.subQuestion) {
        if (subque?.subQuestion) {
          for (const subofsubque of subque?.subQuestion) {
            if (
              subofsubque?.mandatory &&
              subofsubque?.whenToShow === subque?.answer
            ) {
              if (subofsubque?.type === "BOOLEAN") {
                if (subofsubque?.answer === "none") {
                  filled = false;
                  break;
                }
              } else if (
                typeof subofsubque?.answer === "string" &&
                subofsubque?.answer === ""
              ) {
                filled = false;
                break;
              } else if (
                typeof subofsubque?.answer === "object" &&
                subofsubque?.answer?.length === 0
              ) {
                filled = false;
                break;
              }
            }
          }
        } else {
          if (subque?.mandatory && subque?.whenToShow === queObj?.answer) {
            if (subque?.type === "BOOLEAN") {
              if (subque?.answer === "none") {
                filled = false;
                break;
              }
            } else if (
              typeof subque?.answer === "string" &&
              subque?.answer === ""
            ) {
              filled = false;
              break;
            } else if (
              typeof subque?.answer === "object" &&
              subque?.answer?.length === 0
            ) {
              filled = false;
              break;
            }
          }
        }
      }
    }
    return filled;
  } else if (
    type === "kitchen_furnitures" ||
    type === "specialItem_furnitures"
  ) {
    if (queObj?.subQuestion?.length > 0) {
      for (const subque of queObj?.subQuestion) {
        if (subque?.mandatory && subque?.whenToShow === queObj?.answer) {
          if (subque?.type === "BOOLEAN") {
            if (subque?.answer === "none") {
              filled = false;
              break;
            }
          } else if (
            typeof subque?.answer === "string" &&
            subque?.answer === ""
          ) {
            filled = false;
            break;
          } else if (
            typeof subque?.answer === "object" &&
            subque?.answer?.length === 0
          ) {
            filled = false;
            break;
          }
        }
      }
    }
    return filled;
  } else {
    if (
      queObj?.question === "Excessive damage (ex. pet stains,cracked boards)" ||
      queObj?.question === "Surface issues ( ex. mastic, paint, wax)"
    ) {
      if (queObj?.answer) {
        for (const subque of queObj.subQuestion) {
          if (subque.answer !== "none" && subque.answer) {
            filled = true;
            break;
          } else {
            filled = false;
          }
        }
      }
    } else {
      if (queObj?.subQuestion) {
        for (const subque of queObj?.subQuestion) {
          if (subque?.mandatory && subque?.whenToShow === queObj?.answer) {
            if (subque?.type === "BOOLEAN") {
              if (subque?.answer === "none") {
                filled = false;
                break;
              }
            } else if (subque?.answer === "" || subque?.answer?.length === 0) {
              filled = false;
              break;
            } else {
              if (subque?.subQuestion) {
                // filled = subque.subQuestion?.every(
                //   (subofsub) =>
                //     !subofsub.mandatory ||
                //     subofsub.whenToShow !== subque.answer ||
                //     (subofsub.answer !== "none" &&
                //       subofsub.answer !== "" &&
                //       subofsub.answer?.length !== 0)
                // );

                for (const subofSubQue of subque.subQuestion) {
                  if (
                    subofSubQue.mandatory &&
                    subofSubQue.whenToShow === subque.answer
                  ) {
                    if (
                      subofSubQue.answer === "none" ||
                      subofSubQue.answer === "" ||
                      subofSubQue.answer?.length === 0
                    ) {
                      filled = false;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return filled;
  }
};

export const checkAnswerExist = (allrefinishingChecklist) => {
  let answerExist = [];
  allrefinishingChecklist?.map((cl) => {
    cl?.all_questions?.map((que) => {
      if (
        (que?.type === "TEXT" || que?.type === "DROPDOWN") &&
        que?.answer !== ""
      ) {
        if (!answerExist?.includes(cl)) {
          answerExist?.push(cl);
        }
      } else if (que?.type === "BOOLEAN" && que?.answer !== "none") {
        if (!answerExist?.includes(cl)) {
          answerExist?.push(cl);
        }
      }
    });
  });

  return answerExist;
};

// coompress image with compressor.js
export const handleImageCompression = async (file) => {
  try {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Adjust the quality (0 to 1)
        // maxWidth: 1920,
        // maxHeight: 1920,
        success(result) {
          // `result` is the compressed Blob or File object
          resolve(result);
        },
        error(err) {
          console.error("Image compression error:", err.message);
          reject(err);
        },
      });
    });

    // Handle the compressedFile as needed (e.g., upload or display)
    return compressedFile;
  } catch (error) {
    console.error("Error compressing the image:", error);
  }
};

// reduce checklist's questions with recursion
export const reduceQuestions = (checklists) => {
  const flattenQuestions = (questions) => {
    return questions.map((que) => {
      const { id, question, answer, type, whenToShow, subQuestion } = que;

      let subQues = [];
      if (subQuestion && subQuestion?.length > 0) {
        // subQuestion.filter((subQue) => subQue.whenToShow === answer)
        subQues = flattenQuestions(subQuestion);
      }

      return { id, question, answer, type, whenToShow, subQuestion: subQues };
    });
  };

  return checklists?.map((cl) => ({
    ...cl,
    all_questions: flattenQuestions(cl.all_questions),
  }));
};

export const reduceQuestionsForSubfloor = (checklists) => {
  const flattenQuestions = (questions) => {
    return questions.map((que) => {
      const { id, question, answer, type, whenToShow, level, subQuestion } =
        que;

      let flatSubQuestions = [];
      if (level === 1) {
        flatSubQuestions = subQuestion?.flatMap(
          (subQue) => subQue?.subQuestion
        );
      } else {
        flatSubQuestions = subQuestion;
      }

      let subQues = [];
      if (flatSubQuestions && flatSubQuestions?.length > 0) {
        // flatSubQuestions.filter((subQue) => subQue.whenToShow === answer)
        subQues = flattenQuestions(flatSubQuestions);
      }

      return { id, question, answer, type, whenToShow, subQuestion: subQues };
    });
  };

  return checklists?.map((cl) => ({
    ...cl,
    all_questions: flattenQuestions(cl.all_questions),
  }));
};

export const fetchAndCompressImage = async (imageUrl) => {
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "blob", // This ensures the response is a Blob
    });

    const blob = response.data; // The image blob

    const compressedBlob = await new Promise((resolve, reject) => {
      new Compressor(blob, {
        quality: 0.1,
        success: resolve,
        error: reject,
      });
    });

    // return the image data-URI
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // This is the Data URI
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob); // Read the blob as a Data URL
    });

    // return blob URL
    // const imgSrc = URL.createObjectURL(compressedBlob)
    // return imgSrc // Return the compressed image source
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to be handled where this function is called
  }
};
