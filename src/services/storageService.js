import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';

export const storageService = {
    /**
     * Upload a File or Blob to Firebase Storage
     * @param {File|Blob} file - The file to upload
     * @param {string} path - The path in storage (e.g., 'courses/image.jpg')
     * @returns {Promise<string>} - Download URL
     */
    async uploadFile(file, path) {
        if (!file) return null;
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },

    /**
     * Upload a Base64 Data URL to Firebase Storage
     * @param {string} base64String - The data URL string
     * @param {string} path - The path in storage
     * @returns {Promise<string>} - Download URL
     */
    async uploadBase64(base64String, path) {
        if (!base64String || !base64String.startsWith('data:')) return null;
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadString(storageRef, base64String, 'data_url');
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading base64:", error);
            throw error;
        }
    }
};
