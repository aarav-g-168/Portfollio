import { useEffect } from 'react';
import { getPortfolioSeo } from '../../lib/portfolio-seo';

export default function usePortfolioSeo(project) {
  useEffect(() => {
    const seo=getPortfolioSeo(project);
    document.title=seo.title;
    const meta=(attribute,key,value) => {
      let node=document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!node) { node=document.createElement('meta'); node.setAttribute(attribute,key); document.head.append(node); }
      node.content=value;
    };
    meta('name','description',seo.description); meta('name','robots',seo.robots);
    for (const [key,value] of Object.entries({'og:title':seo.title,'og:description':seo.description,'og:type':'website','og:url':seo.canonical,'og:image':seo.image,'og:image:alt':'Aarav Gupta — full stack developer. Code, craft and a little play.'})) meta('property',key,value);
    meta('name','twitter:card','summary_large_image'); meta('name','twitter:title',seo.title); meta('name','twitter:description',seo.description); meta('name','twitter:image',seo.image);
    let canonical=document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical=document.createElement('link'); canonical.rel='canonical'; document.head.append(canonical); }
    canonical.href=seo.canonical;
    let schema=document.getElementById('portfolio-schema');
    if (!schema) { schema=document.createElement('script'); schema.id='portfolio-schema'; schema.type='application/ld+json'; document.head.append(schema); }
    schema.textContent=JSON.stringify(seo.schema);
  },[project]);
}
