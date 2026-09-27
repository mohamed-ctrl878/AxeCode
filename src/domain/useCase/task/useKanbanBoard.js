import { useCallback, useMemo, useRef } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';

// Auto-refresh interval in milliseconds (15s when tab is visible)
const REFRESH_INTERVAL_MS = 15000;

export const useKanbanBoard = (projectId) => {
    const repository = useMemo(() => repositoryRegistry.taskRepository, []);

    // ─── Fetch tasks ─────────────────────────────────────────────────────────
    const fetchLogic = useCallback(async () => {
        if (!projectId) return [];
        const result = await repository.getTasks(projectId);
        return result.map(dto => EntityMapper.toTask(dto));
    }, [repository, projectId]);

    const {
        execute: fetchTasks,
        returnedData: tasks,
        inProgress: loadingTasks,
        error: tasksError,
    } = useAsyncUseCase(fetchLogic);

    // ─── Silent refresh (no loading spinner) ─────────────────────────────────
    // Returns a stable ref so the polling interval can always call the latest version
    const fetchTasksRef = useRef(fetchTasks);
    fetchTasksRef.current = fetchTasks;

    const startPolling = useCallback(() => {
        if (!projectId) return () => {};

        const id = setInterval(() => {
            // Only refresh when the browser tab is visible to avoid wasted requests
            if (document.visibilityState === 'visible') {
                fetchTasksRef.current?.();
            }
        }, REFRESH_INTERVAL_MS);

        return () => clearInterval(id);
    }, [projectId]);

    // ─── Transition Task Status ───────────────────────────────────────────────
    const transitionLogic = useCallback(async (taskId, newStatus) => {
        const result = await repository.transitionTask(projectId, taskId, newStatus);
        return EntityMapper.toTask(result);
    }, [repository, projectId]);

    const { execute: transitionTask, inProgress: isTransitioning } = useAsyncUseCase(transitionLogic);

    // ─── Reorder Tasks ────────────────────────────────────────────────────────
    const reorderLogic = useCallback(async (taskOrders) => {
        return await repository.reorderTasks(projectId, taskOrders);
    }, [repository, projectId]);

    const { execute: reorderTasks, inProgress: isReordering } = useAsyncUseCase(reorderLogic);

    // ─── Create Task ──────────────────────────────────────────────────────────
    const createLogic = useCallback(async (taskData) => {
        const result = await repository.createTask(projectId, taskData);
        return EntityMapper.toTask(result);
    }, [repository, projectId]);

    const { execute: createTask, inProgress: isCreatingTask } = useAsyncUseCase(createLogic);

    // ─── Delete Task ──────────────────────────────────────────────────────────
    const deleteLogic = useCallback(async (taskId) => {
        return await repository.deleteTask(projectId, taskId);
    }, [repository, projectId]);

    const { execute: deleteTask, inProgress: isDeletingTask } = useAsyncUseCase(deleteLogic);

    return {
        fetchTasks,
        tasks,
        loadingTasks,
        tasksError,
        startPolling,        // call this in KanbanBoard's useEffect → returns cleanup fn
        transitionTask,
        isTransitioning,
        reorderTasks,
        isReordering,
        createTask,
        isCreatingTask,
        deleteTask,
        isDeletingTask,
    };
};
