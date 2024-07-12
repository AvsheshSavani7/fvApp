import { v4 as uuidv4 } from "uuid";

export const smallFurniture = [
  {
    id: uuidv4(),
    name: "Side Table",
    size: "S",
    isAD: false,
    otherSize: ["M"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Ottoman",
    size: "S",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Dining Chairs",
    size: "S",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Buffer Table",
    size: "S",
    isAD: false,
    otherSize: ["M"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Chairs/Stools",
    size: "S",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Nightstands",
    size: "S",
    isAD: false,
    otherSize: ["M"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Desk Chair",
    size: "S",
    isAD: false,
    otherSize: [],
    images: [],
  },
];

export const mediumFurniture = [
  {
    id: uuidv4(),
    name: "Coffee Table",
    size: "M",
    isAD: false,
    otherSize: ["S", "L"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Bookshelf",
    size: "M",
    isAD: false,
    otherSize: ["S", "L"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Ent. Center(A/D)",
    size: "M",
    isAD: true,
    otherSize: ["L"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "TV Stand",
    size: "M",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Dining Table",
    size: "M",
    isAD: false,
    otherSize: ["L"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Kitchen Table",
    size: "M",
    isAD: false,
    otherSize: ["L"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Desk",
    size: "M",
    isAD: false,
    otherSize: ["L"],
    images: [],
  },
];

export const largeFurniture = [
  {
    id: uuidv4(),
    name: "Sofa",
    size: "L",
    isAD: false,
    otherSize: ["M"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Sofa W/Pullout",
    size: "L",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "China Cabinet",
    size: "L",
    isAD: false,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Bed(A/D)",
    size: "L",
    isAD: true,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Bunk Bed(A/D)",
    size: "L",
    isAD: true,
    otherSize: [],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Dresser",
    size: "L",
    isAD: false,
    otherSize: ["M"],
    images: [],
  },
  {
    id: uuidv4(),
    name: "Other",
    size: "L",
    isAD: false,
    otherSize: ["S", "M"],
    images: [],
  },
];

export const specialItem = [
  {
    id: uuidv4(),
    level: 1,
    question: "Standard Pool Table",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
        mandatory: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Full Size Pool Table",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Grand Piano",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Baby Grand Piano",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Upright Piano",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Radiators Other",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Quantity",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: true,
        fieldType: "number",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: true,
      },
    ],
  },
];

export const kitchenItem = [
  {
    id: uuidv4(),
    level: 1,
    question: "Refrigerator",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Any water hookups",
        answer: "none",
        type: "BOOLEAN",
        col: 6,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Any potential clearance issues",
        answer: "none",
        type: "BOOLEAN",
        col: 6,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Dishwasher",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Any potential clearance issues",
        answer: "none",
        type: "BOOLEAN",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Stove",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Any Gas or Water hookups",
        answer: "none",
        type: "BOOLEAN",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Washer",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Any Gas or Water hookups",
        answer: "none",
        type: "BOOLEAN",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Dryer",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Any Gas or Water hookups",
        answer: "none",
        type: "BOOLEAN",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Toilet",
    answer: false,
    type: "BOOLEAN",
    col: 6,
    mandatory: false,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Add Images",
        answer: [],
        type: "IMAGE",
        col: 12,
        mandatory: true,
        whenToShow: true,
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: false,
        whenToShow: true,
      },
    ],
  },
];
