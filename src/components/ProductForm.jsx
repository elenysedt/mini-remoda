import React, { useState, useEffect } from "react";
import "./ProductForm.css";

const initialFormState = {
    name: "",
    price: "",
    brand: "",
    category: "",
    condition: "",
    size: "",
    color: "",
    stock: "",
    image: ""
};

const ProductForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || initialFormState);
    const [errors, setErrors] = useState({});
    const [imageOption, setImageOption] = useState("local"); // "local" o "nombre"
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const colorOptions = ["Rojo", "Azul", "Verde", "Amarillo", "Negro", "Blanco", "Rosa", "Celeste"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);


    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
        if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = "El stock debe ser mayor o igual a 0.";
        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0.";
        if (!formData.description || formData.description.length < 10) newErrors.description = "La descripción debe tener al menos 10 caracteres.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        if (onSubmit) onSubmit(formData, imageFile, imageOption);
        setFormData(initialFormState);
        setErrors({});
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}

            <input type="text" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} />
            {errors.price && <p className="form-error">{errors.price}</p>}
            <input
                type="number"
                name="stock"
                placeholder="Stock disponible"
                value={formData.stock}
                onChange={handleChange}
            />
            {errors.stock && <p className="form-error">{errors.stock}</p>}

            <input type="text" name="brand" placeholder="Marca" value={formData.brand} onChange={handleChange} />
            <input type="text" name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} />
            <input type="text" name="condition" placeholder="Condición" value={formData.condition} onChange={handleChange} />
            <input type="text" name="size" placeholder="Talla" value={formData.size} onChange={handleChange} />

            <select name="color" value={formData.color} onChange={handleChange}>
                <option value="">Selecciona un color</option>
                {colorOptions.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>

            <div className="image-source-toggle">
                <label>
                    <input
                        type="radio"
                        name="imageOption"
                        value="local"
                        checked={imageOption === "local"}
                        onChange={() => setImageOption("local")}
                    />
                    Subir desde mi compu
                </label>

                <label>
                    <input
                        type="radio"
                        name="imageOption"
                        value="nombre"
                        checked={imageOption === "nombre"}
                        onChange={() => setImageOption("nombre")}
                    />
                    Usar nombre de imagen existente
                </label>
            </div>

            {imageOption === "local" && (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    {imageFile && (
                        <div className="preview-container">
                            <p className="preview-label">Vista previa:</p>
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Vista previa"
                                className="preview-image"
                            />
                        </div>
                    )}
                </>
            )}

            {imageOption === "nombre" && (
                <input
                    type="text"
                    name="image"
                    placeholder="Ej. producto.jpg"
                    value={formData.image}
                    onChange={handleChange}
                />
            )}
            <textarea name="description" placeholder="Descripción" value={formData.description || ""} onChange={handleChange} />

            {errors.description && <p className="form-error">{errors.description}</p>}

            <button type="submit">Guardar producto</button>
        </form>
    );
};

export default ProductForm;
