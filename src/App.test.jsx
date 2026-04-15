import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@infrastructure/store/store'; // Ensure path is correct
import App from './App';

// Mock matchMedia for jsdom (required for some UI libraries and Tailwind checks)
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

describe('App Smoke Test', () => {
    it('renders without crashing', () => {
        // Just verify it doesn't throw a fatal error on initial render
        const { baseElement } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        expect(baseElement).toBeInTheDocument();
    });
});
