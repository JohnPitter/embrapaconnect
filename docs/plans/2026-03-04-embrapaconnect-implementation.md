# EmbrapaConnect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construir a plataforma web EmbrapaConnect do zero até E2E tests com Docker — conectando fazendeiros à Embrapa com visualização 3D, avatar customizável, mapa geográfico e chat em tempo real.

**Architecture:** Next.js 14 App Router + Prisma + PostgreSQL. Monorepo único com custom server Node.js para Socket.io. React Three Fiber para 3D (fazenda e avatar). Mapbox GL para mapa geográfico. NextAuth.js com Credentials para autenticação.

**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, NextAuth.js, React Three Fiber, @react-three/drei, Mapbox GL, Socket.io, Tailwind CSS, Resend, Playwright (E2E)

**Repo:** https://github.com/JohnPitter/embrapaconnect
**Dir local:** C:\Users\joaop\Desenvolvimento\Projects\embrapaconnect

---

## Contexto do Design System

Baseado em `docs/plans/2026-03-04-embrapaconnect-design.md`. Paleta:
- `darkBase: #1A1F0F` — navbar, sidebar, hero, footer
- `darkGreen: #1E2A14` — cards em fundo escuro, sections alternadas
- `limeAccent: #C6E832` — CTAs, acento em palavras do headline, pins no mapa
- `offWhite: #F0F4E8` — background de pages do dashboard
- `lightMuted: #C8D5B0` — texto secundário em fundo escuro
- Fontes: Space Grotesk (display, headings, stats) + Inter (body, labels)

---

## Task 1: Next.js 14 project scaffold + Prisma + PostgreSQL

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `prisma/schema.prisma`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/prisma.ts`
- Create: `.env.example`
- Create: `.env.local` (não commitado)
- Create: `pnpm-workspace.yaml` (se necessário)

**Step 1: Inicializar o projeto Next.js com pnpm**

```bash
cd C:\Users\joaop\Desenvolvimento\Projects\embrapaconnect
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Aceitar defaults. Isso cria a estrutura base do Next.js.

**Step 2: Instalar dependências core**

```bash
pnpm add prisma @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs zod lucide-react
pnpm add -D @types/bcryptjs @types/node typescript
```

**Step 3: Instalar fontes e UI**

```bash
pnpm add @next/font
```

**Step 4: Inicializar Prisma**

```bash
pnpm dlx prisma init --datasource-provider postgresql
```

**Step 5: Criar schema completo**

Substituir `prisma/schema.prisma` pelo schema completo:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  FARMER
  ADMIN
}

enum CropType {
  SOJA
  MILHO
  CAFE
  CANA
  ALGODAO
  TRIGO
  ARROZ
  FEIJAO
  MANDIOCA
  OUTRO
}

enum CropStage {
  PREPARO
  PLANTIO
  GERMINACAO
  CRESCIMENTO
  FLORACAO
  FRUTIFICACAO
  MATURACAO
  COLHEITA
}

enum MessageType {
  TEXT
  IMAGE
  ALERT
}

enum AlertCategory {
  INCENDIO
  PRAGA
  SECA
  OUTRO
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String
  name           String
  phone          String?
  role           Role      @default(FARMER)
  avatarConfig   Json?
  emailVerified  DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  farms                Farm[]
  chatMessages         ChatMessage[]
  chatRooms            ChatRoomParticipant[]
  passwordResetTokens  PasswordResetToken[]

  @@index([email])
  @@index([role])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([token])
  @@index([userId])
}

model Farm {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name              String
  description       String?
  state             String
  city              String
  address           String?
  latitude          Float
  longitude         Float
  totalAreaHectares Float
  boundaryCoords    Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  crops    Crop[]
  chatRoom ChatRoom?

  @@index([userId])
  @@index([state, city])
  @@index([latitude, longitude])
}

model Crop {
  id                 String    @id @default(cuid())
  farmId             String
  farm               Farm      @relation(fields: [farmId], references: [id], onDelete: Cascade)
  type               CropType
  customTypeName     String?
  areaHectares       Float
  plantedAt          DateTime
  estimatedHarvestAt DateTime
  currentStage       CropStage @default(PREPARO)
  stageUpdatedAt     DateTime  @default(now())
  growthData         Json
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  logs CropLog[]

  @@index([farmId])
  @@index([type])
  @@index([currentStage])
}

model CropLog {
  id         String    @id @default(cuid())
  cropId     String
  crop       Crop      @relation(fields: [cropId], references: [id], onDelete: Cascade)
  stage      CropStage
  percentage Float
  notes      String?
  photoUrl   String?
  loggedAt   DateTime  @default(now())

  @@index([cropId])
  @@index([loggedAt])
}

model ChatRoom {
  id        String   @id @default(cuid())
  farmId    String   @unique
  farm      Farm     @relation(fields: [farmId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  messages     ChatMessage[]
  participants ChatRoomParticipant[]

  @@index([farmId])
}

model ChatRoomParticipant {
  id       String   @id @default(cuid())
  roomId   String
  room     ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt DateTime @default(now())

  @@unique([roomId, userId])
  @@index([userId])
}

model ChatMessage {
  id            String         @id @default(cuid())
  roomId        String
  room          ChatRoom       @relation(fields: [roomId], references: [id], onDelete: Cascade)
  senderId      String
  sender        User           @relation(fields: [senderId], references: [id], onDelete: Cascade)
  content       String
  type          MessageType    @default(TEXT)
  alertCategory AlertCategory?
  imageUrl      String?
  readAt        DateTime?
  createdAt     DateTime       @default(now())

  @@index([roomId, createdAt])
  @@index([senderId])
}
```

**Step 6: Criar Prisma singleton**

`src/lib/prisma.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Step 7: Criar .env.example**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/embrapaconnect"
NEXTAUTH_SECRET="change-me-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
MAPBOX_ACCESS_TOKEN="pk.your-token-here"
RESEND_API_KEY="re_your-token-here"
ENCRYPTION_KEY="change-me-generate-with-openssl-rand-hex-32"
```

**Step 8: Configurar tailwind.config.ts com design tokens**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-base": "#1A1F0F",
        "dark-green": "#1E2A14",
        "mid-green": "#4A5C2E",
        "light-muted": "#C8D5B0",
        "off-white": "#F0F4E8",
        "lime-accent": "#C6E832",
        "tag-bg": "#2E3B1E",
        "tag-text": "#C8D5B0",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 9: Configurar globals.css com variáveis CSS**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-dark-base: #1A1F0F;
  --color-dark-green: #1E2A14;
  --color-mid-green: #4A5C2E;
  --color-light-muted: #C8D5B0;
  --color-off-white: #F0F4E8;
  --color-lime-accent: #C6E832;
  --color-white: #FFFFFF;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  --color-success: #22C55E;
  --color-tag-bg: #2E3B1E;
  --color-tag-text: #C8D5B0;
  --color-border-subtle: rgba(255, 255, 255, 0.1);
}
```

**Step 10: Configurar next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
```

**Step 11: Criar root layout com fontes**

`src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "EmbrapaConnect",
  description: "Plataforma digital que conecta produtores rurais à Embrapa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 12: Aplicar migration inicial**

```bash
# Com PostgreSQL rodando localmente:
pnpm dlx prisma migrate dev --name init

# OU criar apenas o SQL sem aplicar (para usar com Docker):
pnpm dlx prisma migrate dev --name init --create-only
```

**Step 13: Verificar build**

```bash
pnpm build
```

Esperado: Build passa sem erros.

**Step 14: Commit**

```bash
cd C:\Users\joaop\Desenvolvimento\Projects\embrapaconnect
git checkout -b feature/fase-1-setup
git add -A
git commit -m "feat: fase 1 - setup Next.js 14, Prisma schema, design tokens"
```

---

## Task 2: Design System — Componentes UI Base

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/tag.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/toast.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/tooltip.tsx`
- Create: `src/components/ui/stat-block.tsx`
- Create: `src/components/ui/section-header.tsx`
- Create: `src/components/ui/index.ts`
- Create: `src/app/dev/page.tsx` (página de preview dos componentes)

**Instalar dependências:**
```bash
pnpm add @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-toast class-variance-authority clsx tailwind-merge
```

**Button (`src/components/ui/button.tsx`):**
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-lime-accent text-dark-base hover:brightness-110 hover:scale-[1.02]",
        outlined: "border-2 border-white text-white hover:bg-lime-accent hover:text-dark-base hover:border-lime-accent",
        ghost: "text-light-muted hover:text-white",
        danger: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-2.5 text-sm",
        lg: "px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  arrow?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  arrow,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
      {arrow && !loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
```

**Card (`src/components/ui/card.tsx`):**
```tsx
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-dark-green p-7",
        hover && "transition-all duration-200 hover:border-lime-accent/30",
        className
      )}
      {...props}
    />
  );
}

export function CardLight({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
```

**Input (`src/components/ui/input.tsx`):**
```tsx
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export function Input({ className, label, error, dark = false, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-[12px] font-medium uppercase tracking-wider", dark ? "text-light-muted" : "text-gray-600")}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "rounded-full px-6 py-3 text-sm outline-none transition-all duration-200",
          "focus:ring-2 focus:ring-lime-accent/50",
          dark
            ? "border border-white/20 bg-white/10 text-white placeholder:text-light-muted/60"
            : "border border-gray-200 bg-white text-dark-base placeholder:text-gray-400",
          error && "border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
```

**StatBlock (`src/components/ui/stat-block.tsx`):**
```tsx
import { cn } from "@/lib/utils";

interface StatBlockProps {
  value: string;
  label: string;
  accent?: boolean;
  className?: string;
}

export function StatBlock({ value, label, accent = false, className }: StatBlockProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={cn("font-display text-[56px] font-black leading-none", accent ? "text-lime-accent" : "text-white")}>
        {value}
      </span>
      <span className="text-[13px] text-light-muted">{label}</span>
    </div>
  );
}
```

**SectionHeader (`src/components/ui/section-header.tsx`):**
```tsx
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  headline: React.ReactNode;
  description?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeader({ label, headline, description, center = false, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", center && "items-center text-center", className)}>
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-light-muted">
          {label}
        </span>
      )}
      <h2 className="font-display text-[28px] font-bold leading-tight tracking-tight md:text-[36px]">
        {headline}
      </h2>
      {description && (
        <p className={cn("max-w-xl text-[15px] leading-relaxed text-light-muted", center && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
```

**Criar lib/utils.ts:**
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Tag, Badge, Skeleton:** Componentes simples sem deps extras.

**Step: Verificar build**
```bash
pnpm build
```

**Step: Commit**
```bash
git add -A
git commit -m "feat: fase 2 - design system base (Button, Card, Input, StatBlock, SectionHeader)"
```

---

## Task 3: Layout — Navbar pública + Sidebars + Footer

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/layout/dashboard-sidebar.tsx`
- Create: `src/components/layout/admin-sidebar.tsx`
- Create: `src/components/layout/header.tsx`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(admin)/layout.tsx`
- Create: `src/app/(public)/page.tsx` (placeholder)
- Create: `src/app/(dashboard)/dashboard/page.tsx` (placeholder)
- Create: `src/app/(admin)/admin/page.tsx` (placeholder)

**Navbar pública (`src/components/layout/navbar.tsx`):**
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#funcionalidades", label: "Funcionalidades" },
  { href: "/#como-funciona", label: "Como Funciona" },
  { href: "/#contato", label: "Contato" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-dark-base">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="font-display text-[20px] font-black text-lime-accent">
          EC.
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] font-medium uppercase tracking-wider text-white/70 transition-colors hover:text-lime-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button variant="outlined" size="sm" arrow>
          <Link href="/login">Entrar</Link>
        </Button>
      </div>
    </nav>
  );
}
```

**Dashboard Sidebar (`src/components/layout/dashboard-sidebar.tsx`):**
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, MessageSquare, User, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/dashboard/fazendas", label: "Minhas Fazendas", icon: MapPin },
  { href: "/dashboard/avatar", label: "Meu Avatar", icon: User },
  { href: "/dashboard/chat", label: "Chat Embrapa", icon: MessageSquare },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-dark-base">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="font-display text-[20px] font-black text-lime-accent">
          EC.
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-lime-accent/10 text-lime-accent"
                  : "text-light-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-[11px] text-light-muted/60">EmbrapaConnect v1.0</p>
      </div>
    </aside>
  );
}
```

**Footer simples e Admin Sidebar:** Seguir o mesmo padrão.

**Layouts de grupo:**

`src/app/(public)/layout.tsx`:
```tsx
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-14">{children}</main>
      <Footer />
    </>
  );
}
```

`src/app/(dashboard)/layout.tsx`:
```tsx
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-off-white">
      <DashboardSidebar />
      <div className="ml-60 flex flex-1 flex-col">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
```

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 3 - layouts (navbar, sidebars, footer, route groups)"
```

---

## Task 4: Autenticação — NextAuth + Login + Registro + Reset de Senha

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/validators.ts`
- Create: `src/middleware.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/password-reset/route.ts`
- Create: `src/services/user.service.ts`
- Create: `src/services/password-reset.service.ts`
- Create: `src/lib/resend.ts`
- Create: `src/app/(public)/login/page.tsx`
- Create: `src/app/(public)/register/page.tsx`
- Create: `src/app/(public)/forgot-password/page.tsx`
- Create: `src/app/(public)/reset-password/page.tsx`
- Create: `src/types/user.ts`

**Instalar:**
```bash
pnpm add next-auth@beta @auth/prisma-adapter resend
```

**`src/lib/auth.ts`:**
```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validators";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarConfig: user.avatarConfig,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.avatarConfig = (user as any).avatarConfig;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).avatarConfig = token.avatarConfig;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
});
```

**`src/lib/validators.ts`:**
```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});
```

**`src/middleware.ts`:**
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rotas admin requerem ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Rotas dashboard requerem autenticação
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

**`src/app/api/auth/register/route.ts`:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash, role: "FARMER" },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
```

**`src/lib/resend.ts`:**
```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: "EmbrapaConnect <noreply@embrapaconnect.com.br>",
    to: email,
    subject: "Redefinição de senha — EmbrapaConnect",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Redefinir senha</h2>
        <p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #C6E832; color: #1A1F0F; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600;">
          Redefinir senha
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 13px;">
          Se você não solicitou isso, ignore este email.
        </p>
      </div>
    `,
  });
}
```

**Páginas de auth:** Forms com os componentes Input e Button do design system, bg darkBase, layout centralizado. Seguir o padrão visual editorial (escuro, lime accent nos CTAs).

**Step: Seed do admin**

`prisma/seed.ts`:
```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@2026", 12);

  await prisma.user.upsert({
    where: { email: "admin@embrapa.br" },
    update: {},
    create: {
      email: "admin@embrapa.br",
      name: "Administrador Embrapa",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Seed de fazendeiro de teste
  const farmerHash = await bcrypt.hash("Farmer@2026", 12);
  await prisma.user.upsert({
    where: { email: "joao@fazenda.com" },
    update: {},
    create: {
      email: "joao@fazenda.com",
      name: "João da Silva",
      phone: "(11) 99999-9999",
      passwordHash: farmerHash,
      role: "FARMER",
    },
  });

  console.log("Seed concluído.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 4 - autenticação (NextAuth, login, registro, reset senha)"
```

---

## Task 5: Landing Page — Design Editorial Completo

**Files:**
- Create: `src/app/(public)/page.tsx`
- Create: `src/components/home/hero-section.tsx`
- Create: `src/components/home/features-section.tsx`
- Create: `src/components/home/how-it-works-section.tsx`
- Create: `src/components/home/cta-section.tsx`
- Create: `src/components/home/stats-grid.tsx`

**Hero (`src/components/home/hero-section.tsx`):**

Layout: fundo `darkBase`, split esquerda (headline + CTA) e direita (stats + parceiros).

Headline: tipografia 72px uppercase, 1-2 palavras em `limeAccent`:
```
CONECTE SUA
FAZENDA
AO FUTURO
```

Onde "FAZENDA" é em `text-lime-accent`.

CTA: Button primary com arrow → "Cadastre-se gratuitamente"

Stats: "500+" fazendas, "27" estados, "98%" satisfação — usando StatBlock.

**Features:** Grid 3 colunas, bg `offWhite`, numerados 01-06, featureCard style.

**How It Works:** 3 steps numerados, bg `darkGreen`.

**CTA Section:** bg `darkBase`, headline centralizado, email input + button inline.

**Animações:** `animate-in fade-in slide-in-from-bottom-4 duration-500` nos elementos principais.

**Step: Verificar visualmente + build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 5 - landing page com design editorial completo"
```

---

## Task 6: CRUD de Fazendas + Integração Mapbox

**Files:**
- Create: `src/app/api/farms/route.ts`
- Create: `src/app/api/farms/[id]/route.ts`
- Create: `src/services/farm.service.ts`
- Create: `src/types/farm.ts`
- Create: `src/hooks/use-farm.ts`
- Create: `src/app/(dashboard)/dashboard/fazendas/page.tsx`
- Create: `src/app/(dashboard)/dashboard/fazendas/nova/page.tsx`
- Create: `src/app/(dashboard)/dashboard/fazendas/[id]/page.tsx`
- Create: `src/components/farms/farm-card.tsx`
- Create: `src/components/farms/farm-form.tsx`
- Create: `src/components/farms/farm-boundary-map.tsx`

**Instalar:**
```bash
pnpm add mapbox-gl @mapbox/mapbox-gl-draw react-map-gl
pnpm add -D @types/mapbox-gl @types/mapbox__mapbox-gl-draw
```

**`src/services/farm.service.ts`:**
```typescript
import { prisma } from "@/lib/prisma";
import type { CreateFarmInput, UpdateFarmInput } from "@/types/farm";

export async function getFarmsByUser(userId: string) {
  return prisma.farm.findMany({
    where: { userId },
    include: { crops: { select: { id: true, type: true, currentStage: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFarmById(id: string, userId?: string) {
  return prisma.farm.findFirst({
    where: { id, ...(userId ? { userId } : {}) },
    include: { crops: true, chatRoom: true },
  });
}

export async function createFarm(userId: string, data: CreateFarmInput) {
  return prisma.farm.create({
    data: { ...data, userId },
  });
}

export async function updateFarm(id: string, userId: string, data: UpdateFarmInput) {
  return prisma.farm.update({
    where: { id, userId },
    data,
  });
}

export async function deleteFarm(id: string, userId: string) {
  return prisma.farm.delete({ where: { id, userId } });
}
```

**API Routes:** GET/POST `/api/farms`, GET/PUT/DELETE `/api/farms/[id]`.
Todas validadas com Zod. Autenticadas via `auth()` do NextAuth. Retornam apenas fazendas do usuário logado.

**FarmBoundaryMap:** Componente cliente que usa `mapbox-gl` com `@mapbox/mapbox-gl-draw` para desenhar polígono no mapa. Ao finalizar o desenho, calcula a área em hectares e atualiza o form.

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 6 - CRUD de fazendas com Mapbox para desenhar perímetro"
```

---

## Task 7: CRUD de Plantações + Motor de Crescimento Científico

**Files:**
- Create: `src/app/api/farms/[id]/crops/route.ts`
- Create: `src/app/api/farms/[id]/crops/[cropId]/route.ts`
- Create: `src/services/crop.service.ts`
- Create: `src/lib/crop-growth.ts`
- Create: `src/types/crop.ts`
- Create: `src/app/(dashboard)/dashboard/fazendas/[id]/plantacao/nova/page.tsx`
- Create: `src/components/crops/crop-form.tsx`
- Create: `src/components/crops/crop-card.tsx`
- Create: `src/components/crops/crop-stage-badge.tsx`

**`src/lib/crop-growth.ts`:**
```typescript
import { CropStage, CropType } from "@prisma/client";

interface StageConfig {
  stage: CropStage;
  startDay: number;
  endDay: number;
  percentage: number;
}

interface CropCycleConfig {
  totalDays: number;
  stages: StageConfig[];
}

export const CROP_CYCLES: Record<CropType, CropCycleConfig> = {
  SOJA: {
    totalDays: 120,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 20, percentage: 15 },
      { stage: "CRESCIMENTO", startDay: 21, endDay: 50, percentage: 40 },
      { stage: "FLORACAO", startDay: 51, endDay: 70, percentage: 65 },
      { stage: "FRUTIFICACAO", startDay: 71, endDay: 95, percentage: 80 },
      { stage: "MATURACAO", startDay: 96, endDay: 115, percentage: 95 },
      { stage: "COLHEITA", startDay: 116, endDay: 120, percentage: 100 },
    ],
  },
  MILHO: {
    totalDays: 135,
    stages: [
      { stage: "PREPARO", startDay: 0, endDay: 5, percentage: 0 },
      { stage: "PLANTIO", startDay: 6, endDay: 10, percentage: 5 },
      { stage: "GERMINACAO", startDay: 11, endDay: 18, percentage: 12 },
      { stage: "CRESCIMENTO", startDay: 19, endDay: 60, percentage: 40 },
      { stage: "FLORACAO", startDay: 61, endDay: 80, percentage: 60 },
      { stage: "FRUTIFICACAO", startDay: 81, endDay: 100, percentage: 78 },
      { stage: "MATURACAO", startDay: 101, endDay: 130, percentage: 95 },
      { stage: "COLHEITA", startDay: 131, endDay: 135, percentage: 100 },
    ],
  },
  CAFE: { totalDays: 730, stages: [/* ... */] },
  CANA: { totalDays: 365, stages: [/* ... */] },
  ALGODAO: { totalDays: 160, stages: [/* ... */] },
  TRIGO: { totalDays: 115, stages: [/* ... */] },
  ARROZ: { totalDays: 120, stages: [/* ... */] },
  FEIJAO: { totalDays: 85, stages: [/* ... */] },
  MANDIOCA: { totalDays: 360, stages: [/* ... */] },
  OUTRO: { totalDays: 120, stages: [/* ... */] },
};

export interface GrowthDataPoint {
  day: number;
  percentage: number;
  stage: CropStage;
}

export function generateGrowthData(type: CropType, plantedAt: Date): {
  growthData: GrowthDataPoint[];
  estimatedHarvestAt: Date;
} {
  const cycle = CROP_CYCLES[type];
  const growthData: GrowthDataPoint[] = [];

  for (let day = 0; day <= cycle.totalDays; day++) {
    const stageConfig = cycle.stages.findLast((s) => s.startDay <= day) ?? cycle.stages[0];
    const nextStage = cycle.stages.find((s) => s.startDay > day);

    let percentage = stageConfig.percentage;
    if (nextStage) {
      const dayProgress = (day - stageConfig.startDay) / (stageConfig.endDay - stageConfig.startDay);
      percentage = stageConfig.percentage + dayProgress * (nextStage.percentage - stageConfig.percentage);
    }

    growthData.push({ day, percentage: Math.min(100, Math.round(percentage * 10) / 10), stage: stageConfig.stage });
  }

  const estimatedHarvestAt = new Date(plantedAt);
  estimatedHarvestAt.setDate(estimatedHarvestAt.getDate() + cycle.totalDays);

  return { growthData, estimatedHarvestAt };
}

export function getCurrentGrowthPoint(growthData: GrowthDataPoint[], plantedAt: Date): GrowthDataPoint {
  const daysSincePlanting = Math.floor((Date.now() - plantedAt.getTime()) / (1000 * 60 * 60 * 24));
  return growthData[Math.min(daysSincePlanting, growthData.length - 1)] ?? growthData[0];
}
```

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 7 - CRUD de plantações com motor de crescimento científico baseado em dados Embrapa"
```

---

## Task 8: Visualização 3D da Fazenda (React Three Fiber)

**Files:**
- Create: `src/components/3d/farm-scene.tsx`
- Create: `src/components/3d/terrain.tsx`
- Create: `src/components/3d/crop-plot.tsx`
- Create: `src/components/3d/crop-models/generic-plant.tsx`
- Create: `src/components/3d/crop-models/soja-plant.tsx`
- Create: `src/components/3d/crop-models/milho-plant.tsx`
- Create: `src/components/3d/buildings.tsx`
- Create: `src/components/3d/decorations.tsx`
- Update: `src/app/(dashboard)/dashboard/fazendas/[id]/page.tsx`

**Instalar:**
```bash
pnpm add @react-three/fiber @react-three/drei three
pnpm add -D @types/three
```

**Assets 3D gratuitos — baixar de:**
- **Kenney.nl/assets/3d** — "Nature Kit", "Farm Kit" (CC0)
  - URL: https://kenney.nl/assets/nature-kit
  - URL: https://kenney.nl/assets/farm
- **Quaternius.com** — "Ultimate Nature Pack" (CC0)
  - URL: https://quaternius.com/packs/ultimatenature.html
- **Poly.pizza** — modelos individuais de plantas (CC0)
  - URL: https://poly.pizza

Converter para `.glb` e colocar em `public/models/`.

**`src/components/3d/farm-scene.tsx`:**
```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Terrain } from "./terrain";
import { CropPlot } from "./crop-plot";
import { Buildings } from "./buildings";
import { Decorations } from "./decorations";
import type { Crop } from "@prisma/client";

interface FarmSceneProps {
  crops: Crop[];
  currentDay?: number;
}

export function FarmScene({ crops, currentDay = 0 }: FarmSceneProps) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [10, 8, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Sky sunPosition={[100, 20, 100]} />
          <Terrain />
          <Buildings />
          <Decorations />
          {crops.map((crop, index) => (
            <CropPlot
              key={crop.id}
              crop={crop}
              position={[index * 4 - (crops.length * 2), 0, 0]}
              currentDay={currentDay}
            />
          ))}
          <OrbitControls
            enablePan={true}
            minDistance={3}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.2}
          />
          <fog attach="fog" color="#a8c5a0" near={20} far={60} />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

**`src/components/3d/crop-plot.tsx`:**
```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import type { Crop } from "@prisma/client";
import { SojaPlant } from "./crop-models/soja-plant";
import { MilhoPlant } from "./crop-models/milho-plant";
import { GenericPlant } from "./crop-models/generic-plant";

interface CropPlotProps {
  crop: Crop;
  position: [number, number, number];
  currentDay: number;
}

export function CropPlot({ crop, position, currentDay }: CropPlotProps) {
  const growthData = crop.growthData as Array<{ day: number; percentage: number; stage: string }>;
  const point = growthData[Math.min(currentDay, growthData.length - 1)] ?? growthData[0];
  const scale = Math.max(0.05, point.percentage / 100);

  const PlantComponent = crop.type === "SOJA" ? SojaPlant
    : crop.type === "MILHO" ? MilhoPlant
    : GenericPlant;

  return (
    <group position={position}>
      {/* Solo da parcela */}
      <Box args={[3, 0.1, 3]} position={[0, -0.05, 0]} receiveShadow>
        <meshLambertMaterial color={point.percentage > 80 ? "#8B6914" : "#5C4033"} />
      </Box>
      {/* Planta */}
      <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
        <PlantComponent stage={point.stage as any} />
      </group>
    </group>
  );
}
```

**`src/components/3d/crop-models/generic-plant.tsx`:** Modelo procedural usando geometrias Three.js (cilindro para tronco + esferas para folhas). Muda cor com base no estágio.

**`src/components/3d/terrain.tsx`:** Plane grande com textura de grama.

**`src/components/3d/buildings.tsx`:** Caixas simples representando celeiro (se assets .glb não estiverem disponíveis, usar geometrias primitivas em Three.js).

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 8 - visualização 3D da fazenda com React Three Fiber e modelos por estágio"
```

---

## Task 9: Timeline Slider — Controle de Tempo da Fazenda 3D

**Files:**
- Create: `src/components/3d/timeline-slider.tsx`
- Update: `src/app/(dashboard)/dashboard/fazendas/[id]/page.tsx` — integrar slider state

**`src/components/3d/timeline-slider.tsx`:**
```tsx
"use client";

import { useState, useMemo } from "react";
import type { Crop } from "@prisma/client";
import { CropStage } from "@prisma/client";

interface TimelineSliderProps {
  crops: Crop[];
  onDayChange: (day: number) => void;
}

const STAGE_LABELS: Record<string, string> = {
  PREPARO: "Preparo do Solo",
  PLANTIO: "Plantio",
  GERMINACAO: "Germinação",
  CRESCIMENTO: "Crescimento",
  FLORACAO: "Floração",
  FRUTIFICACAO: "Frutificação",
  MATURACAO: "Maturação",
  COLHEITA: "Colheita",
};

export function TimelineSlider({ crops, onDayChange }: TimelineSliderProps) {
  const maxDays = useMemo(() => {
    if (!crops.length) return 120;
    const allGrowthData = crops.flatMap(c => c.growthData as Array<{ day: number }>);
    return Math.max(...allGrowthData.map(p => p.day));
  }, [crops]);

  const [currentDay, setCurrentDay] = useState(0);

  const primaryCrop = crops[0];
  const growthData = primaryCrop?.growthData as Array<{ day: number; percentage: number; stage: string }> ?? [];
  const currentPoint = growthData[currentDay] ?? growthData[0];

  const estimatedHarvest = primaryCrop
    ? new Date(new Date(primaryCrop.plantedAt).getTime() + maxDays * 86400000)
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = Number(e.target.value);
    setCurrentDay(day);
    onDayChange(day);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-dark-base/90 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-light-muted">
            {currentPoint ? STAGE_LABELS[currentPoint.stage] : "—"}
          </p>
          <p className="text-[15px] font-semibold text-white">
            Dia {currentDay} / {maxDays}
          </p>
        </div>
        {estimatedHarvest && (
          <div className="text-right">
            <p className="text-[11px] text-light-muted">Colheita estimada</p>
            <p className="text-[13px] font-medium text-lime-accent">
              {estimatedHarvest.toLocaleDateString("pt-BR")}
            </p>
          </div>
        )}
      </div>
      <input
        type="range"
        min={0}
        max={maxDays}
        value={currentDay}
        onChange={handleChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-lime-accent"
      />
      <div className="mt-2 flex justify-between">
        <span className="text-[11px] text-light-muted/60">
          {primaryCrop ? new Date(primaryCrop.plantedAt).toLocaleDateString("pt-BR") : "—"}
        </span>
        <span className="text-[11px] text-light-muted/60">
          {estimatedHarvest?.toLocaleDateString("pt-BR") ?? "—"}
        </span>
      </div>
      {currentPoint && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-lime-accent transition-all duration-300"
              style={{ width: `${currentPoint.percentage}%` }}
            />
          </div>
          <span className="text-[12px] font-semibold text-lime-accent">
            {currentPoint.percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
```

**Integração na page `/dashboard/fazendas/[id]`:**
- State `currentDay` controlado
- Passar para `<FarmScene currentDay={currentDay} />`
- Passar para `<TimelineSlider onDayChange={setCurrentDay} />`

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 9 - timeline slider com controle de evolução 3D em tempo real"
```

---

## Task 10: Avatar 3D Builder

**Files:**
- Create: `src/components/3d/avatar-scene.tsx`
- Create: `src/components/3d/avatar-builder.tsx`
- Create: `src/components/3d/avatar-preview.tsx`
- Create: `src/app/(dashboard)/dashboard/avatar/page.tsx`
- Create: `src/app/api/users/[id]/avatar/route.ts`
- Create: `src/services/avatar.service.ts`
- Create: `src/types/avatar.ts`
- Create: `src/hooks/use-avatar.ts`

**`src/types/avatar.ts`:**
```typescript
export interface AvatarConfig {
  skinTone: string;
  eyeShape: "round" | "almond" | "large" | "small";
  eyeColor: string;
  bodyType: "slim" | "medium" | "robust";
  glasses: "none" | "round" | "square" | "aviator";
  hat: "none" | "straw" | "cap" | "cangaceiro" | "cowboy";
}

export const SKIN_TONES = [
  "#F5D6B8", "#D4A574", "#C68642", "#8D5524", "#6B3E26", "#3B2314",
];

export const EYE_COLORS = [
  "#3E2723", "#4E342E", "#2E7D32", "#1565C0", "#F57F17", "#455A64",
];

export const DEFAULT_AVATAR: AvatarConfig = {
  skinTone: "#D4A574",
  eyeShape: "round",
  eyeColor: "#3E2723",
  bodyType: "medium",
  glasses: "none",
  hat: "straw",
};
```

**`src/components/3d/avatar-scene.tsx`:** Canvas R3F com avatar procedural (geometrias Three.js) ou modelo `.glb`. Avatar tem animação idle (rotação lenta, leve balanço). Aplica cores do AvatarConfig via `material.color`.

**`src/components/3d/avatar-builder.tsx`:** UI de abas (Pele, Olhos, Corpo, Óculos, Chapéu). Swatches de cores clicáveis. Botões de silhueta para bodyType. Preview ao vivo do avatar.

**Assets de avatar gratuitos:**
- Kenney.nl Character Kit: https://kenney.nl/assets/character-kit
- Quaternius Modular Characters: https://quaternius.com/packs/modularcharacters.html

Usar geometrias primitivas Three.js como fallback se assets não estiverem disponíveis.

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 10 - avatar 3D builder com customização completa e animação idle"
```

---

## Task 11: Mapa Geográfico (Painel Embrapa)

**Files:**
- Create: `src/components/map/brazil-map.tsx`
- Create: `src/components/map/state-layer.tsx`
- Create: `src/components/map/city-markers.tsx`
- Create: `src/components/map/farm-pin.tsx`
- Create: `src/components/map/farm-preview-panel.tsx`
- Create: `src/app/(admin)/admin/mapa/page.tsx`
- Create: `src/hooks/use-map.ts`
- Create: `src/types/map.ts`
- Create: `src/app/api/admin/farms/route.ts` (retorna todas as fazendas com lat/long)
- Create: `public/geojson/estados.json`

**GeoJSON dos estados brasileiros:**
Baixar de: `https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&resolucao=2`
Salvar como `public/geojson/estados.json`.

**`src/components/map/brazil-map.tsx`:**
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FarmPreviewPanel } from "./farm-preview-panel";

interface FarmMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  city: string;
  userId: string;
  userName: string;
  hasAlert?: boolean;
}

interface BrazilMapProps {
  farms: FarmMarker[];
}

export function BrazilMap({ farms }: BrazilMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmMarker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-51.9253, -14.235],
      zoom: 3.5,
    });
    mapInstanceRef.current = map;

    map.on("load", () => {
      // Adicionar GeoJSON dos estados
      map.addSource("estados", {
        type: "geojson",
        data: "/geojson/estados.json",
      });
      map.addLayer({
        id: "estados-fill",
        type: "fill",
        source: "estados",
        paint: {
          "fill-color": "#1E2A14",
          "fill-opacity": 0.6,
        },
      });
      map.addLayer({
        id: "estados-outline",
        type: "line",
        source: "estados",
        paint: {
          "line-color": "#4A5C2E",
          "line-width": 1,
        },
      });

      // Adicionar markers das fazendas
      farms.forEach((farm) => {
        const el = document.createElement("div");
        el.className = "farm-marker";
        el.style.cssText = `
          width: 12px; height: 12px; border-radius: 50%;
          background: ${farm.hasAlert ? "#EF4444" : "#C6E832"};
          border: 2px solid white; cursor: pointer;
          transition: transform 0.15s;
        `;
        el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.5)"; });
        el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
        el.addEventListener("click", () => setSelectedFarm(farm));

        new mapboxgl.Marker(el)
          .setLngLat([farm.longitude, farm.latitude])
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [farms]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {selectedFarm && (
        <FarmPreviewPanel
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
        />
      )}
    </div>
  );
}
```

**`src/components/map/farm-preview-panel.tsx`:** Painel lateral com slide-in. Mostra avatar 3D miniatura + dados da fazenda + botão "Abrir chat" + botão "Ver detalhes".

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 11 - mapa geográfico com Mapbox, pins de fazendas e painel de preview"
```

---

## Task 12: Chat em Tempo Real (Socket.io)

**Files:**
- Create: `server/index.ts`
- Create: `src/lib/socket.ts`
- Create: `src/app/api/chat/rooms/route.ts`
- Create: `src/app/api/chat/rooms/[id]/messages/route.ts`
- Create: `src/app/api/upload/route.ts`
- Create: `src/services/chat.service.ts`
- Create: `src/components/chat/chat-room-list.tsx`
- Create: `src/components/chat/chat-window.tsx`
- Create: `src/components/chat/message-bubble.tsx`
- Create: `src/components/chat/alert-message-form.tsx`
- Create: `src/components/chat/chat-input.tsx`
- Create: `src/components/chat/online-indicator.tsx`
- Create: `src/app/(dashboard)/dashboard/chat/page.tsx`
- Create: `src/app/(admin)/admin/chat/page.tsx`
- Create: `src/hooks/use-socket.ts`
- Create: `src/hooks/use-chat.ts`
- Create: `src/types/chat.ts`

**Instalar:**
```bash
pnpm add socket.io socket.io-client
```

**`server/index.ts`:**
```typescript
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import next from "next";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    cors: { origin: process.env.NEXTAUTH_URL || "http://localhost:3000" },
  });

  const onlineUsers = new Map<string, string>(); // socketId -> userId

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId as string;
    if (userId) onlineUsers.set(socket.id, userId);

    socket.on("room:join", ({ roomId }: { roomId: string }) => {
      socket.join(`room:${roomId}`);
    });

    socket.on("room:leave", ({ roomId }: { roomId: string }) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on("message:send", async ({ roomId, content, type, alertCategory }: {
      roomId: string;
      content: string;
      type: string;
      alertCategory?: string;
    }) => {
      // Salvar no banco via API call ou direto com prisma
      const message = {
        id: Date.now().toString(),
        roomId,
        senderId: userId,
        content,
        type,
        alertCategory,
        createdAt: new Date(),
      };
      io.to(`room:${roomId}`).emit("message:new", { message });

      if (type === "ALERT") {
        io.emit("alert:new", { roomId, category: alertCategory });
      }
    });

    socket.on("user:typing", ({ roomId }: { roomId: string }) => {
      socket.to(`room:${roomId}`).emit("user:typing", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
    });
  });

  const PORT = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(PORT, () => {
    console.log(`> Server running on http://localhost:${PORT}`);
  });
});
```

**Atualizar `package.json`:**
```json
{
  "scripts": {
    "dev": "node server/index.ts",
    "dev:next": "next dev",
    "build": "next build",
    "start": "NODE_ENV=production node server/index.ts"
  }
}
```

**Instalar ts-node para rodar server:**
```bash
pnpm add -D ts-node tsx
```

Atualizar script `dev` para usar `tsx server/index.ts`.

**`src/hooks/use-socket.ts`:**
```typescript
import { useEffect, useRef } from "react";
import io, { type Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

let socketInstance: Socket | null = null;

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    if (!socketInstance) {
      socketInstance = io({
        auth: { userId: session.user.id },
        transports: ["websocket"],
      });
    }

    socketRef.current = socketInstance;

    return () => {
      // Não fechar ao desmontar — singleton
    };
  }, [session]);

  return socketRef.current;
}
```

**ChatWindow:** Lista de mensagens com scroll, agrupadas por data. MessageBubble com estilos diferentes para ALERT (vermelho). ChatInput com botões para texto, imagem e alerta categorizado.

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 12 - chat em tempo real com Socket.io, alertas categorizados e upload de imagens"
```

---

## Task 13: Painel Admin Completo

**Files:**
- Create: `src/app/(admin)/admin/page.tsx`
- Create: `src/app/(admin)/admin/fazendas/page.tsx`
- Create: `src/app/(admin)/admin/fazendas/[id]/page.tsx`
- Create: `src/app/(admin)/admin/usuarios/page.tsx`
- Create: `src/app/api/admin/users/route.ts`
- Create: `src/app/api/admin/stats/route.ts`
- Create: `src/components/admin/stats-cards.tsx`
- Create: `src/components/admin/farms-table.tsx`
- Create: `src/components/admin/users-table.tsx`
- Create: `src/components/admin/alerts-feed.tsx`

**Dashboard admin:** Cards com stats (total fazendas, total fazendeiros, alertas ativos, fazendas por estado). Tabela de fazendas recentes. Feed de alertas ativos.

**Detalhes da fazenda (`/admin/fazendas/[id]`):** Layout split com avatar 3D do fazendeiro à esquerda + fazenda 3D miniatura à direita + dados textuais + botão de chat.

**Step: Verificar build + Commit**
```bash
pnpm build
git add -A
git commit -m "feat: fase 13 - painel admin completo com dashboard, gestão de fazendas/usuários e alertas"
```

---

## Task 14: Docker + E2E Tests (Playwright)

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.test.yml`
- Create: `docker/postgres/init.sql`
- Create: `.dockerignore`
- Create: `e2e/auth.spec.ts`
- Create: `e2e/farms.spec.ts`
- Create: `e2e/chat.spec.ts`
- Create: `e2e/avatar.spec.ts`
- Create: `e2e/admin-map.spec.ts`
- Create: `playwright.config.ts`

**Instalar:**
```bash
pnpm add -D @playwright/test
pnpm dlx playwright install chromium
```

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/server ./server
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server/index.ts"]
```

**`docker-compose.yml`:**
```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: embrapaconnect
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/embrapaconnect
      NEXTAUTH_SECRET: test-secret-change-in-production
      NEXTAUTH_URL: http://localhost:3000
      MAPBOX_ACCESS_TOKEN: ${MAPBOX_ACCESS_TOKEN}
      RESEND_API_KEY: ${RESEND_API_KEY:-re_test}
      ENCRYPTION_KEY: test-encryption-key-32-chars-here
    depends_on:
      postgres:
        condition: service_healthy
    command: >
      sh -c "pnpm dlx prisma migrate deploy && pnpm dlx prisma db seed && node server/index.ts"

volumes:
  postgres_data:
```

**`docker-compose.test.yml`:**
```yaml
version: "3.9"

services:
  postgres-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: embrapaconnect_test
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  app-test:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres-test:5432/embrapaconnect_test
      NEXTAUTH_SECRET: test-secret
      NEXTAUTH_URL: http://localhost:3000
      MAPBOX_ACCESS_TOKEN: pk.test
      RESEND_API_KEY: re_test
      ENCRYPTION_KEY: test-key-32-characters-exactly-here
      NODE_ENV: test
    depends_on:
      postgres-test:
        condition: service_healthy
    command: >
      sh -c "pnpm dlx prisma migrate deploy && pnpm dlx prisma db seed && node server/index.ts"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 10s
      retries: 10

  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      BASE_URL: http://app-test:3000
      CI: "true"
    depends_on:
      app-test:
        condition: service_healthy
    command: pnpm test:e2e
```

**`playwright.config.ts`:**
```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

**`e2e/auth.spec.ts`:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Autenticação", () => {
  test("Registro de novo fazendeiro", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel(/nome/i).fill("Maria da Silva");
    await page.getByLabel(/email/i).fill("maria@teste.com");
    await page.getByLabel(/^senha/i).fill("Senha@2026");
    await page.getByLabel(/confirmar/i).fill("Senha@2026");
    await page.getByRole("button", { name: /cadastrar/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Login com credenciais válidas", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Login inválido mostra erro", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("errado@teste.com");
    await page.getByLabel(/senha/i).fill("senhaerrada");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/inválido|incorreto/i)).toBeVisible();
  });

  test("Logout funciona", async ({ page }) => {
    // Login primeiro
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL("/dashboard");

    // Logout
    await page.getByRole("button", { name: /sair|logout/i }).click();
    await expect(page).toHaveURL("/login");
  });

  test("Esqueci senha — solicitar reset", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByText(/enviado|verifique/i)).toBeVisible();
  });

  test("Rota /dashboard redireciona sem auth", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("Rota /admin redireciona sem auth de admin", async ({ page }) => {
    // Login como farmer
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();

    // Tentar acessar admin
    await page.goto("/admin");
    await expect(page).not.toHaveURL("/admin");
  });
});
```

**`e2e/farms.spec.ts`:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Fazendas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("Listar fazendas do usuário", async ({ page }) => {
    await page.goto("/dashboard/fazendas");
    await expect(page.getByRole("heading", { name: /fazenda|propriedade/i })).toBeVisible();
  });

  test("Criar nova fazenda", async ({ page }) => {
    await page.goto("/dashboard/fazendas/nova");
    await page.getByLabel(/nome/i).fill("Fazenda Esperança");
    await page.getByLabel(/estado/i).fill("SP");
    await page.getByLabel(/cidade/i).fill("Ribeirão Preto");
    await page.getByLabel(/área/i).fill("150");
    await page.getByLabel(/latitude/i).fill("-21.1775");
    await page.getByLabel(/longitude/i).fill("-47.8103");
    await page.getByRole("button", { name: /salvar|criar/i }).click();
    await expect(page.getByText(/fazenda|criada/i)).toBeVisible();
  });

  test("Visualizar fazenda 3D", async ({ page }) => {
    await page.goto("/dashboard/fazendas");
    const firstFarm = page.getByRole("link", { name: /ver|detalhes|abrir/i }).first();
    if (await firstFarm.isVisible()) {
      await firstFarm.click();
      await expect(page.locator("canvas")).toBeVisible();
    }
  });

  test("Timeline slider altera dia", async ({ page }) => {
    await page.goto("/dashboard/fazendas");
    const firstFarm = page.getByRole("link", { name: /ver|detalhes/i }).first();
    if (await firstFarm.isVisible()) {
      await firstFarm.click();
      const slider = page.getByRole("slider");
      if (await slider.isVisible()) {
        await slider.fill("50");
        await expect(page.getByText(/dia 50/i)).toBeVisible();
      }
    }
  });
});
```

**`e2e/avatar.spec.ts`:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Avatar 3D", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
  });

  test("Página de avatar carrega com canvas 3D", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    await expect(page.locator("canvas")).toBeVisible();
    await expect(page.getByText(/pele|olhos|corpo/i)).toBeVisible();
  });

  test("Alterar tom de pele atualiza avatar", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    const skinSwatch = page.getByRole("button", { name: /pele/i }).first();
    if (await skinSwatch.isVisible()) {
      await skinSwatch.click();
      await expect(page.locator("canvas")).toBeVisible();
    }
  });

  test("Salvar configuração de avatar", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    const saveButton = page.getByRole("button", { name: /salvar/i });
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await expect(page.getByText(/salvo|atualizado/i)).toBeVisible();
    }
  });
});
```

**`e2e/chat.spec.ts`:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
  });

  test("Página de chat carrega lista de salas", async ({ page }) => {
    await page.goto("/dashboard/chat");
    await expect(page.getByRole("heading", { name: /chat/i })).toBeVisible();
  });

  test("Enviar mensagem de texto", async ({ page }) => {
    await page.goto("/dashboard/chat");
    const chatInput = page.getByPlaceholder(/mensagem|escreva/i);
    if (await chatInput.isVisible()) {
      await chatInput.fill("Olá, preciso de ajuda com minha plantação de soja.");
      await page.getByRole("button", { name: /enviar/i }).click();
      await expect(page.getByText("Olá, preciso de ajuda")).toBeVisible();
    }
  });

  test("Enviar alerta de incêndio", async ({ page }) => {
    await page.goto("/dashboard/chat");
    const alertButton = page.getByRole("button", { name: /alerta/i });
    if (await alertButton.isVisible()) {
      await alertButton.click();
      await page.getByRole("option", { name: /incêndio/i }).click();
      await page.getByPlaceholder(/descreva/i).fill("Fogo no setor norte da fazenda!");
      await page.getByRole("button", { name: /enviar alerta/i }).click();
      await expect(page.getByText(/incêndio|fogo/i)).toBeVisible();
    }
  });
});
```

**`e2e/admin-map.spec.ts`:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("Painel Admin — Mapa", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@embrapa.br");
    await page.getByLabel(/senha/i).fill("Admin@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL("/admin");
  });

  test("Dashboard admin carrega com stats", async ({ page }) => {
    await expect(page.getByText(/fazenda|produtor/i)).toBeVisible();
  });

  test("Mapa carrega com pins das fazendas", async ({ page }) => {
    await page.goto("/admin/mapa");
    await page.waitForSelector(".mapboxgl-map", { timeout: 10000 });
    await expect(page.locator(".mapboxgl-map")).toBeVisible();
  });

  test("Lista de fazendas exibe todas as propriedades", async ({ page }) => {
    await page.goto("/admin/fazendas");
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("Lista de usuários exibe fazendeiros", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("Chat admin mostra todas as salas", async ({ page }) => {
    await page.goto("/admin/chat");
    await expect(page.getByRole("heading", { name: /chat/i })).toBeVisible();
  });
});
```

**`src/app/api/health/route.ts` (para healthcheck do Docker):**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503 });
  }
}
```

**Atualizar package.json:**
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:migrate": "prisma migrate deploy",
    "db:migrate:dev": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:docker": "docker compose -f docker-compose.test.yml up --exit-code-from playwright"
  }
}
```

**Step: Rodar E2E localmente:**
```bash
pnpm dlx prisma migrate dev --name init
pnpm db:seed
pnpm dev &
sleep 5
pnpm test:e2e
```

**Step: Rodar E2E com Docker:**
```bash
docker compose -f docker-compose.test.yml up --build --exit-code-from playwright
```

Esperado: Todos os testes passam.

**Step: Commit final**
```bash
git add -A
git commit -m "feat: fase 14 - Docker, E2E tests com Playwright cobrindo todos os fluxos"
```

---

## PR Final

Depois de todas as 14 fases:

```bash
git push origin feature/embrapaconnect-mvp
gh pr create \
  --title "feat: EmbrapaConnect MVP completo (14 fases)" \
  --body "## EmbrapaConnect MVP

Implementação completa da plataforma EmbrapaConnect:

- ✅ Auth (login, registro, reset senha)
- ✅ Landing page editorial (design system dark/lime)
- ✅ CRUD de fazendas com Mapbox boundary draw
- ✅ Plantações com ciclos científicos Embrapa
- ✅ Fazenda 3D (React Three Fiber) + Timeline slider
- ✅ Avatar 3D builder com animação idle
- ✅ Mapa geográfico do Brasil (Mapbox) com pins
- ✅ Chat em tempo real (Socket.io) com alertas
- ✅ Painel admin completo
- ✅ Docker compose (dev + prod + test)
- ✅ E2E tests Playwright (auth, farms, avatar, chat, admin)

## Como testar
\`\`\`bash
docker compose -f docker-compose.test.yml up --build --exit-code-from playwright
\`\`\`"
```

---

## Notas de Implementação

### Assets 3D (prioridade de busca)
1. **Kenney.nl** — https://kenney.nl/assets (Nature Kit, Farm Kit, Character Kit) — CC0
2. **Quaternius.com** — https://quaternius.com (Ultimate Nature, Modular Characters) — CC0
3. **Poly.pizza** — https://poly.pizza (buscar: soybean, corn, farm) — CC0/CC-BY

Se os assets não estiverem disponíveis, usar geometrias procedurais Three.js como fallback (já documentadas nas tasks).

### Variáveis de Ambiente para desenvolvimento
Criar `.env.local` com:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/embrapaconnect
NEXTAUTH_SECRET=dev-secret-nao-usar-em-prod
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.seu-token-aqui
MAPBOX_ACCESS_TOKEN=pk.seu-token-aqui
RESEND_API_KEY=re_test_apenas_dev
ENCRYPTION_KEY=01234567890123456789012345678901
```

### Ordem de execução das tasks
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14

Cada task depende das anteriores. Não pular fases.
