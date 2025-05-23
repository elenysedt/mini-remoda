import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    authDomain: "mini-remoda.firebaseapp.com",
    projectId: "mini-remoda",
    storageBucket: "mini-remoda.appspot.com",
    messagingSenderId: "TU_SENDER_ID", // You'll replace this placeholder
    appId: "972966373383"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };
