import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useKanbanBoard = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.taskRepository, []);

    // Fetch tasks
    const fetchLogic = useCallback(async () => {
        if (!projectId) return [];
        const result = await repository.getTasks(projectId);
        return result.map(dto => EntityMapper.toTask(dto));
    }, [repository, projectId]);

    const { execute: fetchTasks, returnedData: tasks, inProgress: loadingTasks, error: tasksError } = useAsyncUseCase(fetchLogic);

    // Transition Task Status
    const transitionLogic = useCallback(async (taskId, newStatus) => {
        const result = await repository.transitionTask(projectId, taskId, newStatus);
        return EntityMapper.toTask(result);
    }, [repository, projectId]);

    const { execute: transitionTask, inProgress: isTransitioning } = useAsyncUseCase(transitionLogic);

    // Reorder Tasks
    const reorderLogic = useCallback(async (taskOrders) => {
        // taskOrders = [{ documentId, order }]
        return await repository.reorderTasks(projectId, taskOrders);
    }, [repository, projectId]);

    const { execute: reorderTasks, inProgress: isReordering } = useAsyncUseCase(reorderLogic);

    // Create Task
    const createLogic = useCallback(async (taskData) => {
        const result = await repository.createTask(projectId, taskData);
        return EntityMapper.toTask(result);
    }, [repository, projectId]);

    const { execute: createTask, inProgress: isCreatingTask } = useAsyncUseCase(createLogic);

    // Delete Task
    const deleteLogic = useCallback(async (taskId) => {
        return await repository.deleteTask(projectId, taskId);
    }, [repository, projectId]);

    const { execute: deleteTask, inProgress: isDeletingTask } = useAsyncUseCase(deleteLogic);

    return {
        fetchTasks,
        tasks,
        loadingTasks,
        tasksError,
        transitionTask,
        isTransitioning,
        reorderTasks,
        isReordering,
        createTask,
        isCreatingTask,
        deleteTask,
        isDeletingTask
    };
};
