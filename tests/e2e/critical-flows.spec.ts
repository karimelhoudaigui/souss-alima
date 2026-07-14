import { expect, test } from "@playwright/test";

test("visitor can open programs and registration", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Institut Souss Alima" })).toBeVisible();
  await page.getByRole("link", { name: "Voir les programmes" }).click();
  await expect(page.getByRole("heading", { name: "Nos programmes" })).toBeVisible();
});

test("student login page is available", async ({ page }) => {
  await page.goto("/connexion");
  await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
});

test("mobile registration form renders", async ({ page }) => {
  await page.goto("/inscription");
  await expect(page.getByRole("heading", { name: "Demande d'inscription" })).toBeVisible();
});
