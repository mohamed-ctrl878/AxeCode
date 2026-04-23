import { X, CloudUpload, Loader } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@core/utils/cn';

export const UploadRoadmapModal = ({ isOpen, onClose, uploadData, onUpload, isUploading, error, existingRoadmap }) => {
    if (!isOpen) return null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('bg-surface');
    const [isDraft, setIsDraft] = useState(existingRoadmap?.isDraft ?? true);

    const colorSwatches = [
        { label: "Default", val: "bg-surface" },
        { label: "Blue", val: "bg-blue-500/10" },
        { label: "Emerald", val: "bg-emerald-500/10" },
        { label: "Violet", val: "bg-violet-500/10" },
        { label: "Amber", val: "bg-amber-500/10" },
        { label: "Rose", val: "bg-rose-500/10" }
    ];

    React.useEffect(() => {
        if (existingRoadmap) {
            setTitle(existingRoadmap.title || '');
            setColor(existingRoadmap.color || 'bg-surface');
            
            // Extract text from description blocks if available
            if (Array.isArray(existingRoadmap.description) && existingRoadmap.description.length > 0) {
                const text = existingRoadmap.description[0]?.children?.[0]?.text || '';
                setDescription(text);
            }
        }
    }, [existingRoadmap]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Construct standard block format for description natively supported by the app
        const formattedDescription = description ? [{
            type: 'paragraph',
            children: [{ type: 'text', text: description }]
        }] : [];

        const payload = {
            title,
            description: formattedDescription,
            color,
            flowData: uploadData, // Directly injected from FlowSandbox
            isDraft
        };

        onUpload(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-elevated border border-border-default rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-surface-light">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <CloudUpload size={20} className="text-accent-primary" />
                        Publish Roadmap
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-1 min-w-0 border-none bg-transparent hover:text-accent-primary transition-colors text-text-muted cursor-pointer focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg font-mono">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                            Roadmap Title
                        </label>
                        <input
                            type="text"
                            required
                            disabled={isUploading}
                            className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2.5 text-sm font-medium focus:border-accent-primary focus:outline-none transition-colors disabled:opacity-50"
                            placeholder="e.g., React Learning Path 2026"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                            Description (Overview)
                        </label>
                        <textarea
                            disabled={isUploading}
                            className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-primary focus:outline-none transition-colors min-h-[80px] resize-y disabled:opacity-50"
                            placeholder="Briefly explain the goal of this roadmap..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest">
                            Theme Accent
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {colorSwatches.map((swatch) => (
                                <button
                                    key={swatch.val}
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() => setColor(swatch.val)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer",
                                        color === swatch.val 
                                            ? "border-accent-primary text-accent-primary bg-accent-primary/10" 
                                            : "border-border-subtle text-text-muted hover:border-text-muted hover:text-text-primary"
                                    )}
                                >
                                    {swatch.label}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="flex items-center justify-between mt-2 py-3 px-4 bg-background/50 border border-border-subtle rounded-xl">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Draft Protection</span>
                            <span className="text-[8px] text-text-muted italic">Only you can view/edit in draft.</span>
                        </div>
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none",
                                isDraft 
                                    ? "bg-surface-sunken border-border-subtle text-text-muted" 
                                    : "bg-accent-primary/10 border-accent-primary text-accent-primary"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-3 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-text-muted/20" : "bg-accent-primary"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-0.5" : "left-3.5"
                                )} />
                            </div>
                            <span className="text-[9px] font-bold uppercase">
                                {isDraft ? 'Draft' : 'Live'}
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-5 py-2 text-sm font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading || !title.trim()}
                            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-on-accent text-sm font-bold rounded-full hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <> <Loader size={16} className="animate-spin" /> Uploading... </>
                            ) : (
                                <> Publish Now </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
