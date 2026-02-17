import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import authUiReducer from './authUiSlice';

/**
 * Global Store Configuration.
 * Orchestrates all domain-specific slices.
 */
const store = configureStore({
    reducer: {
        auth: authReducer,
        authUi: authUiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these paths due to use of UserDTO (Maps/Classes)
                ignoredPaths: ['auth.user', 'auth.user.submissions', 'auth.user.posts', 'auth.user.likes', 'auth.user.comments', 'auth.user.courses', 'auth.user.events', 'auth.user.scanners', 'auth.user.enroledContents'],
                ignoredActionPaths: ['payload.submissions', 'payload.posts', 'payload.likes', 'payload.comments', 'payload.courses', 'payload.events', 'payload.scanners', 'payload.enroledContents'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
