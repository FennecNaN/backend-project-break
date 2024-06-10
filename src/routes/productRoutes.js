const express = require('express');
const {
    showProducts,
    showProductById,
    showNewProduct,
    createProduct,
    showEditProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/products', showProducts); // Devuelve todos los productos
router.get('/products/:productId', showProductById); // Devuelve el producto por Id

router.get('/dashboard', showProducts); 
router.get('/dashboard/new', showNewProduct);
router.post('/dashboard', createProduct);
router.get('/dashboard/:productId', showProductById);
router.get('/dashboard/:productId/edit', showEditProduct);
router.post('/dashboard/:productId/edit', updateProduct);
router.post('/dashboard/:productId/delete', deleteProduct);

module.exports = router;


// El problema ocurre porque el método HTML <form> por defecto solo soporta GET y POST. Tu configuración de ruta está esperando una solicitud DELETE, lo cual no es compatible con los formularios HTML sin usar method-override o una técnica similar.