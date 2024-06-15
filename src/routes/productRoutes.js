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

const requireAuth = require('../middlewares/authMiddleware').requireAuth;

const router = express.Router();

router.get('/products', showProducts); 
router.get('/products/:productId', showProductById); 


router.get('/dashboard',requireAuth, showProducts); 
router.get('/dashboard/new',requireAuth, showNewProduct);
router.post('/dashboard',requireAuth, createProduct);
router.get('/dashboard/:productId',requireAuth, showProductById);
router.get('/dashboard/:productId/edit',requireAuth, showEditProduct);
router.post('/dashboard/:productId/edit',requireAuth, updateProduct);
router.post('/dashboard/:productId/delete',requireAuth, deleteProduct);

module.exports = router;

