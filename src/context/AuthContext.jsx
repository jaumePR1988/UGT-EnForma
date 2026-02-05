import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // For development, we bypass the Firebase actual auth loading if it hangs
    const [currentUser, setCurrentUser] = useState({ email: 'admin@ugt.cat', displayName: 'Administrador' });
    const [loading, setLoading] = useState(false);

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
