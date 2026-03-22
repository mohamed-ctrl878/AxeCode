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
                    finalVideoId = uploadResult[0].id;
                }
            }

            await updateLesson({
                id: lessonId,
                data: {
                    title: title.trim(),
                    type,
                    public: isPublic,
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading lesson details...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-8 text-center text-red-400">
                <p>Error loading lesson: {fetchError}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 text-xs font-bold text-accent-primary hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="md:col-span-full max-w-[1200px] mx-auto py-8 px-4 animation-fade-in">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-white italic">Edit Lesson</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-widest mt-1">Draft</span>
                        </div>
                        <p className="text-text-muted text-xs font-mono mt-1 opacity-60">REF: {lessonId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-2xl text-text-muted hover:text-white font-bold text-sm transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating || isUploading || !title}
                        className="flex items-center justify-center gap-3 px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-primary font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_30px_rgba(52,211,153,0.3)] hover:shadow-[0_15px_40px_rgba(52,211,153,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group min-w-[180px]"
                    >
                        {isUpdating || isUploading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} className="group-hover:rotate-12 transition-transform" />
                        )}
                        {isUpdating ? 'Saving...' : 'Update Lesson'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Title Input */}
                    <div className="space-y-3 group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent-primary" />
                            Lesson Identifier
                        </label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Capture the essence of this lesson..."
                                className="w-full bg-surface-dark/40 border border-white/5 rounded-3xl px-7 py-5 text-xl font-bold text-white focus:border-accent-primary/30 focus:bg-surface-dark/60 outline-none transition-all placeholder:text-text-muted/20 shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent-blue" />
                                Lesson Curriculum (Editor)
                            </label>
                            <div className="border border-white/5 rounded-3xl overflow-hidden min-h-[400px] bg-surface-dark/40 focus-within:border-accent-blue/30 transition-all shadow-inner">
                                <RichTextInput
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Sculpt your lesson content here..."
                                />
                            </div>
                        </div>

                        {/* Live Representation / Preview */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent-primary" />
                                Live Representation (Preview)
                            </label>
                            <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 min-h-[200px] backdrop-blur-sm shadow-xl">
                                {description && description.length > 0 ? (
                                    <RichTextBlocks blocks={description} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-text-muted/20 italic text-sm py-10">
                                        Content representation will appear here as you type...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media Interface */}
                    {type === 'video' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent-purple" />
                                Visual Media Component
                            </label>
                            
                            {(videoPreview || existingVideo) ? (
                                <div className="relative rounded-[2.5rem] overflow-hidden aspect-video bg-black border border-white/10 group shadow-2xl">
                                    {videoPreview ? (
                                        <video src={videoPreview} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-accent-blue/10 relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent pointer-events-none" />
                                            <div className="w-20 h-20 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue mb-4 animate-pulse">
                                                <Play size={32} />
                                            </div>
                                            <span className="text-sm text-accent-blue font-bold tracking-tight">Active Asset Loaded</span>
                                            <span className="text-[10px] text-text-muted mt-2 font-mono opacity-50 px-8 text-center line-clamp-1">{existingVideo.name || existingVideo.url}</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                        <button 
                                            type="button"
                                            onClick={removeVideo}
                                            className="w-12 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group/upload h-64">
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/[0.01] hover:bg-accent-blue/[0.03] hover:border-accent-blue/30 transition-all group-hover/upload:shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-4 group-hover/upload:bg-accent-blue/10 group-hover/upload:text-accent-blue transition-all group-hover/upload:scale-110">
                                            <Upload size={28} />
                                        </div>
                                        <p className="text-lg font-bold text-white tracking-tight">Update Cinematic Content</p>
                                        <p className="text-xs text-text-muted mt-1 opacity-50">Drag & drop or click to browse (Max 500MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Lesson Personality */}
                    <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 space-y-6 backdrop-blur-sm shadow-xl">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">Format</h3>
                            <p className="text-[10px] text-text-muted">Choose the primary delivery method.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                type="button"
                                onClick={() => setType('video')}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                    type === 'video' 
                                        ? "bg-accent-blue/10 border-accent-blue/40 text-accent-blue shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
                                        : "bg-background/20 border-white/5 text-text-muted hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                    type === 'video' ? "bg-accent-blue text-primary" : "bg-white/5"
                                )}>
                                    <Video size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">Video Stream</p>
                                    <p className="text-[9px] opacity-60">High-impact visual learning.</p>
                                </div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setType('article')}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                    type === 'article' 
                                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]" 
                                        : "bg-background/20 border-white/5 text-text-muted hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                    type === 'article' ? "bg-amber-500 text-primary" : "bg-white/5"
                                )}>
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">Article</p>
                                    <p className="text-[9px] opacity-60">In-depth technical reading.</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 space-y-6 backdrop-blur-sm shadow-xl">
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">Visibility</h3>
                            <p className="text-[10px] text-text-muted">Control who can access this asset.</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setIsPublic(true)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                    isPublic 
                                        ? "bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.1)]" 
                                        : "bg-background/20 border-white/5 text-text-muted hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                    isPublic ? "bg-green-500 text-primary" : "bg-white/5"
                                )}>
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">Public Free</p>
                                    <p className="text-[9px] opacity-60">Available to all visitors.</p>
                                </div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setIsPublic(false)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                    !isPublic 
                                        ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary shadow-[0_0_30px_rgba(52,211,153,0.1)]" 
                                        : "bg-background/20 border-white/5 text-text-muted hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                    !isPublic ? "bg-accent-primary text-primary" : "bg-white/5"
                                )}>
                                    <Lock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide">Restricted</p>
                                    <p className="text-[9px] opacity-60">Requires active enrollment.</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Hierarchy Info */}
                    <div className="p-8 space-y-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2rem]">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Orchestrated Course</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
                                    <BookOpen size={14} />
                                </div>
                                <p className="text-xs text-white/80 font-mono truncate">{courseId}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Temporal Module</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent-purple/5 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
                                    <Calendar size={14} />
                                </div>
                                <p className="text-xs text-white/80 font-mono truncate">{weekId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditLessonPage;
