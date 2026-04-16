import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Github, 
    Linkedin, 
    Twitter, 
    ArrowUpRight, 
    Mail, 
    ChevronRight,
    Globe
} from 'lucide-react';

import { PATHS } from '../../routes/paths';
import AxeCodeLogo from '../components/AxeCodeLogo';
import { cn } from '@core/utils/cn';

const FooterLink = ({ to, children, isAnchor }) => (
    <li>
        {isAnchor ? (
            <a 
                href={to} 
                className="text-text-muted hover:text-accent-primary transition-colors duration-200 flex items-center gap-1 group"
            >
                {children}
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </a>
        ) : (
            <Link 
                to={to} 
                className="text-text-muted hover:text-accent-primary transition-colors duration-200 flex items-center gap-1 group"
            >
                {children}
                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </Link>
        )}
    </li>
);

const FooterHeading = ({ children }) => (
    <h4 className="text-ivory font-serif text-lg mb-6">{children}</h4>
);

export const GlobalFooter = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <footer className={cn(
            "bg-near-black border-t border-white/5 px-6 lg:px-12 mt-auto",
            !isAuthenticated ? "pt-20 pb-10" : "py-8"
        )}>
            <div className="max-w-[1440px] mx-auto">
                {/* Top Section: Branding + Links (Guests Only) */}
                {!isAuthenticated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Brand Column */}
                        <div className="lg:col-span-4 flex flex-col items-start">
                            <div className="mb-6">
                                <AxeCodeLogo size="text-2xl" />
                            </div>
                            <p className="text-text-muted leading-relaxed max-w-xs mb-8">
                                Tools designed to honor the craft of the developer. A premium repository for masters, engineers, and scholars.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com/mohamed-ctrl878" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-ivory hover:bg-accent-primary transition-all duration-300">
                                    <Github size={18} />
                                </a>
                                <a href="https://www.linkedin.com/in/mohamed-el-eskanderany/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-ivory hover:bg-accent-primary transition-all duration-300">
                                    <Linkedin size={18} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-ivory hover:bg-accent-primary transition-all duration-300">
                                    <Twitter size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        <div className="lg:col-span-2">
                            <FooterHeading>Platform</FooterHeading>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to={`${PATHS.DOCUMENTATION}#Learning`}>Courses</FooterLink>
                                <FooterLink to={`${PATHS.DOCUMENTATION}#Workspaces`}>Workspaces</FooterLink>
                                <FooterLink to={`${PATHS.DOCUMENTATION}#Learning`}>Roadmaps</FooterLink>
                                <FooterLink to={`${PATHS.DOCUMENTATION}#Community`}>Community</FooterLink>
                            </ul>
                        </div>

                        <div className="lg:col-span-2">
                            <FooterHeading>Resources</FooterHeading>
                            <ul className="space-y-4 text-sm">
                                <FooterLink to={PATHS.DOCUMENTATION}>Documentation</FooterLink>
                                <FooterLink to={`${PATHS.DOCUMENTATION}#Workspaces`}>What's New</FooterLink>
                                <FooterLink to="https://github.com/mohamed-ctrl878/AxeCode_backend" isAnchor>Support</FooterLink>
                            </ul>
                        </div>

                        <div className="lg:col-span-4">
                            <FooterHeading>Newsletter</FooterHeading>
                            <p className="text-text-muted text-sm mb-6">
                                Receive scholarly insights and platform updates directly in your inbox.
                            </p>
                            <form className="relative">
                                <input 
                                    type="email" 
                                    placeholder="Scholar's Email..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-ivory outline-none focus:border-accent-primary transition-all pr-12"
                                />
                                <button className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-accent-primary text-white rounded-lg flex items-center justify-center hover:brightness-110 transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Bottom Section: Legal & Language */}
                <div className={cn(
                    "flex flex-col md:flex-row justify-between items-center gap-6",
                    !isAuthenticated && "border-t border-white/5 pt-10"
                )}>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-text-muted">
                        <span className="text-white/20 whitespace-nowrap">© {new Date().getFullYear()} AxeCode Platform</span>
                        <Link to={PATHS.PRIVACY} className="hover:text-accent-primary transition-colors whitespace-nowrap">Privacy</Link>
                        <Link to={PATHS.TERMS} className="hover:text-accent-primary transition-colors whitespace-nowrap">Terms</Link>
                        <Link to={PATHS.DOCUMENTATION} className="hover:text-accent-primary transition-colors whitespace-nowrap underline decoration-accent-primary/30 underline-offset-4">Documentation</Link>
                    </div>
                    
                    <div className="flex items-center gap-3 text-white/40">
                        <Globe size={14} className="text-accent-primary opacity-50" />
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Global Repository / EN</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
