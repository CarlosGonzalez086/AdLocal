import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { accent, brand, neutral, status } from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: brand.primary,
      dark: brand.primaryDark,
      light: brand.primaryLight,
    },

    secondary: {
      main: accent.orange,
      dark: accent.orangeDark,
      light: accent.orangeLight,
    },

    error: {
      main: status.error,
    },

    success: {
      main: status.success,
    },

    warning: {
      main: status.warning,
    },

    info: {
      main: status.info,
    },

    background: {
      default: neutral.surface,
      paper: neutral.white,
    },

    text: {
      primary: neutral.dark,
      secondary: neutral.darkMuted,
    },
  },

  // MUI theme
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  shape: {
    borderRadius: "10px",
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: neutral.surface,
          color: neutral.dark,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },

        "*": {
          boxSizing: "border-box",
        },

        "::-webkit-scrollbar": {
          width: 6,
          height: 6,
        },

        "::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "::-webkit-scrollbar-thumb": {
          background: "rgba(0, 0, 0, 0.16)",
          borderRadius: 999,
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: "rgba(0, 0, 0, 0.28)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },

      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: neutral.white,
            transition: "all .2s ease",

            "& fieldset": {
              borderColor: neutral.border,
              borderWidth: "1px",
            },

            "&:hover fieldset": {
              borderColor: brand.primaryLight,
            },

            "&.Mui-focused fieldset": {
              borderColor: brand.primary,
              borderWidth: "1.5px",
              boxShadow: `0 0 0 3px ${brand.primarySubtle}`,
            },

            "& input": {
              color: neutral.dark,
              fontWeight: 500,
              fontSize: "14.5px",
            },
          },

          "& .MuiInputLabel-root": {
            color: neutral.darkMuted,
            fontWeight: 500,
            fontSize: "14px",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: brand.primary,
            fontWeight: 600,
          },

          "& .MuiSvgIcon-root": {
            color: neutral.darkMuted,
          },

          "& .MuiFormHelperText-root": {
            marginLeft: 4,
            fontSize: "12px",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: neutral.white,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: neutral.border,
            borderWidth: "1px",
            transition: "all .2s ease",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primaryLight,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primary,
            borderWidth: "1.5px",
            boxShadow: `0 0 0 3px ${brand.primarySubtle}`,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: neutral.darkMuted,
          fontWeight: 500,
          fontSize: "14px",

          "&.Mui-focused": {
            color: brand.primary,
            fontWeight: 600,
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "14.5px",
          padding: "8px 18px",
          minHeight: "42px",
          transition: "all .2s cubic-bezier(0.4, 0, 0.2, 1)",

          "&.MuiButton-containedPrimary": {
            color: "#FFFFFF",
            backgroundColor: brand.primary,
            boxShadow: "0 2px 8px rgba(0, 137, 137, 0.26)",

            "&:hover": {
              backgroundColor: brand.primaryDark,
              boxShadow: "0 4px 14px rgba(0, 137, 137, 0.38)",
              transform: "translateY(-1px)",
            },
          },

          "&.MuiButton-containedSecondary": {
            color: "#FFFFFF",
            backgroundColor: accent.orange,
            boxShadow: "0 2px 8px rgba(231, 105, 44, 0.26)",

            "&:hover": {
              backgroundColor: accent.orangeDark,
              boxShadow: "0 4px 14px rgba(231, 105, 44, 0.38)",
              transform: "translateY(-1px)",
            },
          },

          "&.MuiButton-outlined": {
            borderColor: neutral.border,
            color: neutral.dark,

            "&:hover": {
              borderColor: brand.primary,
              backgroundColor: brand.primarySubtle,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "12.5px",
          borderRadius: "8px",
          height: "28px",
        },

        filled: {
          background: brand.primarySubtle,
          color: brand.primary,
        },

        colorSuccess: {
          backgroundColor: status.successSubtle,
          color: status.success,
        },

        colorWarning: {
          backgroundColor: status.warningSubtle,
          color: status.warning,
        },

        colorError: {
          backgroundColor: status.errorSubtle,
          color: status.error,
        },

        colorInfo: {
          backgroundColor: status.infoSubtle,
          color: status.info,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: neutral.border,
          fontSize: "14px",
          color: neutral.dark,
          padding: "12px 16px",
        },
        head: {
          backgroundColor: neutral.surfaceSubtle,
          color: neutral.darkMuted,
          fontWeight: 700,
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderBottom: `1px solid ${neutral.border}`,
        },
      },
    },

    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          background: neutral.white,
          border: `1px solid ${neutral.borderLight}`,
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.12)",
          overflow: "hidden",
        },
      },
    },

    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          color: neutral.dark,
          paddingInline: 12,
          paddingTop: 10,
        },

        label: {
          color: neutral.dark,
          fontWeight: 700,
          fontSize: "15px",
        },

        switchViewButton: {
          color: brand.primary,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: neutral.darkMuted,
          transition: "all .2s ease",

          "&:hover": {
            color: brand.primary,
            background: brand.primarySubtle,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          backgroundColor: neutral.white,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.03)",
          border: `1px solid ${neutral.borderLight}`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "14px",
          borderRadius: "6px",
          margin: "2px 6px",
          padding: "8px 12px",

          "&:hover": {
            backgroundColor: brand.primarySubtle,
            color: brand.primary,
          },
          "&.Mui-selected": {
            backgroundColor: brand.primarySubtle,
            color: brand.primary,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: brand.primarySubtle,
            },
          },
        },
      },
    },
  },
});

export default theme;
