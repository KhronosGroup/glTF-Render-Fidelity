"use client"
import React from 'react';
import { Typography, Box, Grid } from "@mui/material";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from "./ModelPage.module.css";
import InfoIcon from '@mui/icons-material/Info';
import ModelCard from '@/components/ModelCard';

export type EngineView = {
  name: string,
  label: string,
  thumbnail: string,
  image: string
}

type Props = {
  name: string,
  label: string,
  description: string,
  engineViews: EngineView[]
}

export default function EnginePage({name, label, description, engineViews}: Props) {  
  // Step 1: Set up state
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const [isVisible, setIsVisible] = React.useState(!isXs); 
  
  // Step 2: Toggle function
  const toggleDiv = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <Grid container direction="row" className={styles.main} sx={{
        pt: 1
      }}>
        <Box sx={{overflow: "auto"}} className={styles.description}>
          <Box
            sx={{
              pb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}> 
            <Typography variant='h6' component="h1">{label}</Typography>
            <Box onClick={toggleDiv} sx={{
              display: { xs: 'inline-block', sm: 'none' }
            }}>
              <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                {isXs && <InfoIcon />}
              </Box>
            </Box>
          </Box>
          {(!isXs) && description}
          {(isXs && isVisible) && description}
        </Box>
        <Grid
          className={styles.selection}
          container
          spacing={0}
          sx={{
            justifyContent: "center",
            overflow: "auto"
          }}>
          {engineViews.map((e,i) => { return <ModelCard key={e.name} thumbnail={e.thumbnail} tags={[]} name={e.name} title={e.label}/>})}
        </Grid>
      </Grid>
    </>
  );
}
