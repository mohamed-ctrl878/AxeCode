import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '@domain/useCase/useForgotPassword';
import { Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@core/utils/cn';

import { PATHS } from '@presentation/routes/paths';

/**
 * ForgotPasswordPage: UI for initiating identity recovery protocol.
 */
const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const { forgotPassword, isSending, error, successData } = useForgotPassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await forgotPassword(email);
        if (result) {
            // Success: Navigate to Reset Password page with email as state
            setTimeout(() => {
                navigate(PATHS.RESET_PASSWORD, { state: { email } });
            }, 2000);
        }
    };

    return (
        <div className="md:col-span-12 min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass border border-border-subtle rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden transition-all duration-500">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                
                {/* Header */}
                <div className="relative mb-10 text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <Mail className="text-blue-400" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Identity Recovery</h1>
                    <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">Initialization Phase</p>
                </div>

                {!successData ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter node identifier"
                                className="w-full bg-surface-dark border border-border-subtle rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 transition-all outline-none"
                                required
                            />
                        </div>

                        {error && <p className="text-[10px] text-red-500 font-mono text-center animate-pulse">{error}</p>}

                        <button 
                            type="submit"
                            disabled={isSending || !email}
                            className={cn(
                                "w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all",
                                email ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02]" : "bg-surface-elevated text-text-muted cursor-not-allowed"
                            )}
                        >
                            {isSending ? <Loader2 size={16} className="animate-spin" /> : "Transmit Code"}
                        </button>
                    </form>
                ) : (
                    <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-blue-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold">Transmission Successful</h3>
                        <p className="text-xs text-text-muted max-w-[240px] mx-auto">
                            A verification protocol has been dispatched to your email. Redirecting to authorization...
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-border-subtle text-center">
                    <button 
                        onClick={() => navigate(PATHS.LOGIN)}
                        className="flex items-center justify-center gap-2 mx-auto text-[10px] text-text-muted hover:text-blue-400 uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft size={12} />
                        Back to Access Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
