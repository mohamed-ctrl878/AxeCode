import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, CreditCard, Plus, AlertCircle, History, ArrowUpRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useWallet } from '@domain/useCase/useWallet';

// --- UI Helpers ---

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
);

const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <p className="text-red-700 font-medium">{message}</p>
    </div>
);

const BalanceCard = ({ title, amount, currency, reconciliation, isActive, isPrimary }) => (
    <div className={`p-8 rounded-3xl shadow-xl relative overflow-hidden group ${isPrimary ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl' : 'bg-white border border-gray-100'}`}>
        {isPrimary && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>}
        <p className={`font-medium mb-2 uppercase tracking-wider text-sm ${isPrimary ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <h2 className={`text-4xl font-black mb-6 ${isPrimary ? '' : 'text-gray-900'}`}>
            {amount?.toLocaleString() || 0} <span className={`text-lg font-normal ${isPrimary ? 'text-gray-400' : 'text-gray-500'}`}>{currency || 'EGP'}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
            {isActive && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full text-sm font-bold">
                    <ArrowUpRight className="w-4 h-4" />
                    Wallet Active
                </div>
            )}
            {reconciliation === 'BALANCED' && (
                <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 w-fit px-3 py-1 rounded-full text-sm font-bold" title="Last confirmed matching with records">
                    <ShieldCheck className="w-4 h-4" />
                    Balanced
                </div>
            )}
            {reconciliation === 'DISCREPANCY' && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 w-fit px-3 py-1 rounded-full text-sm font-bold" title="Ledger mismatch detected - system review pending">
                    <ShieldAlert className="w-4 h-4" />
                    Discrepancy
                </div>
            )}
        </div>
    </div>
);

const StatCard = ({ title, amount, desc, icon, color }) => {
    const colors = {
        amber: 'bg-amber-50 text-amber-500',
        blue: 'bg-blue-50 text-blue-500',
        emerald: 'bg-emerald-50 text-emerald-500'
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{amount}</h3>
                </div>
            </div>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    );
};

const TransactionsTable = ({ transactions, title = "Recent Ledger" }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                {title}
            </h3>
        </div>
        <div className="flex-1 overflow-x-auto">
            {transactions?.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {tx.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-900">{tx.referenceType?.replace('_', ' ') || tx.reference_type?.replace('_', ' ')}</p>
                                    <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className={`px-6 py-4 text-right font-black ${tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount?.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-12 text-center">
                    <History className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 italic">No transactions recorded yet.</p>
                </div>
            )}
        </div>
    </div>
);

const PayoutsTable = ({ payouts }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Payout Requests
            </h3>
        </div>
        <div className="flex-1 overflow-x-auto">
            {payouts?.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs uppercase text-gray-400 font-bold tracking-wider">
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Method/Date</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {payouts.map((po) => (
                            <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                                            po.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                                            po.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {po.status === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : 
                                             po.status === 'REJECTED' ? <XCircle className="w-3 h-3" /> : 
                                             <Clock className="w-3 h-3" />}
                                            {po.status}
                                        </span>
                                        {po.admin_notes && <p className="text-[10px] text-rose-400 max-w-[150px] truncate">{po.admin_notes}</p>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-900">{po.method}</p>
                                    <p className="text-xs text-gray-400">{new Date(po.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-black text-gray-900">
                                    {po.amount?.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-12 text-center text-gray-400 italic">
                    <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p>No payout requests found.</p>
                </div>
            )}
        </div>
    </div>
);

// --- MyWalletPage ---

const MyWalletPage = () => {
    const { wallet, loading, error, requestingPayout, requestPayout, fetchWallet } = useWallet();
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('InstaPay');
    const [payoutDetails, setPayoutDetails] = useState('');

    useEffect(() => {
        fetchWallet();
    }, []);

    const handlePayoutSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestPayout(
                parseFloat(payoutAmount), 
                payoutMethod, 
                { details: payoutDetails }
            );
            setIsPayoutModalOpen(false);
            setPayoutAmount('');
            setPayoutDetails('');
        } catch (err) {
            // Error managed by useWallet hook and displayed in UI
        }
    };

    if (loading && !wallet) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Wallet</h2>
                    <p className="text-gray-500 mt-1">Manage your earnings and payout requests</p>
                </div>
                <button 
                    onClick={() => setIsPayoutModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Request Payout
                </button>
            </div>

            {error && <ErrorAlert message={error} />}

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard 
                    title="Available Balance" 
                    amount={wallet ? (wallet.balance - (wallet.pendingBalance || 0)) : 0} 
                    currency={wallet?.currency} 
                    reconciliation={wallet?.reconciliation_status} 
                    isActive={wallet?.isActive} 
                    isPrimary 
                />
                <StatCard 
                    title="Pending Earnings" 
                    amount={`${wallet?.pendingBalance?.toLocaleString() || 0} ${wallet?.currency || 'EGP'}`} 
                    desc="Funds waiting for clearance." 
                    icon={<Clock className="w-6 h-6" />} 
                    color="amber" 
                />
                <StatCard 
                    title="Platform Commission" 
                    amount={`${(wallet?.commissionRate * 100).toFixed(0)}%`} 
                    desc="Current fee applied to your sales." 
                    icon={<CreditCard className="w-6 h-6" />} 
                    color="blue" 
                />
            </div>

            {/* Tables section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransactionsTable transactions={wallet?.transactions} />
                <PayoutsTable payouts={wallet?.payouts} />
            </div>

            {/* Payout Modal */}
            {isPayoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Request Payout</h2>
                        <p className="text-gray-500 mb-6 font-medium">Funds will be deducted from your wallet immediately.</p>
                        
                        <form onSubmit={handlePayoutSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Amount ({wallet?.currency || 'EGP'})</label>
                                <input 
                                    type="number" 
                                    required
                                    min="100"
                                    max={wallet ? (wallet.balance - (wallet.pendingBalance || 0)) : 0}
                                    placeholder="Min 100"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-2">Available: {wallet ? (wallet.balance - (wallet.pendingBalance || 0))?.toLocaleString() : 0} {wallet?.currency}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Method</label>
                                <select 
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                                    value={payoutMethod}
                                    onChange={(e) => setPayoutMethod(e.target.value)}
                                >
                                    <option value="InstaPay">InstaPay (Fastest)</option>
                                    <option value="Vodafone Cash">Vodafone Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Transfer Details</label>
                                <textarea 
                                    required
                                    placeholder="Enter your InstaPay ID, Bank Account Number, or Wallet Phone Number..."
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                    value={payoutDetails}
                                    onChange={(e) => setPayoutDetails(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsPayoutModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={requestingPayout || !payoutAmount || parseFloat(payoutAmount) > (wallet ? (wallet.balance - (wallet.pendingBalance || 0)) : 0)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:grayscale"
                                >
                                    {requestingPayout ? 'Processing...' : 'Confirm Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Export helpers to be reused by other pages
export { LoadingSpinner, ErrorAlert, BalanceCard, StatCard, TransactionsTable, PayoutsTable };

export default MyWalletPage;
