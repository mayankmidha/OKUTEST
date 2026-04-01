import { PrismaClient } from '@prisma/client'
import { encrypt, decrypt } from './encryption'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const basePrisma = globalForPrisma.prisma ?? new PrismaClient()

export const prisma = basePrisma.$extends({
  query: {
    soapNote: {
      async create({ args, query }) {
        if (args.data?.subjective && typeof args.data.subjective === 'string') args.data.subjective = encrypt(args.data.subjective);
        if (args.data?.objective && typeof args.data.objective === 'string') args.data.objective = encrypt(args.data.objective);
        if (args.data?.assessment && typeof args.data.assessment === 'string') args.data.assessment = encrypt(args.data.assessment);
        if (args.data?.plan && typeof args.data.plan === 'string') args.data.plan = encrypt(args.data.plan);
        const result = await query(args);
        if (result?.subjective) result.subjective = decrypt(result.subjective);
        if (result?.objective) result.objective = decrypt(result.objective);
        if (result?.assessment) result.assessment = decrypt(result.assessment);
        if (result?.plan) result.plan = decrypt(result.plan);
        return result;
      },
      async update({ args, query }) {
        if (args.data?.subjective && typeof args.data.subjective === 'string') args.data.subjective = encrypt(args.data.subjective);
        if (args.data?.objective && typeof args.data.objective === 'string') args.data.objective = encrypt(args.data.objective);
        if (args.data?.assessment && typeof args.data.assessment === 'string') args.data.assessment = encrypt(args.data.assessment);
        if (args.data?.plan && typeof args.data.plan === 'string') args.data.plan = encrypt(args.data.plan);
        const result = await query(args);
        if (result?.subjective) result.subjective = decrypt(result.subjective);
        if (result?.objective) result.objective = decrypt(result.objective);
        if (result?.assessment) result.assessment = decrypt(result.assessment);
        if (result?.plan) result.plan = decrypt(result.plan);
        return result;
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        if (result?.subjective) result.subjective = decrypt(result.subjective);
        if (result?.objective) result.objective = decrypt(result.objective);
        if (result?.assessment) result.assessment = decrypt(result.assessment);
        if (result?.plan) result.plan = decrypt(result.plan);
        return result;
      },
      async findFirst({ args, query }) {
        const result = await query(args);
        if (result?.subjective) result.subjective = decrypt(result.subjective);
        if (result?.objective) result.objective = decrypt(result.objective);
        if (result?.assessment) result.assessment = decrypt(result.assessment);
        if (result?.plan) result.plan = decrypt(result.plan);
        return result;
      },
      async findMany({ args, query }) {
        const results = await query(args);
        return results.map(r => ({
          ...r,
          subjective: r.subjective ? decrypt(r.subjective) : r.subjective,
          objective: r.objective ? decrypt(r.objective) : r.objective,
          assessment: r.assessment ? decrypt(r.assessment) : r.assessment,
          plan: r.plan ? decrypt(r.plan) : r.plan,
        }));
      },
    },
    transcript: {
      async create({ args, query }) {
        if (args.data?.content) {
          args.data.content = encrypt(args.data.content);
        }
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async update({ args, query }) {
        if (args.data?.content && typeof args.data.content === 'string') {
          args.data.content = encrypt(args.data.content);
        }
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findFirst({ args, query }) {
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findMany({ args, query }) {
        const results = await query(args);
        return results.map(r => ({
          ...r,
          content: r.content ? decrypt(r.content) : r.content
        }));
      },
    },
    brainDumpEntry: {
      async create({ args, query }) {
        if (args.data?.content) {
          args.data.content = encrypt(args.data.content);
        }
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async update({ args, query }) {
        if (args.data?.content && typeof args.data.content === 'string') {
          args.data.content = encrypt(args.data.content);
        }
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findFirst({ args, query }) {
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async findMany({ args, query }) {
        const results = await query(args);
        return results.map(r => ({
          ...r,
          content: r.content ? decrypt(r.content) : r.content
        }));
      },
    },
  }
}) as PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma
