"use client"

import React from 'react';
import { Typography, Box, Link } from "@mui/material";
import { basePath } from '@/lib/paths';

export const currentYear = new Date().getFullYear()

export default function Footer() {  

    const imageSrc = encodeURI(`${basePath}/logos/khronos/Khronos(r) Family_June18/Khronos Tagline/Khronos Tagline for web/RGB inverted/Khronos_Tagline_Inverted_June18.svg`)
    const bgColor = "#0d1720";
    const fontColor = `#fff`;

    return (
      <footer style={{background:bgColor}}>
        {false && <Box display='flex' style={{width: "100%"}}>
          <Box display='flex' flexDirection='column' height={"10px"} minHeight={"10px"} alignItems='start' sx={{width: "100%", margin: "auto", background:"#333333"}}></Box>
        </Box>}
        <Box display='flex' flexDirection='column' pl={{xs:2, sm:3}} pr={{xs:2, sm:3}} style={{width: "100%", /*maxWidth: "1900px",*/ margin: 'auto', background:bgColor}}>
          <Box flex={1} width={"100%"} sx={{maxWidth: "1900px", margin: "auto", pt:"20px"}} display='flex' justifyContent='flex-start'>
            <a href="https://www.khronos.org/">
              <img
                style={{width: "100%", maxWidth: "250px"}}
                src={imageSrc}
                loading="lazy"
                alt={"The Khronos Group: Connecting Software to Silicon"}  
              />
            </a>
          </Box>
          <Box pt={1} sx={{width: "100%", maxWidth: "1900px", margin: 'auto'}} flex={1} display={{ xs: 'none', sm: 'flex' }} justifyContent='flex-start' margin={"auto"}>
            <Link href="https://www.khronos.org/legal/privacy" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener" sx={{color:fontColor}}>Privacy Policy</Link>
            <Link href="https://www.khronos.org/legal/" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener" sx={{color:fontColor}}>Legal Notices</Link>
            <Link href="https://www.khronos.org/about/code-of-conduct" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener" sx={{color:fontColor}}>Code of Conduct</Link>
            <Link href="https://www.khronos.org/about/diversity-and-inclusion/" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener" sx={{color:fontColor}}>Diversity and Inclusion</Link>
            <Link href="https://www.khronos.org/legal/trademarks/" color="textPrimary" underline='always' fontSize={"12px"} p={1} target="_blank" rel="noopener" sx={{color:fontColor}}>Trademarks</Link>
          </Box>
        </Box>
        <Box display='flex' pl={{xs:2, sm:3}} pr={{xs:2, sm:3}} style={{width: "100%", maxWidth: "1900px", margin: 'auto', justifyContent: 'space-between', flexWrap: 'wrap', background:bgColor}}>
          <Box p={1}>
            <Typography color={fontColor} pb={1} fontSize={"12px"}>
              Copyright {currentYear} - The Khronos® Group Inc.  All rights reserved.
            </Typography>
            <Typography color={fontColor} fontSize={"12px"}>
              Khronos® is a registered trademark, and glTF™ and 3D Commerce™ are trademarks of The Khronos Group Inc.  All other product names, trademarks, and/or company names are used solely for identification and belong to their respective owners.
            </Typography>
          </Box>
        </Box>        
      </footer>
    );
}
