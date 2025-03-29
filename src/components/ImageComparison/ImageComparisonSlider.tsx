"use client"
import React from 'react'
import { Box } from "@mui/material";
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';

export type ImageComparisonSliderProps = {
  imgSrc1: string,
  imgSrc2: string,
  setSliderPosition: (value: number) => void,
  sliderPosition: number
}

const ImageComparison2 = ({imgSrc1, imgSrc2, sliderPosition, setSliderPosition}: ImageComparisonSliderProps) => {
    const imageRef = React.useRef<HTMLImageElement>(null);
    const image2Ref = React.useRef<HTMLImageElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const containerRootRef = React.useRef<HTMLDivElement>(null);

    const containerCurrent = imageRef && imageRef.current;

    const elementLeft = (containerCurrent && containerCurrent.offsetLeft) || 0;
    const elementWidth = (containerCurrent && containerCurrent.clientWidth) || 1;
    const elementTop = (containerCurrent && containerCurrent.offsetTop) || 0;
    const elementHeight = (containerCurrent && containerCurrent.clientHeight) || 1;
  
    const handleDrag = (clientX : number) => {
      const container = imageRef.current;
      if (!container) return;
  
      // Get the bounds of the container
      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left; // Mouse position relative to the container
      const newSliderPosition = (offsetX / rect.width) * 100;
  
      // Clamp the value between 0 and 100
      if (newSliderPosition >= 0 && newSliderPosition <= 100) {
        setSliderPosition(newSliderPosition);
      }
    };
  
    const handleMouseDown = (event: React.MouseEvent) => {
      event.preventDefault();
      const onMouseMove = (e: MouseEvent) => handleDrag(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
      });
    };
    const handleTouchStart = (event: React.TouchEvent | TouchEvent) => {
        //event.preventDefault();
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches && e.touches[0]) {
              handleDrag(e.touches[0].clientX);
            }
        };
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", () => {
          document.removeEventListener("touchmove", onTouchMove);
        });
    };

    const toolReisze = () => {
      if(imageRef.current == null || image2Ref.current == null
      || containerRef.current == null || containerRootRef.current == null)
        return;
    
      const vhToPixels = (vh: number) => (vh * window.innerHeight) / 100;

      const imageContainer = imageRef.current;

      const maxWidth = containerRootRef.current.clientWidth ;  // Set max width
      const maxHeight = Math.max(containerRootRef.current.clientHeight, vhToPixels(70)); // Set max height
      
      const image_width = imageContainer.clientWidth;
      const image_height = imageContainer.clientHeight;
      const aspectRatio = image_height / image_width;

      // Calculate new dimensions while maintaining aspect ratio
      const width = containerRootRef.current.clientWidth;
      const height = containerRootRef.current.clientWidth * aspectRatio;

      if(width > maxWidth)
      {
        //width = maxWidth;
        //height = maxWidth / aspectRatio;
      }
      if(height > maxHeight)
      {
        //height = maxHeight;
        //width = maxHeight * aspectRatio;
      }

      containerRef.current.style.width = width+"px";
      containerRef.current.style.height = height+"px";

      imageRef.current.style.width = width+"px";
      imageRef.current.style.height = height+"px";

      image2Ref.current.style.width = width+"px";
      image2Ref.current.style.height = height+"px";
    }

    const handleOnLoad = () => {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          toolReisze();
        });
      });
      
      // Observe the canvas
      //resizeObserver.observe(containerRootRef.current);
      resizeObserver.observe(document.body);
    }

    return (
      <Box 
        display='flex'
        justifyContent='center'
        ref={containerRootRef} 
        sx={{
          width: "100%",        
          overflow: "hidden",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
      <Box
        display='flex'
        justifyContent='center'
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",        
          overflow: "hidden",
          cursor: "pointer",
          userSelect: "none",
          //maxWidth: '70vh',
          //maxHeight: '70vh',
          touchAction:'none'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Background Image */}
        <img
          ref={imageRef}
          src={imgSrc2}
          alt="Background"
          style={{
            width: '100%',
            objectFit: "contain",
            position: "absolute",
            top: 0,
            //left: 0,
          }}
          onLoad={handleOnLoad}
        />
  
        {/* Foreground Image */}
        <img
          ref={image2Ref}
          src={imgSrc1}
          alt="Foreground"
          style={{
            width: '100%',
            objectFit: "contain",
            position: "absolute",
            top: 0,
            //left: 0,
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // Adjust visible area
            backgroundColor: "inherit"
          }}
        />
  
        {/* Slider */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: `${sliderPosition}%`,
            //left: containerCurrent? `${elementLeft + sliderPosition/100 * elementWidth}px` : "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: "100%",
            backgroundColor: "white",
            pointerEvents: "none", // Avoid slider intercepting mouse events
          }}
        />
  
        {/* Drag Handle */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            //top: containerCurrent? `${elementTop + 0.5 * elementHeight}px` : "50%",
            left: `${sliderPosition}%`,
            //left: containerCurrent? `${elementLeft + sliderPosition/100 * elementWidth}px` : "50%",
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
            border: "2px solid black",
            zIndex: 11,
            pointerEvents: "none", // Avoid drag handle intercepting mouse events
          }}
        />
      </Box>
      </Box>
    );
  };


  export default ImageComparison2;