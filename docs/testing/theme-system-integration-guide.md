# Theme System Integration Testing Guide

## Overview

This guide documents the comprehensive integration testing suite for the Aha Agile theme system, covering all aspects from component testing to production deployment strategies.

## Test Architecture

### Test Organization

```
tests/
├── integration/              # Integration tests
│   ├── theme-system.test.tsx
│   └── cross-page-theme-validation.test.tsx
├── visual/                   # Visual regression tests
│   └── theme-regression.test.ts
├── performance/              # Performance tests
│   └── theme-performance.test.ts
└── e2e/                     # End-to-end tests
    └── theme-switching.spec.ts
```

### Test Categories

#### 1. Integration Tests (`tests/integration/`)

**Theme System Integration** (`theme-system.test.tsx`)
- Theme switcher component functionality
- Component theme compatibility
- Theme persistence and storage
- State consistency across components
- Error handling and graceful degradation
- Accessibility integration

**Cross-Page Theme Validation** (`cross-page-theme-validation.test.tsx`)
- Homepage theme integration
- Services page theme compatibility
- Case study page theme handling
- Consultation page theme support
- Theme persistence across navigation
- Component interaction testing

#### 2. Visual Regression Tests (`tests/visual/`)

**Theme Regression Testing** (`theme-regression.test.ts`)
- Homepage visual consistency
- Services page visual integrity
- Component-level visual tests
- Theme switcher visual states
- Responsive design validation
- Interaction state capturing

#### 3. Performance Tests (`tests/performance/`)

**Theme Performance Monitoring** (`theme-performance.test.ts`)
- Core Web Vitals with theme system
- Theme switching performance
- Mode toggle efficiency
- Memory usage and resource impact
- Device-specific performance
- Concurrent interaction handling

#### 4. End-to-End Tests (`tests/e2e/`)

**Theme Switching Workflows** (`theme-switching.spec.ts`)
- Complete user workflows
- Cross-browser compatibility
- Theme persistence across sessions
- Error handling in real environments
- Accessibility compliance
- Mobile and tablet functionality

## Running Tests

### Local Development

```bash
# Run all integration tests
npm test -- tests/integration/

# Run specific test suite
npm test -- tests/integration/theme-system.test.tsx

# Run with coverage
npm test -- --coverage tests/integration/

# Watch mode for development
npm test -- --watch tests/integration/
```

### Visual Regression Tests

```bash
# Run Playwright visual tests
npx playwright test tests/visual/

# Update visual baselines
npx playwright test tests/visual/ --update-snapshots

# Run specific browser
npx playwright test tests/visual/ --project=chromium
```

### Performance Tests

```bash
# Run performance tests
npx playwright test tests/performance/

# Generate performance report
npx playwright test tests/performance/ --reporter=html
```

### End-to-End Tests

```bash
# Run E2E tests
npx playwright test tests/e2e/

# Run in headed mode for debugging
npx playwright test tests/e2e/ --headed

# Run specific test
npx playwright test tests/e2e/theme-switching.spec.ts
```

## Test Coverage Requirements

### Integration Test Coverage
- **Theme Context**: 100% function and branch coverage
- **Component Rendering**: >95% coverage across all themes
- **Error Handling**: 100% coverage of error scenarios
- **Accessibility**: Full keyboard navigation and screen reader testing

### Visual Test Coverage
- All page layouts with all theme combinations
- Component states (hover, focus, active)
- Responsive breakpoints (mobile, tablet, desktop)
- Theme switcher states (collapsed, expanded, loading)

### Performance Test Coverage
- Core Web Vitals monitoring
- Theme switching performance (<300ms)
- Memory leak detection
- Resource loading optimization

## Configuration

### Jest Integration Tests

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/lib/theme-*.{ts,tsx}',
    'src/components/ui/ThemeSwitcher.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'visual-tests',
      testMatch: 'tests/visual/**/*.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance-tests',
      testMatch: 'tests/performance/**/*.test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e-tests',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Theme System Tests

on: [push, pull_request]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run integration tests
        run: npm test -- tests/integration/ --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run visual regression tests
        run: npx playwright test tests/visual/
      
      - name: Upload visual test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: visual-test-results
          path: test-results/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run performance tests
        run: npx playwright test tests/performance/
      
      - name: Generate performance report
        run: npx playwright show-report
```

## Test Data and Fixtures

### Theme Configuration Test Data

```typescript
// tests/fixtures/theme-data.ts
export const TEST_THEMES = [
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue ocean tones',
    colors: {
      primary: 'hsl(200 100% 25%)',
      accent: 'hsl(180 100% 35%)',
      background: 'hsl(200 30% 98%)',
    }
  },
  // ... other themes
];

export const TEST_MODES = ['light', 'dark'] as const;

export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  THEME_SWITCH_TIME: 300,
};
```

### Mock Utilities

```typescript
// tests/utils/mocks.ts
export const mockThemeLoader = () => {
  jest.mock('@/lib/theme-loader', () => ({
    applyThemeWithTransition: jest.fn(),
    initializeThemeLoader: jest.fn(),
  }));
};

export const mockNavigation = () => {
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));
};
```

## Debugging and Troubleshooting

### Common Issues

1. **Test Environment Setup**
   ```bash
   # Ensure jsdom environment for integration tests
   # Add to test file: @jest-environment jsdom
   ```

2. **Async State Updates**
   ```typescript
   // Use waitFor for async state changes
   await waitFor(() => {
     expect(screen.getByText('Expected text')).toBeInTheDocument();
   });
   ```

3. **Environment Variable Mocking**
   ```typescript
   // Properly mock NODE_ENV
   (process.env as any).NODE_ENV = 'development';
   ```

4. **Component Mocking**
   ```typescript
   // Mock complex components to avoid dependencies
   jest.mock('@/components/layout/Header', () => {
     return function MockHeader() {
       return <header data-testid="header">Header</header>;
     };
   });
   ```

### Debug Utilities

```typescript
// tests/utils/debug.ts
export const debugComponent = (component: ReactWrapper) => {
  console.log(component.debug());
};

export const logThemeState = () => {
  const stored = localStorage.getItem('aha-agile-theme-preferences');
  console.log('Theme state:', stored ? JSON.parse(stored) : 'None');
};
```

## Best Practices

### Test Organization
1. Group related tests in describe blocks
2. Use descriptive test names that explain the behavior
3. Keep tests focused on single behaviors
4. Use setup and teardown appropriately

### Mocking Strategy
1. Mock external dependencies (Next.js hooks, APIs)
2. Use real implementations for theme logic
3. Mock complex UI components that aren't under test
4. Provide meaningful mock implementations

### Assertions
1. Test both positive and negative cases
2. Verify accessibility attributes
3. Check for proper error handling
4. Validate performance characteristics

### Maintenance
1. Update visual baselines when designs change
2. Review and update performance thresholds regularly
3. Keep test data synchronized with actual theme configurations
4. Document test changes in pull requests

## Integration with Development Workflow

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- tests/integration/ --passWithNoTests"
    }
  }
}
```

### Development Scripts
```json
{
  "scripts": {
    "test:theme": "npm test -- tests/integration/theme-system.test.tsx",
    "test:integration": "npm test -- tests/integration/",
    "test:visual": "npx playwright test tests/visual/",
    "test:performance": "npx playwright test tests/performance/",
    "test:e2e": "npx playwright test tests/e2e/",
    "test:all": "npm run test:integration && npm run test:visual && npm run test:performance && npm run test:e2e"
  }
}
```

This comprehensive testing suite ensures that the theme system works reliably across all components, pages, and user interactions while maintaining performance and accessibility standards.