import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';

export const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        // Paymob redirects with parameters like ?success=true&id=...
        const isSuccess = searchParams.get('success') === 'true';
        const isPending = searchParams.get('pending') === 'true';

        // Check window top location. If we are in an iframe, we want to pop out or notify parent.
        if (window !== window.top) {
            window.parent.postMessage({
                type: 'PAYMOB_RESULT',
                success: isSuccess,
                pending: isPending,
                params: Object.fromEntries(searchParams.entries())
            }, '*');
            
            // Just show a message in the iframe
            setStatus(isSuccess ? 'success' : isPending ? 'pending' : 'failed');
            setMessage(isSuccess ? 'Payment Successful! You can close this window.' : 'Payment failed or was cancelled. You can close this window.');
            return;
        }

        // If accessed directly as a full page
        setStatus(isSuccess ? 'success' : isPending ? 'pending' : 'failed');
        if (isSuccess) {
            setMessage('Your payment was successful! Your access has been granted.');
        } else if (isPending) {
            setMessage('Your payment is pending verification. We will update your status shortly.');
        } else {
            setMessage('Your payment could not be processed. Please try again.');
        }
    }, [searchParams]);

    const handleReturn = () => {
        // Simple logic: if in iframe, parent handles it. 
        // If full page, go to dashboard or content library
        navigate(PATHS.ENROLLED_COURSES || '/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full bento-card p-8 bg-surface border border-border-subtle rounded-3xl text-center shadow-2xl animate-fade-in">
                
                {status === 'processing' && (
                    <div className="flex flex-col items-center gap-4 text-accent-primary">
                        <Loader2 size={48} className="animate-spin text-accent-primary" />
                        <h2 className="text-2xl font-black">Processing</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4 text-status-success">
                        <CheckCircle size={64} className="text-status-success" />
                        <h2 className="text-3xl font-black text-text-primary">Success!</h2>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-4 text-status-error">
                        <XCircle size={64} className="text-status-error" />
                        <h2 className="text-3xl font-black text-text-primary">Payment Failed</h2>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="flex flex-col items-center gap-4 text-status-warning">
                        <Loader2 size={64} className="text-status-warning animate-pulse" />
                        <h2 className="text-3xl font-black text-text-primary">Pending</h2>
                    </div>
                )}

                <p className="text-text-muted mt-4 mb-8 text-lg">{message}</p>

                {window === window.top && (
                    <button
                        onClick={handleReturn}
                        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    >
                        Go to My Content <ArrowRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
