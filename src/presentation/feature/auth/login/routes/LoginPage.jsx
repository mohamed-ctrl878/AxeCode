import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { LoginRequest } from '@infrastructure/DTO/Request/LoginRequest';
import { useLoginUser } from '@domain/useCase/useLoginUser';
import { PATHS } from '@presentation/routes/paths';
import { KeyRound, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

/**
 * LoginPage: Unified Entry Orchestrator for Authentication.
 * Follows Clean Architecture: Separates logic from representation.
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const recaptchaRef = React.useRef(null);
    const [formData, setFormData] = useState(new LoginRequest());

    const { login, isLoggingIn, loginError } = useLoginUser();

    // Handlers
    const updateFormData = (updates) => {
        setFormData(prev => new LoginRequest({ ...prev, ...updates }));
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        try {
            const result = await login(formData);
            if (result) {
                // Success! Redirect to dashboard (State is already updated via useLoginUser -> Redux)
                navigate(PATHS.DASHBOARD);
            }
        } catch (err) {
            // Reset reCAPTCHA on failed attempt
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                updateFormData({ recaptchaToken: '' });
            }
        }
    };

    const isFormValid = formData.identifier && formData.password && formData.recaptchaToken;

    return (
        <div className="md:col-span-12 min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass border border-white/5 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mb-10" />

                {/* Header */}
                <div className="relative mb-10 text-center">
                    <div className="w-12 h-12 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-primary/20">
                        <KeyRound className="text-accent-primary" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Access Terminal</h1>
                    <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest italic">Identity Verification Required</p>
                </div>

                {/* Error Display */}
                {loginError && (
                    <div className="mb-6 p-3 rounded-xl bg-red-400/10 border border-red-400/20 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                        <p className="text-[11px] text-red-400 font-medium">{loginError}</p>
                    </div>
                )}

                {/* Form Content */}
                <form onSubmit={handleLogin} className="relative min-h-[250px]">
                    <LoginForm 
                        formData={formData} 
                        onUpdate={updateFormData} 
                        recaptchaRef={recaptchaRef}
                        isLoading={isLoggingIn}
                    />

                    {/* Submit Bar */}
                    <div className="mt-10 pt-4 border-t border-white/5">
                        <button 
                            type="submit"
                            disabled={!isFormValid || isLoggingIn}
                            className={`
                                w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300
                                ${isFormValid && !isLoggingIn
                                    ? 'bg-accent-primary text-text-on-accent shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]' 
                                    : 'bg-white/5 text-text-muted cursor-not-allowed'}
                            `}
                        >
                            {isLoggingIn ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Initiate Protocol</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">
                        New entity in the network? {' '}
                        <button onClick={() => navigate('/register')} className="text-accent-primary font-bold hover:underline">Request Node</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
