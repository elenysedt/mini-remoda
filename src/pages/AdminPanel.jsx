import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import ProductForm from "../components/ProductForm";
import "./AdminPanel.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
    const [selectedOption, setSelectedOption] = useState("home");
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "ropabebe"));
        const fetched = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(fetched);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const alreadyWelcomed = sessionStorage.getItem("admin-welcome-shown");
        if (!alreadyWelcomed) {
            toast.success("Bienvenida al panel de administración 👩‍💻");
            sessionStorage.setItem("admin-welcome-shown", "true");
        }
    }, []);

    const handleCreate = async (formData, imageFile, imageOption) => {
        try {
            let imageUrl = "";
            if (imageOption === "local" && imageFile) {
                const storageRef = ref(storage, `productos/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            } else if (imageOption === "nombre") {
                const baseURL = "https://raw.githubusercontent.com/elenysedt/mini-remoda/master/public/images/";
                imageUrl = `${baseURL}${formData.image}`;
            }
            const newProduct = { ...formData, image: imageUrl };
            await addDoc(collection(db, "ropabebe"), newProduct);
            await fetchProducts();
            toast.success("Producto agregado correctamente 🎉");
            setSelectedOption("list");
        } catch (e) {
            toast.error("❌ Error al agregar producto");
            console.error(e);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const docRef = doc(db, "ropabebe", editingProduct.id);
            await updateDoc(docRef, formData);
            await fetchProducts();
            toast.success("Cambios guardados con éxito ✍️");
            setEditingProduct(null);
            setSelectedOption("list");
        } catch (e) {
            toast.error("❌ No se pudo actualizar el producto");
            console.error(e);
        }
    };

    const handleDelete = async (productId) => {
        const confirm = window.confirm("¿Eliminar este producto?");
        if (!confirm) return;
        await deleteDoc(doc(db, "ropabebe", productId));
        await fetchProducts();
        toast.success("Producto eliminado 🗑️");
    };

    const renderContent = () => {
        if (selectedOption === "add") {
            return (
                <>
                    <h2>Agregar nuevo producto</h2>
                    <ProductForm onSubmit={handleCreate} />
                    <div className="back-container">
                        <button className="menu-button back-button" onClick={() => setSelectedOption("home")}>
                            🔙 Volver al menú
                        </button>
                    </div>
                </>
            );
        }

        if (selectedOption === "edit" && editingProduct) {
            return (
                <>
                    <h2>Editar producto</h2>
                    <ProductForm onSubmit={handleUpdate} initialData={editingProduct} />
                    <div className="back-container">
                        <button className="menu-button back-button" onClick={() => setSelectedOption("home")}>
                            🔙 Volver al menú
                        </button>
                    </div>
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
                    <div className="back-container">
                        <button className="menu-button back-button" onClick={() => setSelectedOption("home")}>
                            🔙 Volver al menú
                        </button>
                    </div>
                </>
            );
        }

        return (
            <div className="admin-home-header">
                <p className="admin-welcome">Bienvenida al panel de administración, El3nys 🧸. Elegí una opción del menú:</p>
                <div className="admin-menu">
                    <button className="menu-button" onClick={() => setSelectedOption("add")}>➕ Agregar producto</button>
                    <button className="menu-button" onClick={() => setSelectedOption("list")}>📦 Ver lista</button>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-panel">
            <section className="admin-content">
                {renderContent()}
            </section>
        </div>
    );
};

export default AdminPanel;
