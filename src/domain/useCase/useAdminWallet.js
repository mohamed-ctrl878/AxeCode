import { useState, useCallback, useMemo } from 'react';
import { WalletRepository } from '@infrastructure/repository/WalletRepository';

export const useAdminWallet = () => {
    const [platformWallet, setPlatformWallet] = useState(null);
    const [allWallets, setAllWallets] = useState([]);
    const [walletsMeta, setWalletsMeta] = useState(null);
    
    const [loadingPlatform, setLoadingPlatform] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [updatingCommission, setUpdatingCommission] = useState(false);
    
    const [error, setError] = useState(null);

    const repository = useMemo(() => new WalletRepository(), []);

    const fetchPlatformWallet = useCallback(async () => {
        setLoadingPlatform(true);
        setError(null);
        try {
            const data = await repository.getPlatformWallet();
            setPlatformWallet(data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch platform wallet');
        } finally {
            setLoadingPlatform(false);
        }
    }, [repository]);

    const fetchAllWallets = useCallback(async (params = { page: 1, pageSize: 25 }) => {
        setLoadingAll(true);
        setError(null);
        try {
            const result = await repository.getAllWallets(params);
            setAllWallets(result.data);
            setWalletsMeta(result.meta);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch all wallets');
        } finally {
            setLoadingAll(false);
        }
    }, [repository]);

    const updateCommission = useCallback(async (walletId, newRate) => {
        setUpdatingCommission(true);
        setError(null);
        try {
            await repository.updateCommissionRate(walletId, newRate);
            // After successful update, re-fetch the list to show updated values
            await fetchAllWallets();
            return true;
        } catch (err) {
            const msg = err.response?.data?.error?.message || 'Failed to update commission rate';
            setError(msg);
            throw new Error(msg);
        } finally {
            setUpdatingCommission(false);
        }
    }, [repository, fetchAllWallets]);

    return {
        platformWallet,
        allWallets,
        walletsMeta,
        
        loadingPlatform,
        loadingAll,
        updatingCommission,
        error,
        
        fetchPlatformWallet,
        fetchAllWallets,
        updateCommission
    };
};
