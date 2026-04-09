import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { EventForm } from '../components/EventForm';
import { useCreateEvent } from '@domain/useCase/useCreateEvent';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { cn } from '@core/utils/cn';

/**
 * CreateEventPage: Orchestrates the event creation workflow.
 * 1. Uploads thumbnail image (if any).
 * 2. Calls useCreateEvent with the aggregated data.
 */
const CreateEventPage = () => {
    const navigate = useNavigate();
    const { createEvent, inProgress: isCreating, error: createError } = useCreateEvent();
    const { uploadMedia, inProgress: isUploading } = useUploadMedia();
    
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleFormSubmit = async (dtoData, imageFile) => {
        try {
            setStatus({ type: 'loading', message: 'Preparing your event...' });
            
            let finalImageIds = dtoData.imageIds || [];

            // 1. Upload Image if provided
            if (imageFile) {
                setStatus({ type: 'loading', message: 'Uploading hero visual...' });
                const uploadedIds = await uploadMedia([imageFile]);
                if (uploadedIds && uploadedIds.length > 0) {
                    finalImageIds = uploadedIds;
                }
            }

            // 2. Create Event
            setStatus({ type: 'loading', message: 'Publishing to Axe Code network...' });
            
            const eventPayload = {
                ...dtoData,
                imageIds: finalImageIds
            };

            // Note: entitlementData is null as price is handled by cron job
            await createEvent(eventPayload, null);

            setStatus({ type: 'success', message: 'Event published successfully! Redirecting...' });
            
            setTimeout(() => {
                navigate(`${PATHS.CONTENT_MANAGEMENT}/events`);
            }, 2000);

        } catch (err) {
            console.error("Event publication failed:", err);
            setStatus({ type: 'error', message: err.message || 'Failed to publish event. Please try again.' });
        }
    };

    const isPending = isCreating || isUploading;

    return (
        <div className="md:col-span-12 min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 space-y-10 max-w-[1400px] mx-auto animate-fade-in relative z-10 w-full">
            
            {/* Context Navigation */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/events`)}
                    className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-border-subtle/20 flex items-center justify-center group-hover:bg-border-subtle/40 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Management</span>
                </button>

                {/* Status Indicator */}
                {status.message && (
                    <div className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl transition-all animate-slide-up",
                        status.type === 'loading' ? "bg-surface-sunken text-text-muted border border-border-subtle" :
                        status.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                        {status.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
                         status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {status.message}
                    </div>
                )}
            </div>

            {/* Main Form */}
            <div className={cn("transition-all duration-500", isPending ? "opacity-40 grayscale-[0.5] pointer-events-none scale-[0.99]" : "opacity-100 scale-100")}>
                <EventForm 
                    isLoading={isPending} 
                    onSubmit={handleFormSubmit} 
                />
            </div>

            {/* Loading Overlay for Desktop */}
            {isPending && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
                    <div className="p-8 bg-surface rounded-[2rem] border border-border-subtle shadow-3xl flex flex-col items-center gap-4 animate-scale-in">
                        <Loader2 size={48} className="text-accent-blue animate-spin" />
                        <p className="text-sm font-black text-text-primary italic tracking-widest animate-pulse uppercase">{status.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEventPage;
