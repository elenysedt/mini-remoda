import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import ProductForm from "../components/ProductForm";
import "./AdminPanel.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";

const AdminPanel = () => {
    const [selectedOption, setSelectedOption] = useState("home");
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "ropabebe"));
        const fetched = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(fetched);
    };

    const uploadToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`
            , {
                method: "POST",
                body: formData,
            });

        const data = await response.json();
        return data.data.url;
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
            const user = getAuth().currentUser;
            if (!user) {
                toast.error("⚠️ Debes iniciar sesión para subir una imagen.");
                return;
            }

            let imageUrl = "";
            if (imageOption === "local" && imageFile) {
                imageUrl = await uploadToImgBB(imageFile);
                console.log("Imagen subida a ImgBB:", imageUrl);
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

    const handleDelete = (productId) => {
        setProductToDelete(productId);
        setShowConfirm(true);
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

                {showConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>¿Estás segura de que querés eliminar este producto?</p>
                            <div className="modal-buttons">
                                <button
                                    className="delete-button"
                                    onClick={async () => {
                                        await deleteDoc(doc(db, "ropabebe", productToDelete));
                                        await fetchProducts();
                                        toast.success("Producto eliminado 🗑️");
                                        setShowConfirm(false);
                                        setProductToDelete(null);
                                    }}
                                >
                                    Sí, eliminar
                                </button>
                                <button onClick={() => setShowConfirm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminPanel;
