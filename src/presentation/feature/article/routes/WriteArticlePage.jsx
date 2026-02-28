import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useCreateArticle } from '@domain/useCase/useCreateArticle';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';
import { Save, FileText, Share2, Plus, GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * Write Article Page
 * Allows creating rich technical articles consisting of multiple blocks (Text & Flowcharts).
 */
export const WriteArticlePage = () => {
    const navigate = useNavigate();
    
    // Form State
    const [title, setTitle] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    // Content Blocks State: Array of { id, type: 'text' | 'flow', data: any }
    const [blocks, setBlocks] = useState([
        { id: 'initial-text', type: 'text', data: [] }
    ]);

    // UseCase for submission (Domain Layer)
    const { createArticle: submitArticle, inProgress: submitting, error } = useCreateArticle();

    // Block Management
    const addBlock = (type) => {
        setBlocks([...blocks, { 
            id: `block-${Date.now()}`, 
            type, 
            data: type === 'text' ? [] : { nodes: [], edges: [] } 
        }]);
    };

    const updateBlock = (id, newData) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: newData } : b));
    };

    const removeBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleTagAdd = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        try {
            // Domain payload map: blocks mapping to schema 'content' 
            await submitArticle({ title, content: blocks, tagIds: tags });
            alert('Article Published Successfully!');
            navigate(PATHS.ARTICLES); // Redirect to articles feed
        } catch (err) {
            console.error("Failed to publish", err);
        }
    };

    return (
        <div className="md:col-span-12 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fade-in pb-32">
            
            {/* Header Actions */}
            <div className="flex justify-between items-center sticky top-24 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-sm">
                <div className="flex items-center gap-3">
                    <FileText className="text-accent-primary" size={24} />
                    <h1 className="text-xl font-bold">Write Article</h1>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate(PATHS.ARTICLES)}
                        className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={submitting || !title.trim()}
                        className="flex items-center gap-2 bg-accent-primary text-background px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                        ) : (
                            <Share2 size={16} />
                        )}
                        {submitting ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error rounded-xl text-sm">
                    {error.message || "Failed to publish article. Please try again."}
                </div>
            )}

            {/* Meta Data Section (Title & Tags) */}
            <div className="bento-card p-6 flex flex-col gap-6">
                <div>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article Title..."
                        className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-text-muted/30"
                    />
                </div>

                <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
                    <label className="text-xs font-mono tracking-widest uppercase text-text-muted">Tags</label>
                    <div className="flex flex-wrap gap-2 items-center">
                        {tags.map(tag => (
                            <span 
                                key={tag} 
                                className="px-3 py-1 bg-surface-dark border border-border-subtle rounded-full text-xs font-mono flex items-center gap-2"
                            >
                                #{tag}
                                <button onClick={() => removeTag(tag)} className="text-text-muted hover:text-status-error">×</button>
                            </span>
                        ))}
                        <input 
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagAdd}
                            placeholder="Add tag and press Enter"
                            className="bg-transparent text-sm focus:outline-none min-w-[150px]"
                        />
                    </div>
                </div>
            </div>

            {/* Content Blocks Editor */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Content Builder</h3>
                </div>

                {blocks.map((block, index) => (
                    <div key={block.id} className="relative group flex gap-3 w-full animate-slide-up">
                        {/* Block Drag Handle / Tools */}
                        <div className="flex flex-col items-center gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 shrink-0">
                            <span className="text-text-muted text-xs font-mono">{index + 1}</span>
                            <div className="cursor-grab hover:text-accent-primary text-text-muted">
                                <GripVertical size={16} />
                            </div>
                            <button 
                                onClick={() => removeBlock(block.id)}
                                className="text-text-muted hover:text-status-error transition-colors mt-auto mb-4"
                                title="Remove Block"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Block Content Canvas */}
                        <div className="flex-1 bento-card overflow-hidden border-2 border-transparent transition-colors focus-within:border-accent-primary/20">
                            {block.type === 'text' ? (
                                <div className="p-2">
                                    <RichTextInput 
                                        value={block.data}
                                        onChange={(val) => updateBlock(block.id, val)}
                                        placeholder="Start writing..."
                                        className="border-none shadow-none"
                                    />
                                </div>
                            ) : (
                                <div className="h-[600px] w-full bg-surface-dark">
                                    <div className="p-3 bg-surface border-b border-border-subtle flex items-center justify-between">
                                        <span className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                            <Share2 size={12} /> Flowchart Editor
                                        </span>
                                    </div>
                                    <FlowBuilder 
                                        initialNodes={block.data.nodes || []}
                                        initialEdges={block.data.edges || []}
                                        onSave={(flowData) => updateBlock(block.id, flowData)}
                                        className="h-full border-none rounded-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Block Toolbar */}
                <div className="w-full max-w-2xl mx-auto flex items-center justify-center gap-4 mt-8 py-6 border border-dashed border-border-subtle rounded-2xl bg-surface-light border-accent-primary/20 hover:border-accent-primary/50 transition-colors">
                    <button 
                        onClick={() => addBlock('text')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-subtle text-sm font-bold hover:bg-background hover:border-accent-primary transition-all shadow-sm"
                    >
                        <FileText size={16} className="text-accent-primary" /> Add Text Block
                    </button>
                    <button 
                        onClick={() => addBlock('flow')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-subtle text-sm font-bold hover:bg-background hover:text-purple-400 hover:border-purple-400 transition-all shadow-sm"
                    >
                        <Share2 size={16} className="text-purple-400" /> Add Diagram/Flow
                    </button>
                </div>
            </div>

        </div>
    );
};

export default WriteArticlePage;
