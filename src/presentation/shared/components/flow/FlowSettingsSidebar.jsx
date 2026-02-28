import React from 'react';
import { cn } from '@core/utils/cn';
import { Settings, Square, Circle, Diamond, RectangleHorizontal, Type, PenLine, Droplet } from 'lucide-react';

export const FlowSettingsSidebar = ({ 
    selectedNode, 
    selectedEdge, 
    onNodeUpdate, 
    onEdgeUpdate, 
    onClose 
}) => {
    
    if (!selectedNode && !selectedEdge) return null;

    const isNode = !!selectedNode;
    const element = isNode ? selectedNode : selectedEdge;

    // Pre-defined Design System Colors for Nodes
    const colorSwatches = [
        { name: "Surface", bg: "bg-surface", border: "border-border-subtle" },
        { name: "Primary", bg: "bg-accent-primary/10", border: "border-accent-primary" },
        { name: "Danger", bg: "bg-rose-500/10", border: "border-rose-500/50" },
        { name: "Warning", bg: "bg-amber-500/10", border: "border-amber-500/50" },
        { name: "Info", bg: "bg-blue-500/10", border: "border-blue-500/50" },
        { name: "Success", bg: "bg-emerald-500/10", border: "border-emerald-500/50" },
        { name: "Dark", bg: "bg-surface-dark", border: "border-[#333]" }
    ];

    const shapeOptions = [
        { id: 'rectangle', icon: Square, label: "Square" },
        { id: 'circle', icon: Circle, label: "Circle" },
        { id: 'diamond', icon: Diamond, label: "Diamond" },
        { id: 'pill', icon: RectangleHorizontal, label: "Pill" },
    ];

    const edgeTypeOptions = [
        { id: 'default', label: 'Bezier Curve' },
        { id: 'straight', label: 'Straight Line' },
        { id: 'step', label: 'Step' },
        { id: 'smoothstep', label: 'Smooth Step' },
    ];

    return (
        <aside className="w-80 h-full border-l border-border-subtle bg-surface-light flex flex-col pt-4 overflow-y-auto">
            <div className="px-6 pb-4 border-b border-border-subtle flex justify-between items-center">
                <div className="flex items-center gap-2 text-text-primary">
                    <Settings size={18} className="text-accent-primary" />
                    <h3 className="font-bold">{isNode ? 'Node Settings' : 'Edge Settings'}</h3>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-8">
                {isNode ? (
                    <>
                        {/* Node Label Editing */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Type size={14} /> Handle Label
                            </label>
                            <input 
                                type="text"
                                className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="Optional Header..."
                                value={element.data?.label || ''}
                                onChange={(e) => onNodeUpdate(element.id, { ...element.data, label: e.target.value })}
                            />
                        </div>

                        {/* Shape Selection */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Square size={14} /> Shape
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {shapeOptions.map(shape => {
                                    const Icon = shape.icon;
                                    const isActive = element.data?.shape === shape.id;
                                    return (
                                        <button 
                                            key={shape.id}
                                            onClick={() => onNodeUpdate(element.id, { ...element.data, shape: shape.id })}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-sm",
                                                isActive 
                                                    ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
                                                    : "bg-background border-border-subtle text-text-secondary hover:bg-surface"
                                            )}
                                        >
                                            <Icon size={16} /> <span>{shape.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Background & Theme Selection */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Droplet size={14} /> Theme Color
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorSwatches.map((color, i) => {
                                    const isActive = element.data?.color === color.bg;
                                    return (
                                        <button
                                            key={i}
                                            title={color.name}
                                            onClick={() => onNodeUpdate(element.id, { 
                                                ...element.data, 
                                                color: color.bg,
                                                borderColor: color.border
                                            })}
                                            className={cn(
                                                "w-full aspect-square rounded-full border-2 transition-transform hover:scale-110",
                                                color.bg,
                                                color.border,
                                                isActive ? "ring-2 ring-accent-primary ring-offset-2 ring-offset-surface-light" : ""
                                            )}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Edit Mode Toggle */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-border-subtle">
                            <button
                                onClick={() => onNodeUpdate(element.id, { ...element.data, isEditing: !element.data?.isEditing })}
                                className={cn(
                                    "w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all",
                                    element.data?.isEditing 
                                        ? "bg-surface border border-accent-primary text-accent-primary"
                                        : "bg-accent-primary text-background hover:bg-accent-hover"
                                )}
                            >
                                <PenLine size={18} />
                                {element.data?.isEditing ? 'Finish Editing Text' : 'Edit Rich Text Inside Node'}
                            </button>
                            <p className="text-[10px] text-text-muted text-center mt-1">Or double-click the node on the canvas</p>
                        </div>
                    </>
                ) : (
                    // Edge Settings 
                    <>
                        {/* Edge Path Type */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-mono text-text-muted uppercase tracking-widest">Routing Type</label>
                            <div className="flex flex-col gap-2">
                                {edgeTypeOptions.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => onEdgeUpdate(element.id, { type: type.id })}
                                        className={cn(
                                            "w-full text-left px-4 py-2 rounded-lg border transition-all text-sm",
                                            element.type === type.id || (!element.type && type.id === 'default')
                                                ? "bg-accent-primary/10 border-accent-primary text-accent-primary"
                                                : "bg-background border-border-subtle text-text-secondary hover:bg-surface"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Animated Toggle */}
                        <div className="flex items-center justify-between p-4 bg-background border border-border-subtle rounded-xl mt-4">
                            <span className="text-sm font-semibold text-text-primary">Animated Flow</span>
                            <button 
                                onClick={() => onEdgeUpdate(element.id, { animated: !element.animated })}
                                className={cn(
                                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                                    element.animated ? "bg-accent-primary" : "bg-surface-dark"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 shadow-sm",
                                    element.animated ? "translate-x-7" : "translate-x-1"
                                )} />
                            </button>
                        </div>

                        {/* Edge Label */}
                        <div className="flex flex-col gap-3 mt-4">
                            <label className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Type size={14} /> Edge Label
                            </label>
                            <input 
                                type="text"
                                className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                                placeholder="..."
                                value={element.label || ''}
                                onChange={(e) => onEdgeUpdate(element.id, { label: e.target.value })}
                            />
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};
