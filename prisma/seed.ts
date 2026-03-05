import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  const adminHash = await bcrypt.hash("Admin@2026", 12);
  const farmerHash = await bcrypt.hash("Farmer@2026", 12);

  await prisma.user.upsert({
    where: { email: "admin@embrapa.br" },
    update: {},
    create: {
      email: "admin@embrapa.br",
      name: "Administrador Embrapa",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

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

  console.log("Seed concluído!");
  console.log("Admin seeded: admin@embrapa.br");
  console.log("Farmer seeded: joao@fazenda.com");
}

main().catch(console.error).finally(() => prisma.$disconnect());
