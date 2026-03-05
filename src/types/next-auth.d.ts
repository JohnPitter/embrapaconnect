import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "FARMER" | "ADMIN";
      avatarConfig: unknown;
    };
  }

  interface User {
    role: "FARMER" | "ADMIN";
    avatarConfig: unknown;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    avatarConfig: unknown;
  }
}
