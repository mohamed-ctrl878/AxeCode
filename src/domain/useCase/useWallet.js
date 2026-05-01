import { useState, useCallback, useMemo } from 'react';
import { WalletRepository } from '@infrastructure/repository/WalletRepository';

export const useWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requestingPayout, setRequestingPayout] = useState(false);

    const repository = useMemo(() => new WalletRepository(), []);

    const fetchWallet = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await repository.getMyWallet();
            setWallet(data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch wallet data');
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const requestPayout = useCallback(async (amount, method, details) => {
        setRequestingPayout(true);
        setError(null);
        try {
            const result = await repository.requestPayout({ amount, method, details });
            // Refresh wallet to show updated balance
            await fetchWallet();
            return result;
        } catch (err) {
            const msg = err.response?.data?.error?.message || 'Payout request failed';
            setError(msg);
            throw new Error(msg);
        } finally {
            setRequestingPayout(false);
        }
    }, [repository, fetchWallet]);

    return {
        wallet,
        loading,
        error,
        requestingPayout,
        fetchWallet,
        requestPayout
    };
};
