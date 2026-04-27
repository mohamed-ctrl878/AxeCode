import React, { useEffect, useState } from 'react';
import { useFetchCMSAnalytics } from '../../../../domain/useCase/useFetchCMSAnalytics';
import { ShieldAlert, BookOpen, Calendar, Users, TrendingUp, BarChart3, Users2 } from 'lucide-react';
import { PageLoader } from '../../../shared/components/loaders/PageLoader';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';

// Viewers
import UnifiedTimelineViewer from '../components/dashboard/viewers/GrowthTimelineViewer';
import ContributorStatsViewer from '../components/dashboard/viewers/ContributorStatsViewer';
import DefaultDashboardViewer from '../components/dashboard/viewers/DefaultDashboardViewer';

const VIEWERS = {
    DEFAULT: 'default',
    COURSES: 'courses',
    EVENTS: 'events',
    USERS: 'users',
    REPORTS: 'reports',
    CONTRIBUTORS: 'contributors'
};

const TIME_OPTIONS = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass, onClick, isActive, detailIcon: DetailIcon }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-6 bg-surface rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
            isActive ? `border-${colorClass} shadow-lg ring-1 ring-${colorClass}/20` : 'border-border-subtle hover:border-near-black/20'
        }`}
    >
        {isActive && (
            <div className={`absolute top-0 right-0 p-2 bg-${colorClass}/10 text-${colorClass} rounded-bl-xl`}>
                <DetailIcon size={14} />
            </div>
        )}
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${isActive ? `bg-${colorClass} text-ivory` : `bg-${colorClass}/10 text-${colorClass}`} transition-colors`}>
                <Icon size={24} />
            </div>
            <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-serif">{title}</span>
                <h3 className="text-3xl font-bold font-sans mt-1 text-near-black">{value}</h3>
            </div>
        </div>
        <div className="flex items-center text-xs text-text-muted">
            <span className="text-success mr-2 font-medium flex items-center">
                 <TrendingUp size={12} className="mr-1" /> {trend}
            </span>
            {trendLabel}
        </div>
    </button>
);

const CMSDashboardPage = () => {
    const { data, stats, isLoading, fetchAnalytics } = useFetchCMSAnalytics();
    const [activeViewer, setActiveViewer] = useState(VIEWERS.DEFAULT);
    const [timeRange, setTimeRange] = useState(60);

    useEffect(() => {
        fetchAnalytics(timeRange);
    }, [fetchAnalytics, timeRange]);

    const renderViewer = () => {
        const subtitle = `Temporal velocity over the last ${timeRange} days`;
        switch (activeViewer) {
            case VIEWERS.COURSES:
                return (
                    <UnifiedTimelineViewer 
                        data={data.courses} 
                        title="Course Creation Pulse" 
                        subtitle={subtitle}
                        colorClass="accent-primary"
                    />
                );
            case VIEWERS.EVENTS:
                return (
                    <UnifiedTimelineViewer 
                        data={data.events} 
                        title="Event Assembly Pulse" 
                        subtitle={subtitle}
                        colorClass="accent-violet"
                    />
                );
            case VIEWERS.USERS:
                return (
                    <UnifiedTimelineViewer 
                        data={data.users} 
                        title="Scholarly Enrollment Pulse" 
                        subtitle={subtitle}
                        colorClass="accent-primary"
                    />
                );
            case VIEWERS.REPORTS:
                return (
                    <UnifiedTimelineViewer 
                        data={data.reports} 
                        title="Moderation Activity Pulse" 
                        subtitle={subtitle}
                        colorClass="accent-rose"
                    />
                );
            case VIEWERS.CONTRIBUTORS:
                return <ContributorStatsViewer stats={stats} />;
            default:
                return <DefaultDashboardViewer />;
        }
    };

    if (isLoading) return <div className="h-96 flex items-center justify-center text-near-black"><PageLoader /></div>;

    if (!data && error) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-6 text-center">
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger max-w-md">
                    <ShieldAlert className="mx-auto mb-2" size={32} />
                    <p className="font-serif font-bold text-lg mb-1 uppercase tracking-tight">Access Restricted or Missing</p>
                    <p className="text-sm opacity-80">{error}</p>
                </div>
                <button 
                    onClick={() => fetchAnalytics(timeRange)}
                    className="px-6 py-2 bg-near-black text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    Reconnect to Ledger
                </button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-6xl mx-auto animation-fade-in pb-12">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-near-black tracking-tight mb-2 uppercase">Master Ledger</h1>
                    <p className="text-sm text-text-muted flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        System Analytics & Insight Engine
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-surface-sunken p-1.5 rounded-2xl border border-border-subtle">
                    {TIME_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setTimeRange(opt.value)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                timeRange === opt.value 
                                ? 'bg-near-black text-ivory shadow-lg' 
                                : 'text-text-muted hover:text-near-black'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                    <div className="w-[1px] h-4 bg-border-subtle mx-1" />
                    <button 
                        onClick={() => fetchAnalytics(timeRange)}
                        className="p-2 text-text-muted hover:text-near-black transition-colors"
                        title="Force Refresh"
                    >
                        <TrendingUp size={14} className="rotate-90" />
                    </button>
                </div>
            </div>

            {/* Interactive Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard 
                    title="Active Curriculum" 
                    value={data.courses.total} 
                    icon={BookOpen} 
                    detailIcon={BarChart3}
                    trend="+12%" 
                    trendLabel="Live Modules" 
                    colorClass="accent-primary"
                    isActive={activeViewer === VIEWERS.COURSES}
                    onClick={() => setActiveViewer(VIEWERS.COURSES)}
                />
                <StatCard 
                    title="Public Assemblies" 
                    value={data.events.total} 
                    icon={Calendar} 
                    detailIcon={BarChart3}
                    trend="Active" 
                    trendLabel="Ongoing Events" 
                    colorClass="accent-violet"
                    isActive={activeViewer === VIEWERS.EVENTS}
                    onClick={() => setActiveViewer(VIEWERS.EVENTS)}
                />
                <StatCard 
                    title="Enrolled Scholars" 
                    value={data.users.total} 
                    icon={Users} 
                    detailIcon={TrendingUp}
                    trend="+28%" 
                    trendLabel="Subscriber Growth" 
                    colorClass="accent-primary"
                    isActive={activeViewer === VIEWERS.USERS}
                    onClick={() => setActiveViewer(VIEWERS.USERS)}
                />
                <StatCard 
                    title="Security Audits" 
                    value={data.reports.total} 
                    icon={ShieldAlert} 
                    detailIcon={ShieldAlert}
                    trend={`${data.reports.total} Active`} 
                    trendLabel="Pending Moderation" 
                    colorClass="accent-rose"
                    isActive={activeViewer === VIEWERS.REPORTS}
                    onClick={() => setActiveViewer(VIEWERS.REPORTS)}
                />
            </div>

            {/* Insight Hub Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dynamic Insight Viewer */}
                <div className="lg:col-span-2 bg-surface rounded-3xl border border-border-subtle p-8 shadow-whisper relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-near-black/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    {renderViewer()}
                </div>

                {/* Sidebar Context */}
                <div className="space-y-6">
                    <div className="bg-near-black text-ivory rounded-3xl p-8 shadow-elegant relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-ivory/10 rounded-full blur-2xl" />
                         <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] mb-4 opacity-60">System Security</h3>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium opacity-80">Pending Reports</span>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${stats.pendingReports > 0 ? 'bg-error text-ivory' : 'bg-success/20 text-success'}`}>
                                    {stats.pendingReports}
                                </span>
                            </div>
                            <Link 
                                to={`${PATHS.CONTENT_MANAGEMENT}/reports`} 
                                className="block w-full text-center py-3 bg-ivory text-near-black rounded-xl text-xs font-bold hover:bg-border-subtle transition-colors mt-4"
                            >
                                Enter Security Console
                            </Link>
                         </div>
                    </div>

                    <div className="bg-surface rounded-3xl border border-border-subtle p-8 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-60">
                         <Users2 size={32} className="text-text-muted mb-3" />
                         <p className="text-xs text-text-muted font-medium">More analytics modules coming soon to the Scholar's Ledger.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMSDashboardPage;
