import React, { useState, useEffect } from 'react';
import { CreatePost } from '../components/CreatePost';
import { FeedItem } from '../components/FeedItem';
import { EventAds } from '../components/EventAds';
import { FeedFilters } from '../components/FeedFilters';
import { useFetchBlogs } from '@domain/useCase/useFetchBlogs';

/**
 * FeedPage: Assembly of social and knowledge components.
 * Follows Bento Grid layout patterns.
 */
const FeedPage = () => {
    const [activeFilter, setActiveFilter] = useState('latest');
    const { fetchBlogs, blogs, loading, error } = useFetchBlogs();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

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

                <div className="flex flex-col gap-6">
                    {blogs?.map(blog => (
                        <FeedItem key={blog.id} blog={blog} />
                    ))}
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
