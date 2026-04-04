import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) {
    logger.warn('REDIS_URL not configured - rate limiting disabled');
    return null;
  }
  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
  });
  redis.on('error', (err) => {
    logger.error({ err }, 'Redis connection error');
  });
  return redis;
}

export async function checkRateLimit(
  key: string,
  limit: number = 100,
  windowSeconds: number = 15 * 60
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const client = getRedis();
  if (!client) {
    return { allowed: true, remaining: limit, resetAt: Date.now() };
  }
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const redisKey = `rl:${key}`;
  try {
    const pipeline = client.pipeline();
    pipeline.zremrangebyscore(redisKey, 0, windowStart);
    pipeline.zcard(redisKey);
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);
    pipeline.expire(redisKey, windowSeconds);
    const results = (await pipeline.exec()) || [];
    const [, , [, countResult]] = results;
    const count = (countResult as number) || 0;
    const currentCount = count + 1;
    if (currentCount > limit) {
      await client.zrem(redisKey, `${now}-${Math.random()}`);
      const oldest = await client.zrange(redisKey, 0, 0, 'WITHSCORES');
      const resetAt = oldest.length >= 2
        ? parseInt(oldest[1]) + windowSeconds * 1000
        : now + windowSeconds * 1000;
      return { allowed: false, remaining: 0, resetAt };
    }
    return {
      allowed: true,
      remaining: limit - currentCount,
      resetAt: now + windowSeconds * 1000,
    };
  } catch (err) {
    logger.error({ err, key }, 'Redis rate limit check failed');
    return { allowed: true, remaining: limit, resetAt: Date.now() };
  }
}
