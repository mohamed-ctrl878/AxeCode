import React, { useState } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleFilters } from '../components/ArticleFilters';
import { ArticleEntity } from '@domain/entity/ArticleEntity';

/**
 * ArticlePage: Full-screen layout with side filtration and vertical content list.
 */
const ArticlePage = () => {
    const [filter, setFilter] = useState('explore');

    // Mock data for initial presentation
    const mockArticles = [
        new ArticleEntity({
            id: 1,
            title: "Scaling Distributed Systems: A Deep Dive",
            content: "Modern distributed systems require more than just load balancing. They demand a fundamental shift in how we handle state, consistency, and network partitions.",
            author: { username: "Hussein.Dev" }
        }),
        new ArticleEntity({
            id: 2,
            title: "The Aesthetics of Zero-Gravity UI",
            content: "Design is not just what it looks like, but how it feels. 'Zero-Gravity' is our philosophy for interface design, focusing on weightlessness and clarity.",
            author: { username: "Artisan_UX" }
        }),
        new ArticleEntity({
            id: 3,
            title: "React 19: Transforming the Frontend Landscape",
            content: "The latest internal release of React has changed the game. From server components to advanced hydration strategies.",
            author: { username: "Frontend_Lead" }
        })
    ];

    return (
        <React.Fragment>
            {/* Sidebar Column (Options) */}


            {/* Main Content Column (Articles) */}
            <div className="md:col-span-9 lg:col-span-9 order-1 md:order-2 flex flex-col gap-8">
                {mockArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            <aside className="md:col-span-3 lg:col-span-3 order-2 md:order-1">
                <ArticleFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>
        </React.Fragment>
    );
};

export default ArticlePage;
