import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    query,
    where,
    serverTimestamp,
    orderBy,
    getDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'students';

export const studentService = {
    /**
     * Obtener curso por ID
     */
    async getStudentById(id) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting student by ID:", error);
            throw error;
        }
    },

    /**
     * Obtener todos los estudiantes (ordenados por fecha de registro)
     */
    async getStudents() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('registeredAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching students:", error);
            throw new Error("No s'ha pogut carregar la llista d'alumnes. Revisa la teva connexió.");
        }
    },

    /**
     * Registrar un estudiante con validación de duplicados
     */
    async registerStudent(studentData) {
        if (!studentData.email) {
            throw new Error("L'Email és obligatori.");
        }

        try {
            // Verificar si ya existe en este curso particular
            const q = query(
                collection(db, COLLECTION_NAME),
                where("dni", "==", studentData.dni),
                where("courseId", "==", studentData.courseId)
            );
            const existing = await getDocs(q);

            if (!existing.empty) {
                throw new Error("L'alumne ja està inscrit en aquest curs.");
            }

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...studentData,
                registeredAt: serverTimestamp(),
                status: 'registered',
                isAffiliated: studentData.isAffiliated || false
            });

            // Increment student count in course
            if (studentData.courseId) {
                const courseRef = doc(db, 'courses', studentData.courseId);
                // We don't wait for this to prevent blocking if it fails separately, 
                // but good practice to await. For now, best effort.
                try {
                    const { increment } = await import('firebase/firestore');
                    await updateDoc(courseRef, {
                        students: increment(1)
                    });
                } catch (e) {
                    console.error("Failed to update course count", e);
                }
            }

            return { id: docRef.id, ...studentData };
        } catch (error) {
            console.error("Error registering student:", error);
            throw error;
        }
    },

    /**
     * Obtener estudiantes filtrados por curso
     */
    async getStudentsByCourse(courseId) {
        if (!courseId) return [];
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("courseId", "==", courseId),
                orderBy('registeredAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting students by course:", error);
            throw new Error("Error en carregar els alumnes del curs.");
        }
    },

    /**
     * Actualizar datos de un alumno
     */
    async updateStudent(id, data) {
        try {
            const studentRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(studentRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating student:", error);
            throw new Error("No s'han pogut actualitzar les dades de l'alumne.");
        }
    },

    /**
     * Eliminar un estudiante
     */
    async deleteStudent(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return true;
        } catch (error) {
            console.error("Error deleting student:", error);
            throw new Error("No s'ha pogut eliminar l'alumne.");
        }
    }
};
