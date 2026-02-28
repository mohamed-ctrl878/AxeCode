import React from 'react';
import { cn } from '@core/utils/cn';

/**
 * Shared component to safely render Strapi Rich Text Blocks JSON array into semantic HTML with Tailwind.
 */
export const RichBlocksPreviewer = ({ content, className }) => {
    if (!content || !Array.isArray(content) || content.length === 0) {
        return null;
    }

    const renderTextModifiers = (textNode) => {
        let element = <>{textNode.text}</>;
        if (textNode.bold) element = <strong>{element}</strong>;
        if (textNode.italic) element = <em>{element}</em>;
        if (textNode.underline) element = <u>{element}</u>;
        if (textNode.strikethrough) element = <s>{element}</s>;
        if (textNode.code) element = <code className="bg-surface/50 px-1.5 py-0.5 rounded font-mono text-[0.85em] text-accent-primary">{element}</code>;
        return element;
    };

    const renderNode = (node, index) => {
        if (!node) return null;

        // Render children explicitly
        const renderChildren = () => 
            node.children && Array.isArray(node.children) 
                ? node.children.map((child, i) => renderNode(child, i)) 
                : null;

        switch (node.type) {
            case 'text':
                return <React.Fragment key={index}>{renderTextModifiers(node)}</React.Fragment>;
            
            case 'paragraph':
                return (
                    <p key={index} className="mb-4 text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {renderChildren()}
                    </p>
                );
            
            case 'heading':
                const level = node.level || 2;
                const HeadingTag = `h${level}`;
                
                // Explicit mapped styling per level
                const headingClasses = {
                    1: "text-3xl font-bold mb-6 mt-8 text-text-primary tracking-tight",
                    2: "text-2xl font-bold mb-4 mt-6 text-text-primary tracking-tight",
                    3: "text-xl font-bold mb-3 mt-5 text-text-primary",
                    4: "text-lg font-bold mb-2 mt-4 text-text-primary",
                    5: "text-base font-bold mb-2 mt-3 text-text-primary",
                    6: "text-sm font-bold mb-1 mt-2 text-text-primary",
                };
                
                return (
                    <HeadingTag key={index} className={headingClasses[level] || headingClasses[2]}>
                        {renderChildren()}
                    </HeadingTag>
                );
            
            case 'list':
                const isOrdered = node.format === 'ordered';
                const ListTag = isOrdered ? 'ol' : 'ul';
                const listClasses = isOrdered
                    ? "list-decimal pl-5 mb-4 space-y-2 text-text-secondary" 
                    : "list-disc pl-5 mb-4 space-y-2 text-text-secondary";
                    
                return (
                    <ListTag key={index} className={listClasses}>
                        {renderChildren()}
                    </ListTag>
                );
            
            case 'list-item':
                return <li key={index} className="pl-1">{renderChildren()}</li>;
            
            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 border-accent-primary pl-4 py-3 mb-4 bg-surface/20 italic text-text-secondary rounded-r-lg shadow-sm">
                        {renderChildren()}
                    </blockquote>
                );
            
            case 'code':
                // For a code block
                return (
                    <pre key={index} className="bg-[#1e1e1e] border border-border-subtle rounded-xl p-4 mb-4 overflow-x-auto shadow-sm">
                        <code className="font-mono text-sm text-[#d4d4d4] whitespace-pre">
                            {renderChildren()}
                        </code>
                    </pre>
                );

            case 'link':
                return (
                    <a 
                        key={index} 
                        href={node.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent-primary hover:text-accent-hover underline underline-offset-4 transition-colors"
                    >
                        {renderChildren()}
                    </a>
                );
            
            default:
                // Fallback rendering
                return <React.Fragment key={index}>{renderChildren()}</React.Fragment>;
        }
    };

    return (
        <div className={cn("rich-blocks-preview w-full flex flex-col break-words", className)}>
            {content.map((block, i) => renderNode(block, i))}
        </div>
    );
};

export default RichBlocksPreviewer;
