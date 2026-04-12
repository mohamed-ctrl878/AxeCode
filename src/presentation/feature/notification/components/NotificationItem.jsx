import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Star, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '@presentation/routes/paths';

export const NotificationItem = ({ notification, onRead, onClick }) => {
    let Icon = Info;
    let iconColor = 'text-accent-primary';
    let bgPulse = '';

    switch (notification.type) {
        case 'like':
            Icon = Heart;
            iconColor = 'text-red-500';
            bgPulse = 'bg-red-500/10';
            break;
        case 'rate':
            Icon = Star;
            iconColor = 'text-yellow-500';
            bgPulse = 'bg-yellow-500/10';
            break;
        case 'comment':
            Icon = MessageSquare;
            iconColor = 'text-blue-500';
            bgPulse = 'bg-blue-500/10';
            break;
        case 'report':
        case 'content_reported':
            Icon = AlertTriangle;
            iconColor = 'text-orange-500';
            bgPulse = 'bg-orange-500/10';
            break;
    }

    const unreadStyles = !notification.read ? 'bg-surface-light border-l-4 border-l-accent-primary' : 'bg-surface';

    const handleActionClick = () => {
        // Mark as read immediately on click
        if (!notification.read) {
            onRead(notification.uid || notification.documentId);
        }

        // Determine navigation target
        let targetUrl = notification.actionUrl;

        if (!targetUrl && notification.contentType && notification.contentDocId) {
            const docId = notification.contentDocId;
            switch (notification.contentType) {
                case 'course':
                    targetUrl = PATHS.COURSE_DETAILS.replace(':id', docId);
                    break;
                case 'event':
                    targetUrl = PATHS.EVENT_DETAILS.replace(':id', docId);
                    break;
                case 'article':
                    targetUrl = PATHS.ARTICLE_DETAILS.replace(':id', docId);
                    break;
                case 'blog':
                    targetUrl = PATHS.FEED; // Currently feed is the main hub for blogs
                    break;
            }
        }

        if (targetUrl) {
            onClick(targetUrl);
        }
    };

    return (
        <div 
            onClick={handleActionClick}
            className={cn(
                "p-4 cursor-pointer hover:bg-surface-dark transition-all duration-200 border-b border-border-subtle last:border-0",
                unreadStyles
            )}
        >
            <div className="flex items-start gap-4">
                {/* Avatar / Icon Badge */}
                <div className="relative">
                    {notification.actor && notification.actor.avatar && notification.actor.avatar.url ? (
                        <img 
                            src={notification.actor.avatar.url} 
                            alt={notification.actor.username}
                            className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-dark border border-border-subtle flex items-center justify-center text-text-muted">
                            {notification.actor?.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}
                    
                    <div className={cn("absolute -bottom-1 -right-1 p-1 rounded-full", bgPulse)}>
                        <Icon size={12} className={iconColor} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium leading-snug">
                        {notification.messageEn}
                    </p>
                    
                    {notification.extra?.snippet && (
                        <p className="mt-1 text-xs text-text-muted truncate italic">
                            "{notification.extra.snippet}"
                        </p>
                    )}
                    {notification.extra?.rate && (
                        <div className="mt-1 flex items-center gap-1">
                             <Star size={12} className="text-yellow-500 fill-yellow-500" />
                             <span className="text-xs text-text-muted font-mono">{notification.extra.rate}</span>
                        </div>
                    )}

                    <p className="mt-2 text-[10px] text-text-disabled uppercase tracking-wider font-mono">
                        {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : 'now'}
                    </p>
                </div>

                {/* Unread dot */}
                {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-accent-primary mt-2 flex-shrink-0 glow-pulse" />
                )}
            </div>
        </div>
    );
};
