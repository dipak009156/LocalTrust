import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * @param {File} file - The file to upload
 * @param {string} path - The path in storage (e.g. 'selfies/uid.jpg')
 * @returns {Promise<string>} - The public download URL
 */
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Storage upload error:', error);
        throw error;
    }
};
