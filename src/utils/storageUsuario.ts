export const getLocalStorageJWTUsuario = (): string => {
  try {
    return (
      window.localStorage.getItem("jwtUsuario") ?? ""
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
    window.localStorage.setItem(
      "jwtUsuario",
      token
    );
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

export const clearStorageUsuario = (): void => {
  try {
    window.localStorage.removeItem(
      "jwtUsuario"
    );

    window.localStorage.removeItem(
      "usuario"
    );
  } catch (error) {
    console.log(error);
  }
};