import React from 'react'
import type { Metadata, ResolvingMetadata  } from 'next'
import ComparePage from "@/components/ComparePage";
import models from "@/data/model-index.Fidelity.json"
import { baseUrl } from '@/lib/paths';
import { findModel } from '@/lib/models';
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

type Variant = {
  variants: {
    [key: string]: string;
  };
};

type ModelData = {
  label: string
  description: string
  downloadModel?: string
  images: RenderView[]
  variants: { [key: string]: string; }
}

export async function generateMetadata( { params, searchParams }: Props, parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const {name} = await params;
 
  // fetch data
  const model = findModel<ModelData>(name)!;
   
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    metadataBase: new URL(baseUrl),
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

  const model = findModel<ModelData>(name)!;

  const render_views = model.images;
  
  return <ComparePage name={name} label={model.label} variants={model.variants} description={model.description} renderViews={render_views} downloadUrl={model.downloadModel}/>
}