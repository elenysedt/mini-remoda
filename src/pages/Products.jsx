import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const productsRef = collection(db, "ropabebe");
                const querySnapshot = await getDocs(productsRef);

                if (!querySnapshot || querySnapshot.empty) {
                    throw new Error("No se encontraron productos en la base de datos.");
                }

                const productItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productItems);
            } catch (error) {
                console.error("Error al recuperar productos desde Firebase:", error);
                setError("Hubo un problema al cargar los productos. Intenta más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [addToCart]); // 🔹 Ahora se actualiza cuando cambia el carrito

    // ✅ Filtrar productos según el término de búsqueda
    const filteredProducts = searchTerm
        ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : products;

    if (loading) return <p className="loading">Cargando productos...</p>;
    if (error) return (
        <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
    );

    return (
        <div className="product-container">
            <h2>Productos disponibles</h2>
            
            {/* 🔍 Campo de búsqueda */}
            <input
                type="text"
                placeholder="Buscar producto..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="product-grid">
                {filteredProducts.map((p) => (
                    <div className="product-card" key={p.id}>
                        <img src={p.image} alt={p.name} className="product-image" />
                        <h3>{p.name}</h3>
                        <p>Precio: ${p.price} ARS</p>
                        <p>Talla: {p.size}</p>
                        <Link to={`/products/${p.id}`}>
                            <button className="details-btn">Ver detalles</button>
                        </Link>
                        {p.stock > 0 ? (
                            <button className="add-to-cart-btn" onClick={() => addToCart(p)}>Agregar al carrito</button>
                        ) : (
                            <button className="out-of-stock-btn" disabled>❌ Sin stock</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
