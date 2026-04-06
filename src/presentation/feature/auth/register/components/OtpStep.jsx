import React, { useState, useRef, useEffect } from 'react';
import { Mail, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * OtpStep: 6-digit identity verification step.
 */
export const OtpStep = ({ 
    email, 
    onVerify, 
    onResend, 
    isConfirming, 
    isResending,
    error,
    resendError
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    // Timer logic for resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last digit
        setOtp(newOtp);

        // Move focus forward
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }

        // Auto-submit if all digits filled
        if (newOtp.every(digit => digit !== '')) {
            onVerify(email, newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            onResend(email);
            setTimer(60);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-primary mb-2">
                    <Mail size={20} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">Verify Your Identity</h3>
                <p className="text-[10px] text-text-muted max-w-[240px]">
                    We've sent a 6-digit initialization code to:<br/>
                    <span className="text-accent-primary font-mono lowercase">{email}</span>
                </p>
            </div>

            {/* OTP Input Grid */}
            <div className="flex justify-between gap-2 max-w-[280px] mx-auto">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={inputRefs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={cn(
                            "w-10 h-14 bg-surface-dark border rounded-xl text-center text-xl font-bold transition-all duration-300",
                            digit ? "border-accent-primary shadow-[0_0_15px_rgba(52,211,153,0.15)] text-accent-primary" : "border-white/5 text-text-primary focus:border-accent-primary/50"
                        )}
                        disabled={isConfirming}
                    />
                ))}
            </div>

            {/* Status & Feedback */}
            <div className="flex flex-col items-center gap-4">
                {error && <p className="text-[10px] text-red-500 font-mono animate-pulse">{error}</p>}
                {resendError && <p className="text-[10px] text-red-400 font-mono italic">{resendError}</p>}
                
                <button 
                    onClick={handleResend}
                    disabled={timer > 0 || isResending}
                    className={cn(
                        "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                        timer > 0 ? "text-text-muted/30 cursor-not-allowed" : "text-text-muted hover:text-accent-primary"
                    )}
                >
                    {isResending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    {timer > 0 ? `Resend available in ${timer}s` : "Resend Protocol"}
                </button>
            </div>
        </div>
    );
};
