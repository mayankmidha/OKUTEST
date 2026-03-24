import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const blogPosts = [
  {
    title: "Navigating Adult ADHD: Beyond the Stereotypes",
    category: "ADHD",
    excerpt: "Understanding how ADHD manifests in adulthood and practical strategies for focus and self-compassion.",
    content: `
# Navigating Adult ADHD: Beyond the Stereotypes

ADHD is often misunderstood as a childhood condition characterized only by hyperactivity. However, for millions of adults, ADHD is a daily reality that affects executive function, emotional regulation, and self-esteem.

## The Hidden Face of Adult ADHD
In adults, hyperactivity often transforms into internal restlessness or 'racing thoughts.' Common symptoms include:
- **Executive Dysfunction:** Difficulty starting tasks, prioritizing, or managing time.
- **Hyperfocus:** Becoming so absorbed in an interesting task that you lose track of time and surroundings.
- **Emotional Dysregulation:** Feeling emotions more intensely than others.

## Strategies for the Neurodivergent Mind
1. **Body Doubling:** Working alongside someone else to stay on task.
2. **Paced Systems:** Breaking large goals into 'micro-tasks' that feel achievable.
3. **Radical Acceptance:** Understanding that your brain works differently, not incorrectly.

At Oku, we offer specialized neuro-affirming care to help you navigate your unique cognitive landscape.
    `
  },
  {
    title: "The Anatomy of Anxiety: Listening to Your Body's Alarm",
    category: "Anxiety",
    excerpt: "Why anxiety isn't just in your head, and how to work with your nervous system to find peace.",
    content: `
# The Anatomy of Anxiety: Listening to Your Body's Alarm

Anxiety is more than just 'worrying.' It is a physiological response designed to keep us safe, but in the modern world, this alarm system can become overactive.

## Understanding the Physicality
When you feel anxious, your sympathetic nervous system is in the driver's seat. You might experience:
- Shallow breathing or chest tightness.
- A racing heart.
- Muscle tension, particularly in the jaw and shoulders.

## From Resistance to Relationship
Instead of trying to 'stop' anxiety, we can learn to relate to it differently. Somatic practices like grounding and paced breathing can signal to the brain that the current environment is safe.

Healing involves moving from a state of constant 'alert' back into a state of 'rest and digest.'
    `
  },
  {
    title: "Why 'Slow Healing' is the Future of Mental Health",
    category: "Clinical Depth",
    excerpt: "In a world of quick fixes, we explore why lasting psychological change requires time, space, and relationship.",
    content: `
# Why 'Slow Healing' is the Future of Mental Health

We live in a culture of 'hacks' and 'quick fixes.' But the human psyche does not follow a linear, optimized path. True healing is a slow, organic process.

## The Problem with the Quick Fix
Symptom management is important, but it often leaves the underlying patterns untouched. When we rush the process, we miss the opportunity for deep integration.

## The Oku Philosophy
At Oku, we prioritize depth over speed. We believe that:
- Relationship is the primary tool for healing.
- Silence and space are as important as dialogue.
- Change happens when the nervous system feels safe enough to unfold.

Take your time. There is no finish line in the journey toward yourself.
    `
  },
  {
    title: "Understanding Generational Trauma",
    category: "Mental Health",
    excerpt: "How the stories and silences of our ancestors live on in our bodies today.",
    content: `
# Understanding Generational Trauma

Trauma is not just what happens to us; it is also what happened to those who came before us. Recent research in epigenetics shows that stress responses can be passed down through generations.

## The Language of Silence
Often, generational trauma manifests as 'unspoken rules' or pervasive moods within a family. It might look like:
- Chronic hyper-vigilance.
- Difficulty with trust or intimacy.
- A sense of 'waiting for the other shoe to drop.'

## Breaking the Cycle
The first step in healing generational trauma is naming it. By bringing these inherited patterns into the light of the therapeutic relationship, we can begin to differentiate our own story from the stories of our ancestors.
    `
  },
  {
    title: "Mindfulness: Beyond the Trend",
    category: "Mindfulness",
    excerpt: "Reclaiming mindfulness as a tool for radical presence and self-awareness.",
    content: `
# Mindfulness: Beyond the Trend

Mindfulness has become a buzzword, often reduced to 'relaxation.' But its true power lies in its ability to cultivate a radical kind of presence.

## The Power of Noticing
Mindfulness is simply the act of noticing what is happening right now, without judgment. This includes:
- Noticing the texture of your breath.
- Noticing the rise and fall of thoughts.
- Noticing the physical sensations of emotion.

## Cultivating the Observer
When we practice mindfulness, we create a small gap between stimulus and response. In that gap lies our freedom to choose how we want to move through the world.
    `
  },
  {
    title: "Queer Affirmative Therapy: Why it Matters",
    category: "Mental Health",
    excerpt: "Why specialized, identity-affirming care is essential for the LGBTQ+ community.",
    content: `
# Queer Affirmative Therapy: Why it Matters

For many in the LGBTQ+ community, traditional therapy has been a site of pathologization or erasure. Queer affirmative therapy is a corrective to that history.

## More Than Just 'Tolerance'
Affirmative care goes beyond simply accepting a client's identity. It involves:
- Understanding the impact of minority stress.
- Validating the unique experiences of queer and trans individuals.
- Acknowledging the intersections of identity and mental health.

Safety is not the absence of judgment; it is the presence of active understanding.
    `
  },
  {
    title: "The Importance of Body-Awareness in Therapy",
    category: "Mindfulness",
    excerpt: "Why talking isn't always enough, and how somatic work can unlock deeper healing.",
    content: `
# The Importance of Body-Awareness in Therapy

The body keeps the score. Often, our most profound experiences are stored in our tissues and nervous systems, rather than our words.

## The Limits of Logic
You can know why you feel a certain way and still feel stuck. This is because the emotional centers of the brain are deeply connected to the body.

## Listening to the Body
By bringing attention to physical sensations—tightness, warmth, tingling—we can access 'bottom-up' healing that complements 'top-down' cognitive work.
    `
  },
  {
    title: "Social Media and Mental Health: Setting Boundaries",
    category: "Anxiety",
    excerpt: "Practical tips for maintaining your peace in a digital-first world.",
    content: `
# Social Media and Mental Health: Setting Boundaries

The digital world is designed to keep us engaged, often at the cost of our mental well-being. Constant comparison and information overload can fuel anxiety and depression.

## Digital Hygiene
1. **Curate Your Feed:** Unfollow accounts that make you feel 'less than.'
2. **Scheduled Disconnection:** Set specific times each day to be screen-free.
3. **Physical Distance:** Keep your phone in another room during sleep or focus time.

Your attention is your most precious resource. Guard it.
    `
  },
  {
    title: "Coping with Grief: A Non-Linear Path",
    category: "Mental Health",
    excerpt: "Moving away from 'stages' and toward a compassionate integration of loss.",
    content: `
# Coping with Grief: A Non-Linear Path

Grief is not a problem to be solved or a process to be completed. It is a deep, human response to the loss of something or someone we love.

## Beyond the Stages
The 'stages of grief' were never meant to be a linear checklist. Grief often moves in waves, appearing when we least expect it.

## Making Room for the Loss
Healing doesn't mean 'getting over it.' It means learning to carry the loss with more ease, integrating it into the fabric of who you are.
    `
  },
  {
    title: "The Myth of Productivity and Self-Worth",
    category: "Clinical Depth",
    excerpt: "Unlinking your value as a human from your output and achievements.",
    content: `
# The Myth of Productivity and Self-Worth

In a performance-driven society, we are often taught that our value is equal to our output. This leads to burnout and a persistent sense of inadequacy.

## Rest as Resistance
Reclaiming rest is a radical act. It is the acknowledgement that you are worthy of care and ease simply because you exist.

## Valuing Being Over Doing
Therapy can help you explore where these 'productivity scripts' came from and help you build a new relationship with yourself—one based on inherent worth rather than achievement.
    `
  }
]

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    console.error('No Admin user found to author the blogs. Seed users first.')
    return
  }

  console.log('Seeding 10 mental health blog posts...')

  for (const post of blogPosts) {
    const slug = post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    
    await prisma.post.upsert({
      where: { slug },
      update: {
        ...post,
        authorId: admin.id,
        published: true
      },
      create: {
        ...post,
        slug,
        authorId: admin.id,
        published: true
      }
    })
  }

  console.log('Successfully seeded 10 SEO-optimized blog posts!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
