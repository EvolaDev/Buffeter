const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const { User } = require('../models/User');

const MINIMUM_PASSWORD_LENGTH = 6;
const getAuthValidationMiddleware = () => [
  check('email', 'invalid email address').isEmail(),
  check('password', 'Minimum password length is 6 symbols').isLength({ min: MINIMUM_PASSWORD_LENGTH }),
];
const getLogInValidationMiddleware = () => [
  check('email', 'use valid email').normalizeEmail().isEmail(),
  check('password', 'use valid password').exists(),
];

const router = Router();

// router prefix - /api/auth/register
router.post('/register', getAuthValidationMiddleware(), async (req, resp) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        errors: errors.array(),
        message: 'invalid registration data',
      });
    }
    const { email, password } = req.body;
    const userCandidate = await User.findOne({ email });
    if (userCandidate) {
      return resp.status(500).json({ message: 'this email already exist' });
    }
    // TODO: make sold value dynamic
    const hashedPassword = await bcrypt.hash(password, 'someStaticSold');
    const user = new User({ email, password: hashedPassword });

    await user.save();

    return resp.status(201).json({ message: 'User is successfully registered' });
  } catch (error) {
    return resp.status(500).json({ message: 'internal server error, try again in several minutes' });
  }
});

// router prefix - /api/auth/login
router.post('/login', getLogInValidationMiddleware(), async (req, resp) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).json({
        errors: errors.array(),
        message: 'invalid email or password',
      });
    }

    const { email, password } = req.body;
    const user = User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: 'invalid email or password' });
    }

    const isMatchPassword = await bcrypt.compare(password, User.password);
    if (!isMatchPassword) {
      return resp.status(400).json({ message: 'invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, config.get('jwtKey'), { expiresIn: '1h' });
    resp.json({ token, userId: user.id });
    return resp.status(200).json({ message: 'User is successful login' });
  } catch (error) {
    return resp.status(500).json({ message: 'internal server error, try again in several minutes' });
  }
});

module.exports = router;
