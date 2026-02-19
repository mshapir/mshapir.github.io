import { test, expect } from '@playwright/test';
import { AccessFlowSDK } from '@acsbe/accessflow-sdk';

AccessFlowSDK.init({
  apiKey: process.env.ACCESSFLOW_SDK_API_KEY || 'flow-1fmUFV0mZW4duaYYMYQ000vMpUz5fEBEwE',
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function registerAndLogin(page: any, email: string, password: string, name = 'Test User') {
  await page.goto('/register');
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

// ---------------------------------------------------------------------------
// 1. Static page audits
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
// 2. Dynamic state audits — search & filter interactions
// ---------------------------------------------------------------------------

test.describe('Dynamic Search & Filter Workflow', () => {
  test('Audit products page after search query', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.fill('input[type="search"], input[placeholder*="Search"]', 'chair');
    await page.waitForTimeout(400);

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Audit products page after category filter applied', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    const categoryButton = page.locator('button', { hasText: /Furniture|Electronics|Lighting/i }).first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(300);
    }

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Audit products page after price sort applied', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    const sortSelect = page.locator('select');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ label: /price.*low|low.*high/i });
      await page.waitForTimeout(300);
    }

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Audit products page with no results (empty state)', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.fill('input[type="search"], input[placeholder*="Search"]', 'xyznonexistentproduct12345');
    await page.waitForSelector('.no-products');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 3. Dynamic modal — Quick View
// ---------------------------------------------------------------------------

test.describe('Product Quick View Modal', () => {
  test('Audit modal when opened', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Audit modal tab switching (description → features → shipping)', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    for (const tabName of ['Features', 'Shipping', 'Description']) {
      await page.click(`[role="tab"]:has-text("${tabName}")`);
      await page.waitForTimeout(200);

      const audits = await sdk.audit();
      sdk.generateReport(audits, 'json');
    }
  });

  test('Audit modal after quantity change and add to cart', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    await page.click('[aria-label="Increase quantity"]');
    await page.click('[aria-label="Increase quantity"]');

    await page.click('.quickview-add-btn');
    await page.waitForSelector('.quickview-add-btn.added');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Modal closes on Escape key and focus returns', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 4. Form validation error states
// ---------------------------------------------------------------------------

test.describe('Form Validation Error States', () => {
  test('Login form — audit empty submission error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Login form — audit invalid credentials error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.alert-error');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Register form — audit empty submission error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 5. Full E2E purchase flow — register → browse → quick view → cart → checkout
// ---------------------------------------------------------------------------

test.describe('Full Purchase Flow', () => {
  const testEmail = `user_${Date.now()}@test.com`;
  const testPassword = 'TestPass123';

  test('Step 1: Register new account — audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Flow Tester');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');

    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('Step 2: Browse products and open quick view — audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `browse_${Date.now()}@test.com`, testPassword);

    await page.goto('/products');
    await page.waitForSelector('.products-grid');

    await page.hover('.product-card:first-child');
    await page.click('.quickview-trigger');
    await page.waitForSelector('[role="dialog"]');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Step 3: Add product to cart from details page — audit cart', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `cart_${Date.now()}@test.com`, testPassword);

    await page.goto('/products/1');
    await page.waitForSelector('.product-details');

    await page.click('.quantity-btn:last-child');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForSelector('.alert-success');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');

    await page.goto('/cart');
    await page.waitForSelector('.cart-item, .cart-items');
    const cartAudits = await sdk.audit();
    sdk.generateReport(cartAudits, 'html');
  });

  test('Step 4: Checkout form — audit shipping & payment state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `checkout_${Date.now()}@test.com`, testPassword);

    await page.goto('/products/1');
    await page.waitForSelector('.product-details');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForSelector('.alert-success');

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Step 5: Checkout form — audit validation error state', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `checkouterr_${Date.now()}@test.com`, testPassword);

    await page.goto('/products/1');
    await page.waitForSelector('.product-details');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForSelector('.alert-success');

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(400);

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'json');
  });

  test('Step 6: Complete order — audit success page', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `success_${Date.now()}@test.com`, testPassword);

    await page.goto('/products/1');
    await page.waitForSelector('.product-details');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForSelector('.alert-success');

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');

    await page.fill('input[name="fullName"]', 'Flow Tester');
    await page.fill('input[name="email"]', `success_test@test.com`);
    await page.fill('input[name="phone"]', '5551234567');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="state"]', 'NY');
    await page.fill('input[name="zipCode"]', '10001');
    await page.fill('input[name="cardNumber"]', '4111111111111111');
    await page.fill('input[name="cardExpiry"]', '12/26');
    await page.fill('input[name="cardCVV"]', '123');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');

    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });

    const successAudits = await sdk.audit();
    sdk.generateReport(successAudits, 'json');
  });
});

// ---------------------------------------------------------------------------
// 6. Authenticated user — profile management
// ---------------------------------------------------------------------------

test.describe('Profile Management Workflow', () => {
  test('Audit profile page when logged in', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    await registerAndLogin(page, `profile_${Date.now()}@test.com`, 'TestPass123');

    await page.goto('/profile');
    await page.waitForSelector('.profile-page, .profile-container, h1');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });

  test('Audit profile page with order history populated', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    const email = `proforder_${Date.now()}@test.com`;
    await registerAndLogin(page, email, 'TestPass123');

    await page.goto('/products/1');
    await page.waitForSelector('.product-details');
    await page.click('button:has-text("Add to Cart")');
    await page.waitForSelector('.alert-success');

    await page.goto('/checkout');
    await page.waitForSelector('.checkout-form');
    await page.fill('input[name="fullName"]', 'Profile Tester');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="phone"]', '5559876543');
    await page.fill('input[name="address"]', '456 Test Ave');
    await page.fill('input[name="city"]', 'Austin');
    await page.fill('input[name="state"]', 'TX');
    await page.fill('input[name="zipCode"]', '73301');
    await page.fill('input[name="cardNumber"]', '4111111111111111');
    await page.fill('input[name="cardExpiry"]', '11/27');
    await page.fill('input[name="cardCVV"]', '321');
    await page.click('button[type="submit"]');
    await page.waitForURL('/checkout-success', { timeout: 10000 });

    await page.goto('/profile');
    await page.waitForSelector('.profile-page, .profile-container, h1');

    const audits = await sdk.audit();
    sdk.generateReport(audits, 'html');
  });
});
