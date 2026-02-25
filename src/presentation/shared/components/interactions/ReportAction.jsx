import React, { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { useReportContent } from '@domain/useCase/useReportContent';

/**
 * Generic ReportAction component typically placed in menus (like a dropdown)
 */
export const ReportAction = ({ docId, contentType, onReportSuccess }) => {
    const { reportContent, isReporting } = useReportContent();
    const [hasReported, setHasReported] = useState(false);

    const handleReport = async (e) => {
        e.stopPropagation();
        if (isReporting || hasReported) return;

        // Note: Real application might open a modal here to select a reason.
        const reason = window.prompt("Please describe the issue:");
        if (!reason || reason.trim() === "") return;

        try {
            await reportContent(docId, contentType, { 
                // Description expected as blocks format by Strapi
                description: [{ type: 'paragraph', children: [{text: reason}] }] 
            });
            setHasReported(true);
            alert("Report submitted successfully.");
            if (onReportSuccess) onReportSuccess();
        } catch (error) {
           console.error("Failed to report", error);
           alert("Failed to report.");
        }
    };

    return (
        <button 
            onClick={handleReport}
            disabled={isReporting || hasReported}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                hasReported 
                    ? 'text-text-muted cursor-not-allowed' 
                    : 'text-red-400 hover:bg-red-500/10'
            }`}
            title="Report this content"
        >
            {isReporting ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Flag size={16} className={hasReported ? 'opacity-50' : ''} />
            )}
            <span className="font-medium">
                {isReporting ? 'Reporting...' : hasReported ? 'Reported' : 'Report Content'}
            </span>
        </button>
    );
};
