import React from "react";

export interface User {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  exp: number;
  iss: string;
}

export const UserContext = React.createContext<User | null>(null);
