import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const directory=process.argv[2] || 'dist-portfolio';
const preview=process.argv.includes('--preview');
const routes=['/','/projects/hackgrid/','/projects/contest-manager/','/projects/ios-fusion/'];
const titles=new Set();
for (const route of routes) {
  const html=await readFile(resolve(directory,route==='/'?'index.html':route.slice(1)+'index.html'),'utf8');
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title?.includes('Aarav Gupta'),`${route}: useful title missing`);
  assert(!titles.has(title),`${route}: duplicate title`); titles.add(title);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${route}: expected one H1`);
  assert.match(html,/<meta name="description" content=".{60,}"/);
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).pathname,route,`${route}: canonical path mismatch`);
  assert.equal(new URL(canonical).protocol,'https:',`${route}: canonical must be HTTPS`);
  assert.match(html,new RegExp(`name="robots" content="${preview?'noindex':'index'}, follow`));
  assert.match(html,/property="og:image"/); assert.match(html,/name="twitter:card" content="summary_large_image"/);
  const schema=JSON.parse(html.match(/<script id="portfolio-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]);
  assert(schema['@graph'].some((item)=>item['@type']==='Person'));
  assert(html.includes('data-prerendered="true"'),`${route}: pre-rendering missing`);
  const content=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  assert(content.includes('Next.js') || content.includes('React'),`${route}: project content absent without JS`);
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|preview)\/[^"?]+)"/g)) await access(resolve(directory,'.'+match[1]));
}
const home=await readFile(`${directory}/index.html`,'utf8');
for (const route of routes.slice(1)) assert(home.includes(`href="${route}"`),`Homepage must link ${route}`);
const sitemap=await readFile(`${directory}/sitemap.xml`,'utf8');
if (!preview) { for (const route of routes) assert(sitemap.includes(`${new URL(home.match(/rel="canonical" href="([^"]+)"/)[1]).origin}${route}</loc>`)); }
else assert(!sitemap.includes('<url>'),'Preview sitemap must not advertise unreleased pages');
assert.match(await readFile(`${directory}/robots.txt`,'utf8'),/Disallow: \/api\//);
assert.match(await readFile(`${directory}/404.html`,'utf8'),/content="noindex"/);
console.log(`SEO checks passed: ${routes.length} pre-rendered pages, metadata, schema, assets, project links, sitemap and staging policy.`);
