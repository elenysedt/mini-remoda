import React from "react";
import "./Cart.css";

const Cart = ({ cart, removeFromCart, updateQuantity }) => {
    return (
        <div>
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                cart.map((item, index) => (
                    <div key={index} className="cart-item">
                        <img src={item.image} alt={item.name} width="100" />
                        <div>
                            <h3>{item.name} - ${item.price * item.quantity}</h3> {/* 📌 Multiplica por cantidad */}
                            <p><strong>Estado:</strong> {item.condition}</p>
                            <p><strong>Talla:</strong> {item.size}</p>
                            <p><strong>Marca:</strong> {item.brand}</p>
                            <p><strong>Cantidad:</strong> {item.quantity}</p>
                            <button onClick={() => {
                                if (item.quantity > 1) {
                                    updateQuantity(item.id, -1);
                                } else {
                                    alert("No puedes reducir más la cantidad.");
                                }
                            }}>➖</button>
                            {/* 🔽 Disminuir cantidad */}
                            <button onClick={() => {
                                if (item.quantity < item.stock) {
                                    updateQuantity(item.id, 1);
                                } else {
                                    alert("¡No puedes agregar más unidades de " + item.name + "! Stock máximo alcanzado.");
                                }
                            }}>➕</button>

                            <button onClick={() => removeFromCart(item.id)}>Eliminar</button> {/* 🗑️ Eliminar producto */}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;
