'use client'; // if using Next.js App Router

import React from 'react'
import { mat4, vec3 } from "gl-matrix";
import Script from "next/script";
import { glMatrix } from 'gl-matrix';
import { ViewerRef, BoundingBox} from '@/types/ViewerRef';
import { basePath } from '@/lib/paths';

export type SampleViewerProps = {
  src?: string,
  style?: React.CSSProperties
  projection: mat4,
  view: mat4,
  fov: number,
  aspect: number
  setBBox: (range: BoundingBox) => void,
  finishedLoading: () => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsToGl(array: any) {
    if (array === undefined) {
        return [0, 0, 0];
    }
    const tensor = new glMatrix.ARRAY_TYPE(array.length);

    for (let i = 0; i < array.length; ++i) {
        tensor[i] = array[i];
    }

    return tensor;
}


// dequantize can be used to perform the normalization from WebGL2 vertexAttribPointer explicitly
// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md#encoding-quantized-data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dequantize(typedArray: any, componentType: any)
{
    switch (componentType)
    {
    case 5120 /* GL.BYTE */:
        return new Float32Array(typedArray).map(c => Math.max(c / 127.0, -1.0));
    case 5121 /* GL.UNSIGNED_BYTE */:
        return new Float32Array(typedArray).map(c => c / 255.0);
    case 5122 /* GL.SHORT */:
        return new Float32Array(typedArray).map(c => Math.max(c / 32767.0, -1.0));
    case 5123 /* GL.UNSIGNED_SHORT */:
        return new Float32Array(typedArray).map(c => c / 65535.0);
    default:
        return typedArray;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getExtentsFromAccessor(accessor: any, worldTransform: any, outMin: any, outMax: any)
{
    let min = jsToGl(accessor.min);
    let max = jsToGl(accessor.max);
    
    if (accessor.normalized) {
        min = dequantize(min, accessor.componentType);
        max = dequantize(max, accessor.componentType);
    }

    // Construct all eight corners from min and max values
    const boxVertices = [
        vec3.fromValues(min[0], min[1], min[2]),
        vec3.fromValues(min[0], min[1], max[2]),
        vec3.fromValues(min[0], max[1], min[2]),
        vec3.fromValues(min[0], max[1], max[2]),

        vec3.fromValues(max[0], min[1], min[2]),
        vec3.fromValues(max[0], min[1], max[2]),
        vec3.fromValues(max[0], max[1], min[2]),
        vec3.fromValues(max[0], max[1], max[2])];


    // Transform all bounding box vertices
    for(const i in boxVertices) { 
        vec3.transformMat4(boxVertices[i], boxVertices[i], worldTransform); 
    }

    // Create new (axis-aligned) bounding box out of transformed bounding box
    const boxMin = vec3.clone(boxVertices[0]); // initialize
    const boxMax = vec3.clone(boxVertices[0]);

    for(const i in boxVertices) {
        for (const component of [0, 1, 2]) {
            boxMin[component] = Math.min(boxMin[component], boxVertices[i][component]);
            boxMax[component] = Math.max(boxMax[component], boxVertices[i][component]);
        }
    }

    const center = vec3.create();
    vec3.add(center, boxMax, boxMin);
    vec3.scale(center, center, 0.5);

    const centerToSurface = vec3.create();
    vec3.sub(centerToSurface, boxMax, center);

    const radius = vec3.length(centerToSurface);

    for (const i of [0, 1, 2])
    {
        //outMin[i] = center[i] - radius;
        //outMax[i] = center[i] + radius;
        outMin[i] = boxMin[i];
        outMax[i] = boxMax[i];
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSceneExtents(gltf: any, sceneIndex: any, outMin: any, outMax: any)
{
    for (const i of [0, 1, 2])
    {
        outMin[i] = Number.POSITIVE_INFINITY;
        outMax[i] = Number.NEGATIVE_INFINITY;
    }

    const scene = gltf.scenes[sceneIndex];

    let nodeIndices = scene.nodes.slice();
    while(nodeIndices.length > 0)
    {
        const node = gltf.nodes[nodeIndices.pop()];
        nodeIndices = nodeIndices.concat(node.children);

        if (node.mesh === undefined)
        {
            continue;
        }

        const mesh = gltf.meshes[node.mesh];
        if (mesh.primitives === undefined)
        {
            continue;
        }

        for (const primitive of mesh.primitives)
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const attribute = primitive.glAttributes.find((a:any) => a.attribute == "POSITION");
            if (attribute === undefined)
            {
                continue;
            }

            const accessor = gltf.accessors[attribute.accessor];
            const assetMin = vec3.create();
            const assetMax = vec3.create();
            getExtentsFromAccessor(accessor, node.worldTransform, assetMin, assetMax);

            for (const i of [0, 1, 2])
            {
                outMin[i] = Math.min(outMin[i], assetMin[i]);
                outMax[i] = Math.max(outMax[i], assetMax[i]);
            }
        }
    }
}

const SampleViewer = React.forwardRef<ViewerRef, SampleViewerProps>(({ src, style, projection, view, fov, aspect, setBBox, finishedLoading }: SampleViewerProps, ref) => {
//const SampleViewer = ({src, style, projection, view, fov, aspect}: SampleViewerProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rendererRef = React.useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stateRef = React.useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cameraRef = React.useRef<any>(null)

    const [dracoLoaded, setDracoLoaded] = React.useState(false);

    React.useEffect(() => {
      const isDracoLoaded = !!document.querySelector('script[src="https://www.gstatic.com/draco/v1/decoders/draco_decoder_gltf.js"]')
      setDracoLoaded(isDracoLoaded);
      
      return () => {};
    }, [])

    React.useEffect(() => {
      if(!dracoLoaded)
        return;

      if(canvasRef == null || canvasRef.current == null) { return; }
      const canvas = canvasRef.current;
      const webGl2Context = canvas.getContext('webgl2') as WebGL2RenderingContext;
  
      const load = async () => {
        const {GltfView, GltfState} = await import('@khronosgroup/gltf-viewer/dist/gltf-viewer.module.js');
        const gltfView = new GltfView(webGl2Context);
        const state = gltfView.createState();
        cameraRef.current = state.userCamera;
        stateRef.current = state;
        state.sceneIndex = 0;
        state.animationIndices = [];
        state.animationTimer.start();

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const resourceLoader = gltfView.createResourceLoader();
        state.gltf = await resourceLoader.loadGltf(src ? src : "");

        resourceLoader.loadEnvironment(`${basePath}/assets/chinese_garden_1k.hdr`, {
          lut_ggx_file: `${basePath}/assets/lut_ggx.png`,
          lut_charlie_file: `${basePath}/assets/lut_charlie.png`,
          lut_sheen_E_file: `${basePath}/assets/lut_sheen_E.png`
        }).then((environment: typeof state.environment) => {
          state.environment = environment;
          state.renderingParameters.blurEnvironmentMap = false;
          state.renderingParameters.environmentRotation = 0;
        })
        state.renderingParameters.toneMap = GltfState.ToneMaps.ACES_HILL_EXPOSURE_BOOST;

        const scene = state.gltf.scenes[state.sceneIndex];
        rendererRef.current = gltfView.renderer;
        scene.applyTransformHierarchy(state.gltf);
        state.userCamera.perspective.aspectRatio = canvas.clientWidth / canvas.clientHeight;
        state.userCamera.resetView(state.gltf, state.sceneIndex);
        state.userCamera.perspective.zfar = 1000.0;
        state.userCamera.perspective.znear = 0.01;
        const extents = {min: new Float32Array(3), max: new Float32Array(3)};

        getSceneExtents(state.gltf, state.sceneIndex, extents.min, extents.max);
        setBBox(extents);
        
        //state.userCamera.fitViewToScene(state.gltf, state.sceneIndex);
        //state.userCamera.orbitSpeed = Math.max(10.0 / canvas.width, 10.0 / canvas.height);

        state.userCamera.getViewMatrix = function () {
          return view;
        };

        const update = () =>
        { 
          if (!canvasRef.current) {
            window.requestAnimationFrame(update);
            return;
          }
         
          //state.userCamera.resetView(state.gltf, state.sceneIndex);
          //state.userCamera.fitViewToScene(state.gltf, state.sceneIndex);
          state.userCamera.perspective.zfar = 1000.0;
          state.userCamera.perspective.znear = 0.01;
          //console.log("canvas.clientWidth, canvas.clientHeight", canvas.clientWidth, canvas.clientHeight)
          gltfView.renderFrame(state, canvas.clientWidth, canvas.clientHeight);
          window.requestAnimationFrame(update);
        };
        window.requestAnimationFrame(update);

        /*const handleResize = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
         
          //canvas.width = canvas.clientWidth;
          console.log("RESIZING CLIENT", canvas.clientWidth, canvas.clientHeight);
          console.log("RESIZING", canvas.width, canvas.height);
          window.requestAnimationFrame(update);
        }
        window.addEventListener('resize', handleResize)

        const resizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            handleResize();
          });
        });*/
        
        finishedLoading();
      };
      load();
    }, [src, dracoLoaded])

    React.useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      resize: (width: number, height: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
         
        canvas.width = canvas.clientWidth;
      },
    }));

    React.useEffect(() => {
      if (cameraRef.current === null) return;
      cameraRef.current.getViewMatrix = function () {
        return view;
      };
      const inverse = mat4.create();
      const camera  = cameraRef.current;
      const state  = stateRef.current;

      // Compute inverse without modifying viewMatrix
      mat4.invert(inverse, view);
      camera.transform = inverse;

      camera.perspective.aspectRatio = aspect;
      //camera.resetView(state.gltf, state.sceneIndex);
        
      const out = mat4.create();

      // Invert the matrix
      //const cameraWorldMatrix = mat4.invert(mat4.create(), view);
      //const cameraPosition = cameraWorldMatrix && vec3.transformMat4(vec3.create(), [0, 0, 0], cameraWorldMatrix);
      //rendererRef.current.currentCameraPosition = cameraPosition;
    }, [projection, view, fov, aspect]);

    return (
      <>
        <Script src="https://www.gstatic.com/draco/v1/decoders/draco_decoder_gltf.js" strategy="lazyOnload" onLoad={() => { console.log("LOADEDDDDDDDD Draco"); setDracoLoaded(true);}} />
        <canvas
          ref={canvasRef}
          style={style}
        />
      </>
    );
});

SampleViewer.displayName = 'SampleViewer';
export default SampleViewer;