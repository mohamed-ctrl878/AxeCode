import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Calendar, ShieldCheck, Activity, Layers } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

// Subcomponents
import { CourseMetadataEditor } from '../components/course/CourseMetadataEditor';
import { CourseWeeksEditor } from '../components/course/CourseWeeksEditor';
import { CourseEntitlementEditor } from '../components/course/CourseEntitlementEditor';
import { CourseSubscriptionAnalysis } from '../components/course/CourseSubscriptionAnalysis';
import { CourseTypesEditor } from '../components/course/CourseTypesEditor';

/**
 * CourseManagementPage: Orchestrates the unified tab view for configuring a single course.
 */
export const CourseManagementPage = () => {
    const { id, topic } = useParams();
    const navigate = useNavigate();

    // Valid Topics Enforcer
    const validTopics = ['edit', 'weeks', 'entitlement', 'subscription-analysis', 'types'];
    if (!validTopics.includes(topic)) {
        return <Navigate to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/edit`} replace />;
    }

    // Tabs Definition
    const tabs = useMemo(() => [
        { id: 'edit', label: 'Course Metadata', icon: Edit2 },
        { id: 'weeks', label: 'Schedule Weeks', icon: Calendar },
        { id: 'types', label: 'Course Types', icon: Layers },
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
            case 'types': return <CourseTypesEditor courseId={id} />;
            default: return null;
        }
    };

    return (
        <div className="md:col-span-full animation-fade-in flex flex-col min-h-screen text-text-primary px-2 sm:px-4 md:px-12 py-4 md:py-8 max-w-7xl mx-auto w-full">
            {/* Contextual Header - Consistent Orchestration */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-surface border border-border-subtle relative overflow-hidden backdrop-blur-sm">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-accent-primary">
                    <Activity size={160} />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 relative z-10 min-w-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/courses`)}
                            className="w-12 h-12 rounded-2xl border border-border-default flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0 bg-surface-sunken/40"
                        >
                            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-text-primary sm:hidden">Course Orchestration</h1>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                            <h1 className="hidden sm:block text-xl md:text-3xl font-black italic tracking-tighter text-text-primary truncate">Course Orchestration</h1>
                            <span className="px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black border border-accent-primary/20 bg-accent-primary/10 text-accent-primary uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-whisper break-all max-w-full inline-block">LEDGER: {id}</span>
                        </div>
                        <p className="text-text-muted text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] opacity-40 leading-relaxed">Manage curriculum structure, subscription tiers, and academic delivery.</p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-4 sm:px-6 py-3 rounded-2xl bg-surface-sunken/60 border border-border-subtle text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-text-muted shadow-inner relative z-10 mt-2 md:mt-0 w-full md:w-auto overflow-hidden">
                    <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-accent-emerald animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0" />
                    <span className="truncate">Curriculum Design Protocol active</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col bg-surface border border-border-subtle rounded-[2.5rem] overflow-visible relative mb-12">
                {/* Unified Tab Bar */}
                <div className="flex items-center gap-3 md:gap-10 border-b border-border-subtle px-3 md:px-12 bg-surface backdrop-blur-md sticky top-0 z-20 rounded-t-[2.5rem] overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = topic === tab.id;
                        return (
                            <Link 
                                key={tab.id}
                                to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/${tab.id}`}
                                className={cn(
                                    "relative py-4 md:py-7 flex items-center gap-2 md:gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all group whitespace-nowrap",
                                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-all duration-300",
                                    isActive ? "bg-accent-primary/10 text-accent-primary scale-110 shadow-whisper" : "bg-transparent group-hover:bg-surface-sunken/50"
                                )}>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="hidden md:inline">{tab.label}</span>
                                
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent-primary shadow-[0_0_20px_rgba(52,211,153,0.5)] rounded-t-full animation-slide-up" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 p-3 sm:p-5 md:p-10 overflow-y-auto bg-surface-sunken/5 rounded-b-[2.5rem] scrollbar-hide">
                    <div className="animation-fade-in h-full">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseManagementPage;
