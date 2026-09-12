import React, { useState, useEffect } from 'react';
import { Users, Link2, Shield, Loader2, Check, X, Clock } from 'lucide-react';
import { Modal, Form, Select, Button, Input, Checkbox } from 'antd';
import { toast } from 'react-hot-toast';

import { useProjectMembers } from '@domain/useCase/project/useProjectMembers';
import { useJobTitleTags } from '@domain/useCase/project/useJobTitleTags';
import { useProjectApplications } from '@domain/useCase/project/useProjectApplications';
import { useProjectRole } from '@core/hooks/useProjectRole';
import { cn } from '@core/utils/cn';

const { Option } = Select;

export const ProjectMembers = ({ project, canManageMembers, projectApplication, onOpenApplyModal, onRefresh }) => {
    // Role Assignment Modal state
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [assignForm] = Form.useForm();

    // Role Creation Modal state
    const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
    const [createRoleForm] = Form.useForm();

    const { isMember, isPublisher } = useProjectRole(project);

    const {
        roles: projectRoles = [],
        loadingRoles,
        isAssigning,
        isCreatingRole,
        fetchRoles,
        assignRole,
        createRole
    } = useProjectMembers(project?.uid);

    const {
        tags: jobTitleTags = [],
        fetchTags: fetchJobTitleTags,
        loadingTags
    } = useJobTitleTags();

    const { 
        fetchApplications, 
        applications = [], 
        loadingApplications, 
        respondToApplication, 
        isResponding 
    } = useProjectApplications(project?.uid);

    useEffect(() => {
        if (project?.uid) {
            fetchRoles();
        }
    }, [project?.uid, fetchRoles]);

    useEffect(() => {
        if (canManageMembers && project?.uid) {
            fetchJobTitleTags();
            fetchApplications();
        }
    }, [canManageMembers, project?.uid, fetchJobTitleTags, fetchApplications]);

    // Role Assignment Submit
    const handleAssignSubmit = async (values) => {
        const memberId = selectedMember.documentId || selectedMember.id;
        const success = await assignRole(memberId, values.roleId);
        if (success) {
            setIsAssignModalOpen(false);
        }
    };

    const openAssignModal = (member) => {
        setSelectedMember(member);
        const currentRole = member.projectRole?.documentId || member.projectRole?.id;
        assignForm.setFieldsValue({ roleId: currentRole });
        setIsAssignModalOpen(true);
    };

    const handleCreateRoleSubmit = async (values) => {
        const permissions = {
            write_tasks: !!values.write_tasks,
            write_sprints: !!values.write_sprints,
            write_checkpoints: !!values.write_checkpoints,
            manage_members: !!values.manage_members
        };

        const payload = {
            custom_label: values.customLabel,
            job_title_tag: values.job_title_tag,
            permissions: permissions,
            project: project.id || project.documentId // link to project
        };

        const success = await createRole(payload);
        if (success) {
            setIsCreateRoleModalOpen(false);
            createRoleForm.resetFields();
        }
    };

    const pendingApplications = (applications || []).filter(app => app.status === 'pending');

    return (
        <div className="space-y-12">
            {/* Incoming Applications / Join Requests Section */}
            {canManageMembers && pendingApplications.length > 0 && (
                <section className="mb-10 bg-surface-elevated/40 border border-border-subtle p-6 rounded-[2rem] animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-serif text-text-primary flex items-center gap-3">
                            <Users className="text-accent-primary" /> Join Requests ({pendingApplications.length})
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {pendingApplications.map((app) => (
                            <div key={app.id || app.uid} className="bento-card p-6 bg-surface rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-accent-primary/30 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-xl font-serif text-accent-primary shrink-0 overflow-hidden">
                                        {app.user?.avatar?.url ? (
                                            <img src={app.user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            app.user?.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-text-primary font-bold truncate">@{app.user?.username}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-text-muted">Applied for:</span>
                                            <span className="px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase truncate">
                                                {app.projectRole?.custom_label || app.projectRole?.job_title_tag?.label_en || 'Member'}
                                            </span>
                                        </div>
                                        {app.message && (
                                            <p className="text-sm bg-surface-sunken border border-border-subtle/50 px-4 py-2.5 rounded-2xl text-text-muted italic mt-3 max-w-2xl font-sans text-xs">
                                                "{app.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 shrink-0 self-end md:self-center">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await respondToApplication(app.uid || app.id, 'accepted');
                                                toast.success(`Approved @${app.user?.username}!`);
                                                fetchApplications();
                                                if (onRefresh) onRefresh();
                                            } catch (err) {
                                                toast.error(err.message || 'Failed to approve application');
                                            }
                                        }}
                                        disabled={isResponding}
                                        className="px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        {isResponding ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} Approve
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await respondToApplication(app.uid || app.id, 'rejected');
                                                toast.success(`Rejected @${app.user?.username}.`);
                                                fetchApplications();
                                            } catch (err) {
                                                toast.error(err.message || 'Failed to reject application');
                                            }
                                        }}
                                        disabled={isResponding}
                                        className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        {isResponding ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />} Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Applicant Section: Your Application Status */}
            {!canManageMembers && projectApplication && (
                <section className="mb-10 bg-surface-elevated/40 border border-border-subtle p-6 rounded-[2rem] animate-in fade-in duration-300">
                    <h3 className="text-2xl font-serif text-text-primary flex items-center gap-3 mb-6">
                        <Clock className="text-accent-primary" /> Your Join Request
                    </h3>
                    
                    <div className="bento-card p-6 bg-surface rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Target Role:</span>
                                <span className="px-2.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary text-[10px] font-mono font-bold uppercase">
                                    {projectApplication.projectRole?.custom_label || projectApplication.projectRole?.job_title_tag?.label_en || 'Member'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Application Status:</span>
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                                    projectApplication.status === 'pending'
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        : projectApplication.status === 'rejected'
                                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                                            : "bg-green-500/10 text-green-400 border-green-500/20"
                                )}>
                                    {projectApplication.status}
                                </span>
                            </div>
                            {projectApplication.message && (
                                <p className="text-sm bg-surface-sunken border border-border-subtle/50 px-4 py-2.5 rounded-xl text-text-muted italic mt-4 font-sans text-xs max-w-2xl">
                                    "{projectApplication.message}"
                                </p>
                            )}
                        </div>
                        
                        {projectApplication.status === 'rejected' && (
                            <button
                                onClick={() => onOpenApplyModal && onOpenApplyModal()}
                                className="px-5 py-3 bg-surface-elevated border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-widest rounded-xl transition-all shrink-0 self-end md:self-center cursor-pointer"
                            >
                                Apply for another role
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* Active Members */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-serif text-text-primary flex items-center gap-3">
                        <Users className="text-accent-primary" /> Active Members ({project.members?.length || 0})
                    </h3>
                    {canManageMembers && (
                        <button 
                            onClick={() => setIsCreateRoleModalOpen(true)}
                            className="px-4 py-2 bg-surface-elevated border border-border-subtle hover:border-accent-primary text-text-primary hover:text-accent-primary font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                        >
                            + Custom Role
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(project.members || []).map((member, i) => (
                        <div key={i} className="bento-card p-6 bg-surface rounded-3xl flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-xl font-serif text-accent-primary shrink-0 overflow-hidden">
                                {member.user?.avatar?.url ? (
                                    <img src={member.user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    member.user?.username?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-text-primary font-bold truncate">{member.user?.username}</h4>
                                 <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary text-[10px] font-mono uppercase truncate max-w-full">
                                        {member.projectRole?.customLabel || member.projectRole?.jobTitleTag?.labelEn || member.project_role?.custom_label || member.project_role?.job_title_tag?.label_en || 'Member'}
                                    </span>
                                </div>
                            </div>
                            {/* Permissions & Actions */}
                            <div className="flex flex-col gap-2 shrink-0 items-end">
                                <span className="px-2 py-0.5 rounded bg-surface-sunken text-text-muted text-[9px] font-mono uppercase border border-border-subtle max-w-[80px] truncate" title={JSON.stringify(member.projectRole?.permissions || member.project_role?.permissions)}>
                                    {(member.projectRole?.permissions?.admin || member.project_role?.permissions?.admin) ? 'Admin' : 'Custom'}
                                </span>
                                
                                {canManageMembers && (
                                    <button 
                                        onClick={() => openAssignModal(member)}
                                        className="text-[10px] font-bold text-text-muted hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                    >
                                        <Shield size={12} /> Assign Role
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Project Roles */}
            <section>
                <h3 className="text-2xl font-serif text-text-primary mb-6 flex items-center gap-3">
                    <Link2 className="text-accent-primary" /> Project Roles ({projectRoles?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(projectRoles || []).map((role, i) => (
                        <div key={i} className="bento-card p-6 bg-surface border border-dashed border-border-subtle hover:border-accent-primary/50 transition-colors rounded-3xl flex flex-col">
                            <h4 className="text-lg font-serif text-text-primary mb-4">
                                {role.custom_label || role.job_title_tag?.label_en}
                            </h4>
                            <div className="space-y-2 mb-6 flex-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Required Level</span>
                                    <span className="text-text-primary font-mono">{role.required_level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Available Slots</span>
                                    <span className="text-text-primary font-mono">{role.slots}</span>
                                </div>
                            </div>
                            {!isMember && !isPublisher && role.is_open !== false ? (
                                <button 
                                    onClick={() => onOpenApplyModal && onOpenApplyModal(role.documentId || role.uid || role.id)}
                                    className="w-full py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-text-primary font-bold text-xs uppercase tracking-widest hover:text-accent-primary hover:border-accent-primary transition-all cursor-pointer"
                                >
                                    Apply for Role
                                </button>
                            ) : (
                                <button 
                                    disabled
                                    className="w-full py-2.5 rounded-xl bg-surface-sunken border border-border-subtle/20 text-text-muted/50 font-bold text-xs uppercase tracking-widest cursor-not-allowed"
                                >
                                    {isMember || isPublisher ? 'Joined Project' : 'Closed'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal: Assign Role */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Shield size={18} className="text-accent-primary" /> Assign Role to {selectedMember?.user?.username}</span>}
                open={isAssignModalOpen}
                onCancel={() => setIsAssignModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={assignForm} layout="vertical" onFinish={handleAssignSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="roleId" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Select Role</span>} rules={[{ required: true, message: 'Please select a role' }]}>
                        <Select placeholder="Choose a project role..." className="dark-select w-full" dropdownClassName="dark-select-dropdown" loading={loadingRoles}>
                            {projectRoles.map(r => (
                                <Option key={r.documentId || r.id} value={r.documentId || r.id}>
                                    {r.custom_label || r.job_title_tag?.label_en || `Role ${r.id}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsAssignModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isAssigning} className="dark-btn-primary">Assign Role</Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal: Create Custom Role */}
            <Modal
                title={<span className="text-base font-bold text-text-primary flex items-center gap-2"><Users size={18} className="text-accent-primary" /> Create Custom Role</span>}
                open={isCreateRoleModalOpen}
                onCancel={() => setIsCreateRoleModalOpen(false)}
                footer={null}
                className="dark-modal"
                centered
            >
                <Form form={createRoleForm} layout="vertical" onFinish={handleCreateRoleSubmit} className="pt-4 flex flex-col gap-3">
                    <Form.Item name="customLabel" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Role Name</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="e.g. Senior Developer, Scum Master..." className="dark-input" />
                    </Form.Item>

                    <Form.Item name="job_title_tag" label={<span className="text-xs font-bold uppercase tracking-wider text-text-muted">Base Job Title</span>} rules={[{ required: true, message: 'Required' }]}>
                        <Select placeholder="Select a base job title..." className="dark-select w-full" dropdownClassName="dark-select-dropdown" loading={loadingTags}>
                            {(jobTitleTags || []).map(tag => (
                                <Option key={tag.id || tag.documentId} value={tag.id || tag.documentId}>
                                    {tag.labelEn}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-3">Granular Permissions</span>
                        <div className="space-y-3 bg-surface-sunken p-4 rounded-xl border border-border-subtle">
                            <Form.Item name="write_tasks" valuePropName="checked" className="mb-0">
                                <Checkbox className="text-text-primary">Manage Tasks (Create, Move, Complete)</Checkbox>
                            </Form.Item>
                            <Form.Item name="write_sprints" valuePropName="checked" className="mb-0">
                                <Checkbox className="text-text-primary">Manage Sprints (Create, Start, Complete)</Checkbox>
                            </Form.Item>
                            <Form.Item name="write_checkpoints" valuePropName="checked" className="mb-0">
                                <Checkbox className="text-text-primary">Manage Checkpoints (Create, Delete)</Checkbox>
                            </Form.Item>
                            <Form.Item name="manage_members" valuePropName="checked" className="mb-0">
                                <Checkbox className="text-text-primary">Manage Members (Assign Roles)</Checkbox>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle/50 mt-2">
                        <Button onClick={() => setIsCreateRoleModalOpen(false)} className="dark-btn-secondary">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingRole} className="dark-btn-primary">Create Role</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
