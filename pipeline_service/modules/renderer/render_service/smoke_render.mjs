import fs from 'node:fs';
import { ensureBrowser, closeBrowser } from './browser.js';
import { startStaticServer } from './static-server.js';
import { renderViews } from './renderer.js';

const srcPath = process.argv[2];
const outPath = process.argv[3] || '/home/client_1917_14/sn17-work/smoke_out';
const source = fs.readFileSync(srcPath, 'utf-8');
await startStaticServer();
await ensureBrowser();
console.log('browser ready, rendering 4 views...');
const t0 = Date.now();
const buffers = await renderViews(source, {});
console.log(`rendered ${buffers.length} views in ${Date.now()-t0}ms`);
buffers.forEach((b,i)=>{ fs.writeFileSync(`${outPath}_${i}.png`, b); console.log(`wrote ${outPath}_${i}.png (${b.length} bytes)`); });
await closeBrowser();
process.exit(0);
