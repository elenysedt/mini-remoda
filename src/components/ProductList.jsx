import React from "react";

const ProductList = ({ addToCart }) => {
    const products = [
        { id: 1, name: "Vestido infantil", price: 1500 },
        { id: 2, name: "Campera térmica", price: 2500 },
    ];

    return (
        <div>
            <h2>Productos disponibles</h2>
            {products.map((product) => (
                <div key={product.id}>
                    <h3>{product.name} - ${product.price}</h3>
                    <button onClick={() => addToCart(product)}>Agregar al carrito</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
