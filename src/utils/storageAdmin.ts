export const getLocalStorageJWTAdmin = (): string => {
  try {
    return (
      window.localStorage.getItem("jwtAdmin") ?? ""
    );
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageJWTAdmin = (
  token: string
): void => {
  try {
    window.localStorage.setItem(
      "jwtAdmin",
      token
    );
  } catch (error) {
    console.log(error);
  }
};

export const setLocalStorageAdmin = (
  key: string,
  value: string
): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getLocalStorageAdmin = (
  key: string
): string => {
  try {
    return (
      window.localStorage.getItem(key) ?? ""
    );
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const removeLocalStorageAdmin = (
  key: string
): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const clearStorageAdmin = (): void => {
  try {
    window.localStorage.removeItem(
      "jwtAdmin"
    );

    window.localStorage.removeItem(
      "admin"
    );
  } catch (error) {
    console.log(error);
  }
};