import React from 'react'
import {
  BadgeCheck,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards
} from 'lucide-react'

export default function DashboardLanyardCard({ userName, month, activeTab, summary, formatMoney }) {
  const firstName = userName?.split(' ')[0] || 'User'
  const balance = Number(summary?.remaining_balance || 0)
  const totalIncome = Number(summary?.total_income || 0)
  const totalExpense = Number(summary?.total_expense || 0)
  const savingsRate = totalIncome > 0 ? Math.max(((totalIncome - totalExpense) / totalIncome) * 100, 0) : 0
  const statusText = balance < 0 ? 'Needs action' : balance < 5000 ? 'Watch balance' : 'On track'
  const statusClass = balance < 0 ? 'is-danger' : balance < 5000 ? 'is-warning' : 'is-good'

  const overviewCopy =
    activeTab === 'overview'
      ? `Your ${month} financial overview is ready.`
      : activeTab === 'transactions'
      ? `Review every transaction recorded for ${month}.`
      : activeTab === 'budgets'
      ? `Create targets, track utilization, and mark wins for ${month}.`
      : `Compare salary and expenses for ${month}.`

  return (
    <section className="swap-profile-shell" aria-label="User financial profile cards">
      <div className="swap-profile-copy">
        <span className="swap-eyebrow">
          <Sparkles size={15} /> Smart workspace
        </span>
        <h2>Hi, {firstName}</h2>
        <p>{overviewCopy}</p>
        <div className={`swap-status ${statusClass}`}>
          <BadgeCheck size={17} />
          <span>{statusText}</span>
        </div>
      </div>

      <div className="swap-card-stage" aria-hidden="true">
        <article className="swap-card swap-card-back">
          <div className="swap-card-tab">
            <ShieldCheck size={18} />
            <span>Secured</span>
          </div>
          <div className="swap-card-body swap-card-security">
            <span>Session status</span>
            <strong>Protected</strong>
            <p>Encrypted dashboard access with synced monthly data.</p>
          </div>
        </article>

        <article className="swap-card swap-card-mid">
          <div className="swap-card-tab">
            <TrendingUp size={18} />
            <span>Performance</span>
          </div>
          <div className="swap-card-body">
            <div className="swap-metric-row">
              <span>Savings rate</span>
              <strong>{savingsRate.toFixed(1)}%</strong>
            </div>
            <div className="swap-mini-grid">
              <div>
                <TrendingUp size={15} />
                <span>{formatMoney(totalIncome)}</span>
              </div>
              <div>
                <TrendingDown size={15} />
                <span>{formatMoney(totalExpense)}</span>
              </div>
            </div>
          </div>
        </article>

        <article className="swap-card swap-card-front">
          <div className="swap-card-tab">
            <WalletCards size={18} />
            <span>Balance</span>
          </div>
          <div className="swap-card-body">
            <div className="swap-avatar">{firstName.charAt(0).toUpperCase()}</div>
            <span className="swap-card-label">Available balance</span>
            <strong className={balance < 0 ? 'is-danger' : ''}>{formatMoney(balance)}</strong>
            <div className="swap-card-footer">
              <span><CalendarDays size={14} /> {month}</span>
              <span>{statusText}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
