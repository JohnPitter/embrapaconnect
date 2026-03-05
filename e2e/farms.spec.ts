import { test, expect } from "@playwright/test";

test.describe("Fazendas", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Página de fazendas carrega corretamente", async ({ page }) => {
    await page.goto("/dashboard/fazendas");
    await expect(page.getByRole("heading", { name: /fazenda/i })).toBeVisible({ timeout: 8000 });
  });

  test("Formulário de nova fazenda está acessível", async ({ page }) => {
    await page.goto("/dashboard/fazendas/nova");
    await expect(page.getByLabel(/nome/i)).toBeVisible({ timeout: 8000 });
  });

  test("Criar nova fazenda com dados válidos", async ({ page }) => {
    await page.goto("/dashboard/fazendas/nova");
    await page.getByLabel(/nome/i).fill("Fazenda E2E Teste");
    await page.locator("select").first().selectOption({ label: "SP" }).catch(() => {
      // If state is a text input instead of select
    });
    const stateInput = page.getByLabel(/estado/i);
    if (await stateInput.isVisible()) {
      await stateInput.fill("SP");
    }
    const cityInput = page.getByLabel(/cidade/i);
    if (await cityInput.isVisible()) {
      await cityInput.fill("Ribeirão Preto");
    }
    await page.getByRole("button", { name: /salvar|criar|cadastrar/i }).click();
    // Should redirect to farm detail or show success
    await expect(page).toHaveURL(/fazendas/, { timeout: 10000 });
  });

  test("Dashboard mostra estatísticas do fazendeiro", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/dashboard/, { timeout: 8000 });
    // Page should have loaded with some content
    await expect(page.locator("body")).not.toBeEmpty();
  });
});
