import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CreatePost } from '../components/CreatePost';
import { FeedItem } from '../components/FeedItem';
import { EventAds } from '../components/EventAds';
import { FeedFilters } from '../components/FeedFilters';
import { useFetchBlogs } from '@domain/useCase/useFetchBlogs';

/**
 * FeedPage: Assembly of social and knowledge components.
 * Follows Bento Grid layout patterns with Infinite Scroll support.
 */
const FeedPage = () => {
    const [activeFilter, setActiveFilter] = useState('latest');
    const { fetchBlogs, blogs, loading, error, hasMore } = useFetchBlogs();
    const observerTarget = useRef(null);
    const hasFetched = useRef(false);
    const stateRef = useRef({ loading, hasMore, blogsLength: blogs?.length || 0 });

    // Initial Fetch (RESTORED - Accidental Deletion)
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchBlogs(true);
        }
    }, [fetchBlogs]);

    useEffect(() => {
        stateRef.current = { loading, hasMore, blogsLength: blogs?.length || 0 };
    }, [loading, hasMore, blogs?.length]);

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
                    fetchBlogs(false); // Fetch next page
                }
            },
            { threshold: 0.1, rootMargin: '0px' } 
        );

        observer.observe(element);
        
        return () => {
            if (observer) observer.disconnect();
        };
    }, [fetchBlogs, blogs?.length]);

    return (
        <React.Fragment>
            {/* Main Feed Column - Wider layout (9 cols) */}
            <div className="md:col-span-9 flex flex-col gap-6">
                <CreatePost />
                
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bento-card p-4 border border-red-500/30 bg-red-500/5 rounded-2xl text-sm text-red-400">
                        Failed to load feed. Please try again later.
                    </div>
                )}

                <div className="flex flex-col gap-6 min-h-screen">
                    {blogs?.map(blog => (
                        <FeedItem key={blog.id} blog={blog} />
                    ))}

                    {/* Intersection Observer Target directly after the last blog inside the container */}
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
                </div>
            </div>

            {/* Sidebar Column - Narrower layout (3 cols) */}
            <aside className="md:col-span-3 flex flex-col gap-6">
                <EventAds />
                <FeedFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </aside>
        </React.Fragment>
    );
};

export default FeedPage;
