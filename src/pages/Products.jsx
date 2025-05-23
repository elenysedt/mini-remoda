import React, { useState, useEffect } from "react";
import { db, collection, getDocs } from "../firebaseConfig";

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "ropabebe")); // 📌 Conectamos a Firestore
                const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsList);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div>
            <h2>Productos disponibles</h2>
            {products.map((p) => (
                <div className="product-card" key={p.id}>
                    <h3>{p.name} - ${p.price}</h3>
                    <p><strong>Marca:</strong> {p.brand}</p>
                    <p><strong>Categoría:</strong> {p.category}</p>
                    <p><strong>Estado:</strong> {p.condition}</p>
                    <p><strong>Talla:</strong> {p.size}</p>
                    <p><strong>Color:</strong> {p.color}</p>
                    <p><strong>Stock disponible:</strong> {p.stock}</p>
                    <img src={p.image} alt={p.name} width="100" />
                    {p.stock > 0 ? (
                        <button onClick={() => addToCart(p)}>Agregar al carrito</button>
                    ) : (
                        <button disabled>❌ Sin stock</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Products;
