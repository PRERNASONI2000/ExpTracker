// App.jsx
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Pencil, PlusCircle, Trash2, Wallet } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/expenses'

const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)

const getToday = () => new Date().toISOString().slice(0, 10)

function App() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '', 
    category: categories[0],
    date: getToday(),
  })
  const [editingId, setEditingId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

useEffect(()=>{
  const fetchExpenses = async () => {
    try{
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    }
    catch(err){
      console.error('Error fetching expenses:', err);
    }
  }
  fetchExpenses();
},[])

  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'All') {
      return expenses
    }
    return expenses.filter((item) => item.category === activeFilter)
  }, [expenses, activeFilter])

  const totalSpent = filteredExpenses.reduce((sum, item) => sum + item.amount, 0)
  const averageSpent = filteredExpenses.length ? totalSpent / filteredExpenses.length : 0
  const latestExpense = filteredExpenses[0]?.amount || 0

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: categories[0],
      date: getToday(),
    })
    setEditingId(null)
  }

 const handleSubmit = async (event) => {
  event.preventDefault()

  const title = formData.title.trim()
  const amount = Number(formData.amount)

  if (!title || Number.isNaN(amount) || amount <= 0) {
    return
  }

  try {
    // UPDATE
    if (editingId) {
      const res = await axios.put(
        `${API_URL}/${editingId}`,
        {
          title,
          amount,
          category: formData.category,
          date: formData.date,
        }
      )

      setExpenses((prev) =>
        prev.map((item) =>
          item._id === editingId ? res.data : item
        )
      )

      resetForm()
      return
    }

    // CREATE
    const res = await axios.post(
      API_URL,
      {
        title,
        amount,
        category: formData.category,
        date: formData.date,
      }
    )

    setExpenses((prev) => [res.data, ...prev])

    resetForm()
  } catch (error) {
    console.error('Error saving expense:', error)
  }
}

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    })
    setEditingId(expense._id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setExpenses((prev) => prev.filter((item) => item._id !== id))
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 text-slate-100 sm:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-400/20 p-3 text-cyan-300 shadow-lg shadow-cyan-400/20">
          <Wallet size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Personal Expense Tracker</h1>
          <p className="text-sm text-slate-300">Track spending, stay in control, and build better habits.</p>
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)} />
        <StatCard label="Average Expense" value={formatCurrency(averageSpent)} />
        <StatCard label="Latest Expense" value={formatCurrency(latestExpense)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur"
        >
          <h2 className="mb-4 text-lg font-semibold">{editingId ? 'Edit expense' : 'Add new expense'}</h2>
          <div className="space-y-4">
            <InputField
              label="Title"
              type="text"
              value={formData.title}
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              placeholder="Groceries"
            />
            <InputField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(value) => setFormData((prev) => ({ ...prev, amount: value }))}
              placeholder="500"
              min="0"
              step="0.01"
            />
            <label className="block text-sm text-slate-300">
              Category
              <select
                className="mt-2 w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
                value={formData.category}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <InputField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(value) => setFormData((prev) => ({ ...prev, date: value }))}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <PlusCircle size={16} />
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-slate-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur">
          <div className="mb-4 flex flex-wrap gap-2">
            {['All', ...categories].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  activeFilter === filter
                    ? 'bg-cyan-400 text-slate-950'
                    : 'border border-white/15 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <h2 className="mb-4 text-lg font-semibold">Recent Expenses</h2>
          {filteredExpenses.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/20 p-4 text-sm text-slate-400">
              No expenses yet. Add your first expense to begin tracking.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredExpenses.map((expense) => (
                <li
                  key={expense._id}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-slate-800/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{expense.title}</p>
                    <p className="text-xs text-slate-400">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-cyan-300">{formatCurrency(expense.amount)}</p>
                    <button
                      type="button"
                      onClick={() => handleEdit(expense)}
                      className="rounded-md border border-white/20 p-2 text-slate-200 transition hover:bg-slate-700"
                      aria-label="Edit expense"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense._id)}
                      className="rounded-md border border-red-400/40 p-2 text-red-300 transition hover:bg-red-500/20"
                      aria-label="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

function InputField({ label, type, value, onChange, placeholder, min, step }) {
  return (
    <label className="block text-sm text-slate-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
        className="mt-2 w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
        required
      />
    </label>
  )
}

function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-black/20 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-300">{value}</p>
    </article>
  )
}

export default App
