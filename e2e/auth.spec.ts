import { test, expect } from "@playwright/test";

test.describe("Autenticação", () => {
  test("Login com credenciais válidas (fazendeiro)", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Login inválido mostra mensagem de erro", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("errado@teste.com");
    await page.getByLabel(/senha/i).fill("senhaerrada123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/inválido|incorreto|credenciais/i)).toBeVisible({ timeout: 8000 });
  });

  test("Rota /dashboard redireciona para login sem autenticação", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });

  test("Rota /admin redireciona para login sem autenticação", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });

  test("Solicitar recuperação de senha", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByText(/enviado|verifique|email/i)).toBeVisible({ timeout: 8000 });
  });

  test("Login como admin redireciona para /admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@embrapa.br");
    await page.getByLabel(/senha/i).fill("Admin@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/admin/, { timeout: 10000 });
  });

  test("Logout redireciona para login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await page.getByRole("button", { name: /sair|logout|encerrar/i }).click();
    await expect(page).toHaveURL(/login/, { timeout: 8000 });
  });
});
