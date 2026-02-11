import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { userService } from '../services/userService';

const AuthContext = createContext();

// Admins hardcoded (In a real app, this would be a custom claim or a special collection)
const ADMIN_EMAILS = [
    'jaume@ugt.cat',
    'admin@ugt.cat',
    'formación@ugt.cat',
    'formacion@ugt.cat',
    'formacio@ugt.cat'
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'admin', 'teacher', or null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Determine Role from Firestore
                try {
                    let userData = await userService.getUserById(firebaseUser.uid);

                    // If no user by UID, look for an invitation by Email
                    if (!userData) {
                        const invitation = await userService.getUserByEmail(firebaseUser.email);
                        if (invitation && invitation.isInvitation) {
                            // "Claim" the invitation: Save as real user with the new UID
                            const { id, isInvitation, ...invitationData } = invitation;
                            await userService.saveUser(firebaseUser.uid, {
                                ...invitationData,
                                email: firebaseUser.email,
                                name: invitationData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0]
                            });

                            // Delete the invitation record
                            await userService.deleteUser(invitation.id);

                            // Load the newly created user data
                            userData = await userService.getUserById(firebaseUser.uid);
                            console.log("Invitation claimed successfully for:", firebaseUser.email);
                        }
                    }

                    if (userData && userData.active !== false) {
                        setRole(userData.role);
                    } else if (ADMIN_EMAILS.includes(firebaseUser.email)) {
                        // Fallback for bootstrap admins during migration
                        setRole('admin');
                        // Auto-save this user to Firestore if they are a bootstrap admin
                        await userService.saveUser(firebaseUser.uid, {
                            email: firebaseUser.email,
                            role: 'admin',
                            active: true,
                            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
                        });
                    } else {
                        setRole(null);
                    }
                } catch (err) {
                    console.error("Error fetching role / claiming invitation:", err);
                    setRole(null);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        user,
        role,
        loading,
        login,
        logout,
        resetPassword,
        isAdmin: role === 'admin',
        isTeacher: role === 'teacher'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
