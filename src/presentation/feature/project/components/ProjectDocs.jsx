import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, ChevronRight, Save, Trash2, Edit3, X, Loader2, Layout } from 'lucide-react';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { RichTextBlocks } from '@presentation/shared/components/RichTextBlocks';
import { useUpdateProject } from '@domain/useCase/project/useUpdateProject';
import { toast } from 'react-hot-toast';
import { cn } from '@core/utils/cn';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';

export const ProjectDocs = ({ project }) => {
    const { updateProject, isUpdating } = useUpdateProject(project.uid);
    const [pages, setPages] = useState([]);
    const [activePageId, setActivePageId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [sidebarTab, setSidebarTab] = useState('pages'); // 'pages' or 'flowcharts'
    const [activeFlowchartId, setActiveFlowchartId] = useState('system-architecture');

    // Default Fallback Diagram nodes and edges
    const defaultNodes = [
        {
            id: 'client',
            type: 'richText',
            position: { x: 100, y: 150 },
            style: { width: 280, height: 180 },
            data: {
                label: 'Client Web App',
                content: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'React + Vite Application with glassmorphism frontend styles.' }]
                    }
                ],
                shape: 'rectangle',
                color: 'bg-surface-elevated',
                borderColor: 'border-accent-primary'
            }
        },
        {
            id: 'api',
            type: 'richText',
            position: { x: 350, y: 150 },
            style: { width: 280, height: 180 },
            data: {
                label: 'Strapi Core API Gateway',
                content: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Exposes secure endpoints for tasks, sprints, documents, and roles.' }]
                    }
                ],
                shape: 'rectangle',
                color: 'bg-surface-elevated',
                borderColor: 'border-accent-secondary'
            }
        },
        {
            id: 'db',
            type: 'richText',
            position: { x: 600, y: 150 },
            style: { width: 200, height: 200 },
            data: {
                label: 'PostgreSQL Database',
                content: [
                    {
                        type: 'paragraph',
                        children: [{ text: 'Stores core schemas, JSON documents, and sprint relationships.' }]
                    }
                ],
                shape: 'circle',
                color: 'bg-surface-elevated',
                borderColor: 'border-border-subtle'
            }
        }
    ];

    const defaultEdges = [
        {
            id: 'e-client-api',
            source: 'client',
            target: 'api',
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2, stroke: '#f59e0b' }
        },
        {
            id: 'e-api-db',
            source: 'api',
            target: 'db',
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2, stroke: '#a855f7' }
        }
    ];

    const hasArchitecture = project?.architectureDiagram && 
                            Array.isArray(project.architectureDiagram.nodes) && 
                            project.architectureDiagram.nodes.length > 0;

    const flowchartNodes = hasArchitecture ? project.architectureDiagram.nodes : defaultNodes;
    const flowchartEdges = hasArchitecture ? (project.architectureDiagram.edges || []) : defaultEdges;

    useEffect(() => {
        if (project?.wikiDocs && Array.isArray(project.wikiDocs)) {
            setPages(project.wikiDocs);
            if (project.wikiDocs.length > 0) {
                setActivePageId(project.wikiDocs[0].id);
            }
        } else {
            // Default Welcome Page
            const defaultPage = {
                id: 'default-getting-started',
                title: 'Getting Started Guide',
                content: [
                    {
                        type: 'heading',
                        level: 2,
                        children: [{ text: 'Welcome to your Project Wiki' }]
                    },
                    {
                        type: 'paragraph',
                        children: [{ text: 'Use this workspace to author and maintain your project requirements, user guides, or design guidelines. Team members with write access can edit these documents.' }]
                    }
                ]
            };
            setPages([defaultPage]);
            setActivePageId(defaultPage.id);
        }
    }, [project]);

    const activePage = pages.find(p => p.id === activePageId);

    const handleSaveWiki = async (updatedPages) => {
        try {
            const success = await updateProject({ wiki_docs: updatedPages });
            if (success) {
                toast.success('Wiki updated successfully!');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update wiki.');
        }
    };

    const handleStartEdit = () => {
        if (!activePage) return;
        setEditTitle(activePage.title);
        setEditContent(activePage.content || []);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleCommitPageEdit = () => {
        if (!editTitle.trim()) {
            toast.error('Title is required');
            return;
        }

        const updatedPages = pages.map(p => {
            if (p.id === activePageId) {
                return { ...p, title: editTitle, content: editContent };
            }
            return p;
        });

        setPages(updatedPages);
        setIsEditing(false);
        handleSaveWiki(updatedPages);
    };

    const handleAddNewPage = () => {
        if (!newPageTitle.trim()) {
            toast.error('Page title is required');
            return;
        }

        const newPage = {
            id: `doc-${Date.now()}`,
            title: newPageTitle,
            content: [
                {
                    type: 'paragraph',
                    children: [{ text: 'Start writing your documentation...' }]
                }
            ]
        };

        const updatedPages = [...pages, newPage];
        setPages(updatedPages);
        setActivePageId(newPage.id);
        setNewPageTitle('');
        setIsCreating(false);
        setIsEditing(true); // Open in edit mode directly
        setEditTitle(newPage.title);
        setEditContent(newPage.content);
        handleSaveWiki(updatedPages);
    };

    const handleDeletePage = (pageId) => {
        if (pages.length <= 1) {
            toast.error('You must keep at least one wiki page.');
            return;
        }
        
        if (!window.confirm('Are you sure you want to delete this page?')) return;

        const updatedPages = pages.filter(p => p.id !== pageId);
        setPages(updatedPages);
        
        if (activePageId === pageId) {
            setActivePageId(updatedPages[0].id);
        }
        
        handleSaveWiki(updatedPages);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px] animate-in fade-in duration-300">
            {/* Sidebar Documents & Flowcharts List */}
            <div className="lg:col-span-1 bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                        <BookOpen size={16} className="text-accent-primary" /> Project Wiki
                    </h3>
                    
                    {!isCreating && sidebarTab === 'pages' && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="p-2 rounded-xl bg-surface-elevated hover:bg-accent-primary/20 text-text-primary hover:text-accent-primary transition-all border border-border-subtle hover:border-accent-primary/50"
                            title="Add new document page"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-surface-sunken p-1 rounded-xl border border-border-subtle">
                    <button
                        onClick={() => setSidebarTab('pages')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                            sidebarTab === 'pages'
                                ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm'
                                : 'text-text-muted hover:text-text-primary'
                        )}
                    >
                        <FileText size={12} /> Pages
                    </button>
                    <button
                        onClick={() => setSidebarTab('flowcharts')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                            sidebarTab === 'flowcharts'
                                ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm'
                                : 'text-text-muted hover:text-text-primary'
                        )}
                    >
                        <Layout size={12} /> Flowcharts
                    </button>
                </div>

                {sidebarTab === 'pages' ? (
                    <>
                        {isCreating && (
                            <div className="p-4 bg-surface-sunken border border-border-subtle rounded-2xl flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
                                <input 
                                    type="text" 
                                    placeholder="Page title..."
                                    value={newPageTitle}
                                    onChange={(e) => setNewPageTitle(e.target.value)}
                                    className="bg-surface border border-border-subtle rounded-xl px-3 py-2 text-sm text-text-primary focus:border-accent-primary outline-none transition-all"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button 
                                        onClick={() => setIsCreating(false)}
                                        className="px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleAddNewPage}
                                        className="px-3 py-1.5 text-xs bg-accent-primary text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
                            {pages.map(page => (
                                <div 
                                    key={page.id}
                                    className={`group w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border text-sm ${
                                        activePageId === page.id 
                                            ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/30 font-bold' 
                                            : 'bg-transparent text-text-muted border-transparent hover:text-text-primary hover:bg-surface-elevated'
                                    }`}
                                    onClick={() => {
                                        if (isEditing) {
                                            if (window.confirm("You have unsaved changes. Discard and switch page?")) {
                                                setIsEditing(false);
                                                setActivePageId(page.id);
                                            }
                                        } else {
                                            setActivePageId(page.id);
                                        }
                                    }}
                                >
                                    <span className="truncate flex items-center gap-2">
                                        <FileText size={14} className={activePageId === page.id ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'} />
                                        {page.title}
                                    </span>
                                    
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePage(page.id);
                                            }}
                                            className="p-1 rounded text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors"
                                            title="Delete Page"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                        <ChevronRight size={14} className="text-text-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1">
                        <div 
                            className={cn(
                                "group w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border text-sm",
                                activeFlowchartId === 'system-architecture' 
                                    ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/30 font-bold' 
                                    : 'bg-transparent text-text-muted border-transparent hover:text-text-primary hover:bg-surface-elevated'
                            )}
                            onClick={() => setActiveFlowchartId('system-architecture')}
                        >
                            <span className="truncate flex items-center gap-2">
                                <Layout size={14} className={activeFlowchartId === 'system-architecture' ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'} />
                                System Architecture
                            </span>
                            <ChevronRight size={14} className="text-text-muted" />
                        </div>
                    </div>
                )}
            </div>

            {/* Document / Flowchart Content Workspace */}
            <div className="lg:col-span-3 bento-card p-8 bg-surface rounded-[2rem] border border-border-subtle flex flex-col gap-6 relative">
                {isUpdating && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-[2rem] flex items-center justify-center z-10">
                        <Loader2 size={36} className="animate-spin text-accent-primary" />
                    </div>
                )}

                {sidebarTab === 'pages' ? (
                    activePage ? (
                        isEditing ? (
                            /* EDIT MODE */
                            <div className="flex flex-col gap-6 animate-in fade-in duration-200 h-full">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest font-bold text-text-muted">Document Title</label>
                                    <input 
                                        type="text" 
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="bg-surface-sunken border border-border-subtle rounded-2xl px-5 py-3 text-lg font-bold text-text-primary focus:border-accent-primary outline-none transition-all"
                                        placeholder="Enter page title..."
                                    />
                                </div>

                                <div className="flex-1 min-h-[350px] flex flex-col">
                                    <label className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2">Content</label>
                                    <RichTextInput 
                                        value={editContent}
                                        onChange={setEditContent}
                                        placeholder="Start writing documentation..."
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex gap-4 justify-end shrink-0 pt-4 border-t border-border-subtle">
                                    <button 
                                        onClick={handleCancelEdit}
                                        className="px-6 py-3 border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                    <button 
                                        onClick={handleCommitPageEdit}
                                        className="px-6 py-3 bg-accent-primary text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/20"
                                    >
                                        <Save size={14} /> Save Page
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* DISPLAY MODE */
                            <div className="flex flex-col gap-6 h-full justify-between animate-in fade-in duration-200">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                                        <h2 className="text-2xl md:text-3xl font-serif text-text-primary">
                                            {activePage.title}
                                        </h2>
                                        <button 
                                            onClick={handleStartEdit}
                                            className="px-4 py-2 border border-border-subtle hover:border-accent-primary text-text-muted hover:text-accent-primary rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2"
                                        >
                                            <Edit3 size={14} /> Edit Page
                                        </button>
                                    </div>

                                    <div className="prose prose-invert max-w-none min-h-[300px]">
                                        {activePage.content && activePage.content.length > 0 ? (
                                            <RichTextBlocks blocks={activePage.content} />
                                        ) : (
                                            <p className="text-text-muted italic">This page has no content. Click edit to add some content!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-text-muted py-24">
                            <FileText size={48} className="opacity-20 mb-4" />
                            <p>No document selected</p>
                            <p className="text-sm">Select or create a document from the left wiki panel.</p>
                        </div>
                    )
                ) : (
                    /* FLOWCHART VIEW MODE */
                    <div className="flex flex-col gap-6 h-full justify-between animate-in fade-in duration-300">
                        <div className="space-y-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-serif text-text-primary">
                                        System Architecture Diagram
                                    </h2>
                                    <p className="text-sm text-text-muted mt-1">
                                        Visual representation of the project's architecture, databases, and client flows.
                                    </p>
                                </div>
                                <span className={cn(
                                    "px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-widest shrink-0 self-start",
                                    hasArchitecture 
                                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                        : "bg-surface-sunken text-text-muted border-border-subtle"
                                )}>
                                    {hasArchitecture ? "Official / Merged" : "Default Fallback"}
                                </span>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden border border-border-subtle flex-1 min-h-[450px]" style={{ height: '550px' }}>
                                <FlowPreviewer
                                    nodes={flowchartNodes}
                                    edges={flowchartEdges}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDocs;
