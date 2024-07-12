const ApiUrl = process.env.REACT_APP_API_URL;

const UrlParamsReplace = (url, params = {}) => {
  let urlWithPrefix = `${ApiUrl}${url}`;
  if (params) {
    Object.keys(params).forEach(
      (key) => (urlWithPrefix = urlWithPrefix.replace(`:${key}`, params[key]))
    );
  }
  return urlWithPrefix;
};

export const SYSTEM_ADMIN_LOGIN_URL = () => UrlParamsReplace("/auth/login");
export const GET_ALL_DATA = (size, page, search) =>
  UrlParamsReplace(
    "/customers/get-all-cutomers?size=:size&page=:page&search=:search",
    {
      size,
      page,
      search,
    }
  );
export const GET_CUSTOMER_BY_ID = (customerId) =>
  UrlParamsReplace("/customers/get-cutomer/:customerId", { customerId });

export const ADD_CUSTOMER_FV_DATA = () =>
  UrlParamsReplace("/customers/add-update-customer");

export const UPDATE_CUSTOMER_FV_DATA = (customerId) =>
  UrlParamsReplace("/customers/update-fv-data/:customerId", { customerId });

export const UPLOAD_IMAGE = (customerId) => UrlParamsReplace("/upload-file");

export const DOWNLOAD_PDF = (customerId) =>
  UrlParamsReplace(`/customers/generate-pdf/${customerId}`);

export const DOWNLOAD_IMAGES_PDF = (customerId) =>
  UrlParamsReplace(`/customers/generate-images-pdf/${customerId}`);

export const GET_FLOOR_PLAN_BY_ZC_PO_ID = (zc_po_id) =>
  UrlParamsReplace(`/customers/get-floor-plan/:zc_po_id`, { zc_po_id });

// Push fv data to zoho api
export const PUSH_FVDATA_TO_ZOHO = () =>
  UrlParamsReplace(`/customers/push-to-zoho`);

export const CREATE_FLOOR_PLAN_DATA = (customerId) =>
  UrlParamsReplace(`/customers/:customerId/floorplan`, { customerId });
