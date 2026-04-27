import React, { useState } from 'react';
import { Plus, Trash2, Loader2, Code2, Settings2, Info, ChevronDown, Save, Lightbulb, Activity, Layers, Image as ImageIcon, Edit2, Upload } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { CategorizationSelector } from '../CategorizationSelector';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';

/**
 * Supported types for algorithmic problem signatures.
 */
const SUPPORTED_TYPES = [
    'int', 'string', 'bool', 'ListNode', 'TreeNode', 
    'array<int>', 'array<string>', 'array<ListNode>',
    'matrix<int>', 'matrix<matrix<int>>',
    'matrix<string>'
];

/**
 * ProblemForm: Specialized form for algorithm problems.
 * Optimized for system-wide design parity with CourseForm.
 */
export const ProblemForm = ({ 
    initialData = {}, 
    isLoading = false, 
    onSubmit 
}) => {
    const { problemTypes, isLoading: isLoadingTypes } = useFetchAdminCategorizations();

    // Basic Meta
    const [title, setTitle] = useState(initialData.title || '');
    const [difficulty, setDifficulty] = useState(initialData.difficulty || 'easy');
    const [description, setDescription] = useState(initialData.description || []);
    const [constraints, setConstraints] = useState(initialData.constraints || '');
    const [isDraft, setIsDraft] = useState(initialData.isDraft ?? true);
    const [problemTypeIds, setProblemTypeIds] = useState(initialData.problem_types?.map(t => t.documentId || t.id) || []);
    
    // Technical Signature
    const [functionName, setFunctionName] = useState(initialData.functionName || '');
    const [returnType, setReturnType] = useState(initialData.returnType || 'int');
    const [params, setParams] = useState(initialData.functionParams || []);

    // Performance Limits
    const [timeLimit, setTimeLimit] = useState(initialData.timeLimit || 2000);
    const [memoryLimit, setMemoryLimit] = useState(initialData.memoryLimit || 256000);

    // Media & Visuals
    const [pictureFile, setPictureFile] = useState(null);
    const [picturePreview, setPicturePreview] = useState(initialData.picture?.url || null);

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPictureFile(file);
            setPicturePreview(URL.createObjectURL(file));
        }
    };

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
            public: initialData.public || false,
            isDraft,
            problemTypeIds,
            picture: initialData.picture?.id || null
        };

        onSubmit(dtoData, pictureFile);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Column (Main Architecture) */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    
                    {/* Header Summary */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-primary px-1">Infrastructure Schema</label>
                        <h2 className="text-3xl font-black font-serif italic tracking-tighter text-text-primary">
                            {initialData.documentId ? 'Problem Architect' : 'Manifest Protocol'}
                        </h2>
                    </div>

                    {/* Identification & Difficulty Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-surface border border-border-subtle shadow-whisper">
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Problem Title</label>
                            <input
                                required
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field text-lg font-serif"
                                placeholder="e.g. Reverse Linked List Architect..."
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Complexity</label>
                            <div className="relative">
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="input-field appearance-none cursor-pointer pr-10 text-xs font-bold uppercase tracking-widest"
                                >
                                    <option value="easy">Novice (Easy)</option>
                                    <option value="medium">Scholar (Medium)</option>
                                    <option value="hard">Philosopher (Hard)</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <CategorizationSelector 
                                label="Classification"
                                availableItems={problemTypes}
                                selectedIds={problemTypeIds}
                                onChange={setProblemTypeIds}
                                isLoading={isLoadingTypes}
                                placeholder="Link Problem Types..."
                             />
                        </div>
                    </div>

                    {/* Narrative (Rich Text) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Curriculum Narrative</label>
                        <div className="border border-border-default rounded-2xl overflow-hidden shadow-sm bg-surface">
                            <RichTextInput
                                value={description}
                                onChange={setDescription}
                                placeholder="Define the problem landscape and objectives..."
                                hideBorder
                            />
                        </div>
                    </div>

                    {/* Technical Implementation Section */}
                    <div className="flex flex-col gap-6 p-8 rounded-2xl bg-surface border border-border-subtle shadow-whisper relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-accent-primary">
                            <Code2 size={120} />
                        </div>

                        <div className="flex items-center gap-3 border-b border-border-subtle/50 pb-6">
                            <Code2 size={20} className="text-accent-primary" />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary">Technical signature Protocol</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            {/* Function Header */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Function Identifier *</label>
                                    <input
                                        required
                                        type="text"
                                        value={functionName}
                                        onChange={(e) => setFunctionName(e.target.value.replace(/\s/g, ''))}
                                        className="input-field font-mono text-sm"
                                        placeholder="solveProposal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Result Type</label>
                                    <div className="relative">
                                        <select
                                            value={returnType}
                                            onChange={(e) => setReturnType(e.target.value)}
                                            className="input-field appearance-none cursor-pointer pr-10 font-mono text-xs"
                                        >
                                            {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                                    </div>
                                </div>
                            </div>

                            {/* Parameters List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Input Vectors</label>
                                    <button 
                                        type="button" 
                                        onClick={addParam}
                                        className="text-[9px] font-black uppercase tracking-widest text-accent-primary hover:text-text-primary transition-colors flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent-primary/5"
                                    >
                                        <Plus size={12} /> Append Parameter
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                                    {params.map((param, index) => (
                                        <div key={index} className="flex gap-2 p-3 bg-surface-sunken/40 border border-border-subtle rounded-xl items-center animation-fade-in group/param">
                                            <input
                                                value={param.name}
                                                onChange={(e) => updateParam(index, 'name', e.target.value)}
                                                placeholder="name"
                                                className="flex-1 bg-transparent border-none text-xs font-mono font-bold focus:ring-0 outline-none p-0"
                                            />
                                            <div className="relative w-28">
                                                <select
                                                    value={param.type}
                                                    onChange={(e) => updateParam(index, 'type', e.target.value)}
                                                    className="w-full bg-transparent border-none text-[10px] font-mono appearance-none cursor-pointer pr-6 p-0 outline-none focus:ring-0"
                                                >
                                                    {SUPPORTED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                                <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 opacity-20" />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeParam(index)}
                                                className="opacity-0 group-hover/param:opacity-100 transition-opacity text-red-500/60 hover:text-red-500"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {params.length === 0 && (
                                        <div className="py-8 border border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center opacity-30">
                                            <p className="text-[10px] font-bold uppercase tracking-widest italic">Void Parameters</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Constraints Area */}
                        <div className="pt-6 mt-4 border-t border-border-subtle/50 space-y-3 relative z-10">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 flex items-center gap-2">
                                <Info size={12} /> Algorithmic boundaries
                            </label>
                            <textarea
                                value={constraints}
                                onChange={(e) => setConstraints(e.target.value)}
                                className="input-field min-h-[140px] text-xs font-medium leading-relaxed resize-none"
                                placeholder="e.g. 1 <= node.val <= 500"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column (Controls & Metaphysics) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Actions Panel */}
                    <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-whisper space-y-6">
                        <button 
                            type="submit" 
                            disabled={isLoading || !title || !functionName} 
                            className="btn-primary w-full py-4 text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={16} />
                                    {initialData.documentId ? 'Commit Logic' : 'Initiate Protocol'}
                                </>
                            )}
                        </button>
                        <p className="text-[9px] text-center text-text-muted leading-tight opacity-70 font-bold uppercase tracking-widest">
                            Changes propagate to validation nodes immediately.
                        </p>
                    </div>

                    {/* Transmission State */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted px-1">Presence</label>
                        <div 
                            onClick={() => setIsDraft(!isDraft)}
                            className={cn(
                                "group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-none active:scale-[0.98]",
                                isDraft 
                                    ? "bg-accent-primary/5 border-accent-primary/40 hover:bg-accent-primary/10 shadow-whisper" 
                                    : "bg-surface border-border-default hover:border-accent-emerald/40"
                            )}
                        >
                            <div className="flex flex-col gap-0.5" >
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider",
                                    isDraft ? "text-accent-primary" : "text-accent-emerald"
                                )}>
                                    {isDraft ? 'Manuscript (Draft)' : 'Archetype (Live)'}
                                </span>
                                <span className="text-[10px] text-text-muted italic opacity-60">
                                    {isDraft ? 'Private Workspace' : 'Global Collective'}
                                </span>
                            </div>
                            
                            <div className={cn(
                                "w-10 h-5 rounded-full p-1 transition-all duration-300 relative",
                                isDraft ? "bg-accent-primary/80" : "bg-accent-emerald/80"
                            )}>
                                <div className={cn(
                                    "w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                                    isDraft ? "translate-x-5" : "translate-x-0"
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* Guidance Tip */}
                    <div className="p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/20 flex gap-3 shadow-none">
                        <div className="p-2 h-fit rounded-lg bg-accent-amber/10 text-accent-amber shrink-0">
                            <Lightbulb size={18} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[11px] font-bold uppercase tracking-tight text-accent-amber/80">Publication Protocol</h4>
                            <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                Ensure these steps before making content public:<br/>
                                <span className="text-text-primary/70">1. (Preferably complete all content related to this item before publishing as live content).</span>
                            </p>
                        </div>
                    </div>

                    {/* Operational Limits */}
                    <div className="p-6 bg-surface border border-border-subtle rounded-2xl shadow-whisper space-y-6">
                        <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                            <Activity size={14} className="text-accent-primary" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Resource Quotas</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-1">latency Limit (ms)</label>
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(e.target.value)}
                                    className="input-field text-sm font-mono py-2.5"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-1">Heap Allocation (KB)</label>
                                <input
                                    type="number"
                                    value={memoryLimit}
                                    onChange={(e) => setMemoryLimit(e.target.value)}
                                    className="input-field text-sm font-mono py-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Visual Identity (Thumbnail) - Content Flow requirement */}
                    <div className="p-6 bg-surface border border-border-subtle rounded-2xl shadow-whisper space-y-6">
                        <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                            <ImageIcon size={14} className="text-accent-primary" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Visual Identity</h3>
                        </div>

                        <div className="space-y-4">
                            <div 
                                className={cn(
                                    "relative h-40 rounded-xl border border-dashed border-border-default overflow-hidden bg-surface-sunken/20 flex flex-col items-center justify-center transition-all group",
                                    picturePreview ? "border-solid" : "hover:border-accent-primary/50"
                                )}
                            >
                                {picturePreview ? (
                                    <>
                                        <img src={picturePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-near-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <label className="p-3 bg-ivory text-near-black rounded-xl cursor-pointer hover:scale-110 transition-transform">
                                                <Edit2 size={16} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                                            </label>
                                            <button 
                                                type="button" 
                                                onClick={() => { setPictureFile(null); setPicturePreview(null); }}
                                                className="p-3 bg-accent-rose text-ivory rounded-xl hover:scale-110 transition-transform"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                        <Upload size={24} className="text-text-muted mb-2 group-hover:text-accent-primary transition-colors" />
                                        <span className="text-[10px] font-bold uppercase text-text-muted group-hover:text-text-primary transition-colors">Inject Symbol</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                                    </label>
                                )}
                            </div>
                            <p className="text-[9px] text-text-muted italic opacity-50 px-1 text-center">Protocol recommendation: 1280x720 (16:9)</p>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
};
