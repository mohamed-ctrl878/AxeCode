import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileTabs } from '../components/ProfileTabs';
import { AxeContributionGraph } from '../components/AxeContributionGraph';
import { UserRepository } from '@infrastructure/repository/UserRepository';
import { SubmissionRepository } from '@infrastructure/repository/SubmissionRepository';
import { ArticleRepository } from '@infrastructure/repository/ArticleRepository';
import { BlogRepository } from '@infrastructure/repository/BlogRepository';
import { CourseRepository } from '@infrastructure/repository/CourseRepository';
import { ArrowLeft, Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { EntityMapper } from '@domain/mapper/EntityMapper';
import { BlogDTO } from '@infrastructure/DTO/BlogDTO';
import { ArticleDTO } from '@infrastructure/DTO/ArticleDTO';
import { CourseDTO } from '@infrastructure/DTO/CourseDTO';
import { UserDTO } from '@infrastructure/DTO/UserDTO';
import { UserEntity } from '@domain/entity/UserEntity';

/**
 * ProfilePage: Orchestrates user data fetching and content synchronization.
 * Restructured to act as a native part of the AxeCode knowledge ecosystem.
 */
const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState({
        user: null,
        blogs: { items: [], total: 0, loading: false, hasMore: true },
        articles: { items: [], total: 0, loading: false, hasMore: true },
        courses: { items: [], total: 0, loading: false, hasMore: true },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Repositories
    const userRepo = new UserRepository();
    const submissionRepo = new SubmissionRepository();
    const articleRepo = new ArticleRepository();
    const blogRepo = new BlogRepository();
    const courseRepo = new CourseRepository();

    /**
     * Common fetcher for paginated category data
     */
    const fetchCategoryData = useCallback(async (category, repo) => {
        try {
            const currentItems = profileData[category].items;
            const start = currentItems.length;
            const limit = 10;

            setProfileData(prev => ({
                ...prev,
                [category]: { ...prev[category], loading: true }
            }));

            const result = await repo.listByAuthor(username, start, limit);
            
            // Map raw items to entities/DTOs
            let mappedItems = [];
            if (category === 'blogs') {
                mappedItems = (result.items || []).map(item => EntityMapper.toBlog(new BlogDTO(item)));
            } else if (category === 'articles') {
                mappedItems = (result.items || []).map(item => EntityMapper.toArticle(new ArticleDTO(item)));
            } else if (category === 'courses') {
                // Courses are already mapped in repository toCardCourse
                mappedItems = result.items || [];
            }

            setProfileData(prev => {
                const newItems = [...prev[category].items, ...mappedItems];
                return {
                    ...prev,
                    [category]: {
                        items: newItems,
                        total: result.total,
                        loading: false,
                        hasMore: newItems.length < result.total
                    }
                };
            });
        } catch (err) {
            console.error(`[ProfilePage] Failed to fetch ${category}:`, err);
        }
    }, [username, profileData]);

    const fetchFullProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Parallel Fetch: User Identity & Submission Stats (Direct from table)
            const [rawUserData, stats] = await Promise.all([
                userRepo.searchByUsername(username),
                submissionRepo.getProfileStats(username)
            ]);

            console.log('[ProfileSync] Raw User Data:', rawUserData);
            console.log('[ProfileSync] Fetched Stats:', stats);

            if (!rawUserData) {
                setError("Collective intelligence could not locate this entity.");
                return;
            }

            // Map user with direct stats
            const user = EntityMapper.toUser(new UserDTO(rawUserData), stats);

            // 2. Fetch Initial Pages for all content
            const [artResult, blogResult, courseResult] = await Promise.all([
                articleRepo.listByAuthor(username, 0, 10),
                blogRepo.listByAuthor(username, 0, 10),
                courseRepo.listByAuthor(username, 0, 10)
            ]);

            setProfileData({
                user,
                articles: {
                    items: (artResult.items || []).map(i => EntityMapper.toArticle(new ArticleDTO(i))),
                    total: artResult.total,
                    loading: false,
                    hasMore: (artResult.items || []).length < artResult.total
                },
                blogs: {
                    items: (blogResult.items || []).map(i => EntityMapper.toBlog(new BlogDTO(i))),
                    total: blogResult.total,
                    loading: false,
                    hasMore: (blogResult.items || []).length < blogResult.total
                },
                courses: {
                    items: courseResult.items || [], // Already mapped in repo
                    total: courseResult.total,
                    loading: false,
                    hasMore: (courseResult.items || []).length < courseResult.total
                }
            });

        } catch (err) {
            console.error('[ProfilePage] Sync Error:', err);
            setError("Atmospheric interference detected. Profile sync failed.");
        } finally {
            setLoading(false);
        }
    }, [username]);
 
    const handleUserUpdate = useCallback((updatedUser) => {
        setProfileData(prev => {
            // Re-instantiate UserEntity to keep getters (avatarUrl, fullName, etc.)
            const mergedUser = new UserEntity({
                ...updatedUser,
                // Ensure stats are preserved from previous state
                submissionCount: prev.user?.submissionCount || 0,
                passedSubmissionsCount: prev.user?.passedSubmissionsCount || 0
            });
            
            return {
                ...prev,
                user: mergedUser
            };
        });
    }, []);

    useEffect(() => {
        fetchFullProfile();
    }, [fetchFullProfile]);

    if (loading) {
        return (
            <div className="md:col-span-12 h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-text-muted">Synchronizing with Node...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="md:col-span-12 py-20 flex flex-col items-center justify-center text-center">
                <div className="bento-card p-12 bg-surface border-dashed border-2 border-accent-rose/20 rounded-3xl">
                    <h2 className="text-2xl font-serif text-text-primary mb-4">{error}</h2>
                    <Link to={PATHS.HOME} className="px-6 py-2 bg-surface-elevated border border-border-subtle rounded-xl text-sm hover:text-accent-primary transition-colors">
                        Return to Hub
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="md:col-span-12 flex flex-col gap-12 animate-in fade-in duration-1000">
            {/* Top Navigation Strip */}
            <div className="flex items-center gap-4">
                <Link to={PATHS.HOME} className="p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-accent-primary">
                    <ArrowLeft size={20} />
                </Link>
                <div className="h-px w-8 bg-border-subtle" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">Operational Profile</span>
            </div>

            {/* Profile Shell */}
            <ProfileHeader 
                user={profileData.user} 
                onUpdate={handleUserUpdate} 
            />
            
            {/* Activity Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                            <Zap size={18} className="text-accent-primary" />
                        </div>
                        <h2 className="text-xl font-serif text-text-primary">Axe Contribution Matrix</h2>
                    </div>
                    {/* The graph itself still uses internally mocked logic as requested by USER */}
                    <AxeContributionGraph user={profileData.user} />
                </div>
            </div>

            {/* Content Tabs Layer */}
            <ProfileTabs 
                user={profileData.user} 
                blogs={profileData.blogs.items}
                articles={profileData.articles.items}
                courses={profileData.courses.items}
                // Pagination Metadata
                counts={{
                    blogs: profileData.blogs.total,
                    articles: profileData.articles.total,
                    courses: profileData.courses.total
                }}
                loadingStates={{
                    blogs: profileData.blogs.loading,
                    articles: profileData.articles.loading,
                    courses: profileData.courses.loading
                }}
                hasMore={{
                    blogs: profileData.blogs.hasMore,
                    articles: profileData.articles.hasMore,
                    courses: profileData.courses.hasMore
                }}
                onLoadMore={(category) => {
                    const repoMap = { 
                        blogs: blogRepo, 
                        articles: articleRepo, 
                        courses: courseRepo 
                    };
                    fetchCategoryData(category, repoMap[category]);
                }}
            />
        </div>
    );
};

export default ProfilePage;
