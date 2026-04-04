import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'b', 'i', 's', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'rel', 'target', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/)/i,
    ADD_ATTR: ['rel'],
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'img', 'video', 'audio'],
  });
}

export function sanitizePlainText(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeStringArray(items: string[]): string[] {
  return items.map(sanitizePlainText).filter(Boolean);
}
