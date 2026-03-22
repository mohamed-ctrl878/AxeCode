import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title.trim(), type, isPublic);
        setTitle('');
        setType('video');
        setIsPublic(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animation-fade-in">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 animation-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white">Add Lesson</h3>
                        {weekTitle && (
                            <p className="text-[11px] text-text-muted mt-0.5">into <span className="text-accent-primary font-medium">{weekTitle}</span></p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-white/30 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Lesson Title *</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Variables"
                            className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Lesson Type</label>
                        <div className="flex gap-3">
                            {['video', 'article'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                                        type === t
                                            ? 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary'
                                            : 'border-white/10 bg-background text-text-muted hover:text-white'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center justify-between px-1">
                        <label className="text-sm font-bold text-text-muted">Public Access</label>
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                                isPublic ? 'bg-accent-primary' : 'bg-white/10'
                            }`}
                        >
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                                isPublic ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-white border border-white/10 hover:border-white/20 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-accent-primary hover:bg-accent-secondary text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <Loader2 size={14} className="animate-spin" />}
                            Add Lesson
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
