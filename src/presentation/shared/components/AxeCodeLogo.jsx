import React from 'react';
import { cn } from '@core/utils/cn';

/**
 * AxeCodeLogo: The new brand identity.
 * Features a terminal command prefix and a responsive text container.
 * 
 * @param {boolean} isCollapsed - Whether to show "AC" or "AxeCode"
 * @param {string} className - Additional container styling
 * @param {string} size - Base scale of the logo (text size)
 */
export const AxeCodeLogo = ({ isCollapsed = false, className, size = "text-xl" }) => {
    return (
        <div className={cn(
            "flex items-center select-none font-mono",
            className
        )}>
            {/* Logo Text with 3-sided border (Left, Top, Bottom) - Flat & Sharp Style */}
            <div className={cn(
                "border-y border-l border-near-black",
                "px-3 py-1 flex items-center justify-center transition-all duration-500 ease-in-out overflow-hidden",
                isCollapsed ? "rounded-none min-w-[40px]" : "rounded-none"
            )}>
                <span className={cn(
                    "text-near-black font-bold tracking-tight whitespace-nowrap",
                    size
                )}>
                    {isCollapsed ? "AC" : "AxeCode"}
                </span>
            </div>

            {/* Terminal Symbol Prefix (Now on the Right) - Flat Style */}
            <span className={cn(
                "flex items-center text-near-black font-bold transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] leading-none",
                isCollapsed ? "-ml-2" : "ml-2",
                size
            )}>
                {/* The Arrow Shaft (Morphs from Slash to Dash) */}
                <span className="relative inline-flex items-center justify-center w-[0.6em] h-[1em] overflow-visible">
                    <span className={cn(
                        "absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isCollapsed ? "opacity-0 rotate-[60deg] scale-50" : "opacity-100 rotate-0 scale-100"
                    )}>
                        /
                    </span>
                    <span className={cn(
                        "absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-[-1px]",
                        isCollapsed ? "opacity-100 rotate-0 scale-100 translate-x-[2px]" : "opacity-0 -rotate-[60deg] scale-50"
                    )}>
                        -
                    </span>
                </span>
                
                {/* The Arrow Head (Bracket) */}
                <span className={cn(
                    "inline-block transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    isCollapsed ? "-translate-x-[1px]" : "translate-x-[2px]"
                )}>
                    {">"}
                </span>
            </span>
        </div>
    );
};

export default AxeCodeLogo;
