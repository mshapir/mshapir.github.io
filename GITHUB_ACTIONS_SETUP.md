# Setting Up GitHub Actions for Accessibility Testing

## Overview

The GitHub Actions workflow will automatically:
- ✅ Run accessibility tests on every push
- ✅ Test your live GitHub Pages site
- ✅ Upload results to accessFlow platform
- ✅ Fail the build if thresholds are exceeded
- ✅ Generate and save HTML/JSON reports

## Setup Steps

### 1. Add API Key as GitHub Secret

Your accessFlow API key needs to be added as a GitHub secret:

1. Go to your GitHub repository: `https://github.com/mshapir/mshapir.github.io`
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add:
   - **Name**: `ACCESSFLOW_SDK_API_KEY`
   - **Value**: `flow-1fmUFV0mZW4duaYYMYQ000vMpUz5fEBEwE`
6. Click **Add secret**

### 2. Push the Workflow File

The workflow file is already created at `.github/workflows/accessibility-tests.yml`.

Commit and push it:

```bash
cd /Users/mannyshapir/Downloads/accessFlow-Demo-Env-master
git add .github/workflows/accessibility-tests.yml
git commit -m "Add accessibility testing workflow"
git push origin master
```

### 3. Verify It's Running

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see "Accessibility Tests" workflow running
4. Click on it to see the progress

## What Happens in CI

When running in GitHub Actions (CI environment):

### ✅ Automatic Upload to accessFlow
```
[AccessFlowSDK] Running in CI environment
[AccessFlowSDK] Uploading results to accessFlow platform...
[AccessFlowSDK] Upload successful!
```

### ✅ Threshold Enforcement
If issues exceed your thresholds:
- Extreme: 0 allowed → Build fails
- High: 5 allowed → Build fails if > 5
- Medium: 10 allowed → Build fails if > 10
- Low: 20 allowed → Build fails if > 20

### ✅ Reports Generated
- HTML report uploaded as artifact
- JSON reports attached to tests
- Results visible in accessFlow dashboard

## Workflow Triggers

The workflow runs on:
- **Push to master/main** - Automatic
- **Pull requests** - Tests before merge
- **Manual trigger** - Via "Run workflow" button in Actions tab

## Manual Trigger

To manually run the tests:
1. Go to **Actions** tab
2. Click **Accessibility Tests** workflow
3. Click **Run workflow** dropdown
4. Select branch (usually `master`)
5. Click **Run workflow**

## Viewing Results

### In GitHub Actions
- Go to Actions tab → Click on workflow run
- See test results, pass/fail status
- Download HTML report from Artifacts section

### In accessFlow Dashboard
- Log into accessFlow
- Navigate to Reports/Audits
- See automated test results with full details
- Track issues over time

## Testing Locally vs CI

### Local Testing (Current)
```bash
npm run test:prod
```
- ❌ Does NOT upload to accessFlow
- ✅ Generates local HTML/JSON reports
- ✅ Good for development

### CI Testing (GitHub Actions)
- ✅ Uploads to accessFlow automatically
- ✅ Runs on every push
- ✅ Enforces thresholds (fails build)
- ✅ Tracks history in accessFlow

## Troubleshooting

### "Secret not found" error
- Make sure you added `ACCESSFLOW_SDK_API_KEY` as a repository secret
- Check the secret name matches exactly (case-sensitive)

### Tests failing due to thresholds
- Check the test output to see which issues exceeded limits
- Fix the accessibility issues in your code
- Or adjust thresholds in `accessflow.config.json`

### No results in accessFlow dashboard
- Verify the API key is correct
- Check that the workflow completed successfully
- Look for SDK upload messages in the logs

## Next Steps

1. **Add the GitHub secret** (step 1 above)
2. **Push the workflow file** (step 2 above)
3. **Watch it run** in the Actions tab
4. **Check accessFlow dashboard** for uploaded results

Once set up, accessibility tests will run automatically on every push, keeping your site accessible! 🎉
