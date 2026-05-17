import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link as LinkIcon, Loader2, ExternalLink, Youtube, MonitorPlay } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * EmbedUrlInput: URL input with live video preview.
 * 
 * Detects provider from URL, shows iframe preview after debounce,
 * and displays thumbnail from provider (no oEmbed fetch — CORS-free).
 * Full metadata is resolved by the backend on save.
 * 
 * @param {string} value - Current URL value
 * @param {Function} onChange - URL change callback
 */

const PROVIDERS = {
    youtube: {
        name: 'YouTube',
        color: 'red',
        match: (url) => /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url),
                                                                                                                                                                                            extractId: (url) => {
            const patterns = [
                /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            ];
            for (const p of patterns) {
                const m = url.match(p);
                if (m) return m[1];
            }
            return null;
        },
        getEmbedUrl: (id) => `https://www.youtube.com/embed/${id}`,
        getThumbnail: (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    },
    vimeo: {
        name: 'Vimeo',
        color: 'blue',
        match: (url) => /vimeo\.com\/\d+/.test(url),
        extractId: (url) => {
            const m = url.match(/vimeo\.com\/(\d+)/);
            return m ? m[1] : null;
        },
        getEmbedUrl: (id) => `https://player.vimeo.com/video/${id}`,
        getThumbnail: () => null,
    },
};

function detectProvider(url) {
    if (!url) return null;
    for (const [key, provider] of Object.entries(PROVIDERS)) {
        if (provider.match(url)) return { key, ...provider };
    }
    return null;
}

export const EmbedUrlInput = ({ value, onChange }) => {
    const [previewData, setPreviewData] = useState(null);
    const previewDebounceRef = useRef(null);

    // Instant detection for badge only (no iframe)
    const detected = useMemo(() => {
        const provider = detectProvider(value);
        if (!provider) return null;
        const videoId = provider.extractId(value);
        if (!videoId) return null;
        return {
            ...provider,
            videoId,
            embedUrl: provider.getEmbedUrl(videoId),
            thumbnail: provider.getThumbnail(videoId),
        };
    }, [value]);

    // Debounced preview: only render iframe after user stops typing for 800ms
    useEffect(() => {
        if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);

        if (!detected) {
            setPreviewData(null);
            return;
        }

        previewDebounceRef.current = setTimeout(() => {
            setPreviewData(detected);
        }, 800);

        return () => {
            if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
        };
    }, [detected?.videoId]);

    const providerColors = {
        red: {
            badge: 'bg-red-500/10 border-red-500/20 text-red-500',
        },
        blue: {
            badge: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
        },
    };

    const colors = detected ? providerColors[detected.color] || providerColors.blue : null;

    return (
        <div className="space-y-5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                External Video Source
            </label>

            {/* URL Input */}
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40">
                    <LinkIcon size={18} />
                </div>
                <input
                    type="url"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full bg-surface-sunken/40 border border-border-subtle rounded-2xl pl-12 pr-6 py-5 text-sm font-bold text-text-primary focus:border-blue-500 focus:bg-surface-sunken outline-none transition-all placeholder:text-text-muted/20 shadow-inner"
                />
            </div>

            {/* Provider Badge */}
            {value && (
                <div className="flex items-center gap-2 px-2">
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        detected ? colors?.badge : "bg-surface-sunken border-border-subtle text-text-muted"
                    )}>
                        {detected ? `▶ ${detected.name} Detected` : '▶ Custom Source'}
                    </span>
                    {detected && !previewData && (
                        <span className="flex items-center gap-1.5 text-[9px] text-text-muted opacity-60">
                            <Loader2 size={10} className="animate-spin" /> Loading preview...
                        </span>
                    )}
                </div>
            )}

            {/* Loading state: provider detected but waiting for debounce */}
            {detected && !previewData && (
                <div className="w-full aspect-video rounded-2xl bg-surface-sunken/60 border border-border-subtle flex flex-col items-center justify-center gap-3 animate-pulse">
                    <Loader2 size={32} className="animate-spin text-text-muted/30" />
                    <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-widest">Loading preview...</p>
                </div>
            )}

            {/* Live Preview — only after debounce completes */}
            {previewData && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Video iframe */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-border-subtle shadow-2xl group">
                        <iframe
                            src={previewData.embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Video Preview"
                        />
                        
                        {/* Provider overlay badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest hover:bg-black/90 transition-all"
                            >
                                <ExternalLink size={10} /> Open in {previewData.name}
                            </a>
                        </div>
                    </div>

                    {/* Thumbnail + Info Card (no oEmbed needed) */}
                    {previewData.thumbnail && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-subtle shadow-sm">
                            <img
                                src={previewData.thumbnail}
                                alt=""
                                className="w-20 h-14 rounded-lg object-cover border border-border-subtle shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                    {previewData.name} • ID: {previewData.videoId}
                                </p>
                                <p className="text-[9px] text-text-muted/50 mt-1">
                                    Full metadata (title, author) will be resolved on save
                                </p>
                            </div>
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                colors?.badge
                            )}>
                                {previewData.key === 'youtube' ? <Youtube size={14} /> : <MonitorPlay size={14} />}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info box when no preview and custom URL */}
            {!detected && value && (
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[10px] text-text-muted leading-relaxed">
                    <p className="font-bold text-blue-400 uppercase tracking-widest mb-1">Provider Support</p>
                    <p>Paste any YouTube or Vimeo video URL. The system will auto-detect the provider and show a live preview.</p>
                </div>
            )}
        </div>
    );
};
