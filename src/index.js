const express = require('express');
const { dbConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();
dbConnection();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.use('/products', productRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});