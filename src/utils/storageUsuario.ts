export const getLocalStorageJWTUsuario = (): string => {
  try {
    return (
      window.localStorage.getItem("jwtUsuario") ||
      window.localStorage.getItem("token") ||
      ""
    );
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageJWTUsuario = (
  token: string
): void => {
  try {
    window.localStorage.setItem("jwtUsuario", token);
    window.localStorage.setItem("token", token);
  } catch (error) {
    console.log(error);
  }
};

export const setLocalStorageUsuario = (
  key: string,
  value: string
): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getLocalStorageUsuario = (
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

export const removeLocalStorageUsuario = (
  key: string
): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const getLocalStorageRefreshTokenUsuario = (): string => {
  try {
    return window.localStorage.getItem("refreshTokenUsuario") ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageRefreshTokenUsuario = (token: string): void => {
  try {
    window.localStorage.setItem("refreshTokenUsuario", token);
  } catch (error) {
    console.log(error);
  }
};

export const clearStorageUsuario = (): void => {
  try {
    window.localStorage.removeItem("jwtUsuario");
    window.localStorage.removeItem("refreshTokenUsuario");
    window.localStorage.removeItem("usuario");
    window.localStorage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};