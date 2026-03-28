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
            <div className="flex flex-col items-center justify-center p-20 text-text-muted">
                <Loader2 size={32} className="animate-spin mb-4 text-accent-primary" />
                <p className="text-sm">Loading validation data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white/5 rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center text-accent-primary">
                        <Database size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Validation Suite</h3>
                        <p className="text-xs text-text-muted">{testCases.length} Test cases configured</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-accent-primary hover:bg-accent-secondary text-primary font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                    <Plus size={18} />
                    <span>Create Test Case</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm">{error.message || "An unexpected error occurred."}</span>
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <form onSubmit={handleAdd} className="bg-surface p-8 rounded-2xl border border-accent-primary/20 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Input JSON *</label>
                            <textarea 
                                name="input" 
                                required 
                                rows={4}
                                className="bg-background border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-accent-primary outline-none transition-all h-full"
                                placeholder='{"nums": [2,7,11,15], "target": 9}'
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Expected Output JSON *</label>
                            <textarea 
                                name="expectedOutput" 
                                required 
                                rows={4}
                                className="bg-background border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-accent-primary outline-none transition-all h-full"
                                placeholder='[0, 1]'
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" name="isHidden" defaultChecked className="hidden" />
                                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center p-0.5 transition-colors group-hover:border-accent-primary">
                                    <div className="w-full h-full rounded-sm bg-accent-primary hidden" />
                                </div>
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Hidden Case</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-text-muted uppercase">Order</label>
                                <input name="order" type="number" defaultValue={testCases.length} className="w-16 bg-background border border-white/10 rounded-lg px-2 py-1 text-center" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-sm font-bold text-text-muted hover:text-white transition-colors">Cancel</button>
                            <button type="submit" disabled={adding} className="bg-accent-primary hover:bg-accent-secondary text-primary font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 transition-all">
                                {adding && <Loader2 size={16} className="animate-spin" />}
                                Save Case
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Test Case List */}
            <div className="flex flex-col gap-4 mb-40">
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
                    <div className="flex flex-col items-center justify-center p-20 bg-white/5 border border-dashed border-white/10 rounded-2xl text-text-muted">
                        <Database size={48} className="mb-4 opacity-10" />
                        <p className="text-sm font-medium">No test cases configured yet.</p>
                        <p className="text-xs">Add at least one test case to make the problem solvable.</p>
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
            "group bg-white/5 rounded-2xl border transition-all overflow-hidden",
            isExpanded ? "border-accent-primary/20 ring-1 ring-accent-primary/10" : "border-white/5 hover:border-white/10 shadow-lg"
        )}>
            {/* Header / Summary */}
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                        isHidden ? "bg-white/10 text-text-muted" : "bg-accent-primary/20 text-accent-primary"
                    )}>
                        #{index + 1}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">Input Sample:</span>
                            <span className="text-xs font-mono text-text-muted line-clamp-1 max-w-md">
                                {JSON.stringify(testCase.input)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/20 text-text-muted">
                        {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                        {isHidden ? 'Hidden' : 'Public'}
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted opacity-0 group-hover:opacity-100" />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 py-4 bg-background/50 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-bold text-text-muted">INPUT</label>
                             <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={6}
                                className="bg-background border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-accent-primary outline-none h-full"
                             />
                        </div>
                        <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-bold text-text-muted">EXPECTED OUTPUT</label>
                             <textarea 
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                rows={6}
                                className="bg-background border border-white/10 rounded-xl p-4 font-mono text-xs focus:border-accent-primary outline-none h-full"
                             />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <button 
                            type="button" 
                            onClick={onDelete}
                            disabled={isBusy}
                            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors py-2 px-1"
                        >
                            <Trash2 size={14} /> Remove Case
                        </button>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={isHidden} 
                                    onChange={(e) => setIsHidden(e.target.checked)}
                                    className="hidden" 
                                />
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center p-0.5 transition-all",
                                    isHidden ? "border-accent-primary bg-accent-primary/10" : "border-white/20"
                                )}>
                                    {isHidden && <div className="w-full h-full rounded-sm bg-accent-primary" />}
                                </div>
                                <span className="text-xs font-bold text-text-muted">Hidden</span>
                            </label>
                            <button 
                                onClick={handleSave}
                                disabled={isBusy}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors"
                            >
                                <Save size={14} /> Update Case
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
