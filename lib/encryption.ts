import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const DEVELOPMENT_FALLBACK_KEY =
  '6ff7ca74bc326f3ddd6de6d8311a4ea37a11e7f9ce8c8a3831a3f165b69aa66a'

function getEncryptionKey() {
  if (process.env.EHR_ENCRYPTION_KEY) {
    return Buffer.from(process.env.EHR_ENCRYPTION_KEY, 'hex')
  }

  if (process.env.NODE_ENV !== 'production') {
    return Buffer.from(DEVELOPMENT_FALLBACK_KEY, 'hex')
  }

  throw new Error('EHR_ENCRYPTION_KEY is required for clinical data encryption in production.')
}

export function encrypt(text: string): string {
  if (!text) return text

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')

  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text

  try {
    const [ivHex, authTagHex, encryptedHex] = text.split(':')

    if (!ivHex || !authTagHex || !encryptedHex) return text

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv)

    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption failed', error)
    return text
  }
}
