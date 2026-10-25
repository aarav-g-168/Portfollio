import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const release=process.argv.includes('--release');
const mode=release ? 'portfolio-release' : 'portfolio-preview';
const outDir=process.argv.includes('--production') ? 'dist' : release ? 'dist-portfolio' : 'dist-preview';
await build({mode,build:{outDir,manifest:true}});
await build({mode,build:{ssr:'src/entry-portfolio-server.jsx',outDir:'.portfolio-ssr',emptyOutDir:true}});
const {renderPortfolio,portfolioPaths}=await import(pathToFileURL(resolve('.portfolio-ssr/entry-portfolio-server.js')));
const template=await readFile(`${outDir}/index.html`,'utf8');
const manifest=JSON.parse(await readFile(`${outDir}/.vite/manifest.json`,'utf8'));
const escape=(text)=>text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function routeAssets(key,visited=new Set()) {
  if (visited.has(key)) return [];
  visited.add(key);
  const entry=manifest[key];
  if (!entry) return [];
  return [...(entry.css||[]),...(entry.imports||[]).flatMap((item)=>routeAssets(item,visited))];
}
function routeModules(key,visited=new Set()) {
  if (visited.has(key)) return [];
  visited.add(key);
  const entry=manifest[key];
  return entry ? [entry.file,...(entry.imports||[]).flatMap((item)=>routeModules(item,visited))] : [];
}
const baseCss=[...template.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="\/([^"]+)"[^>]*>/g)].map((match)=>match[1]);
for (const path of portfolioPaths) {
  const {html,seo}=renderPortfolio(path);
  const entryKey=path==='/' ? 'src/components/BasicPortfolio.jsx' : 'src/components/portfolio/CaseStudy.jsx';
  const assets=[...new Set([...baseCss,...routeAssets(entryKey)])];
  const inlineCss=(await Promise.all(assets.map((asset)=>readFile(resolve(outDir,asset),'utf8')))).join('\n');
  const head=`<title>${escape(seo.title)}</title>
<meta name="description" content="${escape(seo.description)}">
<meta name="robots" content="${seo.robots}">
<link rel="canonical" href="${seo.canonical}">
<meta name="theme-color" content="#f4f1e9">
${Object.entries({'og:title':seo.title,'og:description':seo.description,'og:type':'website','og:url':seo.canonical,'og:image':seo.image,'og:image:width':'1200','og:image:height':'630','og:image:alt':'Aarav Gupta — Full Stack Developer. Projects, experience, and technical skills.'}).map(([key,value])=>`<meta property="${key}" content="${escape(value)}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(seo.title)}">
<meta name="twitter:description" content="${escape(seo.description)}">
<meta name="twitter:image" content="${seo.image}">
<link rel="preload" href="/preview/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/preview/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
<style id="portfolio-prerender-styles">${inlineCss}</style>
${assets.map((asset)=>`<link rel="preload" as="style" href="/${asset}">`).join('\n')}
${[...new Set(routeModules(entryKey))].map((asset)=>`<link rel="modulepreload" href="/${asset}">`).join('\n')}
<script id="portfolio-schema" type="application/ld+json">${JSON.stringify(seo.schema).replaceAll('<','\\u003c')}</script>`;
  const output=template.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="description"[^>]*>/,'').replace(/<link[^>]*rel="stylesheet"[^>]*>/g,'').replace('</head>',head+'\n</head>').replace('<div id="root"></div>',`<div id="root" data-prerendered="true">${html}</div>`);
  const target=resolve(outDir,path==='/' ? 'index.html' : `${path.slice(1)}index.html`);
  await mkdir(dirname(target),{recursive:true}); await writeFile(target,output);
}
// Desktop keeps its own client-rendered entry instead of flashing the portfolio HTML.
await mkdir(`${outDir}/desktop`,{recursive:true});
await writeFile(`${outDir}/desktop/index.html`,template.replace('</head>','<meta name="robots" content="noindex, follow">\n</head>'));
await writeFile(`${outDir}/404.html`,'<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — Aarav Gupta</title></head><body style="margin:60px;font-family:system-ui;background:#f4f1e9;color:#23251f"><main><h1>This page took a wrong turn.</h1><p>The page you requested could not be found.</p><a href="/">Back to Aarav’s portfolio</a></main></body></html>');
const origin=renderPortfolio('/').seo.canonical.replace(/\/$/,'');
await writeFile(`${outDir}/robots.txt`,`User-agent: *\nAllow: /\nDisallow: /api/\n${release ? `Sitemap: ${origin}/sitemap.xml\n` : '# Staging pages also carry noindex meta tags.\n'}`);
await writeFile(`${outDir}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${release ? portfolioPaths.map((path)=>`<url><loc>${origin}${path}</loc></url>`).join('') : ''}</urlset>`);
console.log(`Pre-rendered ${portfolioPaths.length} portfolio pages into ${outDir}. Indexing: ${release ? 'enabled for release' : 'disabled for staging'}.`);
