import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CredentialStep } from '../components/CredentialStep';
import { PersonalStep } from '../components/PersonalStep';
import { OtpStep } from '../components/OtpStep';
import { RegisterAction } from '../components/RegisterAction';
import { RegisterRequest } from '@infrastructure/DTO/Request/RegisterRequest';
import { useRegisterUser } from '@domain/useCase/useRegisterUser';
import { useGithubLogin } from '@domain/useCase/useGithubLogin';
import { PATHS } from '@presentation/routes/paths';
import AxeCodeLogo from '@presentation/shared/components/AxeCodeLogo';
import { 
    Sparkles, ShieldCheck, Fingerprint, Github, 
    ArrowRight, BookOpen, Code2, Users, Zap
} from 'lucide-react';

/**
 * RegisterPage: Multi-step registration orchestrator.
 * Two-column layout:
 * - Left: Brand panel with logo, GitHub OAuth, and feature highlights
 * - Right: Multi-step registration form
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const recaptchaRef = React.useRef(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(new RegisterRequest());
    const { getGithubUrl } = useGithubLogin();

    const { 
        register, isRegistering, registrationError,
        confirmOtp, isConfirming, confirmationError,
        resendOtp, isResending, resendError
    } = useRegisterUser();

    // Handlers
    const updateFormData = (updates) => {
        setFormData(prev => new RegisterRequest({ ...prev, ...updates }));
    };

    const handleNext = async () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            try {
                const result = await register(formData);
                if (result) {
                    // Registration success -> Move to OTP step
                    setStep(3);
                }
            } catch (err) {
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                    updateFormData({ recaptchaToken: '' });
                }
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(prev => prev - 1);
        else navigate(-1);
    };

    const handleOtpVerify = async (email, code) => {
        const result = await confirmOtp(email, code);
        if (result) {
            navigate(PATHS.DASHBOARD);
        }
    };

    // Validation
    const isStep1Valid = formData.username && formData.email && formData.password && formData.password.length >= 8;
    const isStep2Valid = formData.firstname && formData.lastname && formData.university && formData.recaptchaToken;

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
                                Begin Your<br />
                                <span className="italic text-accent-primary">Scholar's Journey.</span>
                            </h2>
                            <p className="text-ivory/50 text-sm leading-relaxed max-w-sm mb-10">
                                Join a premium learning environment where developers transform into master engineers.
                            </p>

                            {/* Feature Highlights */}
                            <div className="space-y-4 mb-12">
                                {[
                                    { icon: BookOpen, text: 'Professional courses with live code' },
                                    { icon: Code2, text: 'Hands-on coding challenges' },
                                    { icon: Users, text: 'Collaborative workspaces' },
                                    { icon: Zap, text: 'displayed recommendation contents' },
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
                                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ivory/30">Quick Start</span>
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

                        {/* Bottom: Legal */}
                        <div className="pt-8 mt-auto">
                            <p className="text-[10px] text-ivory/25 leading-relaxed">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ═══ Right Panel: Registration Form ═══ */}
                <div className="bg-surface p-8 lg:p-12 flex flex-col justify-center relative">
                    {/* Subtle Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="w-11 h-11 bg-accent-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-accent-primary/20">
                                {step === 1 && <Sparkles className="text-accent-primary" size={22} />}
                                {step === 2 && <ShieldCheck className="text-accent-primary" size={22} />}
                                {step === 3 && <Fingerprint className="text-accent-primary" size={22} />}
                            </div>
                            {step === 1 && (
                                <>
                                    <h1 className="text-2xl font-serif font-bold tracking-tight text-text-primary">Identity Initialization</h1>
                                    <p className="text-xs text-text-muted mt-1.5 font-sans uppercase tracking-widest">Step 01: Core Security Protocols</p>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <h1 className="text-2xl font-serif font-bold tracking-tight text-text-primary">Profile Configuration</h1>
                                    <p className="text-xs text-text-muted mt-1.5 font-sans uppercase tracking-widest">Step 02: Node Personalization</p>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <h1 className="text-2xl font-serif font-bold tracking-tight text-text-primary">Identity Verification</h1>
                                    <p className="text-xs text-text-muted mt-1.5 font-sans uppercase tracking-widest">Step 03: Final Protocol Check</p>
                                </>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-2 mb-8">
                            <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-accent-primary' : 'bg-border-subtle'}`} />
                            <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-accent-primary' : 'bg-border-subtle'}`} />
                            <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 3 ? 'bg-accent-primary' : 'bg-border-subtle'}`} />
                        </div>

                        {/* Steps Content */}
                        <div className="relative min-h-[300px]">
                            {step === 1 && <CredentialStep formData={formData} onUpdate={updateFormData} />}
                            {step === 2 && <PersonalStep formData={formData} onUpdate={updateFormData} recaptchaRef={recaptchaRef} />}
                            {step === 3 && (
                                <OtpStep 
                                    email={formData.email}
                                    onVerify={handleOtpVerify}
                                    onResend={resendOtp}
                                    isConfirming={isConfirming}
                                    isResending={isResending}
                                    error={confirmationError}
                                    resendError={resendError}
                                />
                            )}
                        </div>

                        {/* Action Bar (Steps 1 & 2 only) */}
                        {step < 3 && (
                            <RegisterAction 
                                onNext={handleNext}
                                onBack={handleBack}
                                isLastStep={step === 2}
                                isLoading={isRegistering}
                                error={registrationError}
                                isStepValid={step === 1 ? isStep1Valid : isStep2Valid}
                            />
                        )}

                        {/* Footer Link (Step 1 only) */}
                        {step === 1 && (
                            <div className="mt-8 text-center">
                                <p className="text-[11px] text-text-muted">
                                    Already have an active node? {' '}
                                    <button onClick={() => navigate('/login')} className="text-accent-primary font-bold hover:underline cursor-pointer">Access Link</button>
                                </p>
                            </div>
                        )}

                        {/* Return logic for Step 3 */}
                        {step === 3 && (
                            <div className="mt-8 text-center">
                                <button onClick={() => setStep(2)} className="text-[11px] text-text-muted hover:text-accent-primary transition-colors cursor-pointer">
                                    ← Return to Configuration
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
