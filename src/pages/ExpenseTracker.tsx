import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Plus, TrendingUp, TrendingDown, Calendar, DollarSign,
  PieChart, BarChart3, Filter, Download, Edit, Trash2,
  Receipt, CreditCard, Home, Car, Utensils, ShoppingBag,
  Zap, Heart, GraduationCap, Briefcase
} from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'weekly' | 'monthly';
}

const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: Utensils, color: 'text-orange-400' },
  { name: 'Transportation', icon: Car, color: 'text-blue-400' },
  { name: 'Utilities', icon: Zap, color: 'text-yellow-400' },
  { name: 'Housing', icon: Home, color: 'text-green-400' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-purple-400' },
  { name: 'Healthcare', icon: Heart, color: 'text-red-400' },
  { name: 'Education', icon: GraduationCap, color: 'text-indigo-400' },
  { name: 'Business', icon: Briefcase, color: 'text-emerald-400' },
  { name: 'Other', icon: Receipt, color: 'text-slate-400' },
];

export const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'monthly' as 'weekly' | 'monthly'
  });

  // Load expenses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('finzeal_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('finzeal_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.category || !newExpense.description) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString(),
      type: newExpense.type
    };

    setExpenses(prev => [expense, ...prev]);
    setNewExpense({ amount: '', category: '', description: '', type: 'monthly' });
    setShowAddForm(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const filteredExpenses = expenses.filter(e =>
    filter === 'all' || e.type === filter
  );

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const weeklyExpenses = expenses.filter(e => e.type === 'weekly').reduce((sum, e) => sum + e.amount, 0);
  const monthlyExpenses = expenses.filter(e => e.type === 'monthly').reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-slate-400">Track your weekly and monthly expenses</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Expenses</p>
              <p className="text-xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Weekly Expenses</p>
              <p className="text-xl font-bold">₹{weeklyExpenses.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Monthly Expenses</p>
              <p className="text-xl font-bold">₹{monthlyExpenses.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Add Form */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Expenses</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddForm(false)}
        >
          <GlassCard
            className="p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                  placeholder="What was this expense for?"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Type</label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, type: e.target.value as 'weekly' | 'monthly' }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={addExpense}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded font-medium"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-600 rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Expenses List and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses List */}
        <GlassCard className="p-4">
          <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredExpenses.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No expenses recorded yet</p>
            ) : (
              filteredExpenses.map(expense => {
                const category = EXPENSE_CATEGORIES.find(c => c.name === expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {category && <category.icon className={`h-4 w-4 ${category.color}`} />}
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-slate-400">{expense.category} • {expense.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{expense.amount.toLocaleString()}</span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>

        {/* Category Breakdown */}
        <GlassCard className="p-4">
          <h2 className="text-xl font-bold mb-4">Expense Categories</h2>
          <div className="space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No expenses to analyze</p>
            ) : (
              topCategories.map(([category, amount]) => {
                const cat = EXPENSE_CATEGORIES.find(c => c.name === category);
                const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {cat && <cat.icon className={`h-4 w-4 ${cat.color}`} />}
                      </div>
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-slate-400">{percentage}% of total</p>
                      </div>
                    </div>
                    <span className="font-bold">₹{amount.toLocaleString()}</span>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};