import React, { useState } from "react";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <Router>
            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route path="/products" element={<Products searchTerm={searchTerm} />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </main>
            <ToastContainer position="top-right" autoClose={2500} />
            <Footer />
        </Router>
    );
};

export default App;
