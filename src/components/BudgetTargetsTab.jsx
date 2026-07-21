import { useMemo, useState } from 'react'
import {
  TrendingUp, AlertCircle, Wallet, Target,
  CheckCircle2, Flag, BadgeCheck, Map,
  ArrowUpRight, ArrowDownRight, Flame, Trophy
} from 'lucide-react'
import BudgetUtilization from './BudgetUtilization'
import SavingsGoalPanel from './SavingsGoalPanel'

export default function BudgetTargetsTab({
  summary,
  budgetProgress,
  isLowBalance,
  month,
  formatMoney,
  toggleTargetAchieved,
  savingsGoalStorageKey
}) {
  const totalBudget   = budgetProgress.reduce((s, b) => s + b.budgetAmount, 0)
  const totalSpent    = budgetProgress.reduce((s, b) => s + b.spent, 0)
  const onTrackCount  = budgetProgress.filter(b =>
    !b.overBudget && !b.markedAchieved &&
    (b.budgetAmount > 0 ? (b.spent / b.budgetAmount) * 100 : 0) < 80
  ).length
  const nearlyCount   = budgetProgress.filter(b =>
    !b.overBudget && !b.markedAchieved &&
    (b.budgetAmount > 0 ? (b.spent / b.budgetAmount) * 100 : 0) >= 80
  ).length
  const overCount     = budgetProgress.filter(b => b.overBudget).length
  const achievedCount = budgetProgress.filter(b => b.markedAchieved).length
  const remainBal     = Number(summary?.remaining_balance || 0)
  const overallPct    = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0

  const healthScore = useMemo(() => {
    if (budgetProgress.length === 0) return 100
    const onTrack = budgetProgress.filter(b => !b.overBudget).length
    return Math.round((onTrack / budgetProgress.length) * 100)
  }, [budgetProgress])

  const healthColor = healthScore >= 80 ? '#22c55e' : healthScore >= 50 ? '#f59e0b' : '#ef4444'
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Needs Work' : 'Critical'

  return (
    <div className="bt-page">

      {/* ══════ Hero Banner ══════ */}
      <div className="bt-hero">
        <div className="bt-hero-glow" />
        <div className="bt-hero-content">
          <div className="bt-hero-left">
            <span className="bt-hero-badge">
              <Target size={14} /> Budget Targets
            </span>
            <h2 className="bt-hero-title">
              Financial Roadmap
              <span className="bt-hero-month">{month}</span>
            </h2>
            <p className="bt-hero-sub">
              Track every category budget, monitor your spending health, and hit your savings goals.
            </p>
          </div>
          <div className="bt-hero-ring">
            <svg viewBox="0 0 120 120" className="bt-ring-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={healthColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${healthScore * 3.27} 327`}
                transform="rotate(-90 60 60)"
                style={{ filter: `drop-shadow(0 0 8px ${healthColor}66)`, transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <div className="bt-ring-label">
              <strong style={{ color: healthColor }}>{healthScore}</strong>
              <span>{healthLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ Stat Cards ══════ */}
      <div className="bt-stats-row">
        <div className="bt-stat-card bt-stat-income">
          <div className="bt-stat-icon"><TrendingUp size={20} /></div>
          <div className="bt-stat-info">
            <span>Total Income</span>
            <strong>{formatMoney(summary?.total_income || 0)}</strong>
          </div>
          <ArrowUpRight size={18} className="bt-stat-arrow up" />
        </div>
        <div className="bt-stat-card bt-stat-expense">
          <div className="bt-stat-icon"><AlertCircle size={20} /></div>
          <div className="bt-stat-info">
            <span>Total Expenses</span>
            <strong>{formatMoney(summary?.total_expense || 0)}</strong>
          </div>
          <ArrowDownRight size={18} className="bt-stat-arrow down" />
        </div>
        <div className={`bt-stat-card bt-stat-balance${isLowBalance ? ' bt-danger' : ''}`}>
          <div className="bt-stat-icon"><Wallet size={20} /></div>
          <div className="bt-stat-info">
            <span>Remaining</span>
            <strong>{formatMoney(remainBal)}</strong>
          </div>
          {isLowBalance && <span className="bt-low-badge">LOW</span>}
        </div>
        <div className="bt-stat-card bt-stat-budget">
          <div className="bt-stat-icon"><Target size={20} /></div>
          <div className="bt-stat-info">
            <span>Total Budgeted</span>
            <strong>{formatMoney(totalBudget)}</strong>
          </div>
        </div>
      </div>

      {/* ══════ Status Chips ══════ */}
      <div className="bt-chips">
        <div className="bt-chip bt-chip-green"><CheckCircle2 size={14} /> {onTrackCount} On Track</div>
        <div className="bt-chip bt-chip-amber"><Flame size={14} /> {nearlyCount} Nearly There</div>
        <div className="bt-chip bt-chip-red"><AlertCircle size={14} /> {overCount} Over Budget</div>
        <div className="bt-chip bt-chip-blue"><Trophy size={14} /> {achievedCount} Achieved</div>
      </div>

      {/* ══════ Overall Progress Bar ══════ */}
      <div className="bt-overall">
        <div className="bt-overall-head">
          <span>Overall Budget Consumption</span>
          <strong style={{ color: overallPct > 90 ? '#ef4444' : overallPct > 70 ? '#f59e0b' : '#22c55e' }}>
            {overallPct.toFixed(1)}%
          </strong>
        </div>
        <div className="bt-overall-track">
          <div
            className="bt-overall-fill"
            style={{
              width: `${overallPct}%`,
              background: overallPct > 90
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : overallPct > 70
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : 'linear-gradient(90deg, #22c55e, #16a34a)'
            }}
          />
        </div>
        <div className="bt-overall-legend">
          <span>Spent: {formatMoney(totalSpent)}</span>
          <span>Budget: {formatMoney(totalBudget)}</span>
        </div>
      </div>

      {/* ══════ Main Content Grid ══════ */}
      <div className="bt-main-grid">

        {/* ── LEFT: Roadmap Timeline ── */}
        <div className="bt-roadmap-panel">
          <div className="bt-roadmap-header">
            <div>
              <span className="bt-kicker">Visual Progress</span>
              <h3>Budget Roadmap</h3>
            </div>
            <Map size={24} color="#4ade80" />
          </div>
          <p className="bt-roadmap-desc">
            Each milestone represents a category budget. Complete all milestones to reach your month-end target.
          </p>

          {budgetProgress.length === 0 ? (
            <div className="bt-roadmap-empty">
              <Target size={44} color="#475569" />
              <p>No budgets set yet.<br />Go to the <strong>Budgets</strong> tab to create category targets.</p>
            </div>
          ) : (
            <div className="bt-timeline">
              {budgetProgress.map((b, idx) => {
                const pct = b.budgetAmount > 0
                  ? Math.min((b.spent / b.budgetAmount) * 100, 100)
                  : 0
                const nodeColor = b.markedAchieved
                  ? '#3b82f6'
                  : b.overBudget
                    ? '#ef4444'
                    : pct >= 80 ? '#f59e0b' : '#22c55e'

                return (
                  <div
                    key={b.budget_id}
                    className={`bt-milestone${b.overBudget ? ' bt-over' : ''}${b.markedAchieved ? ' bt-achieved' : ''}`}
                  >
                    {/* Connector */}
                    <div className="bt-connector">
                      <div className="bt-node" style={{ background: nodeColor, boxShadow: `0 0 18px ${nodeColor}55` }}>
                        {b.markedAchieved
                          ? <CheckCircle2 size={14} color="#fff" />
                          : b.overBudget
                            ? <AlertCircle size={14} color="#fff" />
                            : <Flag size={14} color="#fff" />}
                      </div>
                      {idx < budgetProgress.length - 1 && (
                        <div className="bt-vline" style={{ background: `linear-gradient(to bottom, ${nodeColor}, ${nodeColor}22)` }} />
                      )}
                    </div>

                    {/* Card */}
                    <div className="bt-ms-card">
                      <div className="bt-ms-top">
                        <strong>{b.category_name}</strong>
                        <span className={`bt-ms-badge${b.markedAchieved ? ' achieved' : b.overBudget ? ' over' : pct >= 80 ? ' warn' : ''}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="bt-ms-bar-row">
                        <div className="bt-ms-bar-track">
                          <div className="bt-ms-bar-fill" style={{ width: `${pct}%`, background: nodeColor }} />
                        </div>
                        <span className="bt-ms-pct" style={{ color: nodeColor }}>{pct.toFixed(0)}%</span>
                      </div>

                      <div className="bt-ms-amounts">
                        <div>
                          <span>Spent</span>
                          <strong style={{ color: b.overBudget ? '#f87171' : '#f1f5f9' }}>{formatMoney(b.spent)}</strong>
                        </div>
                        <div>
                          <span>Target</span>
                          <strong>{formatMoney(b.budgetAmount)}</strong>
                        </div>
                        <div>
                          <span>{b.overBudget ? 'Over by' : 'Left'}</span>
                          <strong style={{ color: b.overBudget ? '#f87171' : '#4ade80' }}>
                            {formatMoney(Math.abs(b.remaining))}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`bt-achieve-btn${b.markedAchieved ? ' active' : ''}`}
                        onClick={() => toggleTargetAchieved(b.category_id)}
                      >
                        <BadgeCheck size={15} />
                        {b.markedAchieved ? 'Achieved ✓' : 'Mark Achieved'}
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Finish Milestone */}
              <div className="bt-milestone bt-finish">
                <div className="bt-connector">
                  <div className="bt-node bt-finish-node">
                    <Trophy size={14} color="#fff" />
                  </div>
                </div>
                <div className="bt-ms-card bt-finish-card">
                  <strong>🏁 Month End Target</strong>
                  <p>
                    Budget: <strong>{formatMoney(totalBudget)}</strong> — 
                    Spent: <strong>{formatMoney(totalSpent)}</strong> — 
                    <span style={{ color: totalSpent > totalBudget ? '#f87171' : '#4ade80' }}>
                      {totalSpent > totalBudget
                        ? `Over by ${formatMoney(totalSpent - totalBudget)}`
                        : `Under by ${formatMoney(totalBudget - totalSpent)}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Utilization + Savings ── */}
        <div className="bt-right-col">
          <BudgetUtilization
            budgetProgress={budgetProgress}
            formatMoney={formatMoney}
            onToggleAchieved={toggleTargetAchieved}
          />
          <SavingsGoalPanel
            storageKey={savingsGoalStorageKey}
            formatMoney={formatMoney}
          />
          <SavingsRoadmapCalculator 
            initialSalary={Number(summary?.total_income || 150000)} 
            formatMoney={formatMoney} 
          />
        </div>
      </div>
    </div>
  )
}

function SavingsRoadmapCalculator({ initialSalary, formatMoney }) {
  const [salary, setSalary] = useState(initialSalary || 150000)
  const [savingsRate, setSavingsRate] = useState(20)

  const monthlySavings = (salary * savingsRate) / 100

  const milestones = [
    { months: 3, label: "Emergency Buffer (3m)", desc: "Covers short-term unexpected bills." },
    { months: 6, label: "Full Security Cushion (6m)", desc: "Provides peace of mind during transitions." },
    { months: 12, label: "Autonomy Landmark (1yr)", desc: "Gives leverage to pursue new opportunities." },
    { months: 36, label: "Milestone Capital Vault (3yr)", desc: "Wealth generation or house downpayment." }
  ]

  return (
    <article className="panel savings-calculator-panel" style={{ marginTop: '30px' }}>
      <div className="ai-budget-head">
        <div>
          <span className="auth-kicker">Interactive Goals</span>
          <h3>Savings Roadmap Calculator</h3>
        </div>
        <Trophy size={28} color="#e5c158" />
      </div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.45' }}>
        Adjust your salary and savings target rate to instantly project future financial landmarks on your personal roadmap.
      </p>

      <div className="calc-inputs" style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
        <div className="tool-field">
          <span>Monthly Income Base (LKR)</span>
          <input 
            type="number" 
            min="0" 
            value={salary} 
            onChange={(e) => setSalary(Number(e.target.value))} 
          />
        </div>
        
        <div className="tool-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d9e8ff', fontSize: '0.82rem', fontWeight: '600' }}>
            <span>Savings Target Rate</span>
            <strong style={{ color: 'var(--primary)' }}>{savingsRate}%</strong>
          </div>
          <input 
            type="range" 
            min="5" 
            max="80" 
            step="5"
            value={savingsRate} 
            onChange={(e) => setSavingsRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '8px', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="calc-summary" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '12px', border: '1px solid var(--border-primary)', marginBottom: '25px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>PROJECTED MONTHLY SAVINGS</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--primary)', marginTop: '4px' }}>
            {formatMoney(monthlySavings)}
          </strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ANNUAL ACCUMULATION</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: '#bfdbfe', marginTop: '4px' }}>
            {formatMoney(monthlySavings * 12)}
          </strong>
        </div>
      </div>

      <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#f8fafc' }}>Roadmap Landmarks</h4>
      <div className="calc-milestones" style={{ display: 'grid', gap: '12px' }}>
        {milestones.map((milestone, i) => {
          const targetValue = monthlySavings * milestone.months
          const colors = ['#4ade80', '#22c55e', '#3b82f6', '#8b5cf6']
          return (
            <div key={i} className="calc-milestone-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'rgba(2, 6, 12, 0.4)' }}>
              <div className="milestone-badge-glow" style={{ width: '42px', height: '42px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${colors[i % colors.length]}`, boxShadow: `0 0 12px ${colors[i % colors.length]}44`, color: colors[i % colors.length], fontWeight: '800', fontSize: '0.85rem' }}>
                {milestone.months}m
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#f1f5f9' }}>{milestone.label}</strong>
                  <strong style={{ fontSize: '1rem', color: colors[i % colors.length] }}>{formatMoney(targetValue)}</strong>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{milestone.desc}</span>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
