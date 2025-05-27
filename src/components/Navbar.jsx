import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    // 🔹 Usa una lógica real para obtener el usuario autenticado
    const user = null; // Cambia esto por tu método de autenticación
    const isAdmin = user && user.role === "admin"; // 🔹 Ajusta según tu lógica

    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/products">Productos</Link></li>
                <li><Link to="/cart">Carrito</Link></li>
                {isAdmin && <li><Link to="/admin">Admin</Link></li>} {/* 🔹 Solo visible si es admin */}
            </ul>
        </nav>
    );
};

export default Navbar;
