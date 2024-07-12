import * as HttpService from "./http.service";
import {
  ADD_CUSTOMER_FV_DATA,
  CREATE_FLOOR_PLAN_DATA,
  DOWNLOAD_IMAGES_PDF,
  DOWNLOAD_PDF,
  GET_ALL_DATA,
  GET_CUSTOMER_BY_ID,
  GET_FLOOR_PLAN_BY_ZC_PO_ID,
  PUSH_FVDATA_TO_ZOHO,
  SYSTEM_ADMIN_LOGIN_URL,
  UPDATE_CUSTOMER_FV_DATA,
  UPLOAD_IMAGE,
} from "./url.service";

export const adminLogin = (data) => {
  return HttpService.postWithOutAuth(SYSTEM_ADMIN_LOGIN_URL(), data);
};

export const getAllData = (token, size, page, search) => {
  return HttpService.getWithAuth(GET_ALL_DATA(size, page, search), token);
};

export const getCustomerById = (customerId, token) => {
  return HttpService.getWithAuth(GET_CUSTOMER_BY_ID(customerId), token);
};

export const addCustomerFVData = (fv_data) => {
  return HttpService.postWithAuth(ADD_CUSTOMER_FV_DATA(), fv_data);
};

export const updateCustomerFVData = (customerId, fv_data) => {
  return HttpService.putWithAuth(UPDATE_CUSTOMER_FV_DATA(customerId), fv_data);
};

export const uploadImage = (img) => {
  return HttpService.postWithAuthImg(UPLOAD_IMAGE(), img);
};

export const downloadPDF = (customerId, token) => {
  return HttpService.getWithAuth(DOWNLOAD_PDF(customerId), token);
};
export const downloadImagesPDF = (customerId, token) => {
  return HttpService.getWithAuth(DOWNLOAD_IMAGES_PDF(customerId), token);
};

//Fetch floor plan from zc_po_id from zoho
export const getFloorPlanZcPoId = (zc_po_id, token) => {
  return HttpService.getWithAuth(GET_FLOOR_PLAN_BY_ZC_PO_ID(zc_po_id), token);
};

// Push fvdata to zoho
export const pushFVDatatoZoho = (fv_data) => {
  return HttpService.zohoPostWithAuth(PUSH_FVDATA_TO_ZOHO(), fv_data);
};

/**
 ************ Floorplan Apis ***********
 */
export const createFloorPlanData = (customerId) => {
  return HttpService.postWithAuth(CREATE_FLOOR_PLAN_DATA(customerId));
};

export const updateFloorPlanData = (customerId, floorPlanData) => {
  return HttpService.putWithAuth(
    CREATE_FLOOR_PLAN_DATA(customerId),
    floorPlanData
  );
};
