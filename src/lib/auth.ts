import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { hash, verify } from '@node-rs/bcrypt';
import prisma, { basePrismaClient as prismaForAdapter } from './prisma';
import { logger } from './logger';

export { hash };

export async function hashPassword(password: string, cost: number = 10): Promise<string> {
  return hash(password, cost);
}

export async function verifyPassword(password: string, hashVal: string): Promise<boolean> {
  return verify(password, hashVal);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaForAdapter) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { profile: true },
        });
        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }
        if (!user.isActive) {
          throw new Error('Account is deactivated');
        }
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        return {
          id: user.id,
          email: user.email,
          name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : null,
          role: user.role,
          image: user.image,
          subscriptionStatus: user.subscriptionStatus,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.subscriptionStatus = (user as any).subscriptionStatus;
      }
      if (trigger === 'update' && session) {
        token.subscriptionStatus = session.subscriptionStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },
  pages: { signIn: '/auth/login', error: '/auth/error' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    signOut: async ({ token }) => {
      logger.info({ userId: (token as any)?.id }, 'User signed out');
    },
    createUser: async ({ user }) => {
      logger.info({ userId: user.id }, 'New user created');
    },
  },
};
