const getStorage = (): Storage | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  if (
    typeof globalThis !== "undefined" &&
    (globalThis as unknown as { localStorage?: Storage }).localStorage
  ) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
};

export const getLocalStorageJWTUsuario = (): string => {
  try {
    const storage = getStorage();
    if (!storage) return "";
    return (
      storage.getItem("jwtUsuario") ||
      storage.getItem("token") ||
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
    const storage = getStorage();
    if (!storage) return;
    storage.setItem("jwtUsuario", token);
    storage.setItem("token", token);
  } catch (error) {
    console.log(error);
  }
};

export const setLocalStorageUsuario = (
  key: string,
  value: string
): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getLocalStorageUsuario = (
  key: string
): string => {
  try {
    const storage = getStorage();
    if (!storage) return "";
    return storage.getItem(key) ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const removeLocalStorageUsuario = (
  key: string
): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const getLocalStorageRefreshTokenUsuario = (): string => {
  try {
    const storage = getStorage();
    if (!storage) return "";
    return storage.getItem("refreshTokenUsuario") ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageRefreshTokenUsuario = (token: string): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem("refreshTokenUsuario", token);
  } catch (error) {
    console.log(error);
  }
};

export const clearStorageUsuario = (): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem("jwtUsuario");
    storage.removeItem("refreshTokenUsuario");
    storage.removeItem("usuario");
    storage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};