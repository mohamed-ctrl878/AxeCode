import React from 'react';
import { 
    Zap, 
    ChevronRight, 
    Box, 
    Users, 
    Cpu, 
    BookOpenText 
} from 'lucide-react';

const FeatureBlock = ({ title, subtitle, benefits, address, icon: Icon }) => (
    <div className="flex flex-col items-start text-left max-w-5xl mx-auto mb-32 last:mb-0">
        {/* Text Content */}
        <div className="flex flex-col items-start w-full">
            <div className="flex items-center gap-2 text-accent-primary mb-6">
                <Icon size={20} />
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em]">{subtitle}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-ivory mb-8 leading-tight">
                {title}
            </h2>
            <p className="text-2xl text-accent-primary/90 font-serif italic mb-10 leading-relaxed max-w-3xl">
                "{address}"
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12 text-left w-full">
                {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4 group/item">
                        <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary shrink-0">
                            <ChevronRight size={12} className="group-hover/item:translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-text-muted text-lg font-sans leading-relaxed group-hover/item:text-ivory transition-colors">
                            {benefit}
                        </span>
                    </li>
                ))}
            </ul>

            <button className="flex items-center gap-2 text-ivory font-bold text-xs uppercase tracking-[0.3em] hover:text-accent-primary transition-colors group/btn border-b border-ivory/10 pb-1">
                Explore This Service
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);

const GlobalFeaturesGrid = () => {
    return (
        <section id="features" className="relative pt-40 pb-8 px-6 lg:px-12 bg-near-black overflow-hidden -mx-4 md:-mx-8 scroll-mt-32">
            {/* Background Dots Pattern - Enhanced Visibility */}
            <div 
                className="absolute inset-0 opacity-[0.4]" 
                style={{
                    backgroundImage: 'radial-gradient(circle, #c96442 1.5px, transparent 1.5px)',
                    backgroundSize: '48px 48px'
                }}
            />
            
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-primary/5 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-primary/5 blur-[150px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Intro */}
                <div className="mb-24 flex flex-col items-start gap-3">
                    <h2 className="text-5xl font-serif text-ivory tracking-tight">
                        Platform Features
                    </h2>
                    <div className="h-[2px] w-16 bg-accent-primary" />
                </div>

                {/* Features List */}
                <FeatureBlock 
                    subtitle="Learning Node"
                    title="Professional Courses & Hands-on Coding"
                    address="Stop static watching. Your workspace is an extension of the lesson."
                    icon={Box}
                    benefits={[
                        "Real-time code execution synchronized with video narratives.",
                        "Direct access to production-grade repositories in every lesson.",
                        "Interactive challenges built on real-world engineering hurdles."
                    ]}
                />

                <FeatureBlock 
                    subtitle="Knowledge Library"
                    title="Articles & Blogs"
                    address="Stay at the frontier of industry knowledge without the distraction of the noise."
                    icon={BookOpenText}
                    reversed={true}
                    benefits={[
                        "Curated research papers and technical breakthroughs from industry leaders.",
                        "Deep-dive articles designed for thorough comprehension.",
                        "Daily curator insights from the core AxeCode engineering team."
                    ]}
                />

                <FeatureBlock 
                    subtitle="Social Network"
                    title="Community & Events"
                    address="True intelligence is meant to be shared, refined, and scaled."
                    icon={Users}
                    benefits={[
                        "Professional salons and live workshops with the world's 1% engineers.",
                        "Interactions: Like, comment, and rate content with precision.",
                        "Influence the core ecosystem through high-level contribution."
                    ]}
                />

                {/* Weighted Intelligence - Special Vertical Feature */}
                <div className="mt-20 pt-16 border-t border-white/10">
                    <div className="flex flex-col items-center text-center">
                        <Cpu className="text-accent-primary mb-8" size={64} />
                        <h2 className="text-5xl md:text-6xl font-serif text-ivory mb-12">
                            Weighted <br />
                            <span className="italic">Recommendation System.</span>
                        </h2>
                        
                        <div className="max-w-4xl mx-auto">
                            <p className="text-2xl text-accent-primary/80 font-serif italic mb-16 px-4">
                                "Our system respects your time by calculating the true gravity of knowledge."
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                                <div className="space-y-4">
                                    <h4 className="text-ivory font-serif text-xl border-l-2 border-accent-primary pl-4">Scholarly Weighted Gravity</h4>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        We analyze deep engagement metrics—like verified ratings and completion velocity—to ensure only high-gravity knowledge reaches your feed.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-ivory font-serif text-xl border-l-2 border-accent-primary pl-4">Synergistic Discovery</h4>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        The engine identifies hidden connections between your active courses and global research nodes, building a personalized intellectual graph.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-ivory font-serif text-xl border-l-2 border-accent-primary pl-4">Zero-Noise Intelligence</h4>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        No algorithms optimized for clicks. Our engine is optimized for your mental ROI and professional evolution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalFeaturesGrid;
