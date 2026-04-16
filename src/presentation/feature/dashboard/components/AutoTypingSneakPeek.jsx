import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const SNIPPETS = {
    javascript: `// AxeCode: Modular JS
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    let result = [], l = 0, r = 0;
    while (l < left.length && r < right.length) {
        if (left[l] < right[r]) result.push(left[l++]);
        else result.push(right[r++]);
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}`,
    python: `# AxeCode: Scholarly Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    return res + left[i:] + right[j:]`,
    cpp: `// AxeCode: Performance C++
#include <vector>
using namespace std;

void merge(vector<int>& a, int l, int m, int r) {
    vector<int> tmp;
    int i = l, j = m + 1;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else tmp.push_back(a[j++]);
    }
    while (i <= m) tmp.push_back(a[i++]);
    while (j <= r) tmp.push_back(a[j++]);
    for (int k = 0; k < tmp.size(); k++) a[l+k] = tmp[k];
}

void mergeSort(vector<int>& a, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        merge(a, l, m, r);
    }
}`,
    java: `// AxeCode: Enterprise Java
public class SortEngine {
    public void mergeSort(int[] a, int n) {
        if (n < 2) return;
        int mid = n / 2;
        int[] l = new int[mid], r = new int[n - mid];
        for (int i = 0; i < mid; i++) l[i] = a[i];
        for (int i = mid; i < n; i++) r[i-mid] = a[i];
        mergeSort(l, mid); mergeSort(r, n - mid);
        merge(a, l, r, mid, n - mid);
    }

    private void merge(int[] a, int[] l, int[] r, int left, int right) {
        int i = 0, j = 0, k = 0;
        while (i < left && j < right) {
            if (l[i] <= r[j]) a[k++] = l[i++];
            else a[k++] = r[j++];
        }
        while (i < left) a[k++] = l[i++];
        while (j < right) a[k++] = r[j++];
    }
}`
};

// ─── Lightweight Syntax Highlighter ───
// Uses regex to tokenize and colorize code without any external library.
const HIGHLIGHT_RULES = {
    javascript: [
        { pattern: /(\/\/.*)/g, className: 'snk-comment' },
        { pattern: /\b(function|return|const|let|var|if|else|while|for|new)\b/g, className: 'snk-keyword' },
        { pattern: /\b(\d+)\b/g, className: 'snk-number' },
        { pattern: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, className: 'snk-string' },
        { pattern: /\b(mergeSort|merge|push|concat|slice|Math\.floor)\b/g, className: 'snk-function' },
    ],
    python: [
        { pattern: /(#.*)/g, className: 'snk-comment' },
        { pattern: /\b(def|return|if|else|while|for|and|or|not|in|import|from|class)\b/g, className: 'snk-keyword' },
        { pattern: /\b(\d+)\b/g, className: 'snk-number' },
        { pattern: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, className: 'snk-string' },
        { pattern: /\b(merge_sort|merge|len|append|pop)\b/g, className: 'snk-function' },
    ],
    cpp: [
        { pattern: /(\/\/.*)/g, className: 'snk-comment' },
        { pattern: /\b(void|int|for|if|return|using|namespace|include)\b/g, className: 'snk-keyword' },
        { pattern: /#\w+/g, className: 'snk-keyword' },
        { pattern: /\b(\d+)\b/g, className: 'snk-number' },
        { pattern: /(&lt;[^&]*&gt;)/g, className: 'snk-string' },
        { pattern: /\b(mergeSort|merge|vector|std)\b/g, className: 'snk-function' },
    ],
    java: [
        { pattern: /(\/\/.*)/g, className: 'snk-comment' },
        { pattern: /\b(public|class|void|int|if|return|new|for)\b/g, className: 'snk-keyword' },
        { pattern: /\b(\d+)\b/g, className: 'snk-number' },
        { pattern: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, className: 'snk-string' },
        { pattern: /\b(mergeSort|merge|SortEngine)\b/g, className: 'snk-function' },
    ],
};

/**
 * Escapes HTML entities so raw code doesn't break markup.
 */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Applies syntax highlighting by wrapping matched tokens in <span> tags.
 * Processes one rule at a time; uses placeholder tokens to prevent double-matching.
 */
function highlightCode(code, lang) {
    const rules = HIGHLIGHT_RULES[lang] || HIGHLIGHT_RULES.javascript;
    let escaped = escapeHtml(code);
    const placeholders = [];

    // Temporary store matching tokens to avoid nested replacements
    for (const rule of rules) {
        escaped = escaped.replace(rule.pattern, (match) => {
            const idx = placeholders.length;
            placeholders.push(`<span class="${rule.className}">${match}</span>`);
            return `__SNK_TOK_${idx}__`;
        });
    }

    // Restore all tokens accurately
    return escaped.replace(/__SNK_TOK_(\d+)__/g, (_, idx) => placeholders[idx]);
}

/**
 * Generates line numbers HTML for the visible lines.
 */
function lineNumbers(count) {
    return Array.from({ length: count }, (_, i) => i + 1).join('\n');
}


const AutoTypingSneakPeek = () => {
    const [lang, setLang] = useState('javascript');
    const [charIndex, setCharIndex] = useState(0);
    const [hasTyped, setHasTyped] = useState({ javascript: false, python: false, cpp: false, java: false });
    const rafRef = useRef(null);
    const lastTimeRef = useRef(0);

    const fullCode = SNIPPETS[lang];

    // Determine what to display
    const isComplete = hasTyped[lang];
    const displayedCode = isComplete ? fullCode : fullCode.slice(0, charIndex);

    // ─── Typing Animation using requestAnimationFrame ───
    // Batches ~3 characters per frame at 60fps for smooth visual without excessive re-renders.
    useEffect(() => {
        if (isComplete) return;

        let localIdx = 0;
        setCharIndex(0);
        lastTimeRef.current = 0;

        const CHARS_PER_TICK = 3;
        const TICK_INTERVAL = 20; // ms between ticks

        const tick = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const elapsed = timestamp - lastTimeRef.current;

            if (elapsed >= TICK_INTERVAL) {
                localIdx = Math.min(localIdx + CHARS_PER_TICK, fullCode.length);
                setCharIndex(localIdx);
                lastTimeRef.current = timestamp;

                if (localIdx >= fullCode.length) {
                    setHasTyped(prev => ({ ...prev, [lang]: true }));
                    return; // stop
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [lang, isComplete, fullCode]);

    // ─── Memoized highlighted HTML ───
    const highlightedHtml = useMemo(() => highlightCode(displayedCode, lang), [displayedCode, lang]);
    const lineCount = displayedCode.split('\n').length;

    const handleLangChange = useCallback((newLang) => {
        setLang(newLang);
        setCharIndex(0);
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in duration-1000">
            {/* Language Selector Tabs */}
            <div className="flex gap-2 p-1 bg-surface-sunken/50 rounded-xl w-fit">
                {Object.keys(SNIPPETS).map((l) => (
                    <button
                        key={l}
                        onClick={() => handleLangChange(l)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer ${
                            lang === l 
                                ? 'bg-surface shadow-ring text-accent-primary' 
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        {l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                ))}
            </div>

            {/* Code Display — Lightweight <pre><code> */}
            <div className="h-[400px] w-full bg-ivory rounded-2xl shadow-ring overflow-hidden relative border border-accent-primary/5">
                <div className="absolute top-0 right-0 p-4 z-10 opacity-20 pointer-events-none">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-primary">Sneak Peek</span>
                </div>
                
                <div className="h-full overflow-auto p-5 flex">
                    {/* Line Numbers */}
                    <pre className="snk-line-numbers select-none pr-5 text-right"
                         aria-hidden="true"
                    >
                        {lineNumbers(lineCount)}
                    </pre>

                    {/* Code Content */}
                    <pre className="snk-code flex-1">
                        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                        {!isComplete && <span className="snk-cursor" />}
                    </pre>
                </div>
            </div>
            
            <div className="flex items-center gap-2 px-2">
                <div className="w-2 h-2 rounded-full bg-accent-primary/30 animate-pulse" />
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-text-muted/60">
                    AxeCode Intel Engine • Recursive Merge Sort
                </span>
            </div>

            {/* Scoped Styles */}
            <style>{`
                .snk-line-numbers,
                .snk-code {
                    font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
                    font-size: 13px;
                    line-height: 22px;
                    margin: 0;
                    white-space: pre;
                }
                .snk-line-numbers {
                    color: var(--ring-warm, #d1cfc5);
                    border-right: 1px solid var(--border-subtle, #f0eee6);
                    min-width: 32px;
                }
                .snk-code {
                    color: var(--text-primary, #141413);
                }
                .snk-comment { color: #a0a09a; font-style: italic; }
                .snk-keyword { color: #c96442; font-weight: 600; }
                .snk-string  { color: #5e5d59; }
                .snk-number  { color: #d97757; }
                .snk-function { color: #1c1c1a; font-weight: 600; }

                .snk-cursor {
                    display: inline-block;
                    width: 2px;
                    height: 18px;
                    background: #c96442;
                    vertical-align: text-bottom;
                    margin-left: 1px;
                    animation: snk-blink 1s step-end infinite;
                }
                @keyframes snk-blink {
                    50% { opacity: 0; }
                }

                /* Dark mode overrides */
                .dark .snk-line-numbers { color: #4d4c48; border-color: rgba(255,255,255,0.05); }
                .dark .snk-code { color: #faf9f5; }
                .dark .snk-comment { color: #706f6a; }
                .dark .snk-keyword { color: #d97757; }
                .dark .snk-string  { color: #b0aea5; }
                .dark .snk-number  { color: #f0a07a; }
                .dark .snk-function { color: #faf9f5; }
                .dark .snk-cursor  { background: #d97757; }
            `}</style>
        </div>
    );
};

export default AutoTypingSneakPeek;
