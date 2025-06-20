import React, { useState, useEffect } from "react";


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
        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0.";
        if (!formData.description || formData.description.length < 10) newErrors.description = "La descripción debe tener al menos 10 caracteres.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        if (onSubmit) onSubmit(formData);
        setFormData(initialFormState);
        setErrors({});
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}

            <input type="text" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} />
            {errors.price && <p className="form-error">{errors.price}</p>}

            <input type="text" name="brand" placeholder="Marca" value={formData.brand} onChange={handleChange} />
            <input type="text" name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} />
            <input type="text" name="condition" placeholder="Condición" value={formData.condition} onChange={handleChange} />
            <input type="text" name="size" placeholder="Talla" value={formData.size} onChange={handleChange} />

            <select name="color" value={formData.color} onChange={handleChange}>
                <option value="">Selecciona un color</option>
                {colorOptions.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>

            <input type="text" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} />
            <input type="text" name="image" placeholder="Nombre de imagen (ej. producto.jpg)" value={formData.image} onChange={handleChange} />

            <textarea name="description" placeholder="Descripción" value={formData.description || ""} onChange={handleChange} />

            {errors.description && <p className="form-error">{errors.description}</p>}

            <button type="submit">Guardar producto</button>
        </form>
    );
};

export default ProductForm;
