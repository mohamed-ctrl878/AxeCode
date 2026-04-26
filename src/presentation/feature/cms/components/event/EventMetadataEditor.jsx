import React, { useEffect } from 'react';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { useUpdateEvent } from '@domain/useCase/useUpdateEvent';
import { EventForm } from '@presentation/feature/event/components/EventForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const EventMetadataEditor = ({ eventId }) => {
    const { fetchEvent, event, loading: isFetching } = useFetchEvent();
    const { updateEvent, inProgress: isUpdating } = useUpdateEvent();

    useEffect(() => {
        if (eventId) fetchEvent(eventId);
    }, [eventId, fetchEvent]);

    const handleSubmit = async (dtoData, imageFile) => {
        console.log(dtoData, "dtoData")
        try {
            await updateEvent(eventId, dtoData);
            // In a real app, we might handle image upload here too if changed
            toast.success("Event metadata updated successfully!");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error("Failed to update event.");
        }
    };

    if (isFetching && !event) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Retrieving event manifest...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade-in">
            <EventForm 
                initialData={event} 
                isLoading={isUpdating} 
                onSubmit={handleSubmit} 
            />
        </div>
    );
};
