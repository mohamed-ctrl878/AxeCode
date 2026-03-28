import React, { useState, useEffect } from 'react';
import { cn } from '@core/utils/cn';
import { ChevronDown, RotateCcw } from 'lucide-react';

/**
 * ProblemEditor - Code editor panel with language selector.
 * Uses a textarea for now (Monaco/CodeMirror can be swapped in later).
 * Pre-populations from codeTemplates.
 *
 * @param {{ codeTemplates: Array, code: string, language: string, onCodeChange: Function, onLanguageChange: Function }} props
 */
export const ProblemEditor = ({
    codeTemplates = [],
    code,
    language,
    onCodeChange,
    onLanguageChange,
    onResetCode,
    isReadOnly = false
}) => {
    const languages = ['javascript', 'python', 'java', 'cpp'];
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    // When language changes, auto-populate starter code from templates
    useEffect(() => {
        if (!codeTemplates.length || isReadOnly) return;
        const template = codeTemplates.find(t => t.language === language);
        if (template && !code) {
            onCodeChange?.(template.starterCode);
        }
    }, [language, codeTemplates, isReadOnly]);

    const handleLanguageSelect = (lang) => {
        if (isReadOnly) return;
        onLanguageChange?.(lang);
        // Load starter code from template for the new language
        const template = codeTemplates.find(t => t.language === lang);
        if (template) {
            onCodeChange?.(template.starterCode);
        }
        setShowLangDropdown(false);
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#1e1e2e] rounded-xl overflow-hidden border border-border-subtle", isReadOnly && "opacity-90")}>
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border-subtle shrink-0">
                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => !isReadOnly && setShowLangDropdown(!showLangDropdown)}
                        className={cn("flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-surface-dark border border-border-subtle text-text-primary transition-all", !isReadOnly && "hover:border-accent-primary", isReadOnly && "cursor-default")}
                    >
                        {language || 'javascript'}
                        {!isReadOnly && <ChevronDown size={12} />}
                    </button>

                    {showLangDropdown && !isReadOnly && (
                        <div className="absolute top-full left-0 mt-1 w-36 bg-surface border border-border-subtle rounded-lg shadow-xl z-50 overflow-hidden">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageSelect(lang)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-xs font-mono hover:bg-white/5 transition-colors",
                                        lang === language ? "text-accent-primary bg-accent-primary/5" : "text-text-muted"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-[10px] text-text-muted font-mono flex items-center gap-3">
                    {!isReadOnly && onResetCode && (
                        <button 
                            onClick={onResetCode}
                            title="Reset to default code template"
                            className="flex items-center gap-1 hover:text-red-400 transition-colors opacity-60 hover:opacity-100"
                        >
                            <RotateCcw size={12} />
                            <span>Reset</span>
                        </button>
                    )}
                    {isReadOnly && <span className="text-accent-primary/70 uppercase font-bold tracking-wider">Read Only</span>}
                    <span>{code?.split('\n').length || 0} lines</span>
                </div>
            </div>

            {/* Code Area */}
            <textarea
                value={code || ''}
                readOnly={isReadOnly}
                onChange={(e) => onCodeChange?.(e.target.value)}
                spellCheck={false}
                className={cn("flex-1 w-full p-4 bg-transparent text-text-primary text-sm font-mono resize-none outline-none placeholder-text-muted/30 leading-relaxed", isReadOnly && "selection:bg-white/10")}
                placeholder="// Write your solution here..."
                style={{
                    tabSize: 4,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                }}
            />
        </div>
    );
};
