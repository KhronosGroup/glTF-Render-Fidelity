"use client"

import React from 'react';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
    createStyles,
    makeStyles
  } from "@mui/material";

export default function SearchComponent({searchValueChange} : {searchValueChange: (input: string) => void}) {  

    const [value, setValue] = React.useState("");
    const [showClearIcon, setShowClearIcon] = React.useState("none");

    const handleChangeHelper = (query: string) => {
        setShowClearIcon(query === "" ? "none" : "flex");
        searchValueChange(query);
        setValue(query);
    }   

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        handleChangeHelper(event.target.value);
    };
  
    const handleClick = (): void => {
      handleChangeHelper("");
    };

    return (
        <FormControl sx={{width: "100%", maxWidth: "800px"}}>
            <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={value}
            onChange={handleChange}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        ),
                    endAdornment:(
                        <InputAdornment position="end"
                            style={{ display: showClearIcon }}
                        >
                            <IconButton onClick={handleClick}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
            />
        </FormControl>
    )
}