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
        {false && <Box style={{width: "100%"}} sx={{
          display: 'flex'
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: "10px",
              minHeight: "10px",
              alignItems: 'start',
              width: "100%",
              margin: "auto",
              background:"#333333"
            }}></Box>
        </Box>}
        <Box
          style={{width: "100%", maxWidth: "1900px", margin: 'auto', background:bgColor}}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            pl: {xs:2, sm:3},
            pr: {xs:2, sm:3}
          }}>
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: 'flex',
              justifyContent: 'flex-start',
              maxWidth: "1900px",
              margin: "auto",
              pt:"20px"
            }}>
            <a href="https://www.khronos.org/">
              <img
                style={{width: "100%", maxWidth: "250px", transform: 'translate(-5%, 0px)'}}
                src={imageSrc}
                loading="lazy"
                alt={"The Khronos® Group: Connecting Software to Silicon"}  
              />
            </a>
          </Box>
          <Box
            sx={{
              pt: 1,
              flex: 1,
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'flex-start',
              width: "100%",
              maxWidth: "1900px",
              margin: 'auto'
            }}>
            <Link
              href="https://www.khronos.org/legal/privacy"
              color="textPrimary"
              underline='always'
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "12px",
                p: 1,
                pl: 0,
                color:fontColor
              }}>Privacy Policy</Link>
            <Link
              href="https://www.khronos.org/legal/"
              color="textPrimary"
              underline='always'
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "12px",
                p: 1,
                color:fontColor
              }}>Legal Notices</Link>
            <Link
              href="https://www.khronos.org/about/code-of-conduct"
              color="textPrimary"
              underline='always'
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "12px",
                p: 1,
                color:fontColor
              }}>Code of Conduct</Link>
            <Link
              href="https://www.khronos.org/about/diversity-and-inclusion/"
              color="textPrimary"
              underline='always'
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "12px",
                p: 1,
                color:fontColor
              }}>Diversity and Inclusion</Link>
            <Link
              href="https://www.khronos.org/legal/trademarks/"
              color="textPrimary"
              underline='always'
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "12px",
                p: 1,
                color:fontColor
              }}>Trademarks</Link>
          </Box>
        </Box>
        <Box
          style={{width: "100%", maxWidth: "1900px", margin: 'auto', justifyContent: 'space-between', flexWrap: 'wrap', background:bgColor}}
          sx={{
            display: 'flex',
            pl: {xs:2, sm:3},
            pr: {xs:2, sm:3}
          }}>
          <Box
            sx={{
              pt: 1,
              pb: 1
            }}>
            <Typography
              sx={{
                color: fontColor,
                pb: 1,
                fontSize: "12px"
              }}>
              Copyright {currentYear} - The Khronos® Group Inc.  All rights reserved.
            </Typography>
            <Typography sx={{
              color: fontColor,
              fontSize: "12px"
            }}>
              Khronos® is a registered trademark, and glTF™ and 3D Commerce™ are trademarks of The Khronos Group Inc.  All other product names, trademarks, and/or company names are used solely for identification and belong to their respective owners.
            </Typography>
          </Box>
        </Box>
      </footer>
    );
}
