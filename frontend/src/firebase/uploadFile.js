import api from '../utils/api';

/**
 * uploadFile(file, folder, onProgress?)
 *
 * Uploads a File object to Cloudinary via the backend /api/upload endpoint.
 * Backend signs the upload — no Cloudinary credentials exposed to browser.
 *
 * @param {File}     file        - The File object from <input type="file">
 * @param {string}   folder      - Cloudinary folder hint, e.g. "kyc" or "proofs"
 * @param {Function} onProgress  - Optional callback receiving 0-100 number
 * @returns {Promise<string>}    - Resolves with the Cloudinary secure URL
 */
export async function uploadFile(file, folder = 'uploads', onProgress) {
    const form = new FormData();
    form.append('file', file);

    // Extract folder from path-style strings like "kyc/worker_abc_front.jpg"
    const folderHint = folder.includes('/') ? folder.split('/')[0] : folder;
    form.append('folder', folderHint);

    const { data } = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        },
    });

    return data.url;
}
