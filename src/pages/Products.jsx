import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../components/ProductList.css";

const Products = ({ searchTerm }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const productsRef = collection(db, "ropabebe");
                const querySnapshot = await getDocs(productsRef);
                if (!querySnapshot || querySnapshot.empty) {
                    throw new Error("No se encontraron productos en la base de datos.");
                }
                const productItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productItems);
            } catch (error) {
                console.error("Error al recuperar productos desde Firebase:", error);
                setError("Hubo un problema al cargar los productos. Intenta más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Bonus: resetea paginación si cambian filtros o búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedColor, selectedBrand]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = searchTerm
            ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
        const matchesColor = selectedColor ? p.color === selectedColor : true;
        const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
        return matchesSearch && matchesCategory && matchesColor && matchesBrand;

    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) return <p className="loading">Cargando productos...</p>;
    if (error)
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );

    return (
        <div className="container mt-4">
            {/* Filtros */}
            <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
                <select
                    className="form-select w-auto"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    <option value="pijama">Pijama</option>
                    <option value="body">Body</option>
                    <option value="pantalon">Pantalón</option>
                </select>

                <select
                    className="form-select w-auto"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                >
                    <option value="">Todos los colores</option>
                    <option value="blanco">Blanco</option>
                    <option value="rosa">Rosa</option>
                    <option value="celeste">Celeste</option>
                </select>
                <select
                    className="form-select w-auto"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                >
                    <option value="">Todas las marcas</option>
                    <option value="carters">Carter's</option>
                    <option value="epk">EPK</option>
                </select>
            </div>
            {(selectedCategory || selectedColor || selectedBrand) && (
                <div className="text-center mb-3">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                            setSelectedCategory("");
                            setSelectedColor("");
                            setSelectedBrand("");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {/* Productos */}
            <div className="row g-4 justify-content-center">
                {currentProducts.map((p) => (
                    <div className="col mb-4 d-flex justify-content-center" key={p.id}>
                        <div className="product-card card h-100">
                            <img src={p.image} alt={p.name} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">Precio: ${p.price} ARS</p>
                                <p className="card-text">Talla: {p.size}</p>
                                <Link to={`/products/${p.id}`} className="btn btn-azul btn-sm">
                                    Ver detalles
                                </Link>
                                {p.stock > 0 ? (
                                    <button className="btn btn-rosa btn-sm" onClick={() => addToCart(p)}>
                                        Agregar al carrito
                                    </button>
                                ) : (
                                    <button className="btn btn-outline-secondary btn-sm" disabled>
                                        ❌ Sin stock
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                    Anterior
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Products;
