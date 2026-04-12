import React, { useState } from 'react';
import { FeedItem } from '@presentation/feature/feed/components/FeedItem';
import { ArticleCard } from '@presentation/feature/article/components/ArticleCard';
import { CourseCard } from '@presentation/feature/course/components/CourseCard';
import { BookOpen, FileText, Layout, Users, Code, Box } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * ProfileTabs: Switches between different authored content types.
 * Reuses core system components (FeedItem, ArticleCard, CourseCard) for consistency.
 */
export const ProfileTabs = ({ 
    user, 
    blogs = [], 
    articles = [], 
    courses = [],
    counts = {},
    loadingStates = {},
    hasMore = {},
    onLoadMore
}) => {
    const [activeTab, setActiveTab] = useState('blogs');

    // Infinite Scroll Sentinel
    const sentinelRef = React.useRef(null);

    React.useEffect(() => {
        if (!sentinelRef.current || !hasMore[activeTab] || loadingStates[activeTab]) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                onLoadMore?.(activeTab);
            }
        }, { threshold: 0.1 });

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [activeTab, hasMore, loadingStates, onLoadMore]);

    const tabs = [
        { id: 'blogs', label: 'Blogs', icon: Layout, count: counts.blogs || 0 },
        { id: 'articles', label: 'Articles', icon: FileText, count: counts.articles || 0 },
        { id: 'courses', label: 'Courses', icon: BookOpen, count: counts.courses || 0 },
        { id: 'workspaces', label: 'Workspaces', icon: Code, isComingSoon: true },
        { id: 'collabs', label: 'Collaborations', icon: Users, isComingSoon: true },
    ];

    const renderContent = () => {
        const tab = tabs.find(t => t.id === activeTab);
        
        if (tab?.isComingSoon) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-surface/20 border border-dashed border-border-subtle rounded-[2rem] animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-6 border border-border-subtle">
                        <tab.icon size={24} className="text-text-muted" />
                    </div>
                    <h2 className="text-2xl font-serif text-text-primary mb-2">Architectural Portal Locked</h2>
                    <div className="px-4 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] mb-4">
                        COMING SOON INSHAA ALLAH
                    </div>
                    <p className="text-text-muted text-sm max-w-sm text-center leading-relaxed">
                        We are currently calibrating the collaborative environment for peer-to-peer node synchronization.
                    </p>
                </div>
            );
        }

        const itemsRaw = activeTab === 'blogs' ? blogs : activeTab === 'articles' ? articles : courses;
        const isEmpty = itemsRaw.length === 0 && !loadingStates[activeTab];

        if (isEmpty) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-surface/10 border border-border-subtle/30 rounded-[2rem]">
                    <Box size={40} className="text-text-muted/20 mb-4" />
                    <p className="text-text-muted font-mono text-xs uppercase tracking-widest">No transmitted data packets found</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'blogs' && blogs.map((blog, idx) => (
                    <FeedItem key={blog.id || blog.uid || idx} blog={blog} />
                ))}

                {activeTab === 'articles' && (
                    <div className="grid grid-cols-1 gap-8">
                        {articles.map((article, idx) => (
                            <ArticleCard key={article.id || article.uid || idx} article={article} />
                        ))}
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {courses.map((course, idx) => (
                            <CourseCard key={course.id || course.uid || idx} course={course} />
                        ))}
                    </div>
                )}

                {/* Sentinel & Loading Indication */}
                <div ref={sentinelRef} className="h-24 flex items-center justify-center">
                    {loadingStates[activeTab] && (
                        <div className="flex items-center gap-3 text-text-muted text-xs font-mono uppercase tracking-widest animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
                            Synchronizing next batch...
                        </div>
                    )}
                    {!hasMore[activeTab] && itemsRaw.length > 0 && (
                        <div className="text-[10px] text-text-muted/40 font-mono uppercase tracking-[0.2em]">
                            End of transmitted data
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Standardized Tab Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shrink-0 font-medium text-sm",
                            activeTab === tab.id 
                                ? "bg-accent-primary/5 border-accent-primary/30 text-accent-primary shadow-halo" 
                                : "bg-surface/50 border-border-subtle text-text-muted hover:text-text-primary hover:border-border-default"
                        )}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                        {!tab.isComingSoon && (
                            <span className="px-1.5 py-0.5 rounded-md bg-surface-sunked border border-border-subtle text-[10px] font-mono">
                                {tab.count}
                            </span>
                        )}
                        {tab.isComingSoon && <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/40" />}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};
