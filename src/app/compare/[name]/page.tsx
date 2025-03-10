import React from 'react'
import { Button, Typography, Box, Grid2 as Grid } from "@mui/material";
import type { Metadata, ResolvingMetadata  } from 'next'
import ComparePage from "@/components/ComparePage";
import models from "@/data/model-index.Phasmatic.json"
import { basePath } from '@/lib/paths';
import { RenderView } from "@/components/ModelPage";

export const dynamicParams = false; // models that are not included in the list, generate 404

export async function generateStaticParams() {
    
    return Object.values(models).map((model) => ({
      name: model.name
    }))
}

type Props = {
  params: Promise<{ name: string}>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type ModelData = {
  label: string
  description: string
  downloadModel?: string
  images: RenderView[]
}

export async function generateMetadata( { params, searchParams }: Props, parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const {name} = await params;
 
  // fetch data
  const model = (models as Record<string, ModelData>)[name];
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: model.label,
    description: model.description,
    openGraph: {
      title: model.label,
      description: model.description,
      images: [model.images[0].thumbnail, ...previousImages],
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

export default async function Page({params}: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const model = (models as Record<string, ModelData>)[name];

  const render_views = model.images;
  
  return <ComparePage name={name} label={model.label} description={model.description} renderViews={render_views} downloadUrl={model.downloadModel}/>
}