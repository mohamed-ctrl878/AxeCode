import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from './NotificationItem';
import { CheckCheck, BellOff, ArrowRight } from 'lucide-react';
import { usePushSubscription } from '@domain/useCase/usePushSubscription';

export const NotificationList = ({ 
    notifications, 
    unreadCount, 
    isLoading, 
    onMarkAsRead, 
    onMarkAllAsRead,
    onClose 
}) => {
    const navigate = useNavigate();
    const { subscribeToWebPush } = usePushSubscription();
    console.log(notifications);

    const handleNavigate = (url) => {
        onClose();
        navigate(url);
    };

    return (
        <div className="fixed sm:absolute top-[70px] sm:top-full left-4 right-4 sm:left-auto sm:right-0 sm:mt-4 sm:w-80 md:w-96 glass overflow-hidden rounded-2xl border border-border-subtle shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-accent-primary/20 text-accent-primary text-xs px-2 py-0.5 rounded-full font-mono">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="text-xs text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1"
                    >
                        <CheckCheck size={14} />
                        Mark all
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col bg-background/95">
                {isLoading && notifications.length === 0 ? (
                    <div className="p-8 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center text-text-disabled">
                            <BellOff size={20} />
                        </div>
                        <p className="text-text-muted text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <NotificationItem 
                            key={notif.uid} 
                            notification={notif} 
                            onRead={onMarkAsRead}
                            onClick={handleNavigate}
                        />
                    ))
                )}
            </div>

            {/* Footer options */}
            <div className="p-3 border-t border-border-subtle bg-surface-dark flex items-center justify-between">
                <button 
                    onClick={() => subscribeToWebPush()}
                    className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
                >
                    Enable Push
                </button>
                <button 
                    onClick={() => { onClose(); /* Optional Full Settings Page */ }}
                    className="text-xs text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-1 group"
                >
                    View Settings
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
