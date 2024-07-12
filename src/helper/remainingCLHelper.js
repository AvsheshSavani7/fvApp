const checkIsQueRemaining = (question, type) => {
  const mandateQueCondition =
    !!question?.[type] &&
    (question.answer === "none" ||
      question.answer === "" ||
      question.answer?.length === 0 ||
      question.answer === 0);

  if (mandateQueCondition) {
    return { isQueRemaining: true, type: "mandatory" };
  } else {
    return { isQueRemaining: false, type: null };
  }
};

const checkIsQueRemainingForSub = (question, type, answer) => {
  const mandateQueCondition =
    question?.[type] &&
    question?.whenToShow === answer &&
    (question.answer === "none" ||
      question.answer === "" ||
      question.answer?.length === 0);

  if (mandateQueCondition) {
    return { isQueRemaining: true, type: "mandatory" };
  } else {
    return { isQueRemaining: false, type: null };
  }
};

const pushMainQueToRemainingObj = (
  remainingQueObj,
  question,
  type,
  mainClKey,
  clIndexKey,
  color
) => {
  let remainingObj = { ...remainingQueObj };

  if (!remainingObj[type][mainClKey][clIndexKey]) {
    remainingObj[type][mainClKey][clIndexKey] = [];
  }

  const mainQueIndex = remainingObj[type][mainClKey][clIndexKey]?.findIndex(
    (que) => que?.question === question?.question
  );
  if (mainQueIndex === -1) {
    const queObj = {
      question: question?.question,
      subQuestion: [],
      color,
    };
    remainingObj[type][mainClKey][clIndexKey]?.push(queObj);
  }
  return remainingObj;
};

const pushSubQueToRemainingObj = (
  remainingObj,
  mainQues,
  subQues,
  type,
  mainClKey,
  clIndexKey,
  color
) => {
  let newRemainingObj = { ...remainingObj };

  if (!newRemainingObj[type][mainClKey][clIndexKey]) {
    newRemainingObj[type][mainClKey][clIndexKey] = [];
  }

  const mainQueIndex = newRemainingObj[type][mainClKey][clIndexKey]?.findIndex(
    (que) => que?.question === mainQues?.question
  );

  const subQueObj = {
    question: subQues?.question,
    subQuestion: [],
  };

  if (mainQueIndex === -1) {
    const queObj = {
      question: mainQues?.question,
      subQuestion: [subQueObj],
      color,
    };
    newRemainingObj[type][mainClKey][clIndexKey]?.push(queObj);
  } else {
    const subQueIndex = newRemainingObj[type][mainClKey][clIndexKey][
      mainQueIndex
    ]?.subQuestion?.findIndex((sub) => sub?.question === subQues?.question);
    if (subQueIndex === -1) {
      newRemainingObj[type][mainClKey][clIndexKey][
        mainQueIndex
      ]?.subQuestion?.push(subQueObj);
    }
  }
  return newRemainingObj;
};

const pushSubofSubQueToRemainingObj = (
  remainingObj,
  mainQues,
  subQues,
  subofSubQues,
  type,
  mainClKey,
  clIndexKey,
  color
) => {
  let newRemainingObj = { ...remainingObj };

  if (!newRemainingObj[type][mainClKey][clIndexKey]) {
    newRemainingObj[type][mainClKey][clIndexKey] = [];
  }

  const mainQueIndex = newRemainingObj[type][mainClKey][clIndexKey]?.findIndex(
    (que) => que?.question === mainQues?.question
  );

  const subofSubQueObj = {
    question: subofSubQues?.question,
    subQuestion: [],
  };

  if (mainQueIndex === -1) {
    const queObj = {
      question: mainQues?.question,
      subQuestion: [
        { question: subQues?.question, subQuestion: [subofSubQueObj] },
      ],
      color,
    };
    newRemainingObj[type][mainClKey][clIndexKey]?.push(queObj);
  } else {
    const subQueIndex = newRemainingObj[type][mainClKey][clIndexKey][
      mainQueIndex
    ]?.subQuestion?.findIndex((sub) => sub?.question === subQues?.question);

    if (subQueIndex === -1) {
      const updatedSubofSubQueObj = {
        question: subQues?.question,
        subQuestion: [subofSubQueObj],
      };

      newRemainingObj[type][mainClKey][clIndexKey][
        mainQueIndex
      ]?.subQuestion?.push(updatedSubofSubQueObj);
    } else {
      const subofSubQueIndex = newRemainingObj[type][mainClKey][clIndexKey][
        mainQueIndex
      ]?.subQuestion?.[subQueIndex]?.subQuestion?.findIndex(
        (subofsub) => subofsub?.question === subofSubQues?.question
      );

      if (subofSubQueIndex === -1) {
        newRemainingObj[type][mainClKey][clIndexKey][
          mainQueIndex
        ]?.subQuestion?.[subQueIndex]?.subQuestion?.push(subofSubQueObj);
      }
    }
  }
  return newRemainingObj;
};

const getInValidRooms = (checklist, floors, clKey, clId, clIndexKey) => {
  let inValidRooms = [];
  if (floors?.length > 0) {
    if (clKey === "staircase_from_ids") {
      checklist?.map((st, idx) => {
        if (st?.from_floor_id === "") {
          inValidRooms.push(`Staircase ${idx + 1}`);
        }
      });
    } else if (clKey === "transition_from_ids") {
      checklist?.map((transition, idx) => {
        if (
          transition?.within_room_id === "" &&
          transition?.from_room_id === ""
        ) {
          inValidRooms.push(`Transition ${idx + 1}`);
        }
      });
    } else if (clKey === "levelling_id") {
      checklist?.map((l, idx) => {
        if (l?.within_room_id?.length === 0) {
          inValidRooms.push(`Levelling ${idx + 1}`);
        }
      });
    } else {
      for (const floor of floors) {
        if (floor?.rooms) {
          for (const room of floor?.rooms) {
            if (room?.[clKey] === "" || room?.[clKey]?.length === 0) {
              inValidRooms?.push(room?.name);
            }
          }
        }
      }
    }
  }
  return inValidRooms;
};

export const pushRemainingFieldsToObj = (
  checklist,
  mainClKey,
  remainingQueObj,
  setRemainingQueObj,
  floors,
  clKey
) => {
  let remainingObj = { ...remainingQueObj };
  checklist?.forEach((cl, index) => {
    const clIndexKey = `${mainClKey} ${index + 1}`;

    cl?.all_questions?.forEach((que) => {
      const type = que?.mandatory
        ? "mandatory"
        : que?.important
        ? "important"
        : "";

      if (!!type) {
        const { isQueRemaining } = checkIsQueRemaining(que, type);
        if (isQueRemaining) {
          remainingObj = pushMainQueToRemainingObj(
            remainingObj,
            que,
            type,
            mainClKey,
            clIndexKey,
            cl?.color
          );
        }

        if (que?.subQuestion?.length > 0) {
          let subQuestions = que?.subQuestion;

          if (mainClKey === "Subfloor Checklist") {
            subQuestions = que?.subQuestion?.flatMap((sub) => sub?.subQuestion);
          }

          subQuestions?.forEach((subque) => {
            const type = subque?.mandatory
              ? "mandatory"
              : subque?.important
              ? "important"
              : "";

            const { isQueRemaining } = checkIsQueRemainingForSub(
              subque,
              type,
              que.answer
            );
            if (isQueRemaining) {
              remainingObj = pushSubQueToRemainingObj(
                remainingObj,
                que,
                subque,
                type,
                mainClKey,
                clIndexKey,
                cl?.color
              );
            }

            if (subque?.subQuestion?.length > 0) {
              subque?.subQuestion?.forEach((subofsubque) => {
                const type = subofsubque?.mandatory
                  ? "mandatory"
                  : subque?.important
                  ? "important"
                  : "";
                const { isQueRemaining } = checkIsQueRemainingForSub(
                  subofsubque,
                  type,
                  subque.answer
                );
                if (isQueRemaining) {
                  remainingObj = pushSubofSubQueToRemainingObj(
                    remainingObj,
                    que,
                    subque,
                    subofsubque,
                    type,
                    mainClKey,
                    clIndexKey,
                    cl?.color
                  );
                }
              });
            }
          });
        }

        const inValidRooms = getInValidRooms(
          checklist,
          floors,
          clKey,
          cl?.id,
          clIndexKey
        );
        if (
          !remainingObj[type][mainClKey].inValidRooms &&
          inValidRooms?.length > 0
        ) {
          remainingObj[type][mainClKey].inValidRooms = inValidRooms;
        }
      }
    });
  });

  setRemainingQueObj(remainingObj);
};
