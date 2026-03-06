import React from 'react';

const renderInputData = (rawInput) => {
    if (!rawInput) return 'null';
    
    // Unwrap from Strapi's .data structure if present
    const inputData = rawInput.data || rawInput;
    
    // If it's a string, just return it
    if (typeof inputData === 'string') return inputData;
    
    // If it's an object, map to key = value format
    if (typeof inputData === 'object' && inputData !== null) {
        return Object.entries(inputData).map(([key, val]) => (
            <div key={key} className="flex gap-2">
                <span className="text-text-muted">{key} = </span>
                <span>{JSON.stringify(val)}</span>
            </div>
        ));
    }
    
    return String(inputData);
};

const renderOutputData = (rawOutput) => {
    if (rawOutput === null || rawOutput === undefined) return 'null';
    
    // Unwrap from Strapi's .data structure if present
    const outputData = rawOutput.data !== undefined ? rawOutput.data : rawOutput;
    
    if (typeof outputData === 'object' && outputData !== null) {
        return JSON.stringify(outputData);
    }
    
    return String(outputData);
};

/**
 * ProblemTestCases - Shows visible (non-hidden) test cases.
 * Tab under the editor panel.
 *
 * @param {{ testCases: Array, activeCase: number, onSelectCase: Function }} props
 */
export const ProblemTestCases = ({ testCases = [], activeCase = 0, onSelectCase }) => {
    // Only show non-hidden test cases
    const visibleCases = testCases
        .filter(tc => !tc.isHidden)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (visibleCases.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-text-muted p-6">
                No visible test cases available.
            </div>
        );
    }

    const selected = visibleCases[activeCase] || visibleCases[0];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Case Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-0 shrink-0 overflow-x-auto">
                {visibleCases.map((tc, i) => (
                    <button
                        key={tc.id || i}
                        onClick={() => onSelectCase?.(i)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-t-lg transition-all ${
                            i === activeCase
                                ? 'bg-surface-dark text-accent-primary border border-border-subtle border-b-0'
                                : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        Case {i + 1}
                    </button>
                ))}
            </div>

            {/* Case Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Input</label>
                    <div className="p-3 bg-[#1e1e2e] rounded-lg text-sm font-mono text-text-primary border border-border-subtle whitespace-pre-wrap flex flex-col gap-1">
                        {renderInputData(selected.input)}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Expected Output</label>
                    <div className="p-3 bg-[#1e1e2e] rounded-lg text-sm font-mono text-text-primary border border-border-subtle whitespace-pre-wrap flex flex-col gap-1">
                        {renderOutputData(selected.expectedOutput)}
                    </div>
                </div>
            </div>
        </div>
    );
};
