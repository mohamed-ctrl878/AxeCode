import React, { useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import { RichTextNode } from './nodes/RichTextNode';

const nodeTypes = {
    richText: RichTextNode
};

/**
 * Shared component for previewing Flowcharts (read-only mode).
 * Intended for use in Article Details pages and public feeds.
 * 
 * @param {Array} nodes - ReactFlow nodes array
 * @param {Array} edges - ReactFlow edges array
 * @param {string} className - Optional container styling
 */
export const FlowPreviewer = ({ nodes = [], edges = [], className }) => {
    
    // Inject safeguards into nodes to prevent them from entering Edit mode on double click
    const lockedNodes = useMemo(() => {
        return nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                // Override toggle handler to do nothing in preview mode
                onEditToggle: () => {}, 
                // Force editing off
                isEditing: false
            }
        }));
    }, [nodes]);

    return (
        <div className={`w-full h-full relative bg-surface-dark border border-border-subtle rounded-2xl overflow-hidden ${className || ''}`}>
            <ReactFlow
                nodes={lockedNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                // Disable all builder interactions
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true} // Allow selecting to see labels but not move
                zoomOnScroll={true}
                panOnDrag={true}
            >
                <Background color="#3f3f46" gap={16} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};
