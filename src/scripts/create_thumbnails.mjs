import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';

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

//const image_directory = 'public/images';
const image_directory = 'glTF-Render-Fidelity-Generator/test/goldens';
const thumbnail_directory = 'public/thumbnails';
//const image_directory = '/Users/vineek/Documents/Projects/Web/glTF-Render-Fidelity/test/goldens';

fs.rmSync(thumbnail_directory, { recursive: true, force: true });

const tasks = [];
await (async () => {
  for await (const f of getFiles(image_directory)) {
    const src_relative_file = path.relative(image_directory, f);
    const tgt_f = thumbnail_directory + '/' + src_relative_file;
    const tgt_directory = path.dirname(tgt_f);
    const filename = path.basename(src_relative_file, path.extname(src_relative_file));
    const ext = path.extname(f);
    tasks.push({
      src: f,
      tgt: tgt_directory + '/' + filename + '.thumb' + '.webp',
      tgt_dir: tgt_directory,
      rel: src_relative_file,
      ext: ext,
      name: filename
    });
  }
})();

// Function to run a task in a worker
function runWorker(filePath, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filePath, { workerData });

    worker.on('message', resolve);  // Resolve the promise with the worker's result
    worker.on('error', reject);    // Reject the promise if the worker encounters an error
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Main function to start multiple workers
async function runTasks() {
  const workers = tasks.map((task) =>
    runWorker('./src/scripts/thumbnail_worker.mjs', task)
  );

  const results = await Promise.all(workers);
  return results;
}

await runTasks().catch((err) => console.error(err));