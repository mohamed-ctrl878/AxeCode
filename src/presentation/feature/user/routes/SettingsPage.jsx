import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '@presentation/shared/provider/UIProvider';
import { 
    Moon, 
    Sun, 
    Bell, 
    Shield, 
    User, 
    Monitor,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Key,
    Mail,
    Share2,
    MessageSquare,
    Heart,
    Star,
    ChevronRight,
    Lock
} from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * SettingsPage: Central hub for user preferences.
 * Includes ScrollSpy logic and smooth section navigation.
 */
const SettingsPage = () => {
    const { theme, setTheme } = useUI();
    const [activeTab, setActiveTab] = useState('appearance');
    const [notificationPermission, setNotificationPermission] = useState(
        typeof window !== 'undefined' ? Notification.permission : 'default'
    );

    // Section Refs for Intersection Observer
    const sections = {
        appearance: useRef(null),
        security: useRef(null),
        notifications: useRef(null),
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sections).forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = sections[id]?.current;
        if (element) {
            const offset = 100; // Account for fixed header if any
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications.');
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    const renderPermissionStatus = () => {
        switch (notificationPermission) {
            case 'granted':
                return (
                    <div className="flex items-center gap-2 text-accent-emerald text-[10px] font-mono uppercase tracking-wider">
                        <CheckCircle2 size={14} />
                        <span>Enabled</span>
                    </div>
                );
            case 'denied':
                return (
                    <div className="flex items-center gap-2 text-status-error text-[10px] font-mono uppercase tracking-wider">
                        <XCircle size={14} />
                        <span>Blocked</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 text-text-muted text-[10px] font-mono uppercase tracking-wider">
                        <AlertCircle size={14} />
                        <span>Not Requested</span>
                    </div>
                );
        }
    };

    const TogglePlaceholder = ({ label, icon: Icon, enabled = true }) => (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-sunken/40 border border-border-subtle group">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface border border-border-subtle group-hover:border-accent-primary/30 transition-colors">
                    <Icon size={16} className="text-text-muted group-hover:text-accent-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-text-primary/80">{label}</span>
            </div>
            <div className={cn(
                "w-10 h-5 rounded-full relative transition-colors cursor-not-allowed",
                enabled ? "bg-accent-primary/60" : "bg-surface-sunken"
            )}>
                <div className={cn(
                    "absolute top-1 w-3 h-3 rounded-full transition-all shadow-sm",
                    enabled ? "right-1 bg-white" : "left-1 bg-text-muted/40"
                )} />
            </div>
        </div>
    );

    return (
        <div className="md:col-span-12 min-h-screen p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-5xl mx-auto space-y-12 mt-6">
                
                {/* Header Area */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-accent-primary font-mono text-[10px] uppercase tracking-[0.3em]">
                        <div className="w-12 h-[1px] bg-accent-primary/40" />
                        Axe Code / Configuration
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-serif text-text-primary tracking-tight">
                            Preferences
                        </h1>
                        <p className="text-text-muted max-w-2xl text-[15px] leading-relaxed">
                            Fine-tune your development workspace, security protocols, and platform communication streams.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-3">
                        <div className="sticky top-28 p-2 rounded-bento bg-surface border border-border-subtle shadow-halo">
                            {[
                                { id: 'appearance', label: 'Appearance', icon: Monitor },
                                { id: 'security', label: 'Security', icon: Shield },
                                { id: 'notifications', label: 'Notifications', icon: Bell },
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                        activeTab === item.id 
                                            ? "bg-accent-primary text-white shadow-md shadow-accent-primary/20" 
                                            : "hover:bg-surface-sunken text-text-muted hover:text-text-primary"
                                    )}
                                >
                                    <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "group-hover:text-accent-primary")} />
                                    <span className="text-[14px] font-semibold tracking-tight">{item.label}</span>
                                    {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-60" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-10 pb-24">
                        
                        {/* 1. Visual Aesthetics */}
                        <section 
                            id="appearance"
                            ref={sections.appearance}
                            className="bento-card p-8 bg-surface border border-border-default shadow-halo relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-accent-primary/8" />
                            
                            <div className="relative space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-xl bg-surface-sunken border border-border-subtle">
                                        <Monitor size={22} className="text-accent-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-serif text-text-primary">Interface Appearance</h2>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.1em] opacity-80">Workspace Visual Mode</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Dark Mode Card */}
                                    <button 
                                        onClick={() => setTheme('dark')}
                                        className={cn(
                                            "flex flex-col gap-6 p-7 rounded-bento border transition-all duration-500 text-left group/btn",
                                            theme === 'dark' 
                                                ? "bg-near-black border-accent-primary shadow-xl ring-1 ring-accent-primary/10" 
                                                : "bg-surface-sunken/40 border-border-subtle grayscale hover:grayscale-[0.5] hover:border-accent-primary/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="p-3 rounded-xl bg-black/30 border border-white/5 shadow-inner">
                                                <Moon size={22} className={theme === 'dark' ? "text-accent-primary" : "text-text-muted"} />
                                            </div>
                                            {theme === 'dark' && <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />}
                                        </div>
                                        <div className="space-y-2">
                                            <span className="block text-lg font-bold tracking-tight text-white">Deep Charcoal</span>
                                            <p className="text-[12px] text-text-muted leading-relaxed">High contrast dark interface optimized for late-night coding sessions.</p>
                                        </div>
                                    </button>

                                    {/* Light Mode Card */}
                                    <button 
                                        onClick={() => setTheme('light')}
                                        className={cn(
                                            "flex flex-col gap-6 p-7 rounded-bento border transition-all duration-500 text-left group/btn",
                                            theme === 'light' 
                                                ? "bg-white border-accent-primary shadow-xl ring-1 ring-accent-primary/10" 
                                                : "bg-surface-sunken/40 border-border-subtle grayscale hover:grayscale-[0.5] hover:border-accent-primary/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="p-3 rounded-xl bg-parchment/50 border border-border-default shadow-inner">
                                                <Sun size={22} className={theme === 'light' ? "text-accent-primary" : "text-text-muted"} />
                                            </div>
                                            {theme === 'light' && <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />}
                                        </div>
                                        <div className="space-y-2">
                                            <span className="block text-lg font-bold tracking-tight text-near-black">Soft Parchment</span>
                                            <p className="text-[12px] text-text-muted leading-relaxed">Clean, warm interface inspired by classic manuscripts and deep paper.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* 2. Security Section */}
                        <section 
                            id="security"
                            ref={sections.security}
                            className="bento-card p-8 bg-surface border border-border-default shadow-halo"
                        >
                            <div className="space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-xl bg-accent-amber/10 border border-accent-amber/20 shadow-inner">
                                        <Shield size={22} className="text-accent-amber" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-serif text-text-primary">Security & Protocols</h2>
                                        <p className="text-[10px] text-accent-amber font-bold uppercase tracking-[0.1em] opacity-80">Credential Shields</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 rounded-xl bg-surface-sunken/40 border border-border-subtle group opacity-60 grayscale-[0.6]">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-surface border border-border-subtle">
                                                <Key size={20} className="text-text-muted" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-bold text-text-primary">Update Secure Password</span>
                                                <p className="text-[11px] text-text-muted leading-none">Manage your primary account encryption key.</p>
                                            </div>
                                        </div>
                                        <Lock size={16} className="text-text-muted/50" />
                                    </div>

                                    <div className="flex items-center justify-between p-5 rounded-xl bg-surface-sunken/40 border border-border-subtle group opacity-60 grayscale-[0.6]">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-surface border border-border-subtle">
                                                <Mail size={20} className="text-text-muted" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-sm font-bold text-text-primary">Email Authentication Hub</span>
                                                <p className="text-[11px] text-text-muted leading-none">Control your verification and notification endpoint.</p>
                                            </div>
                                        </div>
                                        <Lock size={16} className="text-text-muted/50" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/10 flex items-center gap-4">
                                        <AlertCircle size={18} className="text-accent-amber shrink-0" />
                                        <p className="text-[11px] text-accent-amber/90 font-medium italic leading-relaxed">
                                            Security modules (Credential Rotation) will be active soon for users with local authentication accounts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Notification Streams */}
                        <section 
                            id="notifications"
                            ref={sections.notifications}
                            className="bento-card p-8 bg-surface border border-border-default shadow-halo"
                        >
                            <div className="space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20 shadow-inner">
                                        <Bell size={22} className="text-accent-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-serif text-text-primary">Notification Streams</h2>
                                        <p className="text-[10px] text-accent-primary font-bold uppercase tracking-[0.1em] opacity-80">Platform Comm-Links</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* OS Level Hub */}
                                    <div className="p-6 rounded-bento bg-surface-sunken border border-border-subtle relative overflow-hidden">
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="space-y-2">
                                                <span className="text-[15px] font-bold text-text-primary">System-Level Push Access</span>
                                                <p className="text-[12px] text-text-muted leading-relaxed max-w-sm font-medium">
                                                    Required for low-latency transmission of course progress, event triggers, and critical platform alerts.
                                                </p>
                                            </div>
                                            {renderPermissionStatus()}
                                        </div>
                                        {notificationPermission !== 'granted' && (
                                            <button 
                                                onClick={requestPermission}
                                                className="mt-6 w-full btn-primary font-bold uppercase tracking-widest text-[11px] py-3.5"
                                            >
                                                Initialize Browser Handshake
                                            </button>
                                        )}
                                    </div>

                                    {/* Granular Preferences */}
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-[1px] flex-1 bg-border-subtle" />
                                            <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] px-2">Stream Configuration</h4>
                                            <div className="h-[1px] flex-1 bg-border-subtle" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <TogglePlaceholder label="Analytical Blogs" icon={Share2} />
                                            <TogglePlaceholder label="Article Dispatches" icon={AlertCircle} />
                                            <TogglePlaceholder label="Community Appreciation" icon={Heart} />
                                            <TogglePlaceholder label="Social Discussions" icon={MessageSquare} />
                                            <TogglePlaceholder label="Peer Evaluation" icon={Star} />
                                        </div>
                                    </div>

                                    {/* Protocol Disclaimer */}
                                    <div className="p-5 rounded-xl bg-accent-primary/5 border border-border-subtle flex items-start gap-4">
                                        <AlertCircle size={18} className="text-accent-primary mt-0.5 shrink-0" />
                                        <div className="space-y-1.5">
                                            <p className="text-[12px] text-text-primary font-semibold leading-relaxed">
                                                Current Protocol: All communication streams are active by default.
                                            </p>
                                            <p className="text-[11px] text-text-muted italic leading-relaxed font-medium">
                                                Individual stream modulation will be deployed in the next platform release phase.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Page Footer */}
                        <div className="text-center pt-8 opacity-40">
                            <p className="text-[11px] text-text-muted font-mono uppercase tracking-[0.1em]">
                                Axe Code System Core v5.1 / Encrypted Preference Sync Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
