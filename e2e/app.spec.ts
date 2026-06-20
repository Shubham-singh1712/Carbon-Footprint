import { test, expect } from "@playwright/test";

test.describe("CarbonTwin AI E2E", () => {
  test("landing page loads and displays hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Understand");
    await expect(page.locator("h1")).toContainText("Predict");
    await expect(page.locator("h1")).toContainText("Reduce");
  });

  test("can navigate to dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Mission Control")).toBeVisible();
  });

  test("onboarding wizard loads", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.locator("text=Build your Digital Carbon Twin")).toBeVisible();
    await expect(page.locator("text=Transportation")).toBeVisible();
  });

  test("onboarding flow completes", async ({ page }) => {
    await page.goto("/onboarding");

    // Step 1: Transport — click Continue
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: Home — click Continue
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Food — click Continue
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: Travel — click Continue
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 5: Shopping — click Calculate
    await page.getByRole("button", { name: "Calculate score" }).click();

    // Should show result
    await expect(page.locator("text=Your Carbon Health Score")).toBeVisible();
  });

  test("AI coach page loads", async ({ page }) => {
    await page.goto("/ai-coach");
    await expect(page.locator("text=AI Carbon Coach")).toBeVisible();
    await expect(page.locator("text=Carbon Coach")).toBeVisible();
  });

  test("simulator has interactive sliders", async ({ page }) => {
    await page.goto("/simulator");
    await expect(page.locator("text=Scenario Controls")).toBeVisible();
    await expect(page.locator("text=Modeled monthly footprint")).toBeVisible();
  });

  test("receipt scanner page loads", async ({ page }) => {
    await page.goto("/receipt-scanner");
    await expect(page.locator("text=Receipt Scanner")).toBeVisible();
  });

  test("forecast page loads", async ({ page }) => {
    await page.goto("/forecast");
    await expect(page.locator("text=Forecast Analytics")).toBeVisible();
  });

  test("challenges page loads", async ({ page }) => {
    await page.goto("/challenges");
    await expect(page.locator("text=Challenges")).toBeVisible();
  });

  test("impact center loads", async ({ page }) => {
    await page.goto("/impact");
    await expect(page.locator("text=Impact Center")).toBeVisible();
  });

  test("sign-in page loads", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.locator("text=Sign in")).toBeVisible();
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/auth/sign-up");
    await expect(page.locator("text=Create your account")).toBeVisible();
  });
});
