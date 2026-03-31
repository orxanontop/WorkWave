import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { validateBody, rateLimit, getClientIp, apiSuccess, apiError } from '@/lib/api';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip, 10, 15 * 60 * 1000)) {
    return apiError('Too many requests. Please try again later.', 429);
  }

  const { data, error } = await validateBody(registerSchema)(req);
  if (error || !data) return error!;

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    return apiError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role,
      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    },
    include: { profile: true },
  });

  return apiSuccess(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: `${user.profile!.firstName} ${user.profile!.lastName}`,
    },
    201
  );
}
