import React from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Recaptcha } from '../../../../shared/components/Recaptcha';
import { cn } from '@core/utils/cn';

/**
 * LoginForm: Handles User Authentication inputs.
 * Follows SRP: Manages credential input and reCAPTCHA.
 */
export const LoginForm = ({ formData, onUpdate, recaptchaRef, isLoading }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                {/* Identifier Field (Email/Username) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Identifier (Email or Username)</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            name="identifier"
                            value={formData.identifier || ''}
                            onChange={(e) => onUpdate({ identifier: e.target.value })}
                            placeholder="Enter your email or username"
                            disabled={isLoading}
                            className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Access Key</label>
                        <button type="button" className="text-[9px] text-accent-primary hover:underline font-bold uppercase tracking-tighter">Lost Access?</button>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password || ''}
                            onChange={(e) => onUpdate({ password: e.target.value })}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-primary outline-none transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* reCAPTCHA Security */}
                <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-accent-primary px-1 flex items-center gap-2">
                        <div className="w-1 h-1 bg-accent-primary rounded-full animate-pulse" />
                        Security Check
                    </label>
                    <Recaptcha 
                        ref={recaptchaRef}
                        onChange={(token) => onUpdate({ recaptchaToken: token })} 
                    />
                </div>
            </div>
        </div>
    );
};
