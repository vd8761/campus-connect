import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    universityId?: string | null;
  }

  interface Session {
    user: User & {
      role?: string;
      universityId?: string | null;
    };
  }
}
