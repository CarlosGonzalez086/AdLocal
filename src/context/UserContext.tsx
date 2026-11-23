import React from "react";

export interface User {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  exp: number;
  iss: string;
  FotoUrl:string;
}

export const UserContext = React.createContext<User>({
  sub: "",
  id: "",
  nombre: "",
  rol: "",
  exp: 0,
  iss: "",
  FotoUrl:"",
});
