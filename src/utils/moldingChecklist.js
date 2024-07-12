import { v4 as uuidv4 } from "uuid";

export const moldingChecklist = [
  {
    id: uuidv4(),
    level: 1,
    question: "Molding Images",
    answer: [],
    type: "IMAGE",
    col: 12,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Height",
    answer: "",
    type: "TEXT",
    fieldType: "number",
    col: 12,
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
