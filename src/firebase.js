import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA0sdCwGdpDrUXOXll6u9C23Zbvt8sCkfw",
    authDomain: "ugt-enforma-crm-v1.firebaseapp.com",
    projectId: "ugt-enforma-crm-v1",
    storageBucket: "ugt-enforma-crm-v1.firebasestorage.app",
    messagingSenderId: "812783208445",
    appId: "1:812783208445:web:0efcff7900608a6870bb94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
