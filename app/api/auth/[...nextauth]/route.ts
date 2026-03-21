import { handlers } from "@/auth"
export const { GET, POST } = handlers
export const runtime = "nodejs" // Prisma and Bcrypt require Node.js runtime, not Edge
