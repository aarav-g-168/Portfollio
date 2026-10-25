import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import BasicPortfolio from './components/BasicPortfolio';
import CaseStudy from './components/portfolio/CaseStudy';
import { portfolioProjects } from './data/portfolio-projects';
import { getPortfolioSeo } from './lib/portfolio-seo';

export function renderPortfolio(path) {
  const project=portfolioProjects.find((item)=>path===`/projects/${item.slug}/`);
  const app=project ? <CaseStudy slug={project.slug} /> : <BasicPortfolio />;
  return {html:renderToString(<Suspense fallback={null}>{app}</Suspense>),seo:getPortfolioSeo(project)};
}
export const portfolioPaths=['/',...portfolioProjects.map((item)=>`/projects/${item.slug}/`)];
