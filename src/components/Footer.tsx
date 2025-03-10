"use client"

import React from 'react';
import { Typography, Box, Link } from "@mui/material";
import { basePath } from '@/lib/paths';
import { useTheme } from "@mui/material/styles";

export const currentYear = new Date().getFullYear()

export default function Footer() {  
    const theme = useTheme();

    const imageSrc =
    theme.palette.mode === "light" 
    ? `${basePath}/logos/khronos/Khronos(r) Family_June18/Khronos Tagline/Khronos Tagline for web/RGB/Khronos_Tagline_RGB_June18.svg`
    : `${basePath}/logos/khronos/Khronos(r) Family_June18/Khronos Tagline/Khronos Tagline for web/white/Khronos_Tagline_White_June18.svg`;

    const bgColor = theme.palette.mode === "light" ? `#fff` : `#333333`;
    const fontColor = theme.palette.mode === "light" ? '#182136' : `#fff`;

    return (
      <footer style={{background:bgColor}}>
        <Box display='flex' style={{width: "100%"}}>
          <Box display='flex' flexDirection='column' height={"10px"} minHeight={"10px"} alignItems='left' sx={{width: "100%", margin: "auto", background:"#333333"}}></Box>
        </Box>
        <Box display='flex' flexDirection='column' style={{width: "100%", /*maxWidth: "1900px",*/ margin: 'auto', background:bgColor}}>
          <Box flex={1} width={"100%"} sx={{maxWidth: "1900px", margin: "auto"}} display='flex' justifyContent='flex-start'>
            <img
              style={{width: "100%", maxWidth: "250px"}}
              src={imageSrc}
              loading="lazy"
              alt={"The Khronos Group: Connecting Software to Silicon"}  
            />
          </Box>
          <Box pt={1} sx={{width: "100%", maxWidth: "1900px", margin: 'auto'}} flex={1} display={{ xs: 'none', sm: 'flex' }} justifyContent='flex-start' margin={"auto"}>
            {false && <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">About</Link>}
            <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">Privacy Policy</Link>
            <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">Terms of Use</Link>
            <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">Code of Conduct</Link>
            <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">Diversity and Inclusion</Link>
            <Link href="#" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener">Trademarks</Link>
          </Box>
        </Box>
        <Box display='flex' style={{width: "100%", maxWidth: "1900px", margin: 'auto', justifyContent: 'space-between', flexWrap: 'wrap', background:bgColor}}>
          <Box p={1}>
            <Typography color={fontColor} pb={1}>
              Copyright {currentYear} - The Khronos Group Inc.  All rights reserved.
            </Typography>
            <Typography fontSize={"12px"}>
              Khronos® is a registered trademark, and glTF™ and 3D Commerce™ are trademarks of The Khronos Group Inc.  All other product names, trademarks, and/or company names are used solely for identification and belong to their respective owners.
            </Typography>
          </Box>
        </Box>        
      </footer>
    );
}
