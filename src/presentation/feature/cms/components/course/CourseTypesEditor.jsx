import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle, AlertCircle, Loader2, Save, Tag } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useFetchCategorizations } from '@domain/useCase/useFetchCategorizations';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { useUpdateCourse } from '@domain/useCase/useUpdateCourse';

/**
 * CourseTypesEditor: Manages the association between a course and its categorization types.
 */
export const CourseTypesEditor = ({ courseId }) => {
    const { courseTypes: allTypes, isLoading: isLoadingAll } = useFetchCategorizations();
    const { fetchCoursePreview, coursePreview, loading: isFetchingCourse } = useFetchCoursePreview();
    const { updateCourse, inProgress: isUpdating } = useUpdateCourse();

    const [selectedTypeIds, setSelectedTypeIds] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Initial Load
    useEffect(() => {
        if (courseId) {
            fetchCoursePreview(courseId);
        }
    }, [courseId, fetchCoursePreview]);

    // Sync selected types from course preview
    useEffect(() => {
        if (coursePreview?.course_types) {
            setSelectedTypeIds(coursePreview.course_types.map(t => t.id || t));
        }
    }, [coursePreview]);

    const handleToggleType = (id) => {
        setSelectedTypeIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        try {
            await updateCourse({ 
                id: courseId, 
                data: { 
                    courseTypeIds: selectedTypeIds 
                } 
            });
            showStatus('success', 'Taxonomy relationships updated successfully.');
        } catch (err) {
            showStatus('error', 'Failed to synchronize course types.');
        }
    };

    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    };

    if ((isLoadingAll || isFetchingCourse) && !coursePreview) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-serif italic text-lg">Harmonizing Taxonomy Data...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade-in space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 text-accent-violet flex items-center justify-center shadow-inner">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Categorization Suite</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">Manage Course Types & Tracks</p>
                    </div>
                </div>

                {statusMessage.text && (
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animation-slide-up bg-surface border shadow-sm",
                        statusMessage.type === 'success' ? "text-status-success border-status-success/20 bg-status-success/5" : "text-status-error border-status-error/20 bg-status-error/5"
                    )}>
                        {statusMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {statusMessage.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Available Types Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allTypes.map((type) => {
                            const isSelected = selectedTypeIds.includes(type.id);
                            return (
                                <div 
                                    key={type.id}
                                    onClick={() => handleToggleType(type.id)}
                                    className={cn(
                                        "group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]",
                                        isSelected 
                                            ? "bg-accent-violet/5 border-accent-violet/40 ring-1 ring-accent-violet/20" 
                                            : "bg-surface border-border-subtle hover:border-border-default hover:bg-surface-elevated/50 shadow-sm"
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                isSelected ? "bg-accent-violet text-white" : "bg-surface-sunken text-text-muted"
                                            )}>
                                                <Tag size={14} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight text-text-primary capitalize">{type.title}</h4>
                                                <p className="text-[10px] text-text-muted uppercase tracking-widest opacity-60">Course Track</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                            isSelected ? "bg-accent-violet border-accent-violet scale-110" : "border-border-default"
                                        )}>
                                            {isSelected && <CheckCircle size={12} className="text-white" />}
                                        </div>
                                    </div>
                                    
                                    {/* Abstract Decoration */}
                                    <div className={cn(
                                        "absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none text-accent-violet transform rotate-12",
                                        isSelected && "opacity-10"
                                    )}>
                                        <Layers size={64} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {allTypes.length === 0 && (
                        <div className="p-12 border-2 border-dashed border-border-subtle rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                            <Layers size={48} className="text-text-muted/20 mb-4" />
                            <h3 className="text-lg font-serif italic text-text-muted">No Categorizations Found</h3>
                            <p className="max-w-xs text-xs text-text-muted/60 mt-2">Manage global course types in the Taxonomy module before assigning them here.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info & Actions */}
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-sunken/40 border border-border-subtle rounded-3xl p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-text-primary/90 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Shield size={16} className="text-accent-violet" />
                                Hierarchy Logic
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed italic">
                                Assigning a course to specific types determines its placement in the global catalogue and recommendation algorithms.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border-subtle">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] uppercase font-bold text-text-muted">Selected Slots</span>
                                <span className="text-xs font-black text-accent-violet bg-accent-violet/10 px-2 py-0.5 rounded-full">{selectedTypeIds.length}</span>
                            </div>

                            <button 
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="w-full py-4 bg-accent-violet text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-accent-violet/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Update Taxonomy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-accent-amber/5 border border-accent-amber/20 rounded-2xl flex gap-4">
                        <AlertCircle size={20} className="text-accent-amber shrink-0" />
                        <p className="text-[10px] text-accent-amber/80 font-medium leading-relaxed uppercase tracking-tight">
                            Changes affect the categorization immediately across the platform. Ensure the tracks match the course content accurately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Shield = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
