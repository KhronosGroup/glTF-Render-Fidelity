// Copies the glTF-Sample-Renderer build to where the website and the render script expect it.
// Cross-platform replacement for the former `cp` based postinstall.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const renderer = path.join(root, 'glTF-Sample-Renderer', 'dist');
const rendererLibs = path.join(renderer, 'libs');

if (!fs.existsSync(rendererLibs)) {
  console.error(`Renderer build not found in ${renderer}. Build glTF-Sample-Renderer first (npm run build).`);
  process.exit(1);
}

const copyFiles = (srcDir, destDir, filter = () => true) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.isFile() && filter(entry.name)) {
      fs.copyFileSync(path.join(srcDir, entry.name), path.join(destDir, entry.name));
    }
  }
};

// Website: wasm files next to the renderer bundle, libs for the app and the model page
copyFiles(rendererLibs, renderer, name => name.endsWith('.wasm'));
copyFiles(rendererLibs, path.join(root, 'public', 'libs'));
copyFiles(rendererLibs, path.join(root, 'public', 'model', 'libs'));

// Render script (scripts/viewer.html): the whole renderer build, so every runtime file is
// available (physics, splats, ...). The bundle resolves some files relative to itself
// (scripts/dist) and others relative to the page (scripts/libs), so both are populated.
const scriptsDist = path.join(root, 'scripts', 'dist');
fs.cpSync(renderer, scriptsDist, {
  recursive: true,
  filter: src => !src.endsWith('.map') && path.basename(src) !== 'gltf-viewer.js',
});
copyFiles(rendererLibs, path.join(root, 'scripts', 'libs'));
