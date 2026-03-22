import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animation-fade-in">
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 animation-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight text-white">
                        {editingWeek ? 'Edit Week' : 'Add New Week'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-white/30 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Week Title *</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Fundamentals"
                            className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                            autoFocus
                        />
                    </div>

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
                            {editingWeek ? 'Save Changes' : 'Add Week'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
