import { LRUCache } from 'lru-cache'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

// Fallback LRU Cache if Upstash is not configured
const fallbackCache = new LRUCache({
  max: 500,
  ttl: 60000,
})

export default function rateLimit(options?: Options) {
  let upstashRatelimit: Ratelimit | null = null;
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
      upstashRatelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(options?.uniqueTokenPerInterval || 10, `${(options?.interval || 60000) / 1000} s`),
      })
    } catch (error) {
      console.warn("Failed to initialize Upstash Redis Rate Limiter, falling back to in-memory LRU Cache", error)
    }
  } else {
     console.warn("⚠️ UPSTASH_REDIS credentials missing. Using in-memory rate limit (Unsafe for serverless)")
  }

  return {
    check: async (limit: number, token: string) => {
      if (upstashRatelimit) {
        // Use Upstash
        const { success, limit: upstashLimit, remaining } = await upstashRatelimit.limit(token)
        return {
          isRateLimited: !success,
          currentUsage: upstashLimit - remaining,
          limit: upstashLimit
        }
      } else {
        // Fallback to in-memory
        const tokenCount = (fallbackCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          fallbackCache.set(token, [1])
        } else {
          tokenCount[0] += 1
          fallbackCache.set(token, tokenCount)
        }

        const isRateLimited = tokenCount[0] > limit
        return {
          isRateLimited,
          currentUsage: tokenCount[0],
          limit
        }
      }
    },
  }
}
