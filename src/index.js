const express = require('express');
const { dbConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();
dbConnection();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10 * 60 * 1000, 
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', productRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});