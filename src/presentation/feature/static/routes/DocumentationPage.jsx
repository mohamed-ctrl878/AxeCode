import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    BookOpen, 
    Github, 
    Zap, 
    Code2, 
    Terminal, 
    Trophy, 
    Users, 
    PenTool, 
    Calendar,
    MessageSquare, 
    Bell,
    ArrowRight,
    ArrowLeft,
    ChevronRight,
    Lightbulb,
    Sparkles
} from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '../../../routes/paths';
import { useEffect, useState } from 'react';

const DOCS_CONTENT = [
    {
        id: "GettingStarted",
        title: "The Repository Entry",
        subtitle: "Harnessing your identity",
        icon: Github,
        content: "AxeCode is built on the foundation of verified expertise. To join the agora, you must link your GitHub identity. This allows us to sync your repository history and provide a profile that truly reflects your engineering craft.",
        tips: [
            "Linking your GitHub is required for code submissions.",
            "Your profile acts as a living portfolio for potential collaborators."
        ]
    },
    {
        id: "Learning",
        title: "The Learning Circuit",
        subtitle: "Mastering new domains",
        icon: BookOpen,
        content: "Courses on AxeCode are designed as interactive manuscripts. As you progress through lessons, your growth is tracked in real-time. Use the Roadmap feature to visualize your journey from apprentice to master.",
        tips: [
            "Each module contains practical challenges to solidify concepts.",
            "Use the 'Enrolled Content' dashboard for a quick overview of your progress."
        ]
    },
    {
        id: "Forge",
        title: "The Engineering Forge",
        subtitle: "Sharpening your code",
        icon: Code2,
        content: "The Problems section (The Forge) is where theory meets practice. Our integrated compiler (powered by Judge0) supports multiple languages. Submit your solutions to see where you stand against the test suite through advanced test cases.",
        tips: [
            "Read the 'Constraints' section carefully before submitting complex logic.",
            "The output console provides detailed debug logs for failed test cases."
        ]
    },
    {
        id: "Workspaces",
        title: "Collaborative Workspaces (The Atelier)",
        subtitle: "Engineering Lifecycle Synergy",
        icon: Users,
        content: "The Atelier is a high-fidelity environment designed to bridge the gap between individual skill acquisition and industrial-grade teamwork. These spaces provide a unified stack for the entire Software Development Life Cycle (SDLC), allowing scholars to collectively author mission-critical artifacts like SRS and URS documents, orchestrate agile sprints, and synchronize progress directly with GitHub repositories. Available soon, Insha'Allah.",
        tips: [
            "Lifecycle Orchestration: manage sprints with professional-grade precision.",
            "Unified Cloud Sync: mirror your workspace movements to GitHub seamlessly."
        ]
    },
    {
        id: "Events",
        title: "Professional Events (The Agora)",
        subtitle: "Collaborative Intelligence Exchange",
        icon: Calendar,
        content: "The Agora is the central gathering place for the community. Beyond simple meetings, our Events are high-fidelity professional salons and live workshops led by elite engineers. Scholars can engage in live architectural reviews, participate in code-crafting sessions, and influence the core ecosystem through direct contribution and scholarly debate.",
        tips: [
            "Scholarly Salons: Join live workshops focused on deep systems design.",
            "Architectural Reviews: Participate in high-level peer reviews with industry veterans."
        ]
    },
    {
        id: "Community",
        title: "Scholarly Contributions",
        subtitle: "Sharing the craft",
        icon: PenTool,
        content: "Writing is thinking made manifest. Share your insights via Articles and Blogs. Our markdown-ready editor allows you to embed code snippets and media, ensuring your ideas are presented with technical precision.",
        tips: [
            "Engage with other scholars through scholarly comments.",
            "Quality contributions increase your visibility within the repository."
        ]
    },
    {
        id: "Navigation",
        title: "Repository Navigation",
        subtitle: "Finding your way",
        icon: Terminal,
        content: "Use the global search bar in the header to quickly locate courses, problems, or other scholars. By selecting a specific category tag, you can filter results to find exactly what you need with precision.",
        tips: [
            "Use the tag selector to focus your search on a specific domain.",
            "Click on any result to jump directly to that module."
        ]
    },
    {
        id: "Curator",
        title: "The Intelligent Curator",
        subtitle: "Personalized Discovery",
        icon: Sparkles,
        content: "AxeCode features an integrated recommendation engine that surfaces relevant content tailored to your current focus. Whether you are tackling a problem in The Forge or reading a scholarly article, the Curator suggests courses and events to accelerate your growth.",
        tips: [
            "Look for 'Prepare First' sections to find courses relevant to your current challenges.",
            "Recommendations evolve as you contribute more to the repository."
        ]
    }
];

const DocSection = ({ section, isActive }) => {
    const Icon = section.icon;
    return (
        <section id={section.id} className="mb-24 scroll-mt-32 animate-in fade-in duration-700">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-3 rounded-2xl border transition-all duration-300",
                        isActive 
                            ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary shadow-[0_0_20px_rgba(var(--color-accent-primary-rgb),0.1)]" 
                            : "bg-surface-sunken border-border-subtle text-text-muted"
                    )}>
                        <Icon size={26} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif text-text-primary tracking-tight">
                            {section.title}
                        </h2>
                        <p className="text-sm font-sans uppercase tracking-[0.2em] text-accent-primary opacity-60 font-bold mt-1">
                            {section.subtitle}
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl">
                    <p className="text-lg text-text-muted leading-relaxed font-sans mb-8">
                        {section.content}
                    </p>

                    {/* Pro Tips Box */}
                    <div className="bg-surface-sunken/50 border-l-4 border-accent-primary rounded-r-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Lightbulb size={48} className="text-accent-primary" />
                        </div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-primary mb-4">
                            <Zap size={14} className="text-accent-primary" />
                            Scholar's Pro-Tips
                        </h4>
                        <ul className="space-y-3">
                            {section.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                                    <ChevronRight size={16} className="text-accent-primary mt-0.5 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

const DocumentationPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [activeSection, setActiveSection] = useState(DOCS_CONTENT[0].id);

    const handleCommunityAction = () => {
        if (isAuthenticated) {
            navigate(PATHS.FEED);
        } else {
            navigate(PATHS.LOGIN);
        }
    };

    const handleRoadmapAction = () => {
        if (isAuthenticated) {
            navigate(PATHS.ROADMAPS);
        } else {
            navigate(PATHS.LOGIN);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = DOCS_CONTENT.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 150;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="md:col-span-12 min-h-screen pt-4 pb-32">
            {/* Elegant Header */}
            <div className="mb-20 border-b border-border-subtle pb-12">
                <Link 
                    to={isAuthenticated ? PATHS.COURSES : PATHS.DASHBOARD} 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent-primary transition-colors mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    {isAuthenticated ? 'Back to Courses' : 'Exit Documentation'}
                </Link>
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-serif text-text-primary mb-6 tracking-tighter">
                        The Scholar's <span className="text-accent-primary font-italic">Manual</span>
                    </h1>
                    <p className="text-xl text-text-muted font-sans leading-relaxed max-w-2xl">
                        A definitive guide to mastering the resources and community features of the AxeCode repository.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Visual Navigation (Left) */}
                <aside className="lg:col-span-4 hidden lg:block">
                    <div className="sticky top-32">
                        <div className="mb-6 px-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-primary">The Handbook</span>
                        </div>
                        <nav className="space-y-1">
                            {DOCS_CONTENT.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={cn(
                                            "w-full text-left px-4 py-4 rounded-xl transition-all group flex items-center gap-4",
                                            activeSection === section.id 
                                                ? "bg-surface-sunken text-text-primary shadow-sm" 
                                                : "text-text-muted hover:text-text-primary hover:bg-surface-sunken/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "transition-all duration-500",
                                            activeSection === section.id ? "text-accent-primary scale-110" : "scale-100"
                                        )}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium block">{section.title}</span>
                                            {activeSection === section.id && (
                                                <div className="h-0.5 bg-accent-primary mt-1 w-full animate-in slide-in-from-left duration-500" />
                                            )}
                                        </div>
                                        <ChevronRight 
                                            size={14} 
                                            className={cn(
                                                "transition-all",
                                                activeSection === section.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                            )} 
                                        />
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-16 p-6 rounded-2xl bg-near-black text-ivory/80 text-xs font-sans leading-relaxed border border-white/5">
                            <p>Need further assistance? Our community is available in the <span className="text-accent-primary font-bold">Activity Feed</span>.</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area (Right) */}
                <main className="lg:col-span-8">
                    <div className="space-y-32">
                        {DOCS_CONTENT.map((section) => (
                            <DocSection 
                                key={section.id} 
                                section={section} 
                                isActive={activeSection === section.id}
                            />
                        ))}
                    </div>

                    <div className="mt-20 pt-16 border-t border-border-subtle">
                        <div className="bento-card bg-accent-primary/5 border-accent-primary/20 p-10 flex flex-col items-center text-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-ivory shadow-lg">
                                <Trophy size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-text-primary mb-2">Ready to contribute?</h3>
                                <p className="text-text-muted max-w-sm mx-auto mb-8">
                                    The documentation is a living document. Join the discussion to suggest refinements.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button 
                                        onClick={handleCommunityAction}
                                        className="btn-primary"
                                    >
                                        Join Community
                                        <ArrowRight size={18} />
                                    </button>
                                    <button 
                                        onClick={handleRoadmapAction}
                                        className="px-6 py-2 rounded-xl border border-border-subtle text-text-primary text-xs font-bold uppercase tracking-widest hover:bg-surface-sunken transition-all"
                                    >
                                        View Roadmap
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DocumentationPage;
