import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { ArrowLeft, Flag, Share2 } from 'lucide-react';

// Domain UseCases (no infrastructure imports allowed here)
import { useFetchArticle } from '@domain/useCase/useFetchArticle';
import { useRateContent } from '@domain/useCase/useRateContent';
import { useReportContent } from '@domain/useCase/useReportContent';

// Feature Components (composition, not monolith)
import { ArticleHero } from '../components/ArticleHero';
import { ArticleContentRenderer } from '../components/ArticleContentRenderer';
import { ArticleRatingFooter } from '../components/ArticleRatingFooter';
import { InlineComments } from '@presentation/shared/components/interactions/InlineComments';
import { MessageSquare } from 'lucide-react';

/**
 * ArticleDetailsPage - Page-level compositor.
 * SRP: Orchestrates UseCases and composes presentational components.
 * Zero direct infrastructure access — all logic delegated to Domain layer.
 */
const ArticleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- Domain UseCases ---
    const { fetchArticle, article, loading, error } = useFetchArticle();
    const { rateContent, isRating } = useRateContent();
    const { reportContent, isReporting } = useReportContent();

    // --- Local UI State ---
    const [myRating, setMyRating] = useState(0);
    const [reportSent, setReportSent] = useState(false);

    // Fetch article on mount
    useEffect(() => {
        if (id) fetchArticle(id);
    }, [id, fetchArticle]);

    // Sync myRating from entity when data arrives
    useEffect(() => {
        if (article) {
            setMyRating(article.myRating || 0);
        }
    }, [article]);

    /**
     * Delegates rating to UseCase, then re-fetches for fresh data.
     * StarRating sends 0 on toggle-off, so we send current myRating to trigger backend delete.
     */
    const handleRate = useCallback(async (newValue) => {
        if (isRating || !article?.uid) return;
        const rateToSend = newValue === 0 ? myRating : newValue;
        await rateContent(article.uid, 'article', rateToSend);
        setMyRating(newValue);
        await fetchArticle(id);
    }, [article, myRating, id, fetchArticle, isRating, rateContent]);

    /**
     * Delegates report to existing UseCase.
     */
    const handleReport = useCallback(async () => {
        if (reportSent || !article?.uid) return;
        await reportContent(article.uid, 'article', { reason: 'inappropriate_content' });
        setReportSent(true);
    }, [article, reportSent, reportContent]);

    // --- Render States ---
    if (loading) {
        return (
            <div className="md:col-span-12 flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="md:col-span-12 bento-card p-12 text-center max-w-2xl mx-auto my-12">
                <p className="text-status-error font-bold mb-4">Error loading article</p>
                <p className="text-text-muted text-sm">{error}</p>
                <button
                    onClick={() => navigate(PATHS.ARTICLES)}
                    className="mt-6 px-4 py-2 bg-surface text-sm font-bold rounded-xl hover:bg-surface-light border border-border-subtle"
                >
                    Back to Articles
                </button>
            </div>
        );
    }

    if (!article) return null;

    // Scroll to comments utility
    const scrollToComments = () => {
        document.getElementById('article-comments-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Page Composition ---
    return (
        <div className="md:col-span-12 max-w-4xl mx-auto w-full flex flex-col gap-6 animate-fade-in pb-32">

            {/* Navigation Bar */}
            <div className="sticky top-24 z-20 flex items-center justify-between bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-sm">
                <button
                    onClick={() => navigate(PATHS.ARTICLES)}
                    className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Hub
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={scrollToComments}
                        className="p-2 text-text-muted hover:text-accent-primary bg-surface rounded-lg border border-border-subtle transition-colors flex items-center gap-2"
                        title="Jump to Comments"
                    >
                        <MessageSquare size={16} />
                        <span className="text-xs font-bold">{article.commentsCount || 0}</span>
                    </button>
                    <button
                        onClick={handleReport}
                        disabled={reportSent || isReporting}
                        className={`p-2 rounded-lg border border-border-subtle transition-colors ${
                            reportSent
                                ? 'text-status-error bg-status-error/10 cursor-default'
                                : 'text-text-muted hover:text-status-error bg-surface'
                        }`}
                        title={reportSent ? 'Report sent' : 'Report this article'}
                    >
                        <Flag size={16} />
                    </button>
                    <button className="p-2 text-text-muted hover:text-accent-primary bg-surface rounded-lg border border-border-subtle">
                        <Share2 size={16} />
                    </button>
                </div>
            </div>

            {/* Hero: Title, Author, Tags, Stats */}
            <ArticleHero article={article} onCommentClick={scrollToComments} />

            {/* Content Blocks: Text + Flow Diagrams */}
            <ArticleContentRenderer content={article.content} />

            {/* Interactive Rating */}
            <ArticleRatingFooter
                myRating={myRating}
                isRating={isRating}
                onRate={handleRate}
            />

            {/* Inline Comments Section */}
            <div id="article-comments-section" className="scroll-mt-32">
                <InlineComments docId={article.uid} contentType="article" />
            </div>
        </div>
    );
};

export default ArticleDetailsPage;
