import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; // 🔄 Importamos `doc` y `getDoc`

const Products = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsRef = collection(db, "ropabebe");
                const querySnapshot = await getDocs(productsRef);

                if (!querySnapshot || querySnapshot.empty) {
                    console.error("No se encontraron productos en Firebase.");
                    setProducts([]); // 🔄 Evita que la página quede cargando infinitamente
                    setLoading(false); // ✅ Asegurar que la página ya no quede en estado "cargando"
                    return;
                }

                const productItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productItems); // 📌 Guardar productos en el estado
                setLoading(false); // ✅ Asegurar que loading pase a `false` una vez cargados los productos

            } catch (error) {
                console.error("Error al recuperar productos desde Firebase:", error);
                setProducts([]); // 🔄 Evita que se quede cargando si hay un error
                setLoading(false); // ✅ Evita que loading quede en `true` tras un error
            }
        };
        fetchProducts();
    }, []);



    if (loading) return <p>Cargando productos...</p>;

    const checkStock = async (productId) => {
        const productRef = doc(db, "ropabebe", productId);
        const productSnapshot = await getDoc(productRef);
        return productSnapshot.exists() ? productSnapshot.data().stock : 0;
    };

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
                        <button onClick={async () => {
                            const stock = await checkStock(p.id);
                            if (stock > 0) {
                                addToCart(p);
                            } else {
                                alert("Este producto ya está agotado.");
                            }
                        }}>Agregar al carrito</button>
                    ) : (
                        <button disabled>❌ Sin stock</button>
                    )}

                </div>
            ))}
        </div>
    );
};

export default Products;
