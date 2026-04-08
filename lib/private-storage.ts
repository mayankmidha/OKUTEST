import { mkdir, appendFile, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const STORAGE_ROOT = path.join(process.cwd(), '.private_uploads')

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'file'
}

function ensureInsideStorageRoot(targetPath: string) {
  const normalizedRoot = path.resolve(STORAGE_ROOT)
  const normalizedTarget = path.resolve(targetPath)

  if (!normalizedTarget.startsWith(normalizedRoot)) {
    throw new Error('Invalid storage path')
  }

  return normalizedTarget
}

export async function savePrivateFile(options: {
  file: File
  scope: string
  preferredName?: string | null
}) {
  const extension = path.extname(options.file.name || options.preferredName || '').toLowerCase()
  const baseName = sanitizeSegment(
    path.basename(options.preferredName || options.file.name || 'upload', extension)
  )
  const scope = sanitizeSegment(options.scope)
  const fileName = `${baseName}-${randomUUID()}${extension}`
  const storageKey = path.posix.join(scope, fileName)
  const absolutePath = ensureInsideStorageRoot(path.join(STORAGE_ROOT, storageKey))

  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, Buffer.from(await options.file.arrayBuffer()))

  return {
    storageKey,
    absolutePath,
    originalName: options.file.name,
    size: options.file.size,
  }
}

export async function readPrivateFile(storageKey: string) {
  const absolutePath = ensureInsideStorageRoot(path.join(STORAGE_ROOT, storageKey))
  return readFile(absolutePath)
}

export function inferMimeType(fileName: string) {
  const extension = path.extname(fileName).toLowerCase()

  switch (extension) {
    case '.pdf':
      return 'application/pdf'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    case '.txt':
      return 'text/plain; charset=utf-8'
    case '.doc':
      return 'application/msword'
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    default:
      return 'application/octet-stream'
  }
}

export async function appendPrivateInboxRecord(fileName: string, payload: Record<string, unknown>) {
  const inboxDir = path.join(STORAGE_ROOT, 'inbox')
  const targetPath = ensureInsideStorageRoot(path.join(inboxDir, sanitizeSegment(fileName)))

  await mkdir(path.dirname(targetPath), { recursive: true })
  await appendFile(targetPath, `${JSON.stringify(payload)}\n`, 'utf8')
}
