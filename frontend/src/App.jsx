// App.jsx
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import WelcomePopup from './components/WelcomePopup'
import { 
  Pencil, 
  PlusCircle, 
  Trash2, 
  Wallet, 
  User, 
  MoreVertical, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Utensils, 
  Car, 
  Receipt, 
  ShoppingBag, 
  Heart, 
  HelpCircle, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Sparkles
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)

const getToday = () => new Date().toISOString().slice(0, 10)

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Food':
      return <Utensils size={16} />;
    case 'Transport':
      return <Car size={16} />;
    case 'Bills':
      return <Receipt size={16} />;
    case 'Shopping':
      return <ShoppingBag size={16} />;
    case 'Health':
      return <Heart size={16} />;
    default:
      return <HelpCircle size={16} />;
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'Food':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Transport':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'Bills':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Shopping':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    case 'Health':
      return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

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
        if (!token) return;
        const res = await axios.get(
          `${API_URL}/api/expenses`,
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
      if (editingId) {
        const token = localStorage.getItem('token');
        const res = await axios.put(
          `${API_URL}/api/expenses/${editingId}`,
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

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/expenses`,
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
      await axios.delete(
        `${API_URL}/api/expenses/${id}`,
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
    <div className="min-h-screen bg-transparent pb-16">
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#030712]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-2.5 text-slate-950 shadow-md shadow-indigo-500/10">
              <Wallet size={20} />
              <div className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-md -z-10" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
                SpendFlow
              </span>
              <span className="ml-1.5 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Dropdown controls */}
            <div className="relative flex items-center gap-2.5 rounded-xl border border-white/5 bg-zinc-900/40 p-1.5 pr-2.5 shadow-lg backdrop-blur-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-inner">
                {user ? (user.username || user.name || 'U').charAt(0).toUpperCase() : <User size={16} />}
              </div>

              <div className="relative flex items-center">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="rounded-lg p-1 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="User menu"
                >
                  <MoreVertical size={16} />
                </button>

                <div
                  className={`absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#090d16] p-1.5 shadow-2xl z-50 flex-col transition-all duration-200 ${
                    isDropdownOpen ? 'flex opacity-100 scale-100' : 'hidden opacity-0 scale-95'
                  }`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {!user ? (
                    <>
                      <button
                        onClick={() => setActiveModal('login')}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-indigo-500/10 hover:text-white"
                      >
                        <LogIn size={14} className="text-indigo-400" /> Log In
                      </button>
                      <button
                        onClick={() => setActiveModal('register')}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-cyan-500/10 hover:text-white border-t border-white/5"
                      >
                        <UserPlus size={14} className="text-cyan-400" /> Create Account
                      </button>
                      <button
                        onClick={() => setActiveModal('profile')}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-slate-500/10 hover:text-white border-t border-white/5"
                      >
                        <User size={14} className="text-zinc-400" /> Guest Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3.5 py-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase border-b border-white/5">
                        Logged in as: <span className="text-zinc-300 block truncate">{user.email}</span>
                      </div>
                      <button
                        onClick={() => setActiveModal('profile')}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-indigo-500/10 hover:text-white mt-1"
                      >
                        <User size={14} className="text-indigo-400" /> My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300 border-t border-white/5 mt-1"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
        
        {/* Ambient Greeting Block */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            {user ? (
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent font-bold">{user.username || user.name}</span> 👋
              </h1>
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Personal Expense Tracker
              </h1>
            )}
            <p className="mt-1 text-sm text-zinc-400">
              Track spending, set dynamic category scopes, and manage cash flow.
            </p>
          </div>
          
          {!user && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/5 px-3 py-2 text-xs text-amber-400 border border-amber-500/15">
              <Sparkles size={14} className="animate-pulse" />
              <span>Log in to sync expenses with our secure backend cloud API.</span>
            </div>
          )}
        </div>

        {/* Bento Stat Cards */}
        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <StatCard 
            label="Total Spent" 
            value={formatCurrency(totalSpent)} 
            icon={TrendingUp}
            colorClass="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          />
          <StatCard 
            label="Average Expense" 
            value={formatCurrency(averageSpent)} 
            icon={BarChart3}
            colorClass="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          />
          <StatCard 
            label="Latest Expense" 
            value={formatCurrency(latestExpense)} 
            icon={Calendar}
            colorClass="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          />
        </section>

        {/* Workspace Layout Grid */}
        <section className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          
          {/* Left Column: Form Panel */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="glass-panel rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="mb-5 text-base font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                {editingId ? 'Modify Transaction' : 'Record Transaction'}
              </h2>
              
              <div className="space-y-4">
                <InputField
                  label="Title"
                  type="text"
                  value={formData.title}
                  onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
                  placeholder="e.g. Server hosting, Groceries"
                />
                
                <InputField
                  label="Amount (INR)"
                  type="number"
                  value={formData.amount}
                  onChange={(value) => setFormData((prev) => ({ ...prev, amount: value }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />

                <div className="block">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Category Scope
                  </label>
                  <div className="relative mt-2">
                    <select
                      className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 pr-10 text-sm text-white outline-none transition duration-200 focus:border-indigo-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-500/10"
                      value={formData.category}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                    >
                      {categories.map((category) => (
                        <option key={category} value={category} className="bg-zinc-950 text-white">
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <InputField
                  label="Execution Date"
                  type="date"
                  value={formData.date}
                  onChange={(value) => setFormData((prev) => ({ ...prev, date: value }))}
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
                >
                  <PlusCircle size={16} />
                  {editingId ? 'Update Entry' : 'Add Entry'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition duration-200 hover:bg-white/5 active:scale-[0.99] cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Transaction Log / Feed */}
          <div>
            <div className="glass-panel rounded-2xl p-6 shadow-2xl h-full flex flex-col">
              
              {/* Category Filters Carousel / Tabs */}
              <div className="mb-6 flex flex-wrap gap-1.5 border-b border-white/5 pb-4">
                {['All', ...categories].map((filter) => {
                  const isSelected = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/15'
                          : 'border border-white/5 text-zinc-400 bg-zinc-950/20 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <h2 className="mb-4 text-base font-semibold text-white flex items-center justify-between">
                <span>Recent Expenses</span>
                <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-white/5">
                  {filteredExpenses.length} entries
                </span>
              </h2>

              {/* Transactions stream list */}
              <div className="flex-grow">
                {filteredExpenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-950/15 py-12 px-4 text-center">
                    <div className="mb-3 rounded-full bg-zinc-900 p-3 text-zinc-500 border border-white/5">
                      <Wallet size={24} />
                    </div>
                    <p className="text-sm font-semibold text-zinc-300">No transactions matched</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[240px]">
                      Add some new expenses or adjust your category filter scope.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredExpenses.map((expense) => (
                      <li
                        key={expense._id}
                        className="group flex flex-col gap-3 rounded-xl border border-white/5 bg-zinc-900/30 p-3.5 sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:bg-zinc-900/60 hover:border-white/10 hover:translate-x-[2px]"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Category Badge Icon */}
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getCategoryColor(expense.category)}`}>
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-white truncate max-w-[200px] sm:max-w-[280px]">
                              {expense.title}
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              <span className="font-medium text-zinc-300">{expense.category}</span>
                              <span className="mx-1.5 opacity-30">•</span>
                              <span>{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <p className="font-bold text-sm text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-lg">
                            {formatCurrency(expense.amount)}
                          </p>
                          <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              type="button"
                              onClick={() => handleEdit(expense)}
                              className="rounded-lg border border-white/10 p-2 text-zinc-300 bg-zinc-900/50 hover:bg-white/5 hover:text-white transition duration-150 cursor-pointer"
                              aria-label="Edit expense"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(expense._id)}
                              className="rounded-lg border border-rose-500/20 p-2 text-rose-400 bg-zinc-900/50 hover:bg-rose-500/10 hover:text-rose-300 transition duration-150 cursor-pointer"
                              aria-label="Delete expense"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>

        </section>
      </main>

      {/* Modals rendered cleanly at the top of the React tree */}
      <Login isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} />
      <Register isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} />
      <Profile isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} />
      <WelcomePopup onRegister={() => setActiveModal('register')} />
    </div>
  )
}

function InputField({ label, type, value, onChange, placeholder, min, step }) {
  return (
    <div className="block">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-500/10"
        required
      />
    </div>
  )
}

function ChevronDown({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-white/10 group">
      {/* Radiant glow element */}
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${colorClass}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
      </div>

      {/* Decorative sparking analytics line */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-900">
        <div className={`h-full rounded-full bg-gradient-to-r ${
          label === 'Total Spent' ? 'from-indigo-500 via-purple-500 to-violet-500 w-[68%]' :
          label === 'Average Expense' ? 'from-cyan-500 to-sky-500 w-[42%]' :
          'from-emerald-500 to-teal-500 w-[55%]'
        }`} />
      </div>
    </article>
  )
}

export default App

