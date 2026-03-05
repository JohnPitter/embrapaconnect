# EmbrapaConnect

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge)

**Plataforma digital que conecta produtores rurais à Embrapa**

*Mapeamento de fazendas, visualização 3D, acompanhamento científico e comunicação direta com especialistas*

[Funcionalidades](#funcionalidades) •
[Instalação](#instalação) •
[Screenshots](#screenshots) •
[Configuração](#configuração) •
[Documentação](#documentação)

</div>

---

## Visão Geral

EmbrapaConnect é uma plataforma web que aproxima produtores rurais brasileiros da Embrapa, permitindo o mapeamento digital de fazendas, acompanhamento do crescimento das plantações com base em pesquisas científicas e comunicação direta com especialistas agrícolas.

**O que você encontra:**
- **Mapeamento de Fazendas** — Desenhe o perímetro da sua propriedade e cadastre suas plantações
- **Visualização 3D** — Veja sua fazenda em 3D com visual estilo Colheita Feliz
- **Timeline Científica** — Acompanhe a evolução da plantação dia a dia baseado em dados da Embrapa
- **Avatar Personalizado** — Monte seu boneco 3D com cor de pele, olhos, corpo, óculos e chapéu
- **Mapa Geográfico** — Embrapa visualiza todas as fazendas no mapa real do Brasil por estado/cidade
- **Chat em Tempo Real** — Canal direto entre produtor e Embrapa para dúvidas, alertas e emergências

---

## Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cadastro e Autenticação** | Email/senha com recuperação de senha via email |
| **Mapeamento Digital** | Desenhe o perímetro da fazenda no mapa, adicione culturas com área e data de plantio |
| **Fazenda 3D** | Renderização 3D da propriedade com modelos por tipo de cultura e estágio de crescimento |
| **Timeline Interativa** | Arraste o slider para ver qualquer momento da evolução da plantação |
| **Progresso Científico** | Ciclos de crescimento baseados em publicações da Embrapa por cultura |
| **Avatar 3D Animado** | Personagem customizável com animação idle |
| **Mapa do Brasil** | Visão geográfica real das fazendas por estado e município (painel Embrapa) |
| **Chat com Alertas** | Mensagens de texto, imagens e alertas categorizados (incêndio, praga, seca) |
| **Painel Admin** | Dashboard completo para equipe Embrapa com métricas e gestão |

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Linguagem** | TypeScript |
| **ORM** | Prisma |
| **Banco** | PostgreSQL 16 |
| **Auth** | NextAuth.js (Credentials) |
| **3D** | React Three Fiber + @react-three/drei |
| **Mapa** | Mapbox GL JS |
| **Chat** | Socket.io |
| **UI** | Tailwind CSS + Shadcn/ui |
| **Email** | Resend |
| **Ícones** | Lucide React |
| **Fontes** | Space Grotesk + Inter |

---

## Instalação

### Requisitos

| Requisito | Versão |
|-----------|--------|
| Node.js | 20+ |
| pnpm | 8+ |
| PostgreSQL | 16+ |
| Docker | 24+ (opcional) |

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/JohnPitter/embrapaconnect.git
cd embrapaconnect

# Suba os containers
docker compose up -d

# Acesse em http://localhost:3000
```

### Instalação Manual

```bash
# Clone o repositório
git clone https://github.com/JohnPitter/embrapaconnect.git
cd embrapaconnect

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Aplique as migrations e seed
pnpm db:migrate
pnpm db:seed

# Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`

---

## Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/embrapaconnect"

# NextAuth
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Mapbox
MAPBOX_ACCESS_TOKEN="pk.seu-token-aqui"

# Email (Resend)
RESEND_API_KEY="re_seu-token-aqui"

# Criptografia
ENCRYPTION_KEY="gerar-com-openssl-rand-hex-32"
```

### Usuário Admin Padrão (seed)

```
Email: admin@embrapa.br
Senha: Admin@2026
```

> **Importante:** Altere as credenciais em produção.

---

## Screenshots

> Em breve — projeto em desenvolvimento.

---

## Culturas Suportadas

| Cultura | Ciclo Médio | Fonte |
|---------|-------------|-------|
| Soja | 100–140 dias | Embrapa Soja |
| Milho | 120–150 dias | Embrapa Milho e Sorgo |
| Café | 700–900 dias | Embrapa Café |
| Cana-de-açúcar | 300–365 dias | Embrapa Agroenergia |
| Algodão | 140–180 dias | Embrapa Algodão |
| Trigo | 100–130 dias | Embrapa Trigo |
| Arroz | 100–140 dias | Embrapa Arroz e Feijão |
| Feijão | 70–100 dias | Embrapa Arroz e Feijão |
| Mandioca | 240–540 dias | Embrapa Mandioca e Fruticultura |

---

## Desenvolvimento

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Testes E2E
pnpm test:e2e

# Testes E2E com Docker
docker compose -f docker-compose.test.yml up --exit-code-from playwright

# Lint
pnpm lint

# Type check
pnpm type-check

# Migrations
pnpm db:migrate        # Aplica migrations
pnpm db:migrate:dev    # Cria e aplica migration de desenvolvimento
pnpm db:seed           # Popula dados de teste
pnpm db:studio         # Abre Prisma Studio
```

---

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [docs/plans/design.md](docs/plans/2026-03-04-embrapaconnect-design.md) | Design completo da plataforma |
| [docs/plans/implementation.md](docs/plans/2026-03-04-embrapaconnect-implementation.md) | Plano de implementação por fases |
| [CHANGELOG.md](CHANGELOG.md) | Histórico de alterações |

---

## Estrutura do Projeto

```
embrapaconnect/
├── src/
│   ├── app/           # Pages (Next.js App Router)
│   │   ├── (public)/  # Landing, login, registro
│   │   ├── (dashboard)/ # Painel do fazendeiro
│   │   └── (admin)/   # Painel Embrapa
│   ├── components/    # Componentes React
│   │   ├── ui/        # Design system
│   │   ├── layout/    # Navbar, sidebar, footer
│   │   ├── 3d/        # Componentes React Three Fiber
│   │   ├── map/       # Componentes Mapbox
│   │   └── chat/      # Componentes de chat
│   ├── lib/           # Utilitários e configs
│   ├── services/      # Lógica de negócio
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript types
├── prisma/            # Schema e migrations
├── public/
│   ├── models/        # Assets 3D (.glb)
│   └── geojson/       # GeoJSON IBGE
├── server/            # Socket.io custom server
├── e2e/               # Testes E2E (Playwright)
└── docker/            # Dockerfiles e configs
```

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

> Pull requests para `main` requerem aprovação de pelo menos 1 reviewer e CI passando.

---

## Licença

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## Suporte

- **Issues:** [GitHub Issues](https://github.com/JohnPitter/embrapaconnect/issues)
- **Discussões:** [GitHub Discussions](https://github.com/JohnPitter/embrapaconnect/discussions)
