import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';

const ConfirmationContext = createContext(undefined);

/**
 * ConfirmationProvider: Manages the global state of the confirmation modal.
 * Built for "Function Flow": Allows awaiting user decision in an async context.
 */
export const ConfirmationProvider = ({ children }) => {
    const [state, setState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmLabel: '',
        cancelLabel: '',
        type: 'info',
        isLoading: false
    });

    // We use a ref to store the resolve function of the promise
    const resolver = useRef(null);

    const confirm = useCallback((options = {}) => {
        return new Promise((resolve) => {
            resolver.current = resolve;
            setState({
                isOpen: true,
                title: options.title || 'Are you sure?',
                message: options.message || 'Please confirm this action.',
                confirmLabel: options.confirmLabel || 'Confirm',
                cancelLabel: options.cancelLabel || 'Cancel',
                type: options.type || 'info',
                isLoading: false
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        setState(prev => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(false);
    }, []);

    const handleConfirm = useCallback(() => {
        setState(prev => ({ ...prev, isOpen: false }));
        if (resolver.current) resolver.current(true);
    }, []);

    return (
        <ConfirmationContext.Provider value={{ confirm }}>
            {children}
            <ConfirmationModal 
                {...state}
                onClose={handleClose}
                onConfirm={handleConfirm}
            />
        </ConfirmationContext.Provider>
    );
};

/**
 * useConfirm: Hook to trigger the premium confirmation flow.
 * Usage: 
 *   const { confirm } = useConfirm();
 *   const ok = await confirm({ title: 'Delete?', type: 'danger' });
 *   if (ok) { ... }
 */
export const useConfirm = () => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmationProvider');
    }
    return context;
};
