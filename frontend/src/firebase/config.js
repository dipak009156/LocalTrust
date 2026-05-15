import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Only RTDB is needed — Auth and Storage are replaced by JWT + Cloudinary
const firebaseConfig = {
    apiKey:      import.meta.env.VITE_FIREBASE_API_KEY,
    projectId:   import.meta.env.VITE_FIREBASE_PROJECT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);   // Realtime Database — live GPS tracking only