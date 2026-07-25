export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
} as const;

if (!env.apiUrl && typeof window === 'undefined') {
  console.warn(
    'NEXT_PUBLIC_API_URL is not set. API requests will fail until it is configured.'
  );
}
