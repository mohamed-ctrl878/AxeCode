import React, { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Spin, Tag, Button, Dropdown, Modal, Form, Input, Select, DatePicker, Tooltip } from 'antd';
import { MoreOutlined, GithubOutlined, CheckCircleOutlined, SyncOutlined, StopOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { useKanbanBoard } from '@domain/useCase/task/useKanbanBoard';
import { useSprints } from '@domain/useCase/task/useSprints';
import { Plus, Trash2, Calendar, Flame, AlertCircle, Play, CheckSquare, Layers, Target, GitBranch, GitPullRequest, GitCommit, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const STATUS_COLUMNS = [
    { key: 'todo', title: 'To Do', color: '#38bdf8', glow: 'shadow-[0_0_15px_rgba(56,189,248,0.15)]' },
    { key: 'in_progress', title: 'In Progress', color: '#fb923c', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.15)]' },
    { key: 'in_review', title: 'Review', color: '#c084fc', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.15)]' },
    { key: 'done', title: 'Done', color: '#4ade80', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)]' },
    { key: 'blocked', title: 'Blocked', color: '#f87171', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.15)]' }
];

const PRIORITY_COLORS = {
    low: '#4ade80',       // green
    medium: '#38bdf8',    // blue
    high: '#fb923c',      // orange
    critical: '#f87171'   // red
};

export const KanbanBoard = ({ project }) => {
    const projectId = project.uid;
    
    // Usecases
    const { 
        fetchTasks,
        startPolling,
        tasks, 
        loadingTasks, 
        tasksError, 
        transitionTask, 
        isTransitioning,
        createTask,
        isCreatingTask,
        deleteTask,
        isDeletingTask
    } = useKanbanBoard(projectId);

    const {
        fetchSprints,
        sprints,
        loadingSprints,
        startSprint,
        isStarting,
        createSprint,
        isCreating: isCreatingSprint
    } = useSprints(projectId);

    // Filter and Modal States
    const [selectedSprintFilter, setSelectedSprintFilter] = useState('active');
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskModalColumn, setTaskModalColumn] = useState('todo');

    // Forms
    const [sprintForm] = Form.useForm();
    const [taskForm] = Form.useForm();

    useEffect(() => {
        if (!projectId) return;
        fetchTasks();
        fetchSprints();
        // Start silent background polling — returns cleanup fn
        const stopPolling = startPolling();
        return () => stopPolling();
    }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Derived values
    const activeSprint = sprints?.find(s => s.status === 'active');
    
    // Determine target sprint based on filter
    const activeFilterSprint = sprints?.find(s => {
        if (selectedSprintFilter === 'active') return s.status === 'active';
        return s.uid === selectedSprintFilter;
    });

    // Handle initial state setup for filter when sprints are loaded
    useEffect(() => {
        if (sprints && sprints.length > 0 && !activeSprint) {
            // If no active sprint exists, default to 'all' instead of empty active state
            setSelectedSprintFilter('all');
        }
    }, [sprints]);

    const handleTransition = async (taskId, newStatus) => {
        try {
            await transitionTask(taskId, newStatus);
            toast.success('Task status updated successfully!');
            fetchTasks();
        } catch (error) {
            toast.error(error.message || 'Failed to transition task.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
        try {
            await deleteTask(taskId);
            toast.success('Task deleted successfully!');
            fetchTasks();
        } catch (error) {
            toast.error(error.message || 'Failed to delete task.');
        }
    };

    const handleStartSprint = async (sprintUid) => {
        try {
            await startSprint(sprintUid);
            toast.success('Sprint started successfully!');
            fetchSprints();
            fetchTasks();
            setSelectedSprintFilter('active');
        } catch (error) {
            toast.error(error.message || 'Failed to start sprint.');
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
            toast.success(`Sprint ${values.number} created successfully!`);
            setIsSprintModalOpen(false);
            sprintForm.resetFields();
            fetchSprints();
        } catch (error) {
            toast.error(error.message || 'Failed to create sprint.');
        }
    };

    const handleCreateTaskSubmit = async (values) => {
        try {
            const taskData = {
                title: values.title,
                description: values.description,
                priority: values.priority || 'medium',
                status: taskModalColumn,
                assignee: values.assignee || null,
                sprint: values.sprint || null,
                task_type: values.task_type || 'general',
                layer_id: values.layer_id || null,
                stage: values.stage || 'planning'
            };
            await createTask(taskData);
            toast.success('Task created successfully!');
            setIsTaskModalOpen(false);
            taskForm.resetFields();
            fetchTasks();
        } catch (error) {
            toast.error(error.message || 'Failed to create task.');
        }
    };

    // Filter tasks based on the active selection
    const filteredTasks = (tasks || []).filter(task => {
        if (selectedSprintFilter === 'all') return true;
        if (selectedSprintFilter === 'backlog') return !task.sprint;
        if (selectedSprintFilter === 'active') {
            return activeSprint && task.sprint?.uid === activeSprint.uid;
        }
        return task.sprint?.uid === selectedSprintFilter;
    });

    // Calculate Sprint Progress Metrics
    const sprintTotalTasks = filteredTasks.length;
    const sprintDoneTasks = filteredTasks.filter(t => t.status === 'done').length;
    const progressPercentage = sprintTotalTasks > 0 ? Math.round((sprintDoneTasks / sprintTotalTasks) * 100) : 0;

    const openCreateTask = (statusKey) => {
        setTaskModalColumn(statusKey);
        // Pre-fill active sprint or current selection in form
        let defaultSprint = null;
        if (selectedSprintFilter === 'active' && activeSprint) {
            defaultSprint = activeSprint.uid;
        } else if (selectedSprintFilter !== 'all' && selectedSprintFilter !== 'backlog') {
            defaultSprint = selectedSprintFilter;
        }
        taskForm.setFieldsValue({ 
            sprint: defaultSprint, 
            priority: 'medium',
            task_type: 'general',
            stage: 'planning',
            layer_id: null
        });
        setIsTaskModalOpen(true);
    };

    if (loadingTasks || loadingSprints) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spin size="large" />
                <p className="text-text-muted text-sm font-bold tracking-widest uppercase">Loading workspace board...</p>
            </div>
        );
    }

    if (tasksError) {
        return (
            <div className="bento-card p-8 bg-surface rounded-[2rem] border border-border-subtle flex flex-col items-center justify-center text-center">
                <AlertCircle size={48} className="text-status-error mb-4" />
                <h3 className="text-lg font-bold text-text-primary">Workspace Load Failure</h3>
                <p className="text-text-muted max-w-md mt-2">Could not synchronize task dashboard records with Strapi servers.</p>
                <Button onClick={() => { fetchTasks(); fetchSprints(); }} className="mt-6 bg-accent-primary text-black font-bold border-none hover:opacity-90">Retry Connection</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Agile / Sprint Header Glassmorphic Panel */}
            <div className="bento-card p-6 bg-surface/80 rounded-[2rem] border border-border-subtle backdrop-blur-md flex flex-col gap-6 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Active Info */}
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 text-accent-primary">
                            <Layers size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-text-primary">
                                    {selectedSprintFilter === 'all' && 'All Iterations Board'}
                                    {selectedSprintFilter === 'backlog' && 'Product Backlog'}
                                    {selectedSprintFilter === 'active' && (activeSprint ? `Sprint ${activeSprint.number}` : 'Active Sprint')}
                                    {selectedSprintFilter !== 'all' && selectedSprintFilter !== 'backlog' && selectedSprintFilter !== 'active' && `Sprint ${activeFilterSprint?.number}`}
                                </h2>
                                {selectedSprintFilter === 'active' && activeSprint && (
                                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono uppercase tracking-wider">Active</span>
                                )}
                                {activeFilterSprint?.status === 'planned' && (
                                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-mono uppercase tracking-wider">Planned</span>
                                )}
                                {activeFilterSprint?.status === 'completed' && (
                                    <span className="px-2 py-0.5 rounded bg-surface-sunken text-text-muted border border-border-subtle text-[10px] font-mono uppercase tracking-wider">Completed</span>
                                )}
                            </div>
                            
                            <p className="text-xs text-text-muted mt-1 max-w-xl">
                                {selectedSprintFilter === 'all' && 'Review tasks from all phases and timelines simultaneously.'}
                                {selectedSprintFilter === 'backlog' && 'Prioritize and plan features that are not yet committed to a sprint.'}
                                {selectedSprintFilter === 'active' && (activeSprint ? activeSprint.goal : 'No active sprints are currently running for this team.')}
                                {selectedSprintFilter !== 'all' && selectedSprintFilter !== 'backlog' && selectedSprintFilter !== 'active' && activeFilterSprint?.goal}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                        {/* Sprint Selector */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Scope Filter</label>
                            <Select
                                value={selectedSprintFilter}
                                onChange={setSelectedSprintFilter}
                                className="w-[180px] dark-select"
                                dropdownClassName="dark-select-dropdown"
                            >
                                <Option value="active" disabled={!activeSprint}>
                                    <span className="flex items-center gap-2">
                                        <Flame size={12} className="text-orange-500" /> Active Sprint
                                    </span>
                                </Option>
                                <Option value="backlog">
                                    <span className="flex items-center gap-2">
                                        <Layers size={12} className="text-[#38bdf8]" /> Backlog
                                    </span>
                                </Option>
                                <Option value="all">
                                    <span className="flex items-center gap-2">
                                        <Target size={12} className="text-[#c084fc]" /> All Sprints
                                    </span>
                                </Option>
                                {sprints && sprints.length > 0 && <Option disabled key="divider" className="border-t border-border-subtle my-1" />}
                                {(sprints || []).map(sprint => (
                                    <Option key={sprint.uid} value={sprint.uid}>
                                        <span className="flex items-center justify-between gap-2 w-full text-xs">
                                            <span>Sprint {sprint.number}</span>
                                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                sprint.status === 'active' ? 'bg-green-500/10 text-green-400' :
                                                sprint.status === 'planned' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-surface-sunken text-text-muted'
                                            }`}>{sprint.status}</span>
                                        </span>
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 self-end mt-4 md:mt-0">
                            {activeFilterSprint?.status === 'planned' && (
                                <button
                                    onClick={() => handleStartSprint(activeFilterSprint.uid)}
                                    disabled={isStarting}
                                    className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
                                >
                                    <Play size={12} /> Start Sprint
                                </button>
                            )}

                            <button
                                onClick={() => setIsSprintModalOpen(true)}
                                className="px-4 py-2.5 border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary bg-surface-elevated hover:bg-accent-primary/10 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2"
                            >
                                <Calendar size={12} /> Create Sprint
                            </button>

                            <button
                                onClick={() => openCreateTask('todo')}
                                className="px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/20"
                            >
                                <Plus size={12} /> Create Task
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress bar metrics for Active / Selected Sprint */}
                {selectedSprintFilter !== 'all' && sprintTotalTasks > 0 && (
                    <div className="pt-4 border-t border-border-subtle/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-text-muted flex items-center gap-1.5"><CheckSquare size={14} className="text-green-400" /> Finished: <strong className="text-text-primary">{sprintDoneTasks} / {sprintTotalTasks} tasks</strong></span>
                            <span className="text-text-muted flex items-center gap-1.5"><Calendar size={14} className="text-accent-primary" /> Dates: 
                                <strong className="text-text-primary">
                                    {activeFilterSprint?.startDate ? `${new Date(activeFilterSprint.startDate).toLocaleDateString()} - ${new Date(activeFilterSprint.endDate).toLocaleDateString()}` : 'Not set'}
                                </strong>
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-[350px]">
                            <div className="flex-1 bg-surface-sunken rounded-full h-2 overflow-hidden border border-border-subtle/30">
                                <div 
                                    className="bg-accent-primary h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono font-bold text-accent-primary whitespace-nowrap">{progressPercentage}% done</span>
                        </div>
                    </div>
                )}

                {/* Warning Banner if Active Sprint Selected but none is active */}
                {selectedSprintFilter === 'active' && !activeSprint && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-xs text-yellow-400">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">No Active Sprint:</span> There is no active sprint running in this project repository currently. Sprints keep your teams focused. Create a new sprint, define its milestones, select it in the dropdown, and press <strong className="text-text-primary">Start Sprint</strong> to sync tasks! Showing all items in the backlog instead.
                        </div>
                    </div>
                )}
            </div>

            {/* Kanban Columns */}
            <div className="overflow-x-auto hide-scrollbar pb-6 pt-2">
                <div className="flex flex-nowrap gap-5 min-w-[1200px]">
                    {STATUS_COLUMNS.map(col => {
                        // If 'active' was selected but no sprint is active, filter backlog tasks. Otherwise filter properly.
                        const activeSprintIdForFilter = selectedSprintFilter === 'active' ? (activeSprint?.uid || 'backlog') : selectedSprintFilter;
                        
                        const columnTasks = filteredTasks
                            .filter(t => t.status === col.key)
                            .sort((a, b) => a.order - b.order);

                        return (
                            <div className="flex-1 shrink-0 basis-[20%]" key={col.key}>
                                <div className={`flex flex-col bg-surface/50 border border-border-subtle/80 backdrop-blur-md rounded-3xl p-5 min-h-[600px] gap-4 ${col.glow}`}>
                                    {/* Column Header */}
                                    <div className="flex justify-between items-center pb-2 border-b border-border-subtle/50">
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="w-2.5 h-2.5 rounded-full" 
                                                style={{ backgroundColor: col.color, boxShadow: `0 0 8px ${col.color}` }}
                                            />
                                            <h3 className="font-bold text-text-primary text-sm tracking-wide">{col.title}</h3>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-lg bg-surface-sunken text-text-muted text-[10px] font-mono border border-border-subtle/40">{columnTasks.length}</span>
                                    </div>

                                    {/* Scrollable Tasks Box */}
                                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
                                        {columnTasks.map(task => (
                                            <TaskCard 
                                                key={task.uid} 
                                                task={task} 
                                                onTransition={(newStatus) => handleTransition(task.uid, newStatus)} 
                                                onDelete={() => handleDeleteTask(task.uid)}
                                                isTransitioning={isTransitioning}
                                                projectMembers={project.members}
                                                project={project}
                                                showSprintTag={selectedSprintFilter === 'all'}
                                            />
                                        ))}

                                        {columnTasks.length === 0 && (
                                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-text-muted/40 gap-2 border border-dashed border-border-subtle/30 rounded-2xl min-h-[120px]">
                                                <CheckSquare size={24} className="opacity-20" />
                                                <span className="text-xs">No tasks</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Add task shortcut button */}
                                    <button 
                                        onClick={() => openCreateTask(col.key)}
                                        className="w-full py-2.5 bg-surface-sunken/40 hover:bg-accent-primary/10 border border-dashed border-border-subtle/50 hover:border-accent-primary/40 rounded-2xl text-text-muted hover:text-accent-primary text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Plus size={14} className="text-text-muted group-hover:text-accent-primary transition-colors" /> Add Task
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CREATE SPRINT MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Calendar size={18} className="text-accent-primary" /> Setup New Sprint</span>}
                open={isSprintModalOpen}
                onCancel={() => setIsSprintModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form
                    form={sprintForm}
                    layout="vertical"
                    onFinish={handleCreateSprintSubmit}
                    className="pt-4 flex flex-col gap-4"
                >
                    <Form.Item
                        name="number"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint Number</span>}
                        rules={[{ required: true, message: 'Please input sprint number!' }]}
                    >
                        <Input type="number" placeholder="Enter sprint integer index (e.g. 3)" className="dark-input" />
                    </Form.Item>

                    <Form.Item
                        name="goal"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint Target & Goals</span>}
                        rules={[{ required: true, message: 'Please input sprint goal description!' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Describe targets, features and milestones for this iteration..." className="dark-input" />
                    </Form.Item>

                    <Form.Item
                        name="dates"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint Dates</span>}
                    >
                        <DatePicker.RangePicker className="dark-input w-full" dropdownClassName="dark-select-dropdown" />
                    </Form.Item>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsSprintModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingSprint} className="dark-btn-primary">
                            Create Planned Sprint
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* CREATE TASK MODAL */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Target size={18} className="text-accent-primary" /> Add Task to Workspace</span>}
                open={isTaskModalOpen}
                onCancel={() => setIsTaskModalOpen(false)}
                footer={null}
                className="dark-modal animate-in zoom-in-95 duration-250"
                centered
            >
                <Form
                    form={taskForm}
                    layout="vertical"
                    onFinish={handleCreateTaskSubmit}
                    className="pt-4 flex flex-col gap-4"
                >
                    <Form.Item
                        name="title"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Title</span>}
                        rules={[{ required: true, message: 'Please input task title!' }]}
                    >
                        <Input placeholder="Enter high-level user story title..." className="dark-input" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Details & Criteria</span>}
                    >
                        <Input.TextArea rows={3} placeholder="Add links, acceptance criteria, or code block specifications..." className="dark-input" />
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
                            name="sprint"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sprint Backlog</span>}
                        >
                            <Select placeholder="Assign to Sprint" allowClear className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value={null}>Product Backlog</Option>
                                {(sprints || []).map(sprint => (
                                    <Option key={sprint.uid} value={sprint.uid}>Sprint {sprint.number}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item
                            name="task_type"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Type</span>}
                            initialValue="general"
                        >
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="general">General Task</Option>
                                <Option value="document">Documentation</Option>
                                <Option value="flowchart">System Flowchart</Option>
                                <Option value="code_commit">Code Commit</Option>
                                <Option value="test_case">Test Case</Option>
                                <Option value="deployment">Deployment Status</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="stage"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Target Agile Stage</span>}
                            initialValue="planning"
                        >
                            <Select className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value="planning">Planning</Option>
                                <Option value="design">Design</Option>
                                <Option value="implementation">Coding</Option>
                                <Option value="testing">Testing</Option>
                                <Option value="deployment">Deployment</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="layer_id"
                            label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Target Layer Component</span>}
                        >
                            <Select placeholder="General Layer" allowClear className="dark-select w-full" dropdownClassName="dark-select-dropdown">
                                <Option value={null}>None (General Task)</Option>
                                {(project?.architectureDiagram?.nodes || []).map(node => {
                                    let nodeLabel = node.data?.label || 'Unnamed Module';
                                    if (nodeLabel === 'New Concept' && node.data?.content && node.data.content.length > 0) {
                                        const textBlock = node.data.content.find(b => b.type === 'paragraph' || b.type === 'header');
                                        if (textBlock && textBlock.data?.text) {
                                            nodeLabel = textBlock.data.text.replace(/<[^>]*>/g, '');
                                        }
                                    }
                                    return (
                                        <Option key={node.id} value={node.id}>{nodeLabel}</Option>
                                    );
                                })}
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
                        <Button onClick={() => setIsTaskModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingTask} className="dark-btn-primary">
                            Create Task
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// TaskCard — shows task info + live GitHub state + Developer Guide panel
// ─────────────────────────────────────────────────────────────────────────────
const TaskCard = ({ task, onTransition, onDelete, isTransitioning, project, showSprintTag }) => {
    const [guideOpen, setGuideOpen] = useState(false);

    const menuItems = [
        ...STATUS_COLUMNS
            .filter(c => c.key !== task.status)
            .map(c => ({ key: c.key, label: `Move to ${c.title}`, onClick: () => onTransition(c.key) })),
        { type: 'divider' },
        {
            key: 'guide',
            label: <span className="flex items-center gap-1.5"><BookOpen size={12} /> Developer Guide</span>,
            onClick: () => setGuideOpen(v => !v)
        },
        { type: 'divider' },
        {
            key: 'delete',
            label: <span className="text-red-400 flex items-center gap-1.5"><Trash2 size={12} /> Delete Task</span>,
            onClick: onDelete
        },
    ];

    // ── Suggested branch name ──────────────────────────────────────────────
    const suggestedBranch = task.branchPattern
        ? task.branchPattern
        : `task/${task.uid}`;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`));
    };

    // ── Layer label ────────────────────────────────────────────────────────
    const targetLayerNode = (project?.architectureDiagram?.nodes || []).find(n => n.id === task.layerId);
    let layerLabel = null;
    if (targetLayerNode) {
        layerLabel = targetLayerNode.data?.label || 'Unnamed Module';
        if (layerLabel === 'New Concept' && targetLayerNode.data?.content?.length > 0) {
            const tb = targetLayerNode.data.content.find(b => b.type === 'paragraph' || b.type === 'header');
            if (tb?.data?.text) layerLabel = tb.data.text.replace(/<[^>]*>/g, '');
        }
    }

    const typeColors = {
        general: 'bg-white/5 text-text-muted',
        document: 'bg-blue-500/10 text-blue-400',
        flowchart: 'bg-purple-500/10 text-purple-400',
        code_commit: 'bg-orange-500/10 text-orange-400',
        test_case: 'bg-green-500/10 text-green-400',
        deployment: 'bg-pink-500/10 text-pink-400',
    };
    const typeLabels = { general:'General', document:'Doc', flowchart:'Flowchart', code_commit:'Code', test_case:'Test', deployment:'Deploy' };

    const hasGithubState = task.lastCommitSha || task.githubPrId || task.branchPattern;

    return (
        <Card
            size="small"
            className="task-card bg-surface-elevated/40 backdrop-blur-md border border-border-subtle/70 hover:border-accent-primary/50 transition-all duration-300 rounded-2xl shadow-lg relative group overflow-hidden"
            style={{ borderLeft: `4px solid ${PRIORITY_COLORS[task.priority] || '#333'}` }}
            bodyStyle={{ padding: '14px' }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex justify-between items-start gap-2">
                <span className="text-text-primary font-bold text-sm tracking-wide line-clamp-2 leading-relaxed flex-1">
                    {task.title}
                </span>
                <Dropdown menu={{ items: menuItems }} trigger={['click']} disabled={isTransitioning} overlayClassName="dark-dropdown-menu">
                    <Button type="text" size="small" icon={<MoreOutlined className="text-text-muted hover:text-text-primary" />} />
                </Dropdown>
            </div>

            {task.description && (
                <p className="text-text-muted text-[11px] mt-1.5 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                    {task.description}
                </p>
            )}

            {/* ── Meta Tags ──────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-border-subtle/30">
                <Tag className="px-1.5 py-0.5 rounded bg-surface border-none text-[9px] uppercase font-bold" style={{ color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                </Tag>
                {task.taskType && task.taskType !== 'general' && (
                    <Tag className={`px-1.5 py-0.5 rounded border-none text-[9px] font-bold uppercase ${typeColors[task.taskType] || 'bg-white/5 text-text-muted'}`}>
                        {typeLabels[task.taskType]}
                    </Tag>
                )}
                {task.stage && (
                    <Tag className="px-1.5 py-0.5 rounded border-none bg-yellow-500/10 text-yellow-400 text-[9px] font-bold uppercase">
                        {task.stage === 'implementation' ? 'Coding' : task.stage}
                    </Tag>
                )}
                {layerLabel && (
                    <Tag className="px-1.5 py-0.5 rounded border-none bg-cyan-500/10 text-cyan-400 text-[9px] font-bold uppercase max-w-[110px] truncate">
                        {layerLabel}
                    </Tag>
                )}
                {showSprintTag && task.sprint && (
                    <Tag className="px-1.5 py-0.5 rounded border-none bg-accent-primary/10 text-accent-primary text-[9px] font-bold uppercase">
                        S{task.sprint.number}
                    </Tag>
                )}
            </div>

            {/* ── Live GitHub State ───────────────────────────────────────── */}
            {hasGithubState && (
                <div className="mt-3 pt-2.5 border-t border-border-subtle/30 flex flex-col gap-1.5">
                    {/* Branch */}
                    {(task.branchPattern || task.uid) && (
                        <div className="flex items-center gap-1.5">
                            <GitBranch size={10} className="text-accent-primary/70 shrink-0" />
                            <span className="text-[10px] font-mono text-text-muted truncate flex-1">{suggestedBranch}</span>
                            <Tooltip title="Copy branch name">
                                <button
                                    onClick={() => copyToClipboard(suggestedBranch, 'Branch name')}
                                    className="text-text-muted/50 hover:text-accent-primary transition-colors"
                                >
                                    <CopyOutlined style={{ fontSize: 9 }} />
                                </button>
                            </Tooltip>
                        </div>
                    )}

                    {/* PR Link */}
                    {task.githubPrId && (
                        <div className="flex items-center gap-1.5">
                            <GitPullRequest size={10} className="text-blue-400/70 shrink-0" />
                            <span className="text-[10px] text-blue-400 font-medium">PR #{task.githubPrId}</span>
                            {task.prTitle && (
                                <span className="text-[10px] text-text-muted truncate max-w-[120px]">· {task.prTitle}</span>
                            )}
                            {task.prUrl && (
                                <a href={task.prUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted/50 hover:text-blue-400 ml-auto">
                                    <LinkOutlined style={{ fontSize: 9 }} />
                                </a>
                            )}
                        </div>
                    )}

                    {/* Last Commit SHA */}
                    {task.lastCommitSha && (
                        <div className="flex items-center gap-1.5">
                            <GitCommit size={10} className="text-text-muted/50 shrink-0" />
                            <span className="text-[10px] font-mono text-text-muted/60">{task.lastCommitSha.substring(0, 7)}</span>
                        </div>
                    )}

                    {/* CI Status */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {task.ciStatus === 'success' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold uppercase">
                                <CheckCircleOutlined /> CI Passing
                            </span>
                        )}
                        {task.ciStatus === 'failure' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase">
                                <StopOutlined /> CI Failed
                            </span>
                        )}
                        {task.ciStatus === 'pending' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-bold uppercase">
                                <SyncOutlined spin /> Running
                            </span>
                        )}
                        {task.ciStatus === 'cancelled' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-sunken border border-border-subtle text-text-muted text-[9px] font-bold uppercase">
                                Cancelled
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Developer Guide (collapsible) ───────────────────────────── */}
            {guideOpen && (
                <div className="mt-3 pt-3 border-t border-accent-primary/20 bg-accent-primary/5 rounded-xl p-3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 mb-1">
                        <GithubOutlined className="text-accent-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-primary">Developer Guide</span>
                    </div>

                    {/* Step 1 */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">① Create branch with this exact name</span>
                        <div className="flex items-center gap-1.5 bg-surface-sunken rounded-lg px-2 py-1.5 border border-border-subtle/50">
                            <GitBranch size={9} className="text-accent-primary shrink-0" />
                            <code className="text-[10px] font-mono text-accent-primary flex-1 truncate">{suggestedBranch}</code>
                            <button
                                onClick={() => copyToClipboard(suggestedBranch, 'Branch name')}
                                className="text-text-muted hover:text-accent-primary transition-colors shrink-0"
                            >
                                <CopyOutlined style={{ fontSize: 10 }} />
                            </button>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">② OR reference in commit message</span>
                        <div className="flex items-center gap-1.5 bg-surface-sunken rounded-lg px-2 py-1.5 border border-border-subtle/50">
                            <GitCommit size={9} className="text-purple-400 shrink-0" />
                            <code className="text-[10px] font-mono text-purple-400 flex-1 truncate">git commit -m "fix: ... TASK-{task.uid}"</code>
                            <button
                                onClick={() => copyToClipboard(`TASK-${task.uid}`, 'Task reference')}
                                className="text-text-muted hover:text-purple-400 transition-colors shrink-0"
                            >
                                <CopyOutlined style={{ fontSize: 10 }} />
                            </button>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">③ Open a Pull Request</span>
                        <p className="text-[10px] text-text-muted leading-relaxed">
                            When you open a PR from this branch, the task moves to <strong className="text-purple-400">In Review</strong>.
                            When merged, it becomes <strong className="text-green-400">Done ✅</strong>.
                        </p>
                    </div>

                    {/* Task ID copy */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-subtle/30">
                        <span className="text-[9px] text-text-muted font-mono">Task ID: {task.uid}</span>
                        <button
                            onClick={() => copyToClipboard(task.uid, 'Task ID')}
                            className="text-[9px] text-text-muted hover:text-accent-primary flex items-center gap-1 transition-colors"
                        >
                            <CopyOutlined style={{ fontSize: 9 }} /> Copy
                        </button>
                    </div>
                </div>
            )}

            {/* ── Guide toggle button ─────────────────────────────────────── */}
            <button
                onClick={() => setGuideOpen(v => !v)}
                className={`mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border transition-all text-[9px] font-bold uppercase tracking-wider ${
                    guideOpen
                        ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary'
                        : 'bg-surface-sunken/50 border-border-subtle/40 text-text-muted hover:border-accent-primary/30 hover:text-accent-primary'
                }`}
            >
                <GithubOutlined style={{ fontSize: 9 }} />
                {guideOpen ? 'Hide Guide' : 'Dev Guide'}
                {guideOpen ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
            </button>

            {/* ── Assignee ────────────────────────────────────────────────── */}
            {task.assignee && (
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-border-subtle/30 text-[10px] text-text-muted/80">
                    <span>Assignee:</span>
                    <span className="font-bold text-text-primary bg-surface/50 border border-border-subtle/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        {task.assignee.user?.username}
                    </span>
                </div>
            )}
        </Card>
    );
};

export default KanbanBoard;
