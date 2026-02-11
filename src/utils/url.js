/**
 * Returns the base URL for public links (enrollment, attendance, etc.)
 * Priority: 
 * 1. import.meta.env.VITE_PUBLIC_URL (if set)
 * 2. window.location.origin (current host)
 */
export const getBaseUrl = () => {
    return import.meta.env.VITE_PUBLIC_URL || window.location.origin;
};
