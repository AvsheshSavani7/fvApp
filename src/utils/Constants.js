export const Constants = {
  PADDING_TOP_OF_ROOM_AREA: "70px",
  MANDATE_BORDER_COLOR: "#ff00005e",
  MANDATE_TEXT_COLOR: "#ff0000bd",
  VERTEX_THRESHOLD_RADIUS: 20,

  ROOT_COLOR: "#131A20", // Darkest
  TOOLBAR_COLOR: "#22262B", // Darker
  NEW_BUTTON_COLOR: "#3B3F43", // Darker
  HEADER_COLOR: "#3D4042", // ligher
  ACTIVE_BUTTON_COLOR: "#525456", // BLUE
  TEXT_COLOR: "#445DCB",
  TEXT_COLOR_LITE: "rgba(255,255,255,.8)",
  SUB_TEXT_COLOR: "rgba(255,255,255,.6)",
  SUB_HEADER_COLOR: "#222427",
  DRAWER_COLOR: "#303337",
  RIGHT_SIDE_PANELS_COLOR: "#272A2E",
  INPUT_FIELDS_COLOR: "#222427",
  VAPT_COLOR: "#222427",
  FV_COLOR: "#303337",
  FORM_BORDER_COLOR: "#35393E",
  EDUCATION_COLOR: "#303337",
  CALENDAR_CARD_COLOR: "#272A2E",
  // PRIMARY_COLOR: '#42535d',
  // PRIMARY_COLOR: 'rgba(34,34,34,0.8)',
  // PRIMARY_COLOR: 'rgba(91,155,213, 0.7)',
  // PRIMARY_COLOR_LITE: 'rgba(34,34,34,0.4)',
  BLUR_COLOR: "rgba(0 0 0 0.31)",
  BUTTON_COLOR: "#525456", // 'rgb(43,134,255)',
  INPUT_FIELDS_WIDTH: 163,
  SWITCH_INPUT_WIDTH: 116,

  PRIMARY_COLOR: "#445DCB",
  PRIMARY_COLOR_FLAT: "rgb(66, 121, 183)",
  PRIMARY_COLOR_LITE: "rgba(66, 121, 183, 0.4)",
  PRIMARY_COLOR_DARK: "rgba(66, 121, 183, 0.9)",
  SECONDARY_COLOR: "#22262B",
  SECONDARY_COLOR_RGBA: { r: 48, g: 94, b: 157, a: 0.8 },
  SECONDARY_COLOR_DARK: "#214683",
  // DARK_COLOR: 'rgba(127,127,127, 1)',
  DARK_COLOR: "#3D4042",
  BACKGROUND_COLOR: "#303337",
  ACTIVE_TRANSITION_BACKGROUND_COLOR: "#3F953F",
  ACTIVE_STAIRCASE_BACKGROUND_COLOR: "#3F953F",
  // ACTIVE_TRANSITION_BACKGROUND_COLOR: '#5bd65b',

  FONT_SIZE: 12,
  FONT_FAMILY_POPPINS: "'Poppins', sans-serif",

  LEFT_PANEL_HEIGHT: `${window.innerHeight - 103}px`,
  LEFT_PANEL_WIDTH_MINIMIZE: "133px",
  LEFT_PANEL_HEIGHT_MINIMIZE: "203px",
  // LEFT_PANEL_MARGIN: `${MULTIPLIER_INNER * LEFT_MARGIN}vw`,
  LEFT_PANEL_MARGIN: `3px`,
  LEFT_PANEL_FLOORPLAN_HEIGHT: `${window.innerHeight - 499}px`, // rest on the drawer subtract from total window height, rest of the components are on fixed height

  OLD_HEADER_HEIGHT: "50px",
  // HEADER_LOGO_WIDTH: '205px',

  CANVAS_PADDING: "10px", // `${WIDTH_PERCENT(38)}%`,

  RIGHT_DRAWER_HEIGHT: `${window.innerHeight - 103}px`,
  RIGHT_DRAWER_PRODUCT_HEIGHT: `${window.innerHeight - 103 - 20 - 55}px`,
  MAX_PRODUCT_ITEMS_HEIGHT:
    window.innerHeight - 103 - 20 - 40 - 52 - 13 - 10 - 24 - 21 - 115,
  RIGHT_DRAWER_TOP: "4px",

  TOOL_BAR_WIDTH: "70px", // `5vw`,

  SALES_PANEL_DIV_HEIGHT: window.innerHeight - 246, // header, installation/refinishing checklist, entire project title

  PANO_RADIUS: 100,
  PANO_SEGMENTS: 200,
  HOTSPOT_SIZE_OUTER: 3,
  HOTSPOT_SIZE_INNER: 2,
  HOTSPOT_SEGMENTS: 32,

  LOGO_HEIGHT: 239 / 3,
  LOGO_WIDTH: 383 / 2.5,

  SVG_DIV_CLASS_NAME: "svgDivContainer",

  USE_LIVE_DATA: false,
  BREADCUM_COLOR: "white",
};

export const pdfStyle = {
  headingSize: 18,
  questionTextSize: 14,
  answerTextSize: 14,
  headingBgColor: "#D8D8D8",
  marginY: 1,
  paddingY: 1,
  marginL: 2,
  paddingL: 2,
  // paddingL: 2.5,
  imageW: 220,
  imageH: 170,
  checklistFont: "14px",
  checklistLeftFont: "text-[14px]",
  projectFloorText: "text-[8px]",
  projectFloorPadding: "py-[6px] px-[1px]",
  checkListLeftW: "w-[65%] pr-[4px]",
  checkListRightW: "w-[35%]",
  defaultTextColor: "text-[#1E2E5A]",
  redColor: "text-[#FF0000]",
  tableBodyTextSize: 12,
  liSpacing: "pt-[0px]",
  spanLineHeight: "leading-normal",
};

export const SubmitDialogConstants = {
  FONT_SIZE: 14,
  HEADING_FONT_SIZE: 18,
  CROSS_ICON_URL: "/images/CrossIcon.svg",
  CHECK_ICON_URL: "/images/CheckIcon.svg",
  SUBQUE_MARGIN_LEFT: 24,
  MARGIN_Y: 2,
  MAINQUE_MARGIN_LEFT: 24,
  SUBOFSUBQUE_MARGIN_LEFT: 46,
  GAP_WITH_CROSS_ICON: 2,
  GAP_WITH_CHECK_ICON: 3.5,
  // SUB_OF_SUBQUE_MARGIN_LEFT: 7,
};

export const DRAWING_ROOM_DEFAULT_DATA_TO_STORE = {
  vertices: [
    { x: 200, y: 200 },
    { x: 368, y: 200 },
    { x: 368, y: 368 },
    { x: 200, y: 368 },
  ],
  centers: [],
  doors: [],
  lockedWalls: {},
  rotationAngle: null,
  hiddenWalls: [],
};

export const PDF_CONSTANTS = {
  TABLE_HEADING_STYLE: "px-6 py-3 !border-y-[1.5px] !border-x-[1.5px]",
  BORDER_CLASS:
    "px-6 py-3 border-x-[1.5px] border-y-[1.5px] border-x-[#6685ac] border-y-[#6685ac]",
  TABLE_BODY_STYLE:
    "px-6 py-1 font-medium text-[12px] text-black border-b-[1.5px] border-x-[1.5px] border-x-[#6685ac] border-b-[#6685ac]",
};
