import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';

// Propiedades de ThemeConfig
interface Props {
  children: React.ReactNode;
}

// Paleta de colores y fuentes globales
export enum ThemePalette {
  BG = '#ffffff',
  LIME = '#689f38',
  FONT_GLOBAL = 'jetbrains mono, monospace',
  // Alert Styles
  ERROR_MAIN = '#f44336',
  BG_ERROR_MAIN = 'rgba(244,67,54,0.1)',
}

// Opciones del tema
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: { default: ThemePalette.BG },
    primary: {
      main: ThemePalette.LIME,
    },
  },
  typography: {
    fontFamily: ThemePalette.FONT_GLOBAL,
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '0.5em',
          backgroundColor: ThemePalette.LIME,
          fontFamily: ThemePalette.FONT_GLOBAL,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.2)', // Color de hover
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        standardError: {
          border: `1px solid ${ThemePalette.ERROR_MAIN}`,
          background: ThemePalette.BG_ERROR_MAIN,
        },
        // Asegúrate de usar styleOverrides aquí
        root: {
          borderRadius: '0.8em',
          fontSize: '1em',
        },
      },
    },
  },
};

// Creación del tema con las opciones definidas
const theme = createTheme(themeOptions);

// Aplica el tema a sus hijos
export const ThemeConfig: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
