"use client"
import React from 'react'
import { Box } from "@mui/material";

// Load the images
const loadImage = (src: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = '';
    img.onload = () => resolve(img);
  }
);

export type ImageComparisonSliderProps = {
  imgSrc1: string,
  imgSrc2: string
}

export default function ImageDifferenceView({imgSrc1, imgSrc2}: ImageComparisonSliderProps) {

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if(canvasRef == null || canvasRef.current == null) { return; }
    if(canvasContainerRef == null || canvasContainerRef.current == null) { return; }
    
    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const vhToPixels = (vh: number) => (vh * window.innerHeight) / 100;
    const vwToPixels = (vw: number) => (vw * window.innerWidth) / 100;

    const processImages = async () => {
      
      const [img1, img2] = await Promise.all([loadImage(imgSrc1), loadImage(imgSrc2)]) as HTMLImageElement[];

      const width = img1.width;
      const height = img1.height;
      const ar = width / height;
      
      const drawCanvas = () => {      
        //context.putImageData(img1Data, 0, 0, 0, 0, canvas.width, canvas.height);
      }
  
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
         if (canvasContainer.clientWidth == 0 || canvasContainer.clientHeight == 0) return;
        //if ( canvas.style.width === `${canvasContainer.clientWidth}px` ) return;
          canvas.width = canvasContainer.clientWidth; // Update the actual width
          canvas.height = canvasContainer.clientWidth; // Update the actual height
          
          canvas.style.width = `${canvasContainer.clientWidth}px`;
          canvas.style.height = `${canvasContainer.clientWidth}px`;
          //canvas.style.maxHeight = `${vhToPixels(70)}px`;
          //canvas.style.maxWidth = `${vhToPixels(70)}px`;

          const maxWidth = canvas.width;  // Set max width
          const maxHeight = vhToPixels(70);//canvas.height; // Set max height
  
          // Create a temporary canvas to resize the image
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img1.width;
          let height = img1.height;
          const aspectRatio = width / height;
          if(width > maxWidth)
          {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          }
          if(height > maxHeight)
          {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }

          canvas.width = width;
          canvas.height = height;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
  
          // Resize the image on the temporary canvas
          tempCanvas.width = width;
          tempCanvas.height = height;
          tempCtx.drawImage(img1, 0, 0, width, height);
          const img1Data = tempCtx.getImageData(0, 0, width, height);
          tempCtx.drawImage(img2, 0, 0, width, height);
          const img2Data = tempCtx.getImageData(0, 0, width, height);
  
          const factor = 2/255;

          const fromRedToGreen = ( interpolant: number ) =>
          {
            return interpolant < 0.5? [1.0, 2.0 * interpolant, 0.0] : [2.0 - 2.0 * interpolant, 1.0, 0.0 ];
          }

          const fromGreenToBlue = ( interpolant: number ) =>
          {
            return interpolant < 0.5? [0.0, 1.0, 2.0 * interpolant] : [0.0, 2.0 - 2.0 * interpolant, 1.0 ]
          }
          const mix = (a: number[], b: number[], value:number) => [a[0] * (1-value) + value * b[0], a[1] * (1-value) + value * b[1], a[2] * (1-value) + value * b[2] ]
          const clamp = (x: number, minV: number, maxV: number) => Math.max(minV, Math.min(x, maxV));
          const smoothstep = (edge0:number, edge1:number, x:number) => {const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }

          // Compute the difference
          const diffData = context.createImageData(width, height);
          for (let i = 0; i < img1Data.data.length; i += 4) {

            // diff
            const diff = [
              Math.abs(img1Data.data[i] - img2Data.data[i]) * factor, // Red
              Math.abs(img1Data.data[i + 1] - img2Data.data[i + 1]) * factor, // Green
              Math.abs(img1Data.data[i + 2] - img2Data.data[i + 2]) * factor // Blue
            ];

            const value = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1] + diff[2] * diff[2]);

            const heatmap = ( value < 0.5 )? fromGreenToBlue( 1.0 - 2.0 * value ) : fromRedToGreen( 2.0 - 2.0 * value );
            //const heatmap = ( value < 0.5 )? mix([0,0,1], [0,1,0], 2.0 * value) : mix([0,1,0], [1,0,0], 2.0 * value-1.0);

            diffData.data[i] = Math.min(255, 255 * heatmap[0]); // Red
            diffData.data[i + 1] = Math.min(255, 255 * heatmap[1]); // Green
            diffData.data[i + 2] = Math.min(255, 255 * heatmap[2]); // Blue
            diffData.data[i + 3] = 255; // Alpha
          }
          context.putImageData(diffData, 0, 0);
        });
      });
        
      // Observe the canvas
      //resizeObserver.observe(canvasContainer);
      resizeObserver.observe(document.body);

      return resizeObserver;
    }

    const resizeObserverPromise = processImages();

    return () => {resizeObserverPromise.then(res => {res.disconnect()})}
  }, [imgSrc1, imgSrc2]);
  
    return (
      <Box ref={canvasContainerRef} width='100%' sx={{textAlign: "center", margin: "auto", width: "100%"}}>
        <canvas ref={canvasRef}/>
      </Box>
    );
};
