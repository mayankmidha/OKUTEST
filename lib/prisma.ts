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
    message: {
      async create({ args, query }) {
        if (args.data?.content && typeof args.data.content === 'string') args.data.content = encrypt(args.data.content);
        const result = await query(args);
        if (result?.content) result.content = decrypt(result.content);
        return result;
      },
      async update({ args, query }) {
        if (args.data?.content && typeof args.data.content === 'string') args.data.content = encrypt(args.data.content);
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
    treatmentPlan: {
      async create({ args, query }) {
        if (args.data?.presentingProblem) args.data.presentingProblem = encrypt(args.data.presentingProblem);
        if (args.data?.goals) args.data.goals = encrypt(args.data.goals);
        if (args.data?.objectives) args.data.objectives = encrypt(args.data.objectives);
        if (args.data?.interventions) args.data.interventions = encrypt(args.data.interventions);
        const result = await query(args);
        return result; // Decryption handled in find methods
      },
      async update({ args, query }) {
        if (args.data?.presentingProblem && typeof args.data.presentingProblem === 'string') args.data.presentingProblem = encrypt(args.data.presentingProblem);
        if (args.data?.goals && typeof args.data.goals === 'string') args.data.goals = encrypt(args.data.goals);
        if (args.data?.objectives && typeof args.data.objectives === 'string') args.data.objectives = encrypt(args.data.objectives);
        if (args.data?.interventions && typeof args.data.interventions === 'string') args.data.interventions = encrypt(args.data.interventions);
        const result = await query(args);
        return result;
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        if (result) {
          if (result.presentingProblem) result.presentingProblem = decrypt(result.presentingProblem);
          if (result.goals) result.goals = decrypt(result.goals);
          if (result.objectives) result.objectives = decrypt(result.objectives);
          if (result.interventions) result.interventions = decrypt(result.interventions);
        }
        return result;
      },
      async findMany({ args, query }) {
        const results = await query(args);
        return results.map(r => ({
          ...r,
          presentingProblem: r.presentingProblem ? decrypt(r.presentingProblem) : r.presentingProblem,
          goals: r.goals ? decrypt(r.goals) : r.goals,
          objectives: r.objectives ? decrypt(r.objectives) : r.objectives,
          interventions: r.interventions ? decrypt(r.interventions) : r.interventions,
        }));
      },
    },
  }
}) as PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma
