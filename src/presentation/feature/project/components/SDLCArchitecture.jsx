import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSprints } from '@domain/useCase/task/useSprints';
import { useKanbanBoard } from '@domain/useCase/task/useKanbanBoard';
import { useCheckpoints } from '@domain/useCase/task/useCheckpoints';
import { useProjectRole } from '@core/hooks/useProjectRole';
import { 
    Compass, CheckCircle2, Circle, Plus, 
    Play, Check, Loader2, Calendar, Target, Clock, Layers, Trash2, FolderPlus
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { Modal, Form, Input, Select, DatePicker, Spin, Button, Tooltip, Popover } from 'antd';
import { toast } from 'react-hot-toast';

const { Option } = Select;
const { RangePicker } = DatePicker;

const STAGES = [
    { key: 'planning', label: 'Planning', color: '#38bdf8', icon: Target },
    { key: 'design', label: 'Designing', color: '#c084fc', icon: Compass },
    { key: 'implementation', label: 'Coding', color: '#fb923c', icon: Layers },
    { key: 'testing', label: 'Testing', color: '#4ade80', icon: Clock },
    { key: 'deployment', label: 'Deploying', color: '#f472b6', icon: CheckCircle2 }
];

// Backend state machine — must stay in sync with task controller
const STATUS_TRANSITIONS = {
    todo:        ['in_progress', 'blocked'],
    in_progress: ['in_review', 'done', 'blocked', 'todo'],
    in_review:   ['done', 'in_progress', 'blocked'],
    done:        ['todo'],
    blocked:     ['todo', 'in_progress'],
};

// BFS to find shortest chain of valid transitions
const findTransitionPath = (from, to) => {
    if (from === to) return [];
    const queue = [[from, []]];
    const visited = new Set([from]);
    while (queue.length > 0) {
        const [current, path] = queue.shift();
        const neighbors = STATUS_TRANSITIONS[current] || [];
        for (const next of neighbors) {
            if (next === to) return [...path, next];
            if (!visited.has(next)) {
                visited.add(next);
                queue.push([next, [...path, next]]);
            }
        }
    }
    return null;
};

export const SDLCArchitecture = ({ project }) => {
    const projectId = project.uid;
    const { 
        canWriteTasks, 
        canWriteSprints,
        canWriteCheckpoints
    } = useProjectRole(project);
    
    const { fetchSprints, sprints, loadingSprints, createSprint, isCreating, startSprint, isStarting, updateSprint, isUpdating } = useSprints(projectId);
    const { createTask, isCreatingTask, transitionTask, isTransitioning } = useKanbanBoard(projectId);
    const { fetchCheckpoints, checkpoints, loadingCheckpoints, createCheckpoint, isCreating: isCreatingCheckpoint, deleteCheckpoint } = useCheckpoints(projectId);

    const [selectedSprintId, setSelectedSprintId] = useState('active');
    
    // SVG Thread Coordinates
    const [threadCoords, setThreadCoords] = useState([]);
    
    // Modals
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [prefilledStage, setPrefilledStage] = useState(null);
    const [selectedCheckpointId, setSelectedCheckpointId] = useState(null);

    const containerRef = useRef(null);
    const [sprintForm] = Form.useForm();
    const [checkpointForm] = Form.useForm();
    const [taskForm] = Form.useForm();

    const nodes = project.architectureDiagram?.nodes || [];

    // Architecture Layer mapping
    const layerLabels = useMemo(() => {
        const map = {};
        nodes.forEach(node => {
            let label = node.data?.label || 'Unnamed';
            if (label === 'New Concept' && node.data?.content?.length > 0) {
                const tb = node.data.content.find(b => b.type === 'paragraph' || b.type === 'header');
                if (tb?.data?.text) label = tb.data.text.replace(/<[^>]*>/g, '');
            }
            map[node.id] = label;
        });
        return map;
    }, [nodes]);

    useEffect(() => {
        if (projectId) {
            fetchSprints();
        }
    }, [projectId]);

    const activeSprint = useMemo(() => (sprints || []).find(s => s.status === 'active'), [sprints]);
    const selectedSprint = useMemo(() => {
        if (!sprints || sprints.length === 0) return null;
        if (selectedSprintId === 'active') return activeSprint || sprints[0];
        return sprints.find(s => s.uid === selectedSprintId) || sprints[0];
    }, [sprints, selectedSprintId, activeSprint]);

    // Fetch checkpoints when selected sprint changes
    useEffect(() => {
        if (projectId && selectedSprint) {
            fetchCheckpoints({ sprint: selectedSprint.uid });
        }
    }, [projectId, selectedSprint]);

    // Group checkpoints and tasks by Stage for the selected Sprint
    const checkpointsByStage = useMemo(() => {
        const map = {};
        STAGES.forEach(s => map[s.key] = { checkpoints: [], doneCount: 0, totalCount: 0, isComplete: false });
        
        if (!checkpoints || !selectedSprint) return map;

        checkpoints.forEach(cp => {
            if (cp.sprint?.uid === selectedSprint.uid && map[cp.stage]) {
                const hasTasks = cp.tasks && cp.tasks.length > 0;
                const allTasksDone = hasTasks && cp.tasks.every(t => t.status === 'done');
                
                // Add complete status locally
                const cpWithStatus = {
                    ...cp,
                    isComplete: allTasksDone
                };
                
                map[cp.stage].checkpoints.push(cpWithStatus);
                map[cp.stage].totalCount++;
                if (allTasksDone) {
                    map[cp.stage].doneCount++;
                }
            }
        });

        // Determine completeness
        STAGES.forEach(s => {
            map[s.key].isComplete = map[s.key].totalCount > 0 && map[s.key].doneCount === map[s.key].totalCount;
        });

        return map;
    }, [checkpoints, selectedSprint]);

    // Calculate dynamic SVG thread coordinates through the squares
    const updateCoordinates = () => {
        if (!containerRef.current || !selectedSprint) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const coords = [];
        STAGES.forEach(stage => {
            const el = containerRef.current.querySelector(`[data-stage-square="${stage.key}"]`);
            if (el) {
                const rect = el.getBoundingClientRect();
                coords.push({
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top
                });
            }
        });
        setThreadCoords(coords);
    };

    useEffect(() => {
        const timeoutId = setTimeout(updateCoordinates, 200);
        window.addEventListener('resize', updateCoordinates);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateCoordinates);
        };
    }, [selectedSprint, checkpointsByStage]);

    const drawPath = (coords) => {
        if (!coords || coords.length < 2) return '';
        let d = `M ${coords[0].x} ${coords[0].y}`;
        for (let i = 0; i < coords.length - 1; i++) {
            const curr = coords[i];
            const next = coords[i + 1];
            // Smooth horizontal curve
            const cpX1 = curr.x + (next.x - curr.x) / 2;
            const cpY1 = curr.y;
            const cpX2 = curr.x + (next.x - curr.x) / 2;
            const cpY2 = next.y;
            d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
        }
        return d;
    };

    const handleStartSprint = async () => {
        if (!selectedSprint) return;
        try {
            await startSprint(selectedSprint.uid);
            toast.success('Sprint started successfully!');
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to start sprint.');
        }
    };

    const handleCompleteSprint = async () => {
        if (!selectedSprint) return;
        try {
            await updateSprint(selectedSprint.uid, { status: 'completed' });
            toast.success('Sprint marked as completed!');
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to complete sprint.');
        }
    };

    const handleCreateSprintSubmit = async (values) => {
        try {
            const sprintData = {
                number: parseInt(values.number),
                goal: values.goal,
                start_date: values.dates ? values.dates[0].format('YYYY-MM-DD') : null,
                end_date: values.dates ? values.dates[1].format('YYYY-MM-DD') : null,
                status: 'planned'
            };
            await createSprint(sprintData);
            toast.success(`Sprint ${values.number} created!`);
            setIsSprintModalOpen(false);
            sprintForm.resetFields();
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to create sprint.');
        }
    };

    // Checkpoint operations
    const handleAddCheckpointClick = (stageKey) => {
        setPrefilledStage(stageKey);
        checkpointForm.setFieldsValue({
            stage: stageKey,
            sprint: selectedSprint?.uid
        });
        setIsCheckpointModalOpen(true);
    };

    const handleCreateCheckpointSubmit = async (values) => {
        try {
            const checkpointData = {
                name: values.name,
                stage: values.stage || prefilledStage,
                sprint: values.sprint || selectedSprint?.uid
            };
            await createCheckpoint(checkpointData);
            toast.success('Checkpoint created successfully!');
            setIsCheckpointModalOpen(false);
            checkpointForm.resetFields();
            fetchCheckpoints({ sprint: selectedSprint?.uid });
        } catch (error) {
            toast.error(error.message || 'Failed to create checkpoint.');
        }
    };

    const handleDeleteCheckpoint = async (checkpointId) => {
        try {
            await deleteCheckpoint(checkpointId);
            toast.success('Checkpoint deleted!');
            fetchCheckpoints({ sprint: selectedSprint?.uid });
        } catch (error) {
            toast.error(error.message || 'Failed to delete checkpoint.');
        }
    };

    // Task operations
    const handleAddTaskClick = (checkpoint) => {
        setPrefilledStage(checkpoint.stage);
        setSelectedCheckpointId(checkpoint.uid);
        taskForm.setFieldsValue({
            checkpoint: checkpoint.uid,
            stage: checkpoint.stage,
            sprint: selectedSprint?.uid
        });
        setIsTaskModalOpen(true);
    };

    const handleCreateTaskSubmit = async (values) => {
        try {
            const taskData = {
                title: values.title,
                description: values.description || '',
                priority: values.priority || 'medium',
                status: 'todo',
                sprint: values.sprint || selectedSprint?.uid,
                task_type: values.task_type || 'general',
                layer_id: values.layer_id || null, 
                stage: values.stage || prefilledStage,
                checkpoint: values.checkpoint || selectedCheckpointId
            };
            await createTask(taskData);
            toast.success('Task added successfully!');
            setIsTaskModalOpen(false);
            taskForm.resetFields();
            fetchCheckpoints({ sprint: selectedSprint?.uid });
            setTimeout(updateCoordinates, 250);
        } catch (error) {
            toast.error(error.message || 'Failed to create task.');
        }
    };

    // Checkpoints available for selection in current stage
    const availableCheckpoints = useMemo(() => {
        if (!checkpoints) return [];
        return checkpoints.filter(cp => cp.stage === prefilledStage);
    }, [checkpoints, prefilledStage]);

    if (loadingSprints || loadingCheckpoints) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spin size="large" />
                <p className="text-text-muted text-sm font-bold tracking-widest uppercase">Rendering SDLC Shape...</p>
            </div>
        );
    }

    const svgPath = drawPath(threadCoords);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Control Header */}
            <div className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 text-accent-primary shrink-0">
                        <Compass size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">SDLC Architecture Flow</h2>
                        <p className="text-sm text-text-muted">SDLC Stages displayed as connected squares with structured Checkpoints.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted font-mono uppercase">Sprint:</span>
                        <Select 
                            value={selectedSprintId} 
                            onChange={setSelectedSprintId} 
                            className="dark-select w-44"
                            dropdownClassName="dark-select-dropdown"
                        >
                            <Option value="active">Active Sprint ({activeSprint ? `S${activeSprint.number}` : 'None'})</Option>
                            {(sprints || []).map(s => (
                                <Option key={s.uid} value={s.uid}>Sprint {s.number} ({s.status})</Option>
                            ))}
                        </Select>
                    </div>

                    {selectedSprint && (
                        <div className="flex items-center gap-2">
                            {selectedSprint.status === 'planned' && canWriteSprints && (
                                <button
                                    onClick={handleStartSprint}
                                    disabled={isStarting}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                                >
                                    <Play size={12} fill="currentColor" /> Start Sprint
                                </button>
                            )}
                            {selectedSprint.status === 'active' && canWriteSprints && (
                                <button
                                    onClick={handleCompleteSprint}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                                >
                                    <Check size={12} className="stroke-[3]" /> Complete
                                </button>
                            )}
                        </div>
                    )}

                    {canWriteSprints && (
                        <button
                            onClick={() => setIsSprintModalOpen(true)}
                            className="px-4 py-2 bg-surface-elevated border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <Plus size={14} /> New Sprint
                        </button>
                    )}
                </div>
            </div>

            {!selectedSprint ? (
                <div className="bento-card p-12 bg-surface rounded-[2rem] border border-border-subtle text-center flex flex-col items-center justify-center min-h-[300px]">
                    <Target size={36} className="text-text-muted mb-4" />
                    <h3 className="text-lg font-bold text-text-primary">No Sprints Defined</h3>
                    <p className="text-text-muted text-sm mb-6">Create your first sprint to initialize the SDLC flow.</p>
                    {canWriteSprints && (
                        <button onClick={() => setIsSprintModalOpen(true)} className="btn-primary px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs">
                            Create Sprint
                        </button>
                    )}
                </div>
            ) : (
                /* Main SDLC Visual Area */
                <div ref={containerRef} className="relative w-full min-h-[520px] bg-surface rounded-[2rem] border border-border-subtle p-8 overflow-x-auto shadow-xl">
                    
                    {/* SVG Connector Overlay */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{ minWidth: '1000px' }}>
                        <defs>
                            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {svgPath && (
                            <>
                                <path
                                    d={svgPath}
                                    fill="none"
                                    stroke={selectedSprint.status === 'completed' ? '#4ade80' : '#38bdf8'}
                                    strokeWidth="6"
                                    strokeOpacity="0.2"
                                    filter="url(#neon-glow)"
                                    className="transition-all duration-700"
                                />
                                <path
                                    d={svgPath}
                                    fill="none"
                                    stroke={selectedSprint.status === 'completed' ? '#4ade80' : '#38bdf8'}
                                    strokeWidth="3"
                                    strokeDasharray={selectedSprint.status === 'active' ? "8 6" : "none"}
                                    className={cn("transition-all duration-700", selectedSprint.status === 'active' && "animate-dash")}
                                    style={{
                                        animation: selectedSprint.status === 'active' ? 'dash 30s linear infinite' : 'none',
                                        strokeLinecap: 'round'
                                    }}
                                />
                            </>
                        )}
                    </svg>

                    {/* The 5 Squares Container */}
                    <div className="flex items-stretch justify-between gap-6 relative z-20 min-w-[1000px] h-full">
                        {STAGES.map((stage, idx) => {
                            const data = checkpointsByStage[stage.key];
                            const StageIcon = stage.icon;

                            return (
                                <div 
                                    key={stage.key}
                                    data-stage-square={stage.key}
                                    className={cn(
                                        "flex-1 min-w-[220px] bento-card bg-surface-elevated/90 backdrop-blur-md border rounded-[2rem] shadow-lg flex flex-col transition-all duration-300 relative group",
                                        data.isComplete && data.totalCount > 0 ? "border-green-500/30" : "border-border-subtle hover:border-accent-primary/40"
                                    )}
                                >
                                    {/* On the Head: Checkpoint Indicator */}
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                                        <Popover
                                            trigger="hover"
                                            overlayClassName="dark-popover"
                                            content={
                                                <div className="text-[10px] font-mono text-center px-2 py-1">
                                                    {data.totalCount === 0 
                                                        ? 'No checkpoints defined.' 
                                                        : `Checkpoints: ${data.doneCount} out of ${data.totalCount} completed.`}
                                                </div>
                                            }
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg bg-surface transition-all duration-500",
                                                data.totalCount === 0 
                                                    ? "border-border-subtle text-text-muted" 
                                                    : data.isComplete
                                                        ? "border-green-500 text-green-400 bg-green-500/10 scale-110"
                                                        : "border-sky-500 text-sky-400 bg-sky-500/10"
                                            )}>
                                                {data.isComplete && data.totalCount > 0 ? (
                                                    <CheckCircle2 size={18} className="stroke-[2.5]" />
                                                ) : data.totalCount > 0 ? (
                                                    <span className="text-[10px] font-bold font-mono">{data.doneCount}/{data.totalCount}</span>
                                                ) : (
                                                    <Circle size={14} className="opacity-30" />
                                                )}
                                            </div>
                                        </Popover>
                                    </div>

                                    {/* Square Content */}
                                    <div className="p-5 pt-8 flex flex-col h-full gap-4">
                                        
                                        {/* Stage Title */}
                                        <div className="text-center flex flex-col items-center gap-2 pb-3 border-b border-border-subtle/50">
                                            <div className="p-2 rounded-xl transition-colors" style={{ backgroundColor: `${stage.color}15`, color: stage.color }}>
                                                <StageIcon size={20} />
                                            </div>
                                            <h3 className="font-bold text-text-primary tracking-wide text-sm">{stage.label}</h3>
                                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Phase 0{idx + 1}</span>
                                        </div>

                                        {/* Checkpoints & Tasks List */}
                                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                                            {data.checkpoints.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-50">
                                                    <Target size={18} className="text-text-muted mb-2 animate-pulse" />
                                                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">No Checkpoints</span>
                                                    <span className="text-[9px] text-text-muted/70 mt-1">Add one to group tasks</span>
                                                </div>
                                            ) : (
                                                data.checkpoints.map(checkpoint => {
                                                    return (
                                                        <div 
                                                            key={checkpoint.uid} 
                                                            className={cn(
                                                                "bg-surface-sunken p-3 rounded-2xl border border-border-subtle/50 flex flex-col gap-2 transition-all group/cp hover:shadow-lg",
                                                                checkpoint.isComplete ? "border-green-500/20 bg-green-500/[0.02]" : "hover:border-accent-primary/30"
                                                            )}
                                                        >
                                                            {/* Checkpoint Header */}
                                                            <div className="flex items-center justify-between gap-2 border-b border-border-subtle/30 pb-1.5">
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    {checkpoint.isComplete ? (
                                                                        <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                                                                    ) : (
                                                                        <Circle size={13} className="text-sky-400 shrink-0 animate-pulse" />
                                                                    )}
                                                                    <span className={cn(
                                                                        "text-xs font-bold truncate tracking-wide",
                                                                        checkpoint.isComplete ? "text-text-muted line-through" : "text-text-primary"
                                                                    )}>
                                                                        {checkpoint.name}
                                                                    </span>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="flex items-center gap-1 opacity-0 group-hover/cp:opacity-100 transition-opacity">
                                                                    {canWriteTasks && (
                                                                        <Tooltip title="Add Task">
                                                                            <button 
                                                                                onClick={() => handleAddTaskClick(checkpoint)}
                                                                                className="p-1 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary rounded-lg transition-colors"
                                                                            >
                                                                                <Plus size={12} className="stroke-[2.5]" />
                                                                            </button>
                                                                        </Tooltip>
                                                                    )}
                                                                    {canWriteCheckpoints && (
                                                                        <Tooltip title="Delete Checkpoint">
                                                                            <button 
                                                                                onClick={() => handleDeleteCheckpoint(checkpoint.uid)}
                                                                                className="p-1 hover:bg-red-500/10 text-text-muted hover:text-red-400 rounded-lg transition-colors"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </Tooltip>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Nested Tasks */}
                                                            <div className="flex flex-col gap-1 pl-1">
                                                                {!checkpoint.tasks || checkpoint.tasks.length === 0 ? (
                                                                    <div className="text-[10px] text-text-muted/60 italic pl-3.5 py-1">
                                                                        No tasks added yet.
                                                                    </div>
                                                                ) : (
                                                                    checkpoint.tasks.map(task => (
                                                                        <div 
                                                                            key={task.uid} 
                                                                            className={cn(
                                                                                "p-1.5 rounded-xl flex flex-col gap-1 transition-all group/task",
                                                                                task.status === 'done' ? 'opacity-70' : ''
                                                                            )}
                                                                        >
                                                                            <div className="flex items-start justify-between gap-2">
                                                                                <div className="flex items-start gap-2 overflow-hidden">
                                                                                    <div 
                                                                                        className={cn(
                                                                                            "mt-0.5 shrink-0 w-3 h-3 rounded-full flex items-center justify-center border",
                                                                                            task.status === 'done' 
                                                                                                ? "bg-green-500 border-green-500 text-black" 
                                                                                                : "border-text-muted/50"
                                                                                        )}
                                                                                    >
                                                                                        {task.status === 'done' && <Check size={8} className="stroke-[4]" />}
                                                                                    </div>
                                                                                    <span className={cn(
                                                                                        "text-[11px] font-medium truncate transition-colors", 
                                                                                        task.status === 'done' ? 'text-text-muted line-through' : 'text-text-secondary group-hover/task:text-text-primary'
                                                                                    )}>
                                                                                        {task.title}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            {/* Optional Architecture Layer Badge */}
                                                                            {task.layerId && layerLabels[task.layerId] && (
                                                                                <div className="pl-5 text-[8px] font-mono text-text-muted flex items-center gap-1">
                                                                                    <Layers size={7} /> {layerLabels[task.layerId]}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Add Checkpoint Button */}
                                        {canWriteCheckpoints && (
                                            <button
                                                onClick={() => handleAddCheckpointClick(stage.key)}
                                                className="w-full mt-auto py-2.5 rounded-xl border border-dashed border-border-subtle/50 hover:border-accent-primary hover:bg-accent-primary/5 text-text-muted hover:text-accent-primary transition-all flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                <FolderPlus size={13} /> Add Checkpoint
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
                .animate-dash {
                    animation: dash 30s linear infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>

            {/* Create Sprint Modal */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Calendar size={18} className="text-accent-primary" /> Create Sprint</span>}
                open={isSprintModalOpen}
                onCancel={() => setIsSprintModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={sprintForm} layout="vertical" onFinish={handleCreateSprintSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="number" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint Number</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input type="number" placeholder="e.g. 1" className="dark-input" />
                    </Form.Item>
                    <Form.Item name="goal" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Goal</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input.TextArea placeholder="Focus of this sprint..." className="dark-input" rows={2} />
                    </Form.Item>
                    <Form.Item name="dates" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Dates</span>}>
                        <RangePicker className="dark-datepicker w-full" dropdownClassName="dark-datepicker-dropdown" />
                    </Form.Item>
                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsSprintModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreating} className="dark-btn-primary">Create Sprint</Button>
                    </div>
                </Form>
            </Modal>

            {/* Create Checkpoint Modal */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><FolderPlus size={18} className="text-accent-primary" /> Create Checkpoint</span>}
                open={isCheckpointModalOpen}
                onCancel={() => setIsCheckpointModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={checkpointForm} layout="vertical" onFinish={handleCreateCheckpointSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="name" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Checkpoint Name</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="e.g. Database Schema, Setup CI/CD..." className="dark-input" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="sprint" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {(sprints || []).map(s => (
                                    <Option key={s.uid} value={s.uid}>Sprint {s.number}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="stage" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">SDLC Stage</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {STAGES.map(s => (
                                    <Option key={s.key} value={s.key}>{s.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsCheckpointModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingCheckpoint} className="dark-btn-primary">Create Checkpoint</Button>
                    </div>
                </Form>
            </Modal>

            {/* Create Task Modal */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Target size={18} className="text-accent-primary" /> Define Checkpoint Task</span>}
                open={isTaskModalOpen}
                onCancel={() => setIsTaskModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={taskForm} layout="vertical" onFinish={handleCreateTaskSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="title" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Title</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="e.g. Design API routes, code landing UI..." className="dark-input" />
                    </Form.Item>
                    <Form.Item name="description" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Description & References</span>}>
                        <Input.TextArea placeholder="Description, specs, reference links..." rows={3} className="dark-input" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="checkpoint" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Parent Checkpoint</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select placeholder="Select checkpoint..." className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {availableCheckpoints.map(cp => (
                                    <Option key={cp.uid} value={cp.uid}>{cp.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="assignee" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Assignee</span>}>
                            <Select placeholder="Choose member..." allowClear className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {(project.members || []).map(m => (
                                    <Option key={m.uid} value={m.uid}>{m.user?.username}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="stage" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">SDLC Stage</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {STAGES.map(s => (
                                    <Option key={s.key} value={s.key}>{s.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="layer_id" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Architecture Layer (Optional)</span>}>
                            <Select allowClear placeholder="Select layer..." className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {nodes.map(n => (
                                    <Option key={n.id} value={n.id}>{layerLabels[n.id]}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="task_type" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Type</span>} initialValue="general">
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="general">General Task</Option>
                                <Option value="document">Documentation</Option>
                                <Option value="flowchart">Flowchart / Diagrams</Option>
                                <Option value="code_commit">Code Commit</Option>
                                <Option value="test_case">Testing Case</Option>
                                <Option value="deployment">Deployment Script</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="priority" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</span>} initialValue="medium">
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                                <Option value="critical">Critical</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item name="sprint" noStyle />
                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsTaskModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingTask} className="dark-btn-primary">Define Task</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default SDLCArchitecture;
