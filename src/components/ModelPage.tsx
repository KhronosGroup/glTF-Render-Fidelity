"use client"
import React from 'react';
import { Typography, Button, Box, Grid2 as Grid, IconButton, Snackbar } from "@mui/material";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ModelRenderCard from "@/components/ModelRenderCard"
import styles from "./ModelPage.module.css";
import CompareIcon from '@mui/icons-material/Compare';
import Link from 'next/link'
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
//import README from "@/data/README.md"

export type RenderView = {
  name: string,
  thumbnail: string,
  image: string
}

type ModelPageProps = {
  name: string,
  label: string,
  description: string,
  renderViews: RenderView[],
  downloadUrl?: string
}

export default function ModelPage({name, label, renderViews, downloadUrl, description}: ModelPageProps) {  
  // Step 1: Set up state
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const [isVisible, setIsVisible] = React.useState(!isXs); 
  const [engineA, setEngineA] = React.useState(""); 
  const [engineB, setEngineB] = React.useState(""); 
  const [nextEngine, setNextEngine] = React.useState(0); 
  const [shareSnackbarOpen, setShareSnackbarOpen] = React.useState(false);
  
  // Step 2: Toggle function
  const toggleDiv = () => {
    setIsVisible(!isVisible);
  };

  const toggleSelection = (engine: string) => {
    if (engineA === engine) {
      setEngineA("");
      setNextEngine(0);
      return;
    } else if (engineB === engine) {
      setEngineB("");
      setNextEngine(1);
      return;
    }

    if (nextEngine === 0 ) {
      setEngineA(engine);
      setNextEngine(1);
    } else  {
      setEngineB(engine);
      setNextEngine(0);
    }
  };

  const count = Number(engineA === "") + Number(engineB === "");

  const onShare = () => {
    const shareURL = `https://phasmatic3d.github.io/rfw/model/${name}`;
    if (navigator.share) {
      navigator.share({
        title: `Khronos Render Fidelity`,
        url: shareURL
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      // fallback
      navigator.clipboard.writeText(shareURL);
      setShareSnackbarOpen(true);
    }
  }
  
  const descriptionComponent = <Box>
    <Box display='flex' justifyContent='space-between'>
      <Typography variant='h6'>Description</Typography>
      <Box>
        <IconButton onClick={onShare}><ShareIcon sx={{color: 'grey.100'}}/></IconButton>
        <Snackbar
          open={shareSnackbarOpen}
          onClose={() => {setShareSnackbarOpen(false)}}
          message="Model Copied"
          key={"Share"}
          autoHideDuration={1200}
        />
        {downloadUrl && <IconButton component="a" href={downloadUrl} download><FileDownloadIcon sx={{color: 'grey.100'}}/></IconButton>}
      </Box>
    </Box>
    <Typography>{description}</Typography>
  </Box>;

  return (
    <>
      <Button
        sx={{position:"fixed", height: "50px", zIndex:1,  right: "4vw", bottom: "15vh"}}
        component={Link}
        role={undefined}
        variant="contained"
        tabIndex={-1}
        href={`/compare/${name}?engine1=${engineA}&engine2=${engineB}`}
        startIcon={<CompareIcon />}
      > {(count == 0) ? "compare" : `select ${count} image(s) to compare`} </Button>
      <Grid container direction="row" className={styles.main} pt={1}>
        <Box sx={{overflow: "auto"}} className={styles.description}>
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center" }} pb={1}> 
            <Typography variant='h6'>{label}</Typography>
            <Box onClick={toggleDiv} display={{ xs: 'inline-block', sm: 'none' }}>
              <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                {isXs && <InfoIcon />}
              </Box>
            </Box>
          </Box>
          {(!isXs) && descriptionComponent}
          {(isXs && isVisible) && descriptionComponent}
        </Box>
        <Grid className={styles.selection} sx={{overflow: "auto"}} container justifyContent={"center"} spacing={0}>
          {renderViews.map((e,i) => { return <ModelRenderCard key={e.name} thumbnail={e.thumbnail} name={e.name} marked={(engineA === e.name || engineB === e.name)} onSelection={toggleSelection}/>})}
        </Grid>
      </Grid>
    </>
  )
}
