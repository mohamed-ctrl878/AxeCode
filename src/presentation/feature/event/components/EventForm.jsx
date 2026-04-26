import React, { useState } from 'react';
import { Image, X, Loader2, Calendar, MapPin, Globe, Clock, User, Lightbulb } from 'lucide-react';
import { cn } from '@core/utils/cn';
import RichTextInput from '@presentation/shared/components/RichTextEditor/RichTextInput';

/**
 * EventForm: Reusable form for Creating and Updating Events.
 * Mirrors CourseForm logic for consistency.
 */
export const EventForm = ({ 
    initialData = {},
    isLoading = false,
    onSubmit
}) => {
    // ─── Basic Metadata ──────────────────────────────────────────────────
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.discription || []); // Backend typo 'discription'
    const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '');
    const [location, setLocation] = useState(initialData?.location || '');
    const [duration, setDuration] = useState(initialData?.duration || '');

    // ─── Toggles & Modes ─────────────────────────────────────────────────
    const [onsite, setOnsite] = useState(initialData?.onsite ?? true);
    const [liveStreaming, setLiveStreaming] = useState(initialData?.live_streaming ?? false);
    const [isDraft, setIsDraft] = useState(initialData?.isDraft ?? true);
    
    // ─── Thumbnail Upload ───────────────────────────────────────────────
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialData?.image?.[0]?.url ? `${import.meta.env.VITE_API_BASE_URL}${initialData?.image[0]?.url}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // ─── Submission ──────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();

        const dtoData = {
            title,
            description, // Will be mapped to 'discription' by DTO
            date,
            location,
            duration: parseInt(duration) || 0,
            onsite,
            live_streaming: liveStreaming,
            isDraft,
            imageIds: initialData.image?.map(img => img.id) || []
        };

        onSubmit(dtoData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto p-6 lg:p-10 bg-surface rounded-[2.5rem] border border-border-subtle shadow-2xl relative overflow-hidden group">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[100px] pointer-events-none" />

            {/* Header section with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 relative z-10 transition-all">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-text-primary italic tracking-tight">
                        {initialData?.documentId ? 'Refine Event Details' : 'Launch New Event'}
                    </h2>
                    <p className="text-sm text-text-muted opacity-60">Architect your next experience with Axe Code</p>
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="group/btn relative flex items-center justify-center gap-3 bg-text-primary text-background font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-text-primary/10"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
                    {initialData?.documentId ? 'Push Updates' : 'Publish Event'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                
                {/* ── Main Content Area (8 Cols) ── */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    
                    {/* Event Title */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                            Event Title <span className="text-accent-blue">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-surface-sunken border border-border-subtle rounded-2xl px-6 py-4 text-lg font-bold text-text-primary focus:outline-none focus:border-accent-blue/50 focus:bg-surface-hover transition-all placeholder:text-text-muted/30"
                            placeholder="e.g. Clean Code Summit 2024"
                        />
                    </div>

                    {/* Rich Description */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                            Event Narrative
                        </label>
                        <div className="border border-border-subtle rounded-[2rem] overflow-hidden min-h-[400px] bg-surface-sunken backdrop-blur-sm transition-all focus-within:border-accent-blue/30">
                            <RichTextInput
                                value={description}
                                onChange={setDescription}
                                placeholder="What makes this event unique? Detail the experience..."
                            />
                        </div>
                    </div>
                </div>

                {/* ── Metadata & Settings (4 Cols) ── */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    
                    {/* Image Preview / Upload */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Hero Visual</label>
                        <div className={cn(
                            "relative flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] transition-all overflow-hidden min-h-[220px]",
                            imagePreview ? "border-accent-blue/40 bg-accent-blue/5 shadow-inner" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                        )}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                         <button
                                            type="button"
                                            onClick={removeImage}
                                            className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-2xl shadow-2xl transition-all hover:scale-110 active:scale-95"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-center p-6 cursor-pointer relative">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-sunken flex items-center justify-center mb-4 transition-all group-hover/upload:scale-110">
                                        <Image size={32} className="text-text-muted opacity-40" />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-loose">
                                        Drop Cinematic Asset <br/> <span className="text-text-muted/30 italic font-mono">16:9 Aspect Ratio</span>
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Publication Status Toggle */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 text-accent-blue font-serif">Publication Status</label>
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-4 p-5 rounded-[2rem] border transition-all cursor-pointer shadow-sm active:scale-95",
                                isDraft 
                                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-lg shadow-accent-blue/5"
                                    : "bg-surface-sunken border-white/5 text-text-muted" 
                            )}
                        >
                            <div className={cn(
                                "w-11 h-6 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-accent-blue" : "bg-white/10"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-6" : "left-1"
                                )} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                {isDraft ? 'Draft Proposal' : 'Live Broadcast'}
                            </span>
                        </div>
                    </div>

                    {/* Guidance Tip */}
                    <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20 flex gap-3 shadow-sm">
                        <div className="p-2 h-fit rounded-lg bg-accent-amber/10 text-accent-amber shrink-0">
                            <Lightbulb size={18} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[11px] font-bold uppercase tracking-tight text-accent-amber/80">Launch Protocol</h4>
                            <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                Ensure these steps before making content public:<br/>
                                <span className="text-text-primary/70">1. Set a price you deem appropriate.</span><br/>
                                <span className="text-text-primary/70 text-[10px]">2. (Preferably complete all content related to this item before publishing as live content).</span>
                            </p>
                        </div>
                    </div>

                    {/* Logistics Card */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                        
                        {/* Event Date */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                <Calendar size={12} className="text-accent-blue" /> Scheduled Date
                            </label>
                            <input
                                required
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-surface-sunken border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-blue/50 outline-none transition-all tabular-nums"
                            />
                        </div>

                        {/* Attendance Mode */}
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Modalities</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                    <div 
                                        onClick={() => setOnsite(!onsite)}
                                        className={cn(
                                            "w-10 h-6 rounded-full transition-all relative flex items-center px-1",
                                            onsite ? "bg-accent-blue" : "bg-surface-sunken"
                                        )}
                                    >
                                        <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-md", onsite ? "ml-4" : "ml-0")} />
                                    </div>
                                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Onsite</span>
                                </label>
                                
                                <label className="flex items-center gap-3 cursor-pointer group/toggle">
                                    <div 
                                        onClick={() => setLiveStreaming(!liveStreaming)}
                                        className={cn(
                                            "w-10 h-6 rounded-full transition-all relative flex items-center px-1",
                                            liveStreaming ? "bg-accent-blue" : "bg-surface-sunken"
                                        )}
                                    >
                                        <div className={cn("w-4 h-4 rounded-full bg-white transition-all shadow-md", liveStreaming ? "ml-4" : "ml-0")} />
                                    </div>
                                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Live</span>
                                </label>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                <MapPin size={12} className="text-accent-blue" /> Venue / Platform
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-surface-sunken border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-blue/50 outline-none transition-all"
                                placeholder={onsite ? "e.g. Cairo Arena" : "e.g. Zoom Link"}
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                <Clock size={12} className="text-accent-blue" /> Duration (Mins)
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-surface-sunken border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-blue/50 outline-none transition-all"
                                placeholder="e.g. 120"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
