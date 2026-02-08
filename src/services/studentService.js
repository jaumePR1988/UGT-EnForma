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
    deleteDoc,
    onSnapshot,
    arrayUnion,
    arrayRemove,
    increment
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
                try {
                    await updateDoc(courseRef, {
                        students: increment(1)
                    });
                } catch (e) {
                    console.error("Failed to update course count", e);
                    // Decide if we want to throw or just log. For now log to not block success.
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
    updateStudent(id, data) {
        try {
            const studentRef = doc(db, COLLECTION_NAME, id);
            // Don't wait for promise here if we want optimistic update feel, but for data integrity we should.
            // The original code was awaiting.
            return updateDoc(studentRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating student:", error);
            throw new Error("No s'han pogut actualitzar les dades de l'alumne.");
        }
    },

    /**
     * Verificar si un estudiante está inscrito en un curso por DNI (Optimizado)
     */
    async verifyStudentEnrollment(courseId, dni) {
        try {
            // Normalizamos el DNI para la búsqueda (uppercase and trim)
            const normalizedDni = dni.trim().toUpperCase();

            // 1. Try exact match first
            const q = query(
                collection(db, COLLECTION_NAME),
                where("courseId", "==", courseId),
                where("dni", "==", normalizedDni)
            );

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }

            // 2. Fallback: Search by course only and filter manually (for cases with/without hyphens/spaces mismatch)
            // This is less efficient but necessary if data is inconsistent
            const qFallback = query(
                collection(db, COLLECTION_NAME),
                where("courseId", "==", courseId)
            );

            const fallbackSnapshot = await getDocs(qFallback);

            // Helper to clean DNI strings for comparison (remove spaces, hyphens, make uppercase)
            const clean = (s) => s ? s.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
            const target = clean(normalizedDni);

            const match = fallbackSnapshot.docs.find(doc => {
                const data = doc.data();
                return clean(data.dni) === target;
            });

            if (match) {
                return { id: match.id, ...match.data() };
            }

            return null;

        } catch (error) {
            console.error("Error verifying enrollment:", error);
            throw new Error("Error verificant la inscripció.");
        }
    },

    /**
     * Marcar assistència a una sessió específica
     */
    async markSessionAttendance(studentId, sessionId) {
        try {
            const studentRef = doc(db, COLLECTION_NAME, studentId);

            await updateDoc(studentRef, {
                attended: true,
                lastAttended: serverTimestamp(),
                attendanceSessions: arrayUnion(sessionId)
            });
            return true;
        } catch (error) {
            console.error("Error marking session attendance:", error);
            throw new Error("Error registrant l'assistència.");
        }
    },

    async removeSessionAttendance(studentId, sessionId) {
        try {
            const studentRef = doc(db, COLLECTION_NAME, studentId);
            await updateDoc(studentRef, {
                attendanceSessions: arrayRemove(sessionId)
                // We don't unset 'attended' boolean because they might have attended other sessions.
                // We could recalculate, but leaving 'attended: true' as "ever attended" is safer for now.
            });
            return true;
        } catch (error) {
            console.error("Error removing session attendance:", error);
            throw new Error("Error anul·lant l'assistència.");
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
    },

    /**
     * Subscriure's a canvis en temps real dels alumnes d'un curs
     */
    subscribeToStudentsByCourse(courseId, callback) {
        if (!courseId) return () => { };

        const q = query(
            collection(db, COLLECTION_NAME),
            where("courseId", "==", courseId),
            orderBy('registeredAt', 'desc')
        );

        // Import onSnapshot dynamically if not at top, or just use it if imported (I will add import)
        // Since I can edit top, I'll assume I edit top too. But tool is replace_file_content.
        // It's safer to use the imported one if I add it to imports.
        // Let's rely on the import I'm adding.

        return onSnapshot(q, (snapshot) => {
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(students);
        }, (error) => {
            console.error("Error subscribing to students:", error);
        });
    }
};
