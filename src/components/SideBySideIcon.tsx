"use client"

import React from 'react';

import { SvgIcon } from "@mui/material";

export default function SideBySideIcon() {  

    return (
        <SvgIcon >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
            >
                <rect x="1" y="6" width="10" height="16" rx="2" ry="2" fill="inherit" stroke="grey.100" strokeWidth="0.5"/>
                <rect x="13" y="6" width="10" height="16" rx="2" ry="2" fill="transparent" stroke="grey.100" strokeWidth="1"/>
            </svg>
        </SvgIcon>
    )
}