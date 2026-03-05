import { test, expect } from "@playwright/test";

test.describe("Avatar 3D", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("joao@fazenda.com");
    await page.getByLabel(/senha/i).fill("Farmer@2026");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("Página de avatar carrega", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    await expect(page.getByRole("heading", { name: /avatar/i })).toBeVisible({ timeout: 8000 });
  });

  test("Interface de customização está visível", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    // Tabs should be visible
    await expect(page.getByText(/pele|olhos|corpo/i)).toBeVisible({ timeout: 8000 });
  });

  test("Canvas 3D do avatar é renderizado", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    // Wait for the canvas to appear (3D scene loads asynchronously)
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });
  });

  test("Botão de salvar avatar está presente", async ({ page }) => {
    await page.goto("/dashboard/avatar");
    await expect(page.getByRole("button", { name: /salvar/i })).toBeVisible({ timeout: 8000 });
  });
});
