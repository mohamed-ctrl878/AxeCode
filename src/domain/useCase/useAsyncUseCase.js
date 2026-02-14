import { useState, useCallback } from 'react';

/**
 * Custom hook to handle async operations with state management.
 * @param {Function} asyncFunction - The repository method or async logic to execute.
 * @returns {object} { execute, returnedData, inProgress, error }
 */
export const useAsyncUseCase = (asyncFunction) => {
    const [returnedData, setReturnedData] = useState(null);
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setInProgress(true);
        setError(null);
        try {
            const data = await asyncFunction(...args);
            setReturnedData(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred';
            setError(errorMessage);
            console.error('[UseCase Error]:', err);
            throw err;
        } finally {
            setInProgress(false);
        }
    }, [asyncFunction]);

    return { execute, returnedData, inProgress, error };
};
