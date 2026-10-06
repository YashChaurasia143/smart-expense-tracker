import React from 'react';
import { Edit2, Trash2, Calendar, Tag, CreditCard, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORY_BADGES = {
  Food: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/60',
  Travel: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
  Shopping: 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800/60',
  Bills: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
  Education: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
  Health: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
  Other: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

export const ExpenseTable = ({
  expenses = [],
  currency = '₹',
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  totalExpenses = 0,
  onPageChange
}) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Expenses Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
          No records match your selected criteria or no expenses have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-5">Expense / Title</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {expenses.map((expense) => {
              const badgeStyle =
                CATEGORY_BADGES[expense.category] || CATEGORY_BADGES.Other;

              let formattedDate = '';
              try {
                formattedDate = format(new Date(expense.date), 'MMM dd, yyyy');
              } catch (e) {
                formattedDate = expense.date;
              }

              return (
                <tr
                  key={expense._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {expense.title}
                    </div>
                    {expense.description && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
                        {expense.description}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyle}`}
                    >
                      {expense.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-medium">
                    <span className="inline-flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{formattedDate}</span>
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-600 text-xs">
                    <span className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{expense.paymentMethod || 'Credit Card'}</span>
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {currency}
                      {expense.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onEdit(expense)}
                        title="Edit Expense"
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expense)}
                        title="Delete Expense"
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/75 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span> ({totalExpenses} total records)
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
