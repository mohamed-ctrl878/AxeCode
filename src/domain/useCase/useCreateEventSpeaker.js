import { useState, useMemo } from 'react';
import { EventRepository } from '@infrastructure/repository/EventRepository';
import { toast } from 'react-hot-toast';

export const useCreateEventSpeaker = () => {
    const [inProgress, setInProgress] = useState(false);
    const eventRepo = useMemo(() => new EventRepository(), []);

    const createEventSpeaker = async (dtoData) => {
        setInProgress(true);
        try {
            const response = await eventRepo.createSpeaker(dtoData);
            return response;
        } catch (error) {
            console.error('[useCreateEventSpeaker] Error:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || "Failed to organize speaker";
            toast.error(`Speaker Orchestration Failed: ${errorMessage}`);
            throw error;
        } finally {
            setInProgress(false);
        }
    };

    return { createEventSpeaker, inProgress };
};
