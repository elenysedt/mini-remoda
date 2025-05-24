import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import "./Cart.css";

const Cart = ({ removeFromCart, updateQuantity, cart, setCart }) => {

    const [loading, setLoading] = useState(true);
    console.log("setCart en Cart.jsx:", setCart);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "cart"));
                const cartItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 🔄 Filtrar productos duplicados e inválidos
                const validItems = cartItems.filter((item, index, self) =>
                    item.name && item.price &&
                    index === self.findIndex(p => p.id === item.id)
                );

                setCart(validItems); // 🔄 Guardar el carrito en el estado
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar carrito desde Firebase:", error);
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    if (loading) return <p>Cargando carrito...</p>;

    // ✅ Calcular total de compra
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // ✅ Función para vaciar carrito
    const clearCart = async () => {
        try {
            const cartRef = collection(db, "cart");
            const querySnapshot = await getDocs(cartRef);

            for (const docSnap of querySnapshot.docs) {
                const item = docSnap.data();
                if (!item) continue; // 🔄 Evitar errores si el documento está vacío

                // 🔄 Restaurar stock en Firebase antes de eliminar el producto del carrito
                const productRef = doc(db, "ropabebe", item.id);
                const productSnapshot = await getDoc(productRef);

                if (productSnapshot.exists()) {
                    const currentStock = productSnapshot.data().stock || 0;
                    const updatedStock = currentStock + item.quantity; // 🔄 Devolver cantidad al stock
                    await updateDoc(productRef, { stock: updatedStock });
                }

                // 🔄 Eliminar el producto del carrito
                await deleteDoc(doc(db, "cart", docSnap.id));
            }

            setCart([]); // 🔄 Vaciar el estado del carrito
        } catch (error) {
            console.error("Error al vaciar el carrito y actualizar el stock:", error);
        }
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
                                <p><strong>Estado:</strong> {item.condition}</p>
                                <p><strong>Talla:</strong> {item.size}</p>
                                <p><strong>Marca:</strong> {item.brand}</p>
                                <p><strong>Cantidad:</strong> {item.quantity}</p>
                                <button onClick={() => updateQuantity(item.id, -1)}>➖</button>
                                <button onClick={() => updateQuantity(item.id, 1)}>➕</button>
                                <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}

                    {/* 🔄 Mostrar total y botón para vaciar carrito */}
                    <h3>Total: ${totalPrice.toFixed(2)} ARS</h3>
                    <button onClick={clearCart} style={{ backgroundColor: "#FDDDE6", padding: "10px", borderRadius: "5px" }}>
                        🗑️ Vaciar Carrito
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;