import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { svg2pdf } from 'svg2pdf.js';

export interface AnalysisData {
  repository: {
    name: string;
    full_name: string;
    description: string;
    html_url: string;
  };
  filesAnalyzed: number;
  documentation?: string;
  uml?: {
    classDiagram: string;
    sequenceDiagram: string;
    componentDiagram: string;
    stateDiagram: string;
    erDiagram: string;
    descriptions: Record<string, string>;
    categories: Record<string, string>;
  };
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

/**
 * Generate a Markdown report from analysis data
 */
export function exportToMarkdown(data: AnalysisData): string {
  const { repository, filesAnalyzed, documentation, uml, quiz } = data;
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let markdown = `# Repository Analysis: ${repository.name}\n\n`;
  markdown += `*Generated on ${date}*\n\n`;
  markdown += `---\n\n`;

  // Repository Information
  markdown += `## Repository Information\n\n`;
  markdown += `- **Name:** ${repository.name}\n`;
  markdown += `- **Full Name:** ${repository.full_name}\n`;
  if (repository.description) {
    markdown += `- **Description:** ${repository.description}\n`;
  }
  markdown += `- **URL:** [${repository.html_url}](${repository.html_url})\n`;
  markdown += `- **Files Analyzed:** ${filesAnalyzed}\n\n`;

  // Documentation
  if (documentation) {
    markdown += `---\n\n`;
    markdown += `## Documentation\n\n`;
    markdown += documentation + '\n\n';
  }

  // UML Diagrams
  if (uml) {
    markdown += `---\n\n`;
    markdown += `## UML Diagrams\n\n`;

    if (uml.classDiagram) {
      markdown += `### Class Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.classDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.sequenceDiagram) {
      markdown += `### Sequence Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.sequenceDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.componentDiagram) {
      markdown += `### Component Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.componentDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.stateDiagram) {
      markdown += `### State Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.stateDiagram + '\n';
      markdown += '```\n\n';
    }

    if (uml.erDiagram) {
      markdown += `### ER Diagram\n\n`;
      markdown += '```mermaid\n';
      markdown += uml.erDiagram + '\n';
      markdown += '```\n\n';
    }

    // Component Descriptions
    if (uml.descriptions && Object.keys(uml.descriptions).length > 0) {
      markdown += `### Component Descriptions\n\n`;
      Object.entries(uml.descriptions).forEach(([name, description]) => {
        markdown += `#### ${name}\n\n`;
        markdown += `${description}\n\n`;
      });
    }
  }

  // Quiz
  if (quiz && quiz.length > 0) {
    markdown += `---\n\n`;
    markdown += `## Quiz\n\n`;
    quiz.forEach((q, i) => {
      markdown += `### Question ${i + 1}\n\n`;
      markdown += `**${q.question}**\n\n`;
      markdown += `Options:\n`;
      q.options.forEach((opt, j) => {
        const marker = j === q.correctAnswer ? '✓' : ' ';
        markdown += `${j + 1}. [${marker}] ${opt}\n`;
      });
      markdown += `\n**Correct Answer:** ${q.correctAnswer + 1}\n\n`;
      if (q.explanation) {
        markdown += `**Explanation:** ${q.explanation}\n\n`;
      }
    });
  }

  return markdown;
}

/**
 * Export analysis data as a Markdown file
 */
export function downloadMarkdown(data: AnalysisData): void {
  const markdown = exportToMarkdown(data);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const filename = `${sanitizeFilename(data.repository.name)}-analysis-${getDateString()}.md`;
  saveAs(blob, filename);
}

/**
 * Export a single SVG diagram
 */
export function exportDiagramAsSVG(svgElement: SVGElement, filename: string): void {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * Convert SVG to PNG and download
 */
export async function exportDiagramAsPNG(
  svgElement: SVGElement,
  filename: string,
  scale: number = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#000000'; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, filename);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate a PDF report with rendered diagrams
 */
export async function exportToPDF(
  data: AnalysisData,
  classDiagramSVG?: SVGElement,
  sequenceDiagramSVG?: SVGElement,
  componentDiagramSVG?: SVGElement,
  stateDiagramSVG?: SVGElement,
  erDiagramSVG?: SVGElement
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak(fontSize * 0.5);
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
  };

  // Cover Page
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Repository Analysis', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.text(data.repository.name, pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated on ${date}`, pageWidth / 2, 120, { align: 'center' });

  // Repository Information Page
  doc.addPage();
  doc.setTextColor(0, 0, 0);
  yPos = margin;

  addText('Repository Information', 20, true);
  yPos += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const repoInfo = [
    `Name: ${data.repository.name}`,
    `Full Name: ${data.repository.full_name}`,
    data.repository.description ? `Description: ${data.repository.description}` : null,
    `URL: ${data.repository.html_url}`,
    `Files Analyzed: ${data.filesAnalyzed}`,
  ].filter(Boolean);

  repoInfo.forEach((info) => {
    if (info) {
      checkPageBreak(10);
      doc.text(info, margin, yPos);
      yPos += 7;
    }
  });

  // Documentation
  if (data.documentation) {
    yPos += 10;
    checkPageBreak(20);
    addText('Documentation', 16, true);
    yPos += 5;

    // Clean and format documentation text
    const cleanDoc = data.documentation
      .replace(/```[\s\S]*?```/g, '[Code Block]')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n\n+/g, '\n\n');

    addText(cleanDoc, 10);
  }

  // Class Diagram
  if (classDiagramSVG && data.uml?.classDiagram) {
    doc.addPage();
    yPos = margin;
    addText('Class Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = classDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(classDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding class diagram to PDF:', error);
      doc.text('Error rendering class diagram', margin, yPos);
    }
  }

  // Sequence Diagram
  if (sequenceDiagramSVG && data.uml?.sequenceDiagram) {
    doc.addPage();
    yPos = margin;
    addText('Sequence Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = sequenceDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(sequenceDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding sequence diagram to PDF:', error);
      doc.text('Error rendering sequence diagram', margin, yPos);
    }
  }

  // Component Diagram
  if (componentDiagramSVG && data.uml?.componentDiagram) {
    doc.addPage();
    yPos = margin;
    addText('Component Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = componentDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(componentDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding component diagram to PDF:', error);
      doc.text('Error rendering component diagram', margin, yPos);
    }
  }

  // State Diagram
  if (stateDiagramSVG && data.uml?.stateDiagram) {
    doc.addPage();
    yPos = margin;
    addText('State Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = stateDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(stateDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding state diagram to PDF:', error);
      doc.text('Error rendering state diagram', margin, yPos);
    }
  }

  // ER Diagram
  if (erDiagramSVG && data.uml?.erDiagram) {
    doc.addPage();
    yPos = margin;
    addText('ER Diagram', 16, true);
    yPos += 10;

    try {
      const svgElement = erDiagramSVG as SVGSVGElement;
      const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
      const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
      
      const scale = Math.min(contentWidth / svgWidth, (pageHeight - yPos - margin) / svgHeight);
      const scaledWidth = svgWidth * scale;
      const scaledHeight = svgHeight * scale;

      await svg2pdf(erDiagramSVG, doc, {
        x: margin,
        y: yPos,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (error) {
      console.error('Error adding ER diagram to PDF:', error);
      doc.text('Error rendering ER diagram', margin, yPos);
    }
  }

  // Component Descriptions
  if (data.uml?.descriptions && Object.keys(data.uml.descriptions).length > 0) {
    doc.addPage();
    yPos = margin;
    addText('Component Descriptions', 16, true);
    yPos += 10;

    Object.entries(data.uml.descriptions).forEach(([name, description]) => {
      checkPageBreak(30);
      addText(name, 12, true);
      yPos += 2;
      addText(description, 10);
      yPos += 5;
    });
  }

  // Quiz
  if (data.quiz && data.quiz.length > 0) {
    doc.addPage();
    yPos = margin;
    addText('Quiz', 16, true);
    yPos += 10;

    data.quiz.forEach((q, i) => {
      checkPageBreak(40);
      addText(`Question ${i + 1}: ${q.question}`, 11, true);
      yPos += 3;

      q.options.forEach((opt, j) => {
        const marker = j === q.correctAnswer ? '✓' : ' ';
        doc.text(`  ${j + 1}. [${marker}] ${opt}`, margin, yPos);
        yPos += 6;
      });

      if (q.explanation) {
        yPos += 2;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 10);
        expLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
        doc.setTextColor(0, 0, 0);
      }

      yPos += 5;
    });
  }

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `${sanitizeFilename(data.repository.name)}-analysis-${getDateString()}.pdf`;
  doc.save(filename);
}

/**
 * Sanitize filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Get current date as string in YYYY-MM-DD format
 */
function getDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Made with Bob
