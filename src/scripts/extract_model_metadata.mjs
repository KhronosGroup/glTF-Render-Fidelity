import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
//import ModelList from "../../src/data/model-index.Khronos.json" with { type: "json" };

async function* getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    //const res = path.resolve(dir, dirent.name);
    const res = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

// Returns an empty object on fail
async function readJSON(path)
{
  return await fs.promises.readFile(path, "utf-8").then(res => {return JSON.parse(res);}).catch(e => {return {}})
}

const SAMPLE_ASSETS_PATH = "./glTF-Render-Fidelity-Generator/glTF-Sample-Assets"
const ModelList = await readJSON(`${SAMPLE_ASSETS_PATH}/Models/model-index.json`);
const ModelTags = {};
const ModelMap = {};
ModelList.forEach(item => {
  ModelMap[item.name] = item;
});
const ModelMap2 = {};

//const model_directory = await fetch("https://api.github.com/repos/KhronosGroup/glTF-Sample-Assets/contents/Models").then(res => res.json()).catch(e => {return []});
const model_directory = await fs.promises.readdir(`${SAMPLE_ASSETS_PATH}/Models`, { withFileTypes: true });

console.log("Dir #:", Object.keys(model_directory).length);

const official_engine_names = new Map([
  ["model-viewer",  "three.js"],
  ["filament",      "filament.js"],
  ["babylon",       "babylon.js"],
  ["gltf-sample-viewer","gltf-sample-viewer"],
  ["three-gpu-pathtracer", "three-gpu-pathtracer"],
  ["stellar",       "Dassault STELLAR"],
  ["vray" ,         "Chaos Group V-Ray"],
  ["blender-cycles","Blender Cycles"],
  ["vk-gltf-renderer", "Vulkan RTX Path Tracer"],
  //["rhodonite","rhodonite"]
]);

const keep_dict = {
  "showcase": "Showcase",
  "testing": "Testing",
  "extension": "Extension",
}

const ext_to_label = {
  "KHR_materials_transmission": "Transmission",
  "KHR_materials_volume": "Volume",
  "KHR_materials_variants": "Variants",
  "KHR_materials_clearcoat": "Clearcoat",
  "KHR_materials_sheen": "Sheen",
  "KHR_materials_specular": "Specular",
  "KHR_materials_ior": "IOR",
  "KHR_materials_iridescence": "Iridescence",
  "KHR_materials_pbrSpecularGlossiness": "pbrSpecularGlossiness",
  "KHR_materials_emissive_strength": "Emissive",
  "KHR_materials_anisotropy": "Anisotropy",
  "KHR_materials_unlit": "Unlit",
  "KHR_lights_punctual": "Lights",
  "KHR_texture_transform": "Texture Transform",
  "KHR_xmp": "XMP",
  "KHR_xmp_json_ld": "XMP JSON LD",
  "EXT_texture_webp": "WebP",
  "KHR_materials_dispersion": "Dispersion",
  "KHR_materials_volume_scatter": "Volume Scatter",
  "EXT_mesh_gpu_instancing": "Mesh GPU Instancing",
  "KHR_materials_diffuse_transmission": "Diffuse Transmission",
  "KHR_animation_pointer": "Animation Pointer",  
  "KHR_node_visibility": "Node Visibility",  
  "KHR_materials_retroreflection": "Retroreflection",
  "KHR_meshopt_compression": "Meshopt",
  "KHR_mesh_quantization": "Quantization"
};
const unlabelled_extensions = new Map();

const model_directory_local = await fs.promises.readdir("./public/images/goldens", { withFileTypes: true });
await (async () => {
  for await (const dir of model_directory_local.filter((e, i) => i >= 0)) {
    if(!dir.isDirectory()) continue;
    if(!dir.name.startsWith("khronos-")) continue;

    const name = dir.name.slice(8);
    const folderpath = `Models/${name}`;
    //console.log("Model", name);

    const model = ModelMap[name];
    if(model == null) 
    {
      console.log("Cannot find ", name)
      continue;
    }
    
    //const metadata = await fetch(`https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/refs/heads/main/${folderpath}/metadata.json`).then(res => res.json()).catch(e => null);
    const metadata = await readJSON(`${SAMPLE_ASSETS_PATH}/${folderpath}/metadata.json`);
    //const gltf = await fetch(`https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/refs/heads/main/${folderpath}/glTF/${name}.gltf`).then(res => res.json()).catch(e => null);
    const gltf = await readJSON(`${SAMPLE_ASSETS_PATH}/${folderpath}/glTF/${name}.gltf`);
    const glb = model && model.variants && model.variants['glTF-Binary'];
    const glb_draco = model && model.variants && Object.keys(model.variants).find(variant => variant.includes('Draco'));
    const glb_meshopt = model && model.variants && model.variants['glTF-Quantized'];
    const glb_ktx = model && model.variants && Object.keys(model.variants).find(variant => variant.includes('KTX'));
    const images_filenames = await fs.promises.readdir(`./public/images/goldens/khronos-${name}`, { withFileTypes: true });

    const images = [];
    for(const img_file of images_filenames)
    {
      const engine = img_file.name.split("-golden.webp")[0];
      const thumbnail_name = path.parse(img_file.name).name;

      if(official_engine_names.has(engine))
      {
        images.push({
          name: official_engine_names.get(engine),
          image: `/images/goldens/khronos-${name}/${img_file.name}`,
          thumbnail: `/thumbnails/goldens/khronos-${name}/${thumbnail_name}.thumb.webp`,
        })
      }
      else
      {
        //console.log("It does not have", engine);
      }
    }

    if(model && metadata && images.length > 0)
    {
      const name = encodeURIComponent(metadata.name.replace(/\s+/g, ''));
      const addTag = (tagMap, tag) => {
        if (tag in tagMap) {
          tagMap[tag]++;
        } else {
          tagMap[tag] = 1;
        }
      };
      ModelMap2[name] = {};
      ModelMap2[name].name = metadata.name.replace(/\s+/g, '');
      ModelMap2[name].label = metadata.name;
      ModelMap2[name].description = metadata.summary;
      ModelMap2[name].tags = [];
      for (const tag of metadata.tags.filter(tag => tag in keep_dict)) {
        ModelMap2[name].tags.push(keep_dict[tag]);
        addTag(ModelTags, keep_dict[tag]);
      }
      ModelMap2[name].variants = model && model.variants;
      ModelMap2[name].extensionsUsed = gltf? gltf.extensionsUsed : [];
      if(gltf && gltf.extensionsUsed) {
        for (const tag of ModelMap2[name].extensionsUsed) {
          const label = ext_to_label[tag];
          if(!label)
          {
            unlabelled_extensions.set(tag, (unlabelled_extensions.get(tag) ?? 0) + 1);
            continue;
          }
          addTag(ModelTags, label);
          ModelMap2[name].tags.push(label);
        }
      }
      let anim_found = false;
      let morph_found = false;
      if(gltf && gltf.animations) {
        addTag(ModelTags, "Animation");
        ModelMap2[name].tags.push("Animation");
        anim_found = true;
      }
      if(gltf && gltf.meshes) {
        for (const mesh of gltf.meshes) {
          if ("weights" in mesh && !anim_found) {
            addTag(ModelTags, "Animation");
            ModelMap2[name].tags.push("Animation");
            anim_found = true;
          }
          for (const prim of mesh.primitives) {
            if ("targets" in prim && !morph_found) {
              addTag(ModelTags, "Morphing");
              ModelMap2[name].tags.push("Morphing");
              morph_found = true;
              if (!anim_found) {
                addTag(ModelTags, "Animation");
                ModelMap2[name].tags.push("Animation");
                anim_found = true;
              }
            }
          }
        }
      }
      if(glb_draco) {
        const tag = "Draco";
        addTag(ModelTags, tag);
        ModelMap2[name].tags.push(tag);
      }
      if(glb_meshopt & !ModelMap2[name].tags.includes("KHR_meshopt_compression")) {
        const tag = "Meshopt";
        addTag(ModelTags, tag);
        ModelMap2[name].tags.push(tag);
      }
      if(glb_ktx) {
        const tag = "KTX";
        addTag(ModelTags, tag);
        ModelMap2[name].tags.push(tag);
      }
      if(!(gltf && gltf.extensionsUsed) &&
         !glb_ktx &&
         !glb_meshopt &&
         !glb_draco) {
        const tag = "Core";
        addTag(ModelTags, tag);
        ModelMap2[name].tags.push(tag);
      }

      ModelMap2[name].downloadModel = glb? `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/refs/heads/main/${folderpath}/glTF-Binary/${glb}` : undefined
      ModelMap2[name].images = images;
    }
  }
})();

//console.log('ModelList', ModelList.length);
//console.log('ModelMap', Object.keys(ModelMap).length);
//console.log('ModelMap2', Object.keys(ModelMap2).length);
console.log('ModelTags', ModelTags);
if (unlabelled_extensions.size > 0) {
  console.warn('Extensions with no label in ext_to_label (skipped):', Object.fromEntries(unlabelled_extensions));
}

const TagList = {tags: []};
for (const tag in ModelTags) {
  TagList.tags.push(tag);
}

const jsonData = JSON.stringify(ModelMap2, null, 2); // The `null, 2` makes the output pretty-printed
fs.writeFileSync('src/data/model-index.Fidelity.json', jsonData);

const jsonDataTagList = JSON.stringify(TagList, null, 2); // The `null, 2` makes the output pretty-printed
fs.writeFileSync('src/data/tags.json', jsonDataTagList);