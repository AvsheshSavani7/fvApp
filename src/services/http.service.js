import axios from "axios";
import { getAuth } from "./identity.service";

export const postWithOutAuth = (url, entity) => {
  return new Promise((resolve, _reject) => {
    axios
      .post(url, entity)
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};

export const postWithAuth = (url, entity) => {
  return new Promise((resolve, _reject) => {
    const auth = getAuth();
    const headers = {
      "content-type": "application/json",
      "x-access-token": auth.token,
    };
    axios
      .post(url, entity, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};

export const zohoPostWithAuth = (url, entity) => {
  return new Promise((resolve, _reject) => {
    const auth = getAuth();
    const headers = {
      "content-type": "application/json",
      "x-access-token": auth.token,
    };
    axios
      .post(url, entity, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({
          status: false,
          data: ex.response.data,
        });
      });
  });
};

export const postWithAuthImg = (url, entity) => {
  return new Promise((resolve, _reject) => {
    const auth = getAuth();
    const headers = {
      "content-type": "multipart/form-data",
      "x-access-token": auth.token,
    };
    axios
      .post(url, entity, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};

export const getWithOutAuth = (url) => {
  return new Promise((resolve, _reject) => {
    axios
      .get(url)
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, error: ex.message });
      });
  });
};

export const getWithAuthAndBody = (url, entity) => {
  return new Promise((resolve, _reject) => {
    const auth = getAuth();
    const headers = {
      "content-type": "application/json",
      "x-access-token": auth.token,
    };
    axios
      .get(url, entity, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};

export const getWithAuth = (url, token = "") => {
  const headers = {
    "content-type": "application/json",
    "x-access-token": token,
  };
  return new Promise((resolve, _reject) => {
    axios
      .get(url, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, error: ex.message });
      });
  });
};

export const getWithAuthForPDF = (url, token = "") => {
  const headers = {
    "content-type": "application/json",
    "x-access-token": token,
  };
  return new Promise((resolve, _reject) => {
    axios
      .get(url, { headers }, { responseType: "blob" })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, error: ex.message });
      });
  });
};

export const getWithAuthWithToken = (url) => {
  const auth = getAuth();

  const headers = {
    "content-type": "application/json",
    "x-access-token": auth.token,
  };
  return new Promise((resolve, _reject) => {
    axios
      .get(url, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, error: ex.message });
      });
  });
};

export const deleteWithAuth = (url, entity) => {
  const auth = getAuth();

  const headers = {
    "content-type": "application/json",
    "x-access-token": auth.token,
  };

  return new Promise((resolve, _reject) => {
    axios
      .delete(url, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};

export const putWithAuth = (url, data) => {
  const auth = getAuth();
  const headers = {
    "content-type": "application/json",
    "x-access-token": auth.token,
  };
  return new Promise((resolve, _reject) => {
    axios
      .put(url, data, { headers })
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};
export const putWithOutAuth = (url, entity) => {
  return new Promise((resolve, _reject) => {
    axios
      .put(url, entity)
      .then((response) => {
        if (response && response.data) {
          resolve({ status: true, data: response.data });
        }
      })
      .catch((ex) => {
        resolve({ status: false, message: ex.message });
      });
  });
};
