import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar } from 'lucide-react';

/**
 * WeekFormModal: Reusable modal form for creating or editing a Week's title.
 * Follows SRP: Only handles form state and submission delegation.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Visibility control
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler (title)
 * @param {object|null} props.editingWeek - If provided, the modal is in "edit" mode
 * @param {boolean} props.isLoading - Submission loading state
 */
export const WeekFormModal = ({ isOpen, onClose, onSubmit, editingWeek = null, isLoading = false }) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (editingWeek) {
            setTitle(editingWeek.title || '');
        } else {
            setTitle('');
        }
    }, [editingWeek, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title.trim());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animation-fade-in px-4">
            <div className="w-full max-w-md bg-surface-elevated border border-border-default rounded-3xl shadow-2xl p-8 animation-scale-in relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-accent-primary">
                    <Calendar size={120} />
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-text-primary">
                            {editingWeek ? 'Edit Week' : 'New Schedule Week'}
                        </h3>
                        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold opacity-60">
                            Curriculum Module Orchestration
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-default transition-all bg-surface shadow-sm"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Week Title Identifier</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Variables"
                            className="bg-background border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold text-text-primary focus:outline-none focus:border-accent-primary transition-all shadow-inner placeholder:text-text-muted/20"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all border border-transparent hover:bg-surface-sunken"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-accent-primary text-on-accent shadow-[0_10px_20px_rgba(52,211,153,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Calendar size={16} className="group-hover:rotate-12 transition-transform" />
                            )}
                            {editingWeek ? 'Save Configuration' : 'Confirm Week'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
