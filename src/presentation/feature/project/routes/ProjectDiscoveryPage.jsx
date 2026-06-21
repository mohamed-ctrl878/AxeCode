import React, { useEffect, useState } from 'react';
import { useFetchProjects } from '@domain/useCase/project/useFetchProjects';
import { useCreateProject } from '@domain/useCase/project/useCreateProject';
import { ProjectCard } from '../components/ProjectCard';
import { Plus, AlertCircle, X, Code2, Globe, Shield, Github, Sparkles } from 'lucide-react';
import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';
import { cn } from '@core/utils/cn';

export const ProjectDiscoveryPage = () => {
    const { fetchProjects, projects, loading, error } = useFetchProjects();
    const { createProject, creating, error: createError } = useCreateProject();
    
    // Modal & Form States
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        methodology: 'agile',
        visibility: 'public',
        github_repo_url: ''
    });
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.title.trim()) {
            setLocalError('Project title is required.');
            return;
        }

        try {
            await createProject({
                title: formData.title,
                description: formData.description,
                methodology: formData.methodology,
                visibility: formData.visibility,
                github_repo_url: formData.github_repo_url || undefined,
                status: 'active' // automatically set to active for immediate view
            });
            
            // Reset & Close
            setFormData({
                title: '',
                description: '',
                methodology: 'agile',
                visibility: 'public',
                github_repo_url: ''
            });
            setIsOpen(false);
            
            // Refresh projects list
            fetchProjects();
        } catch (err) {
            setLocalError(err.message || 'Failed to create project.');
        }
    };

    return (
        <div className="md:col-span-12 min-h-screen bg-transparent p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500 relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-3">Discover Projects</h1>
                    <p className="text-lg text-text-muted max-w-2xl">
                        Find open source projects, join agile teams, and collaborate on real-world applications within the AxeCode ecosystem.
                    </p>
                </div>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-bold tracking-widest uppercase text-sm whitespace-nowrap active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    Create Project
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="py-20">
                    <PageLoader />
                </div>
            )}
            
            {/* Error State */}
            {error && (
                <div className="bento-card border border-red-500/20 bg-red-500/5 p-6 rounded-3xl flex items-start gap-4 mb-8">
                    <AlertCircle className="text-red-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-red-400 font-bold mb-1">Error fetching projects</h3>
                        <p className="text-red-400/80 text-sm">{error.message}</p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && (!projects || projects.length === 0) && (
                <div className="bento-card flex flex-col items-center justify-center py-24 text-center border border-dashed border-border-subtle rounded-[2.5rem] w-full">
                    <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-6 border border-border-subtle">
                        <AlertCircle size={24} className="text-text-muted" />
                    </div>
                    <h2 className="text-2xl font-serif text-text-primary mb-2">No Active Projects</h2>
                    <p className="text-text-muted text-sm max-w-sm mb-6">
                        There are currently no active projects available. Be the first to start a new collaborative workspace!
                    </p>
                    <button 
                        onClick={() => setIsOpen(true)}
                        className="btn-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2"
                    >
                        <Plus size={14} /> Start A Project
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(projects || []).map((project) => (
                    <ProjectCard key={project.uid} project={project} />
                ))}
            </div>

            {/* Premium Create Project Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-surface border border-border-subtle max-w-lg w-full rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-8 py-6 border-b border-border-subtle/50 bg-surface-elevated">
                            <h2 className="text-2xl font-serif text-text-primary flex items-center gap-2">
                                <Sparkles className="text-accent-primary" size={20} />
                                Start a New Project
                            </h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 rounded-full bg-surface hover:text-accent-primary hover:border-accent-primary/30 border border-border-subtle flex items-center justify-center transition-colors text-text-muted"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
                            {/* Error Alerts */}
                            {(localError || createError) && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                                    <AlertCircle size={16} />
                                    <span>{localError || createError.message}</span>
                                </div>
                            )}

                            {/* Project Title */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Project Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleInputChange}
                                    placeholder="e.g. CodeForge Open Platform"
                                    className="w-full bg-surface-sunken border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange}
                                    placeholder="Describe the goals, technology stack, and structure of this open source project..."
                                    rows={4}
                                    className="w-full bg-surface-sunken border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors resize-none"
                                />
                            </div>

                            {/* Grid Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Methodology */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                                        <Code2 size={12} className="text-accent-primary" /> Methodology
                                    </label>
                                    <select 
                                        name="methodology"
                                        value={formData.methodology}
                                        onChange={(e) => handleSelectChange('methodology', e.target.value)}
                                        className="w-full bg-surface-sunken border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="agile">Agile</option>
                                        <option value="scrum">Scrum</option>
                                        <option value="kanban">Kanban</option>
                                        <option value="waterfall">Waterfall</option>
                                    </select>
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                                        <Globe size={12} className="text-accent-primary" /> Visibility
                                    </label>
                                    <select 
                                        name="visibility"
                                        value={formData.visibility}
                                        onChange={(e) => handleSelectChange('visibility', e.target.value)}
                                        className="w-full bg-surface-sunken border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="public">Public</option>
                                        <option value="invite_only">Invite Only</option>
                                    </select>
                                </div>
                            </div>

                            {/* GitHub Repository */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                                    <Github size={12} /> GitHub Repository URL (Optional)
                                </label>
                                <input 
                                    type="url" 
                                    name="github_repo_url" 
                                    value={formData.github_repo_url} 
                                    onChange={handleInputChange}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full bg-surface-sunken border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-sm text-text-primary outline-none transition-colors"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 flex gap-3 border-t border-border-subtle/50">
                                <button 
                                    type="button" 
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3.5 bg-surface-elevated border border-border-subtle hover:text-red-400 hover:border-red-500/20 text-text-muted rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 btn-primary py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    disabled={creating}
                                >
                                    {creating ? 'Creating...' : 'Initialize Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDiscoveryPage;
