import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/estaticos/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, setDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react"; // 🔄 Importamos useEffect


const App = () => {
    const [cart, setCart] = useState([]); // 🛒 Estado del carrito
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "cart"));
                const cartItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log("Carrito recuperado desde Firebase:", cartItems); // 🔄 Verificación en consola

                setCart(cartItems); // 📌 Actualizar el estado con los productos obtenidos
            } catch (error) {
                console.error("Error al recuperar carrito desde Firebase:", error);
            }
        };

        fetchCart();
    }, []);


    // 📌 Agregar productos al carrito
    const addToCart = async (product) => {
        try {
            const productRef = doc(db, "ropabebe", product.id);
            const productSnapshot = await getDoc(productRef);
            const currentStock = productSnapshot.exists() ? productSnapshot.data().stock : 0;

            const exists = cart.find(item => item.id === product.id);

            console.log(`Intentando agregar: ${product.name}`);
            console.log(`Stock disponible en Firebase: ${currentStock}`);
            console.log(`Cantidad actual en carrito: ${exists ? exists.quantity : 0}`);

            if (exists) {
                const confirmAdd = confirm(`Ya tienes "${product.name}" en tu carrito. ¿Quieres agregar más unidades?`);

                if (confirmAdd) {
                    if (exists.quantity <= currentStock) { // 🔄 Ahora permite agregar el último producto disponible
                        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));

                        await updateDoc(doc(db, "cart", product.id), { quantity: exists.quantity + 1 });
                        await updateDoc(productRef, { stock: currentStock - 1 });

                        alert(`Agregaste otra unidad de "${product.name}" al carrito.`);
                    } else {
                        alert("¡No hay más unidades disponibles de " + product.name + "!");
                    }
                }
            } else {
                if (currentStock > 0) {  // 🔄 Ahora permitimos agregar el último producto disponible
                    const newCartItem = {
                        id: product.id, name: product.name, price: product.price, quantity: 1,
                        image: product.image, brand: product.brand, size: product.size
                    };

                    setCart([...cart, newCartItem]);

                    await setDoc(doc(db, "cart", product.id), newCartItem);
                    await updateDoc(productRef, { stock: currentStock - 1 });

                    // 🔄 Verificar que el stock en Firebase se actualizó correctamente
                    const updatedProductSnapshot = await getDoc(productRef);
                    const updatedStock = updatedProductSnapshot.exists() ? updatedProductSnapshot.data().stock : 0;

                    console.log(`Stock actualizado después de agregar: ${updatedStock}`); // 📌 Verificación en consola

                    alert(`"${product.name}" ha sido agregado al carrito.`);
                } else {
                    alert("¡Este producto está agotado!");
                }
            }
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };




    const updateQuantity = async (productId, amount) => {
        try {
            const itemRef = doc(db, "cart", productId);
            const itemSnapshot = await getDoc(itemRef);

            if (!itemSnapshot.exists()) {
                console.error("Producto no encontrado en el carrito");
                return;
            }

            const item = itemSnapshot.data();
            const newQuantity = item.quantity + amount;

            // 🔄 Consultar el stock actualizado antes de aumentar cantidad
            const productRef = doc(db, "ropabebe", productId);
            const productSnapshot = await getDoc(productRef);
            const currentStock = productSnapshot.exists() ? productSnapshot.data().stock : 0;

            console.log(`Intentando actualizar cantidad de: ${productId}`);
            console.log(`Stock disponible antes de actualizar: ${currentStock}`);
            console.log(`Nueva cantidad calculada: ${newQuantity}`);

            console.log(`Stock disponible en Firebase antes de actualizar: ${currentStock}`); // 📌 Verificación en consola

            if (newQuantity >= 1 && newQuantity <= currentStock + 1) { // 🔄 Permitir la última unidad
                await updateDoc(itemRef, { quantity: newQuantity });
                await updateDoc(productRef, { stock: currentStock - amount });

                // 🔄 Recuperar el carrito actualizado desde Firebase
                const updatedCartSnapshot = await getDocs(collection(db, "cart"));
                const updatedCart = updatedCartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setCart(updatedCart); // 📌 Ahora el estado `cart` reflejará los cambios de Firebase.
            } else {
                alert("No puedes agregar más unidades o bajar de 1.");
            }
        } catch (error) {
            console.error("Error al actualizar cantidad en el carrito:", error);
        }
    };



    const removeFromCart = async (productId) => {
        try {
            // 📌 Buscar el producto en el carrito antes de eliminarlo
            const itemToRemove = cart.find(item => item.id === productId);

            if (!itemToRemove) {
                console.error("Producto no encontrado en el carrito");
                return;
            }

            // 🔄 Eliminar el producto de Firestore
            await deleteDoc(doc(db, "cart", productId));

            // 🔄 Restaurar stock en `ropabebe`, asegurando que **no pase del stock original**
            const productRef = doc(db, "ropabebe", productId);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                const originalStock = productSnapshot.data().stock; // 🔄 Obtener el stock actual

                const newStock = Math.min(originalStock + itemToRemove.quantity, 2); // 🔄 Evitar que sobrepase 2
                await updateDoc(productRef, { stock: newStock });
            }

            // 🔄 Actualizar el estado del carrito
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
        }
    };
    return (
        <Router>
            <Navbar />
            <main style={{ backgroundColor: "#FDDDE6", minHeight: "100vh", padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products addToCart={addToCart} />} />
                    <Route path="/cart" element={<Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );

};

export default App;
