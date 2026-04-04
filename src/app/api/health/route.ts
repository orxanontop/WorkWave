import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRedis } from '@/lib/rate-limit';

export async function GET() {
  const health: Record<string, { status: string; latencyMs?: number; error?: string }> = {};
  let overallOk = true;

  // Database check
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    health.database = { status: 'healthy', latencyMs: latency };
  } catch (err: unknown) {
    overallOk = false;
    health.database = {
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }

  // Redis check
  try {
    const redis = getRedis();
    if (!redis) {
      health.redis = { status: 'disabled', error: 'Redis not configured' };
    } else {
      const start = Date.now();
      await redis.ping();
      const latency = Date.now() - start;
      health.redis = { status: 'healthy', latencyMs: latency };
    }
  } catch (err: unknown) {
    health.redis = {
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown Redis error',
    };
  }

  // Basic metadata
  health.uptime = {
    status: 'ok',
    latencyMs: Math.round(process.uptime()),
  };

  return NextResponse.json(
    {
      status: overallOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      ...health,
    },
    { status: overallOk ? 200 : 503 }
  );
}
