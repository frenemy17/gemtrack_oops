const AuthService = require('../services/AuthService');
const authService = new AuthService();

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { token, user } = await authService.execute({ action: 'register', name, email, password });
    res.status(201).json({ message: 'User created successfully!', token, user });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') return res.status(400).json({ message: error.message });
    if (error.message.includes('already exists')) return res.status(400).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.execute({ action: 'login', email, password });
    res.status(200).json({ message: 'User logged in successfully!', token, user });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR' || error.code === 'LOGIN_ERROR') return res.status(401).json({ message: 'Invalid credentials' });
    res.status(500).json({ error: 'Failed to login user' });
  }
};