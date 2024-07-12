export const getAuth = () => {
  let auth = localStorage.getItem("AUTH");
  return JSON.parse(auth);
};

export const setAuth = (authObj) => {
  let auth = JSON.stringify(authObj);
  localStorage.setItem("AUTH", auth);
  return auth;
};

export const removeAuth = () => {
  localStorage.removeItem("AUTH");
};

export const checkIsAdmin = () => {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";
  return isAdmin;
};
