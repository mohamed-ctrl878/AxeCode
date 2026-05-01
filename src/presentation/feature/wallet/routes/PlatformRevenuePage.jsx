import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAdminWallet } from '@domain/useCase/useAdminWallet';
import { LoadingSpinner, ErrorAlert, BalanceCard, StatCard, TransactionsTable } from './MyWalletPage';

const PlatformRevenuePage = () => {
    const { platformWallet, loading, error, fetchPlatformWallet } = useAdminWallet();

    useEffect(() => {
        fetchPlatformWallet();
    }, [fetchPlatformWallet]);

    if (loading && !platformWallet) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Platform Revenue</h2>
                    <p className="text-gray-500 mt-1">Monitor total commissions collected from platform sales</p>
                </div>
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard 
                    title="Total Commission Earned" 
                    amount={platformWallet?.balance} 
                    currency={platformWallet?.currency} 
                    isActive={platformWallet?.isActive} 
                    isPrimary 
                />
                 <StatCard 
                    title="Active Status" 
                    amount={platformWallet?.isActive ? 'Active' : 'Inactive'} 
                    desc="Platform wallet status." 
                    icon={<ShieldCheck className="w-6 h-6" />} 
                    color="emerald" 
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <TransactionsTable transactions={platformWallet?.transactions} title="Commission History" />
            </div>
        </div>
    );
};

export default PlatformRevenuePage;
