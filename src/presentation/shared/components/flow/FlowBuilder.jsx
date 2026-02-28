import React, { useCallback, useState, useRef } from 'react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    useNodesState, 
    useEdgesState, 
    addEdge,
    MiniMap,
    ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Essential base styles
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save } from 'lucide-react';

import { RichTextNode } from './nodes/RichTextNode';
import { FlowSettingsSidebar } from './FlowSettingsSidebar';

const nodeTypes = {
    richText: RichTextNode,
};

/**
 * Shared FlowBuilder Component.
 * Pass initialNodes/initialEdges to load existing data.
 * Call onSave(nodes, edges) to persist back to Strapi.
 */
const FlowBuilderInner = ({ 
    initialNodes = [], 
    initialEdges = [], 
    onSave, 
    readOnly = false,
    className
}) => {
    // Generate an ID for the wrapper to scope CSS if needed
    const reactFlowWrapper = useRef(null);

    // State Hooks
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    // UI Selection State
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);

    const onConnect = useCallback((params) => {
        // Default edge is smoothstep and animated for cool factor
        const customEdge = {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2 }
        };
        setEdges((eds) => addEdge(customEdge, eds));
    }, [setEdges]);

    const onNodeClick = useCallback((_, node) => {
        if (readOnly) return;
        setSelectedNode(node);
        setSelectedEdge(null);
    }, [readOnly]);

    const onEdgeClick = useCallback((_, edge) => {
        if (readOnly) return;
        setSelectedEdge(edge);
        setSelectedNode(null);
    }, [readOnly]);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }, []);

    // ---------------------------------------------------------------- //
    // Controls: Add Node
    // ---------------------------------------------------------------- //
    const addRichTextNode = () => {
        const newNodeId = `node_${uuidv4()}`;
        const newNode = {
            id: newNodeId,
            type: 'richText',
            position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
            data: { 
                label: 'New Concept',
                content: [], 
                shape: 'rectangle',
                color: 'bg-surface',
                borderColor: 'border-border-subtle',
                isEditing: true, // open editor immediately
                // Inject callback to update content organically from inside the node
                onChange: (id, newContent) => updateNodeData(id, { content: newContent }),
                onEditToggle: (id, isEditing) => updateNodeData(id, { isEditing })
            }
        };
        setNodes((nds) => nds.concat(newNode));
        setSelectedNode(newNode);
        setSelectedEdge(null);
    };

    // ---------------------------------------------------------------- //
    // Data Handlers for Sidebar
    // ---------------------------------------------------------------- //
    const updateNodeData = useCallback((nodeId, newDataProps) => {
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === nodeId) {
                    const updatedNode = { ...n, data: { ...n.data, ...newDataProps } };
                    // Keep sidebar selected instance in sync
                    if (selectedNode?.id === nodeId) {
                        setSelectedNode(updatedNode);
                    }
                    return updatedNode;
                }
                return n;
            })
        );
    }, [selectedNode, setNodes]);

    const updateEdgeProperties = useCallback((edgeId, newEdgeProps) => {
        setEdges((eds) =>
            eds.map((e) => {
                if (e.id === edgeId) {
                    const updatedEdge = { ...e, ...newEdgeProps };
                    if (selectedEdge?.id === edgeId) {
                        setSelectedEdge(updatedEdge);
                    }
                    return updatedEdge;
                }
                return e;
            })
        );
    }, [selectedEdge, setEdges]);

    // Handle extraction for saving
    const extractFlowData = () => {
        // Strip out the functions (onChange, onEditToggle) before converting to JSON
        const cleanNodes = nodes.map(n => {
            const { onChange, onEditToggle, isEditing, ...cleanData } = n.data;
            return { ...n, data: { ...cleanData, isEditing: false } };
        });
        
        if (onSave) onSave({ nodes: cleanNodes, edges });
    };

    // In read-only mode, we ensure editing features are disabled
    const mappedNodes = readOnly 
        ? nodes.map(n => ({ ...n, draggable: false, selectable: false })) 
        : nodes.map(n => {
             // ensure functions are attached for interactivity if someone passes initial nodes from DB
             if (!n.data.onChange) {
                 n.data.onChange = (id, newContent) => updateNodeData(id, { content: newContent });
             }
             if (!n.data.onEditToggle) {
                 n.data.onEditToggle = (id, isEditing) => updateNodeData(id, { isEditing });
             }
             return n;
        });

    return (
        <div className={`w-full flex h-[600px] border border-border-subtle rounded-2xl overflow-hidden bg-background ${className}`} ref={reactFlowWrapper}>
            {/* React Flow Canvas Playground */}
            <div className="flex-1 h-full relative">
                
                {/* Top Overlay Toolbar */}
                {!readOnly && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <button 
                            onClick={addRichTextNode}
                            className="flex items-center gap-2 bg-surface border border-border-subtle text-text-primary px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-surface-light hover:border-accent-primary transition-all"
                        >
                            <Plus size={16} className="text-accent-primary" /> Add Node
                        </button>
                        
                        {onSave && (
                            <button 
                                onClick={extractFlowData}
                                className="flex items-center gap-2 bg-accent-primary text-background px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:bg-accent-hover transition-all"
                            >
                                <Save size={16} /> Save Chart
                            </button>
                        )}
                    </div>
                )}

                <ReactFlow
                    nodes={mappedNodes}
                    edges={edges}
                    onNodesChange={readOnly ? undefined : onNodesChange}
                    onEdgesChange={readOnly ? undefined : onEdgesChange}
                    onConnect={readOnly ? undefined : onConnect}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    onPaneClick={onPaneClick}
                    fitView
                    attributionPosition="bottom-right"
                    proOptions={{ hideAttribution: true }} // Disables the watermark if permitted
                >
                    <Background color="#3f3f46" gap={16} size={1} />
                    <Controls className="bg-surface border-border-subtle !shadow-xl [&_button]:border-b-border-subtle [&_button]:bg-surface [&_button]:fill-text-primary [&_button:hover]:bg-surface-light" />
                    <MiniMap 
                        className="bg-surface border-border-subtle rounded-lg shadow-xl"
                        nodeColor={(node) => {
                            switch (node.data?.shape) {
                                case 'diamond': return '#f59e0b';
                                case 'circle': return '#ec4899';
                                default: return '#34d399';
                            }
                        }}
                    />
                </ReactFlow>
            </div>

            {/* Sidebar for Selection Configuration */}
            {(!readOnly && (selectedNode || selectedEdge)) && (
                <FlowSettingsSidebar 
                    selectedNode={selectedNode}
                    selectedEdge={selectedEdge}
                    onNodeUpdate={updateNodeData}
                    onEdgeUpdate={updateEdgeProperties}
                    onClose={() => onPaneClick()}
                />
            )}
        </div>
    );
};

// Wrap with Provider to ensure React Flow context is available
export const FlowBuilder = (props) => (
    <ReactFlowProvider>
        <FlowBuilderInner {...props} />
    </ReactFlowProvider>
);
