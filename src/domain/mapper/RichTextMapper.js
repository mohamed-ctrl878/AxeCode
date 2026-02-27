/**
 * Utility to map between Tiptap JSON and Strapi Blocks JSON.
 */
export class RichTextMapper {
    /**
     * Converts Tiptap JSON Document to Strapi Blocks JSON array.
     * @param {object} tiptapJson - Tiptap document JSON object
     * @returns {Array<object>} - Strapi Blocks array
     */
    static toStrapiBlocks(tiptapJson) {
        if (!tiptapJson || !tiptapJson.content) return [];
        return tiptapJson.content.map(node => this.#mapTiptapNodeToStrapi(node)).filter(Boolean);
    }

    /**
     * Converts Strapi Blocks JSON array to Tiptap JSON Document.
     * @param {Array<object>} strapiBlocks - Strapi Blocks array
     * @returns {object} - Tiptap document JSON object
     */
    static toTiptapJson(strapiBlocks) {
        if (!strapiBlocks || !Array.isArray(strapiBlocks)) return { type: 'doc', content: [{ type: 'paragraph', content: [] }] };
        return {
            type: 'doc',
            content: strapiBlocks.map(block => this.#mapStrapiBlockToTiptap(block)).filter(Boolean)
        };
    }

    // --- Private specific node mappers (Tiptap -> Strapi) ---

    static #mapTiptapNodeToStrapi(node) {
        if (!node) return null;

        const children = node.content ? node.content.map(c => this.#mapTiptapNodeToStrapi(c)).filter(Boolean) : [];

        switch (node.type) {
            case 'paragraph':
                return { type: 'paragraph', children: children.length ? children : [{ type: 'text', text: '' }] };
            case 'heading':
                return { type: 'heading', level: node.attrs?.level || 2, children: children.length ? children : [{ type: 'text', text: '' }] };
            case 'bulletList':
                return { type: 'list', format: 'unordered', children };
            case 'orderedList':
                return { type: 'list', format: 'ordered', children };
            case 'listItem':
                // Strapi expects listItem to have children which are inline nodes natively, 
                // but TipTap nests paragraphs inside listItems.
                // We'll extract text/inline nodes from the paragraph to flatten the list item if needed, 
                // or keep it if Strapi supports blocks inside list items.
                // It usually supports list-item with children text nodes.

                // Let's flatten children that are paragraphs:
                let flatChildren = [];
                children.forEach(c => {
                    if (c.type === 'paragraph' && c.children) {
                        flatChildren.push(...c.children);
                    } else {
                        flatChildren.push(c);
                    }
                });
                return { type: 'list-item', children: flatChildren.length ? flatChildren : [{ type: 'text', text: '' }] };
            case 'blockquote':
                return { type: 'quote', children };
            case 'codeBlock':
                return { type: 'code', children };
            case 'text':
                const textNode = { type: 'text', text: node.text || '' };
                if (node.marks) {
                    node.marks.forEach(mark => {
                        if (mark.type === 'bold') textNode.bold = true;
                        if (mark.type === 'italic') textNode.italic = true;
                        if (mark.type === 'strike') textNode.strikethrough = true;
                        if (mark.type === 'underline') textNode.underline = true;
                        if (mark.type === 'code') textNode.code = true;
                    });
                }
                return textNode;
            default:
                // Handle unsupported types gracefully by rendering as paragraph
                return { type: 'paragraph', children: children.length ? children : [{ type: 'text', text: '' }] };
        }
    }

    // --- Private specific node mappers (Strapi -> Tiptap) ---

    static #mapStrapiBlockToTiptap(block) {
        if (!block) return null;

        const content = block.children ? block.children.map(c => this.#mapStrapiBlockToTiptap(c)).filter(Boolean) : undefined;

        switch (block.type) {
            case 'paragraph':
                return { type: 'paragraph', content };
            case 'heading':
                return { type: 'heading', attrs: { level: block.level || 2 }, content };
            case 'list':
                const listType = block.format === 'ordered' ? 'orderedList' : 'bulletList';
                return { type: listType, content };
            case 'list-item':
                // Tiptap expects paragraphs inside list items usually (Starter Kit default)
                return { type: 'listItem', content: [{ type: 'paragraph', content }] };
            case 'quote':
                return { type: 'blockquote', content };
            case 'code':
                return { type: 'codeBlock', content };
            case 'text':
                const textNode = { type: 'text', text: block.text || '' };
                const marks = [];
                if (block.bold) marks.push({ type: 'bold' });
                if (block.italic) marks.push({ type: 'italic' });
                if (block.strikethrough) marks.push({ type: 'strike' });
                if (block.underline) marks.push({ type: 'underline' });
                if (block.code) marks.push({ type: 'code' });

                if (marks.length > 0) textNode.marks = marks;
                return textNode;
            case 'link':
                return { type: 'text', text: 'Unsupported link for now' }; // Tiptap links require marks usually or specific nodes
            default:
                return { type: 'paragraph', content };
        }
    }
}
