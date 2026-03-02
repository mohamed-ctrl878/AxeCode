import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useCreateArticle } from '@domain/useCase/useCreateArticle';

// Composed Editor Components (Clean Architecture)
import { ArticlePublishHeader } from '../components/write/ArticlePublishHeader';
import { ArticleMetaEditor } from '../components/write/ArticleMetaEditor';
import { ArticleBlockEditor } from '../components/write/ArticleBlockEditor';

/**
 * Write Article Page - State Manager & Page Compositor
 * SRP: Orchestrates local editor state and Domain UseCase. Composes UI components.
 * Zero direct DOM manipulation or complex UI rendering.
 */
export const WriteArticlePage = () => {
    const navigate = useNavigate();

    // --- Domain UseCases ---
    const { createArticle: submitArticle, inProgress: submitting, error } = useCreateArticle();

    // --- Local Editor State ---
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [blocks, setBlocks] = useState([
        { id: 'initial-text', type: 'text', data: [] }
    ]);

    // --- State Handlers: Tags ---
    const handleAddTag = (newTag) => {
        if (!tags.includes(newTag)) setTags([...tags, newTag]);
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // --- State Handlers: Blocks ---
    const handleAddBlock = (type) => {
        setBlocks([...blocks, {
            id: `block-${Date.now()}`,
            type,
            data: type === 'text' ? [] : { nodes: [], edges: [] }
        }]);
    };

    const handleUpdateBlock = (id, newData) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, data: newData } : b));
    };

    const handleRemoveBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    // --- Submission Handler ---
    const handlePublish = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        try {
            await submitArticle({ title, content: blocks, tagIds: tags });
            alert('Article Published Successfully!');
            navigate(PATHS.ARTICLES);
        } catch (err) {
            console.error("Failed to publish", err);
        }
    };

    // --- Page Composition ---
    return (
        <div className="md:col-span-12 max-w-5xl mx-auto w-full flex flex-col gap-6 animate-fade-in pb-32">
            
            <ArticlePublishHeader
                onCancel={() => navigate(PATHS.ARTICLES)}
                onPublish={handlePublish}
                isSubmitting={submitting}
                isPublishDisabled={!title.trim()}
            />

            {error && (
                <div className="p-4 bg-status-error/10 border border-status-error/20 text-status-error rounded-xl text-sm">
                    {error.message || "Failed to publish article. Please try again."}
                </div>
            )}

            <ArticleMetaEditor
                title={title}
                onTitleChange={setTitle}
                tags={tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
            />

            <ArticleBlockEditor
                blocks={blocks}
                onAddBlock={handleAddBlock}
                onUpdateBlock={handleUpdateBlock}
                onRemoveBlock={handleRemoveBlock}
            />

        </div>
    );
};

export default WriteArticlePage;
