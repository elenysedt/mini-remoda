import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CarritoPreview.css";

const CarritoPreview = ({ onClose }) => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const goToCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <div className="dropdown-cart">
      {cart.length === 0 ? (
        <p className="empty-cart">No tenés productos en tu carrito.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="preview-item">
              <img src={item.image} alt={item.name} className="preview-img" />
              <div>
                <p className="preview-name">{item.name}</p>
                <p className="preview-qty">x{item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

      )}
      <button onClick={goToCart}>Ir al carrito</button>
    </div>
  );
};

export default CarritoPreview;
