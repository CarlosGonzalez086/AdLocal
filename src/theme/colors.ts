/**
 * Paleta Oficial AdLocal
 * Extraída fielmente de la identidad gráfica oficial:
 * - "Local" & "Tu Puente con la Comunidad": Verde Azulado / Teal (#008989)
 * - "AD" & Fachada: Terracota Cálido Coral (#E7692C)
 * - Acentos de Campanas y Sol: Ámbar Dorado / Mostaza (#F59E0B / #F79844)
 * - Cúpulas y Techos: Terracota Rojizo (#D84028)
 * - Palmeras / Naturaleza: Verde Agave (#2A9D6F)
 * - Fondo Lienzo: Arena / Marfil Cálido Suave (#F8F6F2)
 */

export const brand = {
  primary: "#008989", // Teal / Verde Azulado de "Local"
  primaryDark: "#007070", // Hover oscuro
  primaryLight: "#1DA3A3", // Tono luminoso
  primaryGlow: "rgba(0, 137, 137, 0.28)",
  primarySubtle: "rgba(0, 137, 137, 0.08)",

  backgroundTeal: "#EDF7F7",
  lightTeal: "#D8EFEF",

  // Compatibilidad
  backgroundBlue: "#EDF7F7",
  lightBlue: "#D8EFEF",
};

export const accent = {
  orange: "#E7692C", // Terracota cálido de "AD"
  orangeDark: "#C9551D",
  orangeLight: "#F28650",
  orangeGlow: "rgba(231, 105, 44, 0.28)",
  orangeSubtle: "rgba(231, 105, 44, 0.10)",

  gold: "#F59E0B",
  goldLight: "#FBBF24",
  goldSubtle: "rgba(245, 158, 11, 0.12)",
};

export const neutral = {
  white: "#FFFFFF",
  whiteMuted: "rgba(255, 255, 255, 0.80)",
  whiteSubtle: "rgba(255, 255, 255, 0.12)",

  surface: "#F8F6F2", // Fondo arena/marfil suave del lienzo del logo
  surfaceSubtle: "#F3EFE8",
  surfaceDark: "#1C1D1F",

  dark: "#1C1D1F", // Texto principal oscuro
  darkMuted: "#696E75", // Texto secundario
  darkSubtle: "#8E939B", // Texto terciario / placeholders

  textLight: "#A8ADB5",
  textWhite: "#FFFFFF",

  border: "#EAE5DD", // Borde cálido sutil
  borderLight: "rgba(0, 0, 0, 0.06)",
};

export const status = {
  success: "#2A9D6F", // Verde Agave de la palmera / naturaleza
  successSubtle: "rgba(42, 157, 111, 0.12)",

  warning: "#E7692C", // Terracota / Ámbar para pendientes
  warningSubtle: "rgba(231, 105, 44, 0.12)",

  error: "#D84028", // Terracota rojizo de las cúpulas
  errorSubtle: "rgba(216, 64, 40, 0.12)",

  info: "#008989", // Teal de "Local"
  infoSubtle: "rgba(0, 137, 137, 0.10)",

  inactive: "#8E939B",
  inactiveSubtle: "rgba(142, 147, 155, 0.12)",
};

export const sidebar = {
  background: "#FFFFFF",
  backgroundHover: "rgba(0, 137, 137, 0.05)",
  text: "#1C1D1F",
  textMuted: "#696E75",
  active: "#008989",
  activeBackground: "rgba(0, 137, 137, 0.10)",
  border: "#EAE5DD",
};

export const cards = {
  background: "#FFFFFF",
  border: "#EAE5DD",
  shadow: "0 2px 8px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.03)",
  shadowHover: "0 4px 14px rgba(0, 0, 0, 0.06), 0 12px 28px rgba(0, 137, 137, 0.08)",
};

export const table = {
  headerBackground: "#F5F2EC",
  headerText: "#1C1D1F",
  rowHover: "rgba(0, 137, 137, 0.03)",
  rowBorder: "#EAE5DD",
  selected: "rgba(0, 137, 137, 0.08)",
};
