import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Loader2, Code2, Settings2, Info } from 'lucide-react';
import { cn } from '@core/utils/cn';
import RichTextInput from '@presentation/shared/components/RichTextEditor/RichTextInput';

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
 * Includes a "Strict Signature Editor" to ensure backend auto-generation works correctly.
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto p-6 lg:p-10 bg-surface rounded-2xl border border-white/5 shadow-2xl text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center text-accent-primary">
                        <Code2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{initialData.documentId ? 'Edit Problem' : 'Configure New Problem'}</h2>
                        <p className="text-sm text-text-muted">Set up the technical signature and metadata.</p>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-secondary text-primary font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50"
                >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    {initialData.documentId ? 'Save Configuration' : 'Create Problem'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Technical Signature */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    {/* Section Label */}
                    <div className="flex items-center gap-2 text-accent-primary">
                        <Settings2 size={18} />
                        <span className="font-bold uppercase tracking-wider text-xs">Technical Signature</span>
                    </div>

                    <div className="bg-background/50 rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Function Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-muted uppercase">Function Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={functionName}
                                    onChange={(e) => setFunctionName(e.target.value.replace(/\s/g, ''))}
                                    className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-all font-mono"
                                    placeholder="e.g. solve, findSum"
                                />
                            </div>

                            {/* Return Type */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-muted uppercase">Return Type *</label>
                                <select
                                    value={returnType}
                                    onChange={(e) => setReturnType(e.target.value)}
                                    className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none cursor-pointer"
                                >
                                    {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Parameters Editor */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-text-muted uppercase">Function Parameters</label>
                                <button 
                                    type="button" 
                                    onClick={addParam}
                                    className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:text-white transition-colors"
                                >
                                    <Plus size={14} /> Add Parameter
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                {params.length === 0 && (
                                    <div className="text-sm text-text-muted italic bg-white/5 rounded-xl p-4 border border-dashed border-white/10 text-center">
                                        No parameters defined. The function will take no arguments.
                                    </div>
                                )}
                                {params.map((param, index) => (
                                    <div key={index} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                        <input
                                            required
                                            type="text"
                                            value={param.name}
                                            onChange={(e) => updateParam(index, 'name', e.target.value.replace(/\s/g, ''))}
                                            placeholder="Param Name"
                                            className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-accent-primary outline-none font-mono text-sm"
                                        />
                                        <select
                                            value={param.type}
                                            onChange={(e) => updateParam(index, 'type', e.target.value)}
                                            className="w-40 bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-accent-primary outline-none text-sm"
                                        >
                                            {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <button 
                                            type="button" 
                                            onClick={() => removeParam(index)}
                                            className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Problem Description</label>
                        <div className="border border-white/10 rounded-2xl overflow-hidden min-h-[300px] bg-background/30">
                            <RichTextInput
                                value={description}
                                onChange={setDescription}
                                placeholder="Write the problem statement here..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase">Constraints</label>
                        <textarea
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            className="bg-background border border-white/10 rounded-2xl p-4 min-h-[120px] focus:border-accent-primary outline-none transition-all text-sm"
                            placeholder="e.g. 1 <= nums.length <= 10^4"
                        />
                    </div>
                </div>

                {/* Right Column: Meta & Limits */}
                <div className="flex flex-col gap-8">
                    
                    {/* Basic Info */}
                    <div className="flex flex-col gap-5 bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 text-accent-primary mb-2">
                            <Info size={16} />
                            <span className="font-bold uppercase tracking-wider text-xs">Metadata</span>
                        </div>

                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted">Problem Title *</label>
                            <input
                                required
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-all"
                                placeholder="Two Sum"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none cursor-pointer capitalize"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Performance Section */}
                    <div className="flex flex-col gap-5 bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 text-accent-primary mb-2">
                            <Settings2 size={16} />
                            <span className="font-bold uppercase tracking-wider text-xs">Resource Limits</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted">Time Limit (ms)</label>
                            <input
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted">Memory Limit (KB)</label>
                            <input
                                type="number"
                                value={memoryLimit}
                                onChange={(e) => setMemoryLimit(e.target.value)}
                                className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:border-accent-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
};
