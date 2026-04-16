import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CreatePost } from '../components/CreatePost';
import { FeedItem } from '../components/FeedItem';
import { EventAds } from '../components/EventAds';
import { FeedFilters } from '../components/FeedFilters';
import { CreateBlogModal } from '../components/CreateBlogModal';
import { useFetchBlogs } from '@domain/useCase/useFetchBlogs';
import { FeedItemSkeleton } from '@presentation/shared/components/skeletons/FeedItemSkeleton';
import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';
import { useParams } from 'react-router-dom';
import { useFetchBlog } from '@domain/useCase/useFetchBlog';

/**
 * FeedPage: Assembly of social and knowledge components.
 * Follows Bento Grid layout patterns with Infinite Scroll support.
 */
const FeedPage = () => {
    const { id: blogId } = useParams();
    const [activeFilter, setActiveFilter] = useState('recommend');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { fetchBlogs, blogs, loading, error, hasMore, resetBlogs } = useFetchBlogs();
    const { fetchBlog, blog: linkedBlog, loading: linkedLoading } = useFetchBlog();
    
    const observerTarget = useRef(null);
    const stateRef = useRef({ loading, hasMore, blogsLength: blogs?.length || 0, activeFilter: 'recommend' });

    /** Immediately unmount data and show loader when switching filters */
    const handleFilterChange = useCallback((newFilter) => {
        if (newFilter === activeFilter) return;
        resetBlogs();
        setActiveFilter(newFilter);
    }, [activeFilter, resetBlogs]);

    // Initial Fetch & Refetch on Filter Change (Only if NOT viewing a specific blog)
    useEffect(() => {
        if (!blogId) {
            fetchBlogs(true, 20, activeFilter);
        }
    }, [fetchBlogs, activeFilter, blogId]);

    // Fetch linked blog if ID is in the URL
    useEffect(() => {
        if (blogId) {
            fetchBlog(blogId);
        }
    }, [blogId, fetchBlog]);

    useEffect(() => {
        stateRef.current = { loading, hasMore, blogsLength: blogs?.length || 0, activeFilter };
    }, [loading, hasMore, blogs?.length, activeFilter]);

    // Intersection Observer attached to the bottom element
    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                const state = stateRef.current;
                
                // If the target is visible and we are allowed to fetch

                if (
                    target.isIntersecting && 
                    state.hasMore && 
                    !state.loading && 
                    state.blogsLength > 0
                ) {
                    fetchBlogs(false, 20, state.activeFilter); // Fetch next page
                }
            },
            { threshold: 0.1, rootMargin: '0px' } 
        );

        observer.observe(element);
        
        return () => {
            if (observer) observer.disconnect();
        };
    }, [fetchBlogs, blogs?.length]);

    // Determine loading state: 
    // If specific blogId is present, we only care about linkedLoading.
    // If not, we care about the general loading state.
    const isInitialLoad = blogId 
        ? (linkedLoading && !linkedBlog) 
        : (loading && (!blogs || blogs.length === 0));

    return (
        <React.Fragment>
            {/* Sidebar Column - Narrower layout (3 cols) */}
            <aside className="md:col-span-3 flex flex-col gap-6 md:order-2">
                <EventAds />
                <FeedFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            </aside>

            {/* Main Feed Column - Wider layout (9 cols) */}
            <div className="md:col-span-9 flex flex-col gap-6 md:order-1">

                <CreatePost onClick={() => setIsCreateModalOpen(true)} />
                
                {/* Content skeletons shown during initial load / filter switch */}
                {isInitialLoad && (
                    <div className="py-12">
                        <PageLoader />
                    </div>
                )}

                {error && !isInitialLoad && (
                    <div className="bento-card p-4 border border-red-500/30 bg-red-500/5 rounded-2xl text-sm text-red-400">
                        Failed to load feed. Please try again later.
                    </div>
                )}

                {/* Feed list — key forces full unmount/remount on filter change */}
                {!isInitialLoad && (
                    <div key={activeFilter} className="flex flex-col gap-6 min-h-screen">
                        {/* 1. Show Linked Blog if loading or exists */}
                        {blogId && (
                            <div className="flex flex-col gap-4 bento-card border-none bg-accent-primary/5 p-1 rounded-[2.5rem]">
                                <div className="px-6 pt-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-primary">Linked Discussion</span>
                                </div>
                                {linkedLoading ? (
                                    <div className="p-8">
                                        <FeedItemSkeleton />
                                    </div>
                                ) : linkedBlog ? (
                                    <FeedItem blog={linkedBlog} highlight={true} />
                                ) : (
                                    <div className="p-8 text-center text-text-muted text-xs italic">
                                        Post not found or unavailable.
                                    </div>
                                )}
                                <div className="h-px bg-border-subtle/30 mx-6" />
                            </div>
                        )}

                        {/* 2. Show regular feed, filtering out the linked blog to avoid duplication */}
                        {(blogs || []).filter(b => b.id !== linkedBlog?.id).map((blog, index) => (
                            <FeedItem 
                                key={blog.id || index} 
                                blog={blog} 
                                rank={activeFilter === 'trend' ? index + 1 : null} 
                            />
                        ))}

                        {/* Intersection Observer Target (Hidden if viewing specific linked blog) */}
                        {!blogId && (
                            <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-4 border border-dashed border-accent-primary/20 rounded-xl">
                                {loading && blogs.length > 0 && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs text-text-muted font-mono uppercase tracking-widest">Loading more...</span>
                                    </div>
                                )}
                                {!hasMore && blogs.length > 0 && (
                                    <div className="text-xs text-text-muted text-center italic py-2">
                                        You have logically reached the absolute end of the feed.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateBlogModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Refetch blogs
                    fetchBlogs(true, 20, activeFilter);
                }}
            />
        </React.Fragment>
    );
};

export default FeedPage;
