import { createTheme } from '@mui/material/styles';

// Great British Bake Off inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c5f4f', // British racing green
      light: '#4a7c6a',
      dark: '#1a4435',
      contrastText: '#fff',
    },
    secondary: {
      main: '#614051', // Eggplant purple (already using)
      light: '#7d5669',
      dark: '#452d39',
      contrastText: '#fff',
    },
    error: {
      main: '#c44536', // Warm red
      light: '#d76459',
      dark: '#a13627',
    },
    warning: {
      main: '#e8a23d', // Warm amber
      light: '#edb860',
      dark: '#d08c2a',
    },
    success: {
      main: '#5a8f7b', // Sage green
      light: '#7aa593',
      dark: '#3e6d5a',
    },
    background: {
      default: '#faf7f2', // Warm cream
      paper: '#ffffff',
    },
    text: {
      primary: '#2d2926', // Warm dark brown instead of black
      secondary: '#6b6562', // Warm gray
    },
  },
  typography: {
    fontFamily: '"Libre Baskerville", "Georgia", "Times New Roman", serif',
    h1: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Libre Baskerville", "Georgia", serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Source Sans Pro", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      textTransform: 'none', // Less shouty than all-caps
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8, // Softer, more rounded corners
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(45, 41, 38, 0.08)',
    '0px 3px 6px rgba(45, 41, 38, 0.1)',
    '0px 4px 8px rgba(45, 41, 38, 0.12)',
    '0px 6px 12px rgba(45, 41, 38, 0.14)',
    '0px 8px 16px rgba(45, 41, 38, 0.16)',
    '0px 10px 20px rgba(45, 41, 38, 0.18)',
    '0px 12px 24px rgba(45, 41, 38, 0.2)',
    '0px 14px 28px rgba(45, 41, 38, 0.22)',
    '0px 16px 32px rgba(45, 41, 38, 0.24)',
    '0px 18px 36px rgba(45, 41, 38, 0.26)',
    '0px 20px 40px rgba(45, 41, 38, 0.28)',
    '0px 22px 44px rgba(45, 41, 38, 0.3)',
    '0px 24px 48px rgba(45, 41, 38, 0.32)',
    '0px 26px 52px rgba(45, 41, 38, 0.34)',
    '0px 28px 56px rgba(45, 41, 38, 0.36)',
    '0px 30px 60px rgba(45, 41, 38, 0.38)',
    '0px 32px 64px rgba(45, 41, 38, 0.4)',
    '0px 34px 68px rgba(45, 41, 38, 0.42)',
    '0px 36px 72px rgba(45, 41, 38, 0.44)',
    '0px 38px 76px rgba(45, 41, 38, 0.46)',
    '0px 40px 80px rgba(45, 41, 38, 0.48)',
    '0px 42px 84px rgba(45, 41, 38, 0.5)',
    '0px 44px 88px rgba(45, 41, 38, 0.52)',
    '0px 46px 92px rgba(45, 41, 38, 0.54)',
  ],
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontWeight: 600,
          textTransform: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 700,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(45, 41, 38, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(45, 41, 38, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(45, 41, 38, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(45, 41, 38, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#d4cfc8', // Warm neutral border
            },
            '&:hover fieldset': {
              borderColor: '#2c5f4f', // Primary color on hover
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 8,
          '& .MuiDataGrid-cell': {
            borderColor: '#e8e3dc', // Warm border color
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f1ea', // Warm header background
            borderRadius: '8px 8px 0 0',
            borderColor: '#e8e3dc',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#faf7f2',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(45, 41, 38, 0.08)',
        },
      },
    },
  },
});

export default theme;
