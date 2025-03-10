"use client"

import React from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import  { useColorScheme } from '@mui/material/styles'

export default function LightDarkButton({}) {  

    const { mode, setMode } = useColorScheme();


    if(!mode) { return null; }    

    if(mode === 'system')
        setMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    return (
        <IconButton
            size="large"
            edge="start"
            aria-label="light_dark_menu"
            sx={{ mr: 1 }}
            onClick={ () => { setMode(mode == 'dark'? 'light' : 'dark') }}
        >
            {mode == 'dark'? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>                
    )
  }
