import React, { useState } from 'react';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { RichTextInput } from '../../../shared/components/RichTextEditor/RichTextInput';
import { useCreateBlog } from '../../../../domain/useCase/useCreateBlog';

export const CreateBlogModal = ({ isOpen, onClose, onSuccess }) => {
    const [description, setDescription] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDraft, setIsDraft] = useState(true);
    const { createBlog, loading, error, uploadProgress } = useCreateBlog();

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleReset = () => {
        setDescription([]);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBlog({
                description,
                imageFile,
                tags: [], // Passing empty tags as per current simple requirement
                isDraft
            });
            handleReset();
            onClose();
            if (onSuccess) onSuccess(); // Notify parent to refresh feed perhaps
        } catch (err) {
            // Error is handled by the hook and displayed below
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                    <h2 className="text-xl font-semibold text-text-primary">Create Blog Post</h2>
                    <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-full hover:bg-surface-sunken transition-colors" disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {/* Image Upload Area */}
                    <div className="w-full">
                        <label className="text-sm font-medium text-text-secondary mb-2 block">Cover Image</label>
                        {!imagePreview ? (
                            <label className="w-full h-40 border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-primary hover:bg-accent-primary/5 transition-colors group">
                                <ImageIcon size={32} className="text-text-muted group-hover:text-accent-primary mb-2" />
                                <span className="text-sm text-text-muted group-hover:text-accent-primary">Click to upload image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
                            </label>
                        ) : (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden group border border-border-subtle">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-surface-sunken/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-surface/90 text-text-primary px-4 py-2 rounded-lg text-sm hover:bg-surface transition-colors shadow-lg border border-border-subtle">
                                        Change Image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rich Text Input - Tiptap Editor */}
                    <RichTextInput
                        label="Blog Content"
                        value={description}
                        onChange={setDescription}
                        placeholder="Write your blog post here..."
                        className="flex-1 min-h-[300px]"
                    />

                    {error && (
                        <div className="p-3 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer with Progress & Submit */}
                <div className="p-4 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex-1 mr-4">
                        {loading && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="flex flex-col gap-1 w-full max-w-xs">
                                <div className="flex justify-between text-xs text-text-muted font-medium">
                                    <span>Uploading Media...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-2 bg-surface-sunken border border-border-subtle rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-accent-primary transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {loading && uploadProgress === 100 && (
                            <div className="text-xs text-accent-primary font-medium animate-pulse">
                                Processing & Saving Blog...
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer select-none",
                                isDraft 
                                    ? "bg-surface-sunken border-border-subtle text-text-muted" 
                                    : "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-3.5 rounded-full relative transition-all shadow-inner",
                                isDraft ? "bg-text-muted/20" : "bg-accent-primary"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm",
                                    isDraft ? "left-0.5" : "left-4"
                                )} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isDraft ? 'Draft' : 'Live'}
                            </span>
                        </div>

                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={loading}
                            className="px-6 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-sunken transition-colors font-medium border border-transparent hover:border-border-subtle"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading || description.length === 0}
                            className="px-6 py-2 rounded-xl bg-accent-primary text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent-primary/20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={18} />
                                    <span>Publish Blog</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
