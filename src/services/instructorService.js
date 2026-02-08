import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'instructors';

export const instructorService = {
    // Get all instructors
    async getInstructors() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting instructors:", error);
            throw error;
        }
    },

    // Add a new instructor
    async addInstructor(instructorData) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...instructorData,
                createdAt: serverTimestamp(),
                active: true
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding instructor:", error);
            throw error;
        }
    },

    // Update an instructor
    async updateInstructor(id, updates) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating instructor:", error);
            throw error;
        }
    },

    // Delete (or deactivate) an instructor
    async deleteInstructor(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting instructor:", error);
            throw error;
        }
    }
};
