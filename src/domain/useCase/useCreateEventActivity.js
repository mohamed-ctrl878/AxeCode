import { useState, useMemo } from 'react';
import { EventRepository } from '@infrastructure/repository/EventRepository';
import { toast } from 'react-hot-toast';

export const useCreateEventActivity = () => {
    const [inProgress, setInProgress] = useState(false);
    const eventRepo = useMemo(() => new EventRepository(), []);

    const createEventActivity = async (dtoData) => {
        setInProgress(true);
        try {
            const response = await eventRepo.createActivity(dtoData);
            return response;
        } catch (error) {
            console.error('[useCreateEventActivity] Error:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || "Failed to create activity";
            toast.error(`Activity Creation Failed: ${errorMessage}`);
            throw error;
        } finally {
            setInProgress(false);
        }
    };

    return { createEventActivity, inProgress };
};
