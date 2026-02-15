import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

/**
 * Global Store Configuration.
 * Orchestrates all domain-specific slices.
 */
const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
