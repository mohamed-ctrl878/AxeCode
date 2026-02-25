import React from 'react';

/**
 * Renders inline children nodes (text, links, etc.) with their formatting marks.
 * Handles bold, italic, underline, strikethrough, and code inline styles.
 * @param {Array<object>} children - Strapi inline node array
 * @returns {JSX.Element[]}
 */
const InlineChildren = ({ children = [] }) => {
    return children.map((child, i) => {
        // Link node
        if (child.type === 'link') {
            return (
                <a
                    key={i}
                    href={child.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                    <InlineChildren children={child.children || []} />
                </a>
            );
        }

        // Text node with optional formatting marks
        let content = child.text ?? '';

        if (child.bold) content = <strong key={`b-${i}`}>{content}</strong>;
        if (child.italic) content = <em key={`i-${i}`}>{content}</em>;
        if (child.underline) content = <u key={`u-${i}`}>{content}</u>;
        if (child.strikethrough) content = <s key={`s-${i}`}>{content}</s>;
        if (child.code) {
            content = (
                <code key={`c-${i}`} className="px-1.5 py-0.5 rounded bg-surface text-accent-primary text-sm font-mono">
                    {content}
                </code>
            );
        }

        return <React.Fragment key={i}>{content}</React.Fragment>;
    });
};

// ─── Block Unit Renderers ────────────────────────────────────────────

/**
 * Paragraph block renderer.
 */
const ParagraphBlock = ({ children }) => (
    <p className="text-text-muted leading-relaxed">
        <InlineChildren children={children} />
    </p>
);

/**
 * Heading block renderer (h1–h6).
 */
const HeadingBlock = ({ level = 2, children }) => {
    const styles = {
        1: 'text-2xl font-bold text-text-primary',
        2: 'text-xl font-bold text-text-primary',
        3: 'text-lg font-bold text-text-primary',
        4: 'text-base font-bold text-text-primary',
        5: 'text-sm font-bold text-text-primary',
        6: 'text-xs font-bold text-text-primary uppercase tracking-wider',
    };
    const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
    return (
        <Tag className={styles[level] || styles[2]}>
            <InlineChildren children={children} />
        </Tag>
    );
};

/**
 * List block renderer (ordered / unordered).
 */
const ListBlock = ({ format, children = [] }) => {
    const Tag = format === 'ordered' ? 'ol' : 'ul';
    const listStyle = format === 'ordered'
        ? 'list-decimal pl-6 space-y-1'
        : 'list-disc pl-6 space-y-1';

    return (
        <Tag className={`${listStyle} text-text-muted leading-relaxed`}>
            {children.map((item, i) => (
                <li key={i}>
                    <InlineChildren children={item.children || []} />
                </li>
            ))}
        </Tag>
    );
};

/**
 * Quote/blockquote block renderer.
 */
const QuoteBlock = ({ children }) => (
    <blockquote className="border-l-4 border-accent-primary/50 pl-4 py-2 italic text-text-muted bg-surface/20 rounded-r-lg">
        <InlineChildren children={children} />
    </blockquote>
);

/**
 * Code block renderer (multi-line).
 */
const CodeBlock = ({ children = [] }) => {
    const code = children.map(c => c.text || '').join('\n');
    return (
        <pre className="p-4 rounded-xl bg-surface border border-border-subtle overflow-x-auto text-sm">
            <code className="font-mono text-text-primary">{code}</code>
        </pre>
    );
};

/**
 * Image block renderer.
 */
const ImageBlock = ({ image }) => {
    if (!image?.url) return null;
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
    const src = image.url.startsWith('http') ? image.url : `${backendUrl}${image.url}`;
    return (
        <figure className="rounded-2xl overflow-hidden border border-border-subtle">
            <img
                src={src}
                alt={image.alternativeText || image.name || ''}
                className="w-full h-auto object-cover"
                loading="lazy"
            />
            {image.caption && (
                <figcaption className="text-xs text-text-muted text-center py-2 font-mono">
                    {image.caption}
                </figcaption>
            )}
        </figure>
    );
};

// ─── Block Router ────────────────────────────────────────────────────

/**
 * Routes a single block to its corresponding renderer.
 * @param {object} block - Strapi rich text block node
 * @param {number} index
 * @returns {JSX.Element|null}
 */
const BlockRouter = ({ block, index }) => {
    if (!block) return null;

    switch (block.type) {
        case 'paragraph':
            return <ParagraphBlock key={index} children={block.children} />;
        case 'heading':
            return <HeadingBlock key={index} level={block.level} children={block.children} />;
        case 'list':
            return <ListBlock key={index} format={block.format} children={block.children} />;
        case 'quote':
            return <QuoteBlock key={index} children={block.children} />;
        case 'code':
            return <CodeBlock key={index} children={block.children} />;
        case 'image':
            return <ImageBlock key={index} image={block.image} />;
        default:
            // Graceful fallback for unknown block types
            if (block.children) {
                return (
                    <div key={index} className="text-text-muted">
                        <InlineChildren children={block.children} />
                    </div>
                );
            }
            return null;
    }
};

// ─── Main Component ──────────────────────────────────────────────────

/**
 * RichTextBlocks — shared global component for rendering Strapi rich text blocks.
 * Accepts an array of Strapi block nodes and renders each through specialized unit renderers.
 *
 * @param {object} props
 * @param {Array<object>} props.blocks - Strapi rich text block array
 * @param {string} [props.className] - Optional wrapper class
 * @returns {JSX.Element|null}
 */
export const RichTextBlocks = ({ blocks, className = '' }) => {
    if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        return null;
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {blocks.map((block, i) => (
                <BlockRouter key={i} block={block} index={i} />
            ))}
        </div>
    );
};

export default RichTextBlocks;
