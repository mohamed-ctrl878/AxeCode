import React, { useEffect, useMemo } from 'react';
import { BookOpen, Calendar, Video, ArrowRight, Book } from 'lucide-react';
import { useFetchMyEntitlements } from '@domain/useCase/useFetchMyEntitlements';
import { useFetchCoursesByIds } from '@domain/useCase/useFetchCoursesByIds';
import { cn } from '@core/utils/cn';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

/**
 * EnrolledContentPage: Displays the user's purchased courses and events.
 * Refactored for URL-based nested routing (/my-content/:type).
 */
const EnrolledContentPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    
    // Normalize activeTab from URL, default to 'courses'
    const activeTab = type || 'courses'; 
    const contentType = activeTab === 'courses' ? 'course' : activeTab === 'events' ? 'upevent' : 'uplive';

    const { fetchMyEntitlements, entitlements, loading: loadingEntitlements, error: entError } = useFetchMyEntitlements();
    const { fetchCoursesByIds, courses, loading: loadingCourses, error: courseError } = useFetchCoursesByIds();

    // 1. Initial Load of Entitlements
    useEffect(() => {
        fetchMyEntitlements();
    }, [fetchMyEntitlements]);

    // 2. Secondary Fetch for Courses (Tiered)
    useEffect(() => {
        if (activeTab === 'courses' && entitlements.length > 0) {
            const courseIds = entitlements
                .filter(e => e.contentType === 'course' && e.targetDocumentId)
                .map(e => e.targetDocumentId);
            
            if (courseIds.length > 0) {
                fetchCoursesByIds(courseIds);
            }
        }
    }, [activeTab, entitlements, fetchCoursesByIds]);

    const tabs = [
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'live', label: 'Live Streams', icon: Video },
    ];

    // Filtered view logic
    const displayedItems = useMemo(() => {
        if (activeTab === 'courses') {
            return courses.map(course => ({
                id: course.uid,
                contentType: 'course',
                content: course
            }));
        }
        
        return entitlements
            .filter(e => e.contentType === contentType)
            .map(e => ({
                id: e.id,
                contentType: e.contentType,
                content: e.content,
                targetDocumentId: e.targetDocumentId
            }));
    }, [activeTab, contentType, entitlements, courses]);

    const isLoading = loadingEntitlements || (activeTab === 'courses' && loadingCourses && entitlements.length > 0);
    const hasError = entError || (activeTab === 'courses' && courseError);

    // Redirect to default if type is invalid
    if (type && !['courses', 'events', 'live'].includes(type)) {
        return <Navigate to={PATHS.ENROLLED_COURSES} replace />;
    }

    return (
        <div className="md:col-span-12 min-h-[calc(100vh-120px)] flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-accent-primary">
                    <div className="p-2 bg-accent-primary/5 rounded-lg ring-1 ring-accent-primary/10">
                        <BookOpen size={18} />
                    </div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] opacity-80">Knowledge Repository</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-serif text-text-primary tracking-tight">
                    The Scholar's Journey
                </h1>
                <p className="text-text-muted max-w-2xl text-lg font-sans leading-relaxed opacity-90">
                    Your collection of curated courses, intellectual events, and specialized learning modules.
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 p-1 bg-surface-sunken/50 backdrop-blur-sm rounded-2xl w-fit border border-border-subtle/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const countType = tab.id === 'courses' ? 'course' : tab.id === 'events' ? 'upevent' : 'uplive';
                    
                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(`${PATHS.ENROLLED_CONTENT}/${tab.id}`)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                isActive 
                                    ? "bg-surface shadow-sm text-accent-primary ring-1 ring-border-subtle" 
                                    : "text-text-muted hover:text-text-primary hover:bg-surface/50"
                            )}
                        >
                            <Icon size={16} className={cn("transition-transform", isActive && "scale-110")} />
                            {tab.label}
                            <span className={cn(
                                "ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
                                isActive ? "bg-accent-primary/10 text-accent-primary" : "bg-text-muted/10 text-text-muted"
                            )}>
                                {entitlements.filter(e => e.contentType === countType).length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-surface-sunken animate-pulse border border-border-subtle/30" />
                    ))
                ) : displayedItems.length > 0 ? (
                    displayedItems.map((item) => (
                        <ContentCard key={item.id} entitlement={item} />
                    ))
                ) : (
                    <EmptyState type={activeTab} />
                )}
            </div>
            
            {hasError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
                    Failed to sync with central node. Please retry connection.
                </div>
            )}
        </div>
    );
};

/**
 * Helper to extract a clean text snippet from Strapi Blocks or string description.
 */
const renderDescriptionSnippet = (description) => {
    if (!description) return 'Accessing content details from central repository...';
    
    // Handle string format
    if (typeof description === 'string') {
        return description.length > 90 ? description.substring(0, 90) + "..." : description;
    }

    // Handle Strapi JSON Blocks format
    if (Array.isArray(description)) {
        try {
            const firstBlock = description.find(b => b.type === 'paragraph') || description[0];
            if (firstBlock?.children) {
                const text = firstBlock.children.map(c => c.text).join(' ');
                return text.length > 90 ? text.substring(0, 90) + "..." : text;
            }
        } catch (e) {
            return 'Exploring curriculum parameters...';
        }
    }

    return 'Accessing course modules...';
};

const ContentCard = ({ entitlement }) => {
    const { content, contentType } = entitlement;
    
    const getLink = () => {
        const targetId = content?.uid || content?.documentId || content?.id;
        if (contentType === 'course') return PATHS.COURSE_DETAILS.replace(':id', targetId);
        if (contentType === 'upevent') return PATHS.EVENT_DETAILS.replace(':id', targetId);
        return '#';
    };

    // Calculate Learning Progress
    const lessonCount = content?.lessonCount || 0;
    const completedCount = content?.completedLessonsCount || 0;
    const progressPercent = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${url.startsWith('/') ? url : '/' + url}`;
    };

    return (
        <div className="group relative flex flex-col bg-surface hover:bg-surface-elevated rounded-2xl overflow-hidden transition-all duration-500 shadow-ring hover:shadow-halo hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-surface-sunken">
                {content?.thumbnail?.url ? (
                    <img 
                        src={getImageUrl(content.thumbnail.url)} 
                        alt={content.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent-primary/20">
                        <Book size={48} />
                    </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-surface-elevated/90 backdrop-blur-md rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider text-accent-primary shadow-ring">
                    {contentType === 'course' ? 'Enrolled' : 'Reserved'}
                </div>
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-surface-sunken px-2 py-1 rounded-md">
                        {content?.category?.name || (contentType === 'course' ? 'Masterclass' : 'Community Event')}
                    </span>
                    {contentType === 'course' && progressPercent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">
                            Learning
                        </span>
                    )}
                </div>
                
                <h3 className="text-2xl font-serif text-text-primary mb-3 line-clamp-1 group-hover:text-accent-primary transition-colors">
                    {content?.title || 'Course Module'}
                </h3>
                
                <p className="text-[15px] text-text-muted mb-6 h-12 line-clamp-2 leading-relaxed opacity-80">
                    {renderDescriptionSnippet(content?.description)}
                </p>

                {/* Learning Progress Section (Course Only) */}
                {contentType === 'course' && (
                    <div className="mb-6 space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-widest opacity-80">
                            <span>Progress</span>
                            <span className="text-accent-primary">{progressPercent}%</span>
                        </div>
                        <div className="h-1 w-full bg-surface-sunken rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-accent-primary rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between pt-5">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold opacity-70">
                            {contentType === 'course' ? 'Curriculum' : 'Status'}
                        </span>
                        <span className="text-xs font-semibold text-text-primary font-sans">
                            {contentType === 'course' 
                                ? `${completedCount} / ${lessonCount} Units` 
                                : 'Reserved'}
                        </span>
                    </div>
                    
                    <Link 
                        to={getLink()} 
                        className="btn-primary py-2 px-5"
                    >
                        Learn
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="absolute inset-0 ring-1 ring-inset ring-accent-primary/0 group-hover:ring-accent-primary/10 rounded-2xl transition-all pointer-events-none" />
        </div>
    );
};

const EmptyState = ({ type }) => {
    const labels = {
        courses: "No courses enrolled yet. Start your journey today.",
        events: "No upcoming events reserved.",
        live: "No live stream access found."
    };

    return (
        <div className="md:col-span-12 py-20 flex flex-col items-center justify-center text-center bento-card glass-morphism border-dashed border-2 border-border-subtle/50">
            <div className="w-20 h-20 rounded-full bg-surface-sunken flex items-center justify-center text-text-muted/30 mb-6">
                <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-serif text-text-primary mb-2">No Content Found</h3>
            <p className="text-text-muted max-w-sm mb-8">{labels[type]}</p>
            <Link 
                to={type === 'courses' ? PATHS.COURSES : PATHS.EVENTS}
                className="px-8 py-3 bg-surface hover:bg-surface-elevated border border-border-subtle rounded-2xl text-sm font-bold text-text-primary transition-all shadow-sm"
            >
                Browse Catalog
            </Link>
        </div>
    );
};

export default EnrolledContentPage;
