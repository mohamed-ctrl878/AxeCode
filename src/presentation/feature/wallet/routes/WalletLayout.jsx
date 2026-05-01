import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wallet, ArrowUpRight, Users } from 'lucide-react';
import { useRole } from '@core/hooks/useRole';
import { PATHS } from '@presentation/routes/paths';

const WalletLayout = () => {
    const { isPublisher } = useRole();

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto animation-fade-in mt-16 md:mt-24">
            {/* Header section with icon */}
            <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">
                    Wallet & Financials
                </h1>
            </div>

            {/* Tab Navigation (Only for Publishers) */}
            {isPublisher() && (
                <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
                    <NavLink 
                        to={PATHS.WALLET_MY}
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Wallet className="w-4 h-4" />
                        My Wallet
                    </NavLink>
                    <NavLink 
                        to={PATHS.WALLET_PLATFORM}
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        Platform Revenue
                    </NavLink>
                    <NavLink 
                        to={PATHS.WALLET_ALL}
                        className={({ isActive }) => `flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        All Wallets
                    </NavLink>
                </div>
            )}

            {/* Active Tab Content */}
            <div className="mt-8">
                <Outlet />
            </div>
        </div>
    );
};

export default WalletLayout;
