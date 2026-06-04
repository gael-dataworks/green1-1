// render_cli.mjs <sourceFile> <outDir> [stem]
// renders the 4 canonical views (king defaults), writes <stem>_v{0..3}.png, prints JSON
import fs from 'node:fs';
import path from 'node:path';
import { ensureBrowser, closeBrowser } from './browser.js';
import { startStaticServer } from './static-server.js';
import { renderViews } from './renderer.js';

const src = fs.readFileSync(process.argv[2], 'utf-8');
const outDir = process.argv[3];
const stem = process.argv[4] || 'r';
fs.mkdirSync(outDir, { recursive: true });
try {
  await startStaticServer();
  await ensureBrowser();
  const buffers = await renderViews(src, {});
  const paths = buffers.map((b,i)=>{ const p = path.join(outDir, `${stem}_v${i}.png`); fs.writeFileSync(p, b); return p; });
  process.stdout.write(JSON.stringify({ ok:true, views:paths }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok:false, error:String(e.message||e) }));
} finally {
  try { await closeBrowser(); } catch {}
}
process.exit(0);
