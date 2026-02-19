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
// 1. Static page audits — run in parallel, 1 audit each
// ---------------------------------------------------------------------------

test.describe('Static Page Audits', () => {
  test('Home page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/');
    await expect(page).toHaveTitle(/AccessFlow Demo/);
    sdk.generateReport(await sdk.audit(), 'json');
  });

  test('Products listing page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');
    sdk.generateReport(await sdk.audit(), 'html');
  });

  test('Login page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    sdk.generateReport(await sdk.audit(), 'json');
  });

  test('About page (intentionally inaccessible)', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/about');
    await page.waitForSelector('.about-hero');
    sdk.generateReport(await sdk.audit(), 'html');
  });
});

// ---------------------------------------------------------------------------
// 2. Dynamic states — navigate to the most interesting state, then audit once
// ---------------------------------------------------------------------------

test.describe('Dynamic State Audits', () => {
  // Audit the empty search result state — most distinct from base products page
  test('Products: empty search results state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');
    await page.fill('input[type="search"], input[placeholder*="Search"]', 'xyznonexistentproduct12345');
    await page.waitForSelector('.no-products');
    sdk.generateReport(await sdk.audit(), 'json');
  });

  // Audit the quick view modal open state — rich dynamic content
  test('Quick View modal open state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');
    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');
    sdk.generateReport(await sdk.audit(), 'html');

    // Verify Escape closes modal (no extra audit needed)
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  // Audit login form with visible validation errors — most interesting form state
  test('Login form: validation error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.alert-error');
    sdk.generateReport(await sdk.audit(), 'json');
  });
});

// ---------------------------------------------------------------------------
// 3. Full E2E purchase flow — 1 user session, audit only key states
//    Key states: checkout form, checkout validation errors, order success
// ---------------------------------------------------------------------------

test.describe('Full Purchase Flow', () => {
  test('Register → add to cart → checkout (errors + success)', async ({ page }, testInfo) => {
    test.setTimeout(180000);
    const sdk = new AccessFlowSDK(page, testInfo);
    const email = `flow_${Date.now()}@test.com`;
    const password = 'TestPass123';

    // Register and navigate to products (no audit — same as static page audit)
    await registerAndLogin(page, email, password, 'Flow Tester');
    await addProductToCart(page);

    // Audit 1: checkout form in clean valid state
    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');
    sdk.generateReport(await sdk.audit(), 'html');

    // Audit 2: checkout form with validation errors visible
    await page.click('button[type="submit"]');
    await page.waitForTimeout(400);
    sdk.generateReport(await sdk.audit(), 'json');

    // Fill form and submit
    await fillCheckoutForm(page, email);
    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });

    // Audit 3: order success page
    sdk.generateReport(await sdk.audit(), 'json');
  });
});

// ---------------------------------------------------------------------------
// 4. Profile with order history — audit the most data-rich authenticated state
// ---------------------------------------------------------------------------

test.describe('Authenticated Workflows', () => {
  test('Profile page with order history', async ({ page }, testInfo) => {
    test.setTimeout(180000);
    const sdk = new AccessFlowSDK(page, testInfo);
    const email = `profile_${Date.now()}@test.com`;
    const password = 'TestPass123';

    await registerAndLogin(page, email, password, 'Profile Tester');
    await addProductToCart(page);

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');
    await fillCheckoutForm(page, email);
    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });

    await page.goto('/profile');
    await page.waitForSelector('.profile-page, .profile-container, h1');
    sdk.generateReport(await sdk.audit(), 'html');
  });
});
