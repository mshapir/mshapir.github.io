import { test, expect } from '@playwright/test';
import { AccessFlowSDK } from '@acsbe/accessflow-sdk';

// Initialize SDK with API key from environment variable
// Make sure ACCESSFLOW_SDK_API_KEY is set in your environment
AccessFlowSDK.init({ apiKey: process.env.ACCESSFLOW_SDK_API_KEY || 'flow-1fmUFV0mZW4duaYYMYQ000vMpUz5fEBEwE' });

test.describe('Accessibility Tests', () => {
  
  test('Homepage - accessibility audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto('/');
    await expect(page).toHaveTitle(/AccessFlow Demo/);
    
    // Run accessibility audit
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'json');
    
    console.log('Accessibility Summary:', summary);
  });

  test('Products page - accessibility audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('.products-grid');
    
    // Run accessibility audit
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    
    console.log('Products page accessibility summary:', summary);
  });

  test('Login page - accessibility audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto('/login');
    
    // Verify form is present
    await expect(page.locator('form')).toBeVisible();
    
    // Run accessibility audit
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'json');
    
    console.log('Login page accessibility summary:', summary);
  });

  test('Product details - accessibility audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto('/products/1');
    
    // Wait for product details to load
    await page.waitForSelector('.product-details');
    
    // Run accessibility audit
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'html');
    
    console.log('Product details accessibility summary:', summary);
  });

  test('Cart page - accessibility audit', async ({ page }, testInfo) => {
    const sdk = new AccessFlowSDK(page, testInfo);
    
    await page.goto('/cart');
    
    // Run accessibility audit
    const audits = await sdk.audit();
    const summary = sdk.generateReport(audits, 'json');
    
    console.log('Cart page accessibility summary:', summary);
  });
});
