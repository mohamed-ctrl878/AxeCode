import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { cn } from '@core/utils/cn';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { RichBlocksPreviewer } from '@presentation/shared/components/RichBlocksPreviewer';

export const RichTextNode = ({ id, data, selected }) => {
    const [isEditing, setIsEditing] = useState(data.isEditing || false);
    const [content, setContent] = useState(data.content || []);

    // Sync external props if changed (e.g., from settings sidebar)
    useEffect(() => {
        if (data.isEditing !== undefined) setIsEditing(data.isEditing);
    }, [data.isEditing]);

    const handleContentChange = (newContent) => {
        setContent(newContent);
        if (data.onChange) {
            data.onChange(id, newContent);
        }
    };

    // Style Mapping Based on Shape Prop
    const shapeStyles = {
        rectangle: "rounded-xl",
        circle: "rounded-full aspect-square flex items-center justify-center p-8",
        pill: "rounded-full px-8 py-4",
        diamond: "rotate-45" // We'll reverse rotate the content inside
    };

    // Default colors picking up from design system, or overridden by data.color/borderColor
    const bgColor = data.color || "bg-surface";
    const borderColor = data.borderColor || "border-border-subtle";
    const selectedRing = selected ? "ring-2 ring-accent-primary ring-offset-2 ring-offset-background" : "";

    const activeShapeClass = shapeStyles[data.shape] || shapeStyles.rectangle;
    const isDiamond = data.shape === 'diamond';

    return (
        <>
            <NodeResizer 
                color="#34d399" // accent-primary matches
                isVisible={selected} 
                minWidth={250} 
                minHeight={150} 
            />
            <div 
                className={cn(
                    "relative transition-all duration-200 shadow-sm w-full h-full border-2",
                    bgColor,
                    borderColor,
                    activeShapeClass,
                    selectedRing
                )}
                onDoubleClick={() => {
                    // Toggle edit mode on double click if allowed
                    if (data.onEditToggle) data.onEditToggle(id, !isEditing);
                    else setIsEditing(!isEditing);
                }}
            >
            {/* Target Handle (Input) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                className="w-3 h-3 bg-text-muted border-2 border-background" 
            />

            {/* Internal Content Wrapper - reverse rotation if diamond to keep text straight */}
            <div className={cn(
                "w-full h-full flex flex-col p-4",
                isDiamond ? "-rotate-45" : ""
            )}>
                {/* Optional Node Label/Title Header fixed above content */}
                {data.label && (
                    <div className="mb-2 text-xs font-mono font-bold text-text-secondary uppercase tracking-wider text-center border-b border-border-subtle pb-2">
                        {data.label}
                    </div>
                )}
                
                <div className="flex-1 w-full min-h-[50px] flex items-center justify-center pointer-events-auto nodrag">
                    {isEditing ? (
                        <div className="w-full bg-background rounded-lg border border-border-subtle overflow-hidden">
                             <RichTextInput 
                                 value={content}
                                 onChange={handleContentChange}
                                 placeholder="Type node content..."
                                 className="min-h-[100px] text-sm"
                             />
                        </div>
                    ) : (
                        <div className="w-full h-full overflow-hidden text-sm">
                            {(content && content.length > 0) ? (
                                <RichBlocksPreviewer content={content} className="text-text-primary" />
                            ) : (
                                <p className="text-text-muted italic text-center text-sm">Double click to edit</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Source Handle (Output) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="w-3 h-3 bg-accent-primary border-2 border-background" 
            />
            </div>
        </>
    );
};
