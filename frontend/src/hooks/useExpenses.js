import { useState, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [filteredTotalAmount, setFilteredTotalAmount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of expenses with filters
  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getExpenses(filters);
      if (response.success) {
        setExpenses(response.data);
        setTotalExpenses(response.totalExpenses);
        setFilteredTotalAmount(response.filteredTotalAmount);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Add expense
  const addExpense = async (expenseData) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      return response;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to add expense'
      );
    }
  };

  // Edit expense
  const updateExpense = async (id, expenseData) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      return response;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to update expense'
      );
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      const response = await expenseService.deleteExpense(id);
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  return {
    expenses,
    stats,
    totalExpenses,
    filteredTotalAmount,
    totalPages,
    currentPage,
    loading,
    statsLoading,
    error,
    fetchExpenses,
    fetchStats,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
