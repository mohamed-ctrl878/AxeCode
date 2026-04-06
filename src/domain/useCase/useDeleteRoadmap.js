import { useState } from 'react';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';

/**
 * Domain UseCase for deleting a Roadmap.
 */
export const useDeleteRoadmap = () => {
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(null);

    const deleteRoadmap = async (id) => {
        setInProgress(true);
        setError(null);
        try {
            await repositoryRegistry.roadmapRepository.delete(id);
            return true;
        } catch (err) {
            console.error("Error deleting roadmap:", err);
            setError(err.response?.data?.error?.message || err.message || "Failed to delete roadmap.");
            return false;
        } finally {
            setInProgress(false);
        }
    };

    return { deleteRoadmap, inProgress, error };
};
