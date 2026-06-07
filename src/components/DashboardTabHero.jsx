import { ArrowUpRight, Coins, Layers, LineChart, ReceiptText, Sparkles, Target, User, Wallet } from 'lucide-react'

const tabMeta = {
  transactions: {
    icon: ReceiptText,
    eyebrow: 'Transaction Studio',
    title: 'Review every money move',
    copy: 'Scan spending, inspect notes, and keep this month clean before it becomes a surprise.',
    accent: '#38bdf8'
  },
  analysis: {
    icon: LineChart,
    eyebrow: 'Category Analysis',
    title: 'Compare month-by-month spending',
    copy: 'Spot category increases, decreases, and unusual movement before they become habits.',
    accent: '#a78bfa'
  },
  budgets: {
    icon: Target,
    eyebrow: 'Budget Target Lab',
    title: 'Turn goals into visible progress',
    copy: 'Create category targets, apply AI suggestions, and mark wins when a target is achieved.',
    accent: '#4ade80'
  },
  income: {
    icon: Coins,
    eyebrow: 'Income Control Room',
    title: 'Compare salary against spending',
    copy: 'Keep monthly income, expenses, and remaining balance in one clear decision surface.',
    accent: '#facc15'
  },
  profile: {
    icon: User,
    eyebrow: 'Account Profile',
    title: 'Keep account details current',
    copy: 'Update your contact details, rotate passwords, or permanently delete your account.',
    accent: '#fb7185'
  }
}

export default function DashboardTabHero({ activeTab, month, summary, expensesCount, budgetsCount, formatMoney }) {
  const meta = tabMeta[activeTab] || tabMeta.transactions
  const Icon = meta.icon

  return (
    <section className="dashboard-tab-hero" style={{ '--tab-accent': meta.accent }}>
      <div className="tab-hero-orbit" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="tab-hero-main">
        <div className="tab-hero-icon">
          <Icon size={26} />
        </div>
        <div>
          <span className="tab-hero-eyebrow">
            <Sparkles size={14} /> {meta.eyebrow}
          </span>
          <h2>{meta.title}</h2>
          <p>{meta.copy}</p>
        </div>
      </div>

      <div className="tab-hero-metrics">
        <article>
          <Wallet size={18} />
          <span>Balance</span>
          <strong>{formatMoney(summary?.remaining_balance || 0)}</strong>
        </article>
        <article>
          <Layers size={18} />
          <span>{activeTab === 'budgets' ? 'Targets' : 'Records'}</span>
          <strong>{activeTab === 'budgets' ? budgetsCount : expensesCount}</strong>
        </article>
        <article>
          <ArrowUpRight size={18} />
          <span>Month</span>
          <strong>{month}</strong>
        </article>
      </div>
    </section>
  )
}
