import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ChevronDown, User, BookOpen, Calendar, Code, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

// UseCase Hooks (Refactored to follow Clean Architecture)
import { useSearchUsersByQuery } from '@domain/useCase/useSearchUsersByQuery';
import { useSearchCourses } from '@domain/useCase/useSearchCourses';
import { useSearchEvents } from '@domain/useCase/useSearchEvents';
import { useSearchProblems } from '@domain/useCase/useSearchProblems';

const searchTags = [
    { id: 'course', label: 'Course', icon: BookOpen, pathGen: (item) => PATHS.COURSE_DETAILS.replace(':id', item?.uid || item?.id) },
    { id: 'event', label: 'Event', icon: Calendar, pathGen: (item) => PATHS.EVENT_DETAILS.replace(':id', item?.uid || item?.id) },
    { id: 'problem', label: 'Problem', icon: Code, pathGen: (item) => PATHS.PROBLEM_DETAILS.replace(':id', item?.documentId || item?.id) },
    { id: 'user', label: 'User', icon: User, pathGen: (item) => PATHS.PROFILE.replace(':username', item?.username) },
];

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${url.startsWith('/') ? url : '/' + url}`;
};

/**
 * SearchTerminal: Extracted search bar component for the Header.
 * Handles the visual representation of the global search input and specific entity tagging.
 */
export const SearchTerminal = ({ mobile = false }) => {
    const [activeTagId, setActiveTagId] = useState('course');
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    // Initialize Use Cases
    const { searchUsers, users, loading: loadingUsers } = useSearchUsersByQuery();
    const { searchCourses, courses, loading: loadingCourses } = useSearchCourses();
    const { searchEvents, events, loading: loadingEvents } = useSearchEvents();
    const { searchProblems, problems, loading: loadingProblems } = useSearchProblems();

    const dropdownRef = useRef(null);
    const resultsRef = useRef(null);
    const navigate = useNavigate();

    // Map active tag ID to its corresponding use case state
    const activeTag = searchTags.find(t => t.id === activeTagId);
    
    const contextMap = {
        user: { execute: searchUsers, data: users, loading: loadingUsers },
        course: { execute: searchCourses, data: courses, loading: loadingCourses },
        event: { execute: searchEvents, data: events, loading: loadingEvents },
        problem: { execute: searchProblems, data: problems, loading: loadingProblems },
    };

    const currentContext = contextMap[activeTagId];
    const results = currentContext.data;
    const isLoading = currentContext.loading;

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsTagDropdownOpen(false);
            }
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) return;

        const timeoutId = setTimeout(() => {
            currentContext.execute(query);
        }, 400); // 400ms debounce
        
        return () => clearTimeout(timeoutId);
    }, [query, activeTagId]);

    // Handle selection
    const handleResultClick = (item) => {
        const path = activeTag.pathGen(item);
        setIsFocused(false);
        setQuery('');
        navigate(path);
    };

    if (mobile) {
        return (
            <div ref={resultsRef}>
                <button 
                    onClick={() => setIsMobileSearchOpen(true)}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer rounded-xl flex items-center justify-center"
                >
                    <Search size={22} className="text-text-primary" />
                </button>

                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-[100] bg-surface/98 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-[0.98] duration-200">
                        {/* Header bar */}
                        <div className="flex items-center gap-2 p-3 border-b border-border-subtle bg-surface-elevated shadow-sm">
                            <div className="flex-1 relative flex items-center h-10 bg-surface-dark rounded-xl px-3 border border-border-subtle focus-within:border-accent-primary transition-colors">
                                <Search className={isFocused ? 'text-accent-primary' : 'text-text-muted'} size={16} />
                                <input 
                                    type="text" 
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    placeholder={`Search AxeCode...`} 
                                    className="w-full h-full bg-transparent pl-3 pr-2 text-sm outline-none placeholder:text-text-muted/50 text-text-primary focus:bg-transparent"
                                />
                            </div>
                            <button 
                                onClick={() => { setIsMobileSearchOpen(false); setQuery(''); setIsFocused(false); }} 
                                className="text-text-muted hover:text-text-primary px-2 py-1 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Search Categories */}
                        {!query && (
                            <div className="px-4 pt-6 pb-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Categories</p>
                                <div className="flex flex-col gap-2">
                                    {searchTags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => {
                                                setActiveTagId(tag.id);
                                                // Optional: keep it open but set tag
                                            }}
                                            className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${activeTagId === tag.id ? 'border-accent-primary bg-accent-primary/5' : 'border-border-subtle bg-surface hover:border-border-subtle/80'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTagId === tag.id ? 'bg-accent-primary/20 text-accent-primary' : 'bg-surface-sunken text-text-muted'}`}>
                                                    <tag.icon size={18} />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className={`text-sm font-bold ${activeTagId === tag.id ? 'text-accent-primary' : 'text-text-primary'}`}>{tag.label}s</span>
                                                    <span className="text-[11px] text-text-muted">Search for {tag.label.toLowerCase()}s</span>
                                                </div>
                                            </div>
                                            {activeTagId === tag.id && <ChevronRight size={16} className="text-accent-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {query.trim() && (
                            <div className="flex-1 overflow-y-auto w-full px-2 pt-2 pb-6 custom-scrollbar">
                                {isLoading ? (
                                    <div className="p-12 flex flex-col items-center justify-center text-text-muted gap-4">
                                        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="font-mono text-xs uppercase tracking-wider opacity-80">Searching...</span>
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <div className="px-3 pb-2 pt-2">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                                {results.length} Results
                                            </span>
                                        </div>
                                        {results.map((item, idx) => {
                                            const title = activeTag.id === 'user' ? item.username : item.title;
                                            const subtitle = activeTag.id === 'user' ? item.email : (item?.category?.name || `${activeTag.label} Record`);
                                            const hasImage = activeTag.id === 'user' ? !!item?.avatar?.url : !!item?.thumbnail?.url;
                                            const imageUrl = activeTag.id === 'user' ? item?.avatar?.url : item?.thumbnail?.url;

                                            return (
                                                <button
                                                    key={item?.id || item?.documentId || item?.uid || idx}
                                                    onClick={() => handleResultClick(item)}
                                                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-sunken border border-transparent hover:border-border-subtle/50 transition-colors text-left"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-surface-sunken flex flex-shrink-0 items-center justify-center text-text-muted ring-1 ring-border-subtle/50 overflow-hidden">
                                                        {hasImage ? (
                                                            <img src={getImageUrl(imageUrl)} alt={title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <activeTag.icon size={20} />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="text-sm font-semibold text-text-primary truncate">
                                                            {title}
                                                        </span>
                                                        <span className="text-xs text-text-muted truncate mt-0.5">
                                                            {subtitle}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-12 flex flex-col items-center justify-center text-center text-text-muted">
                                        <div className="w-14 h-14 rounded-full bg-surface-sunken flex items-center justify-center mb-4 ring-1 ring-border-subtle/50">
                                            <Search size={24} className="opacity-50 text-accent-primary" />
                                        </div>
                                        <p className="text-base font-semibold text-text-primary mb-1">No matches found</p>
                                        <p className="text-xs max-w-[200px] opacity-70 leading-relaxed">
                                            We couldn't find any {activeTag.label.toLowerCase()} matching "<span className="text-accent-primary">{query}</span>"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-xl relative" ref={resultsRef}>
            <div className={`relative flex items-center bg-surface-dark/50 border rounded-xl transition-all h-10 ${isFocused ? 'border-accent-primary bg-surface-dark' : 'border-border-subtle hover:border-border-subtle/80'}`}>
                
                {/* Tag Selector */}
                <div className="relative h-full" ref={dropdownRef}>
                    <button 
                        type="button"
                        onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className="flex items-center gap-1.5 h-full pl-3 pr-2 text-[11px] font-bold tracking-wide uppercase text-text-muted hover:text-accent-primary transition-colors border-r border-border-subtle/50"
                    >
                        <activeTag.icon size={14} className={isFocused ? 'text-accent-primary' : ''} />
                        <span className="hidden sm:inline">{activeTag.label}</span>
                        <ChevronDown size={12} className={`transition-transform duration-300 ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isTagDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-36 bg-surface-elevated/95 backdrop-blur-md border border-border-subtle rounded-xl shadow-2xl overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200">
                            {searchTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => {
                                        setActiveTagId(tag.id);
                                        setIsTagDropdownOpen(false);
                                        setQuery('');
                                    }}
                                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-[11px] uppercase tracking-wide font-bold transition-all ${activeTagId === tag.id ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-muted hover:bg-surface-sunken hover:text-text-primary'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <tag.icon size={12} className={activeTagId === tag.id ? 'text-accent-primary' : 'opacity-70'} />
                                        {tag.label}
                                    </div>
                                    {activeTagId === tag.id && <ChevronRight size={12} className="animate-in slide-in-from-left-1" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Input Field */}
                <div className="relative flex-1 flex items-center h-full">
                    <Search className={`absolute left-3 transition-colors ${isFocused ? 'text-accent-primary' : 'text-text-muted/50'}`} size={16} />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder={`Search in ${activeTag.label.toLowerCase()}s...`} 
                        className="w-full h-full bg-transparent py-0 pl-9 pr-12 text-sm outline-none placeholder:text-text-muted/50 text-text-primary focus:bg-transparent"
                    />
                    {!query && (
                        <div className="absolute right-3 hidden sm:flex items-center gap-1 bg-border-subtle/50 px-1.5 py-0.5 rounded border border-white/5 pointer-events-none">
                            <Command size={10} className="text-text-muted" />
                            <span className="text-[10px] font-mono text-text-muted">K</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Dropdown */}
            {isFocused && query.trim() && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface-elevated/95 backdrop-blur-xl border border-border-subtle rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                    {isLoading ? (
                        <div className="p-8 flex flex-col items-center justify-center text-xs text-text-muted gap-3">
                            <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                            <span className="font-mono tracking-wider uppercase text-[10px] opacity-80">Scanning Knowledge Base...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col max-h-80 overflow-y-auto custom-scrollbar">
                            <div className="px-3 pt-3 pb-2 flex items-center gap-2 border-b border-border-subtle/50">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                    Found {results.length} results inside {activeTag.label}s
                                </span>
                            </div>
                            {results.map((item, idx) => {
                                const title = activeTag.id === 'user' ? item.username : item.title;
                                const subtitle = activeTag.id === 'user' ? item.email : (item?.category?.name || `${activeTag.label} Record`);
                                const hasImage = activeTag.id === 'user' ? !!item?.avatar?.url : !!item?.thumbnail?.url;
                                const imageUrl = activeTag.id === 'user' ? item?.avatar?.url : item?.thumbnail?.url;

                                return (
                                    <button
                                        key={item?.id || item?.documentId || item?.uid || idx}
                                        onClick={() => handleResultClick(item)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-surface-sunken transition-colors border-b border-border-subtle/30 last:border-0 text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-surface flex flex-shrink-0 items-center justify-center text-accent-primary ring-1 ring-border-subtle/50 group-hover:ring-accent-primary/30 transition-all overflow-hidden border border-border-subtle/20">
                                            {hasImage ? (
                                                <img src={getImageUrl(imageUrl)} alt={title} className="w-full h-full object-cover" />
                                            ) : (
                                                <activeTag.icon size={16} className="group-hover:scale-110 transition-transform" />
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-[14px] font-medium text-text-primary truncate group-hover:text-accent-primary transition-colors">
                                                {title}
                                            </span>
                                            <span className="text-[11px] text-text-muted truncate mt-0.5">
                                                {subtitle}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 flex flex-col items-center justify-center text-center text-text-muted bg-surface-sunken/30">
                            <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mb-3 ring-1 ring-border-subtle/50">
                                <Search size={20} className="opacity-50 text-accent-primary" />
                            </div>
                            <p className="text-sm font-semibold text-text-primary mb-1">No matches found</p>
                            <p className="text-[11px] max-w-[200px] opacity-70 leading-relaxed">
                                We couldn't find any {activeTag.label.toLowerCase()} matching "<span className="text-accent-primary">{query}</span>"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
