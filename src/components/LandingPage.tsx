"use client"
import React from 'react'
import { Box, Chip, Typography, Grid2 as Grid, useMediaQuery } from "@mui/material";
import Search from "@/components/Search";
import Fuse from 'fuse.js'
import ModelCard from "@/components/ModelCard";
import tagsFile from "@/data/tags.json"
import styles from "./LandingPage.module.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpIcon from '@mui/icons-material/Help';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image'
import { basePath } from '@/lib/paths';
import { useTheme } from "@mui/material/styles";

type EngineData = {
  name: string,
  image: string,
  thumbnail: string
}

type ModelType = {
  name: string,  
  label: string,
  description: string,
  tags: Array<string>,
  images: Array<EngineData>
}

type LandingPageProps = {
  models: Array<ModelType>
}

const tags = tagsFile.tags.map(t => {return {name: t, selected: false, index: 0}}).sort((a, b) => b.name.length - a.name.length);

export default function LandingPage({models}: LandingPageProps) {

  const scrollWrapperRef = React.useRef<HTMLDivElement>(null);
  const tagContainerRef = React.useRef<HTMLDivElement>(null);
  const mainContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedTags, setSelectedTags] = React.useState(tags);
  const [searchValue, setSearchValue] = React.useState("");
  const [tagsExpanded, setTagsExpanded] = React.useState(false);
  const [isOverflown, setOverflown] = React.useState(false);

  const tags2 = [tags[0], tags[1], tags[2]];

  const theme = useTheme();


  const handleSearchValueChange = (e:string) => {
    setSearchValue(e);
  }

  const handleHorizontalScrolling = (event: WheelEvent) => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft += event.deltaY/3;
      // Prevent vertical scrolling
      event.preventDefault();
    }
  };

  React.useEffect(() => {
    if(scrollWrapperRef && scrollWrapperRef.current) { 
      scrollWrapperRef.current.addEventListener('wheel', handleHorizontalScrolling, {passive: false});
    }
    if(tagContainerRef && tagContainerRef.current &&
       mainContainerRef && mainContainerRef.current
    ) {
      const mainContainer = mainContainerRef.current;
      const tagContainer = tagContainerRef.current;
      const prepareTags = async () => {
        const resizeObserver = new ResizeObserver(() => {
          setOverflown(tagContainer.clientWidth === mainContainer.clientWidth);
        });

        resizeObserver.observe(mainContainer);

        return resizeObserver;
      }

      const resizeObserverPromise = prepareTags();

      return () => {resizeObserverPromise.then(res => {res.disconnect()})}
    }

  }, []);

  const handleChipDelete = (tag: {name: string, selected: boolean}) => {
    console.log("Delete", tag);
    setSelectedTags(prevItems => {
      const temp = tags.map(t => {return {...t}}); // deep copy
      prevItems.filter(t => t.selected).forEach(t => {const item = temp.find(e => e.name === t.name); if(item) item.selected = true;})

      const item = temp.find(e => e.name == tag.name);
      if(item)
      {
        item.selected = false;
      }
      return [...temp].sort((a,b) => a.selected && b.selected? 0 : a.selected? -1 : b.selected? 1 : 0);
    })
  }
  const handleChipSelection = (tag: {name: string, selected: boolean}) => {
    console.log("Add", tag);
    setSelectedTags(prevItems => {
      const temp = tags.map(t => {return {...t}}); // deep copy
      prevItems.filter(t => t.selected).forEach(t => {const item = temp.find(e => e.name === t.name); if(item) item.selected = true;})

      const item = temp.find(e => e.name == tag.name);
      if(item)
      {
        item.selected = true;
      }
      return [...temp].sort((a,b) => a.selected && b.selected? 0 : a.selected? -1 : b.selected? 1 : 0);
    })
  }
  const handleChipReplace = (tag:string) => {
    setSelectedTags(prevItems => {
      const temp = tags.map(t => {return {...t}}); // deep copy
      const item = temp.find(e => e.name == tag);
      if(item)
      {
        item.selected = true;
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
      return [...temp].sort((a,b) => a.selected && b.selected? 0 : a.selected? -1 : b.selected? 1 : 0);
    })
  }

  const otherChips = (
    <Box ref={mainContainerRef} width={"100%"} justifyContent={"center"} display={"flex"} flexWrap={"nowrap"} flexDirection={"row"}>
      <Box ref={tagContainerRef} display={"flex"} flexWrap={"nowrap"} flexDirection={"row"}>
        <Box display={"flex"} flexWrap={"wrap"} flexDirection={"row"} height={tagsExpanded ? "100%" : 37} justifyContent={"flex-start"} style={{overflow: "hidden" }}>
          {selectedTags.map((t,i) => {return (<Chip key={t.name} sx={{margin: "5px 5px", fontWeight: 'bold'}} label={t.name} color={t.selected? "success" : "default"} clickable onClick={() => handleChipSelection(t)} onDelete={t.selected? () => handleChipDelete(t) : undefined}/>)})}
        </Box>
        <Box display={"flex"} alignItems={"top"} sx={{position: "relative"}}>
          {!tagsExpanded && isOverflown && <ExpandMoreIcon onClick={() => setTagsExpanded(true)}/>}
          { tagsExpanded && isOverflown && <ExpandLessIcon onClick={() => setTagsExpanded(false)}/>}
        </Box>
      </Box>
    </Box>
    )

  const options = {
    includeScore: true,
    // Search in `summary` and in `name`
    keys: ['summary', 'name']
  }
  
  const fuse = new Fuse(Object.values(models), options)
  
  const tagsArray = selectedTags.filter(e => e.selected == true).map(e => e.name);
  const result = ((searchValue === "") ? Object.values(models).map(e => {return {item: e}}) : fuse.search(searchValue)).filter((e,i) => {
    if(tagsArray.length == 0) return true;
    return tagsArray.every(tag => e.item.tags.includes(tag))
  });

  return (
    <>
        <Typography className={styles.text}>
            The purpose of glTF is to standardize Physically-Based Rendering (PBR) materials such that you 
            can be confident your model will appear as intended in any lighting environment in any renderer. 
            This is a very ambitious goal, as real-time rendering at this level of quality is still very much 
            an area of active research with improvements being made constantly. This site demonstrates where 
            we are on that path to convergence and highlights areas that could still use improvement. 
            We are comparing the most popular real-time web renderers as well as path tracers 
            (a rendering technique that uses far fewer approximations than are required by real-time renderers).
        </Typography>

        <Typography className={styles.text}>
          Select the model you would like to compare, use the tags or search to filter the list.  Then click on any two Renders that you would like to compare and select Compare.  You can also select the view mode (Side-by-side, Slider and Difference).
        </Typography>

        <Box display='flex' flexDirection='column' alignItems='center' gap={2} >
          <Box display='flex' sx={{width: "100%"}} flexDirection='row' justifyContent={"space-between"} alignItems='center'>
            <Search searchValueChange={handleSearchValueChange}/>
            <Tooltip enterTouchDelay={1} placement="right" title={<p style={{ color: `${theme.palette.text.primary}`, fontSize: "16px" }}>Search in the description and the titles of the models. Tags can be used to further segment the search</p>}>
              <HelpIcon sx={{margin: "5px"}}/>
            </Tooltip>
            <Box flex={1} display={{ xs: 'flex', sm: 'flex' }}  justifyContent='flex-end' flexWrap={"wrap"}>
            </Box>
          </Box>
          {otherChips}
        </Box>

        

        {/* Models */}
        <Grid container style={{padding: 0, margin: 0}} spacing={1} sx={{ justifyContent: "center"}}>
        {result.map((e,i) => { return <ModelCard key={e.item.name} name={e.item.name} title={e.item.label} thumbnail={(e.item.images.find((m) => m.name === "gltf-sample-viewer") || e.item.images[0]).thumbnail} tags={e.item.tags} selectTagCallback={(t)=>{handleChipReplace(t)}}/>})}
        </Grid>     
    </>
  );
}
