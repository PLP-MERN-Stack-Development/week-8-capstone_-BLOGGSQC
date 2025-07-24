// server/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * ================================
 * REGISTER ROUTE
 * ================================
 */
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent']).withMessage('Invalid role specified')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, role, ...otherData } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists with this email' });
    }

    const user = new User({ name, email, password, role, ...otherData });
    await user.save();

    const { accessToken, refreshToken } = user.generateAuthToken();
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        },
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * ================================
 * LOGIN ROUTE
 * ================================
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // 🔎 Debug log
    console.log('🔐 Login attempt payload received:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password); // uses bcrypt compare

    const { accessToken, refreshToken } = user.generateAuthToken();
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar
        },
        token: accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

/**
 * ================================
 * REFRESH TOKEN ROUTE
 * ================================
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: 'error', message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken)) {
      return res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = user.generateAuthToken();
    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
  }
});

/**
 * ================================
 * LOGOUT ROUTE
 * ================================
 */
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      req.user.refreshTokens = req.user.refreshTokens.filter(t => t.token !== refreshToken);
    } else {
      req.user.refreshTokens = [];
    }
    await req.user.save();

    res.json({ status: 'success', message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ status: 'error', message: 'Logout failed' });
  }
});

/**
 * ================================
 * VALIDATE TOKEN ROUTE
 * ================================
 */
router.get('/validate', auth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Token is valid',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          isActive: req.user.isActive,
          avatar: req.user.avatar,
          lastLogin: req.user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ status: 'error', message: 'Token validation failed' });
  }
});

/**
 * ================================
 * FORGOT PASSWORD ROUTE
 * ================================
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found with this email' });
    }

    const resetToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // TODO: Implement email sending here
    res.json({
      status: 'success',
      message: 'Password reset instructions sent to your email',
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process password reset request' });
  }
});

/**
 * ================================
 * RESET PASSWORD ROUTE
 * ================================
 */
router.post('/reset-password', [
  body('token').exists().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });
    }

    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // force logout on all devices
    await user.save();

    res.json({ status: 'success', message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
  }
});

module.exports = router;
