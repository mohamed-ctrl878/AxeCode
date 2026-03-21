import React, { useState } from 'react';
import { Image, X, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';
import RichTextInput from '@presentation/shared/components/RichTextEditor/RichTextInput';

/**
 * Reusable Form for Course Creation and Updating.
 * Captures core fields including rich text blocks.
 *
 * @param {object} props
 * @param {object} props.initialData - Pre-filled data for editing (optional)
 * @param {boolean} props.isLoading - Submission state
 * @param {Array} props.courseTypes - List of available course types from DB
 * @param {Array} props.problemTypes - List of available problem types from DB
 * @param {boolean} props.isTypesLoading - Fetching categorizations state
 * @param {Function} props.onSubmit - Triggered on valid form submit (formData, file)
 */
export const CourseForm = ({ 
    initialData = {}, 
    isLoading = false, 
    courseTypes = [], 
    problemTypes = [], 
    isTypesLoading = false,
    onSubmit 
}) => {
    // Form State
    const [title, setTitle] = useState(initialData.title || '');
    const [difficulty, setDifficulty] = useState(initialData.difficulty || 'Easy');
    const [description, setDescription] = useState(initialData.description || []);
    
    // Arrays & Relations 
    const [tagsInput, setTagsInput] = useState((initialData.tags || []).join(', '));
    const [selectedCourseTypes, setSelectedCourseTypes] = useState(initialData.course_types || []);
    const [selectedProblemTypes, setSelectedProblemTypes] = useState(initialData.problem_types || []);

    const toggleSelection = (id, currentList, setter) => {
        if (currentList.includes(id)) setter(currentList.filter(i => i !== id));
        else setter([...currentList, id]);
    };

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
            courseTypeIds: selectedCourseTypes,
            problemTypeIds: selectedProblemTypes,
            // existing picture ID mapped if not changed, else omitted
            picture: initialData.picture?.id || null 
        };

        // Pass form data and the raw file up to the page
        onSubmit(dtoData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full mx-auto p-6 lg:p-10 bg-surface rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {initialData.documentId ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-primary font-bold px-8 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <label className="text-sm font-bold text-text-muted">Course Title *</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary transition-colors"
                            placeholder="e.g. Master Clean Architecture..."
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div className="flex flex-col gap-2 relative z-0">
                        <label className="text-sm font-bold text-text-muted">Course Description</label>
                        <div className="border border-white/10 rounded-xl overflow-hidden min-h-[300px] bg-background">
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
                        <label className="text-sm font-bold text-text-muted">Course Thumbnail</label>
                        <div className={cn(
                            "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors min-h-[160px]",
                            imagePreview ? "border-accent-primary/50 bg-accent-primary/5" : "border-white/10 bg-background hover:bg-surface-dark"
                        )}>
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-full z-10 transition-colors shadow-lg"
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

                    {/* Difficulty */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-primary appearance-none cursor-pointer"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Tags (CSV)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="react, clean-code, solid"
                            className="bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors"
                        />
                    </div>
                    
                    {/* Course Types */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Target Audiences (Course Types)</label>
                        {isTypesLoading ? (
                            <div className="text-xs animate-pulse text-text-muted">Loading types...</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {courseTypes.map(type => {
                                    const id = type.id || type.documentId;
                                    const name = type.attributes?.name || type.name;
                                    const isSelected = selectedCourseTypes.includes(id);
                                    
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleSelection(id, selectedCourseTypes, setSelectedCourseTypes)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                                isSelected 
                                                ? "bg-accent-primary/20 border-accent-primary text-accent-primary" 
                                                : "bg-[#1e1e2e] border-border-subtle hover:border-text-muted text-text-secondary"
                                            )}
                                        >
                                            {name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Problem Types */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-text-muted">Core Domains (Problem Types)</label>
                        {isTypesLoading ? (
                            <div className="text-xs animate-pulse text-text-muted">Loading types...</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {problemTypes.map(type => {
                                    const id = type.id || type.documentId;
                                    const name = type.attributes?.name || type.name;
                                    const isSelected = selectedProblemTypes.includes(id);
                                    
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleSelection(id, selectedProblemTypes, setSelectedProblemTypes)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                                isSelected 
                                                ? "bg-purple-500/20 border-purple-500 text-purple-400" 
                                                : "bg-[#1e1e2e] border-border-subtle hover:border-text-muted text-text-secondary"
                                            )}
                                        >
                                            {name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </form>
    );
};
