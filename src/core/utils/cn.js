import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes safely.
 * Follows SRP: Only handles class name concatenation and merging.
 * Follows DIP: Depends on abstractions provided by clsx and tailwind-merge.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
