import { NextRequest } from 'next/server';
import { hash } from '@node-rs/bcrypt';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { validateBody, rateLimit, apiResponse, apiError } from '@/lib/api';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, 10, 15 * 60 * 1000);
  if (!rl.allowed) return rl.response!;

  const { data, error } = await validateBody(registerSchema)(req);
  if (error || !data) return error!;

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    return apiError('An account with this email already exists', 409, 'EMAIL_EXISTS');
  }

  const hashedPassword = await hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: { create: { firstName: data.firstName, lastName: data.lastName } },
      },
      include: { profile: true },
    });

    logger.info({ userId: user.id, email: user.email }, 'New user registered');
    return apiResponse(
      { id: user.id, email: user.email, role: user.role, name: `${user.profile!.firstName} ${user.profile!.lastName}` },
      201
    );
  } catch (err) {
    logger.error({ err, email: data.email }, 'Registration failed');
    return apiError('Registration failed. Please try again.', 500, 'INTERNAL_ERROR');
  }
}
