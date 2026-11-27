import models from "@/data/model-index.Fidelity.json"

const safeDecode = (value: string) => {
  try { return decodeURIComponent(value); } catch { return value; }
}

// Index keys are URL-encoded (e.g. "BoxTexturednot2%5EN") while route params use the
// model's `name` (e.g. "BoxTexturednot2^N"), so match on `name` instead of the key.
export function findModel<T>(name: string): T | undefined {
  const decoded = safeDecode(name);
  return Object.values(models).find((model) => model.name === name || model.name === decoded) as T | undefined;
}
