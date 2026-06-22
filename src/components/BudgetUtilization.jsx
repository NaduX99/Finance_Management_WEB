import { BadgeCheck } from 'lucide-react'

export default function BudgetUtilization({ budgetProgress, formatMoney, onToggleAchieved }) {
  return (
    <div className="panel budget-utilization-panel">
      <h3>Budget Utilization</h3>
      <div className="budget-list">
        {budgetProgress.length === 0 ? (
          <p className="budget-empty">No budgets set for this month.</p>
        ) : (
          budgetProgress.map((budget) => (
            <div
              key={budget.budget_id}
              className={`budget-item ${budget.markedAchieved ? 'is-achieved' : ''} ${budget.overBudget ? 'is-over' : ''}`}
            >
              <div className="budget-header">
                <div>
                  <strong>{budget.category_name}</strong>
                  <span>
                    {budget.markedAchieved
                      ? 'Target completed and marked'
                      : `${formatMoney(Math.max(budget.remaining, 0))} left`}
                  </span>
                </div>
                <span className={`budget-status ${budget.markedAchieved ? 'is-achieved' : budget.overBudget ? 'is-over' : ''}`}>
                  {budget.markedAchieved && <BadgeCheck size={14} />}
                  {budget.status}
                </span>
              </div>

              <div className="budget-money-row">
                <div>
                  <span>Spent</span>
                  <strong className={budget.overBudget ? 'is-danger' : ''}>{formatMoney(budget.spent)}</strong>
                </div>
                <div>
                  <span>Target</span>
                  <strong>{formatMoney(budget.budgetAmount)}</strong>
                </div>
                <div>
                  <span>{budget.overBudget ? 'Over by' : 'Remaining'}</span>
                  <strong className={budget.overBudget ? 'is-danger' : 'is-positive'}>
                    {formatMoney(Math.abs(budget.remaining))}
                  </strong>
                </div>
              </div>

              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${budget.percentage}%`,
                    background: budget.markedAchieved ? '#3b82f6' : budget.overBudget ? '#ef4444' : '#22c55e'
                  }}
                />
              </div>

              <div className="budget-card-actions">
                <span>{Math.min((budget.budgetAmount > 0 ? (budget.spent / budget.budgetAmount) * 100 : 0), 999).toFixed(1)}% used</span>
                <button
                  type="button"
                  className={budget.markedAchieved ? 'btn-achieved active' : 'btn-achieved'}
                  onClick={() => onToggleAchieved(budget.category_id)}
                >
                  <BadgeCheck size={16} />
                  {budget.markedAchieved ? 'Marked Achieved' : 'Mark Achieved'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
