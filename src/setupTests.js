import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Global API Mocking Strategy
 * --------------------------
 * We define a strict global fetch mock that rejects by default.
 * This forces tests to explicitly mock their expected network calls,
 * preventing accidental "leaked" requests and making failures explicit.
 */
global.fetch = vi.fn().mockImplementation((url) => {
    return Promise.reject(new Error(`Unmocked API call to ${url}. Please use vi.fn().mockResolvedValue() for this call.`));
});

/**
 * Environment Variables (import.meta.env)
 * ---------------------------------------
 * jsdom doesn't fully support import.meta.env outside of the Vite build process.
 * We stub these global values to ensure repositories find their base URLs.
 */
if (typeof import.meta === 'undefined') {
    global.import = { meta: { env: {} } };
}

// Default environment mock
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:1337');
vi.stubEnv('VITE_API_REGISTER', '/api/auth/local/register');
vi.stubEnv('VITE_API_LOGIN', '/api/auth/login');
vi.stubEnv('VITE_API_LOGOUT', '/api/auth/logout');

/**
 * Browser API Polyfills
 * ---------------------
 * JSDOM lacks some modern browser APIs. We add minimal mocks here.
 */
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
