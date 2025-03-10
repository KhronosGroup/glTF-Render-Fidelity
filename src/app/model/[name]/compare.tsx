import models from "@/data/models.json"
import ImageComparisonSlider from "@/components/ImageComparison/ImageComparisonSlider";
import { Typography, Box, Grid2 as Grid } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';

export const dynamicParams = false; // models that are not included in the list, generate 404

export async function generateStaticParams() {
    
    return models.models.map((model) => ({
      name: model.name,
      description: model.description
    }))
}

export default async function Page({params}: { params: Promise<{ name: string, description: string }> }) {
  const { name, description } = await params;
  return (
    <>
      <CssBaseline />
      <Grid wrap={"nowrap"} container direction="column" sx={{width: "100%", height: "100%", position: "absolute",  top: 0, right: 0, bottom: 0, left: 0 }} spacing={2}>
        <Grid style={{margin: "auto", flex: 1, backgroundColor: "#add8e6", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <ImageComparisonSlider imgSrc1={"/thumbnails/original.thumb.webp"} imgSrc2={"/thumbnails/image.jpeg"}/>                        
        </Grid>
      </Grid>
    </>
  );
}