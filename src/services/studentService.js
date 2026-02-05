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
    }
};
