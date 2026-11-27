"use client"

import React from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import  { useColorScheme } from '@mui/material/styles'

export default function LightDarkButton({}) {

    const { mode, systemMode, setMode } = useColorScheme();


    if(!mode) { return null; }

    // Resolve 'system' to the actual OS scheme instead of calling setMode during render
    const resolvedMode = mode === 'system' ? systemMode : mode;

    return (
        <IconButton
            size="large"
            edge="start"
            aria-label="light_dark_menu"
            sx={{ mr: 1 }}
            onClick={ () => { setMode(resolvedMode == 'dark'? 'light' : 'dark') }}
        >
            {resolvedMode == 'dark'? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
    )
  }
