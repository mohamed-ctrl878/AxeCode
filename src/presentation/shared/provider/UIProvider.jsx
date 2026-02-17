import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { uiPersistenceRepository } from '@infrastructure/repository/UIPersistenceRepository';

const UIContext = createContext(undefined);

/**
 * UIProvider: Orchestrates global UI states.
 * Follows SRP: Dedicated to UI/Presentation state only.
 * Syncs the visual 'mood' (theme) with the document root and persistence storage.
 */
export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // Initialize theme from persistence (localStorage)
    const [theme, setThemeState] = useState(() => uiPersistenceRepository.getTheme());

    // Effect: Synchronize Theme Mood with Document Root
    // This allows CSS variables and Tailwind 'dark:' variants to work globally.
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        // Persist theme choice
        uiPersistenceRepository.setTheme(theme);
    }, [theme]);

    const value = useMemo(() => ({
        isSidebarOpen,
        toggleSidebar: () => setSidebarOpen(prev => !prev),
        theme,
        setTheme: setThemeState
    }), [isSidebarOpen, theme]);

    return (
        <UIContext.Provider value={value}>
            <div className="antigravity-app h-full">
                {children}
            </div>
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
