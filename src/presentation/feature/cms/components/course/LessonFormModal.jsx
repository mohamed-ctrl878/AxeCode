import React, { useState } from 'react';
import { X, Loader2, BookOpen, Plus, Globe, Lock } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * LessonFormModal: Modal form for creating a lesson inside a week.
 * Follows SRP: Handles title + type input, delegates submission upward.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit - (title, type, isPublic)
 * @param {string} props.weekTitle - For contextual header
 * @param {boolean} props.isLoading
 */
export const LessonFormModal = ({ isOpen, onClose, onSubmit, weekTitle = '', isLoading = false }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('video');
    const [isPublic, setIsPublic] = useState(false);
    const [isDraft, setIsDraft] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title.trim(), type, isPublic, isDraft);
        setTitle('');
        setType('video');
        setIsPublic(false);
        setIsDraft(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animation-fade-in px-4">
            <div className="w-full max-w-md bg-surface-elevated border border-border-default rounded-3xl shadow-2xl p-8 animation-scale-in relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-accent-primary">
                    <BookOpen size={120} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-text-primary">Add New Lesson</h3>
                        {weekTitle && (
                            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold opacity-60">
                                Target: <span className="text-accent-primary">{weekTitle}</span>
                            </p>
                        )}
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
                    {/* Title */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Lesson Identifier</label>
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

                    {/* Type Selection */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Content Type</label>
                        <div className="flex gap-3">
                            {['video', 'article'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "flex-1 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                                        type === t
                                            ? 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary shadow-lg shadow-accent-primary/5'
                                            : 'border-border-subtle bg-background text-text-muted hover:text-text-primary hover:border-border-default'
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full", type === t ? "bg-accent-primary animate-pulse" : "bg-text-muted/20")} />
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center justify-between px-1 bg-surface-sunken p-5 rounded-2xl border border-border-subtle">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isPublic ? "bg-status-success/10 text-status-success" : "bg-text-muted/10 text-text-muted/40")}>
                                {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Public Access</label>
                                <p className="text-[9px] text-text-muted opacity-60">Visibility to non-enrolled users</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                                isPublic ? 'bg-status-success' : 'bg-surface-elevated border-border-subtle'
                            )}
                        >
                            <span className={cn(
                                "absolute w-4 h-4 rounded-full bg-white shadow-md transition-all",
                                isPublic ? 'translate-x-7' : 'translate-x-1'
                            )} />
                        </button>
                    </div>

                    {/* actions section */}
                    <div className="flex items-center justify-between border-t border-border-subtle pt-6">
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none",
                                isDraft 
                                    ? "bg-accent-primary/10 border-accent-primary text-accent-primary"
                                    : "bg-surface-sunken border-border-subtle text-text-muted" 
                            )}
                        >
                            <div className={cn(
                                "w-6 h-3 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-accent-primary" : "bg-text-muted/20"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-3.5" : "left-0.5"
                                )} />
                            </div>
                            <span className="text-[9px] font-bold uppercase">
                                {isDraft ? 'Draft' : 'Live'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
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
                                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                                )}
                                Initialize Lesson
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
