import { useState } from 'react';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { RoadmapRepository } from '@infrastructure/repository/RoadmapRepository';

/**
 * Domain UseCase for uploading a new Flowchart/Roadmap to the backend.
 * Encapsulates communication with RoadmapRepository and tracks loading states.
 */
export const useUploadRoadmap = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    /**
     * @param {object} roadmapData - Raw data from UI
     * @param {string} roadmapData.title
     * @param {object} roadmapData.flowData
     * @param {string} roadmapData.color
     * @param {string} roadmapData.description
     */
    const uploadRoadmap = async (roadmapData, updateId = null) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const roadmapRepository = new RoadmapRepository();
            // Send to Repository (Infrastructure Layer)
            const response = updateId 
                ? await roadmapRepository.update(updateId, roadmapData)
                : await roadmapRepository.create(roadmapData);

            if (response) {
                setSuccess(true);
                return response;
            } else {
                throw new Error("Failed to upload roadmap. Invalid response received.");
            }
        } catch (err) {
            console.error("[useUploadRoadmap] Error uploading roadmap:", err);
            setError(err.response?.data?.error?.message || err.message || "An unexpected error occurred during upload.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadRoadmap,
        loading,
        error,
        success,
        resetStatus: () => {
            setError(null);
            setSuccess(false);
        }
    };
};
