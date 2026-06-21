import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useProjectApplications = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.projectRepository, []);

    // Get Applications
    const fetchLogic = useCallback(async () => {
        if (!projectId) return [];
        const result = await repository.getProjectApplications(projectId);
        return result.map(dto => EntityMapper.toProjectApplication(dto));
    }, [repository, projectId]);

    const { execute: fetchApplications, returnedData: applications, inProgress: loadingApplications } = useAsyncUseCase(fetchLogic);

    // Apply
    const applyLogic = useCallback(async (data) => {
        const result = await repository.applyToRole(projectId, data);
        return EntityMapper.toProjectApplication(result);
    }, [repository, projectId]);

    const { execute: applyToRole, inProgress: isApplying } = useAsyncUseCase(applyLogic);

    // Respond (Accept/Reject)
    const respondLogic = useCallback(async (applicationId, status) => {
        const result = await repository.respondToApplication(applicationId, status);
        return EntityMapper.toProjectApplication(result);
    }, [repository]);

    const { execute: respondToApplication, inProgress: isResponding } = useAsyncUseCase(respondLogic);

    // Get My Applications
    const fetchMyApplicationsLogic = useCallback(async () => {
        const result = await repository.getMyApplications();
        return (result || []).map(dto => EntityMapper.toProjectApplication(dto));
    }, [repository]);

    const { execute: fetchMyApplications, returnedData: myApplications, inProgress: loadingMyApplications } = useAsyncUseCase(fetchMyApplicationsLogic);

    return {
        fetchApplications,
        applications,
        loadingApplications,
        applyToRole,
        isApplying,
        respondToApplication,
        isResponding,
        fetchMyApplications,
        myApplications,
        loadingMyApplications
    };
};
