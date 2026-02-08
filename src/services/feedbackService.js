import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp,
    orderBy,
    limit
} from 'firebase/firestore';

const COLLECTION_NAME = 'feedbacks';

export const feedbackService = {
    /**
     * Submit a new feedback (session or course)
     */
    async submitFeedback(feedbackData) {
        try {
            // feedbackData should contain:
            // courseId, sessionId (optional), rating (1-5), comment, type ('session'|'course')
            // studentId (optional, if authenticated, but usually anonymous or linked via token)

            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...feedbackData,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error submitting feedback:", error);
            throw new Error("No s'ha pogut enviar la valoració.");
        }
    },

    /**
     * Get average rating for a course (combining session and course feedback)
     */
    async getCourseRatingStats(courseId) {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("courseId", "==", courseId)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

            let total = 0;
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.rating >= 1 && data.rating <= 5) {
                    total += data.rating;
                    distribution[data.rating] = (distribution[data.rating] || 0) + 1;
                }
            });

            return {
                average: (total / snapshot.size).toFixed(1),
                count: snapshot.size,
                distribution
            };
        } catch (error) {
            console.error("Error getting course stats:", error);
            return { average: 0, count: 0 };
        }
    },

    /**
     * Get global average rating across all courses
     */
    async getGlobalRatingStats() {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_NAME));

            if (snapshot.empty) return { average: 0, count: 0 };

            let total = 0;
            let validCount = 0;

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.rating >= 1 && data.rating <= 5) {
                    total += data.rating;
                    validCount++;
                }
            });

            return {
                average: validCount > 0 ? (total / validCount).toFixed(1) : 0,
                count: validCount
            };
        } catch (error) {
            console.error("Error getting global stats:", error);
            return { average: 0, count: 0 };
        }
    }
};
