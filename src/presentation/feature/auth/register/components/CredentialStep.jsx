import React, { useEffect } from 'react';
import { useDebounce } from '@core/hooks/useDebounce';
import { useUserAvailability } from '@domain/useCase/useUserAvailability';
import { User, Mail, Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CredentialStep: Handles Security-related inputs (Identity).
 * Integrates real-time availability checks with 3s debounce.
 */
export const CredentialStep = ({ formData, onUpdate }) => {
    // 1. Availability Orchestration for Username
    const { 
        check: checkUsername, 
        isAvailable: isUsernameAvailable, 
        isChecking: isCheckingUsername 
    } = useUserAvailability();
    
    const debouncedUsername = useDebounce(formData.username, 1500);

    // 2. Availability Orchestration for Email
    const { 
        check: checkEmail, 
        isAvailable: isEmailAvailable, 
        isChecking: isCheckingEmail 
    } = useUserAvailability();
    
    const debouncedEmail = useDebounce(formData.email, 1500);

    // Effects to trigger availability checks
    useEffect(() => {
        if (debouncedUsername && debouncedUsername.length >= 3) {
            checkUsername('username', debouncedUsername);
        }
    }, [debouncedUsername, checkUsername]);

    useEffect(() => {
        if (debouncedEmail && debouncedEmail.includes('@')) {
            checkEmail('email', debouncedEmail);
        }
    }, [debouncedEmail, checkEmail]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Username</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username || ''}
                            onChange={(e) => onUpdate({ username: e.target.value })}
                            placeholder="Pick a unique username"
                            className={cn(
                                "w-full bg-surface-dark/50 border rounded-xl py-3 pl-10 pr-24 text-sm outline-none transition-all",
                                isUsernameAvailable === true && "border-emerald-500/50 bg-emerald-500/5",
                                isUsernameAvailable === false && "border-red-400/50 bg-red-400/5",
                                isUsernameAvailable === null && "border-border-subtle focus:border-accent-primary"
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isCheckingUsername && (
                                <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                                    <Loader2 className="text-accent-primary animate-spin" size={14} />
                                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-tighter">Syncing</span>
                                </div>
                            )}
                            {!isCheckingUsername && isUsernameAvailable === true && (
                                <div className="flex items-center gap-1.5 text-emerald-500 animate-in slide-in-from-right-2 duration-300">
                                    <CheckCircle2 size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Valid</span>
                                </div>
                            )}
                            {!isCheckingUsername && isUsernameAvailable === false && (
                                <div className="flex items-center gap-1.5 text-red-400 animate-in slide-in-from-right-2 duration-300">
                                    <XCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Taken</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {isUsernameAvailable === false && <p className="px-1 text-[9px] text-red-400 font-mono italic">This identity is already claimed by another agent.</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email || ''}
                            onChange={(e) => onUpdate({ email: e.target.value })}
                            placeholder="your@email.com"
                            className={cn(
                                "w-full bg-surface-dark/50 border rounded-xl py-3 pl-10 pr-24 text-sm outline-none transition-all",
                                isEmailAvailable === true && "border-emerald-500/50 bg-emerald-500/5",
                                isEmailAvailable === false && "border-red-400/50 bg-red-400/5",
                                isEmailAvailable === null && "border-border-subtle focus:border-accent-primary"
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isCheckingEmail && (
                                <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                                    <Loader2 className="text-accent-primary animate-spin" size={14} />
                                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-tighter">Syncing</span>
                                </div>
                            )}
                            {!isCheckingEmail && isEmailAvailable === true && (
                                <div className="flex items-center gap-1.5 text-emerald-500 animate-in slide-in-from-right-2 duration-300">
                                    <CheckCircle2 size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Valid</span>
                                </div>
                            )}
                            {!isCheckingEmail && isEmailAvailable === false && (
                                <div className="flex items-center gap-1.5 text-red-400 animate-in slide-in-from-right-2 duration-300">
                                    <XCircle size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Taken</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {isEmailAvailable === false && <p className="px-1 text-[9px] text-red-400 font-mono italic">This email is already linked to an existing account.</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password || ''}
                            onChange={(e) => onUpdate({ password: e.target.value })}
                            placeholder="Create a secure password"
                            className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-1.5 px-1 pt-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                formData.password?.length >= i * 2 ? "bg-accent-primary" : "bg-white/5"
                            )} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
