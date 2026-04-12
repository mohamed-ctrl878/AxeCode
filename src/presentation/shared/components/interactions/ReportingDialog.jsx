import React, { useState, useEffect } from 'react';
import { X, Flag, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useFetchReportTypes } from '@domain/useCase/useFetchReportTypes';
import { useReportContent } from '@domain/useCase/useReportContent';
import { cn } from '@core/utils/cn';

/**
 * ReportingDialog: Premium modal for submitting content reports.
 * Fetches reasons from CMS and provides a detailed feedback loop.
 */
export const ReportingDialog = ({ isOpen, onClose, docId, contentType }) => {
    const { reportTypes, isLoading: loadingReasons, fetch: fetchReasons } = useFetchReportTypes();
    const { reportContent, isReporting, reportError } = useReportContent();

    const [selectedReasons, setSelectedReasons] = useState([]);
    const [description, setDescription] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch reasons when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchReasons();
            setSelectedReasons([]);
            setDescription('');
            setIsSuccess(false);
        }
    }, [isOpen, fetchReasons]);

    const handleToggleReason = (id) => {
        setSelectedReasons(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedReasons.length === 0 && !description.trim()) return;

        try {
            await reportContent(docId, contentType, {
                reportTypeIds: selectedReasons,
                description: [{ 
                    type: 'paragraph', 
                    children: [{ type: 'text', text: description || 'No additional description provided.' }] 
                }]
            });
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Submission failed', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-near-black/60 backdrop-blur-sm animate-fade-in" 
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-ivory border border-border-default rounded-[40px] shadow-2xl overflow-hidden animate-slide-up origin-center">
                
                {/* Header */}
                <div className="bg-parchment px-8 py-6 border-b border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-3 text-near-black">
                        <Flag size={20} className="text-accent-rose" />
                        <h3 className="text-lg font-serif font-bold tracking-tight">Report Content</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-near-black/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-xl font-serif font-bold text-near-black">Report Submitted</h4>
                            <p className="text-sm text-text-muted max-w-[280px]">Thank you for helping us maintain the integrity of our repository.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Reasons Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-near-black/40 font-serif uppercase tracking-[0.2em] block px-1">
                                    Select Reasons (Optional)
                                </label>
                                {loadingReasons ? (
                                    <div className="flex items-center gap-3 p-4 bg-surface-sunken rounded-2xl animate-pulse">
                                        <Loader2 size={16} className="animate-spin opacity-20" />
                                        <span className="text-xs text-text-muted font-serif">Retreiving reasons...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {reportTypes.map((reason) => {
                                            const reasonId = reason.documentId || reason.id;
                                            const isSelected = selectedReasons.includes(reasonId);
                                            return (
                                                <button
                                                    key={reasonId}
                                                    type="button"
                                                    onClick={() => handleToggleReason(reasonId)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[11px] font-serif font-bold transition-all border",
                                                        isSelected 
                                                            ? "bg-near-black text-ivory border-near-black shadow-md" 
                                                            : "bg-surface text-text-muted border-border-subtle hover:border-near-black/20"
                                                    )}
                                                >
                                                    {reason.type}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-near-black/40 font-serif uppercase tracking-[0.2em] block px-1">
                                    Additional Context
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide more details about why you are reporting this..."
                                    className="w-full h-32 bg-surface-sunken border border-border-default rounded-2xl p-4 text-sm text-near-black font-serif focus:border-near-black focus:ring-4 focus:ring-near-black/5 outline-none transition-all placeholder:text-text-muted/40 resize-none"
                                />
                            </div>

                            {reportError && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-[11px] text-red-500 font-bold">
                                    <AlertCircle size={14} />
                                    <span>{reportError}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-subtle">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-xs font-serif font-bold tracking-widest text-text-muted hover:text-near-black uppercase transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isReporting || (selectedReasons.length === 0 && !description.trim())}
                                    className="btn-dark px-8 h-12 rounded-xl flex items-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isReporting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Flag size={16} />
                                    )}
                                    <span className="font-serif font-bold text-sm">Submit Report</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
