import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!admin || !admin.passwordHash) {
          throw new Error('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, admin.passwordHash);

        if (!passwordMatch) {
          throw new Error('Invalid credentials');
        }

        // Only allow UNIVERSITY_REP role to login here
        // (You can remove this check if you want ADMIN to use next-auth as well)
        if (admin.role !== 'UNIVERSITY_REP') {
          throw new Error('Access denied. Please use the Admin login.');
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          universityId: admin.universityId
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.universityId = user.universityId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.universityId = token.universityId as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/university/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
};
