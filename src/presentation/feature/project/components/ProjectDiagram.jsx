import React, { useState, useEffect } from 'react';
import { Layout, Edit3, Eye, Save, RotateCcw, Loader2, Info } from 'lucide-react';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { useUpdateProject } from '@domain/useCase/project/useUpdateProject';
import { toast } from 'react-hot-toast';
import { ConfirmationModal } from '@presentation/shared/components/modals/ConfirmationModal';

export const ProjectDiagram = ({ project }) => {
    const { updateProject, isUpdating } = useUpdateProject(project.uid);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Confirmation Popup Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "warning",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
        onConfirm: null
    });

    useEffect(() => {
        if (project?.architectureDiagram && typeof project.architectureDiagram === 'object') {
            setNodes(project.architectureDiagram.nodes || []);
            setEdges(project.architectureDiagram.edges || []);
        } else {
            // Default Initial Architecture Diagram
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

            setNodes(defaultNodes);
            setEdges(defaultEdges);
        }
    }, [project]);

    const handleSaveDiagram = async (flowData) => {
        try {
            const success = await updateProject({ architecture_diagram: flowData });
            if (success) {
                setNodes(flowData.nodes);
                setEdges(flowData.edges);
                toast.success('Architecture diagram saved successfully!');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save diagram.');
        }
    };

    const handleResetDiagram = () => {
        setConfirmModal({
            isOpen: true,
            title: "Revert Diagram",
            message: "Are you sure you want to revert all changes to the last saved state? Your current workspace modifications will be lost.",
            type: "warning",
            confirmLabel: "Revert Changes",
            cancelLabel: "Abort",
            onConfirm: () => {
                if (project?.architectureDiagram && typeof project.architectureDiagram === 'object') {
                    setNodes(project.architectureDiagram.nodes || []);
                    setEdges(project.architectureDiagram.edges || []);
                } else {
                    setNodes([]);
                    setEdges([]);
                }
                toast.success('Reverted to last saved state.');
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    return (
        <div className="flex flex-col gap-6 min-h-[600px] animate-in fade-in duration-300">
            {/* Header Control Panel */}
            <div className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 text-accent-primary">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">System Architecture & Diagrams</h2>
                        <p className="text-sm text-text-muted">Design and document visual architectural blocks for your system.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                    {/* Mode Toggle Button */}
                    <div className="flex bg-surface-sunken p-1 rounded-xl border border-border-subtle">
                        <button
                            onClick={() => setIsEditing(false)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                                !isEditing 
                                    ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' 
                                    : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            <Eye size={14} /> Preview
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                                isEditing 
                                    ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' 
                                    : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            <Edit3 size={14} /> Designer
                        </button>
                    </div>

                    {isEditing && (
                        <button
                            onClick={handleResetDiagram}
                            disabled={isUpdating}
                            className="p-3 border border-border-subtle hover:border-status-error/50 hover:bg-status-error/5 text-text-muted hover:text-status-error rounded-xl transition-all"
                            title="Revert to last saved diagram"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Visual Workspace */}
            <div className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle relative flex-1 min-h-[600px] flex flex-col gap-4">
                {isUpdating && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-[2rem] flex items-center justify-center z-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={36} className="animate-spin text-accent-primary" />
                            <p className="text-sm font-bold text-accent-primary">Syncing architecture to cloud...</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-2 bg-surface-sunken/50 border border-border-subtle p-4 rounded-2xl text-xs text-text-muted">
                    <Info size={16} className="text-accent-primary shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-text-primary">Architecture Diagram Instructions:</span> Use custom shapes, connect items smoothly to represent dependency flows, and double-click / select blocks to configure design colors, text metadata, and line stroke details in the side drawer. Always remember to click <span className="font-bold text-accent-primary">Save Chart</span> at the top of the canvas to commit database changes.
                    </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-border-subtle" style={{ height: '600px' }}>
                    {isEditing ? (
                        <FlowBuilder
                            initialNodes={nodes}
                            initialEdges={edges}
                            onSave={handleSaveDiagram}
                            readOnly={false}
                        />
                    ) : (
                        <FlowPreviewer
                            nodes={nodes}
                            edges={edges}
                        />
                    )}
                </div>
            </div>

            {/* Confirmation Dialog Popup */}
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmLabel={confirmModal.confirmLabel}
                cancelLabel={confirmModal.cancelLabel}
                type={confirmModal.type}
            />
        </div>
    );
};

export default ProjectDiagram;
