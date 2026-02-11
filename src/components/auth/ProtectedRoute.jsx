import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A component that wraps protected routes to ensure the user is 
 * authenticated AND has an assigned role (admin or teacher).
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Not logged in at all, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!role) {
        // Logged in but has NO role (not admin, not teacher)
        // This is the specific case the user wants to block.
        return <Navigate to="/login" state={{
            from: location,
            error: 'no_access_permission'
        }} replace />;
    }

    if (requiredRole && role !== requiredRole && role !== 'admin') {
        // Has a role, but not the right one (and isn't admin)
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
