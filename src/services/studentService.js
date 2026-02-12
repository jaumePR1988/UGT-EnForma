import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
    increment,
    runTransaction
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

        // Normalize DNI
        const normalizedDni = studentData.dni ? studentData.dni.trim().toUpperCase() : '';

        try {
            // Use a transaction to ensure atomic registration and count increment
            return await runTransaction(db, async (transaction) => {
                // 1. Check for duplicates within the transaction
                const q = query(
                    collection(db, COLLECTION_NAME),
                    where("dni", "==", normalizedDni),
                    where("courseId", "==", studentData.courseId)
                );
                const existing = await getDocs(q);

                if (!existing.empty) {
                    throw new Error("L'alumne ja està inscrit en aquest curs.");
                }

                // 2. Prepare student document reference
                const studentRef = doc(collection(db, COLLECTION_NAME));

                // 3. Increment student count in course
                if (studentData.courseId) {
                    const courseRef = doc(db, 'courses', studentData.courseId);
                    const courseSnap = await transaction.get(courseRef);

                    if (courseSnap.exists()) {
                        transaction.update(courseRef, {
                            students: increment(1)
                        });
                    }
                }

                // 4. Create student document
                transaction.set(studentRef, {
                    ...studentData,
                    dni: normalizedDni, // Ensure normalized DNI is saved
                    registeredAt: serverTimestamp(),
                    status: studentData.status || 'registered',
                    isAffiliated: studentData.isAffiliated || false
                });

                return { id: studentRef.id, ...studentData, dni: normalizedDni };
            });
        } catch (error) {
            console.error("Error registering student in transaction:", error);
            throw error;
        }
    },

    /**
     * Obtener estudiantes filtrados por curso
     */
    async getStudentsByCourse(courseId) {
        if (!courseId) return [];
        try {
            // Optimització: Evitem orderBy de Firestore per problemes d'índexs
            const q = query(
                collection(db, COLLECTION_NAME),
                where("courseId", "==", courseId)
            );
            const querySnapshot = await getDocs(q);
            const students = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordenar en memòria
            return students.sort((a, b) => {
                const dateA = a.registeredAt?.toDate?.() || new Date(0);
                const dateB = b.registeredAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
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

        // Optimització: Eliminem orderBy de la query per no dependre d'índexs compostos i ordenem en memòria
        const q = query(
            collection(db, COLLECTION_NAME),
            where("courseId", "==", courseId)
        );

        return onSnapshot(q, (snapshot) => {
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordenar en memòria (més segur sense índexs)
            students.sort((a, b) => {
                const dateA = a.registeredAt?.toDate?.() || new Date(0);
                const dateB = b.registeredAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });

            callback(students);
        }, (error) => {
            console.error("Error subscribing to students:", error);
        });

    },

    /**
     * Set certificate generated flag
     */
    async setCertificateGenerated(studentId) {
        try {
            const studentRef = doc(db, COLLECTION_NAME, studentId);
            await updateDoc(studentRef, {
                certificateGenerated: true,
                certificateGeneratedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error setting certificate generated:", error);
            throw error;
        }
    },

    /**
     * Log certificate generation event
     */
    async logCertificate(logData) {
        try {
            await addDoc(collection(db, 'certificateLogs'), {
                ...logData,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error logging certificate:", error);
            // Don't throw, logging failure shouldn't block user flow
        }
    },

    /**
     * Get certificate logs
     */
    async getCertificateLogs(limitCount = 50) {
        try {
            const q = query(
                collection(db, 'certificateLogs'),
                orderBy('createdAt', 'desc')
            );
            // Limit is tricky with recent firebase SDKs sometimes, but let's try basic query
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).slice(0, limitCount);
        } catch (error) {
            console.error("Error getting certificate logs:", error);
            return [];
        }
    },

    /**
     * MIGRATION TOOL: Update all 'registered' students to 'Inscrit'
     */
    async migrateOldStudentsToInscrit() {
        try {
            const q = query(collection(db, COLLECTION_NAME), where("status", "==", "registered"));
            const snapshot = await getDocs(q);

            const updatePromises = snapshot.docs.map(docSnap =>
                updateDoc(doc(db, COLLECTION_NAME, docSnap.id), { status: 'Inscrit' })
            );

            await Promise.all(updatePromises);
            return snapshot.size;
        } catch (error) {
            console.error("Migration error:", error);
            throw error;
        }
    },

    /**
     * PORTAL: Get all enrollments for a student by identity (DNI + Email)
     */
    async getStudentEnrollments(dni, email) {
        try {
            const normalizedDni = dni.trim().toUpperCase();
            const normalizedEmail = email.trim().toLowerCase();

            // We search for the identity across all enrollments
            const q = query(
                collection(db, COLLECTION_NAME),
                where("dni", "==", normalizedDni),
                where("email", "==", normalizedEmail)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
        } catch (error) {
            console.error("Error getting student enrollments:", error);
            throw new Error("No s'han pogut verificar les teves dades.");
        }
    },

    /**
     * STORAGE: Upload certificate PDF and update Firestore record
     */
    async uploadCertificate(studentId, courseId, pdfBlob) {
        try {
            const storagePath = `certificates/${studentId}_${courseId}.pdf`;
            const storageRef = ref(storage, storagePath);

            // Upload
            await uploadBytes(storageRef, pdfBlob);

            // Get public URL
            const downloadUrl = await getDownloadURL(storageRef);

            // Update Firestore
            const studentRef = doc(db, COLLECTION_NAME, studentId);
            await updateDoc(studentRef, {
                certificateUrl: downloadUrl,
                certificateGenerated: true,
                certificateGeneratedAt: serverTimestamp()
            });

            return downloadUrl;
        } catch (error) {
            console.error("Error uploading certificate:", error);
            throw new Error("Error en desar el certificat al núvol.");
        }
    }
};
