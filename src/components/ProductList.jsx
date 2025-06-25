import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "ropabebe"));
                const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productList);
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p className="loading">Cargando productos...</p>;

    return (
        <div className="product-container">
            <h2>Productos disponibles</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <h3>{product.name}</h3>
                        <p>Precio: ${product.price} ARS</p>
                        <p>Talla: {product.size}</p>
                        {product.stock === 0 ? (
                            <p className="sin-stock">🚫 Sin stock</p>
                        ) : (
                            <p className="disponible">Stock: {product.stock}</p>
                        )}

                        <Link to={`/products/${product.id}`} className="details-btn">Ver detalles</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
