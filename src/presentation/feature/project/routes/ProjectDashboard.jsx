import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectDetails } from '@domain/useCase/project/useProjectDetails';
import { Github, Users, ShieldAlert, Code2, ArrowLeft, Loader2, Link2, Plus, Clock, Copy, Check, Target, Compass, BookOpen, Settings, Layers } from 'lucide-react';
import { SDLCArchitecture } from '../components/SDLCArchitecture';
import { MissionsRepo } from '../components/MissionsRepo';
import { ProjectDocs } from '../components/ProjectDocs';
import { ProjectMembers } from '../components/ProjectMembers';
import { ProjectWorkshop } from '../components/ProjectWorkshop';
import { ProjectReviews } from '../components/ProjectReviews';
import { useProjectRole } from '@core/hooks/useProjectRole';
import { useRole } from '@core/hooks/useRole';
import { useProjectApplications } from '@domain/useCase/project/useProjectApplications';
import { useProjectMembers } from '@domain/useCase/project/useProjectMembers';
import { useUpdateProject } from '@domain/useCase/project/useUpdateProject';
import { Modal, Form, Select, Input, Button } from 'antd';
import { toast } from 'react-hot-toast';

import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';
import { cn } from '@core/utils/cn';

export const ProjectDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchDetails, project, loading, error } = useProjectDetails(id);
    const [activeTab, setActiveTab] = useState('sdlc');
    
    // Call hook unconditionally
    const { isMember, isPublisher, canManageMembers } = useProjectRole(project);

    const { isAuthenticated } = useRole();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [preSelectedRoleId, setPreSelectedRoleId] = useState(null);

    const { 
        fetchMyApplications, 
        myApplications = [], 
        applyToRole, 
        isApplying 
    } = useProjectApplications(project?.uid);

    const { 
        roles: projectRoles = [], 
        fetchRoles, 
        loadingRoles 
    } = useProjectMembers(project?.uid);

    const authed = isAuthenticated();

    useEffect(() => {
        if (id) fetchDetails();
    }, [id, fetchDetails]);

    useEffect(() => {
        if (authed && project?.uid && !isMember && !isPublisher) {
            fetchMyApplications();
        }
    }, [authed, project?.uid, isMember, isPublisher, fetchMyApplications]);

    const handleOpenApplyModal = (roleId = null) => {
        if (!authed) {
            toast.error("Please log in to apply for this project.");
            return;
        }
        setPreSelectedRoleId(roleId);
        setIsApplyModalOpen(true);
        fetchRoles();
    };

    const projectApplication = myApplications?.find(app => 
        (app.project?.uid && project?.uid && app.project?.uid === project?.uid) ||
        (app.project?.id && project?.id && app.project?.id === project?.id)
    );
    const hasPendingApp = projectApplication?.status === 'pending';
    const hasRejectedApp = projectApplication?.status === 'rejected';

    if (loading) return <div className="py-24"><PageLoader /></div>;

    if (error || !project) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <ShieldAlert size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-serif text-text-primary mb-2">Project Not Found</h2>
                <p className="text-text-muted max-w-md mb-8">{error?.message || "Could not load project details. It may have been deleted or is private."}</p>
                <button onClick={() => navigate('/projects')} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm">
                    <ArrowLeft size={16} /> Back to Discover
                </button>
            </div>
        );
    }

    const tabs = [
        { id: 'sdlc', label: 'SDLC', icon: Compass },
        { id: 'missions', label: 'Missions Repo', icon: Target },
        { id: 'rules', label: 'Rules & Wiki', icon: BookOpen },
        { id: 'members', label: 'Members', icon: Users },
    ];
    
    if (isMember || isPublisher) {
        tabs.splice(3, 0, 
            { id: 'workshop', label: 'Workshop', icon: Layers },
            { id: 'reviews', label: 'Reviews', icon: Clock }
        );
    }
    
    if (isPublisher) tabs.push({ id: 'settings', label: 'Settings', icon: Settings });

    return (
        <div className="md:col-span-12 min-h-screen bg-transparent w-full animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="bg-surface-elevated border-b border-border-subtle pt-12 pb-8 px-6 md:px-10">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                    <button 
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors w-fit text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-serif text-text-primary mb-2">{project.title}</h1>
                            {project.publisher && (
                                <div className="flex items-center gap-2 mb-4 text-sm text-text-muted">
                                    <span className="font-bold">Publisher:</span>
                                    <span className="text-accent-primary">@{project.publisher.username || 'Unknown'}</span>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border",
                                    project.status === 'active' 
                                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                        : "bg-surface-sunken text-text-muted border-border-subtle"
                                )}>
                                    {project.status || 'Unknown'}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-mono uppercase flex items-center gap-1.5">
                                    <Code2 size={14} /> {project.methodology || 'Agile'}
                                </span>
                                {project.githubRepoUrl && (
                                    <a href={project.githubRepoUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-surface border border-border-subtle text-text-primary hover:text-accent-primary hover:border-accent-primary/50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer">
                                        <Github size={14} /> Repository
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        {!isMember && !isPublisher && (
                            <>
                                {hasPendingApp ? (
                                    <button 
                                        disabled
                                        className="px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs whitespace-nowrap bg-surface-sunken border border-blue-500/20 text-blue-400/80 cursor-not-allowed flex items-center gap-2 transition-all"
                                    >
                                        <Clock size={14} /> Application Pending
                                    </button>
                                ) : hasRejectedApp ? (
                                    <button 
                                        onClick={() => handleOpenApplyModal()}
                                        className="px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs whitespace-nowrap border border-red-500/50 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all flex items-center gap-2"
                                    >
                                        Re-apply to Join
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleOpenApplyModal()}
                                        className="btn-primary px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs whitespace-nowrap transition-all"
                                    >
                                        Apply to Join
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto w-full px-6 md:px-10 mt-8">
                {/* Custom Tabs */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-border-subtle pb-4">
                    {tabs.map(tab => {
                        const TabIcon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all whitespace-nowrap flex items-center gap-2",
                                    activeTab === tab.id 
                                        ? "bg-accent-primary text-black" 
                                        : "text-text-muted hover:text-text-primary hover:bg-surface-elevated"
                                )}
                            >
                                <TabIcon size={14} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Contents */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'sdlc' && (
                        <SDLCArchitecture project={project} />
                    )}
                    {activeTab === 'missions' && (
                        <MissionsRepo project={project} />
                    )}
                    {activeTab === 'rules' && (
                        <ProjectDocs project={project} />
                    )}
                    {activeTab === 'workshop' && (isMember || isPublisher) && (
                        <ProjectWorkshop project={project} />
                    )}
                    {activeTab === 'reviews' && (isMember || isPublisher) && (
                        <ProjectReviews project={project} />
                    )}
                    {activeTab === 'members' && (
                        <ProjectMembers 
                            project={project} 
                            canManageMembers={canManageMembers} 
                            projectApplication={projectApplication}
                            onOpenApplyModal={handleOpenApplyModal}
                            onRefresh={fetchDetails}
                        />
                    )}
                    {activeTab === 'settings' && isPublisher && (
                        <ProjectSettings project={project} />
                    )}
                </div>
            </div>

            {/* Modal: Apply to Join */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Plus size={18} className="text-accent-primary" /> Apply to Join {project.title}</span>}
                open={isApplyModalOpen}
                onCancel={() => setIsApplyModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
                destroyOnClose
            >
                <Form
                    layout="vertical"
                    initialValues={{ roleId: preSelectedRoleId }}
                    onFinish={async (values) => {
                        try {
                            const res = await applyToRole({
                                project_role_id: values.roleId,
                                message: values.message
                            });
                            if (res) {
                                toast.success("Application submitted successfully!");
                                setIsApplyModalOpen(false);
                                fetchMyApplications();
                            }
                        } catch (err) {
                            toast.error(err.message || "Failed to submit application");
                        }
                    }}
                    className="pt-4 flex flex-col gap-3"
                >
                    <Form.Item
                        name="roleId"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Role</span>}
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select 
                            placeholder="Choose a role to apply for..." 
                            className="dark-select w-full" 
                            dropdownClassName="dark-select-dropdown"
                            loading={loadingRoles}
                        >
                            {projectRoles
                                .filter(r => r.is_open !== false)
                                .map(r => (
                                    <Select.Option key={r.documentId || r.id} value={r.documentId || r.id}>
                                        {r.custom_label || r.job_title_tag?.label_en || `Role ${r.id}`} (Slots: {r.slots || 1})
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="message"
                        label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Cover Letter / Message</span>}
                    >
                        <Input.TextArea 
                            rows={4} 
                            placeholder="Explain why you want to join this project and how you fit this role..." 
                            className="dark-input" 
                        />
                    </Form.Item>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsApplyModalOpen(false)} className="dark-btn-secondary">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isApplying} className="dark-btn-primary">
                            Submit Application
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

// --- Sub-components for Tabs ---

const ProjectSettings = ({ project }) => {
    const [copied, setCopied] = useState(false);
    const [form] = Form.useForm();
    const { updateProject, isUpdating } = useUpdateProject(project.uid);
    const webhookUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:1338/api'}/github-event/webhook`;

    const handleCopy = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdate = async (values) => {
        try {
            await updateProject({
                github_repo_id: values.github_repo_id || null,
                github_webhook_secret: values.github_webhook_secret || null
            });
            toast.success("GitHub configuration updated successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to update configuration");
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div className="bento-card p-8 bg-surface rounded-[2rem]">
                <h3 className="text-2xl font-serif text-text-primary mb-2">GitHub Webhook Integration</h3>
                <p className="text-text-muted mb-8">
                    Automate your Kanban Board. Link your GitHub repository to automatically move tasks when Pull Requests are opened or merged, and update CI statuses based on GitHub Actions.
                </p>

                <Form 
                    form={form} 
                    layout="vertical" 
                    initialValues={{
                        github_repo_id: project.githubRepoId || '',
                        github_webhook_secret: project.githubWebhookSecret || ''
                    }}
                    onFinish={handleUpdate}
                    className="space-y-6"
                >
                    {/* Setup Instructions */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Payload URL</label>
                        <div className="flex gap-2 mb-2">
                            <div className="flex-1 bg-surface-sunken border border-border-subtle rounded-xl px-4 py-3 text-sm font-mono text-text-primary overflow-x-auto whitespace-nowrap">
                                {webhookUrl}
                            </div>
                            <button 
                                type="button"
                                onClick={handleCopy}
                                className="px-4 py-3 bg-surface-elevated border border-border-subtle rounded-xl hover:text-accent-primary hover:border-accent-primary transition-all flex items-center justify-center shrink-0"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Content type</label>
                            <div className="bg-surface-sunken border border-border-subtle rounded-xl px-4 py-3 text-sm font-mono text-text-primary">
                                application/json
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Events to trigger</label>
                            <div className="flex flex-wrap gap-2">
                                {['Pushes', 'Pull requests', 'Pull request reviews', 'Check runs'].map(event => (
                                    <span key={event} className="px-2 py-1 rounded bg-surface-elevated border border-border-subtle text-[10px] font-bold text-text-primary uppercase tracking-wider">
                                        {event}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border-subtle/50 my-6 pt-6" />

                    {/* Configuration Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item 
                            name="github_repo_id" 
                            label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">GitHub Repository ID</span>}
                            tooltip="The numeric ID of your GitHub repository (e.g., 123456789)"
                        >
                            <Input placeholder="e.g. 123456789" className="dark-input" />
                        </Form.Item>

                        <Form.Item 
                            name="github_webhook_secret" 
                            label={<span className="text-xs font-bold uppercase tracking-widest text-text-muted">Webhook Secret (Optional)</span>}
                            tooltip="The secret you configured in GitHub to secure the webhook"
                        >
                            <Input.Password placeholder="Leave blank if not used" className="dark-input" />
                        </Form.Item>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-subtle flex justify-end">
                        <Button type="primary" htmlType="submit" loading={isUpdating} className="dark-btn-primary h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <ShieldAlert size={16} />
                            Save Configuration
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ProjectDashboard;
