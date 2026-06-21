import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, ChevronRight, Save, Trash2, Edit3, X, Loader2, Send, GitPullRequest, Layout, Link, Unlink } from 'lucide-react';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { RichTextBlocks } from '@presentation/shared/components/RichTextBlocks';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { useWorkspace } from '@domain/useCase/project/useWorkspace';
import { useReviewRequests } from '@domain/useCase/project/useReviewRequests';
import { useKanbanBoard } from '@domain/useCase/task/useKanbanBoard';
import { useRole } from '@core/hooks/useRole';
import { Modal, Select, Input, Form, Button } from 'antd';
import { toast } from 'react-hot-toast';
import { cn } from '@core/utils/cn';

const { Option } = Select;
const { TextArea } = Input;

export const ProjectWorkshop = ({ project }) => {
    const { user } = useRole();
    const { workspaceItems, loading, saving, fetchWorkspace, createWorkspaceItem, updateWorkspaceItem, deleteWorkspaceItem } = useWorkspace(project.uid);
    const { createReviewRequest, resolving } = useReviewRequests(project.uid);
    const { fetchTasks, tasks } = useKanbanBoard(project.uid);

    const [activeSubTab, setActiveSubTab] = useState('sandbox'); // 'sandbox' | 'tasks'
    const [activeItemId, setActiveItemId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState(null);
    
    // Create draft Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newType, setNewType] = useState('document');
    const [newTitle, setNewTitle] = useState('');

    // Submit Review Modal
    const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
    const [reviewForm] = Form.useForm();

    useEffect(() => {
        fetchWorkspace();
        fetchTasks();
    }, [fetchWorkspace, fetchTasks]);

    const activeItem = workspaceItems.find(item => item.uid === activeItemId);

    const myTasks = (tasks || []).filter(t => {
        const assigneeUser = t.assignee?.user;
        if (!assigneeUser) return false;
        return assigneeUser.id === user?.id || 
               assigneeUser.uid === user?.uid || 
               assigneeUser.uid === user?.documentId ||
               assigneeUser.documentId === user?.documentId;
    });

    const unlinkedDrafts = workspaceItems.filter(item => !item.linkedTaskId);

    const handleLinkDraft = async (taskId, draftId) => {
        await updateWorkspaceItem(draftId, {
            linked_task: taskId
        });
    };

    const handleUnlinkDraft = async (draftId) => {
        await updateWorkspaceItem(draftId, {
            linked_task: null
        });
    };

    const handleViewDraft = (draftId) => {
        setActiveItemId(draftId);
        setIsEditing(false);
        setActiveSubTab('sandbox');
    };

    const handleCreateAndLinkDraft = async (task, type) => {
        const data = {
            type: type,
            title: `${task.title} Draft`,
            content: type === 'document' ? [
                {
                    type: 'paragraph',
                    children: [{ text: 'Start writing your requirements document here...' }]
                }
            ] : { nodes: [], edges: [] },
            linked_task: task.uid
        };

        const newItem = await createWorkspaceItem(data);
        if (newItem) {
            setActiveItemId(newItem.uid);
            setIsEditing(true);
            setEditTitle(newItem.title);
            setEditContent(newItem.content);
            setActiveSubTab('sandbox');
        }
    };

    const handleCreateDraft = async () => {
        if (!newTitle.trim()) {
            toast.error('Title is required');
            return;
        }

        const data = {
            type: newType,
            title: newTitle,
            content: newType === 'document' ? [
                {
                    type: 'paragraph',
                    children: [{ text: 'Start writing your requirements document here...' }]
                }
            ] : { nodes: [], edges: [] }
        };

        const newItem = await createWorkspaceItem(data);
        if (newItem) {
            setActiveItemId(newItem.uid);
            setIsCreateModalOpen(false);
            setNewTitle('');
            setIsEditing(true);
            setEditTitle(newItem.title);
            setEditContent(newItem.content);
        }
    };

    const handleStartEdit = () => {
        if (!activeItem) return;
        setEditTitle(activeItem.title);
        setEditContent(activeItem.content);
        setIsEditing(true);
    };

    const handleSaveDraft = async () => {
        if (!editTitle.trim()) {
            toast.error('Title is required');
            return;
        }

        const success = await updateWorkspaceItem(activeItemId, {
            title: editTitle,
            content: editContent
        });

        if (success) {
            setIsEditing(false);
        }
    };

    const handleSaveDiagram = async (flowData) => {
        const success = await updateWorkspaceItem(activeItemId, {
            title: editTitle || activeItem.title,
            content: flowData
        });
        if (success) {
            toast.success('Diagram draft saved!');
        }
    };

    const handleDeleteDraft = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this draft? This cannot be undone.')) return;
        
        const success = await deleteWorkspaceItem(itemId);
        if (success && activeItemId === itemId) {
            setActiveItemId(null);
            setIsEditing(false);
        }
    };

    const handleSubmitReview = async (values) => {
        const payload = {
            task: values.task,
            reviewer: values.reviewer,
            workspace_item: activeItemId,
            message: values.message || ''
        };

        const result = await createReviewRequest(payload);
        if (result) {
            setIsSubmitReviewOpen(false);
            reviewForm.resetFields();
            setIsEditing(false);
            // Refresh items to see status changed to 'submitted'
            fetchWorkspace();
        }
    };

    const filteredTasks = (tasks || []).filter(t => t.status !== 'done' && t.status !== 'blocked');
    const projectMembers = project.members || [];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Sub-tab Switcher */}
            <div className="flex border-b border-border-subtle pb-1">
                <button
                    onClick={() => setActiveSubTab('sandbox')}
                    className={cn(
                        "px-4 py-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-all",
                        activeSubTab === 'sandbox'
                            ? 'border-accent-primary text-accent-primary'
                            : 'border-transparent text-text-muted hover:text-text-primary'
                    )}
                >
                    My Sandbox Drafts
                </button>
                <button
                    onClick={() => setActiveSubTab('tasks')}
                    className={cn(
                        "px-4 py-2 text-sm font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2",
                        activeSubTab === 'tasks'
                            ? 'border-accent-primary text-accent-primary'
                            : 'border-transparent text-text-muted hover:text-text-primary'
                    )}
                >
                    My Assigned Tasks
                    {myTasks.length > 0 && (
                        <span className="bg-accent-primary/20 text-accent-primary text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                            {myTasks.length}
                        </span>
                    )}
                </button>
            </div>

            {activeSubTab === 'sandbox' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px]">
                    {/* Sidebar Sandbox Items */}
                    <div className="lg:col-span-1 bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <GitPullRequest size={16} className="text-accent-primary" /> Personal Workshop
                            </h3>
                            
                            <button 
                                onClick={() => setIsCreateModalOpen(true)}
                                className="p-2 rounded-xl bg-surface-elevated hover:bg-accent-primary/20 text-text-primary hover:text-accent-primary transition-all border border-border-subtle hover:border-accent-primary/50"
                                title="Create new draft"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-accent-primary" size={24} />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 overflow-y-auto max-h-[450px] pr-1">
                                {workspaceItems.length === 0 ? (
                                    <p className="text-xs text-text-muted text-center py-8">Your sandbox workspace is empty. Click + to create a draft document or flowchart!</p>
                                ) : (
                                    workspaceItems.map(item => (
                                        <div 
                                            key={item.uid}
                                            className={cn(
                                                "group w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border text-sm",
                                                activeItemId === item.uid 
                                                    ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/30 font-bold' 
                                                    : 'bg-transparent text-text-muted border-transparent hover:text-text-primary hover:bg-surface-elevated'
                                            )}
                                            onClick={() => {
                                                if (isEditing) {
                                                    if (window.confirm("You have unsaved changes. Discard and switch?")) {
                                                        setIsEditing(false);
                                                        setActiveItemId(item.uid);
                                                    }
                                                } else {
                                                    setActiveItemId(item.uid);
                                                }
                                            }}
                                        >
                                            <span className="truncate flex items-center gap-2">
                                                {item.type === 'flowchart' ? (
                                                    <Layout size={14} className={activeItemId === item.uid ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'} />
                                                ) : (
                                                    <FileText size={14} className={activeItemId === item.uid ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'} />
                                                )}
                                                {item.title}
                                            </span>
                                            
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[9px] uppercase font-mono px-1.5 py-0.5 rounded",
                                                    item.status === 'draft' && 'bg-surface-sunken text-text-muted border border-border-subtle',
                                                    item.status === 'submitted' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                                                    item.status === 'merged' && 'bg-green-500/10 text-green-400 border border-green-500/20',
                                                    item.status === 'rejected' && 'bg-red-500/10 text-red-400 border-red-500/20'
                                                )}>
                                                    {item.status}
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDraft(item.uid);
                                                    }}
                                                    className="p-1 rounded text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Draft"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Document Content / Design Workspace */}
                    <div className="lg:col-span-3 bento-card p-8 bg-surface rounded-[2rem] border border-border-subtle flex flex-col gap-6 relative">
                        {saving && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-[2rem] flex items-center justify-center z-20">
                                <Loader2 size={36} className="animate-spin text-accent-primary" />
                            </div>
                        )}

                        {activeItem ? (
                            <div>
                                {/* Header Action Bar */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle pb-4 mb-6 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-2xl font-serif text-text-primary">
                                            {isEditing ? (
                                                <input 
                                                    type="text" 
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="bg-transparent border-b border-accent-primary/50 text-2xl font-serif text-text-primary focus:border-accent-primary outline-none py-1"
                                                />
                                            ) : (
                                                activeItem.title
                                            )}
                                        </h2>

                                        {/* Linked Task Selector / Indicator */}
                                        <div className="flex items-center gap-2 mt-1">
                                            {activeItem.status === 'merged' ? (
                                                activeItem.linkedTask && (
                                                    <span className="text-xs text-text-muted">
                                                        Linked to: <strong className="text-text-primary">{activeItem.linkedTask.title}</strong>
                                                    </span>
                                                )
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Satisfies Task:</span>
                                                    <Select
                                                        placeholder="Associate with a task..."
                                                        value={activeItem.linkedTaskId || undefined}
                                                        onChange={async (val) => {
                                                            await updateWorkspaceItem(activeItem.uid, {
                                                                linked_task: val || null
                                                            });
                                                        }}
                                                        allowClear
                                                        className="dark-select w-[200px]"
                                                        dropdownClassName="dark-select-dropdown"
                                                        bordered={false}
                                                    >
                                                        {myTasks.map(t => (
                                                            <Option key={t.uid} value={t.uid}>
                                                                {t.title}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {isEditing ? (
                                            <>
                                                <button 
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5"
                                                >
                                                    <X size={12} /> Cancel
                                                </button>
                                                
                                                {activeItem.type === 'document' && (
                                                    <button 
                                                        onClick={handleSaveDraft}
                                                        className="px-4 py-2 bg-accent-primary text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Save size={12} /> Save Draft
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {activeItem.status !== 'merged' && (
                                                    <button 
                                                        onClick={handleStartEdit}
                                                        className="px-4 py-2 border border-border-subtle hover:border-accent-primary text-text-muted hover:text-accent-primary rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5"
                                                    >
                                                        <Edit3 size={12} /> {activeItem.type === 'flowchart' ? 'Design Diagram' : 'Edit Page'}
                                                    </button>
                                                )}

                                                {activeItem.status === 'draft' || activeItem.status === 'rejected' ? (
                                                    <button 
                                                        onClick={() => {
                                                            reviewForm.resetFields();
                                                            setIsSubmitReviewOpen(true);
                                                        }}
                                                        className="px-4 py-2 bg-accent-primary text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Send size={12} /> Submit Review
                                                    </button>
                                                ) : activeItem.status === 'submitted' ? (
                                                    <span className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                                        Under Review
                                                    </span>
                                                ) : (
                                                    <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                                        Merged
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* WORKSPACE CONTENT TYPE SWITCHER */}
                                <div className="min-h-[450px]">
                                    {activeItem.type === 'document' ? (
                                        isEditing ? (
                                            <RichTextInput 
                                                value={editContent}
                                                onChange={setEditContent}
                                                placeholder="Start typing your rich page content..."
                                                className="min-h-[400px]"
                                            />
                                        ) : (
                                            <div className="prose prose-invert max-w-none">
                                                {activeItem.content && activeItem.content.length > 0 ? (
                                                    <RichTextBlocks blocks={activeItem.content} />
                                                ) : (
                                                    <p className="text-text-muted italic">This draft has no content yet.</p>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        /* FLOWCHART BUILDER */
                                        <div className="relative rounded-2xl overflow-hidden border border-border-subtle" style={{ height: '550px' }}>
                                            {isEditing ? (
                                                <FlowBuilder
                                                    initialNodes={activeItem.content?.nodes || []}
                                                    initialEdges={activeItem.content?.edges || []}
                                                    onSave={handleSaveDiagram}
                                                    readOnly={false}
                                                />
                                            ) : (
                                                <FlowPreviewer
                                                    nodes={activeItem.content?.nodes || []}
                                                    edges={activeItem.content?.edges || []}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-text-muted py-24">
                                <GitPullRequest size={48} className="opacity-20 mb-4" />
                                <p>No sandbox draft selected</p>
                                <p className="text-sm">Select a draft from the sidebar or click the + button to create one.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* "My Assigned Tasks" View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myTasks.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-center text-text-muted py-24 bg-surface rounded-[2rem] border border-border-subtle">
                            <Layout size={48} className="opacity-20 mb-4" />
                            <p className="text-base font-bold text-text-primary">No tasks assigned to you</p>
                            <p className="text-sm">Tasks assigned to you in the Kanban board will appear here.</p>
                        </div>
                    ) : (
                        myTasks.map(t => {
                            const linkedDraft = workspaceItems.find(item => item.linkedTaskId === t.uid);
                            return (
                                <div key={t.uid} className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col justify-between gap-6 hover:border-accent-primary/30 transition-all duration-300">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className={cn(
                                                "text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border",
                                                t.status === 'todo' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                t.status === 'in_progress' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                                t.status === 'in_review' && 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                                                t.status === 'done' && 'bg-green-500/10 text-green-400 border-green-500/20',
                                                t.status === 'blocked' && 'bg-red-500/10 text-red-400 border-red-500/20'
                                            )}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                            
                                            <span className={cn(
                                                "text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border",
                                                t.priority === 'low' && 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                                                t.priority === 'medium' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                                t.priority === 'high' && 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                                                t.priority === 'critical' && 'bg-red-500/10 text-red-400 border-red-500/20'
                                            )}>
                                                {t.priority} priority
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-bold text-text-primary">{t.title}</h4>
                                        {t.description && (
                                            <p className="text-sm text-text-muted line-clamp-2">{t.description}</p>
                                        )}
                                    </div>

                                    <div className="border-t border-border-subtle pt-4 mt-auto flex flex-col gap-4">
                                        {linkedDraft ? (
                                            <div className="flex items-center justify-between bg-surface-elevated p-3 rounded-xl border border-border-subtle">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {linkedDraft.type === 'flowchart' ? (
                                                        <Layout size={16} className="text-accent-primary flex-shrink-0" />
                                                    ) : (
                                                        <FileText size={16} className="text-accent-primary flex-shrink-0" />
                                                    )}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-bold text-text-primary truncate">{linkedDraft.title}</span>
                                                        <span className="text-[10px] uppercase text-text-muted font-mono">{linkedDraft.type} • {linkedDraft.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewDraft(linkedDraft.uid)}
                                                        className="p-2 bg-surface hover:bg-accent-primary/10 text-text-primary hover:text-accent-primary rounded-lg border border-border-subtle transition-all"
                                                        title="View/Edit Draft"
                                                    >
                                                        <ChevronRight size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUnlinkDraft(linkedDraft.uid)}
                                                        className="p-2 bg-surface hover:bg-red-500/10 text-text-muted hover:text-red-400 rounded-lg border border-border-subtle transition-all"
                                                        title="Unlink Draft"
                                                    >
                                                        <Unlink size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                                                {/* Link Existing Dropdown */}
                                                <Select
                                                    placeholder="Link existing draft..."
                                                    className="dark-select w-full sm:w-[220px]"
                                                    dropdownClassName="dark-select-dropdown"
                                                    onChange={(draftId) => handleLinkDraft(t.uid, draftId)}
                                                    value={undefined}
                                                >
                                                    {unlinkedDrafts.map(d => (
                                                        <Option key={d.uid} value={d.uid}>
                                                            <span className="flex items-center gap-1.5 text-xs font-medium">
                                                                {d.type === 'flowchart' ? <Layout size={12} className="inline mr-1" /> : <FileText size={12} className="inline mr-1" />}
                                                                {d.title}
                                                            </span>
                                                        </Option>
                                                    ))}
                                                </Select>

                                                {/* Create & Link buttons */}
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleCreateAndLinkDraft(t, 'document')}
                                                        className="flex-1 sm:flex-initial px-3 py-1.5 bg-surface-elevated hover:bg-accent-primary/20 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-accent-primary border border-border-subtle hover:border-accent-primary/50 rounded-lg transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <FileText size={12} /> + Doc
                                                    </button>
                                                    <button
                                                        onClick={() => handleCreateAndLinkDraft(t, 'flowchart')}
                                                        className="flex-1 sm:flex-initial px-3 py-1.5 bg-surface-elevated hover:bg-accent-primary/20 text-[10px] font-bold uppercase tracking-widest text-text-primary hover:text-accent-primary border border-border-subtle hover:border-accent-primary/50 rounded-lg transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <Layout size={12} /> + Diagram
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* CREATE DRAFT MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Plus size={18} className="text-accent-primary" /> Create Sandbox Draft</span>}
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <div className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-text-muted">Draft Type</label>
                        <div className="flex bg-surface-sunken p-1 rounded-xl border border-border-subtle">
                            <button
                                onClick={() => setNewType('document')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                                    newType === 'document' ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:text-text-primary'
                                )}
                            >
                                <FileText size={14} /> Wiki Document
                            </button>
                            <button
                                onClick={() => setNewType('flowchart')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                                    newType === 'flowchart' ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:text-text-primary'
                                )}
                            >
                                <Layout size={14} /> Flowchart
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-text-muted">Draft Title</label>
                        <Input 
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Payment Gateway Requirements"
                            className="dark-input"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle mt-4">
                        <Button onClick={() => setIsCreateModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button onClick={handleCreateDraft} type="primary" className="dark-btn-primary font-bold">Create Draft</Button>
                    </div>
                </div>
            </Modal>

            {/* SUBMIT FOR REVIEW MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Send size={18} className="text-accent-primary" /> Submit Deliverable for Review</span>}
                open={isSubmitReviewOpen}
                onCancel={() => setIsSubmitReviewOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form
                    form={reviewForm}
                    onFinish={handleSubmitReview}
                    layout="vertical"
                    className="pt-4"
                >
                    <Form.Item
                        name="task"
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Linked Task</span>}
                        rules={[{ required: true, message: 'Please select the task this deliverable satisfies!' }]}
                    >
                        <Select 
                            placeholder="Select task..." 
                            className="dark-select w-full"
                            dropdownClassName="dark-select-dropdown"
                        >
                            {filteredTasks.map(t => (
                                <Option key={t.uid} value={t.uid}>
                                    {t.title} ({t.status})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="reviewer"
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Assign Reviewer</span>}
                        rules={[{ required: true, message: 'Please select a reviewer!' }]}
                    >
                        <Select 
                            placeholder="Choose reviewer..." 
                            className="dark-select w-full"
                            dropdownClassName="dark-select-dropdown"
                        >
                            {projectMembers.map(m => (
                                <Option key={m.uid} value={m.uid}>
                                    @{m.user?.username} ({m.projectRole?.customLabel || 'Member'})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="message"
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Message to Reviewer</span>}
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="Explain what was accomplished in this deliverable..."
                            className="dark-input border-border-subtle"
                        />
                    </Form.Item>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle">
                        <Button onClick={() => setIsSubmitReviewOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={resolving} className="dark-btn-primary font-bold">
                            Submit Request
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectWorkshop;
