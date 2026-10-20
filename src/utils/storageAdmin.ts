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

export const getLocalStorageJWTAdmin = (): string => {
  try {
    const storage = getStorage();
    if (!storage) return "";
    return storage.getItem("jwtAdmin") ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageJWTAdmin = (
  token: string
): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem("jwtAdmin", token);
  } catch (error) {
    console.log(error);
  }
};

export const setLocalStorageAdmin = (
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

export const getLocalStorageAdmin = (
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

export const removeLocalStorageAdmin = (
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

export const getLocalStorageRefreshTokenAdmin = (): string => {
  try {
    const storage = getStorage();
    if (!storage) return "";
    return storage.getItem("refreshTokenAdmin") ?? "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const setLocalStorageRefreshTokenAdmin = (token: string): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem("refreshTokenAdmin", token);
  } catch (error) {
    console.log(error);
  }
};

export const clearStorageAdmin = (): void => {
  try {
    const storage = getStorage();
    if (!storage) return;
    storage.removeItem("jwtAdmin");
    storage.removeItem("refreshTokenAdmin");
    storage.removeItem("admin");
    storage.removeItem("token");
  } catch (error) {
    console.log(error);
  }
};