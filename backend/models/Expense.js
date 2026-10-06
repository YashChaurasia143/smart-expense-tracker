const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title or short description'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please specify an expense amount'],
      min: [0.01, 'Amount must be at least 0.01']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Health', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    date: {
      type: Date,
      required: [true, 'Please specify the expense date'],
      default: Date.now,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI / Online', 'Bank Transfer', 'Other'],
      default: 'Credit Card'
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for optimal filtering and aggregation queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, amount: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
