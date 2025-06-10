const authService = require('../services/auth.service');
const { loginSchema, registerSchema } = require('../validators/auth');
const validate = require('../middleware/validate');

const signup = [
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const result = await authService.signup(req.body);
      
      res.status(201).json({
        status: 'success',
        ...result
      });
    } catch (error) {
      return next(error);
    }
  }
];

const login = [
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const result = await authService.login(req.body);

      res.json({
        status: 'success',
        ...result
      });
    } catch (error) {
      return next(error);
    }
  }
];

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signup,
  login,
  logout
};
