import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Video, FileText, Globe, Lock, X, Upload, Loader2, Play, BookOpen, Calendar } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';
import { useFetchLesson } from '@domain/useCase/useFetchLesson';
import { useUpdateLesson } from '@domain/useCase/useUpdateLesson';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { RichTextBlocks } from '@presentation/shared/components/RichTextBlocks';

/**
 * EditLessonPage: Full-page editor for an existing lesson.
 */
const EditLessonPage = () => {
    const { courseId, weekId, lessonId } = useParams();
    const navigate = useNavigate();

    // UseCases
    const { fetchLesson, lesson, loading: isFetching, error: fetchError } = useFetchLesson();
    const { updateLesson, inProgress: isUpdating } = useUpdateLesson();
    const { uploadMedia, inProgress: isUploading } = useUploadMedia();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState([]);
    const [type, setType] = useState('video');
    const [isPublic, setIsPublic] = useState(false);
    const [isDraft, setIsDraft] = useState(true);
    
    // Video State
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [existingVideo, setExistingVideo] = useState(null);

    // Initial Fetch
    useEffect(() => {
        if (lessonId) {
            fetchLesson(lessonId);
        }
    }, [lessonId, fetchLesson]);

    // Sync form with fetched lesson
    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title || '');
            setDescription(lesson.description || []);
            setType(lesson.type || 'video');
            setIsPublic(lesson.isPublic || false);
            setIsDraft(lesson.isDraft ?? true);
            if (lesson.video) {
                setExistingVideo(lesson.video);
            }
        }
    }, [lesson]);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setExistingVideo(null); // Clear existing if new one selected
        }
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setExistingVideo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let finalVideoId = existingVideo?.id || null;

            // Upload new video if selected
            if (videoFile) {
                const uploadResult = await uploadMedia(videoFile);
                if (uploadResult && uploadResult[0]) {
                    finalVideoId = uploadResult[0];
                }
            }

            await updateLesson({
                id: lessonId,
                data: {
                    title: title.trim(),
                    type,
                    public: isPublic,
                    isDraft,
                    weekId,
                    description,
                    videoId: finalVideoId
                }
            });

            // Redirect back to weeks editor
            navigate(`${PATHS.CONTENT_MANAGEMENT}/courses/${courseId}/weeks`);
        } catch (err) {
            console.error('[EditLesson] Failed to update lesson:', err);
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-6 text-accent-primary" size={48} />
                <p className="font-black uppercase tracking-widest text-xs opacity-50">Syncing with Protocol...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                    <X size={32} />
                </div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Access Failure</h3>
                <p className="text-text-muted mt-2 max-w-md font-bold">{fetchError}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-8 px-8 py-3 rounded-2xl bg-surface border border-border-subtle text-xs font-black uppercase tracking-widest hover:border-accent-primary transition-all active:scale-95 shadow-sm"
                >
                    Retreat
                </button>
            </div>
        );
    }

    const isSubmitting = isUpdating || isUploading;

    return (
        <div className="md:col-span-full max-w-[1200px] mx-auto py-8 px-4 animation-fade-in text-text-primary">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-surface border border-border-subtle backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl border border-border-default flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0 bg-surface-sunken/40"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text-primary italic">Edit Lesson</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-widest mt-1">Refining</span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">Orchestration REF • {lessonId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-2xl text-text-muted hover:text-text-primary font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title}
                        className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 rounded-2xl bg-accent-primary text-on-accent font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(52,211,153,0.3)] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group w-full md:min-w-[200px]"
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} className="group-hover:rotate-12 transition-transform" />
                        )}
                        {isUpdating ? 'Executing...' : 'Update Lesson'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Title Input */}
                    <div className="space-y-4 group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            Lesson Identifier
                        </label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Capture the essence of this lesson..."
                                className="w-full bg-surface-sunken/40 border border-border-subtle rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-6 text-xl md:text-2xl font-black text-text-primary focus:border-accent-primary focus:bg-surface-sunken outline-none transition-all placeholder:text-text-muted/20 shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                Content Curriculum (Architect)
                            </label>
                            <div className="border border-border-subtle rounded-3xl md:rounded-[2.5rem] overflow-hidden min-h-[300px] md:min-h-[400px] bg-surface-sunken/40 focus-within:border-accent-primary focus-within:bg-surface-sunken transition-all shadow-inner">
                                <RichTextInput
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Sculpt your lesson content here..."
                                />
                            </div>
                        </div>

                        {/* Live Representation / Preview */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                Content Representation (Live)
                            </label>
                            <div className="w-full bg-surface border border-border-subtle rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 min-h-[200px] md:min-h-[250px] backdrop-blur-sm shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-text-muted">
                                    <BookOpen size={150} />
                                </div>
                                <div className="relative z-10">
                                    {description && description.length > 0 ? (
                                        <RichTextBlocks blocks={description} />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-text-muted/20 italic text-sm py-16 gap-4">
                                            <BookOpen size={48} className="opacity-10" />
                                            <p className="font-bold uppercase tracking-widest text-[10px]">Real-time preview will materialize here...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Interface */}
                    {type === 'video' && (
                        <div className="space-y-5">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                Visual Media Component
                            </label>
                            
                            {(videoPreview || existingVideo) ? (
                                <div className="relative rounded-[3rem] overflow-hidden aspect-video bg-black border border-border-default group shadow-2xl">
                                    {videoPreview ? (
                                        <video src={videoPreview} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-accent-primary/10 relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />
                                            <div className="w-24 h-24 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mb-6 animate-pulse shadow-xl">
                                                <Play size={40} />
                                            </div>
                                            <span className="text-lg text-accent-primary font-black tracking-tight italic">Active Protocol Asset Loaded</span>
                                            <span className="text-[10px] text-text-muted mt-3 font-black uppercase tracking-widest opacity-40 px-8 text-center line-clamp-1">{existingVideo.name || existingVideo.url}</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex justify-end">
                                        <button 
                                            type="button"
                                            onClick={removeVideo}
                                            className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group/upload h-72">
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="h-full border-2 border-dashed border-border-default rounded-3xl md:rounded-[3rem] flex flex-col items-center justify-center bg-surface-sunken/20 hover:bg-accent-primary/[0.03] hover:border-accent-primary/40 transition-all group-hover/upload:shadow-2xl p-6">
                                        <div className="w-24 h-24 rounded-3xl bg-surface-sunken flex items-center justify-center mb-6 group-hover/upload:bg-accent-primary/10 group-hover/upload:text-accent-primary transition-all group-hover/upload:scale-110 shadow-sm border border-border-subtle">
                                            <Upload size={32} />
                                        </div>
                                        <p className="text-xl font-black text-text-primary tracking-tight italic">Inject New Cinematic Asset</p>
                                        <p className="text-[10px] text-text-muted mt-2 font-black uppercase tracking-widest opacity-40">Drag & drop or Click to iterate (Max 512MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Lesson Personality */}
                    <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-8 space-y-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-text-muted">
                            <Video size={80} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Asset Format</h3>
                            <p className="text-[10px] text-text-muted font-medium">Define the core instructional medium.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 relative z-10">
                            <button
                                type="button"
                                onClick={() => setType('video')}
                                className={cn(
                                    "flex items-center gap-5 p-5 rounded-2xl border transition-all text-left shadow-sm",
                                    type === 'video' 
                                        ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary shadow-lg shadow-accent-primary/5" 
                                        : "bg-surface-sunken/40 border-border-subtle text-text-muted hover:border-border-default hover:bg-surface-sunken"
                                )}
                            >
                                <div className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md",
                                    type === 'video' ? "bg-accent-primary text-on-accent" : "bg-surface border border-border-subtle"
                                )}>
                                    <Video size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">Video Stream</p>
                                    <p className="text-[9px] font-medium opacity-60 mt-1">Immersive visual learning.</p>
                                </div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setType('article')}
                                className={cn(
                                    "flex items-center gap-5 p-5 rounded-2xl border transition-all text-left shadow-sm",
                                    type === 'article' 
                                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-lg shadow-amber-500/5" 
                                        : "bg-surface-sunken/40 border-border-subtle text-text-muted hover:border-border-default hover:bg-surface-sunken"
                                )}
                            >
                                <div className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md",
                                    type === 'article' ? "bg-amber-500 text-on-accent" : "bg-surface border border-border-subtle"
                                )}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">Tech Article</p>
                                    <p className="text-[9px] font-medium opacity-60 mt-1">Deep-dive technical brief.</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-8 space-y-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-text-muted">
                            <Globe size={80} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Gatekeeper</h3>
                            <p className="text-[10px] text-text-muted font-medium">Control the boundaries of access.</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <button
                                type="button"
                                onClick={() => setIsPublic(true)}
                                className={cn(
                                    "w-full flex items-center gap-5 p-5 rounded-2xl border transition-all text-left shadow-sm",
                                    isPublic 
                                        ? "bg-green-500/10 border-green-500/40 text-green-500 shadow-lg shadow-green-500/5" 
                                        : "bg-surface-sunken/40 border-border-subtle text-text-muted hover:border-border-default"
                                )}
                            >
                                <div className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md",
                                    isPublic ? "bg-green-500 text-on-accent" : "bg-surface border border-border-subtle"
                                )}>
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">Public Asset</p>
                                    <p className="text-[9px] font-medium opacity-60 mt-1">Visible to the ecosystem.</p>
                                </div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setIsPublic(false)}
                                className={cn(
                                    "w-full flex items-center gap-5 p-5 rounded-2xl border transition-all text-left shadow-sm",
                                    !isPublic 
                                        ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary shadow-lg shadow-accent-primary/5" 
                                        : "bg-surface-sunken/40 border-border-subtle text-text-muted hover:border-border-default"
                                )}
                            >
                                <div className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md",
                                    !isPublic ? "bg-accent-primary text-on-accent" : "bg-surface border border-border-subtle"
                                )}>
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest">Restricted</p>
                                    <p className="text-[9px] font-medium opacity-60 mt-1">Requires active protocol enrollment.</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Publication Status */}
                    <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-8 space-y-8 shadow-xl relative overflow-hidden">
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Lifecycle Stage</h3>
                            <p className="text-[10px] text-text-muted font-medium">Draft content is siloed from the public archive.</p>
                        </div>

                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer select-none",
                                isDraft 
                                    ? "bg-surface-sunken/40 border-border-subtle text-text-muted" 
                                    : "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-lg shadow-accent-primary/5"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-6 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-text-muted/20" : "bg-accent-primary"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-1" : "left-7"
                                )} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest leading-none">
                                    {isDraft ? 'Draft Protocol' : 'Live Deployment'}
                                </p>
                                <p className="text-[9px] font-medium opacity-60 mt-1">
                                    {isDraft ? "Owner eyes only." : "Ready for ecosystem sync."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hierarchy Info */}
                    <div className="p-8 space-y-6 bg-surface-sunken/20 border border-border-subtle rounded-[2.5rem] shadow-sm">
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Source Vector</p>
                            <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border-subtle shadow-inner">
                                <div className="w-8 h-8 rounded-lg bg-accent-primary/5 border border-accent-primary/10 flex items-center justify-center text-accent-primary">
                                    <BookOpen size={14} />
                                </div>
                                <p className="text-[10px] text-text-primary font-black font-mono truncate">{courseId}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Module Node</p>
                            <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border-subtle shadow-inner">
                                <div className="w-8 h-8 rounded-lg bg-accent-purple/5 border border-accent-purple/10 flex items-center justify-center text-accent-purple">
                                    <Calendar size={14} />
                                </div>
                                <p className="text-[10px] text-text-primary font-black font-mono truncate">{weekId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditLessonPage;
