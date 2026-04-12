import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

/**
 * CommentItem - Individual comment card.
 * @param {Object} props
 * @param {import('@domain/entity/CommentEntity').CommentEntity} props.comment
 * @param {number} props.index - For animation delay
 */
export const CommentItem = ({ comment, index }) => {
    const navigate = useNavigate();
    
    const renderBody = (body) => {
        if (!body) return '';
        if (typeof body === 'string') return body;
        if (Array.isArray(body)) {
            return body.flatMap(block => block?.children || [])
                       .map(child => child?.text || '')
                       .join('\n');
        }
        return JSON.stringify(body);
    };

    return (
        <div 
            className="flex gap-4 animate-slide-up" 
            style={{ animationDelay: `${(index % 10) * 50}ms` }}
        >
            <div 
                className="w-10 h-10 rounded-full bg-surface-dark border border-border-subtle flex items-center justify-center shrink-0 overflow-hidden shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                    if(comment.author?.username) {
                        navigate(PATHS.PROFILE.replace(':username', comment.author.username));
                    }
                }}
            >
                {comment.author?.avatar?.url ? (
                    <img src={comment.author.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-text-primary font-bold text-sm">
                        {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                )}
            </div>
            <div className="flex-1 bg-surface rounded-2xl p-4 border border-border-subtle shadow-sm hover:border-accent-primary/20 transition-all">
                <div className="flex items-baseline justify-between mb-2">
                    <span 
                        onClick={() => {
                            if(comment.author?.username) {
                                navigate(PATHS.PROFILE.replace(':username', comment.author.username));
                            }
                        }}
                        className="font-bold text-sm hover:text-accent-primary cursor-pointer transition-colors"
                    >
                        @{comment.author?.username || 'user'}
                    </span>
                    {comment.createdAt && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                            <Clock size={10} /> {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            })}
                        </span>
                    )}
                </div>
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {renderBody(comment.body || comment.content)}
                </p>
            </div>
        </div>
    );
};
