import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const limits = [
  { path: "dist/hero-480.jpg", maxBytes: 500_000 },
  { path: "dist/hero-960.jpg", maxBytes: 500_000 },
  { path: "dist/hero-1408.jpg", maxBytes: 500_000 },
  { path: "dist/logo-display.png", maxBytes: 50_000 },
];

const failures = [];

for (const asset of limits) {
  const file = resolve(asset.path);

  try {
    const { size } = await stat(file);
    if (size > asset.maxBytes) {
      failures.push(`${asset.path} is ${size} bytes; maximum is ${asset.maxBytes}`);
    }
  } catch (error) {
    failures.push(`${asset.path} is missing (${error.message})`);
  }
}

if (failures.length > 0) {
  throw new Error(`Critical asset verification failed:\n${failures.join("\n")}`);
}

console.log("Critical asset verification passed.");
