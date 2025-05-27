import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AdminPanel = () => {
    const [newProduct, setNewProduct] = useState({
        name: "", price: "", brand: "", category: "", condition: "",
        size: "", color: "", stock: "", image: "",
    });

    const colorOptions = ["Rojo", "Azul", "Verde", "Amarillo", "Negro", "Blanco", "Rosa", "Celeste"];
    const baseImageURL = "https://raw.githubusercontent.com/elenysedt/mini-remoda/master/public/images/";

    const handleAddProduct = async () => {
        const { name, price, stock, brand, category, condition, size, color, image } = newProduct;

        if (!name || !price || !stock || !brand || !category || !condition || !size || !color || !image) {
            alert("Completa todos los datos correctamente.");
            return;
        }

        try {
            await addDoc(collection(db, "ropabebe"), { ...newProduct, image: `${baseImageURL}${image}` });
            alert("Producto agregado correctamente!");
            setNewProduct({ name: "", price: "", brand: "", category: "", condition: "", size: "", color: "", stock: "", image: "" }); // ✅ Limpiar formulario después de guardar
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    return (
        <div>
            <h2>Panel de Administración</h2>
            <input type="text" placeholder="Nombre" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input type="text" placeholder="Precio" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <input type="text" placeholder="Marca" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
            <input type="text" placeholder="Categoría" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
            <input type="text" placeholder="Estado (Nuevo/Usado)" value={newProduct.condition} onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value })} />
            <input type="text" placeholder="Talla" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />

            {/* ✅ Selección de color con dropdown */}
            <select value={newProduct.color} onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}>
                <option value="">Selecciona un color</option>
                {colorOptions.map((color, index) => (
                    <option key={index} value={color}>{color}</option>
                ))}
            </select>

            <input type="text" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />

            {/* ✅ Nombre de imagen sin URL completa */}
            <input type="text" placeholder="Nombre de imagen (ej. producto.jpg)" value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />

            <button onClick={handleAddProduct}>Agregar Producto</button>
        </div>
    );
};

export default AdminPanel;
