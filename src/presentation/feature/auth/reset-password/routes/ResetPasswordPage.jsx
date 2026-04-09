import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPassword } from '@domain/useCase/useResetPassword';
import { ShieldCheck, Lock, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';

import { PATHS } from '@presentation/routes/paths';

/**
 * ResetPasswordPage: Final phase of identity recovery.
 * Requires email, 6-digit OTP, and new credentials.
 */
const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword, isResetting, error, successData } = useResetPassword();

    // State
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        otp: ['', '', '', '', '', ''],
        password: '',
        confirmPassword: ''
    });

    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    // Handlers
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...formData.otp];
        newOtp[index] = value.slice(-1);
        setFormData({ ...formData, otp: newOtp });

        if (value && index < 5) otpRefs[index + 1].current.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) otpRefs[index - 1].current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await resetPassword({
            email: formData.email,
            code: formData.otp.join(''),
            password: formData.password,
            confirmPassword: formData.confirmPassword
        });

        if (result) {
            setTimeout(() => navigate(PATHS.LOGIN), 2000);
        }
    };

    if (!formData.email) {
        return (
            <div className="md:col-span-12 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-bold">Unauthorized Session</h3>
                <p className="text-xs text-text-muted">Identity recovery session lost. Please re-initialize.</p>
                <button onClick={() => navigate(PATHS.FORGOT_PASSWORD)} className="text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:underline">Re-Initialize Protocol</button>
            </div>
        );
    }

    return (
        <div className="md:col-span-12 min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass border border-border-subtle rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden transition-all duration-500">
                {/* Header */}
                <div className="relative mb-10 text-center">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <ShieldCheck className="text-blue-400" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Identity Authorization</h1>
                    <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">Final Phase: Credential Update</p>
                </div>

                {!successData ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Section */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1 text-center block">6-Digit Authorization Code</label>
                            <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
                                {formData.otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={otpRefs[i]}
                                        type="text"
                                        maxLength={1}
                                        inputMode="numeric"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={cn(
                                            "w-10 h-14 bg-surface-dark border rounded-xl text-center text-xl font-bold transition-all duration-300",
                                            digit ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-blue-400" : "border-border-subtle text-text-primary focus:border-blue-500/50"
                                        )}
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">New Node Key</label>
                                <div className="relative">
                                    <input 
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-surface-dark border border-border-subtle rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 transition-all outline-none"
                                        required
                                    />
                                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted/30" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Confirm Identity Key</label>
                                <input 
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full bg-surface-dark border border-border-subtle rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-[10px] text-red-500 font-mono text-center animate-pulse">{error}</p>}

                        <button 
                            type="submit"
                            disabled={isResetting || formData.otp.some(d => !d) || !formData.password}
                            className={cn(
                                "w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all",
                                formData.password && !isResetting ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02]" : "bg-surface-elevated text-text-muted cursor-not-allowed"
                            )}
                        >
                            {isResetting ? <Loader2 size={16} className="animate-spin" /> : "Authorize Update"}
                        </button>
                    </form>
                ) : (
                    <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-blue-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold">Protocol Finalized</h3>
                        <p className="text-xs text-text-muted max-w-[240px] mx-auto">
                            Identity credentials successfully updated. Transitioning to login state...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
