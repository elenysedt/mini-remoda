import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // 🔹 Agregamos `useNavigate`

const Login = () => {
    const { login, isAdmin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // 🔹 Inicializamos `navigate`

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);

        if (isAdmin) {
            navigate("/admin"); // 🔹 Redirigir al panel de administración si es admin
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
