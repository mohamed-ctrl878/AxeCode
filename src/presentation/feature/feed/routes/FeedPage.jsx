import React, { useState } from 'react';
import { CreatePost } from '../components/CreatePost';
import { FeedItem } from '../components/FeedItem';
import { EventAds } from '../components/EventAds';
import { FeedFilters } from '../components/FeedFilters';
import { BlogEntity } from '@domain/entity/BlogEntity';

/**
 * FeedPage: Assembly of social and knowledge components.
 * Follows Bento Grid layout patterns.
 */
const FeedPage = () => {
    const [activeFilter, setActiveFilter] = useState('latest');

    // Mock data for initial render
    const mockBlogs = [
        new BlogEntity({
            id: 1,
            title: "Mastering Clean Architecture with React 19",
            description: "Deep dive into solid principles and how they transform your codebase into a scalable engine.",
            readingTime: "5 min",
            author: { username: "Hussein.js" },
            image: { url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" }
        }),
        new BlogEntity({
            id: 2,
            title: "Antigravity Design: The Future of SaaS UI",
            description: "Why we chose perfect black and bento grids for the next generation of developer platforms.",
            readingTime: "8 min",
            author: { username: "ArtisanUI" }
        })
    ];

    return (
        <React.Fragment>
            {/* Main Feed Column - Wider layout (9 cols) */}
            <div className="md:col-span-9 flex flex-col gap-6">
                <CreatePost />
                
                <div className="flex flex-col gap-6">
                    {mockBlogs.map(blog => (
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
