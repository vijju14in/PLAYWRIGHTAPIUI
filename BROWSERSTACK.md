# BrowserStack Integration Guide

This framework supports running tests on BrowserStack cloud infrastructure for cross-browser and cross-platform testing.

## Prerequisites

1. **BrowserStack Account**
   - Sign up at https://www.browserstack.com/
   - Get your username and access key from Account Settings

2. **Install BrowserStack Package** (Optional but recommended)
   ```bash
   npm install --save-dev @browserstack/playwright-browserstack
   ```

## Setup

### 1. Environment Variables

Set your BrowserStack credentials as environment variables:

```bash
# Linux/macOS
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"

# Windows (CMD)
set BROWSERSTACK_USERNAME=your_username
set BROWSERSTACK_ACCESS_KEY=your_access_key

# Windows (PowerShell)
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
```

### 2. Create .env.browserstack (Optional)

Create a `.env.browserstack` file in the project root:

```bash
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

**Important**: Add `.env.browserstack` to `.gitignore` to keep credentials secure!

## Running Tests on BrowserStack

### Run All BrowserStack Tests

```bash
BROWSERSTACK_USERNAME=your_username BROWSERSTACK_ACCESS_KEY=your_key \
npx playwright test --config=browserstack.config.ts
```

### Run Specific Browser/Platform

```bash
# Chrome on Windows
npx playwright test --config=browserstack.config.ts --project=chrome-win-app1-ui

# Safari on macOS
npx playwright test --config=browserstack.config.ts --project=safari-mac-app1-ui

# Chrome on Android
npx playwright test --config=browserstack.config.ts --project=chrome-android-app1-ui

# Safari on iOS
npx playwright test --config=browserstack.config.ts --project=safari-ios-app1-ui
```

### Run with Different Environments

```bash
# Staging environment
ENV=staging BROWSERSTACK_USERNAME=xxx BROWSERSTACK_ACCESS_KEY=xxx \
npx playwright test --config=browserstack.config.ts

# Production environment
ENV=prod REGION=eu BROWSERSTACK_USERNAME=xxx BROWSERSTACK_ACCESS_KEY=xxx \
npx playwright test --config=browserstack.config.ts
```

## Available BrowserStack Projects

### Desktop Browsers

- `chrome-win-app1-ui` - Chrome on Windows 11
- `edge-win-app1-ui` - Edge on Windows 11
- `safari-mac-app1-ui` - Safari on macOS Ventura

### Mobile Browsers

- `chrome-android-app1-ui` - Chrome on Google Pixel 7 (Android 13)
- `safari-ios-app1-ui` - Safari on iPhone 14 (iOS 16)

### API and Combined Tests

- `app2-api-browserstack` - API tests on BrowserStack
- `app3-combined-browserstack` - Combined API/UI tests on BrowserStack

## BrowserStack Configuration Options

The `browserstack.config.ts` file includes the following BrowserStack-specific options:

- **browserstack.debug**: Enables visual logs and screenshots
- **browserstack.console**: Captures console logs (verbose mode)
- **browserstack.networkLogs**: Captures network logs
- **project**: Groups tests under a project name
- **build**: Identifies test runs (uses timestamp by default)
- **name**: Names individual test sessions

## Viewing Test Results

### BrowserStack Dashboard

1. Log in to https://automate.browserstack.com/
2. View live test execution
3. Access screenshots, videos, and logs
4. Analyze test failures

### Local Reports

Reports are generated in:
- `browserstack-report/` - HTML report
- `test-results/browserstack-results.json` - JSON results
- `test-results/browserstack-junit.xml` - JUnit XML

View HTML report:
```bash
npx playwright show-report browserstack-report
```

## CI/CD Integration

### Azure DevOps

Add BrowserStack credentials as pipeline variables:

```yaml
variables:
  BROWSERSTACK_USERNAME: $(BROWSERSTACK_USERNAME)
  BROWSERSTACK_ACCESS_KEY: $(BROWSERSTACK_ACCESS_KEY)

steps:
  - script: |
      npx playwright test --config=browserstack.config.ts
    displayName: 'Run BrowserStack Tests'
    env:
      BROWSERSTACK_USERNAME: $(BROWSERSTACK_USERNAME)
      BROWSERSTACK_ACCESS_KEY: $(BROWSERSTACK_ACCESS_KEY)
```

### GitHub Actions

Add secrets in repository settings:
- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

```yaml
- name: Run BrowserStack Tests
  env:
    BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
    BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
  run: npx playwright test --config=browserstack.config.ts
```

## Parallel Execution

BrowserStack supports concurrent test sessions. The framework is configured for 5 parallel workers.

Adjust in `browserstack.config.ts`:
```typescript
workers: 5, // Number of concurrent BrowserStack sessions
```

**Note**: Check your BrowserStack plan for parallel session limits.

## Best Practices

1. **Use Build Names**: Set unique build identifiers for tracking
   ```bash
   BUILD_ID="Build-$(date +%Y%m%d-%H%M%S)" \
   npx playwright test --config=browserstack.config.ts
   ```

2. **Filter Tests**: Run only relevant tests on BrowserStack to save minutes
   ```bash
   npx playwright test tests/app1-ui/login.spec.ts --config=browserstack.config.ts
   ```

3. **Local Testing**: Test locally first before running on BrowserStack

4. **Session Management**: Monitor your BrowserStack session usage

5. **Debugging**: Enable verbose logging for troubleshooting
   ```typescript
   'browserstack.console': 'verbose',
   'browserstack.debug': true,
   ```

## Troubleshooting

### Connection Issues

If you encounter connection errors:
1. Verify credentials are correct
2. Check BrowserStack service status
3. Ensure network allows WebSocket connections
4. Review BrowserStack plan limits

### Test Failures

1. Check BrowserStack dashboard for detailed logs
2. Review screenshots and videos
3. Verify browser/OS compatibility
4. Check network logs for API issues

### Performance

- Reduce parallel workers if experiencing timeouts
- Use specific browser projects instead of running all
- Filter tests to essential scenarios for cloud execution

## Support

- BrowserStack Docs: https://www.browserstack.com/docs/automate/playwright
- Playwright BrowserStack: https://playwright.dev/docs/ci-intro#browserstack
- Framework Issues: Create an issue in the repository

## Cost Optimization

- Run smoke tests on BrowserStack, full suite locally
- Use parallel sessions wisely based on plan limits
- Schedule nightly runs instead of per-commit
- Focus on critical browser/platform combinations
