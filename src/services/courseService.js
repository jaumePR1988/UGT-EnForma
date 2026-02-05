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
    serverTimestamp,
    getDoc,
    where
} from 'firebase/firestore';

const COLLECTION_NAME = 'courses';

export const courseService = {
    /**
     * Obtener todos los cursos con ordenación por fecha de inicio
     */
    async getCourses() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('startDate', 'asc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting courses: ", error);
            throw new Error("No s'han pogut carregar els cursos. Revisa els permisos de Firebase.");
        }
    },

    /**
     * Obtener un curso específico por ID
     */
    async getCourseById(id) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("El curs no existeix.");
            }
        } catch (error) {
            console.error("Error getting course:", error);
            throw error;
        }
    },

    /**
     * Crear nuevo curso con campos para análisis de IA
     */
    async addCourse(courseData) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...courseData,
                createdAt: serverTimestamp(),
                enrolledCount: 0,
                status: 'open',
                category: courseData.category || 'General', // Para análisis de IA
                maxCapacity: courseData.maxCapacity || 30
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding course: ", error);
            throw new Error("No s'ha pogut crear el curs.");
        }
    },

    /**
     * Actualizar curso
     */
    async updateCourse(id, courseData) {
        try {
            const courseRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(courseRef, {
                ...courseData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating course: ", error);
            throw new Error("No s'ha pogut actualitzar el curs.");
        }
    },

    /**
     * Eliminar curso
     */
    async deleteCourse(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting course: ", error);
            throw new Error("No s'ha pogut eliminar el curs.");
        }
    }
};
