const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.get('/register', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <h3>Crear una cuenta nueva</h3>
        <form action="/auth/register" method="POST">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Register</button>
        </form>
        <form action="/products" method="GET">
            <button type="submit">Inicio</button>
        </form>
        <form action="/auth/login" method="GET">
            <button type="submit">Login</button>
        </form>
        
    `);
});

router.post('/register', registerUser);

router.get('/login', (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <h3>Login</h3>
        <form action="/auth/login" method="POST">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
        <form action="/products" method="GET">
            <button type="submit">Inicio</button>
        </form>
        <form action="/auth/register" method="GET">
            <button type="submit">Registrarse</button>
        </form>
    `);
});

router.post('/login', loginUser);

router.get('/logout', logoutUser);

module.exports = router;
