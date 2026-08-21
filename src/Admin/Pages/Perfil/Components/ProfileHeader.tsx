import { Avatar } from "@mui/material";

import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface Props {
  nombre: string;
  rol: string;
}

export const ProfileHeader = ({ nombre, rol }: Props) => {
  return (
    <div className="profileHeader">
      <Avatar className="profileAvatar">
        <MaterialSymbol icon="person" size="large" filled />
      </Avatar>

      <div>
        <h1 className="profileTitle fz-h2 fw-semibold mb-1">{nombre}</h1>

        <p className="profileSubtitle fz-h4 fw-regular mb-0">{rol}</p>
      </div>
    </div>
  );
};
