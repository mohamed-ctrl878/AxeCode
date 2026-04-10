import React from 'react';
import { 
    Users, 
    FileText, 
    GitBranch, 
    Calendar, 
    CheckCircle2, 
    FileCode, 
    Layers,
    Github
} from 'lucide-react';

const DocumentCard = ({ title, type, delay }) => (
    <div 
        className="bg-surface p-4 rounded-xl shadow-ring border border-border-subtle flex items-center gap-4 hover:shadow-halo hover:-translate-y-1 transition-all duration-300"
        style={{ transitionDelay: `${delay}ms` }}
    >
        <div className="w-10 h-10 rounded-lg bg-accent-primary/5 flex items-center justify-center text-accent-primary">
            <FileText size={20} />
        </div>
        <div>
            <h4 className="text-sm font-bold font-sans text-text-primary uppercase tracking-wider">{title}</h4>
            <p className="text-[10px] text-text-muted font-sans uppercase tracking-widest">{type}</p>
        </div>
        <div className="ml-auto">
            <CheckCircle2 size={14} className="text-status-success opacity-40" />
        </div>
    </div>
);

const WorkspacesShowcase = () => {
    return (
        <section id="workspaces" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                
                {/* Visual Representation (Left on mobile, Right on Desktop) */}
                <div className="order-2 lg:order-2 relative">
                    {/* Background decorative element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-primary/5 blur-[100px] rounded-full -z-10" />
                    
                    {/* The SDLC Document Stack (Staggered for visual interest and to prevent overlap) */}
                    <div className="relative flex flex-col gap-6 max-w-md mx-auto py-12 px-8">
                        {/* SRS - Shifted Left */}
                        <div className="transform -translate-x-6">
                            <DocumentCard title="SRS Document" type="Software Requirements" delay={0} />
                        </div>
                        
                        {/* URS - Shifted Right */}
                        <div className="transform translate-x-12 relative z-10">
                            <DocumentCard title="URS Document" type="User Requirements" delay={100} />
                            
                            {/* Sprint Card Overlay - Positioned safely relative to URS */}
                            <div className="absolute -left-32 top-0 bg-surface-elevated p-5 rounded-2xl shadow-halo border border-border-default min-w-[190px] z-30 animate-float-slow">
                                <div className="flex items-center gap-2 mb-3 border-b border-border-subtle pb-2">
                                    <Layers size={14} className="text-accent-primary" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-text-primary">Active Sprint</span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="h-1.5 w-full bg-accent-primary/10 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-accent-primary" />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter opacity-80">
                                        <span className="text-accent-primary">Alpha Phase 1</span>
                                        <span>67%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SysRS - Center/Right with GitHub badge attached */}
                        <div className="transform translate-x-2 relative">
                            <DocumentCard title="SysRS Spec" type="System Specification" delay={200} />
                            
                            {/* GitHub Integration Badge - Now on the Right, Safely away from text */}
                            <div className="absolute -right-24 -bottom-4 bg-near-black text-ivory px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-ivory/20 z-30 animate-bounce-subtle">
                                <div className="w-8 h-8 rounded-full bg-ivory/10 flex items-center justify-center">
                                    <Github size={18} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 text-white">Cloud Sync</span>
                                    <span className="text-[11px] font-sans text-white/90">Linked: GitHub</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="order-1 lg:order-1 flex flex-col items-start gap-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary mb-2">
                        <Users size={14} />
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Team Synergy</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-serif text-text-primary leading-tight">
                        Collaborative <br />
                        <span className="italic text-accent-primary">Workspaces.</span>
                    </h2>

                    <p className="text-lg text-text-muted leading-relaxed max-w-md font-sans opacity-95">
                        Transition from individual learning to high-performance teamwork. Connect with fellow scholars to simulate real-world engineering environments within a unified project lifecycle.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-text-primary">
                                <Calendar size={18} className="text-accent-primary" />
                                <h5 className="font-serif font-bold text-lg">Sprint Orchestration</h5>
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Map roadmaps, define responsibilities, and manage agile sprints with precision.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-text-primary">
                                <FileCode size={18} className="text-accent-primary" />
                                <h5 className="font-serif font-bold text-lg">Full SDLC Stack</h5>
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Authoring for SRS, URS, and System Docs with native export and version control.
                            </p>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-border-subtle my-2" />

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-sunken border border-border-default w-full">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface-sunken bg-accent-primary/${i}0 flex items-center justify-center text-[10px] font-bold`}>
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-text-muted font-sans">
                            <span className="text-text-primary font-bold"> (I hope) 1,200+ Scholars</span> found their teams here last month.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-5px, -10px) rotate(-1deg); }
                    66% { transform: translate(5px, 5px) rotate(1deg); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 4s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default WorkspacesShowcase;
