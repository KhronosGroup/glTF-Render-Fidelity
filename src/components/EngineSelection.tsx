"use client"
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Box, Grid2 as Grid, NativeSelect } from "@mui/material";


type Props = {
    engineName: string,
    engineList: string[],
    handleChange: (name:string) => void
}
  
export default function EngineSelection({engineName, engineList, handleChange}: Props) {  

    return (
        <>
        <FormControl sx={{ display: {xs:'none', sm: 'block'} }}>
            <InputLabel id="engine-select-label">Engine</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={engineName}
                label="Engine"
                onChange={(event) => {handleChange(event.target.value)}}
                //autoWidth
                //sx={{minWidth:'13rem'}}
            >
                {engineList.map(engine => <MenuItem key={engine} value={engine}>{engine}</MenuItem>)}
            </Select>
        </FormControl>
        <FormControl sx={{ display: {xs:'block', sm: 'none'} }}>
            <NativeSelect
                id="demo-simple-select"
                value={engineName}
                onChange={(event) => {handleChange(event.target.value)}}
                inputProps={{
                    name: 'Engine',
                    id: 'engine-select-label',
                }}
            >
                {engineList.map(engine => <option key={engine} value={engine}>{engine}</option>)}
            </NativeSelect>
        </FormControl>
    </>

    );
}