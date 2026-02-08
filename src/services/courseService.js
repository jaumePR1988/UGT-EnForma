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
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Ensure 'students' property exists for UI compatibility
                    students: data.students !== undefined ? data.students : (data.enrolledCount || 0)
                };
            });
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
                // Removed hardcoded 'enrolledCount' and 'status' to respect UI values
                category: courseData.category || 'General',
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
            await deleteDoc(doc(db, 'courses', id));
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    },

    /**
     * Recalculates the student count for a specific course based on actual 'students' collection data.
     */
    async recalculateCourseStudents(courseId) {
        try {
            const { collection, query, where, getCountFromServer, updateDoc, doc } = await import('firebase/firestore');
            const q = query(collection(db, 'students'), where('courseId', '==', courseId));
            const snapshot = await getCountFromServer(q);
            const count = snapshot.data().count;

            const courseRef = doc(db, 'courses', courseId);
            await updateDoc(courseRef, {
                students: count
            });
            return count;
        } catch (error) {
            console.error(`Error recalculating students for course ${courseId}:`, error);
            return 0;
        }
    },

    /**
     * Syncs student counts for ALL courses.
     * Heavy operation, should be used sparingly (e.g., via Settings).
     */
    async syncAllCourseCounts() {
        try {
            // 1. Get all courses
            const courses = await this.getCourses();

            // 2. Get all students (optimized: maybe just get metadata? for now get all is fine for small/medium DB)
            // Ideally we use an aggregation query, but let's iterate for simplicity and reliability in client SDK
            const { collection, getDocs } = await import('firebase/firestore');
            const studentsSnap = await getDocs(collection(db, 'students'));
            const students = studentsSnap.docs.map(d => d.data());

            // 3. Count students per course
            const counts = {};
            students.forEach(s => {
                if (s.courseId) {
                    counts[s.courseId] = (counts[s.courseId] || 0) + 1;
                }
            });

            // 4. Update courses where count differs
            let updatedCount = 0;
            const { doc, updateDoc } = await import('firebase/firestore');

            const updatePromises = courses.map(async (course) => {
                const actualCount = counts[course.id] || 0;
                // Check if update is needed (assuming course.students is what we display)
                if (course.students !== actualCount) {
                    const courseRef = doc(db, 'courses', course.id);
                    await updateDoc(courseRef, { students: actualCount });
                    updatedCount++;
                }
            });

            await Promise.all(updatePromises);
            return { success: true, updatedCourses: updatedCount };

        } catch (error) {
            console.error("Error syncing course counts:", error);
            throw error;
        }
    }
};
