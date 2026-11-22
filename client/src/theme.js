import { createTheme } from "@mui/material/styles";

// Bake Off tent inspired theme: warm cream, teal blue, raspberry accent,
// geometric sans (Jost ~ Futura), uppercase headings, pill buttons, flat cards.
export const colors = {
  teal: "#197b9f",
  tealDark: "#156988",
  tealLight: "#238ab0",
  raspberry: "#c73d67",
  raspberryDark: "#a8325a",
  raspberryLight: "#f7d3de",
  cream: "#f4f2ed",
  creamDark: "#ebe8e0",
  border: "#d3d2cb",
  borderDark: "#b9b8b0",
  text: "#4a4a4a",
  textMuted: "#77756f",
};

const sans = '"Jost", "Futura", "Trebuchet MS", "Helvetica", "Arial", sans-serif';

const heading = {
  fontFamily: sans,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.teal,
      light: colors.tealLight,
      dark: colors.tealDark,
      contrastText: "#fff",
    },
    secondary: {
      main: colors.raspberry,
      light: "#d9668a",
      dark: colors.raspberryDark,
      contrastText: "#fff",
    },
    error: { main: "#c2402f", light: "#d76459", dark: "#a13627" },
    warning: { main: "#e0a030", light: "#edb860", dark: "#c88a20" },
    success: { main: "#3f8f6b", light: "#62a887", dark: "#2d6e51" },
    background: { default: colors.cream, paper: "#ffffff" },
    text: { primary: colors.text, secondary: colors.textMuted },
    divider: colors.border,
  },
  typography: {
    fontFamily: sans,
    h1: { ...heading, fontWeight: 500 },
    h2: { ...heading, fontWeight: 500 },
    h3: heading,
    h4: heading,
    h5: heading,
    h6: { ...heading, letterSpacing: "0.04em" },
    subtitle1: { fontFamily: sans, fontWeight: 500 },
    body1: { fontFamily: sans, fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontFamily: sans, fontSize: "0.9rem", lineHeight: 1.6 },
    button: {
      fontFamily: sans,
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colors.cream, color: colors.text },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "9px 24px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        outlined: { borderWidth: 2, "&:hover": { borderWidth: 2 } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: `1px solid ${colors.border}`,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 6 },
        elevation1: { boxShadow: "none", border: `1px solid ${colors.border}` },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            backgroundColor: "#fff",
            "& fieldset": { borderColor: colors.border },
            "&:hover fieldset": { borderColor: colors.teal },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500, letterSpacing: "0.02em" },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 6,
          "& .MuiDataGrid-cell": { borderColor: colors.border },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.creamDark,
            borderRadius: "6px 6px 0 0",
            borderColor: colors.border,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          },
          "& .MuiDataGrid-row:hover": { backgroundColor: colors.cream },
          // Compact, single-line buttons inside table cells
          "& .MuiDataGrid-cell .MuiButton-root": {
            padding: "4px 14px",
            fontSize: "0.75rem",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            minWidth: 0,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: { boxShadow: "none", border: `1px solid ${colors.border}` },
      },
    },
    MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
  },
});

export default theme;
