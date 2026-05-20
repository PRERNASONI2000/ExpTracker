// App.jsx
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Pencil, PlusCircle, Trash2, Wallet, User, MoreVertical, LogOut, LogIn, UserPlus } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)

const getToday = () => new Date().toISOString().slice(0, 10)

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: categories[0],
    date: getToday(),
  })
  const [editingId, setEditingId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setExpenses([]);
    setUser(null);

    window.location.reload();
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(API_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExpenses(Array.isArray(res.data) ? res.data : []);
      }
      catch (err) {
        console.error('Error fetching expenses:', err);
      }
    }
    fetchExpenses();
  }, [user])

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
        const token = localStorage.getItem('token');
        const res = await axios.put(
          `${API_URL}/${editingId}`,
          {
            title,
            amount,
            category: formData.category,
            date: formData.date,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
      const token = localStorage.getItem('token');
      const res = await axios.post(
        API_URL,
        {
          title,
          amount,
          category: formData.category,
          date: formData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setExpenses((prev) => prev.filter((item) => item._id !== id))
      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full px-4 py-8 text-slate-100 sm:px-8">
      {/* Modals rendered at the top of the React tree for clean mounting */}
      <Login isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} />
      <Register isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} />
      <Profile isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} />

      <div className="mt-10 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-400/20 p-3 text-cyan-300 shadow-lg shadow-cyan-400/20">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Personal Expense Tracker</h1>
            <p className="text-sm text-slate-300">Track spending, stay in control, and build better habits.</p>
            {!user && (
              <div className="hidden gap-3 sm:flex mt-2">
                {/* Fallback visible buttons for larger screens if you want, or just hide them.
                    Based on prompt, we move them to the dropdown, but leaving them conditionally is also fine.
                    Wait, let's strictly follow the prompt: "BEFORE LOGIN: Dropdown should contain: Login, Register, Profile"
                    We can just remove these inline buttons to make the UI cleaner, but keeping them hidden on small screens is fine. Actually, removing them entirely from the navbar body since they are in the dropdown now. */}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-2 pr-3 shadow-lg shadow-black/20 backdrop-blur self-end sm:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
            {user ? (user.username || user.name || 'U').charAt(0).toUpperCase() : <User size={20} />}
          </div>

          <div className="relative ml-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <MoreVertical size={18} />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-xl z-50 flex-col ${isDropdownOpen ? 'flex' : 'hidden'}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              {!user ? (
                <>
                  <button
                    onClick={() => setActiveModal('login')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-700/50 hover:text-white"
                  >
                    <LogIn size={16} className="text-indigo-400" /> Login
                  </button>
                  <button
                    onClick={() => setActiveModal('register')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-700/50 hover:text-white border-t border-white/5"
                  >
                    <UserPlus size={16} className="text-cyan-400" /> Register
                  </button>
                  <button
                    onClick={() => setActiveModal('profile')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-700/50 hover:text-white border-t border-white/5"
                  >
                    <User size={16} className="text-slate-400" /> Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveModal('profile')}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-700/50 hover:text-white"
                  >
                    <User size={16} className="text-cyan-400" /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-slate-700/50 hover:text-red-300 border-t border-white/5"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-30 mx-auto w-full max-w-6xl'>
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
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter
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
      </div>

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
