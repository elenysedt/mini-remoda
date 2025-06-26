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
    image: "",
    description: ""
};

const ProductForm = ({ onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [imageOption, setImageOption] = useState("local");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const colorOptions = ["Rojo", "Azul", "Verde", "Amarillo", "Negro", "Blanco", "Rosa", "Celeste"];

    const [availableImages, setAvailableImages] = useState([
        "body9m.jpeg", "bodycartersarco.jpeg", "fucsiacartersnb.jpeg",
        "pantcartersrosanb.jpeg", "pantfucsiaNB.jpeg", "pantnb.jpeg",
        "pantrulisnbcarters.jpeg", "pijama12mcarters.jpeg", "pijamalunares.jpeg",
        "pijamalunares2t.jpeg", "talleepk23m.jpeg", "tallepantnb.jpeg",
        "tallepijama.jpeg", "vestivoepk24m.jpeg"
    ]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.image) {
                if (initialData.image.includes('imgbb.com') || initialData.image.includes('http')) {
                    setImageOption("local");
                } else if (availableImages.includes(initialData.image)) {
                    setImageOption("nombre");
                }
            }
        }
    }, [initialData, availableImages]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // ✅ Función para manejar cambio de imagen local
    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };
    // ✅ Función para cambiar tipo de imagen
    const handleImageOptionChange = (option) => {
        setImageOption(option);
        // Limpiar estados según la opción
        if (option === "local") {
            setFormData(prev => ({ ...prev, image: "" }));
        } else {
            setImageFile(null);
            setPreviewUrl(null);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
        if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = "El stock debe ser mayor o igual a 0.";
        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "El precio debe ser mayor a 0.";
        if (!formData.description || formData.description.length < 10) newErrors.description = "La descripción debe tener al menos 10 caracteres.";
       
        // ✅ Validar que se haya seleccionado una imagen
        if (imageOption === "local" && !imageFile && !initialData?.image) {
            newErrors.image = "Debes seleccionar una imagen.";
        }
        if (imageOption === "nombre" && !formData.image) {
            newErrors.image = "Debes seleccionar una imagen.";
        }
        return newErrors;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (onSubmit) {
            onSubmit(formData, imageFile, imageOption);
        }
        // ✅ Limpiar formulario solo si no estamos editando
        if (!initialData) {
            setFormData(initialFormState);
            setImageFile(null);
            setPreviewUrl(null);
            setImageOption("local");
        }
        setErrors({});
    };
    return (
        <>
            <h2 className="form-title">
                ➕ {initialData ? "Editar producto" : "Agregar producto"}
            </h2>

            <form className="product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}

                <input
                    type="text"
                    name="price"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={handleChange}
                />
                {errors.price && <p className="form-error">{errors.price}</p>}

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock disponible"
                    value={formData.stock}
                    onChange={handleChange}
                />
                {errors.stock && <p className="form-error">{errors.stock}</p>}

                <input
                    type="text"
                    name="brand"
                    placeholder="Marca"
                    value={formData.brand}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Categoría"
                    value={formData.category}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="condition"
                    placeholder="Condición"
                    value={formData.condition}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="size"
                    placeholder="Talla"
                    value={formData.size}
                    onChange={handleChange}
                />

                <select name="color" value={formData.color} onChange={handleChange}>
                    <option value="">Selecciona un color</option>
                    {colorOptions.map((c, i) => (
                        <option key={i} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <div className="image-source-section">
                    <h4>📸 Seleccionar imagen:</h4>

                    <div className="image-source-toggle">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="imageOption"
                                value="local"
                                checked={imageOption === "local"}
                                onChange={() => handleImageOptionChange("local")}
                            />
                            <span className="radio-label">
                                📁 Subir desde mi computadora
                                <small>(Cualquier imagen nueva)</small>
                            </span>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="imageOption"
                                value="nombre"
                                checked={imageOption === "nombre"}
                                onChange={() => handleImageOptionChange("nombre")}
                            />
                            <span className="radio-label">
                                🗂️ Usar imagen existente
                                <small>({availableImages.length} imágenes disponibles)</small>
                            </span>
                        </label>
                    </div>

                    {imageOption === "local" && (
                        <div className="upload-section">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileChange}
                                className="file-input"
                            />
                            {(imageFile || previewUrl) && (
                                <div className="preview-container">
                                    <p className="preview-label">Vista previa:</p>
                                    <img
                                        src={previewUrl || URL.createObjectURL(imageFile)}
                                        alt="Vista previa"
                                        className="preview-image"
                                    />
                                </div>
                            )}

                            {!imageFile && initialData?.image && imageOption === "local" && (
                                <div className="preview-container">
                                    <p className="preview-label">Imagen actual:</p>
                                    <img
                                        src={initialData.image}
                                        alt="Imagen actual"
                                        className="preview-image"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {imageOption === "nombre" && (
                        <div className="existing-images-section">
                            <select
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="image-select"
                            >
                                <option value="">Seleccionar imagen...</option>
                                {availableImages.map((img, index) => (
                                    <option key={index} value={img}>
                                        {img}
                                    </option>
                                ))}
                            </select>

                            {formData.image && (
                                <div className="preview-container">
                                    <p className="preview-label">Vista previa:</p>
                                    <img
                                        src={`https://raw.githubusercontent.com/elenysedt/mini-remoda/master/images/${formData.image}`}
                                        alt="Vista previa"
                                        className="preview-image"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "block";
                                        }}
                                    />
                                    <p className="image-error" style={{ display: "none" }}>
                                        ⚠️ Imagen no encontrada
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {errors.image && <p className="form-error">{errors.image}</p>}
                </div>

                <textarea
                    name="description"
                    placeholder="Descripción del producto"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows="4"
                />
                {errors.description && (
                    <p className="form-error">{errors.description}</p>
                )}

                <button type="submit">
                    {initialData ? "Actualizar producto" : "Guardar producto"}
                </button>
            </form>
        </>
    );
};
export default ProductForm;