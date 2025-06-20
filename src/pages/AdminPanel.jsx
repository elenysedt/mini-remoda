import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import ProductForm from "../components/ProductForm";
import "./AdminPanel.css";

const AdminPanel = () => {
    const [selectedOption, setSelectedOption] = useState("home");
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "ropabebe"));
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (formData) => {
        try {
            const baseURL = "https://raw.githubusercontent.com/elenysedt/mini-remoda/master/public/images/";
            const newProduct = { ...formData, image: `${baseURL}${formData.image}` };
            await addDoc(collection(db, "ropabebe"), newProduct);
            await fetchProducts();
            setSelectedOption("list");
        } catch (e) {
            alert("Error al agregar producto.");
            console.error(e);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const docRef = doc(db, "ropabebe", editingProduct.id);
            await updateDoc(docRef, formData);
            await fetchProducts();
            setEditingProduct(null);
            setSelectedOption("list");
        } catch (e) {
            alert("Error al actualizar.");
            console.error(e);
        }
    };

    const handleDelete = async (productId) => {
        const confirm = window.confirm("¿Eliminar este producto?");
        if (!confirm) return;
        await deleteDoc(doc(db, "ropabebe", productId));
        await fetchProducts();
    };

    const renderContent = () => {
        if (selectedOption === "add") {
            return (
                <>
                    <h2>Agregar nuevo producto</h2>
                    <ProductForm onSubmit={handleCreate} />
                </>
            );
        }

        if (selectedOption === "edit" && editingProduct) {
            return (
                <>
                    <h2>Editar producto</h2>
                    <ProductForm onSubmit={handleUpdate} initialData={editingProduct} />
                </>
            );
        }

        if (selectedOption === "list") {
            return (
                <>
                    <h2>Lista de productos</h2>
                    <div className="product-grid-admin">
                        {products.map((p) => (
                            <div key={p.id} className="admin-card">
                                <div className="admin-card-content">
                                    <img src={p.image} alt={p.name} className="admin-thumbnail" />
                                    <div className="admin-info">
                                        <p><strong>{p.name}</strong></p>
                                        <p>Precio: ${p.price}</p>
                                        <p>Stock: {p.stock}</p>
                                        <div className="admin-buttons">
                                            <button onClick={() => {
                                                setEditingProduct(p);
                                                setSelectedOption("edit");
                                            }}>✏️ Editar</button>

                                            <button onClick={() => handleDelete(p.id)}>🗑️ Eliminar</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </>
            );
        }

        return <p>Bienvenida al panel de administración, El3nys 🧸. Elegí una opción del menú.</p>;
    };

    return (
        <div className="admin-panel">
            <nav className="admin-menu">
                <button onClick={() => setSelectedOption("add")}>➕ Agregar producto</button>
                <button onClick={() => setSelectedOption("list")}>📦 Ver lista</button>
            </nav>

            <section className="admin-content">
                {renderContent()}
            </section>
        </div>
    );
};

export default AdminPanel;
