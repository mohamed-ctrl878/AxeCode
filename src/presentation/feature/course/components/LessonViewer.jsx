import React, { useEffect, useRef } from 'react';
import { Play, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { ArticleContentRenderer } from '../../article/components/ArticleContentRenderer';
import { cn } from '@core/utils/cn';

/**
 * LessonViewer: Renders the active lesson content (Video or Article).
 * 
 * @param {object} props
 * @param {LessonEntity} props.lesson - The lesson details.
 * @param {boolean} props.loading - Fetching state.
 * @param {Function} props.onNext - Navigate to next lesson.
 * @param {Function} props.onPrev - Navigate to previous lesson.
 * @param {boolean} props.hasNext - Has next lesson.
 * @param {boolean} props.hasPrev - Has previous lesson.
 */
export const LessonViewer = ({ 
    lesson, 
    loading, 
    onNext, 
    onPrev, 
    hasNext, 
    hasPrev,
    onComplete
}) => {
    const videoRef = useRef(null);
    const hasTriggeredRef = useRef(false);

    // Reset trigger when lesson changes
    useEffect(() => {
        hasTriggeredRef.current = false;
    }, [lesson?.id]);

    const handleTimeUpdate = () => {
        if (!videoRef.current || hasTriggeredRef.current) return;
        
        const video = videoRef.current;
        // Trigger logic: currentTime >= (duration - 10)
        // Guard: For very short videos (under 10s), trigger at 90% of duration
        const triggerTime = video.duration > 12 ? (video.duration - 10) : (video.duration * 0.9);

        if (video.currentTime >= triggerTime) {
            console.log(`[Progress] Trigger reached! (Current: ${video.currentTime}, Trigger: ${triggerTime}) Calling onComplete...`);
            hasTriggeredRef.current = true;
            if (onComplete) {
                onComplete(lesson.uid || lesson.id);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
                <Loader2 className="animate-spin text-accent-primary mb-4" size={40} />
                <p className="text-text-muted font-bold">Summoning content...</p>
            </div>
        );
    }

    if (!lesson) return null;

    return (
        <div className="learn-content animation-fade-in">
            {lesson.type === 'video' ? (
                <div className="video-container">
                    {/* Placeholder for Video Player - Can be replaced with specific player logic (ReactPlayer, etc) */}
                    {lesson.video?.url ? (
                        <video 
                            ref={videoRef}
                            src={lesson.video.url} 
                            controls 
                            onTimeUpdate={handleTimeUpdate}
                            className="w-full h-full"
                            poster={lesson.thumbnail?.url}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-sunken">
                            <Play size={64} className="text-accent-primary/20" />
                            <p className="text-text-muted text-sm mt-4">Video source not found or pending upload.</p>
                        </div>
                    )}
                </div>
            ) : null}

            <div className="lesson-body">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                            {lesson.type}
                        </span>
                        {lesson.isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-status-success">
                                <CheckCircle size={12} /> COMPLETED
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-serif font-medium text-text-primary tracking-tight leading-tight">
                        {lesson.title}
                    </h1>
                </div>

                {lesson.description && (
                    <div className="prose prose-invert max-w-none">
                        <ArticleContentRenderer content={lesson.description} />
                    </div>
                )}

                <div className="navigation-footer">
                    <button 
                        onClick={onPrev}
                        disabled={!hasPrev}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl border border-border-subtle text-sm font-bold transition-all",
                            !hasPrev ? "opacity-30 cursor-not-allowed" : "hover:bg-surface-elevated text-text-primary"
                        )}
                    >
                        <ArrowLeft size={16} /> Previous Lesson
                    </button>

                    <button 
                        onClick={onNext}
                        disabled={!hasNext}
                        className={cn(
                            "flex items-center gap-2 px-8 py-3 rounded-xl bg-accent-primary text-on-accent text-sm font-black transition-all",
                            !hasNext ? "opacity-30 cursor-not-allowed" : "hover:brightness-110 active:scale-95 shadow-halo-primary"
                        )}
                    >
                        {hasNext ? "Next Lesson" : "End of Module"} 
                        {hasNext && <ArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
