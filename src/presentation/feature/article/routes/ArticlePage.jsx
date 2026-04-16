import React, { useState, useEffect } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleFilters } from '../components/ArticleFilters';
import { useFetchArticles } from '@domain/useCase/useFetchArticles';
import { ArticleCardSkeleton } from '@presentation/shared/components/skeletons/ArticleCardSkeleton';
import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';

/**
 * ArticlePage: Full-screen layout with side filtration and vertical content list.
 */
const ArticlePage = () => {
    const [filter, setFilter] = useState('related');
    const { fetchArticles, articles, loading, error } = useFetchArticles();

    useEffect(() => {
        // Map UI filter to backend feedType
        const feedMap = {
            'explore': 'trend',
            'related': 'recommend',
            'top': 'top'
        };
        fetchArticles(20, feedMap[filter] || 'recommend');
    }, [filter, fetchArticles]);

    return (
        <React.Fragment>
            {/* Sidebar Column (Options) */}
            <aside className="md:col-span-3 lg:col-span-3 md:order-2">
                <ArticleFilters activeFilter={filter} onFilterChange={setFilter} />
            </aside>

            {/* Main Content Column (Articles) */}
            <div className="md:col-span-9 lg:col-span-9 md:order-1 flex flex-col gap-8">
                {loading && (
                    <div className="py-12">
                        <PageLoader />
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
        </React.Fragment>
    );
};

export default ArticlePage;
