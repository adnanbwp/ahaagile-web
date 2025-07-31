import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme, AVAILABLE_THEMES, ThemeId, Mode } from './theme-context';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock document.documentElement for CSS class testing
const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn()
};

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: mockClassList
  },
  writable: true
});

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { currentTheme, currentMode, setTheme, setMode, toggleMode } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <div data-testid="current-mode">{currentMode}</div>
      <button data-testid="set-sunset" onClick={() => setTheme('sunset')}>
        Set Sunset
      </button>
      <button data-testid="set-dark" onClick={() => setMode('dark')}>
        Set Dark
      </button>
      <button data-testid="toggle-mode" onClick={toggleMode}>
        Toggle Mode
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorageMock.clear();
    (localStorageMock.getItem as jest.Mock).mockClear();
    (localStorageMock.setItem as jest.Mock).mockClear();
    (localStorageMock.removeItem as jest.Mock).mockClear();

    // Clear document class list mock
    mockClassList.add.mockClear();
    mockClassList.remove.mockClear();
    mockClassList.contains.mockClear();

    // Mock console.warn to avoid noise in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides default theme and mode when no stored preferences exist', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('ocean');
    expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
  });

  it('loads stored preferences from localStorage', async () => {
    const storedPreferences = {
      theme: 'sunset',
      mode: 'dark'
    };
    (localStorageMock.getItem as jest.Mock).mockReturnValue(
      JSON.stringify(storedPreferences)
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('sunset');
      expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
    });
  });

  it('handles corrupted localStorage data gracefully', async () => {
    (localStorageMock.getItem as jest.Mock).mockReturnValue('invalid-json');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('ocean');
      expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
    });
  });

  it('handles invalid theme values in localStorage', async () => {
    const invalidPreferences = {
      theme: 'invalid-theme',
      mode: 'light'
    };
    (localStorageMock.getItem as jest.Mock).mockReturnValue(
      JSON.stringify(invalidPreferences)
    );

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('ocean');
      expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
    });
  });

  it('applies CSS classes to document element', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(mockClassList.remove).toHaveBeenCalledWith('theme-ocean', 'theme-sunset', 'theme-forest');
      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('theme-ocean');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });
  });

  it('updates theme when setTheme is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setSunsetButton = screen.getByTestId('set-sunset');
    
    act(() => {
      setSunsetButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('sunset');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'aha-agile-theme-preferences',
      JSON.stringify({ theme: 'sunset', mode: 'light' })
    );
  });

  it('updates mode when setMode is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setDarkButton = screen.getByTestId('set-dark');
    
    act(() => {
      setDarkButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'aha-agile-theme-preferences',
      JSON.stringify({ theme: 'ocean', mode: 'dark' })
    );
  });

  it('toggles mode when toggleMode is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-mode');
    
    // First toggle: light -> dark
    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
    });

    // Second toggle: dark -> light
    act(() => {
      toggleButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
    });
  });

  it('handles localStorage errors gracefully', async () => {
    (localStorageMock.setItem as jest.Mock).mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setSunsetButton = screen.getByTestId('set-sunset');
    
    act(() => {
      setSunsetButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('sunset');
    });

    // Should still update theme even if localStorage fails
    expect(console.warn).toHaveBeenCalledWith(
      'Failed to save theme preferences to localStorage:',
      expect.any(Error)
    );
  });
});

describe('useTheme hook', () => {
  it('throws error when used outside ThemeProvider', () => {
    const TestComponentWithoutProvider = () => {
      useTheme();
      return <div />;
    };

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('returns correct context values', () => {
    let contextValue: any;

    const TestComponentWithContext = () => {
      contextValue = useTheme();
      return <div />;
    };

    render(
      <ThemeProvider>
        <TestComponentWithContext />
      </ThemeProvider>
    );

    expect(contextValue).toHaveProperty('currentTheme');
    expect(contextValue).toHaveProperty('currentMode');
    expect(contextValue).toHaveProperty('setTheme');
    expect(contextValue).toHaveProperty('setMode');
    expect(contextValue).toHaveProperty('toggleMode');
    expect(typeof contextValue.setTheme).toBe('function');
    expect(typeof contextValue.setMode).toBe('function');
    expect(typeof contextValue.toggleMode).toBe('function');
  });
});

describe('AVAILABLE_THEMES', () => {
  it('contains correct theme configurations', () => {
    expect(AVAILABLE_THEMES).toHaveLength(3);
    
    const themeIds = AVAILABLE_THEMES.map(theme => theme.id);
    expect(themeIds).toContain('ocean');
    expect(themeIds).toContain('sunset');
    expect(themeIds).toContain('forest');

    AVAILABLE_THEMES.forEach(theme => {
      expect(theme).toHaveProperty('id');
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('description');
      expect(typeof theme.id).toBe('string');
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.description).toBe('string');
    });
  });
});