import React, { useState, useEffect } from 'react';
import { Clock, Eye, Check, X, MessageSquare, AlertCircle, ExternalLink, ArrowRight, Loader2, FileText, Layout, User } from 'lucide-react';
import { useReviewRequests } from '@domain/useCase/project/useReviewRequests';
import { useRole } from '@core/hooks/useRole';
import { useProjectRole } from '@core/hooks/useProjectRole';
import { RichTextBlocks } from '@presentation/shared/components/RichTextBlocks';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { Modal, Input, Button, Card, Tag, Tabs } from 'antd';
import { toast } from 'react-hot-toast';
import { cn } from '@core/utils/cn';

const { TextArea } = Input;

export const ProjectReviews = ({ project }) => {
    const { user } = useRole();
    const { isAdmin, isPublisher } = useProjectRole(project);
    const { reviewRequests, loading, resolving, fetchReviewRequests, resolveReviewRequest } = useReviewRequests(project.uid);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchReviewRequests();
    }, [fetchReviewRequests]);

    // Find current member
    const currentMember = project.members?.find(
        m => m.user?.id === user?.id || m.user?.documentId === user?.documentId
    );

    const handleResolve = async (status) => {
        if (!selectedRequest) return;
        
        const success = await resolveReviewRequest(selectedRequest.uid, {
            status,
            feedback
        });

        if (success) {
            setSelectedRequest(null);
            setFeedback('');
            fetchReviewRequests();
        }
    };

    // Filter reviews
    const incomingReviews = reviewRequests.filter(req => {
        // Reviewers assigned, or admins/publishers can see all pending
        const isAssigned = req.reviewer?.id === currentMember?.id || req.reviewerId === currentMember?.uid;
        const isPending = req.status === 'pending';
        return isAssigned || ((isAdmin || isPublisher) && isPending);
    });

    const mySubmissions = reviewRequests.filter(
        req => req.requester?.id === currentMember?.id || req.requesterId === currentMember?.uid
    );

    const allHistory = reviewRequests.filter(
        req => req.status !== 'pending'
    );

    const renderRequestCard = (req) => {
        const isIncoming = req.reviewer?.id === currentMember?.id || req.reviewerId === currentMember?.uid;
        
        return (
            <div 
                key={req.uid}
                onClick={() => setSelectedRequest(req)}
                className="bento-card p-5 bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle hover:border-accent-primary/40 rounded-2xl cursor-pointer transition-all flex flex-col gap-4 animate-in fade-in duration-200"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                            {req.workspaceItem?.type === 'flowchart' ? <Layout size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-text-primary truncate max-w-[200px]">
                                {req.workspaceItem?.title || 'External Commit Deliverable'}
                            </h4>
                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <User size={10} /> by @{req.requester?.user?.username || 'member'}
                            </span>
                        </div>
                    </div>

                    <span className={cn(
                        "text-[9px] uppercase font-mono px-2 py-0.5 rounded border font-bold",
                        req.status === 'pending' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                        req.status === 'approved' && 'bg-green-500/10 text-green-400 border-green-500/20',
                        req.status === 'changes_requested' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                        req.status === 'rejected' && 'bg-red-500/10 text-red-400 border-red-500/20'
                    )}>
                        {req.status?.replace('_', ' ')}
                    </span>
                </div>

                <div className="bg-surface-sunken p-3 rounded-xl border border-border-subtle/50 flex flex-col gap-1.5 text-xs text-text-secondary">
                    <div>
                        <span className="text-[9px] font-mono text-text-muted uppercase block">Linked Task</span>
                        <span className="font-bold text-text-primary">{req.task?.title || '—'}</span>
                    </div>
                    {req.message && (
                        <p className="italic text-text-muted text-[11px] truncate mt-1">
                            "{req.message}"
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-2 border-t border-border-subtle/50">
                    <span>Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                    <span className="text-accent-primary flex items-center gap-1 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        Review <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        );
    };

    const reviewTabs = [
        {
            key: 'incoming',
            label: `Needs My Review (${incomingReviews.length})`,
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incomingReviews.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-text-muted bg-surface-sunken/20 border border-border-subtle border-dashed rounded-[2rem]">
                            <Check size={48} className="mx-auto text-green-500/30 mb-3" />
                            <p className="font-bold text-sm">Inbox Zero!</p>
                            <p className="text-xs">No pending review requests assigned to you or waiting for administrator action.</p>
                        </div>
                    ) : (
                        incomingReviews.map(renderRequestCard)
                    )}
                </div>
            )
        },
        {
            key: 'my_submissions',
            label: `My Submissions (${mySubmissions.length})`,
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mySubmissions.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-text-muted bg-surface-sunken/20 border border-border-subtle border-dashed rounded-[2rem]">
                            <Clock size={48} className="mx-auto text-text-muted/30 mb-3" />
                            <p className="font-bold text-sm">No submissions yet</p>
                            <p className="text-xs">You haven't submitted any deliverables for review from your personal Workshop.</p>
                        </div>
                    ) : (
                        mySubmissions.map(renderRequestCard)
                    )}
                </div>
            )
        },
        {
            key: 'history',
            label: `Closed Reviews (${allHistory.length})`,
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allHistory.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-text-muted bg-surface-sunken/20 border border-border-subtle border-dashed rounded-[2rem]">
                            <p className="text-xs">No closed reviews or historical merge logs found for this project.</p>
                        </div>
                    ) : (
                        allHistory.map(renderRequestCard)
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-6 min-h-[600px] animate-in fade-in duration-300">
            {/* Header Control Panel */}
            <div className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 text-accent-primary">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">Reviews & Merge Board</h2>
                        <p className="text-sm text-text-muted">Review, approve, and merge deliverable wiki docs and flowchart designs.</p>
                    </div>
                </div>
            </div>

            {/* Tabs List */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <Loader2 size={36} className="animate-spin text-accent-primary" />
                </div>
            ) : (
                <div className="bento-card p-8 bg-surface rounded-[2rem] border border-border-subtle flex flex-col gap-4">
                    <Tabs defaultActiveKey="incoming" items={reviewTabs} className="dark-tabs" />
                </div>
            )}

            {/* DETAIL REVIEW OVERLAY MODAL */}
            <Modal
                title={null}
                open={!!selectedRequest}
                onCancel={() => setSelectedRequest(null)}
                footer={null}
                className="dark-modal"
                centered
                width={850}
            >
                {selectedRequest && (
                    <div className="flex flex-col gap-6 pt-4 animate-in fade-in duration-200">
                        {/* Header Details */}
                        <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                                    {selectedRequest.workspaceItem?.type === 'flowchart' ? <Layout size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-text-primary">
                                        {selectedRequest.workspaceItem?.title || 'External Commit Link'}
                                    </h3>
                                    <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                                        Submitted by <span className="text-text-primary">@{selectedRequest.requester?.user?.username}</span> to <span className="text-text-primary">@{selectedRequest.reviewer?.user?.username}</span>
                                    </p>
                                </div>
                            </div>

                            <span className={cn(
                                "text-[10px] uppercase font-mono px-3 py-1 rounded-full border font-bold",
                                selectedRequest.status === 'pending' && 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                                selectedRequest.status === 'approved' && 'bg-green-500/10 text-green-400 border-green-500/20',
                                selectedRequest.status === 'changes_requested' && 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                selectedRequest.status === 'rejected' && 'bg-red-500/10 text-red-400 border-red-500/20'
                            )}>
                                {selectedRequest.status?.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Splitted Contents Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Panel: Task & Submission Details */}
                            <div className="lg:col-span-5 flex flex-col gap-6 bg-surface-sunken/40 border border-border-subtle p-5 rounded-2xl">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2">Linked Task Details</h4>
                                    <div className="p-3 bg-surface border border-border-subtle rounded-xl flex flex-col gap-1">
                                        <span className="text-xs text-text-muted font-mono">Task Title</span>
                                        <span className="text-sm font-bold text-text-primary">{selectedRequest.task?.title}</span>
                                        {selectedRequest.task?.description && (
                                            <p className="text-xs text-text-secondary mt-1 max-h-[80px] overflow-y-auto pr-1">
                                                {selectedRequest.task?.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2">Submitter Message</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed bg-surface border border-border-subtle p-3 rounded-xl min-h-[60px] italic">
                                        {selectedRequest.message ? `"${selectedRequest.message}"` : 'No submitter notes provided.'}
                                    </p>
                                </div>

                                {selectedRequest.feedback && (
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2">Reviewer Feedback</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed bg-surface border border-border-subtle p-3 rounded-xl min-h-[60px] font-bold text-amber-500/80">
                                            "{selectedRequest.feedback}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Right Panel: Deliverable Actual Preview */}
                            <div className="lg:col-span-7 flex flex-col gap-3 min-h-[300px]">
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Deliverable Output Preview</h4>
                                
                                <div className="flex-1 bg-surface border border-border-subtle p-6 rounded-2xl overflow-y-auto max-h-[400px]">
                                    {selectedRequest.workspaceItem ? (
                                        selectedRequest.workspaceItem.type === 'document' ? (
                                            <div className="prose prose-invert max-w-none">
                                                <h1 className="text-xl font-bold mb-4">{selectedRequest.workspaceItem.title}</h1>
                                                {selectedRequest.workspaceItem.content && selectedRequest.workspaceItem.content.length > 0 ? (
                                                    <RichTextBlocks blocks={selectedRequest.workspaceItem.content} />
                                                ) : (
                                                    <p className="text-text-muted italic">This document is empty.</p>
                                                )}
                                            </div>
                                        ) : (
                                            /* Flowchart Previewer inside review dialog */
                                            <div className="relative rounded-xl overflow-hidden border border-border-subtle" style={{ height: '320px' }}>
                                                <FlowPreviewer
                                                    nodes={selectedRequest.workspaceItem.content?.nodes || []}
                                                    edges={selectedRequest.workspaceItem.content?.edges || []}
                                                />
                                            </div>
                                        )
                                    ) : selectedRequest.externalLink ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <ExternalLink size={36} className="text-accent-primary mb-3" />
                                            <span className="text-sm font-bold text-text-primary">External Deliverable Attachment</span>
                                            <p className="text-xs text-text-muted mt-1 max-w-[280px]">This task was completed by contributing code changes at this repository link.</p>
                                            <a 
                                                href={selectedRequest.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-accent-primary"
                                            >
                                                Visit Link <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-text-muted italic text-center py-8">No deliverable preview available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions overlay for assigned reviewer/admin/publisher */}
                        {selectedRequest.status === 'pending' && (
                            <div className="flex flex-col gap-4 border-t border-border-subtle pt-6 mt-2 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Review Feedback & Comments</label>
                                    <TextArea 
                                        rows={2}
                                        placeholder="Add notes, requirements to fix, or positive feedback here..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="dark-input border-border-subtle"
                                    />
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button 
                                        onClick={() => handleResolve('changes_requested')}
                                        disabled={resolving}
                                        className="px-5 py-2.5 border border-status-warning/40 hover:border-status-warning hover:bg-status-warning/5 text-status-warning rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5"
                                    >
                                        <MessageSquare size={12} /> Request Changes
                                    </button>
                                    <button 
                                        onClick={() => handleResolve('approved')}
                                        disabled={resolving}
                                        className="px-5 py-2.5 bg-accent-primary text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-accent-primary/20"
                                    >
                                        <Check size={12} /> Approve & Merge
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProjectReviews;
