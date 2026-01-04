// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD47Wi-c8zW9QjmpEhDId_RXttdsXl5Sw8",
  authDomain: "comunimapp.firebaseapp.com",
  projectId: "comunimapp",
  storageBucket: "comunimapp.firebasestorage.app",
  messagingSenderId: "466853960692",
  appId: "1:466853960692:web:38e41fc499c40d770077a1",
  measurementId: "G-PYQ5CTH386"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;