import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

const login = async (email, password) => {
    try {
        console.log("Intentando iniciar sesión con:", email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential.user);

        // 🔹 Verificar rol en Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data()?.role?.toLowerCase() === "admin") {
            setUser(userCredential.user);
            setIsAdmin(true);
            console.log("✅ Usuario tiene rol de administrador.");
        } else {
            console.log("❌ Usuario no es administrador.");
            alert("No tienes permisos de administrador.");
            await signOut(auth);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Credenciales incorrectas. Verifica tu email y contraseña.");
    }
};



    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
