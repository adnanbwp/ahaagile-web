# Theme System Integration Testing

This directory contains comprehensive integration and testing suites for the Aha Agile website's theme system implementation. The tests validate that all theme functionality works correctly across different environments and use cases.

## Test Structure

### 📁 Integration Tests
- **`theme-system.test.tsx`** - Core theme system functionality tests
- **`cross-page-validation.test.tsx`** - Theme compatibility across different pages

### 📁 End-to-End Tests (Playwright)
- **`theme-switching.spec.ts`** - Complete user journey testing with theme switching

### 📁 Visual Regression Tests (Playwright)
- **`theme-regression.test.ts`** - Screenshot comparison testing across themes

### 📁 Performance Tests (Playwright)
- **`theme-performance.test.ts`** - Core Web Vitals and performance benchmarks

## Test Coverage

### ✅ Theme Context & State Management
- Theme provider initialization
- Theme persistence via localStorage
- Error handling for corrupted/missing data
- Context hook functionality
- State updates and synchronization

### ✅ ThemeSwitcher Component
- UI interaction and accessibility
- Theme selection and mode toggling
- Keyboard navigation support
- Focus management
- Visual feedback and states

### ✅ Component Compatibility
- Header/Footer theme adaptation
- Button components across themes
- Card components styling consistency
- Form elements theme compatibility
- Typography and color applications

### ✅ Cross-Page Functionality
- Homepage theme application
- Services page compatibility
- Case study page styling
- Consultation page integration
- Theme persistence across navigation

### ✅ Performance & Optimization
- Theme switching speed benchmarks
- CSS loading performance
- Memory usage monitoring
- Core Web Vitals compliance
- Animation performance testing

### ✅ Accessibility & UX
- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes and roles
- Focus management
- Color contrast validation

### ✅ Error Handling & Edge Cases
- LocalStorage unavailability
- Corrupted preference data
- Network connectivity issues
- Theme loading failures
- Graceful degradation

## Running Tests

### Integration Tests (Jest)
```bash
# Run all integration tests
npm test tests/integration/

# Run specific test suite
npm test tests/integration/theme-system.test.tsx
npm test tests/integration/cross-page-validation.test.tsx
```

### E2E and Visual Tests (Playwright)
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all Playwright tests
npx playwright test tests/e2e/ tests/visual/ tests/performance/

# Run specific test category
npx playwright test tests/e2e/theme-switching.spec.ts
npx playwright test tests/visual/theme-regression.test.ts
npx playwright test tests/performance/theme-performance.test.ts

# Run tests with UI mode for debugging
npx playwright test --ui
```

### Generate Test Reports
```bash
# Jest coverage report
npm test -- --coverage

# Playwright HTML report
npx playwright show-report
```

## Test Configuration

### Jest Configuration
Tests are configured in `jest.config.js` with:
- JSDoc test environment for browser APIs
- Next.js integration for component testing
- Module path mapping for imports
- Playwright tests excluded from Jest

### Mock Implementations
- **localStorage**: Custom mock for consistent testing
- **Next.js Router**: Navigation hooks mocked
- **Theme CSS**: Dynamic loading simulation
- **Performance APIs**: Browser performance monitoring

## Theme System Architecture Testing

### 🎨 Three Theme Variants
- **Ocean**: Deep blue professional theme
- **Sunset**: Warm orange/red sunset colors  
- **Forest**: Natural green forest theme

### 🌓 Light/Dark Mode Support
- Toggle functionality testing
- CSS class application validation
- Visual contrast verification
- Accessibility compliance

### 💾 Persistence Testing
- localStorage save/load functionality
- Cross-session state maintenance
- Browser tab synchronization
- Error recovery mechanisms

## Production Configuration Testing

### Environment Variables
Tests validate production configuration options:
- `NEXT_PUBLIC_ENABLE_THEME_SWITCHER`: Feature flag control
- `NEXT_PUBLIC_DEFAULT_THEME`: Production theme selection
- `NEXT_PUBLIC_DEFAULT_MODE`: Production mode setting
- `NEXT_PUBLIC_DISABLE_THEME_TRANSITIONS`: Performance optimization

### Production Readiness
- Theme system can be disabled for production builds
- Static theme application without JavaScript
- Performance impact measurement
- Bundle size optimization validation

## Browser Compatibility Testing

### Supported Browsers
- Chrome (latest + 1 previous version)
- Firefox (latest + ESR)
- Safari (latest on macOS/iOS)
- Edge (latest stable)

### Device Testing
- Mobile responsiveness (iPhone, Android)
- Tablet compatibility (iPad, Android tablets)
- Desktop various screen resolutions
- Touch vs. mouse interaction testing

## Performance Benchmarks

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### Theme Switch Performance
- Theme selection to visual update: < 1s
- CSS loading time: < 500ms
- Render completion: < 300ms
- Layout shift impact: < 0.1

## Visual Regression Testing

### Screenshot Comparison
- Component-level theme variations
- Full-page responsive testing
- Cross-browser visual consistency
- Theme transition smoothness
- Responsive breakpoint validation

### Viewport Testing
- Mobile (320px - 414px)
- Tablet (768px - 1024px) 
- Desktop (1280px - 1920px+)
- Portrait and landscape orientations

## Continuous Integration

### GitHub Actions Integration
Tests are configured to run on:
- Pull request validation
- Main branch updates
- Release preparation
- Nightly regression testing

### Test Automation
- Unit tests: Run on every commit
- Integration tests: PR validation
- E2E tests: Pre-deployment verification
- Visual tests: Release validation
- Performance tests: Weekly benchmarks

## Debugging and Troubleshooting

### Common Issues
1. **localStorage Mock Issues**: Ensure mock is properly configured
2. **Theme CSS Loading**: Check dynamic import paths
3. **Component Rendering**: Verify Next.js mock setup
4. **Playwright Browser**: Run `npx playwright install`
5. **Performance Variance**: Account for test environment differences

### Debug Tools
- Jest: `--verbose` flag for detailed output
- Playwright: `--debug` for step-by-step execution
- Browser DevTools: Network and Performance tabs
- React DevTools: Component state inspection

## Contributing to Tests

### Adding New Test Cases
1. Identify the functionality to test
2. Choose appropriate test category (unit/integration/e2e)
3. Follow existing test patterns and naming
4. Include positive and negative test cases
5. Add performance assertions where relevant
6. Update this documentation

### Test Quality Guidelines
- Tests should be deterministic and repeatable
- Mock external dependencies appropriately  
- Use descriptive test and variable names
- Include error scenarios and edge cases
- Validate both functionality and performance
- Maintain good test isolation and cleanup

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Web Performance Testing](https://web.dev/performance/)

---

## Story 7.4 Implementation Status: ✅ COMPLETE

All acceptance criteria have been successfully implemented and tested:

1. ✅ Theme switcher integrated into main layout component
2. ✅ All existing components tested with each theme variant  
3. ✅ Theme compatibility verified across all pages
4. ✅ No visual regressions or styling conflicts
5. ✅ Theme system works with existing Tailwind CSS configuration
6. ✅ Comprehensive unit tests for theme context and switching logic
7. ✅ Theme persistence tested across browser sessions and devices
8. ✅ Performance impact measured and optimized
9. ✅ Production configuration enables easy theme system removal

The theme system is production-ready with comprehensive test coverage and can be easily enabled/disabled based on business requirements.