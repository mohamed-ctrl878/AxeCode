import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
};

/**
 * AuthUiSlice: Manages the volatile UI state of authentication flows.
 * Follows SRP: Responsible only for loading indicators and error messages.
 */
const authUiSlice = createSlice({
    name: 'authUi',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearUiState: (state) => {
            state.loading = false;
            state.error = null;
        }
    },
});

export const { setLoading, setError, clearUiState } = authUiSlice.actions;
export default authUiSlice.reducer;
