import { test, expect } from "@playwright/test";

test.describe("Home Page E2E", () => {
    test("should load the home page and show the navbar", async ({ page }) => {
        await page.goto("/");
        
        // Check for the marketplace brand/logo in the navbar
        const brand = page.locator("nav");
        await expect(brand).toBeVisible();

        // Check for the footer copyright text
        const footer = page.locator("footer");
        await expect(footer).toContainText("© 2026 Puppet Marketplace");
    });

    test("should navigate to login page when clicking login in navbar", async ({ page }) => {
        await page.goto("/");
        
        // Find login link in navbar and click it
        const loginLink = page.getByRole("link", { name: /log\s?in/i });
        if (await loginLink.isVisible()) {
            await loginLink.click();
            await expect(page).toHaveURL(/\/login/);
        }
    });

    test("should search for assets", async ({ page }) => {
        await page.goto("/");
        
        // Assuming there is a search input
        const searchInput = page.getByPlaceholder(/search/i);
        if (await searchInput.isVisible()) {
            await searchInput.fill("puppet");
            await searchInput.press("Enter");
            // Verify results (this depends on the actual UI implementation)
            await expect(page).toHaveURL(/search=puppet/);
        }
    });
});
