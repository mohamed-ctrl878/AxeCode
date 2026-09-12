import { useState, useCallback } from 'react';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { toast } from 'react-hot-toast';

export const useProjectMembers = (projectUid) => {
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [error, setError] = useState(null);

    const projectRepo = repositoryRegistry.projectRepository;

    const fetchRoles = useCallback(async () => {
        if (!projectUid) return;
        setLoadingRoles(true);
        setError(null);
        try {
            const data = await projectRepo.getRoles(projectUid);
            setRoles(data);
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            setError(err);
        } finally {
            setLoadingRoles(false);
        }
    }, [projectUid, projectRepo]);

    const assignRole = async (memberId, roleId) => {
        setIsAssigning(true);
        try {
            await projectRepo.assignMemberRole(projectUid, memberId, roleId);
            toast.success('Role assigned successfully!');
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to assign role');
            return false;
        } finally {
            setIsAssigning(false);
        }
    };

    const createRole = async (roleData) => {
        setIsCreatingRole(true);
        try {
            await projectRepo.createRole(projectUid, roleData);
            toast.success('Role created successfully!');
            fetchRoles(); // Refresh roles list automatically
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to create role');
            return false;
        } finally {
            setIsCreatingRole(false);
        }
    };

    return {
        roles,
        loadingRoles,
        isAssigning,
        isCreatingRole,
        error,
        fetchRoles,
        assignRole,
        createRole
    };
};
