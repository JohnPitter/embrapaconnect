# Changelog

Todas as alterações notáveis do EmbrapaConnect são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### Fase 14: Docker + E2E Tests
- Dockerfile multi-stage (base → deps → builder → runner) com standalone output
- docker-compose.yml para desenvolvimento com PostgreSQL
- docker-compose.test.yml para E2E tests com Playwright
- playwright.config.ts com suporte a CI
- e2e/auth.spec.ts — 7 testes: login, logout, register redirect, rota protegida
- e2e/farms.spec.ts — 4 testes: listar, criar, visualizar fazendas
- e2e/avatar.spec.ts — 4 testes: carregamento, UI, canvas 3D
- e2e/chat.spec.ts — 3 testes: chat, input, botão de alerta
- e2e/admin.spec.ts — 9 testes: dashboard, fazendas, usuários, mapa, chat, RBAC

### Fase 1: Setup do Projeto
- Inicialização do repositório Next.js 14
- Configuração do Prisma + PostgreSQL
- Design system base (Tailwind + tokens CSS)
- Estrutura de pastas

