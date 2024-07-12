import React, { useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./CustomerDetailForm";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import Text from "../UI/Text";
import {
  setActiveMatchingInstallationChecklistId,
  setActiveMatchingRefinishingChecklistId,
  setMatchingActiveBtn,
  updateSingleCustomerApi,
} from "../../redux/customer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import MuiSnackbar from "../UI/MuiSnackbar";
import Button from "../UI/Button";
import {
  matchingInstallationChecklist,
  matchingRefinishingChecklist,
} from "../../utils/matchingChecklist";
import MainQueGrid from "../UI/QuestionTypes/MainQueGrid";
import GetIconFile from "../../assets/GetIconFile";
import RemoveDialog from "../UI/RemoveDialog";
import VerticalDivider from "../UI/VerticalDivider";
import MatchingProjectFloors from "../UI/CheckList/MatchingBtns/MatchingProjectFloors";
import MatchingProjectFloorSummary from "../UI/CheckList/MatchingBtns/MatchingProjectFloorSummary";
import InstallaltionMainQueGrid from "../UI/QuestionTypes/InstallaltionMainQueGrid";
import RoomArea from "../RoomAreaComponent/RoomArea";
import MatchingRefinishingSummary from "../UI/CheckList/MatchingBtns/MatchingRefinishingSummary";
import MatchingInstallationSummary from "../UI/CheckList/MatchingBtns/MatchingInstallationSummary";
import { Constants } from "../../utils/Constants";
import { usePreview } from "react-dnd-preview";
import OutOfScopeBtn from "../UI/OutOfScopeBtn";

const StyledGrid = styled(Grid)({
  height: "100%",
  display: "flex !important",
  position: "relative",
});

const FirstGrid = styled(Grid)({
  height: "100%",
});

const SecondGrid = styled(Grid)({
  height: "100%",
});

const QueGrid = styled(Grid)({
  padding: "14px 24px 0 31px",
});

const ProjectGrid = styled(Grid)({
  padding: "16px 0",
  display: "flex",
  justifyContent: "center",
  height: "100%",
});

const CarouselContainer = styled("div")({
  minHeight: "624px",
});

let customDotStyles = `
    .slick-dots {
      bottom: -72px;
    }

    .slick-dots li button:before {
      color: gray; 
      font-size: 20px !important;
    }
    .slick-list{
      overflow:visible;
    }

    
    // .slick-dots li button {
    //   width: 100px; 
    //   height: 100px; 
    // }
  `;

let subQustionsArr1 = [
  {
    id: uuidv4(),
    level: 1,
    question: "Does customer have material specs?",
    answer: "none",
    type: "BOOLEAN",
    col: 12,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Photo of floor",
    answer: [],
    type: "IMAGE",
    col: 6,
    mandatory: true,
    hasHalfWidth: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Photo of Specs",
    answer: [],
    type: "IMAGE",
    col: 6,
    mandatory: true,
    hasHalfWidth: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Notes",
    answer: "",
    type: "TEXT",
    col: 12,
    mandatory: false,
  },
];

let subQustionsArr2 = [
  {
    id: uuidv4(),
    level: 1,
    question: "Type",
    answer: "",
    type: "DROPDOWN",
    option: [
      "Site Finished Solid",
      "Site Finished Engineered",
      "Prefinished Solid",
      "Prefinished Engineered",
      "Unknown",
      "New Installation",
    ],
    col: 3,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Species",
    answer: "",
    type: "DROPDOWN",
    option: [
      "White Oak",
      "Red Oak",
      "Southern Yellow Pine",
      "Heart Pine",
      "Eastern White Pine",
      "Pine - Unknown",
      "Maple",
      "Walnut",
      "Brazilian Cherry",
      "Ash",
      "Douglas Fir",
      "Oak - Unknown Type",
      "Other",
    ],
    col: 3,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Layout",
    answer: "",
    type: "DROPDOWN",
    option: ["Straight", "Diagonal", "Herringbone", "Chevron", "Other"],
    col: 3,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Width",
    answer: "",
    type: "TEXT",
    fieldType: "number",
    col: 3,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Thickness",
    answer: "",
    type: "DROPDOWN",
    option: ['5/16"', '3/8"', '1/2"', '5/8"', '9/16"', '3/4"', '1"', "Other"],
    col: 4,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Installation",
    answer: "",
    type: "DROPDOWN",
    option: ["Nailed", "Glued", "Floated", "Unknown"],
    col: 4,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Sawn Type",
    answer: "",
    type: "DROPDOWN",
    option: [
      "Plain Sawn",
      "Rift and Quartered",
      "Rift",
      "Quartered",
      "Live Sawn",
      "Rotary Peeled",
    ],
    col: 4,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Notes",
    answer: "",
    type: "TEXT",
    col: 6,
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Photos",
    answer: [],
    type: "IMAGE",
    hasHalfWidth: true,
    col: 6,
    mandatory: true,
  },
];

let subQustionsArr3 = [
  {
    id: uuidv4(),
    level: 1,
    question: "Photo of floor",
    answer: [],
    type: "IMAGE",
    col: 12,
    mandatory: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Notes",
    answer: "",
    type: "TEXT",
    col: 12,
  },
];

const MatchingCheckListForm = () => {
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const existingScope = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );
  const addedFloors = useSelector(
    (state) => state.customerReducer.singleCustomer.scope.floors
  );
  const matchingActiveBtn = useSelector(
    (state) => state.customerReducer.matchingActiveBtn
  );
  const activeMatchingRefinishingChecklistId = useSelector(
    (state) => state.customerReducer.activeMatchingRefinishingChecklistId
  );
  const activeMatchingInstallationChecklistId = useSelector(
    (state) => state.customerReducer.activeMatchingInstallationChecklistId
  );
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );
  const activeRefinihsingChecklistId = useSelector(
    (state) => state.customerReducer.activeRefinihsingChecklistId
  );
  const store = useSelector((state) => state.customerReducer);
  const [roomMatching, setRoomMatching] = useState({
    roomId: "",
    matching: {},
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDragEnabled, setIsDragEnabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState("");
  const [subQuesionsShow, setSubQuesionsShow] = React.useState(false);
  const [subofSubQuestions, setSubofSubQuestions] = React.useState([]);
  const [index, setIndex] = useState(0);
  const [showKey, setShowKey] = useState("");
  const [showQue, setShowQue] = useState("");
  const [summeryFloor, setSummeryFloor] = useState([]);
  const [installationQues, setInstallationQues] = useState([]);
  const [dropDownChanged, setDropDownChanged] = useState(false);
  const [activeRoomobj, setActiveRoomobj] = React.useState({});

  const handleRemoveClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setTimeout(() => {
      setDialogOpen(true);
    }, 20);
  };

  const handleConfirmRemove = () => {
    setDialogOpen(false);

    removeCheckList(selectedItem);
    setSelectedItem(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    // setDebouncedDialogOpen(false);
  };

  useEffect(() => {
    setRoomMatching({ roomId: "", matching: [] });

    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (activeBtnKey === "matching" && matchingActiveBtn === "refinishing") {
      if (singleCustomerData?.matching_refinishing_checklists?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: matchingRefinishingChecklist,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms?.map((room) => ({
            ...room,
            matching_refinishing_checklists_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.matching_refinishing_checklists = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveMatchingRefinishingChecklistId(newCheckList.id));

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    } else if (
      activeBtnKey === "matching" &&
      matchingActiveBtn === "installation"
    ) {
      if (singleCustomerData?.matching_installation_checklists?.length === 0) {
        let newCheckList = {
          id: uuidv4(),
          color: "#1E2E5A",
          all_questions: matchingInstallationChecklist,
        };
        let floors = [...updatedSingleCustomer.scope.floors];
        const updatedData = floors.map((item) => ({
          ...item,
          rooms: item.rooms?.map((room) => ({
            ...room,
            matching_installation_checklists_id: newCheckList.id,
          })),
        }));
        updatedSingleCustomer.matching_installation_checklists = [newCheckList];
        updatedSingleCustomer.scope.floors = updatedData;
        dispatch(setActiveMatchingInstallationChecklistId(newCheckList.id));

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  }, [activeBtnKey, matchingActiveBtn]);

  useEffect(() => {
    if (
      activeBtnKey === "matching" &&
      matchingActiveBtn === "refinishing" &&
      singleCustomerData?.matching_refinishing_checklists?.length > 0
    ) {
      dispatch(
        setActiveMatchingRefinishingChecklistId(
          singleCustomerData?.matching_refinishing_checklists?.[0]?.id
        )
      );
    } else if (
      activeBtnKey === "matching" &&
      matchingActiveBtn === "installation" &&
      singleCustomerData?.matching_installation_checklists?.length > 0
    ) {
      dispatch(
        setActiveMatchingInstallationChecklistId(
          singleCustomerData?.matching_installation_checklists?.[0]?.id
        )
      );
    }
  }, [matchingActiveBtn]);

  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    touchMove: isDragEnabled,
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (matchingActiveBtn === "refinishing") {
      if (singleCustomerData?.matching_refinishing_checklists?.length > 0) {
        setIndex(
          singleCustomerData?.matching_refinishing_checklists?.findIndex(
            (item) => item?.id === activeMatchingRefinishingChecklistId
          )
        );
      }
    } else if (matchingActiveBtn === "installation") {
      if (singleCustomerData?.matching_installation_checklists?.length > 0) {
        setIndex(
          singleCustomerData?.matching_installation_checklists?.findIndex(
            (item) => item?.id === activeMatchingInstallationChecklistId
          )
        );
      }
    }
  }, [
    matchingActiveBtn,
    activeMatchingRefinishingChecklistId,
    activeMatchingInstallationChecklistId,
  ]);

  useEffect(() => {
    if (matchingActiveBtn === "installation") {
      if (
        singleCustomerData?.matching_installation_checklists?.length > 0 &&
        activeMatchingInstallationChecklistId
      ) {
        let currentInstallationChecklist =
          singleCustomerData?.matching_installation_checklists?.find(
            (item) => item?.id === activeMatchingInstallationChecklistId
          );

        let currentInstallationChecklistIndex =
          singleCustomerData?.matching_installation_checklists?.findIndex(
            (item) => item?.id === activeMatchingInstallationChecklistId
          );
        let allInstallationChecklists = [
          ...singleCustomerData?.matching_installation_checklists,
        ];

        updateAllQuestions(
          currentInstallationChecklist,
          allInstallationChecklists,
          currentInstallationChecklistIndex
        );
      }
    }
  }, [
    matchingActiveBtn,
    activeMatchingInstallationChecklistId,
    singleCustomerData,
  ]);

  useEffect(() => {
    if (
      singleCustomerData?.matching_installation_checklists?.length > 0 &&
      dropDownChanged
    ) {
      setDropDownChanged(false);

      let currentInstallationChecklistIndex =
        singleCustomerData?.matching_installation_checklists?.findIndex(
          (item) => item?.id === activeMatchingInstallationChecklistId
        );

      let allInstallationChecklists = [
        ...singleCustomerData?.matching_installation_checklists,
      ];

      allInstallationChecklists[currentInstallationChecklistIndex] = {
        ...allInstallationChecklists[currentInstallationChecklistIndex],
        all_questions: installationQues,
      };

      dispatch(
        updateSingleCustomerApi({
          ...singleCustomerData,
          matching_installation_checklists: allInstallationChecklists,
        })
      );
    }
  }, [dropDownChanged]);

  useEffect(() => {
    setSummeryFloor(addedFloors);
    setShowKey("");
    setRoomMatching({ roomId: "", matching: [] });

    setShowQue("");
  }, [singleCustomerData]);

  const filterQuestions = useCallback((queArr, updateChecklistQuestions) => {
    queArr?.map((subQue) => {
      let questionExist = updateChecklistQuestions?.some(
        (mainQue) => mainQue?.question === subQue?.question
      );
      let foundQue = updateChecklistQuestions?.some(
        (mainQue) => mainQue?.question === "Notes"
      );
      if (questionExist && !foundQue) {
        updateChecklistQuestions = updateChecklistQuestions?.filter(
          (que) => que?.question !== subQue?.question
        );
      }
    });
    return updateChecklistQuestions;
  }, []);

  let updateAllQuestions = useCallback(
    (
      currentInstallationChecklist,
      allInstallationChecklists,
      currentInstallationChecklistIndex
    ) => {
      let findQue1 = currentInstallationChecklist?.all_questions?.find(
        (que) => que?.question === "Type of Floor"
      );
      let findQue2 = currentInstallationChecklist?.all_questions?.find(
        (que) => que?.question === "Type of Matching"
      );
      let findQue3 = currentInstallationChecklist?.all_questions?.find(
        (que) => que?.question === "Are we Refinishing?"
      );

      if (findQue1?.answer && findQue2?.answer && findQue3?.answer) {
        if (
          (findQue1?.answer === "Prefinished Solid" ||
            findQue1?.answer === "Prefinished Engineered" ||
            findQue1?.answer === "Laminate" ||
            findQue1?.answer === "Vinyl") &&
          findQue2?.answer === "Product" &&
          findQue3?.answer === "No"
        ) {
          let updateChecklistQuestions = [
            ...currentInstallationChecklist.all_questions,
          ];

          updateChecklistQuestions = filterQuestions(
            subQustionsArr2,
            updateChecklistQuestions
          );

          updateChecklistQuestions = filterQuestions(
            subQustionsArr3,
            updateChecklistQuestions
          );

          subQustionsArr1?.map((subQue) => {
            let questionExist = updateChecklistQuestions?.some(
              (mainQue) => mainQue?.question === subQue?.question
            );
            if (!questionExist) {
              updateChecklistQuestions?.push(subQue);
            }
          });

          allInstallationChecklists[currentInstallationChecklistIndex] = {
            ...allInstallationChecklists[currentInstallationChecklistIndex],
            all_questions: updateChecklistQuestions,
          };

          setInstallationQues(updateChecklistQuestions);

          setDropDownChanged(true);
        } else if (
          (findQue1?.answer === "Prefinished Solid" ||
            findQue1?.answer === "Prefinished Engineered" ||
            findQue1?.answer === "Unfinished Solid" ||
            findQue1?.answer === "Unfinished Engineered") &&
          findQue2?.answer === "Specifications" &&
          (findQue3?.answer === "No" || findQue3?.answer === "Yes")
        ) {
          let updateChecklistQuestions = [
            ...currentInstallationChecklist?.all_questions,
          ];

          updateChecklistQuestions = filterQuestions(
            subQustionsArr1,
            updateChecklistQuestions
          );

          updateChecklistQuestions = filterQuestions(
            subQustionsArr3,
            updateChecklistQuestions
          );

          subQustionsArr2?.map((subQue) => {
            let questionExist = updateChecklistQuestions?.some(
              (mainQue) => mainQue?.question === subQue?.question
            );
            if (!questionExist) {
              if (subQue?.question === "Notes") {
                let updatedSUbQue = { ...subQue, fullHeight: true };
                updateChecklistQuestions?.push(updatedSUbQue);
              } else {
                updateChecklistQuestions?.push(subQue);
              }
            }
          });

          allInstallationChecklists[currentInstallationChecklistIndex] = {
            ...allInstallationChecklists[currentInstallationChecklistIndex],
            all_questions: updateChecklistQuestions,
          };

          setInstallationQues(updateChecklistQuestions);

          setDropDownChanged(true);
        } else if (
          findQue2?.answer === "Look" &&
          (findQue3?.answer === "No" || findQue3?.answer === "Yes")
        ) {
          let updateChecklistQuestions = [
            ...currentInstallationChecklist.all_questions,
          ];

          updateChecklistQuestions = filterQuestions(
            subQustionsArr1,
            updateChecklistQuestions
          );

          updateChecklistQuestions = filterQuestions(
            subQustionsArr2,
            updateChecklistQuestions
          );

          subQustionsArr3?.map((subQue) => {
            let questionExist = updateChecklistQuestions?.some(
              (mainQue) => mainQue?.question === subQue?.question
            );
            if (!questionExist) {
              updateChecklistQuestions?.push(subQue);
            }
          });

          allInstallationChecklists[currentInstallationChecklistIndex] = {
            ...allInstallationChecklists[currentInstallationChecklistIndex],
            all_questions: updateChecklistQuestions,
          };

          setInstallationQues(updateChecklistQuestions);

          setDropDownChanged(true);
        } else {
          let updateChecklistQuestions = [
            ...currentInstallationChecklist.all_questions,
          ];

          updateChecklistQuestions = filterQuestions(
            subQustionsArr1,
            updateChecklistQuestions
          );

          updateChecklistQuestions = filterQuestions(
            subQustionsArr2,
            updateChecklistQuestions
          );

          updateChecklistQuestions = filterQuestions(
            subQustionsArr3,
            updateChecklistQuestions
          );

          setInstallationQues(updateChecklistQuestions);
          setDropDownChanged(true);
        }
      } else {
        let updateChecklistQuestions = [
          ...currentInstallationChecklist?.all_questions,
        ];

        const allSubQuestions = [
          ...subQustionsArr1,
          ...subQustionsArr2,
          ...subQustionsArr3,
        ];

        allSubQuestions.forEach((subQue) => {
          let questionExist = updateChecklistQuestions?.some(
            (mainQue) => mainQue?.question === subQue?.question
          );

          if (questionExist) {
            updateChecklistQuestions = updateChecklistQuestions?.filter(
              (que) => que?.question !== subQue?.question
            );
          }
        });

        // subQustionsArr1?.map((subQue) => {
        //   let questionExist = updateChecklistQuestions?.some(
        //     (mainQue) => mainQue?.question === subQue?.question
        //   );
        //   if (questionExist) {
        //     updateChecklistQuestions = updateChecklistQuestions?.filter(
        //       (que) => que?.question !== subQue?.question
        //     );
        //   }
        // });
        // subQustionsArr2?.map((subQue) => {
        //   let questionExist = updateChecklistQuestions?.some(
        //     (mainQue) => mainQue?.question === subQue?.question
        //   );
        //   if (questionExist) {
        //     updateChecklistQuestions = updateChecklistQuestions?.filter(
        //       (que) => que?.question !== subQue?.question
        //     );
        //   }
        // });
        // subQustionsArr3?.map((subQue) => {
        //   let questionExist = updateChecklistQuestions?.some(
        //     (mainQue) => mainQue?.question === subQue?.question
        //   );
        //   if (questionExist) {
        //     updateChecklistQuestions = updateChecklistQuestions?.filter(
        //       (que) => que?.question !== subQue?.question
        //     );
        //   }
        // });

        setInstallationQues(updateChecklistQuestions);
        setDropDownChanged(true);
      }
    },
    [activeMatchingInstallationChecklistId]
  );

  const handleProjectLevel = () => {
    if (matchingActiveBtn === "refinishing") {
      let checkListIdArray = [];
      singleCustomerData.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          checkListIdArray.push(room?.matching_refinishing_checklists_id);
        });
      });
      const isAllRoomSameId = checkListIdArray?.every(
        (item) => item === activeMatchingRefinishingChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
        let refinishingIds = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry?.rooms?.map((room) =>
            refinishingIds.push(room?.matching_refinishing_checklists_id)
          )
        );

        const isChecklistUsed =
          updatedSingleCustomer?.matching_refinishing_checklists?.every(
            (checklist) => refinishingIds?.includes(checklist.id)
          );

        let newColor;
        if (singleCustomerData?.matching_refinishing_checklists?.length >= 1) {
          if (singleCustomerData?.matching_refinishing_checklists?.length < 5) {
            let existingColors =
              singleCustomerData?.matching_refinishing_checklists?.map(
                (e) => e.color
              );
            const filteredColors = store.checkListDefaultColor.filter(
              (color) => !existingColors.includes(color)
            );

            newColor = filteredColors[0];
          } else {
            // Generate random color
            function generateRandomColor(existingColors) {
              const characters = "0123456789ABCDEF";
              let color;
              let isUnique = false;

              // Function to generate a random color
              const getRandomColor = () => {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                  color += characters[Math.floor(Math.random() * 16)];
                }
                return color;
              };

              // Keep generating random colors until a unique color is found
              while (!isUnique) {
                color = getRandomColor();
                isUnique = !existingColors.includes(color);
              }

              return color;
            }

            let usedColor = [];
            updatedSingleCustomer?.matching_refinishing_checklists?.map(
              (CheckList) => usedColor?.push(CheckList.color)
            );
            newColor = generateRandomColor(usedColor);
          }

          let refinishingImport = JSON.parse(
            JSON.stringify(matchingRefinishingChecklist)
          );

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj?.subQuestion && obj?.subQuestion?.length > 0) {
              for (const subQ of obj?.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of refinishingImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: refinishingImport,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.matching_refinishing_checklists = [
              ...updatedSingleCustomer.matching_refinishing_checklists,
              newCheckList,
            ];
          }
          // updatedSingleCustomer.scope.floors = updatedData;

          // dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.matching_refinishing_checklists_id = "";
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.matching_refinishing_checklists_id =
              activeMatchingRefinishingChecklistId;
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    } else if (matchingActiveBtn === "installation") {
      let checkListIdArray = [];
      singleCustomerData.scope.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          checkListIdArray.push(room?.matching_installation_checklists_id);
        });
      });
      const isAllRoomSameId = checkListIdArray?.every(
        (item) => item === activeMatchingInstallationChecklistId
      );
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      if (isAllRoomSameId) {
        let installationIds = [];
        updatedSingleCustomer?.scope?.floors.map((entry) =>
          entry?.rooms?.map((room) =>
            installationIds.push(room?.matching_installation_checklists_id)
          )
        );

        const isChecklistUsed =
          updatedSingleCustomer?.matching_installation_checklists?.every(
            (checklist) => installationIds?.includes(checklist.id)
          );

        let newColor;
        if (singleCustomerData?.matching_installation_checklists?.length >= 1) {
          if (
            singleCustomerData?.matching_installation_checklists?.length < 5
          ) {
            let existingColors =
              singleCustomerData?.matching_installation_checklists?.map(
                (e) => e.color
              );
            const filteredColors = store?.checkListDefaultColor?.filter(
              (color) => !existingColors?.includes(color)
            );

            newColor = filteredColors[0];
          } else {
            // Generate random color
            function generateRandomColor(existingColors) {
              const characters = "0123456789ABCDEF";
              let color;
              let isUnique = false;

              // Function to generate a random color
              const getRandomColor = () => {
                let color = "#";
                for (let i = 0; i < 6; i++) {
                  color += characters[Math.floor(Math.random() * 16)];
                }
                return color;
              };

              // Keep generating random colors until a unique color is found
              while (!isUnique) {
                color = getRandomColor();
                isUnique = !existingColors.includes(color);
              }

              return color;
            }

            let usedColor = [];
            updatedSingleCustomer?.matching_installation_checklists?.map(
              (CheckList) => usedColor?.push(CheckList.color)
            );
            newColor = generateRandomColor(usedColor);
          }

          let installationImport = JSON.parse(
            JSON.stringify(matchingInstallationChecklist)
          );

          function updateIds(obj) {
            obj.id = uuidv4();

            if (obj?.subQuestion && obj?.subQuestion?.length > 0) {
              for (const subQ of obj?.subQuestion) {
                updateIds(subQ);
              }
            }
          }

          for (const item of installationImport) {
            updateIds(item);
          }

          let newCheckList = {
            id: uuidv4(),
            color: newColor,
            all_questions: installationImport,
          };

          if (isChecklistUsed) {
            updatedSingleCustomer.matching_installation_checklists = [
              ...updatedSingleCustomer?.matching_installation_checklists,
              newCheckList,
            ];
          }
        }

        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.matching_installation_checklists_id = "";
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else {
        updatedSingleCustomer.scope.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.matching_installation_checklists_id =
              activeMatchingInstallationChecklistId;
          });
        });

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    }
  };

  const removeCheckList = (checkList) => {
    // e.stopPropagation();
    if (matchingActiveBtn === "refinishing") {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );

      const updatedCheckListArray =
        updatedSingleCustomer?.matching_refinishing_checklists?.filter(
          (singleRefinishingCL) => singleRefinishingCL.id !== checkList.id
        );
      updatedSingleCustomer.matching_refinishing_checklists =
        updatedCheckListArray;

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      if (updatedSingleCustomer?.matching_refinishing_checklists?.length > 0) {
        if (
          matchingActiveBtn === "refinishing" &&
          activeMatchingRefinishingChecklistId === checkList.id
        ) {
          dispatch(
            setActiveMatchingRefinishingChecklistId(
              updatedSingleCustomer?.matching_refinishing_checklists?.[
                updatedSingleCustomer?.matching_refinishing_checklists?.length -
                  1
              ].id
            )
          );
        }
      }
    } else if (matchingActiveBtn === "installation") {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );

      const updatedCheckListArray =
        updatedSingleCustomer?.matching_installation_checklists?.filter(
          (singleRefinishingCL) => singleRefinishingCL.id !== checkList.id
        );
      updatedSingleCustomer.matching_installation_checklists =
        updatedCheckListArray;

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      if (updatedSingleCustomer?.matching_installation_checklists?.length > 0) {
        if (
          matchingActiveBtn === "installation" &&
          activeMatchingInstallationChecklistId === checkList.id
        ) {
          dispatch(
            setActiveMatchingInstallationChecklistId(
              updatedSingleCustomer?.matching_installation_checklists?.[
                updatedSingleCustomer?.matching_installation_checklists
                  ?.length - 1
              ]?.id
            )
          );
        }
      }
    }
  };

  const handleClickRoomArea = (e, roomObj) => {
    e.stopPropagation();
    setActiveRoomobj(roomObj);
  };

  const MyPreview = () => {
    const preview = usePreview();
    if (!preview.display) {
      return null;
    }
    const { itemType, item, style } = preview;
    return (
      <div style={style} className="z-[9999]">
        <motion.button
          className={`round-small-btn 
          !text-black !text-[9px]   !w-[78px] !h-[78px] !bg-[#D8D8D8] mb-[15px] z-[5000]`}
          animate={{
            opacity: 0.7,
          }}
        >
          Out of Scope <br />
          For
          <br />
          {matchingActiveBtn === "refinishing" && " Refinishing"}
          {matchingActiveBtn === "installation" && " Installation"}
        </motion.button>
      </div>
    );
  };

  return (
    <>
      <style>{customDotStyles}</style>
      <MyPreview />
      <CarouselContainer>
        <MuiSnackbar
          open={open}
          message={message || ""}
          type={type || ""}
          onClose={handleClose}
        />
        <Slider {...carouselSettings} className="h-[510px]">
          {/* {Fist Slide} */}
          <StyledGrid
            container
            key="slide1"
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <FirstGrid item xs={12} md={6} sx={{ width: "597px" }}>
              <div className="flex items-center justify-between gap-[134px] pt-[20px] pb-[16px] px-[20px]">
                <div className="space-x-2 flex">
                  {existingScope?.refinishing?.are_we_matching && (
                    <Button
                      className={`round-small-btn ${
                        matchingActiveBtn === "refinishing" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setMatchingActiveBtn("refinishing"))
                      }
                    >
                      R
                    </Button>
                  )}
                  {existingScope?.installation?.are_we_matching && (
                    <Button
                      className={`round-small-btn ${
                        matchingActiveBtn === "installation" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setMatchingActiveBtn("installation"))
                      }
                    >
                      I
                    </Button>
                  )}
                </div>
                <div
                  className="flex overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div
                    className="space-x-2.5 flex h-[66px] mt-[5px] mr-[5px]"
                    onMouseEnter={() => setIsDragEnabled(false)}
                    onMouseLeave={() => setIsDragEnabled(true)}
                    onTouchStart={() => setIsDragEnabled(false)}
                    onTouchEnd={() => setIsDragEnabled(true)}
                  >
                    {matchingActiveBtn === "refinishing" &&
                      singleCustomerData?.matching_refinishing_checklists
                        ?.length > 1 &&
                      singleCustomerData?.matching_refinishing_checklists?.map(
                        (item, index) => {
                          let color = item.color;

                          function isRefinishingIdPresent() {
                            return singleCustomerData.scope.floors.some(
                              (floor) =>
                                floor.rooms.some(
                                  (room) =>
                                    room?.matching_refinishing_checklists_id ===
                                    item?.id
                                )
                            );
                          }

                          // Check if the valid refinishing ID is present in any room
                          const isPresent = isRefinishingIdPresent();
                          return (
                            <div className="relative">
                              <Button
                                key={item?.id}
                                className={`checklist`}
                                onClick={() => {
                                  dispatch(
                                    setActiveMatchingRefinishingChecklistId(
                                      item.id
                                    )
                                  );
                                }}
                                style={
                                  activeMatchingRefinishingChecklistId !==
                                  item.id
                                    ? { border: `5px solid ${color}` }
                                    : { backgroundColor: `${color}` }
                                }
                              >
                                {" "}
                              </Button>
                              {!isPresent && (
                                <button
                                  className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                  onClick={(e) => handleRemoveClick(e, item)}
                                >
                                  <GetIconFile
                                    data={{ width: "20px", height: "20px" }}
                                    iconName="remove-icon"
                                  />
                                </button>
                              )}
                            </div>
                          );
                        }
                      )}
                    {matchingActiveBtn === "installation" &&
                      singleCustomerData?.matching_installation_checklists
                        ?.length > 1 &&
                      singleCustomerData?.matching_installation_checklists?.map(
                        (item, index) => {
                          let color = item.color;

                          function isRefinishingIdPresent() {
                            return singleCustomerData.scope.floors.some(
                              (floor) =>
                                floor.rooms.some(
                                  (room) =>
                                    room?.matching_installation_checklists_id ===
                                    item?.id
                                )
                            );
                          }

                          // Check if the valid refinishing ID is present in any room
                          const isPresent = isRefinishingIdPresent();
                          return (
                            <div className="relative">
                              <Button
                                key={item?.id}
                                className={`checklist`}
                                onClick={() => {
                                  if (
                                    item.id !==
                                    activeMatchingInstallationChecklistId
                                  ) {
                                    setInstallationQues([]);
                                  }
                                  dispatch(
                                    setActiveMatchingInstallationChecklistId(
                                      item.id
                                    )
                                  );
                                }}
                                style={
                                  activeMatchingInstallationChecklistId !==
                                  item.id
                                    ? { border: `5px solid ${color}` }
                                    : { backgroundColor: `${color}` }
                                }
                              >
                                {" "}
                              </Button>
                              {!isPresent && (
                                <button
                                  className={`absolute -top-1 -right-1  rounded-full bg-white padding-1.5`}
                                  onClick={(e) => handleRemoveClick(e, item)}
                                >
                                  <GetIconFile
                                    data={{ width: "20px", height: "20px" }}
                                    iconName="remove-icon"
                                  />
                                </button>
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>

              <QueGrid container spacing={subQuesionsShow ? 1 : 2}>
                {matchingActiveBtn == "refinishing" &&
                  singleCustomerData?.matching_refinishing_checklists?.[
                    index
                  ]?.all_questions?.map((queObj) => {
                    return (
                      <MainQueGrid
                        queObj={queObj}
                        checkListIndex={index}
                        setSubofSubQuestions={setSubofSubQuestions}
                        storeKeyToUpdate="matching_refinishing_checklists"
                        setIsDragEnabled={setIsDragEnabled}
                        setSubQuesionsShow={() => {}}
                      />
                    );
                  })}
                {matchingActiveBtn == "installation" &&
                  installationQues?.map((queObj, i) => {
                    return (
                      <InstallaltionMainQueGrid
                        queObj={queObj}
                        checkListIndex={index}
                        setSubofSubQuestions={setSubofSubQuestions}
                        storeKeyToUpdate="matching_installation_checklists"
                        setIsDragEnabled={setIsDragEnabled}
                        setSubQuesionsShow={() => {}}
                        setDropDownChanged={setDropDownChanged}
                        setInstallationQues={setInstallationQues}
                        questionIndex={i}
                      />
                    );
                  })}
              </QueGrid>
            </FirstGrid>
            <VerticalDivider />
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{
                width: "597px",
                pt: `${
                  Object.keys(activeRoomobj).length > 0 &&
                  `${Constants.PADDING_TOP_OF_ROOM_AREA} !important`
                } `,
              }}
            >
              {Object.keys(activeRoomobj).length > 0 ? (
                <div className="pr-[20px] pl-[20px] pb-[20px] ">
                  <RoomArea
                    setActiveRoomobj={setActiveRoomobj}
                    activeRoomobj={activeRoomobj}
                    setOpen={setOpen}
                    setMessage={setMessage}
                    setType={setType}
                    setIsDragEnabled={setIsDragEnabled}
                    hasHeader={true}
                  />
                </div>
              ) : (
                <>
                  <div className="flex gap-2 justify-center items-center w-full p-[20px]">
                    <OutOfScopeBtn
                      setIsDragEnabled={(value) => setIsDragEnabled(value)}
                      // itemKeyValue={name: "Out"}
                      type={"OutofScope"}
                      storeKey="levellings"
                      itemKey="OutOfScope"
                    />
                  </div>
                  <div className="pr-[20px] pl-[20px] pb-[20px] ">
                    <Button
                      className="text-[21px] m-auto !w-[540px] h-[40px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                      style={{ fontWeight: 500 }}
                      onClick={() => handleProjectLevel()}
                    >
                      Project
                    </Button>
                    <ProjectGrid container spacing={1}>
                      {addedFloors?.length > 0 &&
                        addedFloors.map((floor, index) => {
                          return (
                            <MatchingProjectFloors
                              key={floor?.id}
                              addedFloors={addedFloors}
                              floor={floor}
                              index={index}
                              handleClickRoomArea={handleClickRoomArea}
                            />
                          );
                        })}
                    </ProjectGrid>
                  </div>
                </>
              )}
            </SecondGrid>
          </StyledGrid>

          {/* {Second Slide} */}
          <StyledGrid
            container
            key="slide2"
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <SecondGrid
              item
              xs={12}
              md={6}
              sx={{ width: "597px", padding: "20px 24px 30px 24px !important" }}
            >
              <div className="flex items-center justify-between gap-[8px] pl-0">
                <div className="space-x-2">
                  {existingScope?.refinishing?.are_we_matching && (
                    <Button
                      className={`round-small-btn ${
                        matchingActiveBtn === "refinishing" &&
                        "!bg-[#009DC2] !text-white"
                      } !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setMatchingActiveBtn("refinishing"))
                      }
                    >
                      R
                    </Button>
                  )}
                  {existingScope?.installation?.are_we_matching && (
                    <Button
                      className={`round-small-btn ${
                        matchingActiveBtn === "installation" &&
                        "!bg-[#009DC2] !text-white"
                      }  !text-[28px] !font-medium`}
                      onClick={() =>
                        dispatch(setMatchingActiveBtn("installation"))
                      }
                    >
                      I
                    </Button>
                  )}
                </div>
              </div>
              <Text
                className="text-[21px] h-[40px] mt-[33px] border-2 rounded-[4px] flex justify-center items-center bg-bgprimary text-white"
                style={{ fontWeight: 500 }}
              >
                Project
              </Text>

              <ProjectGrid container spacing={1}>
                {summeryFloor.length > 0 &&
                  summeryFloor.map((floor, index) => {
                    return (
                      <MatchingProjectFloorSummary
                        addedFloors={summeryFloor}
                        floor={floor}
                        index={index}
                        setRoomMatching={setRoomMatching}
                        roomMatching={roomMatching}
                      />
                    );
                  })}
              </ProjectGrid>
            </SecondGrid>
            <VerticalDivider />
            {matchingActiveBtn === "refinishing" && (
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "80px",
                  alignItems: "top",
                  padding: "10px",
                  gap: "14px",
                  height: "400px",
                  flexDirection: "column",
                }}
              >
                <>
                  <Text className="mt-[10px] text-[20px] font-semibold">
                    Summary
                  </Text>
                  {roomMatching?.roomId ? (
                    <MatchingRefinishingSummary
                      activeSummary={roomMatching}
                      setIsDragEnabled={setIsDragEnabled}
                      objectKey="matching"
                    />
                  ) : (
                    <div className="h-[300px] flex justify-center items-center">
                      <h3>Please select room</h3>
                    </div>
                  )}
                </>
              </Grid>
            )}
            {matchingActiveBtn === "installation" && (
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "start",
                  marginTop: "80px",
                  alignItems: "top",
                  padding: "10px",
                  gap: "14px",
                  height: "450px",
                  flexDirection: "column",
                }}
              >
                <>
                  <Text className="mt-[10px] text-[20px] font-semibold">
                    Summary
                  </Text>
                  {roomMatching?.roomId ? (
                    <MatchingInstallationSummary
                      activeSummary={roomMatching}
                      setIsDragEnabled={setIsDragEnabled}
                      objectKey="matching"
                    />
                  ) : (
                    <div className="h-[300px] flex justify-center items-center">
                      <h3>Please select room</h3>
                    </div>
                  )}
                </>
              </Grid>
            )}
          </StyledGrid>
        </Slider>
      </CarouselContainer>
      {dialogOpen && (
        <RemoveDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRemove}
          text="Are you sure you want to remove this checklist ?"
          title="Remove Confirmation"
        />
      )}
    </>
  );
};

export default MatchingCheckListForm;
