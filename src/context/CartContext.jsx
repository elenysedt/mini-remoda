import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { writeBatch } from "firebase/firestore";

// Crear el contexto
const CartContext = createContext();

// Hook para acceder al contexto desde otros componentes
export const useCart = () => useContext(CartContext);

// Provider que envuelve la app
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const snapshot = await getDocs(collection(db, "cart"));
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCart(items);
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
            }
        };
        fetchCart();
    }, []);

    const addToCart = async (product) => {
        const cartRef = doc(db, "cart", product.id);
        const productRef = doc(db, "ropabebe", product.id);
        const productSnapshot = await getDoc(productRef);
        let currentStock = productSnapshot.data().stock;

        if (currentStock <= 0) return alert("Sin stock disponible");

        const exists = cart.find(item => item.id === product.id);
        let newQuantity = exists ? exists.quantity + 1 : 1;

        if (exists) {
            const confirm = window.confirm(`Ya tienes ${exists.quantity}. ¿Agregar otra unidad?`);
            if (!confirm) return;
            await updateDoc(cartRef, { quantity: newQuantity });
            setCart(prev => prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item));
        } else {
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                size: product.size || "No especificada",
                brand: product.brand || "No especificada",
                condition: product.condition || "No especificada",
                stock: product.stock
            };
            await setDoc(cartRef, newItem);
            setCart(prev => [...prev, newItem]);
        }

        await updateDoc(productRef, { stock: currentStock - 1 });
    };

    const updateQuantity = async (productId, amount) => {
        const itemRef = doc(db, "cart", productId);
        const productRef = doc(db, "ropabebe", productId);

        const [itemSnapshot, productSnapshot] = await Promise.all([
            getDoc(itemRef),
            getDoc(productRef)
        ]);

        if (!itemSnapshot.exists()) return;

        const item = itemSnapshot.data();
        const newQuantity = item.quantity + amount;
        const currentStock = productSnapshot.data().stock;

        if (amount === 1 && currentStock <= 0) return alert("No hay stock suficiente");
        if (newQuantity < 1) return alert("Cantidad mínima alcanzada");

        await updateDoc(itemRef, { quantity: newQuantity });
        await updateDoc(productRef, { stock: currentStock - amount });
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    };

    const removeFromCart = async (id) => {
        const cartRef = doc(db, "cart", id);
        const itemSnapshot = await getDoc(cartRef);
        if (!itemSnapshot.exists()) return;

        const item = itemSnapshot.data();
        const productRef = doc(db, "ropabebe", id);
        const productSnapshot = await getDoc(productRef);
        let currentStock = productSnapshot.data().stock;

        await updateDoc(productRef, { stock: currentStock + item.quantity });
        await deleteDoc(cartRef);
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = async () => {
        if (!window.confirm("¿Seguro que quieres vaciar el carrito? Esta acción no se puede deshacer.")) return;

        try {
            const cartRef = collection(db, "cart");
            const querySnapshot = await getDocs(cartRef);
            const batch = writeBatch(db);

            for (const docSnap of querySnapshot.docs) {
                const item = docSnap.data();
                if (!item || typeof item.quantity !== "number" || isNaN(item.quantity)) continue;

                const productRef = doc(db, "ropabebe", item.id);
                const productSnapshot = await getDoc(productRef);
                let currentStock = productSnapshot.exists() ? productSnapshot.data().stock : 0;

                if (typeof currentStock === "number" && !isNaN(currentStock)) {
                    batch.update(productRef, { stock: Math.max(0, currentStock + item.quantity) });
                }

                batch.delete(docSnap.ref);
            }

            await batch.commit();
            setCart([]);
            console.log("Carrito vaciado correctamente y stock restaurado.");
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
        }
    };


    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );

};

