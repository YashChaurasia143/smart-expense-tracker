import api from './api';

export const expenseService = {
  // Fetch expenses with query params (search, category, date range, pagination, etc.)
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  // Fetch expense dashboard statistics (aggregations & charts)
  getStats: async () => {
    const response = await api.get('/expenses/stats');
    return response.data;
  },

  // Fetch single expense by ID
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Create a new expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Update existing expense
  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};
