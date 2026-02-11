import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    limit
} from 'firebase/firestore';

const COLLECTION_NAME = 'users';

export const userService = {
    // Get all users
    async getUsers() {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // Get a single user by UID
    async getUserById(uid) {
        const docRef = doc(db, COLLECTION_NAME, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    },

    // Get user by email (used for invitations)
    async getUserByEmail(email) {
        if (!email) return null;
        const q = query(
            collection(db, COLLECTION_NAME),
            where('email', '==', email.toLowerCase()),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    },

    // Create or Update user (used during registration or manual creation)
    async saveUser(uid, userData) {
        const docRef = doc(db, COLLECTION_NAME, uid);
        await setDoc(docRef, {
            uid,
            ...userData,
            email: userData.email?.toLowerCase(),
            pushedToFirestore: true,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    },

    // Save invitation (user without UID yet)
    async saveInvitation(userData) {
        // We use a random ID or the email as ID if we want uniqueness
        // Using email as ID for invitations makes it easier to prevent duplicates
        const docId = `invite_${userData.email.toLowerCase()}`;
        const docRef = doc(db, COLLECTION_NAME, docId);
        await setDoc(docRef, {
            ...userData,
            email: userData.email.toLowerCase(),
            isInvitation: true,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }, { merge: true });
    },

    // Update specific fields (e.g., role)
    async updateUser(uid, data) {
        const docRef = doc(db, COLLECTION_NAME, uid);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
    },

    // Delete user from Firestore
    async deleteUser(uid) {
        const docRef = doc(db, COLLECTION_NAME, uid);
        await deleteDoc(docRef);
    }
};
