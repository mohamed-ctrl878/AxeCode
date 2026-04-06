import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useNotifications } from '@domain/useCase/useNotifications';
import { useNotificationSocket } from '@domain/useCase/useNotificationSocket';
import { NotificationList } from './NotificationList';

export const NotificationBell = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const { 
        notifications, 
        unreadCount, 
        isLoading, 
        fetchNotifications, 
        fetchUnreadCount, 
        markAsRead, 
        markAllAsRead,
        pushRealTimeNotification
    } = useNotifications();

    // Setup Socket connection globally when this bell mounts
    useNotificationSocket((payload) => {
        pushRealTimeNotification(payload);
    });

    // Initial Fetch when opening app/bell is mounted
    useEffect(() => {
        fetchUnreadCount();
        fetchNotifications({ pageSize: 20 }); 
    }, [fetchUnreadCount, fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative p-2 text-text-muted hover:text-text-primary rounded-xl transition-all group",
                    isOpen ? "bg-surface-dark text-text-primary" : "hover:bg-surface-dark"
                )}
            >
                <Bell size={20} className={cn(isOpen && "scale-110", "transition-transform duration-200")} />
                
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full border border-background flex items-center justify-center px-1 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationList 
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isLoading={isLoading}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
