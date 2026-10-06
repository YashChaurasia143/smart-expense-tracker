const mongoose = require('mongoose');
const Expense = require('../models/Expense');

/**
 * @desc    Get all expenses for current user with filtering, search & pagination
 * @route   GET /api/expenses
 * @access  Private
 */
const getExpenses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Base query scoped to the logged-in user
    const query = { user: req.user._id };

    // Search query across title and description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter (supports single or comma-separated list)
    if (category && category !== 'All') {
      if (category.includes(',')) {
        query.category = { $in: category.split(',') };
      } else {
        query.category = category;
      }
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the selected day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) {
        query.amount.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        query.amount.$lte = parseFloat(maxAmount);
      }
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sort order mapping
    const sortDirection = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortDirection;

    // Execute query with pagination & total count
    const [expenses, totalExpenses, totalAmountAgg] = await Promise.all([
      Expense.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Expense.countDocuments(query),
      Expense.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const filteredTotalAmount = totalAmountAgg.length > 0 ? totalAmountAgg[0].total : 0;

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalExpenses,
      filteredTotalAmount,
      totalPages: Math.ceil(totalExpenses / limitNum) || 1,
      currentPage: pageNum,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single expense by ID
 * @route   GET /api/expenses/:id
 * @access  Private
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this expense'
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, description, date, paymentMethod } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Credit Card'
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    const { title, amount, category, description, date, paymentMethod } = req.body;

    expense.title = title !== undefined ? title : expense.title;
    expense.amount = amount !== undefined ? parseFloat(amount) : expense.amount;
    expense.category = category !== undefined ? category : expense.category;
    expense.description = description !== undefined ? description : expense.description;
    expense.date = date !== undefined ? new Date(date) : expense.date;
    expense.paymentMethod = paymentMethod !== undefined ? paymentMethod : expense.paymentMethod;

    const updatedExpense = await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Verify ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comprehensive expense statistics & summary for dashboard charts
 * @route   GET /api/expenses/stats
 * @access  Private
 */
const getExpenseStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();

    // Start & end of today (UTC / Local boundary)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Start & end of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Start & end of previous month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Start of 6 months ago for trend analytics
    const startOf6MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      todayStats,
      currentMonthStats,
      lastMonthStats,
      allTimeStats,
      categoryStats,
      monthlyTrendStats,
      recentExpenses
    ] = await Promise.all([
      // 1. Today's Total
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfToday, $lte: endOfToday } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),

      // 2. Current Month Total
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),

      // 3. Last Month Total
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),

      // 4. All Time Total
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),

      // 5. Category Breakdown (Current Month & Overall)
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } }
      ]),

      // 6. Monthly Spending Trend (Last 6 Months)
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startOf6MonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),

      // 7. Recent 5 Transactions
      Expense.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(5)
    ]);

    const todayTotal = todayStats.length > 0 ? todayStats[0].total : 0;
    const todayCount = todayStats.length > 0 ? todayStats[0].count : 0;
    const currentMonthTotal = currentMonthStats.length > 0 ? currentMonthStats[0].total : 0;
    const currentMonthCount = currentMonthStats.length > 0 ? currentMonthStats[0].count : 0;
    const lastMonthTotal = lastMonthStats.length > 0 ? lastMonthStats[0].total : 0;
    const allTimeTotal = allTimeStats.length > 0 ? allTimeStats[0].total : 0;
    const allTimeCount = allTimeStats.length > 0 ? allTimeStats[0].count : 0;

    // Calculate Month-over-Month percentage change
    let monthChangePercentage = 0;
    if (lastMonthTotal > 0) {
      monthChangePercentage = Number(
        (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
      );
    }

    // Format Monthly Trends with human-readable Month Names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyTrend = monthlyTrendStats.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      month: item._id.month,
      year: item._id.year,
      total: item.total,
      count: item.count
    }));

    // Format Category Breakdown with percentage shares
    const formattedCategoryStats = categoryStats.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage: currentMonthTotal > 0
        ? Number(((item.total / currentMonthTotal) * 100).toFixed(1))
        : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        today: {
          total: todayTotal,
          count: todayCount
        },
        currentMonth: {
          total: currentMonthTotal,
          count: currentMonthCount,
          monthName: monthNames[now.getMonth()],
          year: now.getFullYear()
        },
        lastMonth: {
          total: lastMonthTotal
        },
        monthChangePercentage,
        allTime: {
          total: allTimeTotal,
          count: allTimeCount
        },
        categoryBreakdown: formattedCategoryStats,
        monthlyTrends: formattedMonthlyTrend,
        recentExpenses
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};
