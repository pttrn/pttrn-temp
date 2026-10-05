import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Catalog } from './types.js';

/** The package root, two levels up from both `src/core` and `dist/core`. */
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function loadCatalog(): Catalog {
    const file = path.resolve(packageRoot, 'data/catalog.json');
    if (!fs.existsSync(file)) {
        throw new Error(`Design system data not found at ${file}. Run "npm run build:data" in packages/mcp.`);
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as Catalog;
}

export function loadGuide(): string {
    return fs.readFileSync(path.resolve(packageRoot, 'guide.md'), 'utf-8');
}
