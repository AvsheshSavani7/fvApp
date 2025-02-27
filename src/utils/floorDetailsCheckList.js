import { v4 as uuidv4 } from "uuid";

export const floorDetailsCheckList = [
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
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Wear Layer of Existing Site Finished Eng. Flooring",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: "Site Finished Engineered",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Wear Layer of Existing Site Finished Eng. Flooring",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: "Prefinished Engineered",
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Unknown Wood Type Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        mandatory: true,
        whenToShow: "Unknown",
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Are there any bevels",
    answer: "none",
    type: "BOOLEAN",
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Type of Bevels",
        answer: "",
        type: "DROPDOWN",
        option: ["Standard", "V-Notches", "Other"],
        col: 12,
        whenToShow: true,
        mandatory: true,
        subQuestion: [
          {
            id: uuidv4(),
            level: 3,
            question: "Notes for Standard",
            answer: "",
            type: "TEXT",
            col: 12,
            whenToShow: "Standard",
          },
          {
            id: uuidv4(),
            level: 3,
            question: "Notes for V-Notches",
            answer: "",
            type: "TEXT",
            col: 12,
            whenToShow: "V-Notches",
          },
          {
            id: uuidv4(),
            level: 3,
            question: "Notes for Other",
            answer: "",
            type: "TEXT",
            col: 12,
            whenToShow: "Other",
          },
        ],
      },
    ],
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
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        id: uuidv4(),
        level: 3,
        question: "Unknown Type of Pine Notes",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: "Pine - Unknown",
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Layout",
    answer: "",
    type: "DROPDOWN",
    option: ["Straight", "Diagonal", "Herringbone", "Chevron", "Other"],
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Details of other layout to be refinished",
        answer: "",
        type: "TEXT",
        col: 12,
        whenToShow: "Other",
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Width",
    answer: "",
    type: "TEXT",
    fieldType: "number",
    col: 6,
    mandatory: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Thickness",
    answer: "",
    type: "DROPDOWN",
    option: ['5/16"', '3/8"', '1/2"', '5/8"', '9/16"', '3/4"', '1"', "Other"],
    col: 6,
    mandatory: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Installation",
    answer: "",
    type: "DROPDOWN",
    option: ["Nailed", "Glued", "Floated", "Unknown"],
    col: 6,
    mandatory: true,
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Exposed or Covered",
    answer: "",
    type: "DROPDOWN",
    option: ["Exposed", "Covered"],
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        id: uuidv4(),
        level: 2,
        question: "Type of flooring is covering the hardwood?",
        answer: "",
        type: "DROPDOWN",
        option: [
          "Carpeting",
          "Laminate",
          "LVT",
          "Sheet Vinyl",
          "Tile",
          "Other",
        ],
        col: 6,
        mandatory: true,
        whenToShow: "Covered",
        subQuestion: [
          {
            id: uuidv4(),
            level: 3,
            question: "What other type of wood covering the floor ?",
            answer: "",
            type: "TEXT",
            col: 6,
            whenToShow: "Other",
          },
        ],
      },
      {
        id: uuidv4(),
        level: 2,
        question: "Is KASA removing the existing flooring",
        answer: "none",
        type: "BOOLEAN",
        col: 6,
        mandatory: true,
        whenToShow: "Covered",
        subQuestion: [
          {
            id: uuidv4(),
            level: 3,
            question: "Other required info. about the material",
            answer: "",
            type: "TEXT",
            col: 6,
            whenToShow: true,
          },
        ],
      },
    ],
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
    col: 6,
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

export const subFloorCheckList = [
  {
    id: uuidv4(),
    level: 1,
    question: "Type",
    answer: "",
    type: "DROPDOWN",
    option: ["Wood", "Concrete"],
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        whichGrid: 1,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Type of wood Subfloor",
            answer: "",
            type: "DROPDOWN",
            option: [
              "Plywood (or OSB)",
              "Diagonal Pine",
              "Straight Pine",
              "Particle Board",
              "Other",
            ],
            col: 6,
            mandatory: true,
            whenToShow: "Wood",
            subQuestion: [
              {
                id: uuidv4(),
                level: 3,
                question: "Plywood Type and Thickness",
                answer: "",
                type: "DROPDOWN",
                option: [
                  "3/4 inch CDX Plywood",
                  "5/8 inch CDX Plywood",
                  "3.23/32 inch OSB",
                  "Plywood unknown thickness",
                  "OSB Unknown Thickness",
                  "Other",
                ],
                col: 6,
                whenToShow: "Plywood (or OSB)",
              },
              {
                id: uuidv4(),
                level: 3,
                question: "Description of other plywood type",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Plywood (or OSB)",
              },
              {
                id: uuidv4(),
                level: 3,
                question: "Which direction is the pine running ?",
                answer: "",
                type: "DROPDOWN",
                option: [
                  "Front Door to Back of the Home",
                  "Side to Side of the Home",
                  "Other",
                ],
                col: 6,
                whenToShow: "Straight Pine",
              },
              {
                id: uuidv4(),
                level: 3,
                question: "Describe other direction of straight pine",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Straight Pine",
              },
            ],
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Type of concrete subfloor",
            answer: "",
            type: "DROPDOWN",
            option: ["Building Concrete", "Slab Concrete", "Other"],
            col: 6,
            mandatory: true,
            whenToShow: "Concrete",
            subQuestion: [
              {
                id: uuidv4(),
                level: 3,
                question: "Other type of concrete",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Other",
              },
            ],
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Any moisture identified ?",
            answer: "",
            type: "DROPDOWN",
            option: ["Yes", "No", "Unknown"],
            col: 6,
            mandatory: true,
            whenToShow: "Concrete",
            subQuestion: [
              {
                id: uuidv4(),
                level: 3,
                question: "Notes about moisture found",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Yes",
              },
              {
                id: uuidv4(),
                level: 3,
                question: "Notes about unknown moisture",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Yes",
              },
            ],
          },
        ],
      },
      {
        whichGrid: 2,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Joist Spacing",
            answer: "",
            type: "DROPDOWN",
            option: [
              "16 inch",
              "16-19.2 inches",
              "19.2-24 inches",
              "Unknown",
              "Other",
            ],
            col: 6,
            whenToShow: "Wood",
            mandatory: false,
            subQuestion: [
              {
                id: uuidv4(),
                level: 3,
                question: "Other Joist Spacing Details",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Other",
              },
            ],
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Is this a new slab ?",
            answer: "",
            type: "DROPDOWN",
            option: ["Yes", "No", "Unknown"],
            col: 6,
            mandatory: true,
            whenToShow: "Concrete",
            subQuestion: [
              {
                id: uuidv4(),
                level: 3,
                question: "Notes about slab",
                answer: "",
                type: "TEXT",
                col: 6,
                whenToShow: "Unknown",
              },
            ],
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Any cracks identified ?",
            answer: "",
            type: "DROPDOWN",
            option: ["Yes", "No", "Currently Covered"],
            col: 6,
            mandatory: true,
            whenToShow: "Concrete",
            subQuestion: [],
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Any other non leveling concerns w/ concrete subfloor",
            answer: "",
            type: "TEXT",
            col: 6,
            whenToShow: "Concrete",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Floor Covering",
    answer: "",
    type: "DROPDOWN",
    option: [
      "Wood",
      "Laminate",
      "LVT",
      "Glue Down Vinyl",
      "Sheet Vinyl",
      "Tile",
      "Carpet",
      "Second Plywood Layer",
      "Multiple",
      "Other",
      "None",
    ],
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        whichGrid: 3,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Type of Wood Floor",
            answer: "",
            type: "DROPDOWN",
            option: [
              "Nailed Wood Floor",
              "Glued Hardwood Floor",
              "Glued Parquet Floor",
              "Unknown Installation Type",
            ],
            col: 12,
            mandatory: true,
            whenToShow: "Wood",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Notes",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: false,
            whenToShow: "Wood",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Estimated Thickness of the tile floor",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: true,
            whenToShow: "Tile",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Is the existing tile coming loose in any areas?",
            answer: "none",
            type: "BOOLEAN",
            col: 12,
            mandatory: true,
            whenToShow: "Tile",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Picture of the tile (w/ cross section of available)",
            answer: [],
            type: "IMAGE",
            col: 12,
            whenToShow: "Tile",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Description of multiple floor covering types",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: true,
            whenToShow: "Multiple",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Description of other floor covering types",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: true,
            whenToShow: "Other",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Below Subfloor",
    answer: "",
    type: "DROPDOWN",
    option: [
      "Finished Basement",
      "Unfinished Basement",
      "Crawlspace",
      "Finished Living Space",
      "Nothing (slab)",
      "Apartment Building",
      "Other",
    ],
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        whichGrid: 3,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Are there any humidity concerns?",
            answer: "none",
            type: "BOOLEAN",
            col: 12,
            mandatory: true,
            whenToShow: "Unfinished Basement",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Is the unfinished floor finished?",
            answer: "none",
            type: "BOOLEAN",
            col: 12,
            mandatory: true,
            whenToShow: "Unfinished Basement",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Picture of the unfinished basement",
            answer: [],
            type: "IMAGE",
            col: 12,
            mandatory: false,
            whenToShow: "Unfinished Basement",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Other notes for the unfinished basement",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: false,
            whenToShow: "Unfinished Basement",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Is the crawlspace floor finished",
            answer: "none",
            type: "BOOLEAN",
            col: 12,
            mandatory: true,
            whenToShow: "Crawlspace",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Is there proper insulation",
            answer: "none",
            type: "BOOLEAN",
            col: 12,
            mandatory: true,
            whenToShow: "Crawlspace",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Picture of the crawlspace",
            answer: [],
            type: "IMAGE",
            col: 12,
            mandatory: false,
            whenToShow: "Crawlspace",
          },
          {
            id: uuidv4(),
            level: 2,
            question: "Other notes for the Crawlspace",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: false,
            whenToShow: "Crawlspace",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Radiant Heating",
    answer: "none",
    type: "BOOLEAN",
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        whichGrid: 3,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Is the system Electric or Water?",
            answer: "",
            type: "DROPDOWN",
            option: [
              "Electric Heating System",
              "Water Heating System",
              "Unknown",
            ],
            col: 12,
            mandatory: true,
            whenToShow: true,
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    level: 1,
    question: "Signs of Moisture",
    answer: "none",
    type: "BOOLEAN",
    col: 6,
    mandatory: true,
    subQuestion: [
      {
        whichGrid: 3,
        subQuestion: [
          {
            id: uuidv4(),
            level: 2,
            question: "Description of any water or moisture issues identified",
            answer: "",
            type: "TEXT",
            col: 12,
            mandatory: true,
            whenToShow: true,
          },
        ],
      },
    ],
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
