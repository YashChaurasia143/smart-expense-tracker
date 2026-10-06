import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import ExpenseModal from '../components/ExpenseModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  IndianRupee,
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  TrendingUp,
  Receipt,
  PlusCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const { stats, statsLoading, fetchStats, addExpense } = useExpenses();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const currency = user?.currency || '₹';

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCreateExpense = async (data) => {
    await addExpense(data);
    await fetchStats();
  };

  const highestCategory = stats?.categoryBreakdown?.[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>. Here is your spending breakdown.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/expenses"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold shadow-xs transition-colors"
            >
              <span>View All Expenses</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all duration-150 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {statsLoading ? (
          <LoadingSpinner size="lg" text="Calculating financial analytics..." />
        ) : (
          <>
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="This Month's Spending"
                amount={stats?.currentMonth?.total || 0}
                currency={currency}
                subtitle={`${stats?.currentMonth?.count || 0} expenses in ${stats?.currentMonth?.monthName || 'this month'}`}
                icon={IndianRupee}
                trend={stats?.monthChangePercentage}
                color="brand"
              />

              <StatCard
                title="Today's Spending"
                amount={stats?.today?.total || 0}
                currency={currency}
                subtitle={`${stats?.today?.count || 0} recorded today`}
                icon={Calendar}
                color="blue"
              />

              <StatCard
                title="Top Category"
                amount={highestCategory ? highestCategory.total : 0}
                currency={currency}
                subtitle={highestCategory ? `${highestCategory.category} (${highestCategory.percentage}%)` : 'No expenses yet'}
                icon={PieIcon}
                color="purple"
              />

              <StatCard
                title="Total All-Time"
                amount={stats?.allTime?.total || 0}
                currency={currency}
                subtitle={`${stats?.allTime?.count || 0} total transactions`}
                icon={Receipt}
                color="amber"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category Breakdown (Donut Chart) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                      Category Breakdown
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Expenses grouped by category for this month
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <CategoryPieChart
                    data={stats?.categoryBreakdown || []}
                    currency={currency}
                  />
                </div>
              </div>

              {/* Monthly Spending Trend (Bar Chart) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                      Monthly Spending Trends
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Historical expenditure over the past months
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <MonthlyBarChart
                    data={stats?.monthlyTrends || []}
                    currency={currency}
                  />
                </div>
              </div>
            </div>

            {/* Recent Expenses List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    Recent Transactions
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Your latest 5 recorded transactions
                  </p>
                </div>
                <Link
                  to="/expenses"
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              {stats?.recentExpenses && stats.recentExpenses.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats.recentExpenses.map((item) => {
                    let formattedDate = '';
                    try {
                      formattedDate = format(new Date(item.date), 'MMM dd, yyyy');
                    } catch (e) {
                      formattedDate = item.date;
                    }

                    return (
                      <div
                        key={item._id}
                        className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs">
                            {item.category.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {item.category} &bull; {formattedDate}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {currency}
                            {item.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {item.paymentMethod || 'Credit Card'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                  No transactions recorded yet. Click "Add Expense" to get started!
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateExpense}
        currency={currency}
      />
    </div>
  );
};

export default Dashboard;
