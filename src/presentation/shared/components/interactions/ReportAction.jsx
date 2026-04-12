import React, { useState } from 'react';
import { Flag, CheckCircle } from 'lucide-react';
import { ReportingDialog } from './ReportingDialog';

/**
 * Enhanced ReportAction component.
 * Triggers the ReportingDialog modal for a premium feedback flow.
 */
export const ReportAction = ({ docId, contentType, onReportSuccess }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hasReported, setHasReported] = useState(false);

    const handleOpenDialog = (e) => {
        e.stopPropagation();
        if (hasReported) return;
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        setHasReported(true);
        if (onReportSuccess) onReportSuccess();
    };

    return (
        <>
            <button 
                onClick={handleOpenDialog}
                disabled={hasReported}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-300 group ${
                    hasReported 
                        ? 'text-status-success cursor-default bg-status-success/5' 
                        : 'text-accent-rose hover:bg-accent-rose/10'
                }`}
                title="Report this entry"
            >
                {hasReported ? (
                    <CheckCircle size={16} className="animate-in zoom-in duration-300" />
                ) : (
                    <Flag size={16} className="group-hover:scale-110 transition-transform" />
                )}
                <span className="font-bold tracking-tight">
                    {hasReported ? 'Entry Reported' : 'Report Archive Entry'}
                </span>
            </button>

            <ReportingDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                docId={docId}
                contentType={contentType}
            />
        </>
    );
};
