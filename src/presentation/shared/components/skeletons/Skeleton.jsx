import React from 'react';
import { cn } from '@core/utils/cn';

/**
 * Skeleton: Atomic component for building loading placeholders.
 * Features a premium shimmer animation and supports various shapes.
 */
export const Skeleton = ({ 
    className, 
    variant = 'rect', // rect, circle, text
    animate = true 
}) => {
    return (
        <div 
            className={cn(
                "relative overflow-hidden bg-surface-light border border-border-subtle/50",
                animate && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.03] before:to-transparent",
                variant === 'circle' ? "rounded-full" : "rounded-xl",
                variant === 'text' ? "h-4 w-full rounded-md" : "",
                className
            )}
        />
    );
};
