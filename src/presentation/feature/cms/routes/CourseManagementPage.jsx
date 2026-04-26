import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Calendar, ShieldCheck, Activity } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

// Subcomponents
import { CourseMetadataEditor } from '../components/course/CourseMetadataEditor';
import { CourseWeeksEditor } from '../components/course/CourseWeeksEditor';
import { CourseEntitlementEditor } from '../components/course/CourseEntitlementEditor';
import { CourseSubscriptionAnalysis } from '../components/course/CourseSubscriptionAnalysis';

/**
 * CourseManagementPage: Orchestrates the unified tab view for configuring a single course.
 */
export const CourseManagementPage = () => {
    const { id, topic } = useParams();
    const navigate = useNavigate();

    // Valid Topics Enforcer
    const validTopics = ['edit', 'weeks', 'entitlement', 'subscription-analysis'];
    if (!validTopics.includes(topic)) {
        return <Navigate to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/edit`} replace />;
    }

    // Tabs Definition
    const tabs = useMemo(() => [
        { id: 'edit', label: 'Course Metadata', icon: Edit2 },
        { id: 'weeks', label: 'Schedule Weeks', icon: Calendar },
        { id: 'entitlement', label: 'Entitlement', icon: ShieldCheck },
        { id: 'subscription-analysis', label: 'Subscription Analysis', icon: Activity }
    ], []);

    // Active Render mapping
    const renderActiveTab = () => {
        switch (topic) {
            case 'edit': return <CourseMetadataEditor courseId={id} />;
            case 'weeks': return <CourseWeeksEditor courseId={id} />;
            case 'entitlement': return <CourseEntitlementEditor courseId={id} />;
            case 'subscription-analysis': return <CourseSubscriptionAnalysis courseId={id} />;
            default: return null;
        }
    };

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col w-full min-w-0">
            {/* Contextual Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/courses`)}
                        className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-muted hover:border-accent-primary/30 hover:bg-accent-primary/5 hover:text-accent-primary transition-all group shrink-0"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Course Orchestration</h1>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-accent-primary/20 bg-accent-primary/5 text-accent-primary/80 uppercase tracking-widest">ID: {id}</span>
                        </div>
                        <p className="text-text-muted text-[11px] font-medium opacity-60 flex items-center gap-1.5">
                            <Activity size={10} className="text-accent-primary" />
                            Configuration & Logic Management
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-sunken border border-border-subtle text-[10px] font-mono text-text-muted shadow-sm">
                    <ShieldCheck size={12} className="text-accent-emerald" />
                    <span>Publisher Focus</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-surface-sunken/40 rounded-3xl border border-border-subtle overflow-hidden shadow-whisper">
                {/* Unified Tab Bar */}
                <div className="flex items-center gap-6 border-b border-border-subtle px-6 pt-1 bg-surface/50 backdrop-blur-xl sticky top-0 z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = topic === tab.id;
                        return (
                            <Link 
                                key={tab.id}
                                to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/${tab.id}`}
                                className={cn(
                                    "relative px-1 py-4 flex items-center gap-2 text-[13px] font-bold tracking-tight transition-all group shrink-0",
                                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary/70"
                                )}
                            >
                                <Icon size={14} className={isActive ? "text-accent-primary" : "opacity-40 group-hover:opacity-100 transition-opacity"} />
                                {tab.label}
                                
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary shadow-[0_-1px_4px_rgba(201,100,66,0.3)] rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Dynamic Content Area (Scrollable) */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    );
};

export default CourseManagementPage;
