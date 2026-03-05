import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardLight } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Skeleton } from "@/components/ui/skeleton";
import { StatBlock } from "@/components/ui/stat-block";
import { SectionHeader } from "@/components/ui/section-header";

export default function DevPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-dark-base p-12">
      <h1 className="mb-12 font-display text-4xl font-black text-lime-accent">Design System Preview</h1>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" arrow>Primary CTA</Button>
          <Button variant="outlined" arrow>Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="secondary">Secondary</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Cards</h2>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <Card>
            <p className="text-white font-semibold mb-2">Dark Card</p>
            <p className="text-light-muted text-sm">Card com fundo escuro e hover lime.</p>
          </Card>
          <CardLight>
            <p className="text-dark-base font-semibold mb-2">Light Card</p>
            <p className="text-gray-600 text-sm">Card com fundo branco para dashboard.</p>
          </CardLight>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Inputs</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Input label="Email (dark)" dark placeholder="seu@email.com" type="email" />
          <Input label="Senha (dark)" dark placeholder="••••••••" type="password" />
          <Input label="Com erro" dark error="Campo obrigatório" placeholder="..." />
        </div>
      </section>

      {/* Badges & Tags */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Badges & Tags</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="lime">Lime</Badge>
          <Badge variant="success">Sucesso</Badge>
          <Badge variant="danger">Perigo</Badge>
          <Badge variant="warning">Aviso</Badge>
          <Badge variant="info">Info</Badge>
          <Tag>Soja</Tag>
          <Tag>Milho</Tag>
          <Tag>Café</Tag>
        </div>
      </section>

      {/* StatBlocks */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Stat Blocks</h2>
        <div className="flex gap-12">
          <StatBlock value="500+" label="Fazendas conectadas" accent />
          <StatBlock value="27" label="Estados cobertos" />
          <StatBlock value="98%" label="Satisfação" accent />
        </div>
      </section>

      {/* Section Headers */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Section Headers</h2>
        <SectionHeader
          label="Funcionalidades"
          headline={<>Tudo que você precisa para <span className="text-lime-accent">modernizar</span> sua fazenda</>}
          description="Plataforma completa para produtores rurais brasileiros."
          dark
        />
      </section>

      {/* Skeleton */}
      <section className="mb-12">
        <h2 className="mb-6 font-display text-xl text-white">Skeleton</h2>
        <div className="flex flex-col gap-3 max-w-sm">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </section>
    </div>
  );
}
