import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextToolbar } from './RichTextToolbar';
import { RichTextMapper } from '../../../../domain/mapper/RichTextMapper';

/**
 * RichTextInput component integrated with TipTap and formatted for Strapi Blocks JSON.
 * Drop-in replacement for standard inputs in forms.
 */
export const RichTextInput = ({
    value = [], // Default to empty array for Strapi Blocks
    onChange,
    placeholder = 'Start writing...',
    error,
    label,
    className = ''
}) => {
    // Set initial content only once
    const [isInitialized, setIsInitialized] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[150px] p-4 text-text-primary bg-background [&_p]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-2 [&_blockquote]:bg-surface/20 [&_blockquote]:py-2 [&_pre]:bg-surface [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:mb-2 [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-sm [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded',
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                // Returns Strapi blocks format automatically
                const tiptapJson = editor.getJSON();
                const strapiBlocks = RichTextMapper.toStrapiBlocks(tiptapJson);
                onChange(strapiBlocks);
            }
        },
    });

    useEffect(() => {
        if (editor && !isInitialized && value && Array.isArray(value)) {
            if (value.length > 0) {
                const mappedContent = RichTextMapper.toTiptapJson(value);
                editor.commands.setContent(mappedContent);
            }
            setIsInitialized(true);
        }
    }, [editor, value, isInitialized]);

    if (!editor) {
        return null;
    }

    return (
        <div className={`w-full flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            
            <div className={`flex flex-col border rounded-lg overflow-hidden transition-colors ${
                error ? 'border-status-error' : 'border-border-subtle focus-within:border-accent-primary'
            }`}>
                <RichTextToolbar editor={editor} />
                <div 
                    className="cursor-text bg-background flex-1" 
                    onClick={() => editor.commands.focus()}
                >
                    <EditorContent editor={editor} />
                </div>
            </div>

            {error && (
                <p className="text-xs text-status-error">{error}</p>
            )}
        </div>
    );
};

export default RichTextInput;
