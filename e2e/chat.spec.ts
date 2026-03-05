import { test, expect } from "@playwright/test";

test.describe("Chat", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Página de chat carrega", async ({ page }) => {
    await page.goto("/dashboard/chat");
    await expect(page.getByRole("heading", { name: /chat|embrapa/i })).toBeVisible({ timeout: 8000 });
  });

  test("Input de mensagem está presente", async ({ page }) => {
    await page.goto("/dashboard/chat");
    await expect(page.getByPlaceholder(/mensagem|escreva/i)).toBeVisible({ timeout: 10000 });
  });

  test("Botão de alerta está presente", async ({ page }) => {
    await page.goto("/dashboard/chat");
    // Alert toggle button
    await expect(page.locator("button[title*='alerta'], button[title*='Alerta']").or(
      page.getByRole("button", { name: /alerta/i })
    )).toBeVisible({ timeout: 10000 });
  });
});
