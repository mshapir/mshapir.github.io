import { test, expect, Page } from '@playwright/test';
import { AccessFlowSDK } from '@acsbe/accessflow-sdk';

AccessFlowSDK.init({
  apiKey: process.env.ACCESSFLOW_SDK_API_KEY || 'flow-1fmUFV0mZW4duaYYMYQ000vMpUz5fEBEwE',
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function registerAndLogin(page: Page, email: string, password: string, name = 'Test User') {
  await page.goto('/register');
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

async function addProductToCart(page: Page, productId = 1) {
  await page.goto(`/products/${productId}`);
  await page.waitForSelector('.product-details');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForSelector('.alert-success');
}

async function fillCheckoutForm(page: Page, email: string) {
  await page.fill('input[name="fullName"]', 'Flow Tester');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', '5551234567');
  await page.fill('input[name="address"]', '123 Main St');
  await page.fill('input[name="city"]', 'New York');
  await page.fill('input[name="state"]', 'NY');
  await page.fill('input[name="zipCode"]', '10001');
  await page.fill('input[name="cardNumber"]', '4111111111111111');
  await page.fill('input[name="cardExpiry"]', '12/26');
  await page.fill('input[name="cardCVV"]', '123');
}

// ---------------------------------------------------------------------------
// 1. Static page audits — run in parallel, no setup needed
// ---------------------------------------------------------------------------

test.describe('Static Page Audits', () => {
  test('Home page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/');
    await expect(page).toHaveTitle(/AccessFlow Demo/);
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Products listing page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Product details page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products/1');
    await page.waitForSelector('.product-details');
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Login page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Register page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/register');
    await expect(page.locator('form')).toBeVisible();
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Cart page (empty state)', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/cart');
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('About page (intentionally inaccessible)', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/about');
    await page.waitForSelector('.about-hero');
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });
});

// ---------------------------------------------------------------------------
// 2. Dynamic state audits — search & filter (single page, multiple states)
// ---------------------------------------------------------------------------

test.describe('Dynamic Search & Filter Workflow', () => {
  test('Audit after search, category filter, sort, and empty state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    // State 1: search query
    await page.fill('input[type="search"], input[placeholder*="Search"]', 'chair');
    await page.waitForTimeout(400);
    const searchAudits = await sdk.audit();
    sdk.generateReport(searchAudits, 'json');

    // State 2: category filter
    await page.fill('input[type="search"], input[placeholder*="Search"]', '');
    const categoryButton = page.locator('button', { hasText: /Furniture|Electronics|Lighting/i }).first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(300);
      const filterAudits = await sdk.audit();
      sdk.generateReport(filterAudits, 'html');
    }

    // State 3: sort applied
    const sortSelect = page.locator('select').first();
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 2 });
      await page.waitForTimeout(300);
      const sortAudits = await sdk.audit();
      sdk.generateReport(sortAudits, 'json');
    }

    // State 4: no results empty state
    await page.fill('input[type="search"], input[placeholder*="Search"]', 'xyznonexistentproduct12345');
    await page.waitForSelector('.no-products');
    const emptyAudits = await sdk.audit();
    sdk.generateReport(emptyAudits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 3. Product Quick View modal — all states in one test to avoid repeated setup
// ---------------------------------------------------------------------------

test.describe('Product Quick View Modal', () => {
  test('Audit modal open, tab switching, quantity change, and close', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    // Open modal
    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    // Audit modal open state
    const openAudits = await sdk.audit();
    sdk.generateReport(openAudits, 'html');

    // Switch tabs (no extra audit — saves ~10s, same page)
    await page.click('[role="tab"]:has-text("Features")');
    await page.waitForTimeout(200);
    await page.click('[role="tab"]:has-text("Shipping")');
    await page.waitForTimeout(200);
    await page.click('[role="tab"]:has-text("Description")');
    await page.waitForTimeout(200);

    // Quantity change + add to cart
    await page.click('[aria-label="Increase quantity"]');
    await page.click('[aria-label="Increase quantity"]');
    await page.click('.quickview-add-btn');
    await page.waitForSelector('.quickview-add-btn.added');

    // Audit the "added" feedback state
    const addedAudits = await sdk.audit();
    sdk.generateReport(addedAudits, 'json');

    // Close via Escape and verify modal gone
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 4. Form validation error states
// ---------------------------------------------------------------------------

test.describe('Form Validation Error States', () => {
  test('Login form — empty submit and invalid credentials', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');

    // Empty submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const emptyAudits = await sdk.audit();
    sdk.generateReport(emptyAudits, 'json');

    // Invalid credentials
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.alert-error');
    const invalidAudits = await sdk.audit();
    sdk.generateReport(invalidAudits, 'json');
  });

  test('Register form — empty submit error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 5. Full E2E purchase flow — single test, shared user session
// ---------------------------------------------------------------------------

test.describe('Full Purchase Flow', () => {
  test('Register → browse → quick view → add to cart → checkout → success', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    const email = `flow_${Date.now()}@test.com`;
    const password = 'TestPass123';

    // --- Register ---
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Flow Tester');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    const registerAudits = await sdk.audit();
    sdk.generateReport(registerAudits, 'json');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // --- Browse & Quick View ---
    await page.goto('/products');
    await page.waitForSelector('.products-grid');
    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');
    const quickViewAudits = await sdk.audit();
    sdk.generateReport(quickViewAudits, 'html');
    await page.keyboard.press('Escape');

    // --- Product Details & Add to Cart ---
    await addProductToCart(page);
    const detailsAudits = await sdk.audit();
    sdk.generateReport(detailsAudits, 'json');

    // --- Cart ---
    await page.goto('/cart');
    await page.waitForSelector('.cart-item, .cart-items, .cart-page');
    const cartAudits = await sdk.audit();
    sdk.generateReport(cartAudits, 'html');

    // --- Checkout form (valid state) ---
    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');
    const checkoutAudits = await sdk.audit();
    sdk.generateReport(checkoutAudits, 'html');

    // --- Checkout validation errors ---
    await page.click('button[type="submit"]');
    await page.waitForTimeout(400);
    const validationAudits = await sdk.audit();
    sdk.generateReport(validationAudits, 'json');

    // --- Fill and submit ---
    await fillCheckoutForm(page, email);
    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });
    const successAudits = await sdk.audit();
    sdk.generateReport(successAudits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 6. Profile management — single user, reused session
// ---------------------------------------------------------------------------

test.describe('Profile Management Workflow', () => {
  test('Profile page with order history', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    const email = `profile_${Date.now()}@test.com`;
    const password = 'TestPass123';

    // Register and complete an order to populate order history
    await registerAndLogin(page, email, password, 'Profile Tester');
    await addProductToCart(page);

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');
    await fillCheckoutForm(page, email);
    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });

    // Audit profile with order history
    await page.goto('/profile');
    await page.waitForSelector('.profile-page, .profile-container, h1');
    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });
});
