import React from 'react';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * RegisterAction: Resuable button and error handler for registration steps.
 */
export const RegisterAction = ({ 
    onNext, 
    onBack, 
    isLastStep, 
    isLoading, 
    error,
    isStepValid = true
}) => {
    return (
        <div className="space-y-4 pt-4">
            {error && (
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={18} />
                    <p className="text-xs font-mono">{error}</p>
                </div>
            )}

            <div className="flex gap-4">
                {onBack && (
                    <button 
                        onClick={onBack}
                        disabled={isLoading}
                        className="flex-1 py-3 border border-border-subtle rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                        Return
                    </button>
                )}
                
                <button 
                    onClick={onNext}
                    disabled={isLoading || !isStepValid}
                    className={cn(
                        "flex-1 py-3 rounded-xl btn-primary text-xs tracking-widest",
                        isLastStep && "from-accent-primary to-surface"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>{isLastStep ? 'Initialize Account' : 'Next Protocol'}</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
