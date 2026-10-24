import { portfolioProjects } from '../data/portfolio-projects.js';

export const siteOrigin = (import.meta.env.VITE_SITE_URL || 'https://aarav.site').replace(/\/$/,'');
export const indexable = import.meta.env.VITE_PORTFOLIO_INDEXABLE === 'true';
export function getPortfolioSeo(project) {
  const path = project ? `/projects/${project.slug}/` : '/';
  const title = project ? `${project.name} — Aarav Gupta | Project case study` : 'Aarav Gupta | Full Stack Developer — Projects & Experience';
  const description = project ? project.description[0] : 'Aarav Gupta is a full stack developer and student at VIT Vellore. View React and Next.js projects, internship experience at Solder Labs, skills, and contact details.';
  const person = {'@type':'Person','@id':`${siteOrigin}/#aarav`,name:'Aarav Gupta',url:siteOrigin,jobTitle:'Full Stack Developer',sameAs:['https://github.com/aarav-g-168','https://www.linkedin.com/in/aaravgupta168/']};
  const schema = {'@context':'https://schema.org','@graph':[person,
    project ? {'@type':'CreativeWork',name:project.name,description:project.description[0],url:siteOrigin+path,author:{'@id':person['@id']},keywords:project.stack.join(', '),image:siteOrigin+project.image} : {'@type':'ProfilePage',name:title,url:siteOrigin+'/',mainEntity:{'@id':person['@id']},hasPart:portfolioProjects.map((item)=>({'@type':'CreativeWork',name:item.name,url:`${siteOrigin}/projects/${item.slug}/`,description:item.description[0]}))},
    ...(project ? [{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},{'@type':'ListItem',position:2,name:project.name,item:siteOrigin+path}]}] : []),
  ]};
  return {title,description,canonical:siteOrigin+path,image:siteOrigin+'/preview/portfolio-social.png',robots:indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',schema};
}
