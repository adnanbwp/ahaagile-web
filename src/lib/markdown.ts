import fs from 'fs';
import path from 'path';

export interface MarkdownContent {
  content: string;
}

export interface MarkdownRenderOptions {
  mapConsultationLinks?: boolean;
}

/**
 * Read markdown file from the content directory
 */
export async function getMarkdownContent(filename: string): Promise<MarkdownContent> {
  const contentDir = path.join(process.cwd(), 'content');
  const filePath = path.join(contentDir, filename);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { content };
  } catch (error) {
    throw new Error(`Failed to read markdown file: ${filename}`);
  }
}

/**
 * Transform markdown content by mapping consultation anchor links to booking route
 */
export function transformMarkdownLinks(content: string): string {
  // Map #consultation anchor links to /book-a-consultation route
  return content.replace(/\]\(#consultation\)/g, '](/book-a-consultation)');
}