import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const user = null; // Cambia esto por tu método de autenticación
    const isAdmin = user && user.role === "admin"; 

    return (
        <nav>
            <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Inicio</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Productos</NavLink></li>
                <li><NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>Carrito</NavLink></li>
                {isAdmin && <li><NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Admin</NavLink></li>}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}  // 🔹 Se actualiza con el estado global
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            </ul>
        </nav>
    );
};

export default Navbar;
