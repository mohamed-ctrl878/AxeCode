import React from 'react';
import { CheckCircle, ArrowRight, Layout, PlusCircle, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@core/utils/cn';

/**
 * CMSSuccessModal: A premium, scholarly success state for content creation.
 * Guides the user to the next logical step in the "Content Protocol".
 */
export const CMSSuccessModal = ({ 
    isOpen, 
    onClose, 
    title = "Entity Catalogued", 
    message = "The technical manuscript has been successfully committed to the repository.",
    primaryActionLabel = "Proceed to Architect",
    primaryActionLink,
    secondaryActionLabel = "Return to Archive",
    secondaryActionLink,
    icon: Icon = Layout
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-near-black/40 backdrop-blur-md animation-fade-in">
            <div className="w-full max-w-lg bg-ivory border border-border-default rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden animation-slide-up">
                {/* Visual Header */}
                <div className="h-2 bg-accent-primary w-full" />
                
                <div className="p-10 text-center space-y-8">
                    {/* Success Icon */}
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-accent-primary/20 rounded-3xl rotate-12 animate-pulse" />
                        <div className="absolute inset-0 bg-accent-primary text-ivory rounded-3xl flex items-center justify-center shadow-lg relative z-10">
                            <CheckCircle size={48} className="animate-bounce-short" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-serif font-bold text-near-black tracking-tight">{title}</h2>
                        <p className="text-sm font-serif italic text-text-muted opacity-80 leading-relaxed max-w-[300px] mx-auto">
                            {message}
                        </p>
                    </div>

                    {/* Action Matrix */}
                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <button
                            onClick={() => {
                                if (primaryActionLink) navigate(primaryActionLink);
                                onClose();
                            }}
                            className="w-full h-16 rounded-[20px] bg-near-black text-ivory font-serif text-sm flex items-center justify-between px-8 group hover:bg-near-black/90 transition-all active:scale-[0.98] shadow-xl"
                        >
                            <div className="flex items-center gap-4">
                                <PlusCircle size={20} className="text-accent-primary" />
                                <span>{primaryActionLabel}</span>
                            </div>
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform opacity-40 group-hover:opacity-100" />
                        </button>

                        <button
                            onClick={() => {
                                if (secondaryActionLink) navigate(secondaryActionLink);
                                onClose();
                            }}
                            className="w-full h-16 rounded-[20px] border border-border-default text-text-muted font-serif text-sm flex items-center justify-between px-8 group hover:bg-surface-sunken transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <Archive size={20} />
                                <span>{secondaryActionLabel}</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Scholarly Footer */}
                <div className="px-10 py-6 bg-parchment/30 border-t border-border-subtle flex justify-center">
                    <span className="text-[9px] font-bold text-near-black/30 uppercase tracking-[0.3em]">Protocol Commitment Finalized</span>
                </div>
            </div>
        </div>
    );
};
