import { useState, useCallback } from 'react';
import { PaymentRepository } from '@infrastructure/repository/PaymentRepository';

export const useInitiatePayment = () => {
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(null);
    const paymentRepo = new PaymentRepository();

    const initiatePayment = useCallback(async (itemId, contentType) => {
        setInProgress(true);
        setError(null);
        try {
            const data = await paymentRepo.initiateCheckout(itemId, contentType);
            return data;
        } catch (err) {
            const message = err.response?.data?.error?.message || 'Failed to initiate payment. Please try again.';
            setError(message);
            throw err;
        } finally {
            setInProgress(false);
        }
    }, [paymentRepo]);

    return { initiatePayment, inProgress, error };
};
