import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * StarRating - Reusable star rating component.
 * Supports both interactive (clickable) and display-only modes.
 * 
 * @param {number} value - Current rating value (0-5)
 * @param {number} maxStars - Maximum number of stars (default 5)
 * @param {boolean} interactive - Whether user can click to rate
 * @param {Function} onChange - Callback when user clicks a star (receives new value)
 * @param {string} size - Star size: 'sm' | 'md' | 'lg'
 * @param {boolean} showValue - Show numeric value next to stars
 * @param {string} className - Additional classes
 */
export const StarRating = ({ 
    value = 0, 
    maxStars = 5, 
    interactive = false, 
    onChange, 
    size = 'md',
    showValue = false,
    className 
}) => {
    const [hoverValue, setHoverValue] = useState(0);

    const sizeMap = {
        sm: 14,
        md: 18,
        lg: 24
    };

    const starSize = sizeMap[size] || sizeMap.md;

    const handleClick = (starIndex) => {
        if (!interactive || !onChange) return;
        // Toggle: clicking same value resets to 0
        const newValue = starIndex === value ? 0 : starIndex;
        onChange(newValue);
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: maxStars }, (_, i) => {
                const starIndex = i + 1;
                const isFilled = starIndex <= (hoverValue || value);

                return (
                    <Star
                        key={starIndex}
                        size={starSize}
                        className={cn(
                            "transition-all duration-150",
                            isFilled
                                ? "text-amber-400 fill-amber-400"
                                : "text-text-muted/30",
                            interactive && "cursor-pointer hover:scale-110"
                        )}
                        onClick={() => handleClick(starIndex)}
                        onMouseEnter={() => interactive && setHoverValue(starIndex)}
                        onMouseLeave={() => interactive && setHoverValue(0)}
                    />
                );
            })}
            {showValue && (
                <span className="ml-1.5 text-sm font-bold text-text-muted">
                    {value > 0 ? value.toFixed(1) : '—'}
                </span>
            )}
        </div>
    );
};
