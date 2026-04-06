import React, { useState } from 'react';
import { Plus, Trash2, Loader2, Code2, Settings2, Info, ChevronDown, Save } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';

/**
 * Supported types for algorithmic problem signatures.
 */
const SUPPORTED_TYPES = [
    'int', 'string', 'bool', 'ListNode', 'TreeNode', 
    'array<int>', 'array<string>', 'array<ListNode>',
    'matrix<int>', 'matrix<string>'
];

/**
 * ProblemForm: Specialized form for algorithm problems.
 * Optimized for both Light and Dark modes with premium UX.
 */
export const ProblemForm = ({ 
    initialData = {}, 
    isLoading = false, 
    onSubmit 
}) => {
    // Basic Meta
    const [title, setTitle] = useState(initialData.title || '');
    const [difficulty, setDifficulty] = useState(initialData.difficulty || 'easy');
    const [description, setDescription] = useState(initialData.description || []);
    const [constraints, setConstraints] = useState(initialData.constraints || '');
    
    // Technical Signature
    const [functionName, setFunctionName] = useState(initialData.functionName || '');
    const [returnType, setReturnType] = useState(initialData.returnType || 'int');
    const [params, setParams] = useState(initialData.functionParams || []);

    // Performance Limits
    const [timeLimit, setTimeLimit] = useState(initialData.timeLimit || 2000);
    const [memoryLimit, setMemoryLimit] = useState(initialData.memoryLimit || 256000);

    const addParam = () => {
        setParams([...params, { name: '', type: 'int' }]);
    };

    const removeParam = (index) => {
        setParams(params.filter((_, i) => i !== index));
    };

    const updateParam = (index, field, value) => {
        const newParams = [...params];
        newParams[index][field] = value;
        setParams(newParams);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dtoData = {
            title,
            difficulty: difficulty.toLowerCase(),
            description,
            constraints,
            functionName,
            functionParams: params,
            returnType,
            timeLimit: parseInt(timeLimit),
            memoryLimit: parseInt(memoryLimit),
            public: initialData.public || false
        };

        onSubmit(dtoData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full mx-auto p-1 bg-transparent text-text-primary">
            
            {/* Header / Submission Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-surface p-8 rounded-[2.5rem] border border-border-subtle shadow-xl sticky top-2 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shadow-inner">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic tracking-tight">{initialData.documentId ? 'Problem Architect' : 'New Protocol Configuration'}</h2>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40">Define technical signatures and constraints.</p>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading || !title || !functionName} 
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-accent-primary text-on-accent font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl transition-all shadow-lg shadow-accent-primary/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {initialData.documentId ? 'Commit Changes' : 'Initialize Protocol'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Metadata & Constraints */}
                <div className="lg:col-span-12 space-y-10">
                    
                    {/* Identification Section */}
                    <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-10 shadow-xl space-y-10">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-primary" />
                                Core Identification
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-3 space-y-3">
                                    <input
                                        required
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-surface-sunken/40 border border-border-subtle rounded-3xl px-8 py-5 text-2xl font-black text-text-primary focus:border-accent-primary focus:bg-surface-sunken outline-none transition-all placeholder:text-text-muted/20 shadow-inner"
                                        placeholder="Name this algorithmic challenge..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className={cn(
                                            "w-full appearance-none bg-surface-sunken/40 border border-border-subtle rounded-3xl px-8 py-5 text-sm font-black uppercase tracking-widest focus:border-accent-primary outline-none cursor-pointer text-center",
                                            difficulty === 'easy' ? 'text-green-500' : difficulty === 'medium' ? 'text-amber-500' : 'text-red-500'
                                        )}
                                    >
                                        <option value="easy">Easy Node</option>
                                        <option value="medium">Medium Node</option>
                                        <option value="hard">Hard Node</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                                Problem Curriculum (Architect)
                            </label>
                            <div className="border border-border-subtle rounded-[2.5rem] overflow-hidden bg-surface-sunken/40 focus-within:bg-surface-sunken transition-all shadow-inner relative">
                                <RichTextInput
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Describe the objective and complexity..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Signature Section */}
                    <div className="bg-surface border border-border-subtle rounded-[2.5rem] p-10 shadow-xl space-y-10">
                        <label className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                            <Code2 size={20} />
                            Technical Protocol Signature
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Function Header Configuration */}
                            <div className="space-y-8 p-8 bg-surface-sunken/40 border border-border-subtle rounded-[2rem] shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <Code2 size={80} />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Function Identifier *</label>
                                    <input
                                        required
                                        type="text"
                                        value={functionName}
                                        onChange={(e) => setFunctionName(e.target.value.replace(/\s/g, ''))}
                                        className="w-full bg-surface border border-border-subtle rounded-2xl px-6 py-4 font-mono text-sm font-bold text-text-primary focus:border-accent-primary outline-none transition-all shadow-sm"
                                        placeholder="e.g. solve, findNode"
                                    />
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Result Type Protocol</label>
                                    <div className="relative">
                                        <select
                                            value={returnType}
                                            onChange={(e) => setReturnType(e.target.value)}
                                            className="w-full appearance-none bg-surface border border-border-subtle rounded-2xl px-6 py-4 font-mono text-sm font-bold text-text-primary focus:border-accent-primary outline-none cursor-pointer shadow-sm pr-12"
                                        >
                                            {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Parameters Configuration */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Input Parameters</label>
                                    <button 
                                        type="button" 
                                        onClick={addParam}
                                        className="flex items-center gap-2 text-[10px] font-black text-accent-primary hover:text-text-primary uppercase tracking-widest bg-accent-primary/10 px-4 py-2 rounded-xl transition-all hover:bg-accent-primary/20"
                                    >
                                        <Plus size={14} /> Add Vector
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                    {params.map((param, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-surface-sunken/60 border border-border-subtle rounded-2xl animation-slide-in shadow-sm">
                                            <div className="col-span-6">
                                                <input
                                                    placeholder="Param name"
                                                    value={param.name}
                                                    onChange={(e) => updateParam(index, 'name', e.target.value.replace(/\s/g, ''))}
                                                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2.5 font-mono text-xs focus:border-accent-primary outline-none"
                                                />
                                            </div>
                                            <div className="col-span-4 relative">
                                                <select
                                                    value={param.type}
                                                    onChange={(e) => updateParam(index, 'type', e.target.value)}
                                                    className="w-full appearance-none bg-surface border border-border-subtle rounded-xl px-4 py-2.5 font-mono text-[10px] focus:border-accent-primary outline-none cursor-pointer pr-8"
                                                >
                                                    {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeParam(index)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {params.length === 0 && (
                                        <div className="py-12 border-2 border-dashed border-border-subtle rounded-3xl flex flex-col items-center justify-center text-text-muted opacity-40">
                                            <Code2 size={40} className="mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">No input vectors defined</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Constraints & Performance Tuning */}
                        <div className="pt-10 border-t border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2 flex items-center gap-2">
                                    <Info size={14} />
                                    Algorithmic Constraints
                                </label>
                                <textarea
                                    value={constraints}
                                    onChange={(e) => setConstraints(e.target.value)}
                                    className="w-full bg-surface-sunken/40 border border-border-subtle rounded-3xl p-6 text-sm font-medium text-text-primary focus:border-accent-primary outline-none transition-all shadow-inner h-32"
                                    placeholder="Define performance limits, e.g. 1 <= nums.length <= 10^5..."
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Resource Allocation</label>
                                <div className="space-y-4">
                                    <div className="p-5 bg-surface-sunken/40 border border-border-subtle rounded-2xl shadow-inner space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60 px-1">
                                            <span>Time Latency (ms)</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={timeLimit}
                                            onChange={(e) => setTimeLimit(e.target.value)}
                                            className="w-full bg-transparent border-none text-xl font-black text-text-primary outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div className="p-5 bg-surface-sunken/40 border border-border-subtle rounded-2xl shadow-inner space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60 px-1">
                                            <span>Memory Pool (KB)</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={memoryLimit}
                                            onChange={(e) => setMemoryLimit(e.target.value)}
                                            className="w-full bg-transparent border-none text-xl font-black text-text-primary outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
