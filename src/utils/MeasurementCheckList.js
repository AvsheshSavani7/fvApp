import { v4 as uuidv4 } from "uuid";

export const measurementCheckList = [
  {
    id: uuidv4(),
    level: 1,
    question: "Length",
    answer: "",
    type: "TEXT",
    fieldType: "number",
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
    mandatory: false,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Add Images",
    answer: [],
    type: "IMAGE",
    col: 12,
    mandatory: false,
  },
];
