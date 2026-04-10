import { PATHS } from '@presentation/routes/paths';
import AutoTypingSneakPeek from '../components/AutoTypingSneakPeek';
import GlobalFeaturesGrid from '../components/GlobalFeaturesGrid';
import CompanyMarquee from '../components/CompanyMarquee';
import WorkspacesShowcase from '../components/WorkspacesShowcase';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Cpu, Globe, GraduationCap } from 'lucide-react';

const DashboardPage = () => {
    return (
        <div className="md:col-span-12 flex flex-col gap-24 pt-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Section - Split Layout */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6 lg:px-12 max-w-7xl mx-auto w-full">
                {/* Left: Content */}
                <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-3 text-accent-primary mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.4em] opacity-80">Master the Craft of Code</span>
                        <span className="w-12 h-[1px] bg-accent-primary opacity-20" />
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-text-primary tracking-tight leading-[0.95] mb-10">
                        Unleash Your <br />
                        <span className="italic text-accent-primary">Creative <br/> Potential.</span>
                    </h1>
                    
                    <p className="text-xl text-text-muted font-sans leading-relaxed max-w-xl mb-12 opacity-80">
                        Step into a premium learning environment designed to eliminate distractions and accelerate your journey from developer to master engineer.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link to={PATHS.COURSES} className="btn-primary px-8 py-4 text-lg">
                            Start Learning
                            <ArrowRight size={20} />
                        </Link>
                        <Link to={PATHS.REGISTER} className="btn-outline px-8 py-4 text-lg">
                            Get Early Access
                        </Link>
                    </div>
                </div>

                {/* Right: Interactive Sneak Peek */}
                <div className="w-full h-full flex items-center justify-center">
                    <AutoTypingSneakPeek />
                </div>
            </section>

            {/* Core Pillars - User Value Grid */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
                <div className="md:col-span-8 group bg-surface p-12 rounded-2xl shadow-ring hover:shadow-halo transition-all duration-500 overflow-hidden relative">
                    <div className="relative z-10 flex flex-col h-full">
                        <Cpu className="text-accent-primary mb-8" size={40} />
                        <h2 className="text-4xl font-serif text-text-primary mb-4">Deep Focus Learning</h2>
                        <p className="text-text-muted text-lg max-w-md leading-relaxed mb-12">
                            Our "Parchment" interface is mathematically tuned to reduce cognitive load, allowing you to stay in the terminal and in the "flow state" longer.
                        </p>
                        <div className="mt-auto flex items-center gap-4">
                            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">Optimized for Mental Performance</span>
                        </div>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-primary/5 rounded-full blur-3xl group-hover:bg-accent-primary/10 transition-colors" />
                </div>

                <div id="roadmaps" className="md:col-span-4 bg-surface-sunken p-10 rounded-2xl shadow-ring flex flex-col scroll-mt-32">
                    <GraduationCap className="text-accent-primary mb-6" size={32} />
                    <h3 className="text-2xl font-serif text-text-primary mb-4">Mastery Roadmaps</h3>
                    <p className="text-text-muted leading-relaxed mb-8">
                        Navigate from fundamentals to advanced systems architecture with precision-guided curriculum.
                    </p>
                    <Link to={PATHS.COURSES} className="mt-auto text-accent-primary font-bold text-sm flex items-center gap-2 group">
                        Browse Roadmaps
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div id="community" className="md:col-span-4 bg-surface p-10 rounded-2xl shadow-ring scroll-mt-32">
                    <Globe className="text-accent-primary mb-6" size={32} />
                    <h3 className="text-2xl font-serif text-text-primary mb-4">Global Network</h3>
                    <p className="text-text-muted leading-relaxed">
                        Access exclusive live workshops and networking events with industry leaders from across the globe.
                    </p>
                </div>

                <div className="md:col-span-8 bg-surface-elevated p-10 rounded-2xl shadow-ring flex flex-col md:flex-row items-center gap-12 border border-accent-primary/5">
                    <div className="flex-1">
                        <BookOpen className="text-accent-primary mb-6" size={32} />
                        <h3 className="text-3xl font-serif text-text-primary mb-4">Immersive Studio</h3>
                        <p className="text-text-muted leading-relaxed">
                            Experience content in a theater-mode viewer that synchronizes code analysis with high-fidelity video tutorials.
                        </p>
                    </div>
                    <div className="w-48 h-32 bg-background rounded-xl shadow-inner border border-border-subtle flex flex-col gap-2 p-4">
                        <div className="h-2 w-full bg-accent-primary/20 rounded-full" />
                        <div className="h-2 w-3/4 bg-accent-primary/10 rounded-full" />
                        <div className="h-2 w-1/2 bg-accent-primary/10 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Global Features Section - The Obsidian Gallery */}
            <GlobalFeaturesGrid />

            {/* Aspirations Marquee */}
            <CompanyMarquee />

            {/* Workspaces Showcase */}
            <WorkspacesShowcase />

            {/* Philosophy Note */}
            <section className="text-center py-24 border-y border-border-subtle/30 bg-surface/30">
                <span className="font-serif italic text-3xl text-text-muted opacity-60 italic">
                    "Tools designed to honor the craft of the developer."
                </span>
            </section>
        </div>
    );
};

export default DashboardPage;
