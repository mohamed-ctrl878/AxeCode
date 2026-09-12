import React from 'react';
import { X } from 'lucide-react';

export const PaymobModal = ({ isOpen, onClose, iframeUrl, onSuccess }) => {
    React.useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'PAYMOB_RESULT') {
                if (event.data.success) {
                    onSuccess?.();
                    // Keep modal open for a second so they see the success page inside the iframe?
                    // Or close immediately? Let's close after a small delay.
                    setTimeout(() => onClose(), 2000);
                } else if (!event.data.pending) {
                   // Failed/Cancelled
                   // We keep it open or let them close it.
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onClose, onSuccess]);

    if (!isOpen || !iframeUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl h-full max-h-[90vh] bg-surface rounded-2xl md:rounded-3xl shadow-2xl flex flex-col border border-border-subtle overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-sunken">
                    <h3 className="font-bold text-text-primary">Complete Payment</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Iframe Container */}
                <div className="flex-1 w-full bg-white">
                    <iframe 
                        src={iframeUrl}
                        width="100%"
                        height="100%"
                        className="border-none"
                        title="Secure Payment Form"
                        allow="payment"
                    />
                </div>
            </div>
        </div>
    );
};
