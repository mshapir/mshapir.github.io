# Accessibility Testing with accessFlow SDK

This project is configured with automated accessibility testing using the accessFlow SDK and Playwright.

## Setup Complete ✅

- ✅ Playwright installed
- ✅ accessFlow SDK (v1.0.2) installed
- ✅ Configuration files created
- ✅ Test suite created
- ✅ Chromium browser installed

## Configuration Files

### `accessflow.config.json`
Defines thresholds for accessibility issues:
- **Extreme**: 0 allowed
- **High**: 5 allowed
- **Medium**: 10 allowed
- **Low**: 20 allowed

If these thresholds are exceeded, tests will fail.

### `playwright.config.ts`
Playwright configuration that:
- Runs tests against local preview server (`npm run preview`)
- Uses Chromium browser
- Includes global teardown for accessFlow SDK reports

### `tests/accessibility.spec.ts`
Test suite covering:
- Homepage
- Products page
- Product details page
- Login page
- Cart page

## Running Tests

### 1. Test Production Site (Live)
```bash
# Test your live GitHub Pages site
npm run test:prod

# This will test: https://mshapir.github.io
```

### 2. Test Local Build
```bash
# First, build your app
npm run build

# Then run tests against local preview
npm run test:local

# Make sure preview server is running: npm run preview
```

### 3. Other Test Commands
```bash
# Run with UI mode (interactive)
npm run test:ui

# Run with visible browser
npm run test:headed

# View test report
npm run test:report
```

### 3. Set API Key
The API key is already configured. It's read from:
- Environment variable: `ACCESSFLOW_SDK_API_KEY`
- Or hardcoded in the test file (current setup)

## Test Results

After running tests, you'll get:
- **Console output**: Summary of issues found per page
- **HTML reports**: Attached to Playwright test results (in `test-results/`)
- **JSON reports**: Also attached to test results
- **accessFlow dashboard**: Results uploaded automatically via global teardown

### Viewing Results in accessFlow Platform

**Yes, results are automatically uploaded!** The `global-teardown.ts` file calls the SDK's teardown function which:
1. Collects all audit results from your test run
2. Uploads them to your accessFlow account (using your API key)
3. Makes them visible in your accessFlow dashboard

To verify:
1. Run tests: `npm run test:prod`
2. Log into your accessFlow dashboard
3. Navigate to Reports or Audits section
4. You should see the test results with all issues found

**Note**: Make sure `ACCESSFLOW_SDK_API_KEY` environment variable is set, or the API key is configured in the test file.

## Interpreting Results

Each audit report shows:
- **Number of issues** by severity (extreme, high, medium, low)
- **Rule violations** with details:
  - Rule name and description
  - WCAG level and link
  - Number of occurrences
  - Selectors where issues were found

## Example Output

```json
{
  "numberOfIssuesFound": {
    "extreme": 0,
    "high": 2,
    "medium": 3,
    "low": 5
  },
  "ruleViolations": {
    "colorContrast": {
      "name": "Color Contrast",
      "severity": "medium",
      "numberOfOccurrences": 3,
      "WCAGLevel": "AA",
      "selectors": [".header .logo", ".button"]
    }
  }
}
```

## CI/CD Integration

To run these tests in CI/CD:

1. Set `ACCESSFLOW_SDK_API_KEY` environment variable
2. Run: `npm run build && npm test`
3. Tests will fail if thresholds are exceeded
4. Reports are uploaded to accessFlow dashboard

## Customizing Tests

### Add More Pages
Edit `tests/accessibility.spec.ts` and add new test cases:

```typescript
test('New page - accessibility audit', async ({ page }, testInfo) => {
  const sdk = new AccessFlowSDK(page, testInfo);
  await page.goto('/your-page');
  const audits = await sdk.audit();
  const summary = sdk.generateReport(audits, 'json');
});
```

### Adjust Thresholds
Edit `accessflow.config.json` to change acceptable issue counts.

### Change Report Format
In test files, change `'json'` to `'html'` in `generateReport()` calls.

## Troubleshooting

### CSP Errors
If you get "Content Security Policy" errors, the SDK script is being blocked. You may need to adjust CSP headers during testing.

### Build First
Always run `npm run build` before running tests, as tests run against the production build (`npm run preview`).

### Port Already in Use
If port 4173 is in use, the preview server won't start. Close other preview servers or change the port in `playwright.config.ts`.

## Resources

- [accessFlow SDK Documentation](https://support.accessibe.com/hc/en-us/articles/29302526292242-accessFlow-SDK)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
