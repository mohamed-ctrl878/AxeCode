import React from 'react';
import { X, AlertCircle, Trash2, CheckCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * ConfirmationModal: Premium scholarly dialog for critical user decisions.
 * Replaces window.confirm with a consistent, branded experience.
 */
export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Directive",
    message = "Are you sure you want to proceed with this protocol?",
    confirmLabel = "Confirm",
    cancelLabel = "Abort",
    type = 'danger', // 'danger' | 'warning' | 'info' | 'success'
    isLoading = false
}) => {
    if (!isOpen) return null;

    const icons = {
        danger: { icon: Trash2, color: 'text-accent-rose', bg: 'bg-accent-rose/10', btn: 'bg-accent-rose text-white border-accent-rose hover:bg-accent-rose/90' },
        warning: { icon: AlertCircle, color: 'text-accent-amber', bg: 'bg-accent-amber/10', btn: 'bg-accent-amber text-near-black border-accent-amber hover:bg-accent-amber/90' },
        info: { icon: Info, color: 'text-accent-primary', bg: 'bg-accent-primary/10', btn: 'bg-accent-primary text-ivory border-accent-primary hover:bg-accent-primary/90' },
        success: { icon: CheckCircle, color: 'text-status-success', bg: 'bg-status-success/10', btn: 'bg-status-success text-on-accent border-status-success hover:bg-status-success/90' },
    };

    const config = icons[type] || icons.info;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-near-black/60 backdrop-blur-md animate-fade-in" 
                onClick={isLoading ? undefined : onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-ivory border border-border-default rounded-[40px] shadow-2xl overflow-hidden animate-slide-up origin-center">
                {/* Visual Aura */}
                <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-20", config.bg)} />
                
                <div className="relative p-10 flex flex-col items-center text-center">
                    {/* Icon Assembly */}
                    <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 border border-border-default/50 shadow-inner group transition-transform duration-500 hover:rotate-12", config.bg)}>
                        <Icon size={32} className={cn("transition-transform group-hover:scale-110", config.color)} />
                    </div>

                    {/* Typography */}
                    <div className="space-y-3 mb-10">
                        <h3 className="text-2xl font-serif font-bold text-near-black tracking-tight">{title}</h3>
                        <p className="text-sm text-text-muted font-serif italic leading-relaxed max-w-[280px]">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="h-14 rounded-2xl border border-border-default bg-surface-sunken text-[11px] font-serif font-bold uppercase tracking-widest text-text-muted hover:text-near-black hover:border-near-black/20 transition-all active:scale-95 disabled:opacity-40"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "h-14 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-serif font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg disabled:opacity-40",
                                config.btn
                            )}
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <span className="font-serif">{confirmLabel}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="bg-parchment/50 px-10 py-4 border-t border-border-subtle flex justify-center">
                    <span className="text-[9px] font-mono text-text-muted/40 uppercase tracking-[0.3em]">Protocol Confirmation Required</span>
                </div>
            </div>
        </div>
    );
};
