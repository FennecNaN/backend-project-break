const { request } = require('http');
const Product = require('../models/Product');

const baseHtml = `

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./public/styles.css">
    <title>Tienda de Ropa</title>
</head>
<body>

`;


const getNavBar = (req) => {
    const navHtml = `<nav>
    <ul>
        <li><a href="/products/">Todos</a></li>
        <li><a href="/products/?category=Camisetas">Camisetas</a></li>
        <li><a href="/products/?category=Pantalones">Pantalones</a></li>
        <li><a href="/products/?category=Zapatos">Zapatos</a></li>
        <li><a href="/products/?category=Accesorios">Accesorios</a></li>
        <li><a href="/dashboard">Panel administrador</a></li>
`;

    let html = '';
    if (req.path === '/dashboard') {
        html = navHtml + '<li><a href="/dashboard/new">Nuevo Producto</a></li></ul></nav>';
    } else {
        html = navHtml + '</ul></nav>';
    }
    return html;
}




const getProductCards = (products) => {
    let html = '';
    for (let product of products) {
        html += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>Nombre:${product.name}</h2>
            <p>Descripcion:${product.description}</p>
            <p>Precio:${product.price}€</p>
            <a href="/products/${product._id}">Ver detalle</a>
        </div>
        `;
    }

    return html;
};

const getProductCardsAdmin = (products) => {
    let html = '';
    for (let product of products) {
        html += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>Nombre: ${product.name}</h2>
            <p>Descripcion: ${product.description}</p>
            <p>Precio: ${product.price}€</p>
            <a href="/products/${product._id}">Ver detalle</a>
            <a href="/dashboard/${product._id}/edit">Editar</a>
            <form action="/dashboard/${product._id}/delete" method="POST" style="display:inline;">
                <button type="submit">Eliminar</button>
            </form>
        </div>
        `;
    }

    return html;
};
// Controladores
const showProducts = async (req, res) => {
    try {
        const category = req.query.category;
        const query = category ? { category } : {};
        const products = await Product.find(query);
        
        let productCards;
        let html = '';
        if (req.path === '/dashboard') {
            productCards = getProductCardsAdmin(products);
            html = baseHtml + `
            <h1>Dashboard</h1>
            ` + getNavBar(req) + productCards + '</body></html>';
        } else {
            productCards = getProductCards(products);
            html = baseHtml + getNavBar(req) + productCards + '</body></html>';
        }

        res.send(html);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
};

const showProductById = async (req, res) => {
    try {
        // Aquí verificamos si estamos en la página de dashboard y respondemos en consecuencia
        if (req.path === '/dashboard') {
            // Muestra el panel de administrador
            const html = baseHtml + getNavBar(req) + `
                <h1>Dashboard</h1>
                </body></html>`;
            res.send(html);
        } else {
            // Si no estamos en la página de dashboard, mostramos el detalle del producto por ID
            const product = await Product.findById(req.params.productId);
            if (!product) return res.status(404).send('Product not found');
            const html = baseHtml + getNavBar(req) + `
                <div class="product-detail">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>Descripcion: ${product.description}</p>
                    <p>Precio:${product.price}€</p>
                    <p>Categoría: ${product.category}</p>
                    <p>Talla: ${product.size}</p>
                    <p>ID:${product._id}</p>
                </div>
                </body></html>`;
            res.send(html);
        }
    } catch (error) {
        res.status(500).send('Error loading admin panel');
    }
};


const showNewProduct = (req, res) => {
    const html = baseHtml + getNavBar(req) + `
    <form action="/dashboard" method="POST">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required>
        <label for="description">Descripción:</label>
        <textarea id="description" name="description" required></textarea>
        <label for="image">Imagen URL:</label>
        <input type="text" id="image" name="image" required>
        <label for="category">Categoría:</label>
        <select id="category" name="category" required>
            <option value="Camisetas">Camisetas</option>
            <option value="Pantalones">Pantalones</option>
            <option value="Zapatos">Zapatos</option>
            <option value="Accesorios">Accesorios</option>
        </select>
        <label for="size">Talla:</label>
        <select id="size" name="size" required>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
        </select>
        <label for="price">Precio:</label>
        <input type="number" id="price" name="price" required>
        <button type="submit">Crear Producto</button>
    </form>
    </body></html>
    `;
    res.send(html);
};

const createProduct = async (req, res) => {
    try {
        const { name, description, image, category, size, price } = req.body;
        const newProduct = new Product({ name, description, image, category, size, price });
        await newProduct.save();
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Error creating product');
    }
};

const showEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send('Product not found');
        const html = baseHtml + getNavBar() + `
        <form action="/dashboard/${product._id}/edit" method="POST">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" value="${product.name}" required>
            <label for="description">Descripción:</label>
            <textarea id="description" name="description" required>${product.description}</textarea>
            <label for="image">Imagen URL:</label>
            <input type="text" id="image" name="image" value="${product.image}" required>
            <label for="category">Categoría:</label>
            <select id="category" name="category" required>
                <option value="Camisetas" ${product.category === 'Camisetas' ? 'selected' : ''}>Camisetas</option>
                <option value="Pantalones" ${product.category === 'Pantalones' ? 'selected' : ''}>Pantalones</option>
                <option value="Zapatos" ${product.category === 'Zapatos' ? 'selected' : ''}>Zapatos</option>
                <option value="Accesorios" ${product.category === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
            </select>
            <label for="size">Talla:</label>
            <select id="size" name="size" required>
                <option value="XS" ${product.size === 'XS' ? 'selected' : ''}>XS</option>
                <option value="S" ${product.size === 'S' ? 'selected' : ''}>S</option>
                <option value="M" ${product.size === 'M' ? 'selected' : ''}>M</option>
                <option value="L" ${product.size === 'L' ? 'selected' : ''}>L</option>
                <option value="XL" ${product.size === 'XL' ? 'selected' : ''}>XL</option>
            </select>
            <label for="price">Precio:</label>
            <input type="number" id="price" name="price" value="${product.price}" required>
            <button type="submit">Actualizar Producto</button>
        </form>
        </body></html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Error fetching product');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, image, category, size, price } = req.body;
        await Product.findByIdAndUpdate(req.params.productId, { name, description, image, category, size, price });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
};

module.exports = {
    showProducts,
    showProductById,
    showNewProduct,
    createProduct,
    showEditProduct,
    updateProduct,
    deleteProduct,
};