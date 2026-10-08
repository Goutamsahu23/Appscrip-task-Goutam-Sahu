export function getSiteUrl(): string {
  const url = process.env.SITE_URL ?? 'http://localhost:3000';
  return url.replace(/\/$/, '');
}

export function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
