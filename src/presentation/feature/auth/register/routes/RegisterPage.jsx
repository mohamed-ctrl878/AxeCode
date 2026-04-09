import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CredentialStep } from '../components/CredentialStep';
import { PersonalStep } from '../components/PersonalStep';
import { OtpStep } from '../components/OtpStep';
import { RegisterAction } from '../components/RegisterAction';
import { RegisterRequest } from '@infrastructure/DTO/Request/RegisterRequest';
import { useRegisterUser } from '@domain/useCase/useRegisterUser';
import { PATHS } from '@presentation/routes/paths';
import { Sparkles, ShieldCheck, Fingerprint } from 'lucide-react';

/**
 * RegisterPage: Multi-step registration orchestrator.
 * 1: Credentials, 2: Personal Info, 3: OTP Verification
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const recaptchaRef = React.useRef(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(new RegisterRequest());

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
        <div className="md:col-span-12 min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass border border-border-subtle rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden transition-all duration-500">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mb-10" />

                {/* Header */}
                <div className="relative mb-10 text-center">
                    <div className="w-12 h-12 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-primary/20">
                        {step === 1 && <Sparkles className="text-accent-primary" size={24} />}
                        {step === 2 && <ShieldCheck className="text-accent-primary" size={24} />}
                        {step === 3 && <Fingerprint className="text-accent-primary" size={24} />}
                    </div>
                    {step === 1 && (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight">Identity Initialization</h1>
                            <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">Step 01: Core Security Protocols</p>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight">Profile Configuration</h1>
                            <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">Step 02: Node Personalization</p>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
                            <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-widest">Step 03: Final Protocol Check</p>
                        </>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-border-subtle'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-border-subtle'}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= 3 ? 'bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-border-subtle'}`} />
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
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">
                            Already have an active node? {' '}
                            <button onClick={() => navigate('/login')} className="text-accent-primary font-bold hover:underline">Access Link</button>
                        </p>
                    </div>
                )}

                {/* Return logic for Step 3 */}
                {step === 3 && (
                    <div className="mt-8 text-center">
                        <button onClick={() => setStep(2)} className="text-[10px] text-text-muted hover:text-accent-primary uppercase tracking-widest transition-colors">
                            Return to Configuration
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
