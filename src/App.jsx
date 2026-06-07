import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Cpu,
  ShieldCheck,
  LineChart,
  Layers,
  Zap,
  ArrowRight,
  PieChart as PieChartIcon,
  Wallet,
  Target,
  BadgeCheck,
  Mail,
  Lock,
  User,
  Phone,
  LogIn,
  UserPlus,
  Calculator,
  Coins,
  RefreshCw,
  ArrowLeftRight,
  MessageCircle,
  X,
  Menu,
  Send,
  Map as MapIcon,
  Flag,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Trash2
} from 'lucide-react'
import AuthDotBackground from './components/AuthDotBackground'
import AiBudgetPlan from './components/AiBudgetPlan'
import BudgetUtilization from './components/BudgetUtilization'
import DashboardLanyardCard from './components/DashboardLanyardCard'
import DashboardTabHero from './components/DashboardTabHero'
import HomeHero from './components/HomeHero'
import HomeCarousel from './components/HomeCarousel'
import HomeWorkflow from './components/HomeWorkflow'
import SavingsGoalPanel from './components/SavingsGoalPanel'
import BudgetTargetsTab from './components/BudgetTargetsTab'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 240

const moneyTips = [
  {
    title: 'Build an emergency buffer first',
    detail: 'Keep 3 to 6 months of essential expenses in cash before taking higher-risk investments.'
  },
  {
    title: 'Keep housing near 30% of take-home pay',
    detail: 'Rent or mortgage plus utilities close to this range helps keep monthly cash flow stable.'
  },
  {
    title: 'Prioritize high-interest debt',
    detail: 'Pay down balances above roughly 10% APR before focusing on low-yield investing.'
  },
  {
    title: 'Use a 24-hour pause for impulse buys',
    detail: 'For non-essential purchases, waiting one day reduces reactive spending and buyer regret.'
  }
]

const recommendations = [
  {
    title: 'Enable payday auto-transfer',
    detail: 'Move 15 to 20% of income to savings on payday so saving happens before spending.',
    impact: 'High impact'
  },
  {
    title: 'Set category limits with alerts',
    detail: 'Start with food, transport, and entertainment caps based on your last 90 days of spending.',
    impact: 'Medium impact'
  },
  {
    title: 'Review subscriptions every 90 days',
    detail: 'Cancel or downgrade services you used less than twice in the last month.',
    impact: 'Quick win'
  }
]

const currencyList = ['USD', 'LKR', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'CNY', 'SGD', 'AED']

const emptyLoginForm = {
  email: '',
  password: ''
}

const emptyRegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
}

const emptyResetForm = {
  password: '',
  confirmPassword: ''
}

function getFramePath(index) {
  const num = String(index).padStart(3, '0')
  return `/images/ezgif-frame-${num}.jpg`
}

function AuthInput({ icon: Icon, label, ...props }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-input-wrap">
        <Icon size={18} />
        <input {...props} />
      </div>
    </label>
  )
}

function formatMoney(value, currency = 'LKR') {
  const num = Number(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(Number.isFinite(num) ? num : 0)
}

function FixedDepositCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [months, setMonths] = useState(12)
  const [compound, setCompound] = useState('simple')

  const result = useMemo(() => {
    const amount = Number(principal) || 0
    const annualRate = (Number(rate) || 0) / 100
    const years = (Number(months) || 0) / 12
    const periods = compound === 'monthly' ? 12 : compound === 'quarterly' ? 4 : 0
    const maturity =
      periods > 0 ? amount * Math.pow(1 + annualRate / periods, periods * years) : amount * (1 + annualRate * years)

    return {
      interest: Math.max(maturity - amount, 0),
      maturity
    }
  }, [principal, rate, months, compound])

  return (
    <article className="tool-card">
      <div className="tool-card-head">
        <div>
          <span className="auth-kicker">Fixed Deposit</span>
          <h3>FD Calculator</h3>
        </div>
        <Calculator size={28} color="#22c55e" />
      </div>

      <div className="tool-form">
        <label className="tool-field">
          <span>Deposit amount</span>
          <input type="number" min="0" value={principal} onChange={(event) => setPrincipal(event.target.value)} />
        </label>
        <label className="tool-field">
          <span>Annual interest rate (%)</span>
          <input type="number" min="0" step="0.1" value={rate} onChange={(event) => setRate(event.target.value)} />
        </label>
        <label className="tool-field">
          <span>Period in months</span>
          <input type="number" min="1" value={months} onChange={(event) => setMonths(event.target.value)} />
        </label>
        <label className="tool-field">
          <span>Calculation type</span>
          <select value={compound} onChange={(event) => setCompound(event.target.value)}>
            <option value="simple">Simple interest</option>
            <option value="monthly">Monthly compound</option>
            <option value="quarterly">Quarterly compound</option>
          </select>
        </label>
      </div>

      <div className="result-grid">
        <article>
          <span>Total interest</span>
          <strong>{formatMoney(result.interest)}</strong>
        </article>
        <article>
          <span>Maturity value</span>
          <strong>{formatMoney(result.maturity)}</strong>
        </article>
      </div>
    </article>
  )
}

function CurrencyTools() {
  const [rates, setRates] = useState(null)
  const [updated, setUpdated] = useState('')
  const [status, setStatus] = useState('Loading daily rates...')
  const [amount, setAmount] = useState(100)
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('LKR')

  const loadRates = useCallback(async () => {
    setStatus('Loading daily rates...')
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD')
      const data = await response.json()

      if (data.result !== 'success') {
        throw new Error('Rate service returned an error.')
      }

      setRates(data.rates)
      setUpdated(data.time_last_update_utc || '')
      setStatus('')
    } catch (error) {
      setStatus('Unable to load live rates right now. Try refresh again later.')
    }
  }, [])

  useEffect(() => {
    loadRates()
  }, [loadRates])

  const converted = useMemo(() => {
    if (!rates?.[from] || !rates?.[to]) return 0
    const usdAmount = (Number(amount) || 0) / rates[from]
    return usdAmount * rates[to]
  }, [amount, from, rates, to])

  const visibleRates = currencyList.filter((code) => rates?.[code])

  return (
    <article className="tool-card">
      <div className="tool-card-head">
        <div>
          <span className="auth-kicker">Foreign Currency</span>
          <h3>Daily Rates & Converter</h3>
        </div>
        <Coins size={28} color="#22c55e" />
      </div>

      <div className="currency-actions">
        <p>{updated ? `Updated: ${updated}` : status}</p>
        <button className="icon-button" type="button" onClick={loadRates} aria-label="Refresh currency rates">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="converter-row">
        <label className="tool-field">
          <span>Amount</span>
          <input type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label className="tool-field">
          <span>From</span>
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            {currencyList.map((code) => <option key={code}>{code}</option>)}
          </select>
        </label>
        <button
          className="swap-button"
          type="button"
          onClick={() => {
            setFrom(to)
            setTo(from)
          }}
          aria-label="Swap currencies"
        >
          <ArrowLeftRight size={18} />
        </button>
        <label className="tool-field">
          <span>To</span>
          <select value={to} onChange={(event) => setTo(event.target.value)}>
            {currencyList.map((code) => <option key={code}>{code}</option>)}
          </select>
        </label>
      </div>

      <div className="conversion-result">
        <span>Converted amount</span>
        <strong>{formatMoney(converted, to)}</strong>
      </div>

      <div className="rates-grid" aria-label="Daily currency rates against Sri Lankan rupee">
        {visibleRates.map((code) => (
          <article key={code}>
            <span>{code} to LKR</span>
            <strong>{rates?.LKR && rates?.[code] ? (rates.LKR / rates[code]).toFixed(2) : '-'}</strong>
          </article>
        ))}
      </div>
    </article>
  )
}

function AiChatbot({ token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ messages: newMsgs })
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMsgs, data.data]);
      }
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button className="chatbot-trigger" onClick={() => setIsOpen(true)}>
        <MessageCircle size={24} />
      </button>
      {isOpen && (
        <div className="chatbot-overlay">
          <div className="chatbot-header">
            <div>
              <strong>Green Bolt</strong>
              <span className="online-status">Online</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-chat"><X size={20} /></button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <p>Hello! I'm your AI financial advisor. How can I help you today?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && <div className="chat-message assistant typing"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <button type="submit" disabled={loading || !input.trim()}><Send size={18} /></button>
          </form>
        </div>
      )}
    </>
  );
}

function AiTipsBanner({ token, month, summary }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !month) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/ai/tips/${month}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setTips(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, month, summary]);

  if (loading) {
    return (
      <div className="ai-tips-banner loading">
        <Zap className="spin" size={20} color="#3b82f6" />
        <span>AI is analyzing your finances for {month}...</span>
      </div>
    );
  }

  if (tips.length === 0) return null;

  return (
    <div className="ai-tips-banner">
      <div className="tips-header">
        <Zap size={20} color="#3b82f6" />
        <strong>AI Insights for {month}</strong>
      </div>
      <ul className="tips-list">
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

function AuthPage({ mode, onModeChange, onBackHome, onAuthSuccess, resetToken, onResetComplete }) {
  const isLogin = mode === 'login'
  const isRecover = mode === 'recover'
  const isReset = mode === 'reset'
  const [loginForm, setLoginForm] = useState(emptyLoginForm)
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [resetForm, setResetForm] = useState(emptyResetForm)
  const [recoverEmail, setRecoverEmail] = useState('')
  const [message, setMessage] = useState('')
  const [authToast, setAuthToast] = useState(null)

  const showToast = (msg) => {
    setAuthToast(msg)
    setTimeout(() => setAuthToast(null), 5000)
  }

  const updateLogin = (event) => {
    const { name, value } = event.target
    setLoginForm((form) => ({ ...form, [name]: value }))
  }

  const updateRegister = (event) => {
    const { name, value } = event.target
    setRegisterForm((form) => ({ ...form, [name]: value }))
  }

  const updateReset = (event) => {
    const { name, value } = event.target
    setResetForm((form) => ({ ...form, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setMessage('Logging in...')
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (data.success) {
        onAuthSuccess(data.token)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Network error. Is the server running?')
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }
    setMessage('Creating account...')
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: registerForm.fullName,
          email: registerForm.email,
          phone: registerForm.phone,
          password: registerForm.password
        })
      })
      const data = await res.json()
      if (data.success) {
        showToast(data.emailSent
          ? 'Success! Registration email has been sent to your address.'
          : data.emailSimulated
          ? 'Success! Account created. Email is simulated until SMTP is configured.'
          : 'Success! Account created, but email could not be sent right now.'
        )
        setTimeout(() => onAuthSuccess(data.token), 2500)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Network error. Is the server running?')
    }
  }

  const handleRecover = async (event) => {
    event.preventDefault()
    setMessage('Sending recovery email...')
    try {
      const res = await fetch('http://localhost:5000/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoverEmail })
      })
      const data = await res.json()
      if (data.success) {
        showToast('Success! Password reset link has been sent to your email.')
        setMessage('')
        setTimeout(() => onModeChange('login'), 2500)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Network error.')
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    if (resetForm.password !== resetForm.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setMessage('Resetting password...')
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: resetForm.password })
      })
      const data = await res.json()
      if (data.success) {
        showToast('Success! Password reset complete. Please login.')
        setResetForm(emptyResetForm)
        setMessage('')
        setTimeout(() => {
          onResetComplete?.()
          onModeChange('login')
        }, 1800)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Network error.')
    }
  }

  return (
    <main className="auth-page">
      <AuthDotBackground />
      {authToast && <div className="toast"><BadgeCheck color="#22c55e" /> {authToast}</div>}
      <section className="auth-shell">
        <div className="auth-brand-panel">
          <button className="auth-home-link" type="button" onClick={onBackHome}>
            GREEN FINANCE
          </button>
          <div className="ai-tag">
            <ShieldCheck size={14} /> Secure Account Access
          </div>
          <h1>{isLogin ? 'Welcome Back' : isReset ? 'Set New Password' : isRecover ? 'Recover Account' : 'Create Your Account'}</h1>
          <p>
            {isLogin
              ? 'Sign in to continue tracking expenses, budgets, and daily financial insights.'
              : isReset
              ? 'Create a new password from your secure recovery link.'
              : isRecover 
              ? 'Enter your email address and we will send you a secure link to recover your account.'
              : 'Start your personal finance dashboard with a clean account profile ready for your database.'}
          </p>
          <div className="auth-metrics" aria-label="Account benefits">
            <article>
              <strong>240</strong>
              <span>visual frames</span>
            </article>
            <article>
              <strong>AI</strong>
              <span>insight core</span>
            </article>
            <article>
              <strong>MySQL</strong>
              <span>ready later</span>
            </article>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <div>
              <span className="auth-kicker">{isLogin ? 'Login' : isReset ? 'Password Reset' : isRecover ? 'Recovery' : 'Registration'}</span>
              <h2>{isLogin ? 'Access account' : isReset ? 'New password' : isRecover ? 'Reset password' : 'New account'}</h2>
            </div>
            {isLogin ? <LogIn size={28} color="#22c55e" /> : isRecover || isReset ? <Lock size={28} color="#22c55e" /> : <UserPlus size={28} color="#22c55e" />}
          </div>

          {!isReset && <div className="auth-switch" role="tablist" aria-label="Authentication mode">
            <button
              className={isLogin ? 'active' : ''}
              type="button"
              onClick={() => {
                setMessage('')
                onModeChange('login')
              }}
            >
              Login
            </button>
            <button
              className={!isLogin && !isRecover ? 'active' : ''}
              type="button"
              onClick={() => {
                setMessage('')
                onModeChange('register')
              }}
            >
              Register
            </button>
          </div>}

          {isReset ? (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <AuthInput
                icon={Lock}
                label="New password"
                name="password"
                type="password"
                placeholder="Create new password"
                value={resetForm.password}
                onChange={updateReset}
                minLength="6"
                required
              />
              <AuthInput
                icon={Lock}
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                value={resetForm.confirmPassword}
                onChange={updateReset}
                minLength="6"
                required
              />
              <button className="btn-main auth-submit" type="submit">
                Reset Password <ArrowRight size={18} />
              </button>
            </form>
          ) : isRecover ? (
            <form className="auth-form" onSubmit={handleRecover}>
              <AuthInput
                icon={Mail}
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                required
              />
              <button className="btn-main auth-submit" type="submit">
                Send Recovery Email <ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => onModeChange('login')} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', marginTop: '10px', cursor: 'pointer' }}>
                Back to Login
              </button>
            </form>
          ) : isLogin ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <AuthInput
                icon={Mail}
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={updateLogin}
                required
              />
              <AuthInput
                icon={Lock}
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={updateLogin}
                required
              />
              <button className="btn-main auth-submit" type="submit">
                Login <ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => onModeChange('recover')} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', marginTop: '10px', cursor: 'pointer' }}>
                Forgot Password?
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <AuthInput
                icon={User}
                label="Full name"
                name="fullName"
                type="text"
                placeholder="Your name"
                value={registerForm.fullName}
                onChange={updateRegister}
                required
              />
              <AuthInput
                icon={Mail}
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={registerForm.email}
                onChange={updateRegister}
                required
              />
              <AuthInput
                icon={Phone}
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={registerForm.phone}
                onChange={updateRegister}
              />
              <AuthInput
                icon={Lock}
                label="Password"
                name="password"
                type="password"
                placeholder="Create password"
                value={registerForm.password}
                onChange={updateRegister}
                minLength="6"
                required
              />
              <AuthInput
                icon={Lock}
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={registerForm.confirmPassword}
                onChange={updateRegister}
                minLength="6"
                required
              />
              <button className="btn-main auth-submit" type="submit">
                Create Account <ArrowRight size={18} />
              </button>
            </form>
          )}

          {message && <p className="auth-message">{message}</p>}
        </div>
      </section>
    </main>
  )
}

function Dashboard({ token, onLogout, onTokenRefresh }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dbMenuOpen, setDbMenuOpen] = useState(false)
  const [summary, setSummary] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [previousExpenses, setPreviousExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [income, setIncome] = useState(null)
  const [trends, setTrends] = useState([])
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '', phone: '', current_password: '', new_password: '' })
  const [deletePassword, setDeletePassword] = useState('')
  
  const [newExpense, setNewExpense] = useState({ category_id: '', amount: '', expense_date: '', note: '' })
  const [newBudget, setNewBudget] = useState({ category_id: '', amount: '' })
  const [aiBudgetPlan, setAiBudgetPlan] = useState([])
  const [aiPlanSource, setAiPlanSource] = useState('')
  const [aiPlanLoading, setAiPlanLoading] = useState(false)
  const [aiPlanSaving, setAiPlanSaving] = useState(false)
  const [achievedTargets, setAchievedTargets] = useState({})
  const [newIncome, setNewIncome] = useState({ salary_amount: '', extra_income: '' })
  
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const user = useMemo(() => {
    try { return jwtDecode(token) } catch(e) { return null }
  }, [token])

  const previousMonth = useMemo(() => {
    const [year, monthNumber] = month.split('-').map(Number)
    const date = new Date(year, monthNumber - 2, 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }, [month])

  const achievedStorageKey = useMemo(() => {
    return user?.user_id ? `green-finance-achieved-targets-${user.user_id}-${month}` : ''
  }, [month, user])

  const savingsGoalStorageKey = useMemo(() => {
    return user?.user_id ? `green-finance-saving-goals-${user.user_id}-${month}` : ''
  }, [month, user])

  const fetchDashboard = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [sumRes, expRes, prevExpRes, catRes, budRes, incRes, trendRes] = await Promise.all([
        fetch(`http://localhost:5000/api/dashboard/summary/${month}`, { headers }),
        fetch(`http://localhost:5000/api/expenses?month=${month}`, { headers }),
        fetch(`http://localhost:5000/api/expenses?month=${previousMonth}`, { headers }),
        fetch(`http://localhost:5000/api/expenses/categories`, { headers }),
        fetch(`http://localhost:5000/api/budgets/${month}`, { headers }),
        fetch(`http://localhost:5000/api/income/${month}`, { headers }),
        fetch(`http://localhost:5000/api/dashboard/trends`, { headers })
      ])
      const [sumData, expData, prevExpData, catData, budData, incData, trendData] = await Promise.all([
        sumRes.json(), expRes.json(), prevExpRes.json(), catRes.json(), budRes.json(), incRes.json(), trendRes.json()
      ])
      if (sumData.success) setSummary(sumData.data)
      if (expData.success) setExpenses(expData.data)
      if (prevExpData.success) setPreviousExpenses(prevExpData.data)
      if (catData.success) setCategories(catData.data)
      if (budData.success) setBudgets(budData.data)
      if (incData.success) {
        setIncome(incData.data)
        setNewIncome({
          salary_amount: incData.data ? incData.data.salary_amount : '',
          extra_income: incData.data ? incData.data.extra_income : ''
        })
      }
      if (trendData.success) setTrends(trendData.data)
    } catch (err) {
      console.error(err)
    }
  }, [token, month, previousMonth])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setProfileForm((form) => ({
          ...form,
          full_name: data.data.full_name || '',
          email: data.data.email || '',
          phone: data.data.phone || ''
        }))
      }
    } catch (err) {
      toast.error('Unable to load profile')
    }
  }, [token])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (!achievedStorageKey) return

    try {
      const savedTargets = JSON.parse(localStorage.getItem(achievedStorageKey) || '{}')
      setAchievedTargets(savedTargets && typeof savedTargets === 'object' ? savedTargets : {})
    } catch (err) {
      setAchievedTargets({})
    }
  }, [achievedStorageKey])

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newExpense)
      })
      const data = await res.json()
      if (data.success) {
        setNewExpense({ category_id: '', amount: '', expense_date: '', note: '' })
        fetchDashboard()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Error adding expense')
    }
  }
  
  const handleAddBudget = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          category_id: newBudget.category_id,
          month_key: month,
          amount: newBudget.amount
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewBudget({ category_id: '', amount: '' })
        fetchDashboard()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Error setting budget')
    }
  }

  const loadAiBudgetPlan = async () => {
    setAiPlanLoading(true)
    setAiPlanSource('')
    try {
      const res = await fetch(`http://localhost:5000/api/ai/budget-plan/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setAiBudgetPlan(data.data || [])
        setAiPlanSource(data.source || 'ai')
        if (data.message) toast.info(data.message)
      } else {
        toast.error(data.message || 'Unable to generate budget plan')
      }
    } catch (err) {
      toast.error('Error generating budget plan')
    } finally {
      setAiPlanLoading(false)
    }
  }

  const saveBudgetTarget = async (target, showSuccess = true) => {
    const res = await fetch('http://localhost:5000/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        category_id: target.category_id,
        month_key: month,
        amount: target.suggested_amount
      })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Unable to save budget')
    if (showSuccess) toast.success(`${target.category_name} target created`)
  }

  const applyBudgetTarget = async (target) => {
    setAiPlanSaving(true)
    try {
      await saveBudgetTarget(target)
      await fetchDashboard()
    } catch (err) {
      toast.error(err.message || 'Error creating target')
    } finally {
      setAiPlanSaving(false)
    }
  }

  const applyAllBudgetTargets = async () => {
    if (aiBudgetPlan.length === 0) return
    setAiPlanSaving(true)
    try {
      await Promise.all(aiBudgetPlan.map((target) => saveBudgetTarget(target, false)))
      toast.success('AI budget targets created')
      await fetchDashboard()
    } catch (err) {
      toast.error(err.message || 'Error creating budget targets')
    } finally {
      setAiPlanSaving(false)
    }
  }

  const toggleTargetAchieved = (categoryId) => {
    setAchievedTargets((current) => {
      const key = String(categoryId)
      const next = { ...current, [key]: !current[key] }
      if (!next[key]) delete next[key]
      if (achievedStorageKey) localStorage.setItem(achievedStorageKey, JSON.stringify(next))
      return next
    })
  }

  const handleSaveIncome = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          month_key: month,
          salary_amount: newIncome.salary_amount,
          extra_income: newIncome.extra_income || 0
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Income details saved successfully!')
        fetchDashboard()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Error saving income details')
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDashboard()
    } catch (err) {}
  }

  const pieData = useMemo(() => {
    const grouped = expenses.reduce((acc, exp) => {
      acc[exp.category_name] = (acc[exp.category_name] || 0) + Number(exp.amount)
      return acc
    }, {})
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }))
  }, [expenses])

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  const barData = useMemo(() => {
    return [
      { name: 'Income', amount: Number(summary?.total_income || 0), fill: '#22c55e' },
      { name: 'Expense', amount: Number(summary?.total_expense || 0), fill: '#ef4444' }
    ]
  }, [summary])

  const analysisData = useMemo(() => {
    const grouped = new Map()
    const addAmount = (expense, key) => {
      const category = expense.category_name || 'Uncategorized'
      const current = grouped.get(category) || { category, current: 0, previous: 0 }
      current[key] += Number(expense.amount) || 0
      grouped.set(category, current)
    }

    expenses.forEach((expense) => addAmount(expense, 'current'))
    previousExpenses.forEach((expense) => addAmount(expense, 'previous'))

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
        change: item.current - item.previous,
        changePercent: item.previous > 0 ? ((item.current - item.previous) / item.previous) * 100 : item.current > 0 ? 100 : 0
      }))
      .sort((a, b) => Math.max(b.current, b.previous) - Math.max(a.current, a.previous))
  }, [expenses, previousExpenses])

  const analysisTotals = useMemo(() => {
    const current = analysisData.reduce((sum, item) => sum + item.current, 0)
    const previous = analysisData.reduce((sum, item) => sum + item.previous, 0)
    const change = current - previous
    const topIncrease = analysisData.reduce((top, item) => item.change > (top?.change ?? -Infinity) ? item : top, null)
    const topDecrease = analysisData.reduce((top, item) => item.change < (top?.change ?? Infinity) ? item : top, null)
    return { current, previous, change, topIncrease, topDecrease }
  }, [analysisData])

  const budgetProgress = useMemo(() => {
    return budgets.map(b => {
      const spent = expenses
        .filter(e => e.category_name === b.category_name)
        .reduce((sum, e) => sum + Number(e.amount), 0)
      
      const budgetAmount = Number(b.budget_amount)
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
      const remaining = budgetAmount - spent
      const overBudget = spent > budgetAmount
      const markedAchieved = Boolean(achievedTargets[String(b.category_id)])
      
      return {
        ...b,
        spent,
        budgetAmount,
        remaining,
        percentage: Math.min(percentage, 100),
        overBudget,
        markedAchieved,
        status: markedAchieved ? 'Achieved' : overBudget ? 'Over target' : percentage >= 80 ? 'Nearly there' : 'On track'
      }
    })
  }, [achievedTargets, budgets, expenses])

  const isLowBalance = Number(summary?.remaining_balance ?? Infinity) < 5000

  return (
    <div className={`dashboard-layout${isLowBalance ? ' low-balance-warning' : ''}`}>
      {/* Mobile Top Header for Dashboard */}
      <header className="dashboard-mobile-header">
        <button className="logo logo-button" type="button" onClick={() => setActiveTab('overview')}>
          <span>GREEN</span> FINANCE
        </button>
        <button
          className={`db-hamburger${dbMenuOpen ? ' active' : ''}`}
          type="button"
          onClick={() => setDbMenuOpen(!dbMenuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={dbMenuOpen}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {dbMenuOpen && (
        <div className="db-mobile-overlay" onClick={() => setDbMenuOpen(false)}>
          <div className="db-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="db-mobile-drawer-header">
              <a href="#" className="sidebar-logo" onClick={() => { setActiveTab('overview'); setDbMenuOpen(false); }}>GREEN<span>FINANCE</span></a>
              <button className="close-db-menu" onClick={() => setDbMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="db-mobile-nav">
              <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setDbMenuOpen(false); }}><PieChartIcon size={20} /> <span>Overview</span></button>
              <button className={`sidebar-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => { setActiveTab('transactions'); setDbMenuOpen(false); }}><Wallet size={20} /> <span>Transactions</span></button>
              <button className={`sidebar-link ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => { setActiveTab('analysis'); setDbMenuOpen(false); }}><LineChart size={20} /> <span>Analysis</span></button>
              <button className={`sidebar-link ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => { setActiveTab('budgets'); setDbMenuOpen(false); }}><Target size={20} /> <span>Budgets</span></button>
              <button className={`sidebar-link ${activeTab === 'targets' ? 'active' : ''}`} onClick={() => { setActiveTab('targets'); setDbMenuOpen(false); }}><MapIcon size={20} /> <span>Budget Targets</span></button>
              <button className={`sidebar-link ${activeTab === 'income' ? 'active' : ''}`} onClick={() => { setActiveTab('income'); setDbMenuOpen(false); }}><Coins size={20} /> <span>Income & Salary</span></button>
              <button className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setDbMenuOpen(false); }}><User size={20} /> <span>Profile</span></button>
              <button className="sidebar-link" onClick={() => { onLogout(); setDbMenuOpen(false); }} style={{ marginTop: 'auto', color: '#ef4444' }}>
                <LogIn size={20} style={{ transform: 'rotate(180deg)' }} /> <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile screen size) */}
      <aside className="dashboard-sidebar">
        <a href="#" className="sidebar-logo">GREEN<span>FINANCE</span></a>
        <nav className="sidebar-nav">
          <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><PieChartIcon size={20} /> <span>Overview</span></button>
          <button className={`sidebar-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}><Wallet size={20} /> <span>Transactions</span></button>
          <button className={`sidebar-link ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}><LineChart size={20} /> <span>Analysis</span></button>
          <button className={`sidebar-link ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')}><Target size={20} /> <span>Budgets</span></button>
          <button className={`sidebar-link ${activeTab === 'targets' ? 'active' : ''}`} onClick={() => setActiveTab('targets')}><MapIcon size={20} /> <span>Budget Targets</span></button>
          <button className={`sidebar-link ${activeTab === 'income' ? 'active' : ''}`} onClick={() => setActiveTab('income')}><Coins size={20} /> <span>Income & Salary</span></button>
          <button className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={20} /> <span>Profile</span></button>
        </nav>
        <button className="sidebar-link" onClick={onLogout} style={{ marginTop: 'auto', color: '#ef4444' }}>
          <LogIn size={20} style={{ transform: 'rotate(180deg)' }} /> <span>Logout</span>
        </button>
      </aside>
      
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <DashboardLanyardCard
            userName={user?.full_name}
            month={month}
            activeTab={activeTab}
            summary={summary}
            formatMoney={formatMoney}
          />
        )}

        {activeTab !== 'overview' && (
          <DashboardTabHero
            activeTab={activeTab}
            month={month}
            summary={summary}
            expensesCount={expenses.length}
            budgetsCount={budgets.length}
            formatMoney={formatMoney}
            budgetProgress={budgetProgress}
          />
        )}

        <div className="dashboard-header dashboard-header-card">
          <div>
            <h2>{activeTab === 'overview' ? 'Financial Command Center' : activeTab === 'transactions' ? 'Transaction Studio' : activeTab === 'analysis' ? 'Category Analysis' : activeTab === 'budgets' ? 'Budget Setup Lab' : activeTab === 'targets' ? 'Budget Targets & Roadmap' : activeTab === 'profile' ? 'Account Profile' : 'Income Control Room'}</h2>
            <p>
              {activeTab === 'overview' ? `Advanced financial overview for ${month}` : activeTab === 'transactions' ? `All transactions for ${month}` : activeTab === 'analysis' ? `Compare category spending between ${previousMonth} and ${month}` : activeTab === 'budgets' ? `Set category budgets and AI plans for ${month}` : activeTab === 'targets' ? `Visual roadmap and remaining balance for ${month}` : activeTab === 'profile' ? 'Update your account details, password, and account status.' : `Income and salary insights for ${month}`}
            </p>
          </div>
          <div className="dashboard-header-actions">
            <input 
              type="month" 
              value={month} 
              onChange={e => setMonth(e.target.value)}
              className="month-picker"
            />
          </div>
        </div>

        {isLowBalance && (
          <div className="low-balance-alert" role="alert">
            <div className="low-balance-alert-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="low-balance-alert-body">
              <strong>âš  Critical Low Balance Warning</strong>
              <span>Your remaining balance has dropped below <b>LKR 5,000</b>. Review your expenses immediately and avoid non-essential spending.</span>
            </div>
            <div className="low-balance-alert-amount">
              {formatMoney(summary?.remaining_balance || 0)}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <AiTipsBanner token={token} month={month} summary={summary} />
            <div className="dashboard-stats">
              <article className="stat-card">
                <span>Total Income</span>
                <strong style={{ color: '#22c55e' }}>{formatMoney(summary?.total_income || 0)}</strong>
              </article>
              <article className="stat-card">
                <span>Total Expenses</span>
                <strong style={{ color: '#ef4444' }}>{formatMoney(summary?.total_expense || 0)}</strong>
              </article>
              <article className={`stat-card${isLowBalance ? ' stat-card-danger' : ''}`}>
                <span>Remaining Balance</span>
                <strong style={{ color: isLowBalance ? '#ff4444' : undefined }}>
                  {formatMoney(summary?.remaining_balance || 0)}
                </strong>
                {isLowBalance && <span className="stat-card-danger-badge">LOW</span>}
              </article>
            </div>

            <div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
              <div className="panel" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h3>Spending by Category</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip formatter={(val) => formatMoney(val)} contentStyle={{ backgroundColor: 'rgba(2,6,12,0.9)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ color: 'var(--text-dim)', margin: 'auto', textAlign: 'center' }}>No expenses recorded this month.</p>}
              </div>

              <div className="panel" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <h3>Cash Flow</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="var(--text-dim)" />
                    <RechartsTooltip formatter={(val) => formatMoney(val)} cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(2,6,12,0.9)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="panel" style={{ marginBottom: '40px' }}>
              <h3>Quick Add Expense</h3>
              <form className="tool-form" onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'end' }}>
                <label className="tool-field">
                  <span>Category</span>
                  <select required value={newExpense.category_id} onChange={e => setNewExpense({...newExpense, category_id: e.target.value})}>
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                  </select>
                </label>
                <label className="tool-field">
                  <span>Amount</span>
                  <input type="number" required min="1" step="0.01" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                </label>
                <label className="tool-field">
                  <span>Date</span>
                  <input type="date" required value={newExpense.expense_date} onChange={e => setNewExpense({...newExpense, expense_date: e.target.value})} />
                </label>
                <label className="tool-field">
                  <span>Note (Optional)</span>
                  <input type="text" value={newExpense.note} onChange={e => setNewExpense({...newExpense, note: e.target.value})} />
                </label>
                <button type="submit" className="btn-main" style={{ padding: '12px' }}>Add</button>
              </form>
            </div>
          </>
        )}

        {(activeTab === 'transactions' || activeTab === 'overview') && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Note</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No expenses recorded.</td></tr>
                )}
                {expenses.map(exp => (
                  <tr key={exp.expense_id}>
                    <td style={{ color: 'var(--text-dim)' }}>{new Date(exp.expense_date).toLocaleDateString()}</td>
                    <td><span className="tag">{exp.category_name}</span></td>
                    <td>{exp.note || '-'}</td>
                    <td style={{ color: '#ef4444', fontWeight: '600' }}>{formatMoney(exp.amount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleDelete(exp.expense_id)}
                        aria-label={`Delete ${exp.category_name} expense`}
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-page">
            <div className="analysis-summary-grid">
              <article className="analysis-summary-card">
                <span>Current month</span>
                <strong>{formatMoney(analysisTotals.current)}</strong>
                <small>{month}</small>
              </article>
              <article className="analysis-summary-card">
                <span>Previous month</span>
                <strong>{formatMoney(analysisTotals.previous)}</strong>
                <small>{previousMonth}</small>
              </article>
              <article className={`analysis-summary-card ${analysisTotals.change > 0 ? 'is-up' : analysisTotals.change < 0 ? 'is-down' : ''}`}>
                <span>Net change</span>
                <strong>{formatMoney(Math.abs(analysisTotals.change))}</strong>
                <small>{analysisTotals.change > 0 ? 'Spending increased' : analysisTotals.change < 0 ? 'Spending decreased' : 'No change'}</small>
              </article>
            </div>

            <div className="analysis-grid">
              <section className="panel analysis-chart-panel">
                <div className="analysis-panel-head">
                  <div>
                    <h3>Category Comparison</h3>
                    <p>{previousMonth} vs {month}</p>
                  </div>
                  <span className="analysis-chip">{analysisData.length} categories</span>
                </div>

                {analysisData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={analysisData} margin={{ top: 20, right: 20, left: 10, bottom: 42 }}>
                      <XAxis dataKey="category" stroke="var(--text-dim)" angle={-22} textAnchor="end" interval={0} height={72} />
                      <YAxis stroke="var(--text-dim)" tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                      <RechartsTooltip
                        formatter={(value, name) => [formatMoney(value), name === 'previous' ? previousMonth : month]}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: 'rgba(2,6,12,0.94)', border: '1px solid var(--border-light)', borderRadius: '10px' }}
                      />
                      <Bar dataKey="previous" fill="#64748b" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="current" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="analysis-empty">No category data is available for these two months yet.</p>
                )}
              </section>

              <aside className="analysis-insights">
                <article className="analysis-insight-card">
                  <span>Largest increase</span>
                  <strong>{analysisTotals.topIncrease?.change > 0 ? analysisTotals.topIncrease.category : 'No increase'}</strong>
                  <p>{analysisTotals.topIncrease?.change > 0 ? `${formatMoney(analysisTotals.topIncrease.change)} more than ${previousMonth}` : 'Current month spending did not increase in any category.'}</p>
                </article>

                <article className="analysis-insight-card">
                  <span>Largest decrease</span>
                  <strong>{analysisTotals.topDecrease?.change < 0 ? analysisTotals.topDecrease.category : 'No decrease'}</strong>
                  <p>{analysisTotals.topDecrease?.change < 0 ? `${formatMoney(Math.abs(analysisTotals.topDecrease.change))} less than ${previousMonth}` : 'No category has decreased yet.'}</p>
                </article>
              </aside>
            </div>

            <section className="panel">
              <div className="analysis-panel-head">
                <div>
                  <h3>Category Movement</h3>
                  <p>Every category compared against the previous month.</p>
                </div>
              </div>
              <div className="analysis-list">
                {analysisData.length === 0 && <p className="analysis-empty">No analysis rows to show.</p>}
                {analysisData.map((item) => (
                  <article key={item.category} className="analysis-row">
                    <div>
                      <strong>{item.category}</strong>
                      <span>{previousMonth}: {formatMoney(item.previous)} | {month}: {formatMoney(item.current)}</span>
                    </div>
                    <div className={item.change > 0 ? 'analysis-delta is-up' : item.change < 0 ? 'analysis-delta is-down' : 'analysis-delta'}>
                      {item.change > 0 ? '+' : item.change < 0 ? '-' : ''}
                      {formatMoney(Math.abs(item.change))}
                      <small>{Math.abs(item.changePercent).toFixed(1)}%</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="budgets-grid">
            <div className="panel">
              <h3>Set Category Budget</h3>
              <form className="tool-form" onSubmit={handleAddBudget}>
                <label className="tool-field">
                  <span>Category</span>
                  <select required value={newBudget.category_id} onChange={e => setNewBudget({...newBudget, category_id: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                  </select>
                </label>
                <label className="tool-field" style={{ marginTop: '15px' }}>
                  <span>Target Amount (LKR)</span>
                  <input type="number" required min="1" step="0.01" value={newBudget.amount} onChange={e => setNewBudget({...newBudget, amount: e.target.value})} />
                </label>
                <button type="submit" className="btn-main" style={{ marginTop: '20px', width: '100%' }}>Save Budget</button>
              </form>
            </div>

            <AiBudgetPlan
              month={month}
              aiBudgetPlan={aiBudgetPlan}
              aiPlanSource={aiPlanSource}
              aiPlanLoading={aiPlanLoading}
              aiPlanSaving={aiPlanSaving}
              onGenerate={loadAiBudgetPlan}
              onApplyAll={applyAllBudgetTargets}
              onApplyTarget={applyBudgetTarget}
              formatMoney={formatMoney}
            />
          </div>
        )}

        {activeTab === 'targets' && <BudgetTargetsTab
          summary={summary}
          budgetProgress={budgetProgress}
          isLowBalance={isLowBalance}
          month={month}
          formatMoney={formatMoney}
          toggleTargetAchieved={toggleTargetAchieved}
          savingsGoalStorageKey={savingsGoalStorageKey}
        />}

        {activeTab === 'profile' && (
          <div className="profile-page">
            <section className="panel profile-panel">
              <div className="profile-card-head">
                <div className="profile-avatar">{profileForm.full_name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <h3>Profile Details</h3>
                  <p>Keep your contact details and login email up to date.</p>
                </div>
              </div>

              <form className="tool-form profile-form" onSubmit={handleProfileUpdate}>
                <label className="tool-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  />
                </label>
                <label className="tool-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </label>
                <label className="tool-field">
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </label>
                <label className="tool-field">
                  <span>Current password</span>
                  <input
                    type="password"
                    placeholder="Required only when changing password"
                    value={profileForm.current_password}
                    onChange={(e) => setProfileForm({ ...profileForm, current_password: e.target.value })}
                  />
                </label>
                <label className="tool-field">
                  <span>New password</span>
                  <input
                    type="password"
                    minLength="6"
                    placeholder="Leave blank to keep current password"
                    value={profileForm.new_password}
                    onChange={(e) => setProfileForm({ ...profileForm, new_password: e.target.value })}
                  />
                </label>
                <button className="btn-main" type="submit">Update Profile</button>
              </form>
            </section>

            <section className="panel profile-danger-panel">
              <h3>Delete Account</h3>
              <p>Deleting your account removes your profile and all related finance records.</p>
              <form className="tool-form" onSubmit={handleProfileDelete}>
                <label className="tool-field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    required
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                </label>
                <button className="btn-delete-account" type="submit">
                  <Trash2 size={18} /> Delete My Account
                </button>
              </form>
            </section>
          </div>
        )}

        {activeTab === 'income' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
            <div className="panel">
              <h3>Manage Monthly Salary</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '8px 0 20px 0' }}>
                Set your salary and other monthly earnings to compare against expenses and track your savings rate.
              </p>
              <form className="tool-form" onSubmit={handleSaveIncome}>
                <label className="tool-field">
                  <span>Salary Amount (LKR)</span>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    step="0.01" 
                    value={newIncome.salary_amount} 
                    onChange={e => setNewIncome({...newIncome, salary_amount: e.target.value})} 
                  />
                </label>
                <label className="tool-field" style={{ marginTop: '15px' }}>
                  <span>Extra / Bonus Income (LKR)</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={newIncome.extra_income} 
                    onChange={e => setNewIncome({...newIncome, extra_income: e.target.value})} 
                  />
                </label>
                <button type="submit" className="btn-main" style={{ marginTop: '25px', width: '100%' }}>Save Salary</button>
              </form>
            </div>
            
            <div className="comparison-card">
              <h3>Compare Month Expenses</h3>
              
              <div className="comparison-stats">
                <div className="comparison-stat">
                  <span>Monthly Salary</span>
                  <strong className="is-income">{formatMoney(Number(income?.salary_amount || 0) + Number(income?.extra_income || 0))}</strong>
                </div>
                <div className="comparison-stat">
                  <span>Monthly Expenses</span>
                  <strong className="is-expense">{formatMoney(summary?.total_expense || 0)}</strong>
                </div>
              </div>

              <div className="comparison-ratio-panel">
                {(() => {
                  const totalIncome = Number(income?.salary_amount || 0) + Number(income?.extra_income || 0)
                  const totalExpense = Number(summary?.total_expense || 0)
                  
                  if (totalIncome === 0) {
                    return (
                      <p className="comparison-empty">
                        Please enter your monthly salary to enable financial comparison and insights.
                      </p>
                    )
                  }

                  const spentPercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0
                  const remaining = totalIncome - totalExpense
                  const remainingPercentage = 100 - spentPercentage

                  const ratioColor = spentPercentage > 100 ? '#ef4444' : spentPercentage > 80 ? '#f59e0b' : '#22c55e'

                  return (
                    <div>
                      <div className="comparison-ratio-head">
                        <span>Expense-to-Income Ratio</span>
                        <strong style={{ color: ratioColor }}>
                          {spentPercentage.toFixed(1)}%
                        </strong>
                      </div>
                      <div className="comparison-progress">
                        <div 
                          className="comparison-progress-fill" 
                          style={{ 
                            width: `${Math.min(spentPercentage, 100)}%`, 
                            background: ratioColor,
                            minWidth: spentPercentage > 0 ? '10px' : '0'
                          }}
                        />
                      </div>

                      <div className="comparison-balance-wrap">
                        {remaining >= 0 ? (
                          <div className="comparison-balance is-positive">
                            <strong>Positive Balance:</strong> You've saved <br/>
                            <strong>{remainingPercentage.toFixed(1)}%</strong> of your income <br/>
                            ({formatMoney(remaining)}).
                          </div>
                        ) : (
                          <div className="comparison-balance is-negative">
                            <strong>Caution (Overspending):</strong> Your expenses exceed your income by <br/>
                            <strong>{formatMoney(Math.abs(remaining))}</strong>. <br/>
                            Try trimming non-essential budgets.
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
            
            {/* Trends Chart */}
            <div className="panel" style={{ gridColumn: '1 / -1', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
              <h3>Historical Trends: Salary vs Expenses</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', margin: '5px 0 20px 0' }}>
                Track how your income compares with expenses month over month. Keep expenses below salary for financial stability.
              </p>
              {trends.length > 0 ? (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month_key" stroke="var(--text-dim)" />
                      <YAxis stroke="var(--text-dim)" />
                      <RechartsTooltip formatter={(val) => formatMoney(val)} cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(2,6,12,0.9)', border: '1px solid var(--border-light)', borderRadius: '8px' }} />
                      <Bar name="Total Income (Salary)" dataKey="total_income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                      <Bar name="Total Expenses" dataKey="total_expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p style={{ color: 'var(--text-dim)', margin: 'auto', textAlign: 'center' }}>No historical trend data available yet.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get('resetToken') || '')
  const [page, setPage] = useState(() => resetToken ? 'reset' : 'home')
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [menuOpen, setMenuOpen] = useState(false)
  const canvasRef = useRef(null)

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setPage('home')
  }

  const handleProfileUpdate = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setProfileForm((form) => ({ ...form, current_password: '', new_password: '' }))
        if (data.token) onTokenRefresh(data.token)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Error updating profile')
    }
  }

  const handleProfileDelete = async (event) => {
    event.preventDefault()
    if (!window.confirm('Delete your account permanently? This removes your profile and all related data.')) return

    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: deletePassword })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        onLogout()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Error deleting account')
    }
  }

  const handleTokenRefresh = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const handleResetComplete = () => {
    setResetToken('')
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  useEffect(() => {
    if (token) return;

    // Text Animations
    const elements = document.querySelectorAll('.js-text-animation');
    elements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 }, 
        { 
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 3D Canvas Scroll Animation
    if (page === 'home' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const currentFrame = index => `/images/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;
      const images = [];
      let imagesLoaded = 0;
      
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === 1) {
            // Set canvas to exact image resolution for crispness
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        }
        images.push(img);
      }
      
      const playhead = { frame: 0 };
      gsap.to(playhead, {
        frame: TOTAL_FRAMES - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: "#main-content",
          start: "top top",
          end: "+=2000",
          scrub: 1
        },
        onUpdate: () => {
          if (images[playhead.frame] && images[playhead.frame].complete) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[playhead.frame], 0, 0, canvas.width, canvas.height);
          }
        }
      });
    }

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [token, page])

  const goHome = () => {
    setMenuOpen(false)
    setPage('home')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const goSection = (sectionId) => {
    setMenuOpen(false)
    setPage('home')
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <>
      {!token && (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="container">
            <div className="nav-content">
              <button className="logo logo-button" type="button" onClick={goHome}>
                <span>GREEN</span> FINANCE
              </button>
              <ul className="nav-links">
                <li><button type="button" onClick={() => goSection('features')}>Features</button></li>
                <li><button type="button" onClick={() => goSection('tools')}>Tools</button></li>
                <li><button type="button" onClick={() => goSection('analytics')}>Insights</button></li>
              </ul>
              <div className="nav-actions">
                <button className="btn-nav-outline" onClick={() => setPage('login')}>Login</button>
                <button className="btn-nav" onClick={() => setPage('register')}>Sign Up Free</button>
              </div>
              <button
                className={`hamburger${menuOpen ? ' active' : ''}`}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      )}

      {!token && menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <ul className="mobile-menu-links">
              <li><button type="button" onClick={() => { goSection('features'); setMenuOpen(false) }}>Features</button></li>
              <li><button type="button" onClick={() => { goSection('tools'); setMenuOpen(false) }}>Tools</button></li>
              <li><button type="button" onClick={() => { goSection('analytics'); setMenuOpen(false) }}>Insights</button></li>
            </ul>
            <div className="mobile-menu-actions">
              <button className="btn-nav-outline" onClick={() => { setPage('login'); setMenuOpen(false) }}>Login</button>
              <button className="btn-nav" onClick={() => { setPage('register'); setMenuOpen(false) }}>Sign Up Free</button>
            </div>
          </div>
        </div>
      )}

      {token ? (
        <Dashboard token={token} onLogout={handleLogout} onTokenRefresh={handleTokenRefresh} />
      ) : page !== 'home' ? (
        <AuthPage
          mode={page}
          onModeChange={setPage}
          onBackHome={goHome}
          onAuthSuccess={handleAuthSuccess}
          resetToken={resetToken}
          onResetComplete={handleResetComplete}
        />
      ) : (
      <main id="main-content">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
        <div className="canvas-overlay"></div>
        <HomeHero onStart={() => setPage('register')} onExplore={() => goSection('tools')} />
        <HomeCarousel />

        <section className="section" id="features">
          <div className="container">
            <div className="section-head js-text-animation">
              <h2>Features that empower you</h2>
              <p>Everything you need to manage your personal finances like a pro, all in one secure platform.</p>
            </div>

            <div className="features-grid js-text-animation">
              <div className="feature-card">
                <ShieldCheck size={32} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h3>Bank-grade Security</h3>
                <p>Your financial data is encrypted and securely stored. We never share your personal information.</p>
              </div>

              <div className="feature-card">
                <LineChart size={32} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h3>Advanced Analytics</h3>
                <p>Understand your spending habits with interactive charts and AI-powered categorization.</p>
              </div>

              <div className="feature-card">
                <Cpu size={32} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h3>Smart Budgets</h3>
                <p>Set automated limits and get alerted before you overspend in any category.</p>
              </div>
            </div>
          </div>
        </section>

        <HomeWorkflow />

        <section className="section tools-section" id="tools">
          <div className="container">
            <div className="section-head js-text-animation">
              <h2>Advanced Financial Tools</h2>
              <p>Calculate fixed deposit returns and check foreign currency daily rates directly without logging in.</p>
            </div>

            <div className="tools-grid js-text-animation">
              <FixedDepositCalculator />
              <CurrencyTools />
            </div>
          </div>
        </section>

        <section className="section cta-section">
          <div className="container">
            <div className="cta-panel js-text-animation">
              <h2 className="cta-title">Ready to master your finances?</h2>
              <p className="cta-copy">
                Join thousands of users who have completely transformed how they manage their money.
              </p>
              <button className="btn-main" onClick={() => setPage('register')} style={{ padding: '20px 50px', fontSize: '1.2rem' }}>
                Create Free Account
              </button>
            </div>
          </div>
        </section>

        <footer className="site-footer" id="security">
          <div className="container site-footer-inner">
            <div className="footer-brand">
              <h3><span>GREEN</span> FINANCE</h3>
              <p>Smarter expense tracking, practical budgeting, and clear next-step recommendations to elevate your financial life.</p>
            </div>
            
            <div className="footer-column">
              <h4>Product</h4>
              <div className="footer-links">
                <button onClick={() => goSection('features')}>Features</button>
                <button onClick={() => goSection('tools')}>Free Tools</button>
                <button onClick={() => goSection('analytics')}>Insights</button>
                <button onClick={() => goSection('features')}>Security</button>
              </div>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <div className="footer-links">
                <button onClick={() => goSection('hero')}>About Us</button>
                <button onClick={() => goSection('hero')}>Careers</button>
                <button onClick={() => goSection('hero')}>Privacy Policy</button>
                <button onClick={() => goSection('hero')}>Terms of Service</button>
              </div>
            </div>

            <div className="footer-column">
              <h4>Stay Updated</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '10px' }}>Join our newsletter for the latest financial tips.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="button">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="container footer-bottom">
            <div>&copy; 2026 GREEN FINANCE. All rights reserved.</div>
            <div className="footer-social">
              <span>Twitter</span>
              <span>LinkedIn</span>
              <span>GitHub</span>
            </div>
          </div>
        </footer>
      </main>
      )}
      <AiChatbot token={token} />
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  )
}
