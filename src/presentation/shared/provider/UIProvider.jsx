import React, { createContext, useContext, useState, useMemo } from 'react';

const UIContext = createContext(undefined);

/**
 * UIProvider: Orchestrates global UI states.
 * Follows SRP: Dedicated to UI/Presentation state only.
 */
export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState('dark');

    const value = useMemo(() => ({
        isSidebarOpen,
        toggleSidebar: () => setSidebarOpen(prev => !prev),
        theme,
        setTheme
    }), [isSidebarOpen, theme]);

    return (
        <UIContext.Provider value={value}>
            <div className={`antigravity-app ${theme}`}>
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
