import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "./ProductDetail.css"; // 🔹 Agregamos estilos

const ProductDetail = ({ addToCart }) => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "ropabebe", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("Producto no encontrado");
                }
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) return <p className="loading">Cargando producto...</p>;
    if (!product) return <p>Producto no encontrado.</p>;

    return (
        <div className="product-detail">
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} className="product-image" />
            <p>Precio: ${product.price} ARS</p>
            <p>Talla: {product.size}</p>
            <p>Color: {product.color}</p>
            <p>Descripción: {product.description}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Agregar al carrito</button>
        </div>
    );
};

export default ProductDetail;
