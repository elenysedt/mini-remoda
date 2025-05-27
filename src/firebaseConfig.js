import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🔹 Importa Firebase Authentication

const firebaseConfig = {
    apiKey: "AIzaSyDTjdYbTR0Dva5u7De4MoluFmIvitRavzQ", // 🔹 Asegúrate de agregar esto desde Firebase Console
    authDomain: "mini-remoda.firebaseapp.com",
    projectId: "mini-remoda",
    storageBucket: "mini-remoda.appspot.com",
    messagingSenderId: "TU_SENDER_ID", 
    appId: "972966373383"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // 🔹 Inicializa autenticación

export { db, auth, collection, getDocs }; // 🔹 Ahora `auth` está disponible
