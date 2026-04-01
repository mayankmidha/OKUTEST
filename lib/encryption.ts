import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// In production, this should be stored securely in .env
// We use a fallback strictly for development/testing, but it should fail in prod without a real key
const ENCRYPTION_KEY = process.env.EHR_ENCRYPTION_KEY || '6ff7ca74bc326f3ddd6de6d8311a4ea37a11e7f9ce8c8a3831a3f165b69aa66a'; 

if (process.env.NODE_ENV === 'production' && !process.env.EHR_ENCRYPTION_KEY) {
  console.error("⚠️ [CRITICAL] EHR_ENCRYPTION_KEY is missing in production. Clinical data encryption will use a fallback key, which is highly insecure!");
}

export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, iv, key);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text; // Not encrypted or malformed
  
  try {
    const [ivHex, authTagHex, encryptedHex] = text.split(':');
    
    if (!ivHex || !authTagHex || !encryptedHex) return text;

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, iv, key);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed", error);
    // If decryption fails, return original (might be unencrypted legacy data)
    return text;
  }
}
