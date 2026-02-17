import { useState, useEffect } from 'react';

/**
 * useDebounce: Custom hook to delay updating a value.
 * @param {any} value - The dynamic value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {any} - The debounced value.
 */
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
