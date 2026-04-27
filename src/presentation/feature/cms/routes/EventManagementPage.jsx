import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, ShieldCheck, Activity, Calendar, QrCode } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

// Subcomponents
import { EventMetadataEditor } from '../components/event/EventMetadataEditor';
import { EventEntitlementEditor } from '../components/event/EventEntitlementEditor';
import { EventSubscriptionAnalysis } from '../components/event/EventSubscriptionAnalysis';
import { EventActivitiesEditor } from '../components/event/EventActivitiesEditor';
import { EventSpeakersEditor } from '../components/event/EventSpeakersEditor';
import { EventScannersEditor } from '../components/event/EventScannersEditor';

/**
 * EventManagementPage: Orchestrates the unified tab view for configuring a single event.
 */
export const EventManagementPage = () => {
    const { id, topic } = useParams();
    const navigate = useNavigate();

    // Valid Topics Enforcer
    const validTopics = ['edit', 'entitlement', 'subscription-analysis', 'activities', 'speakers', 'scanners'];
    if (!validTopics.includes(topic)) {
        return <Navigate to={`${PATHS.CONTENT_MANAGEMENT}/events/${id}/edit`} replace />;
    }

    // Tabs Definition
    const tabs = useMemo(() => [
        { id: 'edit', label: 'Event Details', icon: Edit2 },
        { id: 'entitlement', label: 'Entitlement', icon: ShieldCheck },
        { id: 'subscription-analysis', label: 'Subscribers', icon: Activity },
        { id: 'activities', label: 'Activities', icon: Activity },
        { id: 'speakers', label: 'Speakers', icon: Activity },
        { id: 'scanners', label: 'Ticket Scanners', icon: QrCode }
    ], []);

    // Active Render mapping
    const renderActiveTab = () => {
        switch (topic) {
            case 'edit': return <EventMetadataEditor eventId={id} />;
            case 'entitlement': return <EventEntitlementEditor eventId={id} />;
            case 'subscription-analysis': return <EventSubscriptionAnalysis eventId={id} />;
            case 'activities': return <EventActivitiesEditor eventId={id} />;
            case 'speakers': return <EventSpeakersEditor eventId={id} />;
            case 'scanners': return <EventScannersEditor eventId={id} />;
            default: return null;
        }
    };

    return (
        <div className="md:col-span-full animation-fade-in flex flex-col min-h-screen text-text-primary px-4 md:px-12 py-8 max-w-7xl mx-auto w-full">
            {/* Contextual Header - Consistent Orchestration */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 p-10 rounded-[2.5rem] bg-surface border border-border-subtle relative overflow-hidden backdrop-blur-sm">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-accent-primary">
                    <Calendar size={160} />
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <button 
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/events`)}
                        className="w-12 h-12 rounded-2xl border border-border-default flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0 bg-surface-sunken/40"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex flex-wrap items-center gap-4">
                            <h1 className="text-3xl font-black italic tracking-tighter text-text-primary">Event Orchestration</h1>
                            <span className="px-3 py-1 rounded-xl text-[10px] font-black border border-accent-primary/20 bg-accent-primary/10 text-accent-primary uppercase tracking-[0.2em] mt-1 shadow-whisper">MANIFEST ID: {id}</span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-40">Manage communal gatherings, academic summits, and live engagement sessions.</p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface-sunken/60 border border-border-subtle text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-inner relative z-10 translate-y-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    <span>Gathering Protocol active</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col bg-surface border border-border-subtle rounded-[2.5rem] overflow-visible relative mb-12">
                {/* Unified Tab Bar */}
                <div className="flex items-center gap-10 border-b border-border-subtle px-12 bg-surface backdrop-blur-md sticky top-0 z-20 rounded-t-[2.5rem]">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = topic === tab.id;
                        return (
                            <Link 
                                key={tab.id}
                                to={`${PATHS.CONTENT_MANAGEMENT}/events/${id}/${tab.id}`}
                                className={cn(
                                    "relative py-7 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all group",
                                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-xl transition-all duration-300",
                                    isActive ? "bg-accent-primary/10 text-accent-primary scale-110 shadow-whisper" : "bg-transparent group-hover:bg-surface-sunken/50"
                                )}>
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {tab.label}
                                
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent-primary shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-t-full animation-slide-up" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 p-10 overflow-y-auto bg-surface-sunken/5 rounded-b-[2.5rem] scrollbar-hide">
                    <div className="animation-fade-in h-full">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventManagementPage;
