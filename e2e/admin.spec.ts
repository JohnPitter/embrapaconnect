import { test, expect } from "@playwright/test";

test.describe("Painel Admin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@embrapa.br");
    await page.getByLabel(/senha/i).fill("Admin@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/admin/, { timeout: 10000 });
  });

  test("Dashboard admin carrega com stats", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 8000 });
    await expect(page.getByText(/fazenda/i)).toBeVisible({ timeout: 8000 });
  });

  test("Página de fazendas do admin carrega", async ({ page }) => {
    await page.goto("/admin/fazendas");
    await expect(page.getByRole("heading", { name: /fazenda/i })).toBeVisible({ timeout: 8000 });
  });

  test("Tabela de fazendas é exibida", async ({ page }) => {
    await page.goto("/admin/fazendas");
    await expect(page.getByRole("table")).toBeVisible({ timeout: 8000 });
  });

  test("Página de usuários do admin carrega", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(page.getByRole("heading", { name: /produtor/i })).toBeVisible({ timeout: 8000 });
  });

  test("Tabela de usuários é exibida", async ({ page }) => {
    await page.goto("/admin/usuarios");
    await expect(page.getByRole("table")).toBeVisible({ timeout: 8000 });
  });

  test("Página do mapa do admin carrega", async ({ page }) => {
    await page.goto("/admin/mapa");
    // Map page should at least show a heading
    await expect(page.getByRole("heading", { name: /mapa/i })).toBeVisible({ timeout: 8000 });
  });

  test("Página de chat admin carrega", async ({ page }) => {
    await page.goto("/admin/chat");
    await expect(page.getByRole("heading", { name: /chat/i })).toBeVisible({ timeout: 8000 });
  });

  test("Farmer não pode acessar /admin", async ({ page }) => {
    // Login as farmer first
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    // Try to access admin
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/^.*\/admin$/, { timeout: 8000 });
  });
});
