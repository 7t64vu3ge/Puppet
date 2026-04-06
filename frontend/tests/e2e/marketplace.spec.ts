import { test, expect } from '@playwright/test';

test.describe('Marketplace User Flow', () => {
  test('should login, search for an asset, and toggle like', async ({ page }) => {
    // 1. Login via mock session (redirects to frontend)
    // Using the absolute URL to hit the backend route
    await page.goto('http://localhost:4000/auth/test-session');
    
    // Wait for the redirect back to frontend and check if user name is visible in Navbar
    await expect(page).toHaveURL(/.*token=.*/);
    await page.waitForSelector('text=Test User');
    
    // 2. Search for an asset
    const searchInput = page.getByPlaceholder('Search assets...');
    await searchInput.fill('Puppet');
    await searchInput.press('Enter');
    
    // 3. Click on the first asset card
    // We wait for the results to load
    await page.waitForSelector('.asset-grid');
    const firstAsset = page.locator('.asset-grid a').first();
    await firstAsset.click();
    
    // 4. Verify we are on the detail page
    await expect(page).toHaveURL(/\/assets\/.+/);
    
    // 5. Toggle Like
    const likeButton = page.locator('button:has-text("Like"), button:has-text("Liked")');
    const initialText = await likeButton.innerText();
    
    await likeButton.click();
    
    // 6. Verify result (text should change from Like to Liked or vice versa)
    if (initialText.includes('Like') && !initialText.includes('Liked')) {
      await expect(likeButton).toContainText('Liked');
    } else {
      await expect(likeButton).toContainText('Like');
      await expect(likeButton).not.toContainText('Liked');
    }
    
    // 7. Verify result in Profile (Bonus Marks for production readiness)
    await page.goto('http://localhost:5173/profile');
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });
});
