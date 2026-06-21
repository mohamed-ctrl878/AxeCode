import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Users, Activity, ExternalLink } from 'lucide-react';
import { cn } from '@core/utils/cn';

export const ProjectCard = ({ project }) => {
    return (
        <div className="bento-card bg-surface hover:border-accent-primary/50 transition-all duration-300 rounded-[2rem] p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start gap-4 mb-4">
                <Link to={`/projects/${project.uid}`} className="flex-1">
                    <h3 className="text-2xl font-serif text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                        {project.title}
                    </h3>
                </Link>
                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 border",
                    project.status === 'active' 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-surface-sunken text-text-muted border-border-subtle"
                )}>
                    {project.status || 'Unknown'}
                </div>
            </div>
            
            <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                {project.description || "No description provided for this project."}
            </p>

            {project.publisher && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center overflow-hidden shrink-0">
                        {project.publisher.avatar?.url ? (
                            <img src={project.publisher.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[10px] font-bold text-accent-primary uppercase">
                                {project.publisher.username?.charAt(0) || '?'}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-text-muted font-medium">
                        By <span className="text-text-primary font-bold">@{project.publisher.username}</span>
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border-subtle/50">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-mono uppercase flex items-center gap-1.5">
                        <Activity size={12} />
                        {project.methodology || 'Agile'}
                    </span>
                    
                    {project.githubRepoUrl && (
                        <span className="px-2.5 py-1 rounded-lg bg-surface-sunken border border-border-subtle text-text-primary text-[10px] font-mono flex items-center gap-1.5">
                            <Github size={12} />
                            GitHub Linked
                        </span>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-surface-sunken border border-border-subtle text-text-muted text-[10px] font-mono flex items-center gap-1.5 ml-auto">
                        <Users size={12} />
                        {project.members?.length || 0} Members
                    </span>
                </div>
                
                {project.engagementScore > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-widest mb-1.5">
                            <span>Engagement</span>
                            <span className="text-accent-primary">{Math.min(project.engagementScore, 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-accent-primary rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(project.engagementScore, 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <Link 
                    to={`/projects/${project.uid}`}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-elevated border border-border-subtle text-text-primary font-bold text-xs uppercase tracking-widest hover:border-accent-primary hover:text-accent-primary transition-all active:scale-[0.98]"
                >
                    View Project
                    <ExternalLink size={14} />
                </Link>
            </div>
        </div>
    );
};
