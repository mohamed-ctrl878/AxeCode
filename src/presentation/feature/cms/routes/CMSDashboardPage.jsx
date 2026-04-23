import React, { useEffect } from 'react';
import { useFetchCMSAnalytics } from '../../../../domain/useCase/useFetchCMSAnalytics';
import { ShieldAlert, BookOpen, Calendar, Users, TrendingUp } from 'lucide-react';
import { PageLoader } from '../../../shared/components/loaders/PageLoader';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
    <div className={`p-6 bg-surface rounded-2xl border border-border-subtle hover:border-${colorClass} transition-all duration-300 group`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${colorClass}/10 text-${colorClass}`}>
                <Icon size={24} />
            </div>
            <div className="text-right">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-serif">{title}</span>
                <h3 className="text-3xl font-bold font-sans mt-1 text-near-black">{value}</h3>
            </div>
        </div>
        <div className="flex items-center text-xs text-text-muted">
            <span className="text-success mr-2 flex items-center font-medium">
                <TrendingUp size={14} className="mr-1" /> {trend}
            </span>
            {trendLabel}
        </div>
    </div>
);

const CMSDashboardPage = () => {
    const { stats, isLoading, fetchAnalytics } = useFetchCMSAnalytics();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (isLoading) return <div className="h-96 flex items-center justify-center"><PageLoader /></div>;

    return (
        <div className="max-w-6xl mx-auto animation-fade-in pb-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-serif font-bold text-near-black tracking-tight mb-2">Master Ledger</h1>
                <p className="text-sm text-text-muted">A high-level overview of the Academy's current state and pending actions.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard 
                    title="Published Courses" 
                    value={stats.totalCourses} 
                    icon={BookOpen} 
                    trend="+12%" 
                    trendLabel="vs last month" 
                    colorClass="accent-primary" 
                />
                <StatCard 
                    title="Active Events" 
                    value={stats.totalEvents} 
                    icon={Calendar} 
                    trend="+4%" 
                    trendLabel="vs last month" 
                    colorClass="tertiary" 
                />
                <StatCard 
                    title="Registered Scholars" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    trend="+28%" 
                    trendLabel="vs last month" 
                    colorClass="secondary" 
                />
                <StatCard 
                    title="Pending Reports" 
                    value={stats.pendingReports} 
                    icon={ShieldAlert} 
                    trend="-5%" 
                    trendLabel="vs last month" 
                    colorClass="error" 
                />
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Visualizer (CSS Mock) */}
                <div className="lg:col-span-2 bg-surface rounded-2xl border border-border-subtle p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest">Platform Activity Trend</h2>
                        <span className="text-[10px] text-text-muted uppercase tracking-widest border border-border-subtle px-2 py-1 rounded-full bg-surface-sunken">Last 30 Days</span>
                    </div>
                    {/* Simulated Chart using CSS grid and pseudo-elements representing a bar chart */}
                    <div className="h-64 flex items-end justify-between gap-[2px] sm:gap-2 px-1 mt-4 border-b border-border-subtle pb-2">
                        {[40, 60, 30, 80, 50, 70, 90, 45, 65, 85, 55, 75, 40, 60, 100].map((height, i) => (
                            <div key={i} className="w-full bg-border-subtle rounded-t-md relative group hover:bg-near-black transition-colors duration-300" style={{ height: `${height}%` }}>
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-near-black text-ivory text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-mono tracking-tighter">
                                    {height} units
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Actions */}
                <div className="bg-parchment rounded-2xl border border-border-default shadow-whisper p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest mb-6 relative z-10">Attention Required</h2>
                    
                    <div className="space-y-4 relative z-10 flex-1">
                        {stats.pendingReports > 0 ? (
                            <div className="p-4 bg-surface rounded-xl border border-error/30 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-error/10 text-error rounded-lg">
                                        <ShieldAlert size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-near-black font-serif">Unresolved Reports</h4>
                                        <p className="text-[11px] text-text-muted">{stats.pendingReports} reports await moderation</p>
                                    </div>
                                </div>
                                <Link to={`${PATHS.CONTENT_MANAGEMENT}/reports`} className="btn-primary w-full text-center text-xs py-2 mt-2">Review Reports</Link>
                            </div>
                        ) : (
                            <div className="p-6 bg-surface rounded-xl border border-border-subtle text-center flex flex-col items-center justify-center h-32">
                                <ShieldAlert size={24} className="text-text-muted/30 mb-2" />
                                <p className="text-xs text-text-muted">No pending reports. All clear!</p>
                            </div>
                        )}

                        <div className="p-4 bg-surface rounded-xl border border-border-subtle flex flex-col gap-3 hover:border-near-black/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-border-subtle text-text-muted rounded-lg">
                                    <BookOpen size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-near-black font-serif">Draft Content</h4>
                                    <p className="text-[11px] text-text-muted">Review unpublished materials</p>
                                </div>
                            </div>
                            <Link to={`${PATHS.CONTENT_MANAGEMENT}/courses`} className="w-full text-center text-xs py-2 mt-2 border border-border-subtle hover:bg-border-subtle text-text-muted hover:text-near-black rounded-lg transition-colors">Go to Courses</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMSDashboardPage;
