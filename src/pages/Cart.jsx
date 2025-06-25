import React from "react";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const generarMensajeWhatsApp = () => {
        if (cart.length === 0) return "";

        const mensaje = cart.map(
            (item) => `🧸 ${item.name} - ${item.quantity}u x $${item.price}`
        ).join("\n");

        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

        return `¡Hola! Quiero confirmar mi pedido:\n\n${mensaje}\n\nTotal: $${total}`;
    };

    return (
        <div>
            <h2>Carrito de Compras</h2>

            {cart.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="cart-item">
                            <img src={item.image} alt={item.name} width="100" />
                            <div>
                                <h3>{item.name} - ${item.price * item.quantity}</h3>
                                <p><strong>Talla:</strong> {item.size}</p>
                                <p><strong>Cantidad:</strong> {item.quantity}</p>
                                <div className="cart-actions">
                                    <button onClick={() => updateQuantity(item.id, -1)}>➖</button>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        disabled={item.quantity >= item.stock}
                                    >
                                        ➕
                                    </button>
                                    <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <h3>Total: ${totalPrice.toFixed(2)} ARS</h3>
                    <button
                        onClick={clearCart}
                        style={{ backgroundColor: "#f090e6", padding: "10px", borderRadius: "5px" }}
                    >
                        🗑️ Vaciar Carrito
                    </button>
                    {cart.length > 0 && (
                        <a
                            href={`https://wa.me/5491124019414?text=${encodeURIComponent(generarMensajeWhatsApp())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whatsapp-button"
                        >
                            🟢 Finalizar compra por WhatsApp
                        </a>
                    )}

                </>
            )}
        </div>
    );
};

export default Cart;
