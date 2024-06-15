const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).send('Invalid credentials');
        }
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).send('Error logging in');
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/products');
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
