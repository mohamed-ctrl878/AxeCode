import { useState, useCallback } from 'react';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';
import { toast } from 'react-hot-toast';

export const useWorkspace = (projectId) => {
    const [workspaceItems, setWorkspaceItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const workspaceRepo = repositoryRegistry.workspaceRepository;

    const fetchWorkspace = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await workspaceRepo.getWorkspace(projectId);
            const entities = (data || []).map(item => EntityMapper.toWorkspaceItem(item)).filter(Boolean);
            setWorkspaceItems(entities);
        } catch (err) {
            console.error('Failed to fetch workspace:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [projectId, workspaceRepo]);

    const createWorkspaceItem = async (data) => {
        if (!projectId) return null;
        setSaving(true);
        try {
            const response = await workspaceRepo.createWorkspaceItem(projectId, data);
            const entity = EntityMapper.toWorkspaceItem(response);
            if (entity) {
                setWorkspaceItems(prev => [...prev, entity]);
                toast.success('Draft created successfully!');
            }
            return entity;
        } catch (err) {
            console.error('Failed to create workspace item:', err);
            toast.error(err.message || 'Failed to create draft');
            return null;
        } finally {
            setSaving(false);
        }
    };

    const updateWorkspaceItem = async (itemId, data) => {
        if (!projectId) return false;
        setSaving(true);
        try {
            const response = await workspaceRepo.updateWorkspaceItem(projectId, itemId, data);
            const entity = EntityMapper.toWorkspaceItem(response);
            if (entity) {
                setWorkspaceItems(prev => prev.map(item => item.uid === itemId ? entity : item));
                toast.success('Saved draft successfully!');
            }
            return true;
        } catch (err) {
            console.error('Failed to update workspace item:', err);
            toast.error(err.message || 'Failed to save changes');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const deleteWorkspaceItem = async (itemId) => {
        if (!projectId) return false;
        try {
            await workspaceRepo.deleteWorkspaceItem(projectId, itemId);
            setWorkspaceItems(prev => prev.filter(item => item.uid !== itemId));
            toast.success('Deleted draft successfully!');
            return true;
        } catch (err) {
            console.error('Failed to delete workspace item:', err);
            toast.error(err.message || 'Failed to delete draft');
            return false;
        }
    };

    return {
        workspaceItems,
        loading,
        saving,
        error,
        fetchWorkspace,
        createWorkspaceItem,
        updateWorkspaceItem,
        deleteWorkspaceItem
    };
};
