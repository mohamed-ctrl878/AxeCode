import React, { useState } from 'react';
import { Image, X, Loader2 } from 'lucide-react';
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
    const [tagsInput, setTagsInput] = useState((initialData.tags || []).join(', '));

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
            title,
            description,
            difficulty,
            tags,
            isDraft,
            // existing picture ID mapped if not changed, else omitted
            picture: initialData.picture?.id || null 
        };

        // Pass form data and the raw file up to the page
        onSubmit(dtoData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mx-auto p-6 lg:p-10 bg-surface rounded-2xl border border-border-subtle shadow-2xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                <h2 className="text-2xl">
                    {initialData.documentId ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="btn-primary"
                >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {initialData.documentId ? 'Save Changes' : 'Create Course'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-3 flex flex-col gap-5">
                    
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-muted">Course Title *</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field"
                            placeholder="e.g. Master Clean Architecture..."
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex flex-col gap-2 relative z-0">
                        <label className="text-sm font-medium text-text-muted">Course Description</label>
                        <div className="border border-border-subtle rounded-xl overflow-hidden min-h-[300px] bg-surface-sunken">
                            <RichTextInput
                                value={description}
                                onChange={setDescription}
                                placeholder="Describe your course content..."
                            />
                        </div>
                    </div>

                </div>

                {/* Right Column (Settings & Relations) */}
                <div className="flex flex-col gap-5">
                    
                    {/* Thumbnail Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-muted">Course Thumbnail</label>
                        <div className={cn(
                            "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors min-h-[160px]",
                            imagePreview ? "border-accent-primary/50 bg-accent-primary/5" : "border-border-subtle bg-surface-sunken hover:bg-surface-hover"
                        )}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-accent-rose hover:bg-accent-rose/90 text-white rounded-full z-10 transition-colors shadow-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Image size={32} className="text-text-muted mb-3" />
                                    <span className="text-xs text-text-muted text-center leading-relaxed">Click to upload or drag & drop<br/>(JPEG, PNG, WEBP)</span>
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

                    {/* Publication Status Toggle */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-muted">Publication Status</label>
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95",
                                isDraft 
                                    ? "bg-surface-sunken border-border-default text-text-muted" 
                                    : "bg-accent-primary/10 border-accent-primary text-accent-primary"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-6 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-text-muted/20" : "bg-accent-primary"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-1" : "left-5"
                                )} />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest">
                                {isDraft ? 'Draft Mode' : 'Live / Published'}
                            </span>
                        </div>
                        <p className="text-[10px] italic text-text-muted opacity-60">
                            {isDraft ? "Visible only to you." : "Visible to all scholars in the archive."}
                        </p>
                    </div>

                    {/* Difficulty */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-muted">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="input-field appearance-none cursor-pointer"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-muted">Tags (CSV)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="react, clean-code, solid"
                            className="input-field text-sm"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};
