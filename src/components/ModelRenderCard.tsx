"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Box, Typography, Checkbox } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { basePath } from '@/lib/paths';

export type ModelCardProps = {
    name: string,
    marked: boolean,
    thumbnail: string,
    onSelection: (arg0: string) => void
}

export default function ModelRenderCard({name, thumbnail, marked, onSelection}: ModelCardProps) {
  const [selected, setSelected] = React.useState(false);

  const markCard = (clicked: boolean) => {
    onSelection(name);
    setSelected(clicked);
  }

  return (
      <Box
          onClick={() => markCard(!marked)}
          sx={{
              width: '100%',
              maxWidth: {xs: '100%', sm: '400px' },
              margin: '5px',

              "&:hover": {
                 backgroundColor: 'grey.700',
                 boxShadow: 3,
                 borderRadius: "16px"
             }
          }}>
          <Box sx={{
              position: "relative"
          }}>
            <Box style={{width: "100%"}} sx={{
                width: "100%"
            }}>
                <Image
                width={512}
                height={512}
                style={{ 
                    width: "100%",
                    height: "auto",
                    textAlign: "center", 
                    cursor: 'pointer', 
                    borderRadius: '16px',
                    transform: marked ? 'scale(0.9)' : 'scale(1)', // Shrink image when selected
                    transition: 'transform 0.3s ease, border-radius 0.3s ease',
                }}
                src={`${basePath}${thumbnail}`}
                alt={name}  
                loading="lazy"
                />
            </Box>
           
            <Checkbox
                checked={marked}
                onChange={() => markCard(!marked)}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon sx={{bgcolor: "grey.900", borderRadius:'50%'}}/>}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    //color: marked ? 'grey.500' : 'grey.400',
                    color: 'grey.500',
                    '& .MuiSvgIcon-root': {
                        fontSize: 24,
                    },
                }}
            />
          </Box>
          <Box
              sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1,
                  justifyContent: 'center'
              }}>
            <Typography
                sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    overflowWrap: "anywhere"
                }}>{name}</Typography>
          </Box>
      </Box>
  );
}