import type { JwtClaims } from "../../services/auth.api";

interface Props {
  claims: JwtClaims | null;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function ComercioPlanGate({ claims, children, fallback }: Props) {
  const permitido =
    claims?.rol !== "Colaborador" &&
    (claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS");

  return <>{permitido ? children : fallback}</>;
}
