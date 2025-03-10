import Image from "next/image";
import type { Metadata } from 'next'
import styles from "./page.module.css";
import { Box, Typography } from "@mui/material";
import LandingPage from "@/components/LandingPage";
import ModelList from "@/data/model-index.Phasmatic.json"

export const metadata: Metadata = {
  title: 'Khronos Render Fidelity',
  description: 'glTF Render Fidelity Test Suite',
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LandingPage models={Object.values(ModelList)}/>                        
      </main>
    </div>
  );
}
