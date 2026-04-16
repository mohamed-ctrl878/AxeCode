import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Create a minimal mock store instead of importing the real one
const mockStore = configureStore({
  reducer: {
    auth: () => ({ user: null, token: null, isAuthenticated: false }),
    authUi: () => ({ isLoginModalOpen: false }),
  },
});

describe('App Smoke Test', () => {
    it('renders without crashing', () => {
        const { baseElement } = render(
            <Provider store={mockStore}>
                <App />
            </Provider>
        );
        expect(baseElement).toBeInTheDocument();
    });
});
