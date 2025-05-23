import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { useState } from "react"; // 🔄 Importamos useState

const App = () => {
  const [cart, setCart] = useState([]); // 🛒 Estado del carrito

  // 📌 Agregar productos al carrito
const addToCart = (product) => {
  const exists = cart.find(item => item.id === product.id);

  if (exists) {
    if (exists.quantity < product.stock) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      alert("¡No hay más unidades disponibles de " + product.name + "!");
    }
  } else {
    if (product.stock > 0) {
      setCart([...cart, { ...product, quantity: 1 }]); // 🔄 Agrega el producto si hay stock

      // 📌 Aquí reducimos el stock en `products`
      setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
    } else {
      alert("¡Este producto está agotado!");
    }
  }
};

  // 🔄 Actualizar cantidad de productos en el carrito
const updateQuantity = (productId, amount) => {
  setCart(cart.map(item => {
    if (item.id === productId) {
      const newQuantity = item.quantity + amount;

      // 📌 Validamos stock al aumentar
      if (amount > 0 && newQuantity > item.stock) {
        alert("¡No puedes agregar más unidades de " + item.name + "! Stock máximo alcanzado.");
        return item;
      }

      // 📌 Restauramos stock al disminuir cantidad
      if (amount < 0) {
        setProducts(products.map(p => p.id === productId ? { ...p, stock: p.stock + 1 } : p));
      }

      return { ...item, quantity: Math.max(1, newQuantity) };
    }
    return item;
  }));
};

const removeFromCart = (productId) => {
  const itemToRemove = cart.find(item => item.id === productId);

  if (itemToRemove) {
    setCart(cart.filter(item => item.id !== productId));

    // 📌 Restauramos el stock cuando el producto es eliminado
    setProducts(products.map(p => p.id === productId ? { ...p, stock: p.stock + itemToRemove.quantity } : p));
  }
};


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
      </Routes>
    </Router>
  );
};

export default App;
