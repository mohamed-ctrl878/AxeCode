import React, { useState, useEffect } from 'react';
import { cn } from '@core/utils/cn';
import { ChevronDown, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useUI } from '@presentation/shared/provider/UIProvider';

/**
 * ProblemEditor - Code editor panel with language selector.
 * Uses Monaco Editor configured with the Claude generic design system.
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
    const { theme } = useUI();
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

    const handleEditorWillMount = (monaco) => {
        // Define Light Theme (Parchment/Ivory)
        monaco.editor.defineTheme('claude-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: 'c96442', fontStyle: 'bold' }, // Terracotta
                { token: 'string', foreground: '47b881' }, // Emerald
                { token: 'number', foreground: 'b53333' }, // Rose
                { token: 'comment', foreground: '5e5d59', fontStyle: 'italic' }, // Olive Gray
                { token: 'identifier', foreground: '141413' },
            ],
            colors: {
                'editor.background': '#faf9f5', // Ivory
                'editor.foreground': '#141413', // Near Black
                'editor.lineHighlightBackground': '#f0eee6', // Subtle border
                'editorLineNumber.foreground': '#5e5d59',
                'editorCursor.foreground': '#c96442',
            }
        });

        // Define Dark Theme (Charcoal/Sunken)
        monaco.editor.defineTheme('claude-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: 'd97757', fontStyle: 'bold' }, // Coral
                { token: 'string', foreground: '47b881' }, 
                { token: 'number', foreground: 'f59e0b' }, // Amber
                { token: 'comment', foreground: 'b0aea5', fontStyle: 'italic' }, 
                { token: 'identifier', foreground: 'faf9f5' },
            ],
            colors: {
                'editor.background': '#1a1a19', // Surface Sunken Dark
                'editor.foreground': '#faf9f5',
                'editor.lineHighlightBackground': '#30302e', // Surface Dark
                'editorLineNumber.foreground': '#b0aea5',
                'editorCursor.foreground': '#d97757',
            }
        });
    };

    return (
        <div className={cn("flex flex-col h-full bg-surface-sunken rounded-xl overflow-hidden border border-border-subtle transition-colors duration-300", isReadOnly && "opacity-90")}>
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border-subtle shrink-0">
                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => !isReadOnly && setShowLangDropdown(!showLangDropdown)}
                        className={cn("flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-background border border-border-default text-text-primary transition-all", !isReadOnly && "hover:border-accent-primary focus:border-accent-primary shadow-sm", isReadOnly && "cursor-default")}
                    >
                        {language || 'javascript'}
                        {!isReadOnly && <ChevronDown size={12} />}
                    </button>

                    {showLangDropdown && !isReadOnly && (
                        <div className="absolute top-full left-0 mt-1 w-36 bg-surface-elevated border border-border-default rounded-bento shadow-whisper z-50 overflow-hidden">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageSelect(lang)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-xs font-mono hover:bg-border-subtle transition-colors",
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
                            className="flex items-center gap-1 hover:text-accent-rose transition-colors opacity-60 hover:opacity-100"
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
            <div className="flex-1 w-full relative">
                <Editor
                    height="100%"
                    language={language || 'javascript'}
                    value={code || ''}
                    theme={theme === 'dark' ? 'claude-dark' : 'claude-light'}
                    onChange={(val) => onCodeChange?.(val)}
                    beforeMount={handleEditorWillMount}
                    options={{
                        readOnly: isReadOnly,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                        lineHeight: 24,
                        padding: { top: 16, bottom: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on"
                    }}
                    loading={<div className="p-4 text-text-muted text-sm flex items-center justify-center h-full">Loading Editor...</div>}
                />
            </div>
        </div>
    );
};
