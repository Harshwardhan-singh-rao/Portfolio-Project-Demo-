import { expect, test } from "@playwright/test";

test("smoke: renders 5 columns with seed data", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("column-backlog")).toBeVisible();
  await expect(page.getByTestId("column-todo")).toBeVisible();
  await expect(page.getByTestId("column-inProgress")).toBeVisible();
  await expect(page.getByTestId("column-review")).toBeVisible();
  await expect(page.getByTestId("column-done")).toBeVisible();
  await expect(page.getByText("Kanban")).toBeVisible();
});

test("rename: can rename a column", async ({ page }) => {
  await page.goto("/");
  const todoColumn = page.getByTestId("column-todo");

  await todoColumn.getByRole("button").first().click();
  const input = todoColumn.getByRole("textbox", { name: "Rename column" });
  await input.fill("Up next");
  await input.press("Enter");

  await expect(todoColumn.getByRole("button").first()).toContainText("Up next");
});

test("add/delete: can add a card and delete it", async ({ page }) => {
  await page.goto("/");
  const backlog = page.getByTestId("column-backlog");

  await backlog.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Title").fill("E2E card");
  await page.getByLabel("Details").fill("Created by Playwright.");
  await page.getByRole("button", { name: "Create" }).click();

  const card = backlog.getByText("E2E card");
  await expect(card).toBeVisible();

  // delete (hover not required for click in Playwright)
  const cardBody = backlog.locator('article:has-text("E2E card")').first();
  await cardBody.hover();
  await cardBody.getByRole("button", { name: "Delete card" }).click();
  await expect(backlog.getByText("E2E card")).toHaveCount(0);
});

test("drag/drop: can move a card between columns", async ({ page }) => {
  await page.goto("/");

  const from = page.getByTestId("column-backlog");
  const to = page.getByTestId("column-done");

  const firstCard = from.locator('[data-testid^="card-"]').first();
  const cardTitle = await firstCard.locator("h3").textContent();
  expect(cardTitle).toBeTruthy();

  const sourceBox = await firstCard.boundingBox();
  const targetBox = await page.getByTestId("column-drop-done").boundingBox();
  expect(sourceBox).toBeTruthy();
  expect(targetBox).toBeTruthy();

  await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + 24, { steps: 12 });
  await page.mouse.up();

  await expect(to.getByText(cardTitle!)).toBeVisible();
});

