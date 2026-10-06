import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import Navbar from '../components/Navbar';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseModal from '../components/ExpenseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircle, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const ExpensesPage = () => {
  const { user } = useAuth();
  const {
    expenses,
    totalExpenses,
    filteredTotalAmount,
    totalPages,
    currentPage,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  } = useExpenses();

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    order: 'desc',
    page: 1,
    limit: 10
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currency = user?.currency || '₹';

  // Fetch expenses when filters change
  useEffect(() => {
    fetchExpenses(filters);
  }, [filters, fetchExpenses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      order: 'desc',
      page: 1,
      limit: 10
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSaveExpense = async (data) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, data);
      setEditingExpense(null);
    } else {
      await addExpense(data);
    }
    fetchExpenses(filters);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setDeleteLoading(true);
    try {
      await deleteExpense(deletingExpense._id);
      setDeletingExpense(null);
      fetchExpenses(filters);
    } catch (err) {
      alert(err.message || 'Error deleting expense');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export current list to CSV
  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      alert('No expense records to export');
      return;
    }

    const headers = ['Title', 'Amount', 'Category', 'Date', 'Payment Method', 'Description'];
    const rows = expenses.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category}"`,
      `"${new Date(e.date).toISOString().split('T')[0]}"`,
      `"${e.paymentMethod || 'Credit Card'}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Expense Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search, filter, edit, and organize all your spending records
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              title="Export CSV"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all duration-150 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <ExpenseFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Summary Metric Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl px-6 py-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <span>Found</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalExpenses}</span>
            <span>{totalExpenses === 1 ? 'expense' : 'expenses'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">Filtered Total:</span>
            <span className="text-lg font-extrabold text-brand-700 dark:text-brand-400">
              {currency}
              {filteredTotalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>

        {/* Expenses Data Table */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading expenses..." />
        ) : (
          <ExpenseTable
            expenses={expenses}
            currency={currency}
            currentPage={currentPage}
            totalPages={totalPages}
            totalExpenses={totalExpenses}
            onPageChange={handlePageChange}
            onEdit={(item) => setEditingExpense(item)}
            onDelete={(item) => setDeletingExpense(item)}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingExpense) && (
        <ExpenseModal
          isOpen={isAddModalOpen || !!editingExpense}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleSaveExpense}
          initialData={editingExpense}
          currency={currency}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        title={deletingExpense?.title}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ExpensesPage;
