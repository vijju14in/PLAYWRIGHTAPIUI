# Playwright Automation Framework - Production Ready

A comprehensive, production-ready Playwright automation framework for API and UI testing using TypeScript. This framework demonstrates best practices in test automation with support for multiple environments, regions, and test types.

## Features

- **Multi-Environment Support**: Dev, Staging, Production configurations
- **Multi-Region Testing**: US, EU, Asia Pacific regions
- **Hybrid Testing**: Supports UI, API, and combined tests
- **Page Object Model**: Clean, maintainable page objects
- **Data-Driven Testing**: JSON-based test data per region
- **TypeScript**: Full type safety and IntelliSense support
- **Parallel Execution**: Run tests in parallel for faster execution
- **Rich Reporting**: HTML, JSON, and JUnit reports
- **CI/CD Ready**: GitHub Actions workflow included
- **Mock Server**: Built-in Express server for testing

## Project Structure

```
PLAYWRIGHTAPIUI/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml      # CI/CD configuration
├── config/
│   └── environment.config.ts         # Environment configuration
├── mock-server/
│   ├── server.ts                     # Mock Express server
│   └── public/                       # HTML pages for UI testing
│       ├── index.html
│       ├── login.html
│       ├── products.html
│       └── users.html
├── page-objects/
│   └── pages/                        # Page Object Models
│       ├── base.page.ts
│       ├── home.page.ts
│       ├── login.page.ts
│       ├── products.page.ts
│       └── users.page.ts
├── test-data/
│   ├── app1-ui/                      # UI test data
│   │   ├── us/
│   │   ├── eu/
│   │   └── asia/
│   ├── app2-api/                     # API test data
│   │   ├── us/
│   │   ├── eu/
│   │   └── asia/
│   └── app3-combined/                # Combined test data
│       ├── us/
│       ├── eu/
│       └── asia/
├── tests/
│   ├── app1-ui/                      # UI-only tests
│   │   ├── home.spec.ts
│   │   ├── login.spec.ts
│   │   ├── products.spec.ts
│   │   └── users.spec.ts
│   ├── app2-api/                     # API-only tests
│   │   ├── products-api.spec.ts
│   │   ├── users-api.spec.ts
│   │   └── health-login-api.spec.ts
│   └── app3-combined/                # Combined API + UI tests
│       ├── e2e-user-flow.spec.ts
│       └── api-ui-consistency.spec.ts
├── utils/
│   ├── api-helper.ts                 # API testing utilities
│   └── test-data-loader.ts           # Test data loader
├── .env.dev                          # Development environment
├── .env.staging                      # Staging environment
├── .env.prod                         # Production environment
├── playwright.config.ts              # Playwright configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd PLAYWRIGHTAPIUI
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific App Tests

**App1 - UI Tests Only:**
```bash
npm run test:app1
# or
npm run test:ui
```

**App2 - API Tests Only:**
```bash
npm run test:app2
# or
npm run test:api
```

**App3 - Combined API + UI Tests:**
```bash
npm run test:app3
# or
npm run test:combined
```

### Run Tests by Environment

```bash
# Development (default)
npm run test:dev

# Staging
npm run test:staging

# Production
npm run test:prod
```

### Run Tests by Region

```bash
# US Region
npm run test:us

# EU Region
npm run test:eu

# Asia Pacific Region
npm run test:asia
```

### Combine Environment and Region

```bash
ENV=staging REGION=eu npm test
```

### Other Options

```bash
# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run with UI mode
npm run ui
```

## Mock Server

The framework includes a built-in Express server with sample UI pages and API endpoints for testing.

### Start Mock Server

```bash
npm run start:mock
```

The server will start on `http://localhost:3000`

### Available Pages

- **Home**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Products**: http://localhost:3000/products
- **Users**: http://localhost:3000/users

### API Endpoints

#### Health Check
- `GET /api/health` - Health check endpoint

#### Products
- `GET /api/products` - Get all products
- `GET /api/products?region=us` - Get products by region
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product

#### Users
- `GET /api/users` - Get all users
- `GET /api/users?region=us` - Get users by region
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Authentication
- `POST /api/login` - User login

### Test Credentials

```
Username: john_us, jane_eu, or bob_asia
Password: password123
```

## Test Data

Test data is organized by app and region in JSON format:

```
test-data/
├── app1-ui/
│   ├── us/login.json
│   ├── eu/login.json
│   └── asia/login.json
├── app2-api/
│   ├── us/products.json
│   ├── eu/products.json
│   └── asia/products.json
└── app3-combined/
    ├── us/e2e-scenarios.json
    ├── eu/e2e-scenarios.json
    └── asia/e2e-scenarios.json
```

### Loading Test Data

```typescript
import { TestDataLoader } from './utils/test-data-loader';

// Load data for current region (from env)
const data = TestDataLoader.load('app1-ui', 'login.json');

// Load data for specific region
const usData = TestDataLoader.load('app1-ui', 'login.json', 'us');

// Load data for all regions
const allData = TestDataLoader.loadAllRegions('app1-ui', 'login.json');
```

## Reports

After running tests, view the HTML report:

```bash
npm run report
```

Reports are generated in:
- `playwright-report/` - HTML report
- `test-results/` - JSON and JUnit reports

## CI/CD Integration

The framework includes a GitHub Actions workflow that:

- Runs tests on push and pull requests
- Tests across all regions (US, EU, Asia)
- Generates and uploads test reports
- Supports manual workflow dispatch

## Best Practices Implemented

1. **Page Object Model**: Encapsulates UI elements and interactions
2. **Data-Driven Testing**: Separates test data from test logic
3. **Environment Configuration**: Easy environment switching
4. **API Helper Utilities**: Reusable API testing methods
5. **Parallel Execution**: Faster test execution
6. **Comprehensive Reporting**: Multiple report formats
7. **Type Safety**: Full TypeScript implementation
8. **Test Organization**: Clear separation of test types
9. **Clean Code**: Readable and maintainable test code
10. **CI/CD Ready**: Automated testing pipeline

## Framework Architecture

### 3 Test Apps

1. **App1 - UI Testing Only**
   - Pure UI automation tests
   - Uses Page Object Model
   - Tests user interactions and UI elements
   - Example: Login, navigation, form submissions

2. **App2 - API Testing Only**
   - Pure API testing
   - Uses API Helper utilities
   - Tests endpoints, responses, and data
   - Example: CRUD operations, authentication

3. **App3 - Combined API + UI Testing**
   - End-to-end scenarios
   - Combines API and UI testing
   - Tests data consistency between API and UI
   - Example: Create via API, verify in UI

## Environment Configuration

Environment variables are loaded from `.env.{ENV}` files:

- `.env.dev` - Development environment
- `.env.staging` - Staging environment
- `.env.prod` - Production environment

Configure:
- Base URLs
- API endpoints
- Timeouts
- Default region
- Browser settings

## Region Support

The framework supports three regions with different:
- Currencies (USD, EUR, JPY)
- Test data
- User accounts
- Products

This demonstrates how to handle multi-region testing scenarios.

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## Troubleshooting

### Mock server not starting
```bash
# Check if port 3000 is available
lsof -ti:3000

# Kill process if needed
kill -9 <PID>
```

### Tests failing
```bash
# Run in headed mode to see what's happening
npm run test:headed

# Run specific test file
npx playwright test tests/app1-ui/login.spec.ts
```

### Playwright browsers not installed
```bash
npx playwright install
```

## License

ISC

## Author

Built with Playwright + TypeScript