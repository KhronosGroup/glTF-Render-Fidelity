"use client"
import React from 'react'
import { Box, Grid2 as Grid } from "@mui/material";

export type Props = {
  imgSrc1: string,
  imgSrc2: string
}

const ImageComparison = ({imgSrc1, imgSrc2}: Props) => {    
    
    return (
      <Box display='flex'
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{flexDirection: {xs: "column", sm: "row"}}}
      >
      <Box flex="1" position="relative" height="100%" p={1}>
        <img
            src={imgSrc1}
            alt="Engine 1"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
            }}
            />
      </Box>

      <Box flex="1" position="relative" height="100%" p={1}>
        <img
            src={imgSrc2}
            alt="Engine 2"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
            }}
            />
      </Box>
  
      </Box>
    );
  };

  export default ImageComparison;