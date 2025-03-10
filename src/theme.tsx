'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({  
  colorSchemes: { 
    light: {
      palette: {
        grey: {900:"#f5f5f5", 800:"#eeeeee", 700:"#e0e0e0", 600:"#bdbdbd", 500:"#9e9e9e", 400:"#757575", 300:"#616161", 200:"#424242", 100:"#212121", 50:"#101010"},
      }
    }, 
    dark: {
      palette: {
        text: /* used for texts*/ {
          primary: "#FFF",
          // secondary:
          // disabled:
        },
        primary: /* used for button or actions*/ {
          main: "#FFF",
          // light:
          // dark: 
        },
        //secondary: { /* used for secondary buttons, highlights or accents */
          //main: "#FFF",
          // light:
          // dark:
        //},
        // error: {...}
        // warning: {...}
        // info: {...}
        // success: {...}
        // grey: {50: .., 100...900:, A100, A200, A400, A700},
        grey: {50:"#fafafa", 100:"#f5f5f5", 200:"#eeeeee", 300:"#e0e0e0", 400:"#bdbdbd", 500:"#9e9e9e",600:"#757575", 700:"#616161", 800:"#424242", 900:"#212121"},
        // divider: rgba()
        background: { default: "#000000", paper: "#333333"},
        action: { /* used for button states, item lists or tables */
          // active
          // hover
          // hoverOpacity
          // selected
          // selectedOpacity
          // disabled
          // disabledBackground
          // disabledOpacity
          // focus
          // focusOpacity
          // activatedOpacity
        }
      }      
    }
  },
  cssVariables: { colorSchemeSelector: 'class'},
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
});

export default theme;
