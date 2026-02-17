import { createSlice } from '@reduxjs/toolkit';
import { AuthPersistenceRepository } from '../repository/AuthPersistenceRepository';

const persistenceRepo = new AuthPersistenceRepository();

const getInitialSession = () => {
    // Note: getSessionInfo is now async in repo, but here we need sync for initialState.
    // However, localStorage is sync, so we handle it synchronously for the boot sequence.
    const stored = localStorage.getItem('axe_auth_session');
    const session = stored ? JSON.parse(stored) : null;

    return {
        user: null, // Identity is never persisted, strictly in-memory
        isAuthenticated: session ? !!session.isAuthenticated : false
    };
};

const initialState = getInitialSession();

/**
 * AuthSlice: Manages authentication and user identity state.
 * Follows SRP: Responsible only for session/identity data.
 * Side effects (persistence) are limited to the authentication toggle.
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.isAuthenticated = !!action.payload;

            // Delegate Persistence: Store ONLY the toggle
            persistenceRepo.saveSession({
                isAuthenticated: state.isAuthenticated
            });
        },
        setUserData: (state, action) => {
            // Strictly in-memory: Never triggers persistence
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

            // Delegate Persistence
            persistenceRepo.clearSession();
        }
    },
});

export const { setUser, setUserData, logout } = authSlice.actions;
export default authSlice.reducer;