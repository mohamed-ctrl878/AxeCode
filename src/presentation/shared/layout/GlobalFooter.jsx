import React from 'react';
import { Link } from 'react-router-dom';
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
    return (
        <footer className="bg-near-black border-t border-white/5 pt-20 pb-10 px-6 lg:px-12 mt-auto">
            <div className="max-w-[1440px] mx-auto">
                {/* Top Section: Branding + Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    
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
                            <FooterLink to="/#features" isAnchor>Courses</FooterLink>
                            <FooterLink to="/#workspaces" isAnchor>Workspaces</FooterLink>
                            <FooterLink to="/#roadmaps" isAnchor>Roadmaps</FooterLink>
                            <FooterLink to="/#community" isAnchor>Community</FooterLink>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <FooterHeading>Resources</FooterHeading>
                        <ul className="space-y-4 text-sm">
                            <FooterLink to={PATHS.COMING_SOON}>Documentation</FooterLink>
                            <FooterLink to={PATHS.COMING_SOON}>Blog</FooterLink>
                            <FooterLink to={PATHS.COMING_SOON}>API Reference</FooterLink>
                            <FooterLink to={PATHS.COMING_SOON}>Support</FooterLink>
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

                {/* Bottom Section: Legal & Language */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 text-[11px] font-sans font-bold uppercase tracking-widest text-text-muted">
                        <span>© {new Date().getFullYear()} AxeCode Platform</span>
                        <FooterLink to={PATHS.COMING_SOON}>Privacy</FooterLink>
                        <FooterLink to={PATHS.COMING_SOON}>Terms</FooterLink>
                    </div>
                    
                    <div className="flex items-center gap-3 text-text-muted">
                        <Globe size={14} />
                        <span className="text-[11px] font-sans font-bold uppercase tracking-widest">Global Repository / EN</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
