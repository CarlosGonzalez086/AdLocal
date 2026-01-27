import { useMediaQuery } from "@mui/material";
import { createContext, type ReactNode } from "react";

interface MobileContextProps {
  isMobile: boolean;
  isUpperMedium: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export const MobileContext = createContext<MobileContextProps>({
  isMobile: false,
  isUpperMedium: false,
  isMedium: false,
  isLarge: false,
});

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider = ({ children }: MobileProviderProps) => {
  const isMobile = useMediaQuery("(max-width:576px)");
  const isUpperMedium = useMediaQuery("(max-width:900px)");
  const isMedium = useMediaQuery("(max-width:750px)");
  const isLarge = useMediaQuery("(max-width:1050px)");

  return (
    <MobileContext.Provider value={{ isMobile, isMedium, isLarge, isUpperMedium }}>
      {children}
    </MobileContext.Provider>
  );
};