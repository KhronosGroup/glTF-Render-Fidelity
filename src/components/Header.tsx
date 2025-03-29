"use client"

import Link from 'next/link'
import Image from 'next/image'
import React from 'react';
import styles from './Header.module.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {ButtonProps} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LightDarkButton from './LightDarkButton'
import { basePath } from '@/lib/paths';
import { useTheme, styled, useColorScheme  } from "@mui/material/styles";

const MyToolbar = styled(Toolbar)(({ theme }) => [
    {
        color: '#182136',
        backgroundColor: '#fff',
    },
    theme.applyStyles('dark', {
        color: `#fff`,
        backgroundColor: `#333333`,
    }),
  ]);

const MyButton = styled(Button)<ButtonProps> (({ theme }) => [
    {
        color: '#182136',
        textTransform:'capitalize'
    },
    theme.applyStyles('dark', {
        color: `#fff`,
    }),
  ]);

export default function Header() {  
    const theme = useTheme();

    const { mode } = useColorScheme();

    const imageSrc = theme.palette.mode === "light" 
    ? `${basePath}/logos/khronos/Khronos(r) Family_June18/Khronos/Khronos for web/RGB/Khronos_RGB_June18.svg`
    : `${basePath}/logos/khronos/Khronos(r) Family_June18/Khronos/Khronos for web/RGB Inverted/Khronos_Inverted_June18.svg`;


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleBurgerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleBurgerClose = () => {
        setAnchorEl(null);
    }
    
    return (
      <AppBar position="static" sx={{background:"#333333"}}>
        <MyToolbar sx={{paddingLeft: 2, paddingRight: 2, width: "100%", margin:"auto", display:'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <Box display='flex' style={{width: "100%", maxWidth: "1900px", margin: "auto", justifyContent: 'space-between', flexWrap: 'wrap'}}>

            <Box flex={1} display='flex' justifyContent='flex-start' alignItems='center'>
                {mode && <a href="https://www.khronos.org/">
                    <img
                        style={{width: "100%", maxWidth: "250px", transform: 'translate(-5%, 0px)'}}
                        src={encodeURI(imageSrc)}
                        loading="lazy"
                        alt={"The Khronos® Group: Connecting Software to Silicon"} />
                </a>}
            </Box>
            <Box flex={1} display={{ xs: 'none', sm: 'flex' }}  justifyContent='flex-end' margin={"auto"}>
                <LightDarkButton />
                <MyButton variant="text" component={Link} href="/">Home</MyButton>
                <MyButton variant="text" component={Link} href="/about">About</MyButton>
                <MyButton variant="text" component={Link} href="/faq">FAQ</MyButton>
                <MyButton variant="text" component={Link} href="/contribute">Contribute</MyButton>
            </Box>
            <Box flex={1} display={{ xs: 'flex', sm: 'none' }} justifyContent='flex-end'>
                <LightDarkButton />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleBurgerClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    color="primary"
                    disableScrollLock 
                >
                    <MenuItem onClick={handleBurgerClose} component={Link} href="/">Home</MenuItem>
                    <MenuItem onClick={handleBurgerClose} component={Link} href="/about">About</MenuItem>
                    <MenuItem onClick={handleBurgerClose} component={Link} href="/faq">FAQ</MenuItem>
                    <MenuItem onClick={handleBurgerClose} component={Link} href="/contribute">Contribute</MenuItem>
                </Menu>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    onClick={handleBurgerClick}
                    sx={{ mr: 0, pr: 0 }}
                >
                    <MenuIcon />
                </IconButton>                
                </Box>
            </Box>
        </MyToolbar>
        <Box display='flex' pl={2} pr={2} style={{width: "100%", margin: "auto", justifyContent: 'space-between', flexWrap: 'wrap', background:"#333333", maxWidth: '1900px'}}>
            <Box display='flex' flexDirection='row' alignItems='center' justifyContent={"space-between"} sx={{width: "100%", /*maxWidth: "1900px",*/ margin: "auto"}}>
                <Box flex={1} display={{ xs: 'none', md: 'flex' }}>
                    <Image
                        width={100}
                        height={75}
                                
                        src={encodeURI(`${basePath}/logos/gltf/glTF_Nov17/glTF for web/glTF RGB/glTF_RGB_June16.svg`)}
                        alt={"3D Commerce"}  
                        loading="lazy" />
                </Box>
                <Box justifyContent={"flex-start"}>
                    <Typography sx={{fontWeight:'bold', fontFamily: 'var(--font-chivo)', p:{xs: 'inherit', sm:'10px'}, fontSize: {xs: '24px', sm: '36px'}}}>
                        glTF Render Fidelity Comparison
                    </Typography>
                </Box>
                <Box flex={1} display={{ xs: 'none', md: 'flex' }} flexDirection='row' justifyContent={"flex-end"} alignItems='center'>
                    <Image
                        width={150}
                        height={75}
                                
                        src={encodeURI(`${basePath}/logos/3dcommerce/3DCommerce_Aug20/3DCommerce for web/3DCommerce RGB/3DCommerce_RGB_Aug20.svg`)}
                        alt={"glTF"}  
                        loading="lazy" />
                    
                </Box>
            </Box>
        </Box>
    </AppBar>
    )
  }
