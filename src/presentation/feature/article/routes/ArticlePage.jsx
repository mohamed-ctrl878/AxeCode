import React, { useState, useEffect } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleFilters } from '../components/ArticleFilters';
import { useFetchArticles } from '@domain/useCase/useFetchArticles';

/**
 * ArticlePage: Full-screen layout with side filtration and vertical content list.
 */
const ArticlePage = () => {
    const [filter, setFilter] = useState('explore');
    const { fetchArticles, articles, loading, error } = useFetchArticles();

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    return (
        <React.Fragment>
            {/* Main Content Column (Articles) */}
            <div className="md:col-span-9 lg:col-span-9 order-1 md:order-2 flex flex-col gap-8">
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bento-card p-4 border border-red-500/30 bg-red-500/5 rounded-2xl text-sm text-red-400">
                        Failed to load articles. Please try again later.
                    </div>
                )}

                {articles?.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {/* Sidebar Column (Options) */}
            <aside className="md:col-span-3 lg:col-span-3 order-2 md:order-1">
                <ArticleFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>
        </React.Fragment>
    );
};

export default ArticlePage;
