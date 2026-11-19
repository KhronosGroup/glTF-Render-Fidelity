'use client'; // if using Next.js App Router

import React from 'react'
import { mat4, quat, vec3 } from "gl-matrix";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { WebGLPathTracer } from 'three-gpu-pathtracer';
import { ViewerRef, BoundingBox} from '@/types/ViewerRef';

export type ThreeGPUPathTracerViewerProps = {
  src?: string,
  style?: React.CSSProperties
  projection: mat4,
  view: mat4,
  fov: number,
  aspect: number,
  setBBox: (range: BoundingBox) => void,
  finishedLoading: () => void,
}

const ThreeGPUPathTracerViewer = React.forwardRef<ViewerRef, ThreeGPUPathTracerViewerProps>(({ src, style, projection, view, fov, aspect }: ThreeGPUPathTracerViewerProps, ref) => {
//const ThreeGPUPathTracerViewer = ({src, style, projection, view, fov, aspect}: ThreeGPUPathTracerViewerProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const rendererRef = React.useRef<THREE.WebGLRenderer>(null)
    const rendererPtRef = React.useRef<WebGLPathTracer>(null)
    const cameraRef = React.useRef<THREE.PerspectiveCamera>(null)
    const sceneRef = React.useRef<THREE.Scene>(null)
    const animationIdRef = React.useRef<number>(0);

    React.useEffect(() => {
      const init = async () => {
        // Set up scene
        const canvas = canvasRef.current;
        if (!canvas) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffffff);

        // Set up camera
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.01, 1000);
        cameraRef.current = camera;
        camera.matrixAutoUpdate = false;

        const threeProjectionMatrix = new THREE.Matrix4().fromArray(projection);
        const threeViewMatrix = new THREE.Matrix4().fromArray(view);
        // Apply the matrices directly
        camera.projectionMatrix.copy(threeProjectionMatrix);
        camera.matrixWorldInverse.copy(threeViewMatrix); // View matrix
        camera.matrix.copy(threeViewMatrix.clone().invert()); // World matrix
        camera.matrixWorld.copy(camera.matrix);

        const envUrl = "../env_maps/chinese_garden_1k.hdr";
        const env_map = await new HDRLoader().loadAsync( envUrl );
        env_map.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = env_map;
        scene.environment = env_map;

        // Load GLTF Model
        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(src ? src : "");
        const model = gltf.scene;
        scene.add(model);
        const boundingBox = new THREE.Box3();

        // 2. Compute the bounding box from the scene
        boundingBox.setFromObject(scene);

        // 3. (Optional) Get size and center
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        boundingBox.getSize(size);
        boundingBox.getCenter(center);

        // renderer
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: false,
          canvas: canvasRef.current as HTMLCanvasElement
        });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        rendererRef.current = renderer;

        // path tracer
        const pathTracer = new WebGLPathTracer( renderer );
        pathTracer.filterGlossyFactor = 0.5;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pathTracer as any).alpha = true;
        //pathTracer.renderScale = renderScale;
        //pathTracer.tiles.set( tiles, tiles );
        //pathTracer.setBVHWorker( new ParallelMeshBVHWorker() );
        pathTracer.setScene( scene, camera );
        rendererPtRef.current = pathTracer;

        // controls
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', () => { 
          pathTracer.updateCamera() 
        });
        controls.update();

        const animate = () => {
          const id = requestAnimationFrame( animate );
          animationIdRef.current = id;
          pathTracer.renderSample();
          controls.update();
          //renderer.render(scene, camera);
        };
        animate();
      };
      init();
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (rendererPtRef.current) (rendererPtRef.current as any)._pathTracer.dispose();
        if (rendererRef.current) rendererRef.current.dispose();
        if (sceneRef.current) {
          if(sceneRef.current.environment) 
            sceneRef.current.environment.dispose()
        }
      }
    }, []);

    React.useEffect(() => {
      const camera = cameraRef.current;
      const pathTracer = rendererPtRef.current;
      if (!camera) return;
      if (!pathTracer) return;
      
      const radiansToDegrees = (radians: number) => {
        return radians * (180 / Math.PI);
      }

      const threeProjectionMatrix = new THREE.Matrix4().fromArray(projection);
      const threeViewMatrix = new THREE.Matrix4().fromArray(view);
      // Apply the matrices directly
      camera.projectionMatrix.copy(threeProjectionMatrix);
      camera.matrixWorldInverse.copy(threeViewMatrix); // View matrix
      camera.matrix.copy(threeViewMatrix.clone().invert()); // World matrix
      camera.matrixWorld.copy(camera.matrix);
      camera.fov = radiansToDegrees(fov);                     // Field of view in degrees
      camera.aspect = aspect;  // New aspect ratio
      camera.updateProjectionMatrix();
      pathTracer.reset();
      pathTracer.updateCamera();
    }, [projection, view, fov, aspect]);

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
      <canvas
        ref={canvasRef}
        style={style}
      />
    );
});

ThreeGPUPathTracerViewer.displayName = 'ThreeGPUPathTracerViewer';
export default ThreeGPUPathTracerViewer;