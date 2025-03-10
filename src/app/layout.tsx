import type { Metadata } from "next";
import { Open_Sans, Chivo, Poppins } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Header from '../components/Header'
import Footer from '../components/Footer'
import theme from '../theme'
import { Typography, Box, Container, Grid2 as Grid } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import "./globals.css";

// Khronos currently uses: OpenSans-Semibold, Helvetica, Arial, sans-serif;
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"]
})
// Khronos will use Chivo for Title
const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"]
})
// Khronos will use Poppins for text
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Khronos Render Fidelity",
  description: "Khronos Render Fidelity Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" prefix="og: https://ogp.me/ns#" suppressHydrationWarning>
      <body className={`${poppins.variable} ${chivo.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme} defaultMode="system">
            <InitColorSchemeScript attribute="class" />
            <CssBaseline />            
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: "100vh"}}>
              <Header />
              <Container sx={{flexGrow: 1, overflow: "auto", flex: 1 }} maxWidth={false}>
                {children}
              </Container>
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
