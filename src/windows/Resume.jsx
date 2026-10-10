import { Download } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import WindowWrapper from "../hoc/WindowWrapper";
import WindowControls from "../components/WindowControls";
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Resume = () => {
  const containerRef = useRef(null);
  const [pageWidth, setPageWidth] = useState(560);
  const [pages, setPages] = useState(1);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setPageWidth(Math.max(200, Math.min(850, entry.contentRect.width - 24)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="resume-window">
      <div id="window-header">
        <WindowControls windowKey="resume" />
        <h2>Resume.pdf</h2>

        <a href="/resume.pdf" download className="cursor-pointer" title="Download Resume" aria-label="Download résumé PDF">
          <Download className="icon" />
        </a>
      </div>

      <div className="resume-document" ref={containerRef}>
      <Document file="/resume.pdf" onLoadSuccess={({ numPages }) => setPages(numPages)}
        loading={<p role="status">Loading résumé…</p>}
        error={<p role="alert">The preview couldn’t load. <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Open the résumé PDF</a>.</p>}>
        {Array.from({ length: pages }, (_, index) => <Page key={index} pageNumber={index + 1} width={pageWidth} renderTextLayer renderAnnotationLayer />)}
      </Document>
      </div>
    </div>
  )
}

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
