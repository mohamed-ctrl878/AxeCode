import React, { useEffect, useState, useMemo } from 'react';
import { useSprints } from '@domain/useCase/task/useSprints';
import { useKanbanBoard } from '@domain/useCase/task/useKanbanBoard';
import { useCheckpoints } from '@domain/useCase/task/useCheckpoints';
import { useProjectRole } from '@core/hooks/useProjectRole';
import { useWorkspace } from '@domain/useCase/project/useWorkspace';
import { useReviewRequests } from '@domain/useCase/project/useReviewRequests';
import { useRole } from '@core/hooks/useRole';
import { 
    Target, ChevronRight, ChevronDown, CheckCircle2, Circle, Clock, 
    FileText, GitBranch, Play, Rocket, Compass, Layers, Plus, Search,
    X, ExternalLink, User, AlertCircle, Filter, Loader2, Calendar, Check, Send
} from 'lucide-react';

import { cn } from '@core/utils/cn';
import { Select, Input, Spin, Modal, Form, Button, Tag, Empty, DatePicker } from 'antd';
import { toast } from 'react-hot-toast';

const { Option } = Select;
const { RangePicker } = DatePicker;

const STAGES = [
    { key: 'planning', label: 'Planning' },
    { key: 'design', label: 'Design' },
    { key: 'implementation', label: 'Coding' },
    { key: 'testing', label: 'Testing' },
    { key: 'deployment', label: 'Deployment' }
];

const TASK_TYPE_CONFIG = {
    general:     { label: 'General',      icon: Circle,     color: 'text-text-muted',   bg: 'bg-surface-sunken',    border: 'border-border-subtle' },
    document:    { label: 'Document',     icon: FileText,   color: 'text-blue-400',     bg: 'bg-blue-500/10',       border: 'border-blue-500/20' },
    flowchart:   { label: 'Flowchart',    icon: Compass,    color: 'text-purple-400',   bg: 'bg-purple-500/10',     border: 'border-purple-500/20' },
    code_commit: { label: 'Code Commit',  icon: GitBranch,  color: 'text-orange-400',   bg: 'bg-orange-500/10',     border: 'border-orange-500/20' },
    test_case:   { label: 'Test Case',    icon: Play,       color: 'text-green-400',    bg: 'bg-green-500/10',      border: 'border-green-500/20' },
    deployment:  { label: 'Deployment',   icon: Rocket,     color: 'text-pink-400',     bg: 'bg-pink-500/10',       border: 'border-pink-500/20' }
};

const PRIORITY_CONFIG = {
    low:      { label: 'Low',      color: '#4ade80' },
    medium:   { label: 'Medium',   color: '#38bdf8' },
    high:     { label: 'High',     color: '#fb923c' },
    critical: { label: 'Critical', color: '#f87171' }
};

const STATUS_CONFIG = {
    todo:        { label: 'To Do',       color: '#64748b' },
    in_progress: { label: 'In Progress', color: '#fb923c' },
    in_review:   { label: 'In Review',   color: '#c084fc' },
    done:        { label: 'Done',        color: '#4ade80' },
    blocked:     { label: 'Blocked',     color: '#f87171' }
};

// Backend state machine — must stay in sync with task controller
const STATUS_TRANSITIONS = {
    todo:        ['in_progress', 'blocked'],
    in_progress: ['in_review', 'done', 'blocked', 'todo'],
    in_review:   ['done', 'in_progress', 'blocked'],
    done:        ['todo'],
    blocked:     ['todo', 'in_progress'],
};

export const MissionsRepo = ({ project }) => {
    const projectId = project.uid;
    const { 
        isPublisher, 
        canWriteTasks, 
        canWriteSprints 
    } = useProjectRole(project);
    
    const { fetchSprints, sprints, loadingSprints, createSprint, isCreating, startSprint, isStarting, updateSprint, isUpdating } = useSprints(projectId);
    const { fetchTasks, tasks, loadingTasks, createTask, isCreatingTask, transitionTask, isTransitioning } = useKanbanBoard(projectId);
    const { fetchCheckpoints, checkpoints, loadingCheckpoints } = useCheckpoints(projectId);

    const { user } = useRole();
    const { workspaceItems, fetchWorkspace } = useWorkspace(projectId);
    const { createReviewRequest, resolving: resolvingReview } = useReviewRequests(projectId);

    const nodes = project.architectureDiagram?.nodes || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStage, setFilterStage] = useState('all');
    const [filterSprint, setFilterSprint] = useState('all');

    // Expanded states
    const [expandedSprints, setExpandedSprints] = useState({});
    const [expandedCheckpoints, setExpandedCheckpoints] = useState({});

    // Modals
    const [previewTask, setPreviewTask] = useState(null);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    const [addTaskContext, setAddTaskContext] = useState({ sprintId: null, layerId: null, stage: null });

    // Fetch workspace items when previewing a task (for deliverable linking)
    useEffect(() => {
        if (previewTask) {
            fetchWorkspace();
        }
    }, [previewTask, fetchWorkspace]);

    const handleSubmitReview = async (values) => {
        if (!previewTask) return;
        const payload = {
            task: previewTask.uid,
            reviewer: values.reviewer,
            workspace_item: values.deliverableType === 'sandbox_draft' ? values.workspaceItem : null,
            external_link: values.deliverableType === 'external_link' ? values.externalLink : '',
            message: values.message || ''
        };

        const result = await createReviewRequest(payload);
        if (result) {
            setPreviewTask(null);
            fetchTasks();
        }
    };
    
    const [sprintForm] = Form.useForm();
    const [taskForm] = Form.useForm();

    const selectedFormSprint = Form.useWatch('sprint', taskForm);
    const selectedFormStage = Form.useWatch('stage', taskForm);

    const availableCheckpoints = useMemo(() => {
        if (!checkpoints) return [];
        return checkpoints.filter(cp => {
            const matchesSprint = !selectedFormSprint || cp.sprint?.uid === selectedFormSprint;
            const matchesStage = !selectedFormStage || cp.stage === selectedFormStage;
            return matchesSprint && matchesStage;
        });
    }, [checkpoints, selectedFormSprint, selectedFormStage]);

    useEffect(() => {
        const currentCheckpoint = taskForm.getFieldValue('checkpoint');
        if (currentCheckpoint && !availableCheckpoints.some(cp => cp.uid === currentCheckpoint)) {
            taskForm.setFieldsValue({ checkpoint: undefined });
        }
    }, [selectedFormSprint, selectedFormStage, availableCheckpoints, taskForm]);

    useEffect(() => {
        if (projectId) {
            fetchSprints();
            fetchTasks();
            fetchCheckpoints();
        }
    }, [projectId]);

    // Auto-expand active sprint
    useEffect(() => {
        if (sprints && sprints.length > 0) {
            const active = sprints.find(s => s.status === 'active');
            if (active) {
                setExpandedSprints(prev => ({ ...prev, [active.uid]: true }));
            }
        }
    }, [sprints]);

    // Layer labels map
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

    // Nested tree data logic
    const nestedData = useMemo(() => {
        if (!sprints || !tasks) return [];

        return (sprints || [])
            .filter(s => filterSprint === 'all' || s.uid === filterSprint)
            .map(sprint => {
                const sprintTasks = tasks.filter(t => t.sprint?.uid === sprint.uid);
                const checkpointMap = {};

                sprintTasks.forEach(t => {
                    if (!t.layerId || !t.stage) return;

                    // Apply filters
                    if (filterType !== 'all' && t.taskType !== filterType) return;
                    if (filterStage !== 'all' && t.stage !== filterStage) return;
                    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

                    const cpKey = `${t.layerId}_${t.stage}`;
                    if (!checkpointMap[cpKey]) {
                        checkpointMap[cpKey] = {
                            key: cpKey,
                            layerId: t.layerId,
                            layerLabel: layerLabels[t.layerId] || t.layerId,
                            stage: t.stage,
                            stageLabel: STAGES.find(s => s.key === t.stage)?.label || t.stage,
                            tasks: []
                        };
                    }
                    checkpointMap[cpKey].tasks.push(t);
                });

                const checkpoints = Object.values(checkpointMap);

                const unlinkedTasks = sprintTasks.filter(t => {
                    if (t.layerId && t.stage) return false;
                    if (filterType !== 'all' && t.taskType !== filterType) return false;
                    if (filterStage !== 'all') return false;
                    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                });

                return {
                    sprint,
                    checkpoints,
                    unlinkedTasks,
                    totalTasks: checkpoints.reduce((sum, cp) => sum + cp.tasks.length, 0) + unlinkedTasks.length,
                    doneTasks: checkpoints.reduce((sum, cp) => sum + cp.tasks.filter(t => t.status === 'done').length, 0) + unlinkedTasks.filter(t => t.status === 'done').length
                };
            })
            .filter(s => s.totalTasks > 0 || filterSprint !== 'all');
    }, [sprints, tasks, filterType, filterStage, filterSprint, searchQuery, layerLabels]);

    const toggleSprint = (uid) => setExpandedSprints(prev => ({ ...prev, [uid]: !prev[uid] }));
    const toggleCheckpoint = (key) => setExpandedCheckpoints(prev => ({ ...prev, [key]: !prev[key] }));

    // Removed old canEdit calculation, replaced by canWriteTasks from useProjectRole
    const canEdit = canWriteTasks;


    const handleToggleTaskStatus = async (task, newStatus) => {
        try {
            const allowed = STATUS_TRANSITIONS[task.status] || [];
            if (allowed.includes(newStatus)) {
                // Direct transition is valid
                await transitionTask(task.uid, newStatus);
            } else {
                // Need to chain through intermediate states
                // e.g. todo→done  =  todo→in_progress, then in_progress→done
                const path = findTransitionPath(task.status, newStatus);
                if (!path || path.length === 0) {
                    toast.error(`Cannot transition from ${STATUS_CONFIG[task.status]?.label} to ${STATUS_CONFIG[newStatus]?.label}`);
                    return;
                }
                for (const step of path) {
                    await transitionTask(task.uid, step);
                }
            }
            toast.success(`Task status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
            fetchTasks();
            fetchCheckpoints();
            if (previewTask && previewTask.uid === task.uid) {
                setPreviewTask(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update task status.');
        }
    };

    // BFS to find shortest chain of valid transitions between two statuses
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
        return null; // no path found
    };

    const handleOpenAddTask = (sprintId, layerId, stage) => {
        setAddTaskContext({ sprintId, layerId, stage });
        taskForm.resetFields();

        let matchedCheckpointId = undefined;
        if (sprintId && stage && checkpoints) {
            const match = checkpoints.find(cp => cp.sprint?.uid === sprintId && cp.stage === stage);
            if (match) matchedCheckpointId = match.uid;
        }

        taskForm.setFieldsValue({
            sprint: sprintId,
            layer_id: layerId,
            stage: stage,
            checkpoint: matchedCheckpointId
        });
        setIsTaskModalOpen(true);
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
            toast.success(`Sprint ${values.number} created successfully!`);
            setIsSprintModalOpen(false);
            sprintForm.resetFields();
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to create sprint.');
        }
    };

    const handleStartSprint = async (sprintId, e) => {
        e.stopPropagation();
        try {
            await startSprint(sprintId);
            toast.success('Sprint started!');
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to start sprint.');
        }
    };

    const handleCompleteSprint = async (sprintId, e) => {
        e.stopPropagation();
        try {
            await updateSprint(sprintId, { status: 'completed' });
            toast.success('Sprint marked completed!');
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to complete sprint.');
        }
    };

    const handleAddTaskSubmit = async (values) => {
        try {
            await createTask({
                title: values.title,
                description: values.description || '',
                priority: values.priority || 'medium',
                status: 'todo',
                sprint: values.sprint || addTaskContext.sprintId,
                task_type: values.task_type || 'general',
                layer_id: values.layer_id || addTaskContext.layerId,
                stage: values.stage || addTaskContext.stage,
                assignee: values.assignee || null,
                checkpoint: values.checkpoint || null
            });
            toast.success('Task created successfully!');
            setIsTaskModalOpen(false);
            fetchTasks();
            fetchCheckpoints();
        } catch (err) {
            toast.error(err.message || 'Failed to create task.');
        }
    };

    const hasFilters = filterType !== 'all' || filterStage !== 'all' || filterSprint !== 'all' || searchQuery;

    if (loadingSprints || loadingTasks) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spin size="large" />
                <p className="text-text-muted text-sm font-bold tracking-widest uppercase">Loading Missions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bento-card p-6 bg-surface rounded-[2rem] border border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 text-accent-primary shrink-0">
                        <Target size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">Missions Repository</h2>
                        <p className="text-sm text-text-muted">Central directory for defining and managing sprints, checkpoints, and task assignments.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {canWriteSprints && (
                        <button
                            onClick={() => setIsSprintModalOpen(true)}
                            className="px-4 py-2 bg-surface-elevated border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <Calendar size={14} /> New Sprint
                        </button>
                    )}
                    {canWriteTasks && (
                        <button
                            onClick={() => handleOpenAddTask(null, null, null)}
                            className="px-4 py-2 bg-accent-primary hover:bg-accent-hover text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                        >
                            <Plus size={14} /> New Task
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bento-card p-5 bg-surface rounded-3xl border border-border-subtle flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
                    <Search size={16} className="text-text-muted shrink-0" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="dark-input flex-1"
                        allowClear
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <Select value={filterSprint} onChange={setFilterSprint} className="dark-select w-40" dropdownClassName="dark-select-dropdown">
                        <Option value="all">All Sprints</Option>
                        {(sprints || []).map(s => (
                            <Option key={s.uid} value={s.uid}>Sprint {s.number}{s.status === 'active' ? ' ●' : ''}</Option>
                        ))}
                    </Select>

                    <Select value={filterStage} onChange={setFilterStage} className="dark-select w-36" dropdownClassName="dark-select-dropdown">
                        <Option value="all">All Stages</Option>
                        {STAGES.map(s => <Option key={s.key} value={s.key}>{s.label}</Option>)}
                    </Select>

                    <Select value={filterType} onChange={setFilterType} className="dark-select w-40" dropdownClassName="dark-select-dropdown">
                        <Option value="all">All Types</Option>
                        {Object.entries(TASK_TYPE_CONFIG).map(([k, v]) => (
                            <Option key={k} value={k}>{v.label}</Option>
                        ))}
                    </Select>

                    {hasFilters && (
                        <button
                            onClick={() => { setSearchQuery(''); setFilterType('all'); setFilterStage('all'); setFilterSprint('all'); }}
                            className="text-xs font-bold text-accent-primary hover:text-accent-hover transition-colors flex items-center gap-1"
                        >
                            <X size={12} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Nested Tree */}
            <div className="bento-card bg-surface rounded-[2rem] border border-border-subtle overflow-hidden">
                {nestedData.length === 0 ? (
                    <div className="p-16 text-center">
                        <Empty description={<span className="text-text-muted">No missions found matching filters.</span>} />
                    </div>
                ) : (
                    <div className="divide-y divide-border-subtle/50">
                        {nestedData.map(({ sprint, checkpoints, unlinkedTasks, totalTasks, doneTasks }) => {
                            const isExpanded = expandedSprints[sprint.uid];
                            const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                            return (
                                <div key={sprint.uid}>
                                    {/* Sprint Row */}
                                    <div
                                        onClick={() => toggleSprint(sprint.uid)}
                                        className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer hover:bg-surface-elevated/50 transition-colors flex-wrap"
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                                            <div className={cn("transition-transform duration-200", isExpanded && "rotate-90")}>
                                                <ChevronRight size={18} className="text-text-muted" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                                    sprint.status === 'active'
                                                        ? "bg-green-500/10 border-green-500/30"
                                                        : "bg-surface-elevated border-border-subtle"
                                                )}>
                                                    <Target size={18} className={sprint.status === 'active' ? 'text-green-400' : 'text-text-muted'} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-primary text-sm flex items-center gap-2">
                                                        Sprint {sprint.number}
                                                        {sprint.status === 'active' && (
                                                            <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-mono uppercase">Active</span>
                                                        )}
                                                        {sprint.status === 'completed' && (
                                                            <span className="px-2 py-0.5 rounded-md bg-surface-sunken text-text-muted text-[10px] font-mono uppercase">Completed</span>
                                                        )}
                                                    </div>
                                                    {sprint.goal && (
                                                        <div className="text-xs text-text-muted mt-0.5">{sprint.goal}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0 flex-wrap">
                                            {/* Start/Complete Actions */}
                                            {sprint.status === 'planned' && canWriteSprints && (
                                                <button
                                                    onClick={(e) => handleStartSprint(sprint.uid, e)}
                                                    disabled={isStarting}
                                                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                                                >
                                                    Start Sprint
                                                </button>
                                            )}
                                            {sprint.status === 'active' && canWriteSprints && (
                                                <button
                                                    onClick={(e) => handleCompleteSprint(sprint.uid, e)}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 bg-accent-primary hover:bg-accent-hover text-black font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                                                >
                                                    Complete Sprint
                                                </button>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="flex items-center gap-2 w-28 md:w-32">
                                                <div className="flex-1 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-accent-primary to-green-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-mono text-text-muted w-8 text-right">{progress}%</span>
                                            </div>

                                            <span className="text-xs font-mono text-text-muted">
                                                {doneTasks}/{totalTasks}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Sprint Content */}
                                    {isExpanded && (
                                        <div className="bg-surface-sunken/30 border-t border-border-subtle/50">
                                            {checkpoints.map(cp => {
                                                const cpKey = `${sprint.uid}_${cp.key}`;
                                                const cpExpanded = expandedCheckpoints[cpKey];
                                                const cpDone = cp.tasks.filter(t => t.status === 'done').length;
                                                const cpComplete = cpDone === cp.tasks.length;

                                                return (
                                                    <div key={cp.key}>
                                                        {/* Checkpoint Row */}
                                                        <div
                                                            onClick={() => toggleCheckpoint(cpKey)}
                                                            className="flex items-center gap-4 pl-14 pr-6 py-4 cursor-pointer hover:bg-surface-elevated/30 transition-colors"
                                                        >
                                                            <div className={cn("transition-transform duration-200", cpExpanded && "rotate-90")}>
                                                                <ChevronRight size={14} className="text-text-muted" />
                                                            </div>
                                                            <div className={cn(
                                                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border",
                                                                cpComplete 
                                                                    ? "bg-green-500/10 border-green-500/30"
                                                                    : "bg-amber-500/10 border-amber-500/30"
                                                            )}>
                                                                {cpComplete 
                                                                    ? <CheckCircle2 size={14} className="text-green-400" />
                                                                    : <Clock size={14} className="text-amber-400" />
                                                                }
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-text-primary flex items-center gap-2 flex-wrap">
                                                                    <span>{cp.layerLabel}</span>
                                                                    <span className="text-text-muted/50">·</span>
                                                                    <span className="text-xs font-mono text-accent-primary uppercase">{cp.stageLabel}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase",
                                                                    cpComplete ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                                                                )}>
                                                                    {cpDone}/{cp.tasks.length}
                                                                </span>
                                                                {canWriteTasks && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleOpenAddTask(sprint.uid, cp.layerId, cp.stage); }}
                                                                        className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-accent-primary transition-all"
                                                                        title="Add task to this checkpoint"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Tasks */}
                                                        {cpExpanded && (
                                                            <div className="pl-24 pr-6 pb-2">
                                                                {cp.tasks.map(task => (
                                                                    <TaskRow 
                                                                        key={task.uid} 
                                                                        task={task} 
                                                                        onPreview={() => setPreviewTask(task)} 
                                                                        onToggleStatus={handleToggleTaskStatus}
                                                                        canEdit={canEdit}
                                                                        isTransitioning={isTransitioning}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Unlinked Tasks */}
                                            {unlinkedTasks.length > 0 && (
                                                <div className="pl-14 pr-6 py-3">
                                                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Unlinked Tasks</div>
                                                    {unlinkedTasks.map(task => (
                                                        <TaskRow 
                                                            key={task.uid} 
                                                            task={task} 
                                                            onPreview={() => setPreviewTask(task)} 
                                                            onToggleStatus={handleToggleTaskStatus}
                                                            canEdit={canEdit}
                                                            isTransitioning={isTransitioning}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Task Preview Modal */}
            <Modal
                title={null}
                open={!!previewTask}
                onCancel={() => setPreviewTask(null)}
                footer={null}
                className="dark-modal"
                centered
                width={520}
            >
                {previewTask && (
                    <TaskPreviewContent 
                        task={previewTask} 
                        layerLabels={layerLabels} 
                        onToggleStatus={handleToggleTaskStatus}
                        canEdit={canEdit}
                        isTransitioning={isTransitioning}
                        project={project}
                        user={user}
                        workspaceItems={workspaceItems}
                        onSubmitReview={handleSubmitReview}
                        resolving={resolvingReview}
                    />
                )}
            </Modal>

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

            {/* Add/Define Task Modal */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Plus size={18} className="text-accent-primary" /> Add Mission</span>}
                open={isTaskModalOpen}
                onCancel={() => setIsTaskModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={taskForm} layout="vertical" onFinish={handleAddTaskSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="title" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Title</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Task title..." className="dark-input" />
                    </Form.Item>
                    <Form.Item name="description" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Details / Link</span>}>
                        <Input.TextArea rows={3} placeholder="Description or reference link..." className="dark-input" />
                    </Form.Item>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="sprint" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select placeholder="Select sprint..." className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {(sprints || []).map(s => (
                                    <Option key={s.uid} value={s.uid}>Sprint {s.number}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="stage" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">SDLC Stage</span>} rules={[{ required: true, message: 'Required' }]}>
                            <Select placeholder="Select stage..." className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {STAGES.map(s => (
                                    <Option key={s.key} value={s.key}>{s.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

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
                        <Form.Item name="layer_id" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Architecture Layer (Optional)</span>}>
                            <Select allowClear placeholder="General" className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {nodes.map(n => (
                                    <Option key={n.id} value={n.id}>{layerLabels[n.id]}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="task_type" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Type</span>} initialValue="general" rules={[{ required: true, message: 'Required' }]}>
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {Object.entries(TASK_TYPE_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="priority" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</span>} initialValue="medium" rules={[{ required: true, message: 'Required' }]}>
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <Option key={k} value={k}>{v.label}</Option>)}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsTaskModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingTask} className="dark-btn-primary">Create Mission</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

// --- Task Row Sub-component ---
const TaskRow = ({ task, onPreview, onToggleStatus, canEdit, isTransitioning }) => {
    const typeConfig = TASK_TYPE_CONFIG[task.taskType] || TASK_TYPE_CONFIG.general;
    const Icon = typeConfig.icon;
    const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
    const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        if (isTransitioning) return;
        // done → todo (reopen) is a direct valid transition
        // any other status → done will be auto-chained by handleToggleTaskStatus
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        onToggleStatus(task, newStatus);
    };

    return (
        <div
            onClick={onPreview}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-elevated/50 cursor-pointer transition-all group mb-1"
        >
            {canEdit && (
                <button
                    onClick={handleCheckboxClick}
                    disabled={isTransitioning}
                    className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer mr-0.5",
                        task.status === 'done'
                            ? "bg-green-500 border-green-500 text-black hover:bg-green-600 hover:border-green-600"
                            : "border-border-subtle hover:border-accent-primary bg-surface-elevated/20"
                    )}
                >
                    {task.status === 'done' ? (
                        <Check size={12} className="stroke-[3]" />
                    ) : (
                        <div className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 bg-accent-primary transition-opacity" />
                    )}
                </button>
            )}

            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border", typeConfig.bg, typeConfig.border)}>
                <Icon size={12} className={typeConfig.color} />
            </div>

            <div className="flex-1 min-w-0">
                <div className={cn(
                    "text-sm font-medium truncate transition-colors",
                    task.status === 'done' ? "text-text-muted line-through" : "text-text-primary"
                )}>
                    {task.title}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono" style={{ color: statusCfg.color, backgroundColor: `${statusCfg.color}15`, border: `1px solid ${statusCfg.color}30` }}>
                    {statusCfg.label}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityCfg.color }} title={priorityCfg.label} />
            </div>
        </div>
    );
};

// --- Task Preview Content ---
const TaskPreviewContent = ({ 
    task, 
    layerLabels, 
    onToggleStatus, 
    canEdit, 
    isTransitioning,
    project,
    user,
    workspaceItems = [],
    onSubmitReview,
    resolving
}) => {
    const typeConfig = TASK_TYPE_CONFIG[task.taskType] || TASK_TYPE_CONFIG.general;
    const Icon = typeConfig.icon;
    const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
    const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const stageLabel = STAGES.find(s => s.key === task.stage)?.label || task.stage || '—';
    const layerLabel = layerLabels[task.layerId] || task.layerId || '—';

    const urls = task.description?.match(/(https?:\/\/[^\s]+)/g) || [];

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [deliverableType, setDeliverableType] = useState('sandbox_draft');

    return (
        <div className="flex flex-col gap-5 pt-2 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", typeConfig.bg, typeConfig.border)}>
                    <Icon size={20} className={typeConfig.color} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary leading-tight">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {canEdit ? (
                            <Select
                                value={task.status}
                                loading={isTransitioning}
                                disabled={isTransitioning}
                                onChange={(newStatus) => onToggleStatus(task, newStatus)}
                                className="dark-select min-w-[120px] h-6 text-[10px] font-bold"
                                dropdownClassName="dark-select-dropdown"
                                size="small"
                            >
                                {/* Current status (always shown) */}
                                <Option key={task.status} value={task.status}>
                                    <span style={{ color: STATUS_CONFIG[task.status]?.color }} className="mr-1">●</span>
                                    <span className="text-[10px] font-bold uppercase" style={{ color: STATUS_CONFIG[task.status]?.color }}>{STATUS_CONFIG[task.status]?.label}</span>
                                </Option>
                                {/* Only allowed transitions */}
                                {(STATUS_TRANSITIONS[task.status] || []).map(key => {
                                    const cfg = STATUS_CONFIG[key];
                                    if (!cfg) return null;
                                    return (
                                        <Option key={key} value={key}>
                                            <span style={{ color: cfg.color }} className="mr-1">●</span>
                                            <span className="text-[10px] font-bold uppercase" style={{ color: cfg.color }}>{cfg.label}</span>
                                        </Option>
                                    );
                                })}
                            </Select>
                        ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" style={{ color: statusCfg.color, backgroundColor: `${statusCfg.color}15`, border: `1px solid ${statusCfg.color}30` }}>
                                {statusCfg.label}
                            </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" style={{ color: priorityCfg.color, backgroundColor: `${priorityCfg.color}15`, border: `1px solid ${priorityCfg.color}30` }}>
                            {priorityCfg.label}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border", typeConfig.bg, typeConfig.border, typeConfig.color)}>
                            {typeConfig.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-surface-sunken/50 rounded-2xl border border-border-subtle/50">
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Sprint</div>
                    <div className="text-sm font-bold text-text-primary">Sprint {task.sprint?.number || '—'}</div>
                </div>
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Parent Checkpoint</div>
                    <div className="text-sm font-bold text-text-primary">{task.checkpoint?.name || '—'}</div>
                </div>
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Layer</div>
                    <div className="text-sm font-bold text-text-primary flex items-center gap-1">
                        <Layers size={12} className="text-accent-primary" /> {layerLabel}
                    </div>
                </div>
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Stage</div>
                    <div className="text-sm font-bold text-text-primary">{stageLabel}</div>
                </div>
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Task Type</div>
                    <div className="text-sm font-bold text-text-primary">{typeConfig.label}</div>
                </div>
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-0.5">Assignee</div>
                    <div className="text-sm font-bold text-text-primary flex items-center gap-1">
                        <User size={12} className="text-text-muted" /> {task.assignee?.user?.username || '—'}
                    </div>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Description</div>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
            )}

            {/* Links */}
            {urls.length > 0 && (
                <div>
                    <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1.5">References</div>
                    <div className="flex flex-col gap-1.5">
                        {urls.map((url, i) => (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle hover:border-accent-primary/50 text-sm text-accent-primary hover:text-accent-hover transition-all"
                            >
                                <ExternalLink size={14} />
                                <span className="truncate">{url}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Review and Deliverable Actions */}
            <div className="border-t border-border-subtle/50 pt-5 mt-3">
                {task.status === 'in_review' ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-400 flex items-start gap-2.5">
                        <Clock size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block mb-0.5">Under Active Review</span>
                            This task is currently locked. The designated reviewer is verifying the deliverable output. Track approval status under the Reviews tab.
                        </div>
                    </div>
                ) : task.status === 'in_progress' && (task.assignee?.user?.uid === user?.uid || task.assignee?.user?.id === user?.id) ? (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-accent-primary hover:opacity-90 text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-accent-primary/10"
                        >
                            <Send size={14} /> Submit Deliverables for Review
                        </button>
                    </div>
                ) : null}
            </div>

            {/* SUBMIT FOR REVIEW OVERLAY MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Send size={18} className="text-accent-primary" /> Submit Deliverables</span>}
                open={isReviewModalOpen}
                onCancel={() => setIsReviewModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
                width={480}
            >
                <Form
                    layout="vertical"
                    className="pt-4"
                    onFinish={(values) => {
                        onSubmitReview({
                            ...values,
                            deliverableType
                        });
                        setIsReviewModalOpen(false);
                    }}
                >
                    <Form.Item
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Deliverable Type</span>}
                    >
                        <div className="flex bg-surface-sunken p-1 rounded-xl border border-border-subtle">
                            <button
                                type="button"
                                onClick={() => setDeliverableType('sandbox_draft')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                                    deliverableType === 'sandbox_draft' ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:text-text-primary'
                                )}
                            >
                                <FileText size={14} /> Workspace Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeliverableType('external_link')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                                    deliverableType === 'external_link' ? 'bg-surface text-accent-primary border border-border-subtle shadow-sm' : 'text-text-muted hover:text-text-primary'
                                )}
                            >
                                <GitBranch size={14} /> Commit Link
                            </button>
                        </div>
                    </Form.Item>

                    {deliverableType === 'sandbox_draft' ? (
                        <Form.Item
                            name="workspaceItem"
                            label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Select Workspace Draft</span>}
                            rules={[{ required: true, message: 'Please select a draft deliverable!' }]}
                        >
                            <Select 
                                placeholder="Choose a draft..." 
                                className="dark-select w-full"
                                dropdownClassName="dark-select-dropdown"
                            >
                                {workspaceItems
                                    .filter(item => item.status === 'draft' || item.status === 'rejected')
                                    .map(item => (
                                        <Option key={item.uid} value={item.uid}>
                                            [{item.type}] {item.title}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    ) : (
                        <Form.Item
                            name="externalLink"
                            label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">External Commit / PR URL</span>}
                            rules={[{ required: true, message: 'Please input commit link URL!' }]}
                        >
                            <Input 
                                placeholder="https://github.com/username/repo/commit/..."
                                className="dark-input"
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="reviewer"
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Assign Reviewer</span>}
                        rules={[{ required: true, message: 'Please select a reviewer!' }]}
                    >
                        <Select 
                            placeholder="Choose member..." 
                            className="dark-select w-full"
                            dropdownClassName="dark-select-dropdown"
                        >
                            {project.members?.map(m => (
                                <Option key={m.uid} value={m.uid}>
                                    @{m.user?.username} ({m.projectRole?.customLabel || 'Member'})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="message"
                        label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Comments / Notes</span>}
                    >
                        <Input.TextArea 
                            rows={3} 
                            placeholder="Describe your implementation or document output..."
                            className="dark-input border-border-subtle"
                        />
                    </Form.Item>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle mt-4">
                        <Button onClick={() => setIsReviewModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={resolving} className="dark-btn-primary font-bold">
                            Submit Request
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};


export default MissionsRepo;
