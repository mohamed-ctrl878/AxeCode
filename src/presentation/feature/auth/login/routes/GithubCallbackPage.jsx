import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGithubLogin } from '@domain/useCase/useGithubLogin';
import { PATHS } from '@presentation/routes/paths';
import { Loader2, Github, AlertTriangle, ShieldCheck } from 'lucide-react';

/**
 * GithubCallbackPage: Transient page to handle OAuth redirection.
 * Extracts the JWT from the URL and exchanges it for a secure cookie.
 */
const GithubCallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasExchanged = useRef(false);
    const { loginWithGithub, isExchanging, exchangeError } = useGithubLogin();

    useEffect(() => {
        // Prevent double execution in React StrictMode
        if (hasExchanged.current) return;

        // Strapi sends JWT in hash fragment: #access_token=XXX
        // Also check query params as fallback: ?access_token=XXX
        const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
        const queryParams = new URLSearchParams(location.search);
        
        const jwt = hashParams.get('access_token') 
                  || hashParams.get('id_token')
                  || queryParams.get('access_token') 
                  || queryParams.get('id_token');

        if (jwt) {
            hasExchanged.current = true;
            loginWithGithub(jwt).then((result) => {
                if (result) {
                    navigate(PATHS.DASHBOARD);
                }
            });
        } else {
            // No token found in URL
            console.error("No identity token in OAuth callback URL. Hash:", location.hash, "Search:", location.search);
        }
    }, [location, loginWithGithub, navigate]);

    return (
        <div className="md:col-span-12 min-h-screen flex items-center justify-center p-6 bg-surface-dark/50 backdrop-blur-sm">
            <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border border-border-subtle text-center space-y-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="relative">
                    <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-6 border border-border-subtle">
                        <Github size={32} className="text-text-primary" />
                    </div>

                    {!exchangeError ? (
                        <>
                            <h1 className="text-2xl font-bold tracking-tight">Identity Exchange</h1>
                            <p className="text-xs text-text-muted mt-2 font-mono uppercase tracking-[0.2em] animate-pulse italic">
                                Securing OAuth Node Connection...
                            </p>
                            <div className="mt-8 flex justify-center">
                                <Loader2 className="animate-spin text-blue-500" size={40} />
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-red-500">Protocol Failure</h2>
                            <p className="text-xs text-text-muted mt-2 px-4 leading-relaxed">
                                {exchangeError || "The identity verification phase timed out or is invalid."}
                            </p>
                            <button 
                                onClick={() => navigate(PATHS.LOGIN)}
                                className="mt-8 px-6 py-3 bg-surface hover:bg-surface-light border border-border-subtle rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                            >
                                Re-initiate Access
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-center gap-2 opacity-50">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] uppercase font-mono tracking-widest">Encrypted Handshake</span>
                </div>
            </div>
        </div>
    );
};

export default GithubCallbackPage;
