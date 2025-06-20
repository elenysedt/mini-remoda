/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/estaticos/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { db } from "./firebaseConfig";
import { collection, getDocs, setDoc, updateDoc, doc, deleteDoc, getDoc, writeBatch } from "firebase/firestore";
import { useState, useEffect } from "react";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";

const App = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "cart"));
                const cartItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
                console.log("Productos en carrito:", cartItems); 
                setCart(cartItems);
            } catch (error) {
                console.error("Error al recuperar carrito desde Firebase:", error);
            }
        };

        fetchCart();
    }, []);

    // ✅ Agregar productos al carrito con validación de stock (corrigiendo orden de actualización)

    const addToCart = async (product) => {
        try {
            const cartRef = doc(db, "cart", product.id);
            const productRef = doc(db, "ropabebe", product.id);
            const productSnapshot = await getDoc(productRef);

            let currentStock = productSnapshot.exists() ? productSnapshot.data().stock : 0;

            console.log('Stock disponible:', currentStock);

            if (currentStock <= 0) {
                alert("❌ Este producto está agotado. No puedes agregar más.");
                return;
            }

            const exists = cart.find(item => item.id === product.id);
            let newQuantity = exists ? exists.quantity + 1 : 1;



            if (exists) {
                const confirmAdd = window.confirm(`Actualmente tienes ${exists.quantity} unidades de "${product.name}". ¿Quieres agregar otra unidad?`);
                if (!confirmAdd) return;

                await updateDoc(cartRef, { quantity: newQuantity });
                setCart(prevCart => prevCart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item));
            } else {
                const newCartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    size: product.size ? product.size : "No especificada",
                    brand: product.brand ? product.brand : "No especificada",
                    condition: product.condition ? product.condition : "No especificada"
                };
                await setDoc(cartRef, newCartItem);
                setCart(prevCart => [...prevCart, newCartItem]);
            }

            await updateDoc(productRef, { stock: currentStock - 1 });

            alert(`✅ Ahora tienes ${newQuantity} unidades de "${product.name}".`);
            console.log(`Stock actualizado después de agregar: ${currentStock - 1}`);

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };

    // ✅ Actualizar cantidad en el carrito respetando el stock en Firebase
    const updateQuantity = async (productId, amount) => {
        try {
            const itemRef = doc(db, "cart", productId);
            const productRef = doc(db, "ropabebe", productId);

            const [itemSnapshot, productSnapshot] = await Promise.all([
                getDoc(itemRef),
                getDoc(productRef)
            ]);

            if (!itemSnapshot.exists() || !productSnapshot.exists()) return;

            const item = itemSnapshot.data();
            let currentStock = productSnapshot.data().stock;
            const newQuantity = item.quantity + amount;


            if (amount == 1) {
                if (currentStock <= 0) {
                    alert("❌ Este producto está agotado. No puedes agregar más.");
                    return;
                }
            }


            if (newQuantity < 1) {
                alert("❌ No puedes reducir la cantidad por debajo de 1.");
                return;
            }



            await updateDoc(itemRef, { quantity: newQuantity });
            setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));

            await updateDoc(productRef, { stock: currentStock - amount });
            alert(`✅ Ahora tienes ${newQuantity} unidades de "${item.name}" en tu carrito.`);
        } catch (error) {
            console.error("Error al actualizar cantidad en el carrito:", error);
        }
    };
const removeFromCart = async (id) => {
    try {
        const cartRef = doc(db, "cart", id);
        const itemSnapshot = await getDoc(cartRef);

        if (!itemSnapshot.exists()) {
            console.error("❌ El producto no está en el carrito.");
            return;
        }

        const item = itemSnapshot.data();
        const productRef = doc(db, "ropabebe", id);
        const productSnapshot = await getDoc(productRef);
        let currentStock = productSnapshot.exists() ? productSnapshot.data().stock : 0;

        console.log(`🔄 Restaurando stock de "${item.name}": ${currentStock} + ${item.quantity}`);

        await updateDoc(productRef, { stock: currentStock + item.quantity }); // ✅ Restaurar stock
        await deleteDoc(cartRef); // ✅ Eliminar el producto del carrito

        setCart(prevCart => prevCart.filter(item => item.id !== id));
        alert(`✅ Se eliminó "${item.name}" y el stock fue restaurado.`);
    } catch (error) {
        console.error("Error al eliminar producto del carrito y restaurar stock:", error);
    }
};


    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:productId" element={<ProductDetail addToCart={addToCart} />} />
                    <Route path="/products" element={<Products addToCart={addToCart} />} />
                    <Route
                        path="/cart"
                        element={<Cart cart={cart} setCart={setCart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
                    />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/estaticos/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";

const App = () => {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
