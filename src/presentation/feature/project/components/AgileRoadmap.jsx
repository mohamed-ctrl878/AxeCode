import React, { useState, useEffect, useMemo } from 'react';
import { useUpdateProject } from '@domain/useCase/project/useUpdateProject';
import { useSprints } from '@domain/useCase/task/useSprints';
import { useKanbanBoard } from '@domain/useCase/task/useKanbanBoard';
import { 
    Layers, ChevronDown, CheckCircle2, Loader2, Compass, ArrowRight, 
    Eye, RefreshCw, Plus, FileText, GitBranch, Play, Rocket, Check, ExternalLink, AlertCircle
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { Select, Modal, Form, Input, Button, Popover, Spin } from 'antd';
import { toast } from 'react-hot-toast';

const { Option } = Select;

const STAGES = [
    { key: 'planning', label: 'Planning' },
    { key: 'design', label: 'Design' },
    { key: 'implementation', label: 'Coding' },
    { key: 'testing', label: 'Testing' },
    { key: 'deployment', label: 'Deployment' }
];

const STATUS_LIST = [
    { value: 'todo', label: 'Todo', colorClass: 'text-text-muted bg-surface-sunken border-border-subtle/50' },
    { value: 'in_progress', label: 'In Progress', colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'completed', label: 'Completed', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
];

const extractLinks = (text) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

export const AgileRoadmap = ({ project, fetchDetails, onSwitchToDiagram }) => {
    const projectId = project.uid;
    const { updateProject, isUpdating } = useUpdateProject(projectId);
    const { fetchSprints, sprints, loadingSprints } = useSprints(projectId);
    const { fetchTasks, tasks, loadingTasks, createTask, isCreatingTask } = useKanbanBoard(projectId);

    const [activeMenu, setActiveMenu] = useState(null); // { nodeId, stageKey }
    const [updatingCell, setUpdatingCell] = useState(null); // { nodeId, stageKey }
    
    // Column Filtration State
    const [selectedStages, setSelectedStages] = useState(STAGES.map(s => s.key));
    
    // Row Filtration State
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'todo', 'in_progress', 'completed'

    // Sprint Selection State
    const [selectedSprint, setSelectedSprint] = useState('all');

    // Add Task Modal State
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [addTaskNodeId, setAddTaskNodeId] = useState(null);
    const [addTaskStageKey, setAddTaskStageKey] = useState(null);
    const [addTaskForm] = Form.useForm();

    const nodes = project.architectureDiagram?.nodes || [];

    const activeSprint = useMemo(() => sprints?.find(s => s.status === 'active'), [sprints]);

    useEffect(() => {
        if (projectId) {
            fetchSprints();
            fetchTasks();
        }
    }, [projectId]);

    useEffect(() => {
        if (sprints && sprints.length > 0 && selectedSprint === 'all') {
            if (activeSprint) {
                setSelectedSprint(activeSprint.uid);
            } else {
                setSelectedSprint(sprints[0].uid);
            }
        }
    }, [sprints, activeSprint]);

    // Map tasks by cell for quick O(1) lookup
    const tasksByCell = useMemo(() => {
        const map = {};
        if (!tasks) return map;
        tasks.forEach(t => {
            if (selectedSprint !== 'all') {
                if (!t.sprint || t.sprint.uid !== selectedSprint) return;
            }
            if (!t.layerId || !t.stage) return;
            const key = `${t.layerId}_${t.stage}`;
            if (!map[key]) map[key] = [];
            map[key].push(t);
        });
        return map;
    }, [tasks, selectedSprint]);

    const handleOpenAddTask = (nodeId, stageKey) => {
        setAddTaskNodeId(nodeId);
        setAddTaskStageKey(stageKey);
        addTaskForm.setFieldsValue({
            title: '',
            description: '',
            priority: 'medium',
            task_type: 'general',
            assignee: null
        });
        setIsAddTaskModalOpen(true);
    };

    const handleAddTaskSubmit = async (values) => {
        try {
            const sprintId = selectedSprint === 'all' ? (activeSprint?.uid || null) : selectedSprint;
            const taskData = {
                title: values.title,
                description: values.description,
                priority: values.priority || 'medium',
                status: 'todo',
                assignee: values.assignee || null,
                sprint: sprintId,
                task_type: values.task_type || 'general',
                layer_id: addTaskNodeId,
                stage: addTaskStageKey
            };
            await createTask(taskData);
            toast.success('Task created and linked to checkpoint!');
            setIsAddTaskModalOpen(false);
            addTaskForm.resetFields();
            fetchTasks();
        } catch (error) {
            toast.error(error.message || 'Failed to create task.');
        }
    };

    const handleStatusChange = async (nodeId, stageKey, newStatus) => {
        setActiveMenu(null);
        setUpdatingCell({ nodeId, stageKey });

        try {
            const updatedNodes = nodes.map(node => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            stages: {
                                ...node.data?.stages,
                                [stageKey]: newStatus
                            }
                        }
                    };
                }
                return node;
            });

            const success = await updateProject({
                architecture_diagram: {
                    nodes: updatedNodes,
                    edges: project.architectureDiagram?.edges || []
                }
            });

            if (success && fetchDetails) {
                await fetchDetails();
            }
        } catch (err) {
            console.error("Failed to update stage status:", err);
        } finally {
            setUpdatingCell(null);
        }
    };

    // Filter rows based on overall stage status
    const filteredNodes = nodes.filter(node => {
        if (statusFilter === 'all') return true;
        
        return selectedStages.some(stageKey => {
            const cellTasks = tasksByCell[`${node.id}_${stageKey}`] || [];
            let currentStatus = 'todo';
            
            if (cellTasks.length > 0) {
                const doneTasks = cellTasks.filter(t => t.status === 'done');
                currentStatus = doneTasks.length === cellTasks.length ? 'completed' : 'in_progress';
            } else {
                currentStatus = node.data?.stages?.[stageKey] || 'todo';
            }
            return currentStatus === statusFilter;
        });
    });

    const activeStages = STAGES.filter(s => selectedStages.includes(s.key));
    const hasActiveFilters = selectedStages.length < STAGES.length || statusFilter !== 'all' || selectedSprint !== 'all';

    const resetFilters = () => {
        setSelectedStages(STAGES.map(s => s.key));
        setStatusFilter('all');
        if (activeSprint) {
            setSelectedSprint(activeSprint.uid);
        } else if (sprints && sprints.length > 0) {
            setSelectedSprint(sprints[0].uid);
        } else {
            setSelectedSprint('all');
        }
    };

    if (nodes.length === 0) {
        return (
            <div className="bento-card p-12 bg-surface rounded-[2rem] border border-border-subtle text-center flex flex-col items-center justify-center min-h-[350px] animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center mb-6">
                    <Layers size={32} className="text-accent-primary" />
                </div>
                <h3 className="text-xl font-serif text-text-primary mb-3">No Architectural Components</h3>
                <p className="text-text-muted max-w-md mb-8">
                    To populate the roadmap, please define your system architecture components (Frontend, Backend, Database, etc.) in the Architecture tab.
                </p>
                <button
                    onClick={onSwitchToDiagram}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                    Create Architecture <ArrowRight size={14} />
                </button>
            </div>
        );
    }

    if (loadingTasks || loadingSprints) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spin size="large" />
                <p className="text-text-muted text-sm font-bold tracking-widest uppercase">Syncing Agile Checkpoints...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Block */}
            <div className="bento-card p-8 bg-surface rounded-[2rem] border border-border-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-xl font-serif text-text-primary mb-2 flex items-center gap-2.5">
                        <Compass size={22} className="text-accent-primary" /> System Roadmap
                    </h3>
                    <p className="text-text-muted text-sm max-w-xl">
                        Track implementation and release checkpoints across every architectural module. Tasks in active sprints define checkpoint completion.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Active Sprint:</span>
                    <Select 
                        value={selectedSprint} 
                        onChange={setSelectedSprint}
                        className="dark-select w-48"
                        dropdownClassName="dark-select-dropdown"
                    >
                        <Option value="all">All Sprints</Option>
                        {(sprints || []).map(s => (
                            <Option key={s.uid} value={s.uid}>
                                Sprint {s.number} {s.status === 'active' ? '(Active)' : ''}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Filtration Controls Panel */}
            <div className="bento-card p-6 bg-surface rounded-3xl border border-border-subtle flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Stage Filter Pills */}
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-xs font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                            <Eye size={14} className="text-accent-primary" /> Active Columns:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {STAGES.map(stage => {
                                const isSelected = selectedStages.includes(stage.key);
                                return (
                                    <button
                                        key={stage.key}
                                        onClick={() => {
                                            if (isSelected) {
                                                if (selectedStages.length > 1) {
                                                    setSelectedStages(selectedStages.filter(k => k !== stage.key));
                                                }
                                            } else {
                                                setSelectedStages([...selectedStages, stage.key]);
                                            }
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                            isSelected 
                                                ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary shadow-[0_0_8px_rgba(255,255,255,0.02)]" 
                                                : "bg-surface-sunken border-transparent text-text-muted hover:bg-surface-elevated hover:text-text-secondary"
                                        )}
                                    >
                                        {stage.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status Filter Selector */}
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                            Filter Nodes:
                        </span>
                        <div className="flex gap-1.5 bg-surface-sunken p-1 rounded-2xl border border-border-subtle/50">
                            {[
                                { value: 'all', label: 'All Modules' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'todo', label: 'Todo' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setStatusFilter(opt.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                                        statusFilter === opt.value
                                            ? "bg-surface border border-border-subtle text-text-primary shadow-sm"
                                            : "text-text-muted hover:text-text-secondary"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="flex justify-end pt-3 border-t border-border-subtle/50">
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:text-accent-hover transition-colors"
                        >
                            <RefreshCw size={12} /> Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Matrix Table */}
            <div className="bento-card bg-surface rounded-[2rem] border border-border-subtle overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-subtle bg-surface-elevated/50">
                                <th className="p-6 text-xs font-mono text-text-muted uppercase tracking-widest min-w-[200px]">Architectural Component</th>
                                {activeStages.map(stage => (
                                    <th key={stage.key} className="p-6 text-xs font-mono text-text-muted uppercase tracking-widest text-center min-w-[150px]">
                                        {stage.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle/50">
                            {filteredNodes.length === 0 ? (
                                <tr>
                                    <td colSpan={activeStages.length + 1} className="p-12 text-center text-text-muted text-sm">
                                        No architectural modules matches the current filter settings.
                                    </td>
                                </tr>
                            ) : (
                                filteredNodes.map(node => {
                                    let nodeLabel = node.data?.label || 'Unnamed Module';
                                    if (nodeLabel === 'New Concept' && node.data?.content && node.data.content.length > 0) {
                                        const textBlock = node.data.content.find(b => b.type === 'paragraph' || b.type === 'header');
                                        if (textBlock && textBlock.data?.text) {
                                            nodeLabel = textBlock.data.text.replace(/<[^>]*>/g, '');
                                        }
                                    }

                                    return (
                                        <tr key={node.id} className="hover:bg-surface-elevated/35 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary shrink-0">
                                                        <Layers size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text-primary text-sm">{nodeLabel}</div>
                                                        <div className="text-[10px] font-mono text-text-muted uppercase mt-0.5">{node.data?.shape || 'Rectangle'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {activeStages.map(stage => {
                                                const cellTasks = tasksByCell[`${node.id}_${stage.key}`] || [];
                                                const hasTasks = cellTasks.length > 0;
                                                const isCurrentCellUpdating = updatingCell?.nodeId === node.id && updatingCell?.stageKey === stage.key;
                                                const isMenuOpen = activeMenu?.nodeId === node.id && activeMenu?.stageKey === stage.key;

                                                let currentStatus = 'todo';
                                                let doneTasks = [];
                                                if (hasTasks) {
                                                    doneTasks = cellTasks.filter(t => t.status === 'done');
                                                    currentStatus = doneTasks.length === cellTasks.length ? 'completed' : 'in_progress';
                                                } else {
                                                    currentStatus = node.data?.stages?.[stage.key] || 'todo';
                                                }

                                                const statusConfig = STATUS_LIST.find(s => s.value === currentStatus) || STATUS_LIST[0];

                                                return (
                                                    <td key={stage.key} className="p-6 text-center relative align-middle group">
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            {isCurrentCellUpdating ? (
                                                                <Loader2 size={16} className="text-accent-primary animate-spin" />
                                                            ) : hasTasks ? (
                                                                <Popover
                                                                    content={
                                                                        <div className="p-2 min-w-[220px] max-w-[300px] flex flex-col gap-2">
                                                                            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1 pb-1 border-b border-border-subtle/50 flex justify-between items-center">
                                                                                <span>Checklist ({doneTasks.length}/{cellTasks.length})</span>
                                                                                <span className="text-accent-primary font-mono">{Math.round((doneTasks.length / cellTasks.length) * 100)}%</span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                                                                                {cellTasks.map(t => (
                                                                                    <div key={t.uid} className="flex items-start gap-2 text-xs">
                                                                                        <span className={cn(
                                                                                            "mt-0.5 shrink-0 flex items-center justify-center w-4 h-4 rounded border text-[10px] font-bold transition-all",
                                                                                            t.status === 'done' 
                                                                                                ? "bg-green-500/20 border-green-500 text-green-400" 
                                                                                                : "border-border-subtle text-transparent"
                                                                                        )}>
                                                                                            {t.status === 'done' ? '✓' : ''}
                                                                                        </span>
                                                                                        <span className={cn(
                                                                                            "leading-relaxed transition-colors",
                                                                                            t.status === 'done' ? "text-text-muted line-through" : "text-text-secondary"
                                                                                        )}>
                                                                                            {t.title}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            <button 
                                                                                onClick={() => handleOpenAddTask(node.id, stage.key)}
                                                                                className="mt-2 flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border-subtle hover:border-accent-primary/50 text-[11px] text-text-primary transition-all"
                                                                            >
                                                                                <Plus size={11} /> Add Task
                                                                            </button>
                                                                        </div>
                                                                    }
                                                                    title={null}
                                                                    trigger="click"
                                                                    overlayClassName="dark-popover"
                                                                >
                                                                    <div className={cn(
                                                                        "cursor-pointer px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 select-none shadow-sm",
                                                                        statusConfig.colorClass
                                                                    )}>
                                                                        <span className={cn(
                                                                            "w-1.5 h-1.5 rounded-full",
                                                                            currentStatus === 'completed' ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                                                                        )} />
                                                                        <span>{currentStatus === 'completed' ? 'Completed' : `In Progress (${doneTasks.length}/{cellTasks.length})`}</span>
                                                                    </div>
                                                                </Popover>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        if (isMenuOpen) setActiveMenu(null);
                                                                        else setActiveMenu({ nodeId: node.id, stageKey: stage.key });
                                                                    }}
                                                                    className={cn(
                                                                        "px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 select-none",
                                                                        statusConfig.colorClass
                                                                    )}
                                                                >
                                                                    <span>{statusConfig.label}</span>
                                                                    <ChevronDown size={12} className="opacity-70" />
                                                                </button>
                                                            )}

                                                            {/* Checkpoint Results/Artifacts links */}
                                                            {hasTasks && doneTasks.length > 0 && (
                                                                <div className="flex flex-wrap justify-center gap-1 max-w-[160px] mt-1.5">
                                                                    {doneTasks.map(t => {
                                                                        if (t.taskType === 'document') {
                                                                            const docLinks = extractLinks(t.description);
                                                                            const docUrl = docLinks[0] || '#';
                                                                            return (
                                                                                <a 
                                                                                    key={t.uid}
                                                                                    href={docUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    title={`Doc: ${t.title}`}
                                                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[9px] text-blue-400 font-bold uppercase transition-all duration-200"
                                                                                >
                                                                                    <FileText size={10} /> Doc
                                                                                </a>
                                                                            );
                                                                        }
                                                                        if (t.taskType === 'flowchart') {
                                                                            const flowchartLinks = extractLinks(t.description);
                                                                            const flowUrl = flowchartLinks[0] || '#';
                                                                            return (
                                                                                <a 
                                                                                    key={t.uid}
                                                                                    href={flowUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    title={`Flowchart: ${t.title}`}
                                                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-[9px] text-purple-400 font-bold uppercase transition-all duration-200"
                                                                                >
                                                                                    <Compass size={10} /> Flow
                                                                                </a>
                                                                            );
                                                                        }
                                                                        if (t.taskType === 'code_commit') {
                                                                            return (
                                                                                <div 
                                                                                    key={t.uid}
                                                                                    title={`Code: ${t.title}`}
                                                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] text-orange-400 font-bold uppercase font-mono"
                                                                                >
                                                                                    <GitBranch size={10} /> Code
                                                                                </div>
                                                                            );
                                                                        }
                                                                        if (t.taskType === 'test_case') {
                                                                            return (
                                                                                <div 
                                                                                    key={t.uid}
                                                                                    title={`Test: ${t.title}`}
                                                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-400 font-bold uppercase"
                                                                                >
                                                                                    <Play size={10} /> Pass
                                                                                </div>
                                                                            );
                                                                        }
                                                                        if (t.taskType === 'deployment') {
                                                                            return (
                                                                                <div 
                                                                                    key={t.uid}
                                                                                    title={`Deploy: ${t.title}`}
                                                                                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-[9px] text-pink-400 font-bold uppercase"
                                                                                >
                                                                                    <Rocket size={10} /> Deploy
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </div>
                                                            )}

                                                            {!hasTasks && (
                                                                <button 
                                                                    onClick={() => handleOpenAddTask(node.id, stage.key)}
                                                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated hover:bg-surface border border-border-subtle/50 hover:border-accent-primary/30 text-[9px] text-text-muted hover:text-accent-primary transition-all duration-200 mt-1"
                                                                >
                                                                    <Plus size={8} /> Add Task
                                                                </button>
                                                            )}
                                                        </div>

                                                        {isMenuOpen && !hasTasks && (
                                                            <>
                                                                <div 
                                                                    className="fixed inset-0 z-40" 
                                                                    onClick={() => setActiveMenu(null)}
                                                                />
                                                                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 w-40 bg-surface-elevated/95 backdrop-blur-md border border-border-subtle rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                    {STATUS_LIST.map(opt => {
                                                                        const isSelected = opt.value === currentStatus;
                                                                        return (
                                                                            <button
                                                                                key={opt.value}
                                                                                onClick={() => handleStatusChange(node.id, stage.key, opt.value)}
                                                                                className={cn(
                                                                                    "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors",
                                                                                    isSelected
                                                                                        ? "bg-accent-primary/10 text-accent-primary"
                                                                                        : "text-text-secondary hover:bg-surface"
                                                                                )}
                                                                            >
                                                                                <span>{opt.label}</span>
                                                                                {isSelected && <CheckCircle2 size={12} className="text-accent-primary" />}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
							)}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD TASK TO CHECKPOINT MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Check size={18} className="text-accent-primary" /> Add Task to Checkpoint</span>}
                open={isAddTaskModalOpen}
                onCancel={() => setIsAddTaskModalOpen(false)}
                footer={null}
                className="dark-modal animate-in zoom-in-95 duration-250"
                centered
            >
                <Form
                    form={addTaskForm}
                    layout="vertical"
                    onFinish={handleAddTaskSubmit}
                    className="pt-4 flex flex-col gap-4"
                >
                    <Form.Item
                        name="title"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Title</span>}
                        rules={[{ required: true, message: 'Please input task title!' }]}
                    >
                        <Input placeholder="Enter user story or checkpoint task..." className="dark-input" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Details & Result Link</span>}
                    >
                        <Input.TextArea rows={3} placeholder="Add wiki doc URL or commit reference link here..." className="dark-input" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="priority"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</span>}
                            initialValue="medium"
                        >
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                                <Option value="critical">Critical</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="task_type"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Checkpoint Result Type</span>}
                            initialValue="general"
                        >
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="general">General Task</Option>
                                <Option value="document">Documentation (Doc)</Option>
                                <Option value="flowchart">System Flowchart</Option>
                                <Option value="code_commit">Code Commit</Option>
                                <Option value="test_case">Test Case</Option>
                                <Option value="deployment">Deployment Status</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="assignee"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Assigned Team Member</span>}
                    >
                        <Select placeholder="Choose assignee..." allowClear className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                            {(project.members || []).map(member => (
                                <Option key={member.uid} value={member.uid}>
                                    {member.user?.username}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsAddTaskModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingTask} className="dark-btn-primary">
                            Create Task
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
