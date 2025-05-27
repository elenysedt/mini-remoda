import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    // 🔹 Usa una lógica real para obtener el usuario autenticado
    const user = null; // Cambia esto por tu método de autenticación
    const isAdmin = user && user.role === "admin"; // 🔹 Ajusta según tu lógica

    return (
        <nav>
            <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Inicio</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Productos</NavLink></li>
                <li><NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>Carrito</NavLink></li>
                {isAdmin && <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Admin</NavLink></li>}
            </ul>
        </nav>
    );
};

export default Navbar;
