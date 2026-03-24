export const env = {
  NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
  STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
};

export function validateEnv() {
  const missing = [];
  if (!env.NEXT_PUBLIC_STREAM_API_KEY) missing.push('NEXT_PUBLIC_STREAM_API_KEY');
  if (!env.STREAM_SECRET_KEY) missing.push('STREAM_SECRET_KEY');
  
  return {
    isValid: missing.length === 0,
    missing
  };
}
