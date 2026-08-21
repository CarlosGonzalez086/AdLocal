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
    borderRadius: "8px",
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: neutral.surface,
          color: neutral.dark,
        },

        "*": {
          boxSizing: "border-box",
        },

        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        "::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "::-webkit-scrollbar-thumb": {
          background: "rgba(127,148,168,.38)",
          borderRadius: 999,
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: "rgba(127,148,168,.58)",
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
            borderRadius: "8px",
            backgroundColor: neutral.white,
            transition: "all .25s ease",

            "& fieldset": {
              borderColor: neutral.border,
              borderWidth: "1.5px",
            },

            "&:hover fieldset": {
              borderColor: brand.primary,
            },

            "&.Mui-focused fieldset": {
              borderColor: brand.primary,
              borderWidth: "2px",
              boxShadow: `0 0 0 4px ${brand.primarySubtle}`,
            },

            "& input": {
              color: neutral.dark,
              fontWeight: 600,
              fontSize: "15px",
            },
          },

          "& .MuiInputLabel-root": {
            color: neutral.darkMuted,
            fontWeight: 600,
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: brand.primary,
          },

          "& .MuiSvgIcon-root": {
            color: brand.primary,
          },

          "& .MuiFormHelperText-root": {
            marginLeft: 4,
          },

          "&.textField-registro .MuiOutlinedInput-root": {
            "& input": {
              fontSize: "18px",
            },
          },

          "&.textField-bols .MuiOutlinedInput-root": {
            "& input": {
              fontSize: "18px",
              fontWeight: 900,
            },
          },

          "&.textField-telefono .MuiOutlinedInput-root": {
            "& input": {
              letterSpacing: "5px",
              fontSize: "18px",
              fontWeight: 900,
            },
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: neutral.white,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: neutral.border,
            transition: "all .25s ease",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primary,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primary,
            borderWidth: 2,
            boxShadow: `0 0 0 4px ${brand.primarySubtle}`,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: neutral.darkMuted,
          fontWeight: 600,

          "&.Mui-focused": {
            color: brand.primary,
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 850,
          transition: "all .25s ease",

          "&.MuiButton-containedPrimary": {
            color: neutral.dark,
            background: `linear-gradient(135deg, ${brand.primary}, ${brand.primaryLight})`,
            boxShadow: `0 12px 28px ${brand.primaryGlow}`,

            "&:hover": {
              background: `linear-gradient(135deg, #00D977, ${brand.primaryLight})`,
              boxShadow: `0 16px 34px ${brand.primaryGlow}`,
              transform: "translateY(-1px)",
            },
          },

          "&.MuiButton-containedSecondary": {
            color: neutral.white,
            background: `linear-gradient(135deg, ${accent.orange}, ${accent.orangeDark})`,
            boxShadow: `0 10px 26px ${accent.orangeGlow}`,

            "&:hover": {
              background: `linear-gradient(135deg, ${accent.orangeLight}, ${accent.orange})`,
              boxShadow: `0 14px 30px ${accent.orangeGlow}`,
              transform: "translateY(-1px)",
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 850,
          borderRadius: 999,
        },

        filled: {
          background: brand.primarySubtle,
          color: "#00A85A",
        },

        colorSuccess: {
          backgroundColor: "rgba(0, 196, 106, 0.12)",
          color: status.onRoute,
        },

        colorWarning: {
          backgroundColor: "rgba(255, 159, 46, 0.14)",
          color: status.delay,
        },

        colorError: {
          backgroundColor: "rgba(255, 77, 79, 0.12)",
          color: status.penalty,
        },

        colorInfo: {
          backgroundColor: "rgba(47, 128, 237, 0.12)",
          color: status.info,
        },
      },
    },

    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          background: neutral.white,
          border: `1px solid ${neutral.border}`,
          boxShadow: "0 24px 70px rgba(6,17,31,0.20)",
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
          fontWeight: 900,
          fontSize: "16px",
        },

        switchViewButton: {
          color: brand.primary,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: brand.primary,
          transition: "all .2s ease",

          "&:hover": {
            background: brand.primarySubtle,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 16px 42px rgba(6,17,31,0.08)",
          border: `1px solid ${neutral.border}`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 750,
        },
      },
    },
  },
});

export default theme;
