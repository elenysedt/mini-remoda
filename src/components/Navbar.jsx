import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../context/CartContext";
import CarritoPreview from "./CarritoPreview";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";


const Navbar = ({ searchTerm, setSearchTerm }) => {
    const [showCart, setShowCart] = useState(false);
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, isAdmin, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
        toast.info("Sesión cerrada. ¡Hasta pronto!");
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <ul className="nav-links">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Inicio</NavLink>
                    </li>
                    <li>
                        <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Productos</NavLink>
                    </li>
                    {isAdmin && (
                        <li>
                            <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Admin</NavLink>
                        </li>
                    )}
                </ul>

                <div className="search-cart-group">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (location.pathname !== "/products") {
                                    navigate("/products");
                                }
                            }}
                        />
                    </div>
                    <div className="cart-container">
                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowCart(prev => !prev);
                            }}
                        >
                            🛒 {cart.length > 0 && <span>({cart.length})</span>}
                        </NavLink>
                        {showCart && <CarritoPreview onClose={() => setShowCart(false)} />}
                    </div>
                </div>
                {isAdmin && user && (
                    <div className="admin-session">
                        <span>👩‍💻 {user.email}</span>
                        <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
                    </div>
                )}
            </div>
        </nav >
    );
};


export default Navbar;
