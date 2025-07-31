import {
  saveThemePreferences,
  loadThemePreferences,
  clearThemePreferences,
  isValidTheme,
  isValidMode,
  getThemeClassName,
  getModeClassName,
  applyThemeToDocument,
  getDefaultThemePreferences,
  isStorageAvailable,
  getSystemDarkModePreference,
  initializeThemePreferences
} from './theme-utils';

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

// Mock document.documentElement
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

// Mock window.matchMedia for system preference testing
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia
});

describe('Theme Utilities', () => {
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

    // Clear matchMedia mock
    mockMatchMedia.mockClear();

    // Mock console.warn to avoid noise in tests
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveThemePreferences', () => {
    it('saves preferences to localStorage successfully', () => {
      const result = saveThemePreferences('sunset', 'dark');
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'sunset', mode: 'dark' })
      );
    });

    it('handles localStorage errors gracefully', () => {
      (localStorageMock.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = saveThemePreferences('ocean', 'light');
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to save theme preferences to localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('loadThemePreferences', () => {
    it('loads valid preferences from localStorage', () => {
      const preferences = { theme: 'forest', mode: 'dark' };
      (localStorageMock.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(preferences)
      );

      const result = loadThemePreferences();
      
      expect(result).toEqual(preferences);
    });

    it('returns null when no preferences are stored', () => {
      (localStorageMock.getItem as jest.Mock).mockReturnValue(null);

      const result = loadThemePreferences();
      
      expect(result).toBeNull();
    });

    it('handles invalid JSON gracefully', () => {
      (localStorageMock.getItem as jest.Mock).mockReturnValue('invalid-json');

      const result = loadThemePreferences();
      
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to load theme preferences from localStorage:',
        expect.any(Error)
      );
    });

    it('removes invalid data and returns null', () => {
      const invalidPreferences = { theme: 'invalid-theme', mode: 'light' };
      (localStorageMock.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(invalidPreferences)
      );

      const result = loadThemePreferences();
      
      expect(result).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('aha-agile-theme-preferences');
    });
  });

  describe('clearThemePreferences', () => {
    it('clears preferences successfully', () => {
      const result = clearThemePreferences();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('aha-agile-theme-preferences');
    });

    it('handles errors gracefully', () => {
      (localStorageMock.removeItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = clearThemePreferences();
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to clear theme preferences from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('Validation utilities', () => {
    describe('isValidTheme', () => {
      it('validates correct theme IDs', () => {
        expect(isValidTheme('ocean')).toBe(true);
        expect(isValidTheme('sunset')).toBe(true);
        expect(isValidTheme('forest')).toBe(true);
      });

      it('rejects invalid theme IDs', () => {
        expect(isValidTheme('invalid')).toBe(false);
        expect(isValidTheme('')).toBe(false);
        expect(isValidTheme('OCEAN')).toBe(false);
      });
    });

    describe('isValidMode', () => {
      it('validates correct mode values', () => {
        expect(isValidMode('light')).toBe(true);
        expect(isValidMode('dark')).toBe(true);
      });

      it('rejects invalid mode values', () => {
        expect(isValidMode('invalid')).toBe(false);
        expect(isValidMode('')).toBe(false);
        expect(isValidMode('LIGHT')).toBe(false);
      });
    });
  });

  describe('CSS class utilities', () => {
    describe('getThemeClassName', () => {
      it('returns correct theme class names', () => {
        expect(getThemeClassName('ocean')).toBe('theme-ocean');
        expect(getThemeClassName('sunset')).toBe('theme-sunset');
        expect(getThemeClassName('forest')).toBe('theme-forest');
      });
    });

    describe('getModeClassName', () => {
      it('returns correct mode class names', () => {
        expect(getModeClassName('light')).toBe('light');
        expect(getModeClassName('dark')).toBe('dark');
      });
    });

    describe('applyThemeToDocument', () => {
      it('applies theme and mode classes to document element', () => {
        applyThemeToDocument('sunset', 'dark');

        expect(mockClassList.remove).toHaveBeenCalledWith('theme-ocean', 'theme-sunset', 'theme-forest');
        expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
        expect(mockClassList.add).toHaveBeenCalledWith('theme-sunset');
        expect(mockClassList.add).toHaveBeenCalledWith('dark');
      });

      it('handles SSR environment gracefully', () => {
        // Mock SSR environment (no document)
        const originalDocument = global.document;
        // @ts-ignore
        delete global.document;

        expect(() => {
          applyThemeToDocument('ocean', 'light');
        }).not.toThrow();

        // Restore document
        global.document = originalDocument;
      });
    });
  });

  describe('getDefaultThemePreferences', () => {
    it('returns default preferences', () => {
      const defaults = getDefaultThemePreferences();
      
      expect(defaults).toEqual({
        theme: 'ocean',
        mode: 'light'
      });
    });
  });

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      // Reset mocks to allow successful storage operations
      (localStorageMock.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
        localStorageMock[key] = value;
      });
      (localStorageMock.removeItem as jest.Mock).mockImplementation((key: string) => {
        delete localStorageMock[key];
      });
      
      expect(isStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage is not available', () => {
      const originalLocalStorage = global.localStorage;
      // @ts-ignore
      delete global.localStorage;

      expect(isStorageAvailable()).toBe(false);

      global.localStorage = originalLocalStorage;
    });

    it('returns false when localStorage throws errors', () => {
      (localStorageMock.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage not available');
      });

      expect(isStorageAvailable()).toBe(false);
    });
  });

  describe('getSystemDarkModePreference', () => {
    it('returns dark when system prefers dark mode', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const preference = getSystemDarkModePreference();
      
      expect(preference).toBe('dark');
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('returns light when system prefers light mode', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const preference = getSystemDarkModePreference();
      
      expect(preference).toBe('light');
    });

    it('returns light when matchMedia is not available', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const preference = getSystemDarkModePreference();
      
      expect(preference).toBe('light');

      global.window = originalWindow;
    });

    it('handles matchMedia errors gracefully', () => {
      mockMatchMedia.mockImplementation(() => {
        throw new Error('matchMedia error');
      });

      const preference = getSystemDarkModePreference();
      
      expect(preference).toBe('light');
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to detect system dark mode preference:',
        expect.any(Error)
      );
    });
  });

  describe('initializeThemePreferences', () => {
    it('returns stored preferences when available', () => {
      const storedPreferences = { theme: 'sunset', mode: 'dark' };
      (localStorageMock.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(storedPreferences)
      );
      
      // Reset mocks to allow successful storage operations
      (localStorageMock.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
        localStorageMock[key] = value;
      });

      const result = initializeThemePreferences();
      
      expect(result).toEqual(storedPreferences);
    });

    it('initializes with system preference when no stored data', () => {
      (localStorageMock.getItem as jest.Mock).mockReturnValue(null);
      mockMatchMedia.mockReturnValue({ matches: true }); // System dark mode
      
      // Reset mocks to allow successful storage operations and clear previous calls
      (localStorageMock.setItem as jest.Mock).mockClear();
      (localStorageMock.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
        localStorageMock[key] = value;
      });

      const result = initializeThemePreferences();
      
      expect(result).toEqual({
        theme: 'ocean',
        mode: 'dark'
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'aha-agile-theme-preferences',
        JSON.stringify({ theme: 'ocean', mode: 'dark' })
      );
    });

    it('handles storage unavailable scenario', () => {
      // Mock storage as unavailable
      const originalLocalStorage = global.localStorage;
      // @ts-ignore
      delete global.localStorage;
      mockMatchMedia.mockReturnValue({ matches: false });

      const result = initializeThemePreferences();
      
      expect(result).toEqual({
        theme: 'ocean',
        mode: 'light'
      });

      global.localStorage = originalLocalStorage;
    });
  });
});