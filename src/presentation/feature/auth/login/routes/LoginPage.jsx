import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { LoginRequest } from '@infrastructure/DTO/Request/LoginRequest';
import { useLoginUser } from '@domain/useCase/useLoginUser';
import { PATHS } from '@presentation/routes/paths';
import { useGithubLogin } from '@domain/useCase/useGithubLogin';
import AxeCodeLogo from '@presentation/shared/components/AxeCodeLogo';
import { 
    KeyRound, ArrowRight, AlertCircle, Loader2, Github,
    Shield, Cpu, BookOpen, Zap
} from 'lucide-react';

/**
 * LoginPage: Unified Entry Orchestrator for Authentication.
 * Two-column layout:
 * - Left: Brand panel with logo, GitHub OAuth, and value highlights
 * - Right: Login form with credentials and reCAPTCHA
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const recaptchaRef = React.useRef(null);
    const [formData, setFormData] = useState(new LoginRequest());
    const { getGithubUrl } = useGithubLogin();

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
        <div className="md:col-span-12 min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-halo border border-border-subtle">
                
                {/* ═══ Left Panel: Brand & GitHub ═══ */}
                <div className="relative bg-near-black p-10 lg:p-14 flex flex-col justify-between overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/8 rounded-full blur-[100px] -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-[80px] -ml-16 -mb-16" />
                    
                    {/* Dot Pattern */}
                    <div 
                        className="absolute inset-0 opacity-[0.15]" 
                        style={{
                            backgroundImage: 'radial-gradient(circle, #c96442 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Logo */}
                        <div className="mb-12">
                            <Link to="/" className="no-underline inline-block">
                                <AxeCodeLogo size="text-2xl" />
                            </Link>
                        </div>

                        {/* Headline */}
                        <div className="flex-1 flex flex-col justify-center">
                            <h2 className="text-4xl lg:text-5xl font-serif text-ivory leading-tight mb-6">
                                Welcome Back,<br />
                                <span className="italic text-accent-primary">Scholar.</span>
                            </h2>
                            <p className="text-ivory/50 text-sm leading-relaxed max-w-sm mb-10">
                                Your workspace, courses, and community are waiting. Resume where you left off.
                            </p>

                            {/* Value Highlights */}
                            <div className="space-y-4 mb-12">
                                {[
                                    { icon: Shield, text: 'End-to-end encrypted sessions' },
                                    { icon: Cpu, text: 'Personalized learning dashboard' },
                                    { icon: BookOpen, text: 'Resume courses instantly' },
                                    { icon: Zap, text: 'Real-time progress tracking' },
                                ].map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-lg bg-ivory/5 border border-ivory/10 flex items-center justify-center group-hover:bg-accent-primary/10 group-hover:border-accent-primary/20 transition-all">
                                            <Icon size={14} className="text-accent-primary" />
                                        </div>
                                        <span className="text-ivory/60 text-sm group-hover:text-ivory/90 transition-colors">{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* GitHub OAuth */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-ivory/10" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ivory/30">Quick Access</span>
                                    <div className="h-px flex-1 bg-ivory/10" />
                                </div>
                                
                                <button 
                                    onClick={() => window.location.href = getGithubUrl()}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-ivory/5 border border-ivory/10 text-ivory hover:bg-ivory/10 hover:border-ivory/20 transition-all duration-300 group cursor-pointer"
                                >
                                    <Github size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-semibold">Continue with GitHub</span>
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </button>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="pt-8 mt-auto">
                            <p className="text-[10px] text-ivory/25 leading-relaxed">
                                Protected by industry-standard security protocols.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══ Right Panel: Login Form ═══ */}
                <div className="bg-surface p-8 lg:p-12 flex flex-col justify-center relative">
                    {/* Subtle Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="w-11 h-11 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-accent-primary/20">
                                <KeyRound className="text-accent-primary" size={22} />
                            </div>
                            <h1 className="text-2xl font-serif font-bold tracking-tight text-text-primary">Access Terminal</h1>
                            <p className="text-xs text-text-muted mt-1.5 font-sans uppercase tracking-widest">Identity Verification Required</p>
                        </div>

                        {/* Error Display */}
                        {loginError && (
                            <div className="mb-6 p-3 rounded-xl bg-red-400/10 border border-red-400/20 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-[11px] text-red-400 font-medium">{loginError}</p>
                            </div>
                        )}

                        {/* Form Content */}
                        <form onSubmit={handleLogin} className="relative">
                            <LoginForm 
                                formData={formData} 
                                onUpdate={updateFormData} 
                                recaptchaRef={recaptchaRef}
                                isLoading={isLoggingIn}
                            />

                            {/* Submit Bar */}
                            <div className="mt-8 pt-4 border-t border-border-subtle space-y-3">
                                <button 
                                    type="submit"
                                    disabled={!isFormValid || isLoggingIn}
                                    className={`
                                        w-full py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 cursor-pointer
                                        ${isFormValid && !isLoggingIn
                                            ? 'bg-accent-primary text-text-on-accent shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]' 
                                            : 'bg-surface-elevated text-text-muted cursor-not-allowed'}
                                    `}
                                >
                                    {isLoggingIn ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <span className="text-sm">Initiate Protocol</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
                                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[11px] font-semibold text-accent-primary hover:text-text-primary transition-all duration-300 bg-accent-primary/5 hover:bg-accent-primary/10 border border-accent-primary/10 cursor-pointer"
                                >
                                    Forgot Protocol? [Identity Recovery]
                                </button>
                            </div>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <p className="text-[11px] text-text-muted">
                                New entity in the network? {' '}
                                <button onClick={() => navigate(PATHS.REGISTER)} className="text-accent-primary font-bold hover:underline cursor-pointer">Request Node</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;