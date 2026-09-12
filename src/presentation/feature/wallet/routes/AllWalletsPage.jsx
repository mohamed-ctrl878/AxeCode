import React, { useState, useEffect } from 'react';
import { useAdminWallet } from '@domain/useCase/useAdminWallet';
import { LoadingSpinner, ErrorAlert } from './MyWalletPage';

const AllWalletsPage = () => {
    const { allWallets, loading, error, fetchAllWallets, updateCommission } = useAdminWallet();
    const [editingWallet, setEditingWallet] = useState(null);
    const [newRate, setNewRate] = useState('');

    useEffect(() => {
        fetchAllWallets();
    }, [fetchAllWallets]);

    const handleEditClick = (wallet) => {
        setEditingWallet(wallet);
        setNewRate((wallet.commissionRate * 100).toString());
    };

    const handleSaveRate = async () => {
        if (!editingWallet) return;
        try {
            await updateCommission(editingWallet.id, parseFloat(newRate) / 100);
            setEditingWallet(null);
        } catch (err) {
            alert(err.message || 'Failed to update rate');
        }
    };

    if (loading && !allWallets.length) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Publisher Wallets</h2>
                    <p className="text-gray-500 mt-1">Manage balances and commission rates for all publishers</p>
                </div>
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs uppercase text-gray-400 font-bold tracking-wider bg-gray-50">
                                <th className="px-6 py-4">Publisher</th>
                                <th className="px-6 py-4">Balance</th>
                                <th className="px-6 py-4">Pending</th>
                                <th className="px-6 py-4">Commission Rate</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {allWallets.map((w) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{w.owner?.username || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{w.owner?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {w.balance?.toLocaleString()} {w.currency}
                                    </td>
                                    <td className="px-6 py-4 text-amber-600 font-medium">
                                        {w.pendingBalance?.toLocaleString()} {w.currency}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold">
                                            {(w.commissionRate * 100).toFixed(0)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleEditClick(w)}
                                            className="text-primary hover:text-primary/80 font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Edit Rate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allWallets.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                        No wallets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Rate Modal */}
            {editingWallet && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                 <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                     <h2 className="text-2xl font-black text-gray-900 mb-2">Edit Commission Rate</h2>
                     <p className="text-gray-500 mb-6 font-medium">
                         Update rate for <span className="text-gray-900 font-bold">{editingWallet.owner?.username}</span>
                     </p>
                     
                     <div className="space-y-5">
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Commission Rate (%)</label>
                             <input 
                                 type="number" 
                                 min="0"
                                 max="100"
                                 className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                                 value={newRate}
                                 onChange={(e) => setNewRate(e.target.value)}
                             />
                         </div>

                         <div className="flex gap-3 pt-2">
                             <button 
                                 type="button"
                                 onClick={() => setEditingWallet(null)}
                                 className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                             >
                                 Cancel
                             </button>
                             <button 
                                 type="button"
                                 onClick={handleSaveRate}
                                 className="flex-1 px-6 py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-all"
                             >
                                 Save Rate
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
            )}
        </div>
    );
};

export default AllWalletsPage;
