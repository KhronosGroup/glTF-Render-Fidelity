'use client'; // if using Next.js App Router

import React from 'react'
import { mat4, quat, vec3 } from "gl-matrix";
import { Matrix4, Vector3 } from 'three';
import { ViewerRef, BoundingBox} from '@/types/ViewerRef';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import * as THREE from 'three'
import { ModelViewerElement } from '@google/model-viewer';

export type ModelViewerProps = {
  src?: string,
  style?: React.CSSProperties
  projection: mat4,
  view: mat4,
  fov: number,
  aspect: number,
  setBBox: (range: BoundingBox) => void,
  finishedLoading: () => void,
}

const ModelViewer = React.forwardRef<ViewerRef, ModelViewerProps>(({ src, style, projection, view, finishedLoading, fov, aspect }: ModelViewerProps, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const rendererRef = React.useRef<THREE.WebGLRenderer>(null)
    const cameraRef = React.useRef<THREE.PerspectiveCamera>(null)
    const sceneRef = React.useRef<THREE.Scene>(null)

    React.useEffect(() => {
      import('@google/model-viewer'); // Dynamically import it on the client
      
      const viewer = document.querySelector('model-viewer');
      if(!viewer) return;
      viewer.addEventListener('load', async () => {
        if (!viewer) return;

        let threeRenderer;
        let scene;
        let controls;
        for (let p = viewer; p != null; p = Object.getPrototypeOf(p)) { // Loop through toneMV object
          const privateAPI = Object.getOwnPropertySymbols(p); // Get symbols (private API)
          const renderer = privateAPI.find((value) => value.toString() == 'Symbol(renderer)'); // Find the "renderer" Symbol
          const sceneSym = privateAPI.find((value) => value.toString() == 'Symbol(scene)'); // Find the "scene" Symbol
          const controlsSym = privateAPI.find((value) => value.toString() == 'Symbol(controls)'); // Find the "scene" Symbol

          if (renderer != null) { // If renderer was found
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            threeRenderer = (viewer as any)[renderer].threeRenderer; // set threeRenderer to the threeRenderer object
          }
          if (sceneSym != null) { // Same with scene
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            scene = (viewer as any)[sceneSym];
          }
          if (controlsSym != null) { // Same with scene
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            controls = (viewer as any)[controlsSym];
          }

          if (threeRenderer != null && scene != null) { // If both are found, break out of the loop, as we have what we need
            break;
          }
        }
      
        if (!scene) return;
        if (!threeRenderer) return;

        rendererRef.current = threeRenderer;
        sceneRef.current = scene;
        cameraRef.current = scene.camera;
        const threeCamera = scene.camera;
        const canvas = threeRenderer.domElement;
        canvasRef.current = canvas;
        
         const boundingBox = new THREE.Box3();

        // 2. Compute the bounding box from the scene
        boundingBox.setFromObject(scene);

        // 3. (Optional) Get size and center
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        boundingBox.getSize(size);
        boundingBox.getCenter(center);

        // Update custom matrices here if needed
        scene.matrixAutoUpdate = false;
        scene.matrixWorldAutoUpdate = true;

        const envUrl = "../env_maps/chinese_garden_1k.hdr";
        const env_map = await new HDRLoader().loadAsync( envUrl );
        env_map.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = env_map;
        scene.environment = env_map;

        threeCamera.matrixAutoUpdate = false;
        threeCamera.matrixWorldAutoUpdate = false;
        threeCamera.matrixWorldNeedsUpdate = false;
        threeCamera.projectionMatrixAutoUpdate = false;

        const viewThree = new Matrix4().fromArray(view);
        const projectionThree = new Matrix4().fromArray(projection);

        //threeCamera.matrix.copy(viewIdentity);
        //threeCamera.modelViewMatrix.copy(viewThree);
        //threeCamera.matrixWorld.copy(viewThree);
        threeCamera.matrixWorld.copy(viewThree).invert();
        threeCamera.matrixWorldInverse.copy(viewThree);
        threeCamera.projectionMatrix.copy(projectionThree);
        threeCamera.projectionMatrixInverse.copy( threeCamera.projectionMatrix ).invert();

        scene.updateMatrixWorld(true);
        scene.forceRescale();

        finishedLoading();
        //threeRenderer.render(scene, threeCamera);
      });
      return () => {
        if (sceneRef.current) {
          if(sceneRef.current.environment) 
            sceneRef.current.environment.dispose()
        }
      }
    }, []);

    React.useEffect(() => {
      const viewer = document.querySelector('model-viewer');
      if (!viewer) return;
    
      const scene = sceneRef.current;
      const renderer = rendererRef.current;
      if (!scene) return;
      if (!renderer) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const threeCamera = (scene as any).camera;

      // Update custom matrices here if needed
      scene.matrixAutoUpdate = false;
      scene.matrixWorldAutoUpdate = false;

      threeCamera.matrixAutoUpdate = false;
      threeCamera.matrixWorldAutoUpdate = false;
      threeCamera.matrixWorldNeedsUpdate = false;
      threeCamera.projectionMatrixAutoUpdate = false;

      const viewThree = new Matrix4().fromArray(view);
      const projectionThree = new Matrix4().fromArray(projection);

      //threeCamera.matrix.copy(viewIdentity);
      //threeCamera.modelViewMatrix.copy(viewThree);
      threeCamera.matrixWorld.copy(viewThree).invert();
      threeCamera.matrixWorldInverse.copy(viewThree);
      threeCamera.projectionMatrix.copy(projectionThree);
      threeCamera.projectionMatrixInverse.copy( threeCamera.projectionMatrix ).invert();
          
      renderer.render(scene, threeCamera);
    }, [projection, view]);

    
    React.useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      resize: (width: number, height: number) => {
        const canvas = canvasRef.current;
        const renderer = rendererRef.current;
        if (!canvas || !renderer) return;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      },
    }));

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <model-viewer src={src} camera-target="0m 0m 0m" interaction-prompt="none" style={style} alt="A 3D model"></model-viewer>
  );
});

ModelViewer.displayName = 'ModelViewer';
export default ModelViewer;