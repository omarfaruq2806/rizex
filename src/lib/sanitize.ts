import DOMPurify from 'dompurify';

/**
 * Clean & sanitize user-supplied HTML content to prevent Cross-Site Scripting (XSS) attacks.
 * 
 * Usage example for Junior Developers:
 * ```tsx
 * import { sanitizeHtml } from '@/lib/sanitize';
 * 
 * export function RichTextViewer({ dirtyHtml }: { dirtyHtml: string }) {
 *   const cleanHtml = sanitizeHtml(dirtyHtml);
 *   return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
 * }
 * ```
 * 
 * @param dirtyHtml - Raw HTML string potentially containing malicious scripts
 * @returns Safe, sanitized HTML string
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  // If running on server side (SSR), safely return cleaned fallback or execute DOMPurify in browser
  if (typeof window === 'undefined') {
    // Basic server-side escape if window is not defined
    return dirtyHtml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'br',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'code',
      'pre',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
  });
}

/**
 * Sanitize plain text string by stripping all HTML tags completely.
 * 
 * @param dirtyText - String that might contain HTML tags
 * @returns Clean plain text string with no HTML markup
 */
export function sanitizeText(dirtyText: string): string {
  if (!dirtyText || typeof dirtyText !== 'string') {
    return '';
  }

  if (typeof window === 'undefined') {
    return dirtyText.replace(/<[^>]*>?/gm, '');
  }

  return DOMPurify.sanitize(dirtyText, { ALLOWED_TAGS: [] });
}
