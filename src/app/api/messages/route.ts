import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, requireAuth, getPagination, paginationMeta } from '@/lib/api';
import { messageSchema } from '@/lib/validations';
import { sanitizeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  const { page, perPage, skip } = getPagination(req.nextUrl.searchParams);
  const conversationWith = req.nextUrl.searchParams.get('with');

  if (conversationWith) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user!.id as string, receiverId: conversationWith },
          { senderId: conversationWith, receiverId: user!.id as string },
        ],
      },
      orderBy: { createdAt: 'asc' },
      skip, take: perPage,
      include: {
        sender: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    await prisma.message.updateMany({
      where: {
        senderId: conversationWith,
        receiverId: user!.id as string,
        isRead: false,
      },
      data: { isRead: true, readAt: new Date(), status: 'READ' },
    });

    return apiResponse({ messages });
  }

  const conversations = (await prisma.$queryRaw`
    SELECT DISTINCT ON (partner_id) * FROM (
      SELECT
        CASE WHEN "senderId" = ${user!.id} THEN "receiverId" ELSE "senderId" END as partner_id,
        "content" as last_message,
        "createdAt" as last_message_at,
        "isRead",
        "senderId" = ${user!.id} as is_sender
      FROM "Message"
      WHERE "senderId" = ${user!.id} OR "receiverId" = ${user!.id}
      ORDER BY "createdAt" DESC
    ) sub
    ORDER BY partner_id, last_message_at DESC
  `) as any[];

  const partnerIds = conversations.map((c: any) => c.partner_id);
  const partners = await prisma.user.findMany({
    where: { id: { in: partnerIds } },
    select: { id: true, profile: { select: { firstName: true, lastName: true } }, role: true },
  });

  const result = conversations.map((conv: any) => ({
    ...conv,
    partner: partners.find((p: any) => p.id === conv.partner_id),
  }));

  return apiResponse({ conversations: result });
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return error;

  if (user!.subscriptionStatus !== 'ACTIVE' && user!.role !== 'EMPLOYER' && user!.role !== 'ADMIN') {
    return apiError('Premium subscription required for direct messaging', 403, 'PREMIUM_REQUIRED');
  }

  const body = await req.json();
  const validation = messageSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { receiverId, content } = validation.data;
  if (receiverId === user!.id) return apiError('Cannot send message to yourself', 400, 'VALIDATION_ERROR');

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) return apiError('Recipient not found', 404, 'NOT_FOUND');

  try {
    const message = await prisma.message.create({
      data: {
        senderId: user!.id as string,
        receiverId,
        content: sanitizeHtml(content),
      },
      include: { sender: { select: { id: true, profile: { select: { firstName: true, lastName: true } } } } },
    });

    await prisma.notification.create({
      data: {
        userId: receiverId, title: 'New Message', message: 'You received a new message',
        type: 'MESSAGE', link: `/messages?with=${user!.id}`,
      },
    });

    logger.info({ messageId: message.id, senderId: user!.id, receiverId }, 'Message sent');
    return apiResponse(message, 201);
  } catch (err) {
    logger.error({ err, senderId: user!.id, receiverId }, 'Failed to send message');
    return apiError('Failed to send message', 500, 'INTERNAL_ERROR');
  }
}
