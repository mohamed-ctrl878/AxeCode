import { useState, useMemo } from 'react';
import { EventRepository } from '@infrastructure/repository/EventRepository';
import { toast } from 'react-hot-toast';

export const useCreateEventScanner = () => {
    const [inProgress, setInProgress] = useState(false);
    const eventRepo = useMemo(() => new EventRepository(), []);

    const createEventScanner = async (dtoData) => {
        setInProgress(true);
        try {
            const response = await eventRepo.createScanner(dtoData);
            return response;
        } catch (error) {
            console.error('[useCreateEventScanner] Error:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || "Failed to authorize scanner";
            toast.error(`Auth Error: ${errorMessage}`);
            throw error;
        } finally {
            setInProgress(false);
        }
    };

    return { createEventScanner, inProgress };
};
