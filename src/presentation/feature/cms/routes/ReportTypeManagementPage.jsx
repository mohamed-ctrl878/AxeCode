import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, Flag } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { useCreateReportType } from '@domain/useCase/useCreateReportType';
import { useUpdateReportType } from '@domain/useCase/useUpdateReportType';
import { useFetchReportTypes } from '@domain/useCase/useFetchReportTypes';
import { cn } from '@core/utils/cn';

/**
 * ReportTypeManagementPage: Single field editor for Report Reasons.
 */
const ReportTypeManagementPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { createReportType, inProgress: isCreating } = useCreateReportType();
    const { updateReportType, inProgress: isUpdating } = useUpdateReportType();
    const { reportTypes, fetch: fetchReportTypes } = useFetchReportTypes();

    const [type, setType] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEdit && reportTypes.length > 0) {
            const currentItem = reportTypes.find(item => String(item.documentId || item.id) === String(id));
            if (currentItem) {
                setType(currentItem.type || '');
            }
        }
    }, [isEdit, id, reportTypes]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEdit) {
                await updateReportType(id, { type });
            } else {
                await createReportType({ type });
            }
            navigate(PATHS.CMS_REPORT_TYPES);
        } catch (error) {
            console.error('Failed to save report reason:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col h-[calc(100vh-4rem)] p-8">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate(PATHS.CMS_REPORT_TYPES)}
                        className="w-12 h-12 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:border-near-black hover:text-near-black transition-all group shadow-sm"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-near-black">
                            {isEdit ? 'Edit Report Reason' : 'New Report Reason'}
                        </h1>
                        <p className="text-[11px] text-text-muted font-serif italic mt-1.5">
                            Define the specific reason users can select when reporting content.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ivory border border-border-default text-[10px] font-mono text-near-black/60 shadow-inner">
                    <Flag size={14} className="text-accent-primary" />
                    <span>Archive Entry</span>
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-3xl space-y-8 bg-ivory p-10 rounded-[40px] border border-border-default shadow-whisper">
                <div className="space-y-4">
                    <label className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em] px-1">
                        Reason Descriptor
                    </label>
                    <input 
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="e.g. Inappropriate Content, Spam, Harassment..."
                        required
                        className="w-full h-16 bg-surface-sunken border border-border-default rounded-2xl px-6 text-near-black font-serif text-lg focus:border-near-black focus:ring-4 focus:ring-near-black/5 outline-none transition-all placeholder:text-text-muted/40"
                    />
                </div>

                <div className="flex items-center justify-end gap-6 pt-6 border-t border-border-default">
                    <button 
                        type="button"
                        onClick={() => navigate(PATHS.CMS_REPORT_TYPES)}
                        className="text-[12px] font-serif font-bold tracking-widest text-text-muted hover:text-near-black uppercase transition-colors"
                    >
                        Discard Changes
                    </button>
                    
                    <button 
                        type="submit"
                        disabled={isSaving || isCreating || isUpdating}
                        className="btn-dark px-12 h-14 rounded-2xl flex items-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {(isSaving || isCreating || isUpdating) ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                        )}
                        <span className="font-serif font-bold tracking-normal">Commit to Archive</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportTypeManagementPage;
