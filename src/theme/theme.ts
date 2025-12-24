import { createTheme } from "@mui/material/styles";
import { coffee } from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: coffee.main,
      dark: coffee.dark,
      light: coffee.light,
    },
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: coffee.light,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: coffee.main,
            borderWidth: 2,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: coffee.main,
          },
        },
      },
    },
  },
});

export default theme;
