import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { PATHS } from '../../routes/paths';
import AxeCodeLogo from '../components/AxeCodeLogo';

const ComingSoonPage = () => {
    return (
        <div className="md:col-span-12 w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-12">
                <div className="w-24 h-24 rounded-full bg-accent-primary/5 flex items-center justify-center animate-pulse">
                    <Clock size={40} className="text-accent-primary opacity-60" />
                </div>
                <div className="absolute -right-4 -bottom-4 bg-near-black p-1 rounded-xl shadow-2xl">
                    <AxeCodeLogo isCollapsed={true} size="text-xs" />
                </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif text-text-primary mb-6">
                Under <span className="italic text-accent-primary">Restoration.</span>
            </h1>
            
            <p className="text-xl text-text-muted font-sans leading-relaxed max-w-xl mb-12 opacity-80">
                This repository of knowledge is currently being curated and will be available soon. Our masters are working to ensure the highest fidelity experience.
            </p>

            <div className="flex flex-col items-center gap-6">
                <Link 
                    to={PATHS.DASHBOARD} 
                    className="btn-primary px-8 py-4 text-lg flex items-center gap-3"
                >
                    <ArrowLeft size={20} />
                    Back to demo page
                </Link>
                
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.4em] opacity-40">
                    Expected Restoration: Q2 2026
                </span>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 blur-[150px] rounded-full -z-10" />
        </div>
    );
};

export default ComingSoonPage;
