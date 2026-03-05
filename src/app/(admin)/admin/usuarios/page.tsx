import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Calendar } from "lucide-react";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    where: { role: "FARMER" },
    include: {
      _count: { select: { farms: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-dark-base p-8">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-lime-accent">
          Gestão
        </p>
        <h1 className="mt-1 text-[28px] font-bold text-white font-display">
          Produtores Rurais
        </h1>
        <p className="text-[14px] text-light-muted/60">
          {users.length} produtor{users.length !== 1 ? "es" : ""} cadastrado{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Produtor</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Email</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Fazendas</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-light-muted/60">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-accent/20 text-[13px] font-bold text-lime-accent">
                      {(user.name ?? "U")[0]?.toUpperCase()}
                    </div>
                    <p className="text-[14px] font-medium text-white">{user.name ?? "—"}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-[14px] text-light-muted">{user.email}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-lime-accent/60" />
                    <span className="text-[14px] text-light-muted">{user._count.farms}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-light-muted/40" />
                    <span className="text-[14px] text-light-muted">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-[14px] text-light-muted/40">
                  Nenhum produtor cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
