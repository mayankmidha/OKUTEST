import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CheckCircle2, Circle, ClipboardList, ArrowLeft, Plus, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function addTask(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user?.id) return

  const title = formData.get('title') as string
  if (!title?.trim()) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const count = await prisma.task.count({
    where: {
      userId: session.user.id,
      parentId: null,
      createdAt: { gte: today, lt: tomorrow },
    },
  })

  if (count >= 3) return

  await prisma.task.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
    },
  })

  revalidatePath('/dashboard/client/adhd/tasks')
}

async function toggleTask(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user?.id) return

  const id = formData.get('id') as string
  const current = formData.get('isCompleted') === 'true'

  await prisma.task.update({
    where: { id, userId: session.user.id },
    data: { isCompleted: !current },
  })

  revalidatePath('/dashboard/client/adhd/tasks')
}

export default async function AdhdTasksPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  // ADHD Manager gate — practitioner must confirm diagnosis
  const gateUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientProfile: { select: { adhdDiagnosed: true } } },
  })
  if (!gateUser?.clientProfile?.adhdDiagnosed) redirect('/dashboard/client')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayTasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      parentId: null,
      createdAt: { gte: today, lt: tomorrow },
    },
    orderBy: { createdAt: 'asc' },
  })

  const atLimit = todayTasks.length >= 3
  const completed = todayTasks.filter((t) => t.isCompleted).length

  return (
    <div className="py-12 px-6 lg:px-12 max-w-3xl mx-auto min-h-screen bg-oku-lavender/5">
      {/* Back */}
      <Link
        href="/dashboard/client/adhd"
        className="inline-flex items-center gap-2 text-sm text-oku-darkgrey/50 hover:text-oku-purple-dark transition-colors mb-10"
      >
        <ArrowLeft size={16} /> Back to ADHD Hub
      </Link>

      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-oku-purple-dark/10 flex items-center justify-center">
            <ClipboardList size={24} className="text-oku-purple-dark" />
          </div>
          <span className="chip">Daily 3-Task Rule</span>
        </div>
        <h1 className="heading-display text-5xl text-oku-darkgrey tracking-tighter">
          Today&apos;s Three.
        </h1>
        <p className="text-oku-darkgrey/60 text-lg max-w-lg">
          ADHD brains thrive on constraints. Pick only{' '}
          <strong className="text-oku-purple-dark">3 tasks</strong> that truly
          matter today. Finish those — everything else is a bonus.
        </p>
      </div>

      {/* Progress */}
      <div className="card-glass-3d !p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-oku-darkgrey/40 mb-1">
            Today&apos;s Progress
          </p>
          <p className="text-3xl font-black text-oku-darkgrey">
            {completed}
            <span className="text-oku-darkgrey/30">/{todayTasks.length}</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => {
            const task = todayTasks[i]
            return (
              <div
                key={i}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  task?.isCompleted
                    ? 'bg-oku-mint border-oku-mint'
                    : task
                    ? 'border-oku-purple-dark/40 bg-oku-lavender/20'
                    : 'border-oku-darkgrey/10 bg-white/40'
                }`}
              >
                {task?.isCompleted ? (
                  <CheckCircle2 size={20} className="text-white" />
                ) : task ? (
                  <Circle size={20} className="text-oku-purple-dark/40" />
                ) : (
                  <span className="text-oku-darkgrey/20 text-xs font-bold">
                    {i + 1}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Task Form */}
      {atLimit ? (
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-oku-lavender/20 border border-oku-purple-dark/10 mb-8">
          <AlertCircle size={20} className="text-oku-purple-dark shrink-0" />
          <p className="text-sm text-oku-darkgrey/70">
            You&apos;ve set your 3 tasks for today. Stay focused — you can add
            more tomorrow.
          </p>
        </div>
      ) : (
        <form action={addTask} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              name="title"
              required
              placeholder={`Task ${todayTasks.length + 1} of 3…`}
              maxLength={120}
              className="flex-1 rounded-2xl border border-oku-darkgrey/10 bg-white/70 backdrop-blur px-5 py-4 text-oku-darkgrey placeholder:text-oku-darkgrey/30 focus:outline-none focus:ring-2 focus:ring-oku-purple-dark/30 text-sm"
            />
            <button
              type="submit"
              className="btn-pill-3d bg-oku-darkgrey border-oku-darkgrey text-white !px-6"
            >
              <Plus size={18} className="mr-2" /> Add
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      {todayTasks.length === 0 ? (
        <div className="text-center py-20 text-oku-darkgrey/30">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No tasks yet</p>
          <p className="text-sm mt-1">Add your first important task above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayTasks.map((task, idx) => (
            <div
              key={task.id}
              className={`card-glass-3d !p-6 flex items-center justify-between gap-4 transition-all ${
                task.isCompleted ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="w-8 h-8 rounded-full bg-oku-lavender/40 flex items-center justify-center text-xs font-black text-oku-purple-dark shrink-0">
                  {idx + 1}
                </span>
                <p
                  className={`text-oku-darkgrey font-medium truncate ${
                    task.isCompleted ? 'line-through text-oku-darkgrey/40' : ''
                  }`}
                >
                  {task.title}
                </p>
              </div>
              <form action={toggleTask}>
                <input type="hidden" name="id" value={task.id} />
                <input
                  type="hidden"
                  name="isCompleted"
                  value={String(task.isCompleted)}
                />
                <button
                  type="submit"
                  className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.isCompleted
                      ? 'bg-oku-mint border-oku-mint text-white'
                      : 'border-oku-purple-dark/30 hover:border-oku-purple-dark hover:bg-oku-lavender/20'
                  }`}
                  title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.isCompleted ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} className="text-oku-purple-dark/40" />
                  )}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
