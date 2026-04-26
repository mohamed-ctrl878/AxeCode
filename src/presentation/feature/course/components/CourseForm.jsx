import React, { useState } from 'react';
import { Image, X, Loader2, Activity, Lightbulb } from 'lucide-react';
import { cn } from '@core/utils/cn';
import RichTextInput from '@presentation/shared/components/RichTextEditor/RichTextInput';

/**
 * Reusable Form for Course Creation and Updating.
 * Captures core fields including rich text blocks.
 *
 * @param {object} props
 * @param {boolean} props.isLoading - Submission state
 * @param {Function} props.onSubmit - Triggered on valid form submit (formData, file)
 */
export const CourseForm = ({ 
    initialData = {}, 
    isLoading = false, 
    onSubmit 
}) => {
    // Form State
    const [title, setTitle] = useState(initialData.title || '');
    const [difficulty, setDifficulty] = useState(initialData.difficulty || 'Easy');
    const [description, setDescription] = useState(initialData.description || []);
    const [isDraft, setIsDraft] = useState(initialData.isDraft ?? true);
    
    // Arrays & Relations 
    const [tagsInput, setTagsInput] = useState(() => {
        const rawTags = (Array.isArray(initialData.tags) ? initialData.tags : []);
        return rawTags
            .map(t => {
                if (typeof t !== 'string') return t?.name || t?.label || '';
                // Filter out corrupted strings that look like JSON fragments (e.g. {"0":"c" )
                if (t.startsWith('{"') || t.includes('":')) return null;
                return t;
            })
            .filter(t => t && t !== "[object Object]")
            .join(', ');
    });

    // Image Upload State
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialData.picture?.url ? `${import.meta.env.VITE_API_BASE_URL}${initialData.picture.url}` : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Map CSV inputs to arrays
        const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean);

        const dtoData = {
            ...initialData,
            title,
            description,
            difficulty,
            tags,
            isDraft,
            picture: initialData.picture?.id || null 
        };

        onSubmit(dtoData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Course Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field text-lg font-serif"
                            placeholder="e.g. Master Clean Architecture..."
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Course Description</label>
                        <div className="border border-border-default rounded-xl overflow-hidden shadow-sm">
                            <RichTextInput
                                value={description}
                                onChange={setDescription}
                                placeholder="Describe your course content..."
                                hideBorder
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column (Settings & Relations) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Save Action Area */}
                    <div className="p-4 rounded-2xl bg-surface border border-border-subtle shadow-whisper space-y-4">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="btn-primary w-full py-4 text-base shadow-lg active:scale-95 transition-all"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {initialData.documentId ? 'Propagate Changes' : 'Manifest Course'}
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-center text-text-muted leading-tight opacity-70">
                            Updates will be immediately available in the repository.
                        </p>
                    </div>

                    {/* Publication Status Toggle */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Presence</label>
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-[0.98]",
                                isDraft 
                                    ? "bg-accent-primary/5 border-accent-primary/40 hover:bg-accent-primary/10" 
                                    : "bg-surface border-border-default hover:border-accent-emerald/40"
                            )}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider",
                                    isDraft ? "text-accent-primary" : "text-accent-emerald"
                                )}>
                                    {isDraft ? 'Manuscript (Draft)' : 'Archetype (Live)'}
                                </span>
                                <span className="text-[10px] text-text-muted italic opacity-60">
                                    {isDraft ? 'Private Workspace' : 'Global Collective'}
                                </span>
                            </div>
                            
                            <div className={cn(
                                "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
                                isDraft ? "bg-accent-primary/80" : "bg-accent-emerald/80"
                            )}>
                                <div className={cn(
                                    "w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                                    isDraft ? "translate-x-5" : "translate-x-0"
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* Guidance Tip */}
                    <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20 flex gap-3 shadow-sm">
                        <div className="p-2 h-fit rounded-lg bg-accent-amber/10 text-accent-amber shrink-0">
                            <Lightbulb size={18} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[11px] font-bold uppercase tracking-tight text-accent-amber/80">Publication Protocol</h4>
                            <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                Ensure these steps before making content public:<br/>
                                <span className="text-text-primary/70">1. Set a price you deem appropriate.</span><br/>
                                <span className="text-text-primary/70 text-[10px]">2. (Preferably complete all content related to this item before publishing as live content).</span>
                            </p>
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Intensity</label>
                        <div className="relative">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="input-field appearance-none cursor-pointer pr-10"
                            >
                                <option value="Easy">Novice (Easy)</option>
                                <option value="Medium">Scholar (Medium)</option>
                                <option value="Advanced">Philosopher (Advanced)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Activity size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Visual Identity</label>
                        <div className={cn(
                            "relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all min-h-[140px] group overflow-hidden",
                            imagePreview ? "border-accent-primary/30 bg-surface shadow-inner" : "border-border-default bg-surface-sunken/40 hover:bg-surface-sunken hover:border-accent-primary/20"
                        )}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="w-10 h-10 flex items-center justify-center bg-accent-rose text-white rounded-full transform scale-90 group-hover:scale-100 transition-all shadow-lg"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Image size={24} className="text-text-muted mb-2 opacity-50" />
                                    <span className="text-[10px] text-text-muted text-center font-medium leading-relaxed">
                                        DEPOT THUMBNAIL<br/>
                                        <span className="opacity-60 text-[8px]">DRAG OR SELECT</span>
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Taxonomy (CSV)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="react, clean-code, solid"
                            className="input-field text-xs font-mono"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};
