import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertTriangle, ExternalLink, CheckCircle, MonitorPlay, Loader2, Youtube } from 'lucide-react';

/**
 * EmbeddedVideoPlayer: Renders external video content via iframe.
 * 
 * Provider-aware:
 * - YouTube: Uses YT IFrame API for auto-progress tracking (completion at ≥90%)
 * - Others: Standard iframe with manual "Mark Complete" button
 * 
 * Graceful degradation:
 * - Handles deleted videos, disabled embedding, API load failures
 * - Falls back to "Watch on source" link + manual completion
 * 
 * @param {object} props
 * @param {LessonEntity} props.lesson - Lesson with embed fields
 * @param {Function} props.onComplete - Called when lesson should be marked complete
 */

// Global YT API loader (shared across all instances)
let ytApiLoadPromise = null;
const loadYouTubeApi = () => {
    if (ytApiLoadPromise) return ytApiLoadPromise;
    if (window.YT && window.YT.Player) return Promise.resolve();
    
    ytApiLoadPromise = new Promise((resolve, reject) => {
        const existingCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (existingCallback) existingCallback();
            resolve();
        };

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = () => {
            ytApiLoadPromise = null;
            reject(new Error('Failed to load YouTube IFrame API'));
        };
        document.head.appendChild(script);

        // Timeout fallback
        setTimeout(() => {
            if (!window.YT || !window.YT.Player) {
                ytApiLoadPromise = null;
                reject(new Error('YouTube IFrame API load timeout'));
            }
        }, 10000);
    });
    
    return ytApiLoadPromise;
};

export const EmbeddedVideoPlayer = ({ lesson, onComplete }) => {
    const containerRef = useRef(null);
    const playerRef = useRef(null);
    const hasTriggeredRef = useRef(false);
    const [error, setError] = useState(null);
    const [apiReady, setApiReady] = useState(false);
    const [manualMode, setManualMode] = useState(false);

    const embedSource = lesson?.embedSource;
    const embedUrl = lesson?.embedPlayerUrl;
    const embedMetadata = lesson?.embedMetadata;
    const videoId = embedMetadata?.videoId;

    // Reset trigger when lesson changes
    useEffect(() => {
        hasTriggeredRef.current = false;
        setError(null);
        setManualMode(false);
    }, [lesson?.uid || lesson?.id]);

    // YouTube IFrame API integration
    useEffect(() => {
        if (embedSource !== 'youtube' || !videoId) {
            setManualMode(true);
            return;
        }

        let mounted = true;

        const initPlayer = async () => {
            try {
                await loadYouTubeApi();
                if (!mounted) return;
                setApiReady(true);

                // Destroy previous player if exists
                if (playerRef.current) {
                    try { playerRef.current.destroy(); } catch {}
                    playerRef.current = null;
                }

                playerRef.current = new window.YT.Player(containerRef.current, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                        enablejsapi: 1,
                        origin: window.location.origin, // Required for cross-origin JS API messaging
                    },
                    events: {
                        onError: (event) => {
                            console.warn('[EmbeddedPlayer] YouTube error code:', event.data);
                            if ([2, 5, 100, 101, 150].includes(event.data)) {
                                setError(getYouTubeErrorMessage(event.data));
                                setManualMode(true);
                            }
                        },
                        onReady: () => {
                            console.log('[EmbeddedPlayer] YouTube player ready');
                        },
                        onStateChange: (event) => {
                            // YT.PlayerState.ENDED === 0
                            if (event.data === 0 && !hasTriggeredRef.current) {
                                hasTriggeredRef.current = true;
                                onComplete?.();
                            }
                        },
                    },
                });

                // Poll-based progress check (backup for ≥90% completion)
                const progressInterval = setInterval(() => {
                    if (hasTriggeredRef.current || !playerRef.current?.getCurrentTime) {
                        clearInterval(progressInterval);
                        return;
                    }
                    try {
                        const current = playerRef.current.getCurrentTime();
                        const duration = playerRef.current.getDuration();
                        if (duration > 0 && current / duration >= 0.9) {
                            hasTriggeredRef.current = true;
                            clearInterval(progressInterval);
                            onComplete?.();
                        }
                    } catch {}
                }, 5000);

                return () => clearInterval(progressInterval);
            } catch (err) {
                console.warn('[EmbeddedPlayer] YT API failed, falling back to iframe:', err.message);
                if (mounted) {
                    setManualMode(true);
                }
            }
        };

        initPlayer();

        return () => {
            mounted = false;
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch {}
                playerRef.current = null;
            }
        };
    }, [embedSource, videoId]);

    // Manual completion handler
    const handleManualComplete = useCallback(() => {
        if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            onComplete?.();
        }
    }, [onComplete]);

    // Error state — video unavailable
    if (error) {
        return (
            <div className="w-full aspect-video rounded-2xl bg-surface-sunken border border-border-subtle flex flex-col items-center justify-center gap-4 p-8">
                <div className="w-16 h-16 rounded-2xl bg-accent-rose/10 flex items-center justify-center">
                    <AlertTriangle size={32} className="text-accent-rose" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Video Unavailable</h3>
                <p className="text-xs text-text-muted text-center max-w-md">{error}</p>
                
                {embedMetadata?.title && (
                    <p className="text-xs text-text-muted italic">Original: "{embedMetadata.title}"</p>
                )}

                <div className="flex items-center gap-3 mt-2">
                    {lesson?.embedUrl && (
                        <a 
                            href={lesson.embedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border-default text-xs font-bold hover:border-accent-primary/50 transition-all"
                        >
                            <ExternalLink size={14} /> Watch on Source
                        </a>
                    )}
                    <button
                        onClick={handleManualComplete}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 transition-all"
                    >
                        <CheckCircle size={14} /> Mark Complete
                    </button>
                </div>
            </div>
        );
    }

    // YouTube with API — renders via YT.Player constructor
    if (embedSource === 'youtube' && !manualMode) {
        return (
            <div className="w-full space-y-4">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl relative border border-border-subtle">
                    <div ref={containerRef} className="w-full h-full" />
                    {!apiReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <Loader2 size={40} className="animate-spin text-accent-primary" />
                        </div>
                    )}
                </div>
                
                {/* YouTube Channel Info & Subscribe */}
                {embedMetadata?.authorUrl && (
                    <div className="flex items-center justify-between px-2 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                <Youtube size={16} className="text-red-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-text-primary tracking-wide">
                                    {embedMetadata.author || 'YouTube Channel'}
                                </span>
                                <span className="text-[9px] text-text-muted uppercase tracking-widest">
                                    Content Creator
                                </span>
                            </div>
                        </div>
                        <a
                            href={`${embedMetadata.authorUrl}?sub_confirmation=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-lg shadow-red-500/20"
                        >
                            Subscribe
                        </a>
                    </div>
                )}
            </div>
        );
    }

    // Fallback: Standard iframe for non-YouTube or when API fails
    return (
        <div className="w-full space-y-4">
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-border-subtle">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={embedMetadata?.title || lesson?.title || 'Embedded Video'}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-sunken gap-3">
                        <MonitorPlay size={64} className="text-accent-primary/20" />
                        <p className="text-text-muted text-sm">Embed source not available.</p>
                    </div>
                )}
            </div>
            
            {/* Manual completion button for non-YouTube providers */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4 text-text-muted">
                    {embedMetadata?.author && (
                        <div className="flex items-center gap-2">
                            {embedSource === 'youtube' ? <Youtube size={14} className="text-red-500" /> : <MonitorPlay size={14} />}
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                {embedMetadata.provider || embedSource} • {embedMetadata.author}
                            </span>
                        </div>
                    )}
                    {embedSource === 'youtube' && embedMetadata?.authorUrl && (
                        <a
                            href={`${embedMetadata.authorUrl}?sub_confirmation=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 transition-colors"
                        >
                            Subscribe
                        </a>
                    )}
                </div>
                <button
                    onClick={handleManualComplete}
                    disabled={hasTriggeredRef.current}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs font-black uppercase tracking-widest hover:bg-accent-primary/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <CheckCircle size={14} /> Mark as Completed
                </button>
            </div>
        </div>
    );
};

/** Maps YouTube error codes to user-friendly messages */
function getYouTubeErrorMessage(code) {
    const messages = {
        2: 'The video URL contains an invalid parameter.',
        5: 'This video cannot be played in an embedded player.',
        100: 'This video has been removed or marked as private.',
        101: 'The video owner does not allow embedded playback.',
        150: 'The video owner does not allow embedded playback.',
    };
    return messages[code] || 'An unexpected error occurred with the video player.';
}
