import type { JwtPayload } from "../../User/Auth/PrivateRouteUsuario";

interface Props {
  user: JwtPayload | null;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function ComercioPlanGate({ user, children, fallback }: Props) {
  const permitido =
    user?.rol !== "Colaborador" &&
    ["PRO", "BUSINESS"].includes(user?.planTipo?.trim().toUpperCase() ?? "");

  return <>{permitido ? children : fallback}</>;
}
