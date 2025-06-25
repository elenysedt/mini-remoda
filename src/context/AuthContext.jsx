import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // 🔑 Login
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userRef = doc(db, "users", userCredential.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data()?.role?.toLowerCase() === "admin") {
                const userData = {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    role: "admin"
                };
                localStorage.setItem("admin", JSON.stringify(userData));
                setUser(userCredential.user);
                setIsAdmin(true);
                toast.success("✅ Bienvenida, administradora 👩‍💼");
                return true;
            } else {
                toast.error("❌ No tienes permisos de administrador.");
                await signOut(auth);
                return false;
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
            return false;
        }
    };

    // 🔒 Logout
    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("admin");
        toast.info("Sesión cerrada.");
    };

    // 🧠 Cargar sesión si está guardada
    useEffect(() => {
        const stored = localStorage.getItem("admin");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser({ uid: parsed.uid, email: parsed.email });
            setIsAdmin(parsed.role === "admin");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
