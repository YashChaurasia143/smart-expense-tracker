const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { expenseValidationRules } = require('../middleware/validatorMiddleware');

// All expense routes require JWT authentication
router.use(protect);

// Dashboard Analytics route (must be placed before /:id to prevent parameter matching)
router.get('/stats', getExpenseStats);

// Main CRUD routes
router
  .route('/')
  .get(getExpenses)
  .post(expenseValidationRules, createExpense);

router
  .route('/:id')
  .get(getExpenseById)
  .put(expenseValidationRules, updateExpense)
  .delete(deleteExpense);

module.exports = router;
