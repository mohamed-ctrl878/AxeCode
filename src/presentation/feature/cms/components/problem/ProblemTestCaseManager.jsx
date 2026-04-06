import React, { useEffect, useState } from 'react';
import { useManageTestCases } from '@domain/useCase/useManageTestCases';
import { Plus, Trash2, Eye, EyeOff, Save, Loader2, Database, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * ProblemTestCaseManager: Interactive UI for managing algorithmic problem validation data.
 */
export const ProblemTestCaseManager = ({ problemId }) => {
    const { 
        testCases, fetchTestCases, addTestCase, updateTestCase, deleteTestCase,
        loading, adding, updating, deleting, error 
    } = useManageTestCases();

    const [isAdding, setIsAdding] = useState(false);
    const [expandedCase, setExpandedCase] = useState(null);

    useEffect(() => {
        if (problemId) {
            fetchTestCases(problemId);
        }
    }, [problemId, fetchTestCases]);

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const data = {
                input: JSON.parse(formData.get('input')),
                expectedOutput: JSON.parse(formData.get('expectedOutput')),
                isHidden: formData.get('isHidden') === 'on',
                order: parseInt(formData.get('order')) || 0
            };
            
            await addTestCase({ problemId, data });
            setIsAdding(false);
            e.target.reset();
        } catch (err) {
            alert("Invalid JSON format for input/output");
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await updateTestCase({ id, data: updatedData, problemId });
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 size={32} className="animate-spin mb-4 text-accent-primary" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-60">Synchronizing Validation Data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-24">
            
            {/* Toolbar - Redesigned for Theme Awareness */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-surface border border-border-subtle rounded-[2rem] p-6 gap-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue shadow-inner">
                        <Database size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-text-primary tracking-tight">Validation Suite</h3>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">{testCases.length} Test cases orchestrated</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn(
                        "flex items-center gap-2 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 group",
                        isAdding 
                            ? "bg-surface-sunken text-text-primary border border-border-default" 
                            : "bg-accent-primary text-on-accent shadow-accent-primary/20 hover:brightness-110"
                    )}
                >
                    {isAdding ? <ChevronUp size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                    <span>{isAdding ? 'Close Editor' : 'Initiate Test Case'}</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-500 animation-slide-up shadow-lg">
                    <AlertCircle size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Protocol Sync Failure</p>
                        <p className="text-sm font-bold mt-0.5">{error.message || "An unexpected error occurred during state mutation."}</p>
                    </div>
                </div>
            )}

            {/* Add Form - Redesigned with higher contrast */}
            {isAdding && (
                <form onSubmit={handleAdd} className="bg-surface-elevated p-8 rounded-[2.5rem] border border-border-default shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-accent-primary">
                        <Plus size={120} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2">Input Vector (JSON)</label>
                            <textarea 
                                name="input" 
                                required 
                                rows={6}
                                className="bg-background border border-border-subtle rounded-2xl p-5 font-mono text-xs text-text-primary focus:border-accent-primary outline-none transition-all shadow-inner placeholder:text-text-muted/20"
                                placeholder='{"nums": [2,7,11,15], "target": 9}'
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2">Expectation (JSON)</label>
                            <textarea 
                                name="expectedOutput" 
                                required 
                                rows={6}
                                className="bg-background border border-border-subtle rounded-2xl p-5 font-mono text-xs text-text-primary focus:border-accent-primary outline-none transition-all shadow-inner placeholder:text-text-muted/20"
                                placeholder='[0, 1]'
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-border-subtle gap-6 relative z-10">
                        <div className="flex items-center gap-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" name="isHidden" defaultChecked className="peer hidden" />
                                <div className="w-6 h-6 rounded-lg border-2 border-border-default flex items-center justify-center transition-all peer-checked:bg-accent-primary peer-checked:border-accent-primary group-hover:border-accent-primary shadow-sm">
                                    <div className="w-1.5 h-3 border-r-2 border-b-2 border-on-accent rotate-45 mb-1 hidden peer-checked:block" />
                                </div>
                                <span className="text-xs font-black text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Hidden Protocol</span>
                            </label>
                            <div className="flex items-center gap-4 bg-surface-sunken px-4 py-2 rounded-xl border border-border-subtle shadow-inner">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Priority Index</label>
                                <input name="order" type="number" defaultValue={testCases.length} className="w-12 bg-transparent text-text-primary font-bold text-center outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 md:flex-none px-8 py-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">Cancel</button>
                            <button type="submit" disabled={adding} className="flex-1 md:flex-none bg-accent-primary text-on-accent font-black text-xs uppercase tracking-widest px-10 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-accent-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50">
                                {adding ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Commit Case
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Test Case List */}
            <div className="flex flex-col gap-5">
                {testCases.map((tc, idx) => (
                    <TestCaseCard 
                        key={tc.documentId || tc.id} 
                        testCase={tc} 
                        onUpdate={(data) => handleUpdate(tc.documentId, data)}
                        onDelete={() => deleteTestCase({ id: tc.documentId, problemId })}
                        isBusy={updating || deleting}
                        index={idx}
                    />
                ))}
                {testCases.length === 0 && !isAdding && (
                    <div className="flex flex-col items-center justify-center py-24 px-10 bg-surface-sunken/20 border border-dashed border-border-default rounded-[3rem] text-text-muted transition-all">
                        <div className="w-20 h-20 rounded-full bg-surface-sunken flex items-center justify-center text-text-muted/10 mb-6">
                            <Database size={48} />
                        </div>
                        <p className="text-sm font-black text-text-primary uppercase tracking-widest italic">No cases detected</p>
                        <p className="text-[10px] font-bold mt-2 opacity-50 text-center max-w-[280px]">Add at least one validation sample to enable algorithmic verification.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Individual Test Case Card
 */
const TestCaseCard = ({ testCase, onUpdate, onDelete, isBusy, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState(JSON.stringify(testCase.input, null, 2));
    const [output, setOutput] = useState(JSON.stringify(testCase.expectedOutput, null, 2));
    const [isHidden, setIsHidden] = useState(testCase.isHidden);

    const handleSave = () => {
        try {
            onUpdate({
                input: JSON.parse(input),
                expectedOutput: JSON.parse(output),
                isHidden
            });
            setIsExpanded(false);
        } catch (err) {
            alert("Invalid JSON format");
        }
    };

    return (
        <div className={cn(
            "group bg-surface rounded-[2rem] border transition-all overflow-hidden",
            isExpanded 
                ? "border-accent-primary shadow-2xl scale-[1.01]" 
                : "border-border-subtle hover:border-border-default hover:bg-surface-elevated/50 shadow-sm"
        )}>
            {/* Header / Summary */}
            <div className="flex items-center justify-between p-6 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm transition-all",
                        isHidden 
                            ? "bg-surface-sunken text-text-muted border border-border-subtle" 
                            : "bg-accent-primary text-on-accent shadow-accent-primary/20"
                    )}>
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Sample Trace:</span>
                            <span className="text-xs font-black text-text-primary font-mono line-clamp-1 max-w-[200px] md:max-w-md bg-surface-sunken/40 px-3 py-1 rounded-lg">
                                {JSON.stringify(testCase.input)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm transition-colors",
                        isHidden 
                            ? "bg-surface-sunken text-text-muted border-border-subtle" 
                            : "bg-accent-blue/10 text-accent-blue border-accent-blue/10"
                    )}>
                        {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{isHidden ? 'Hidden' : 'Public'}</span>
                    </div>
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        isExpanded ? "bg-accent-primary/10 text-accent-primary rotate-180" : "text-text-muted/40 group-hover:text-text-muted"
                    )}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-8 py-8 bg-surface-sunken border-t border-border-subtle animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="flex flex-col gap-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Input Sample</label>
                             <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={8}
                                className="bg-surface border border-border-subtle rounded-2xl p-5 font-mono text-xs text-text-primary focus:border-accent-primary outline-none shadow-inner"
                             />
                        </div>
                        <div className="flex flex-col gap-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Expectation Sample</label>
                             <textarea 
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                rows={8}
                                className="bg-surface border border-border-subtle rounded-2xl p-5 font-mono text-xs text-text-primary focus:border-accent-primary outline-none shadow-inner"
                             />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                        <button 
                            type="button" 
                            onClick={onDelete}
                            disabled={isBusy}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:brightness-110 hover:bg-red-500/5 px-4 py-2 rounded-xl transition-all"
                        >
                            <Trash2 size={14} /> Remove Protocol
                        </button>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={isHidden} 
                                    onChange={(e) => setIsHidden(e.target.checked)}
                                    className="peer hidden" 
                                />
                                <div className={cn(
                                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shadow-sm",
                                    isHidden 
                                        ? "border-accent-primary bg-accent-primary" 
                                        : "border-border-default bg-surface"
                                )}>
                                    {isHidden && <div className="w-1.5 h-3 border-r-2 border-b-2 border-on-accent rotate-45 mb-1" />}
                                </div>
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-text-primary">Hidden</span>
                            </label>
                            <button 
                                onClick={handleSave}
                                disabled={isBusy}
                                className="flex items-center gap-3 bg-accent-primary text-on-accent font-black text-xs uppercase tracking-widest px-8 py-3 rounded-2xl transition-all shadow-lg shadow-accent-primary/10 hover:brightness-110 active:scale-95 disabled:opacity-50"
                            >
                                {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Update Protocol
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
