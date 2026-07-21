import { BadgeCheck, Plus, Target, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const emptyGoal = {
  title: '',
  targetAmount: '',
  savedAmount: '',
  dueMonth: ''
}

export default function SavingsGoalPanel({ storageKey, formatMoney }) {
  const [goals, setGoals] = useState([])
  const [goalForm, setGoalForm] = useState(emptyGoal)

  useEffect(() => {
    if (!storageKey) return

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setGoals(Array.isArray(saved) ? saved : [])
    } catch (err) {
      setGoals([])
    }
  }, [storageKey])

  const saveGoals = (nextGoals) => {
    setGoals(nextGoals)
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(nextGoals))
  }

  const totals = useMemo(() => {
    return goals.reduce(
      (acc, goal) => ({
        target: acc.target + Number(goal.targetAmount || 0),
        saved: acc.saved + Number(goal.savedAmount || 0),
        achieved: acc.achieved + (goal.achieved ? 1 : 0)
      }),
      { target: 0, saved: 0, achieved: 0 }
    )
  }, [goals])

  const handleSubmit = (event) => {
    event.preventDefault()
    const targetAmount = Number(goalForm.targetAmount)
    const savedAmount = Number(goalForm.savedAmount || 0)

    if (!goalForm.title.trim() || !Number.isFinite(targetAmount) || targetAmount <= 0) return

    const nextGoal = {
      id: crypto.randomUUID(),
      title: goalForm.title.trim(),
      targetAmount,
      savedAmount: Math.max(savedAmount, 0),
      dueMonth: goalForm.dueMonth,
      achieved: savedAmount >= targetAmount,
      createdAt: new Date().toISOString()
    }

    saveGoals([nextGoal, ...goals])
    setGoalForm(emptyGoal)
  }

  const updateSavedAmount = (goalId, value) => {
    const savedAmount = Math.max(Number(value || 0), 0)
    saveGoals(goals.map((goal) => (
      goal.id === goalId
        ? { ...goal, savedAmount, achieved: savedAmount >= Number(goal.targetAmount || 0) || goal.achieved }
        : goal
    )))
  }

  const toggleAchieved = (goalId) => {
    saveGoals(goals.map((goal) => (
      goal.id === goalId ? { ...goal, achieved: !goal.achieved } : goal
    )))
  }

  const deleteGoal = (goalId) => {
    saveGoals(goals.filter((goal) => goal.id !== goalId))
  }

  return (
    <section className="panel savings-goal-panel">
      <div className="savings-goal-head">
        <div>
          <span className="auth-kicker">Saving Goals</span>
          <h3>Create Personal Targets</h3>
        </div>
        <Target size={26} color="#4ade80" />
      </div>

      <div className="savings-summary-grid">
        <article>
          <span>Total target</span>
          <strong>{formatMoney(totals.target)}</strong>
        </article>
        <article>
          <span>Total saved</span>
          <strong>{formatMoney(totals.saved)}</strong>
        </article>
        <article>
          <span>Achieved</span>
          <strong>{totals.achieved}</strong>
        </article>
      </div>

      <form className="saving-goal-form" onSubmit={handleSubmit}>
        <label className="tool-field">
          <span>Goal name</span>
          <input
            type="text"
            placeholder="Emergency fund"
            value={goalForm.title}
            onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
            required
          />
        </label>
        <label className="tool-field">
          <span>Target amount (LKR)</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={goalForm.targetAmount}
            onChange={(event) => setGoalForm({ ...goalForm, targetAmount: event.target.value })}
            required
          />
        </label>
        <label className="tool-field">
          <span>Already saved (LKR)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={goalForm.savedAmount}
            onChange={(event) => setGoalForm({ ...goalForm, savedAmount: event.target.value })}
          />
        </label>
        <label className="tool-field">
          <span>Due month</span>
          <input
            type="month"
            value={goalForm.dueMonth}
            onChange={(event) => setGoalForm({ ...goalForm, dueMonth: event.target.value })}
          />
        </label>
        <button type="submit" className="btn-main saving-goal-submit">
          <Plus size={18} /> Create Goal
        </button>
      </form>

      <div className="saving-goal-list">
        {goals.length === 0 ? (
          <p className="budget-empty">No saving goals created yet.</p>
        ) : (
          goals.map((goal) => {
            const targetAmount = Number(goal.targetAmount || 0)
            const savedAmount = Number(goal.savedAmount || 0)
            const percentage = targetAmount > 0 ? Math.min((savedAmount / targetAmount) * 100, 100) : 0

            return (
              <article className={`saving-goal-card ${goal.achieved ? 'is-achieved' : ''}`} key={goal.id}>
                <div className="saving-goal-card-top">
                  <div>
                    <strong>{goal.title}</strong>
                    <span>{goal.dueMonth ? `Due ${goal.dueMonth}` : 'No due month set'}</span>
                  </div>
                  <span className={`budget-status ${goal.achieved ? 'is-achieved' : ''}`}>
                    {goal.achieved && <BadgeCheck size={14} />}
                    {goal.achieved ? 'Achieved' : 'In progress'}
                  </span>
                </div>

                <div className="saving-goal-progress">
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${percentage}%`, background: goal.achieved ? '#3b82f6' : '#4ade80' }} />
                  </div>
                  <span>{percentage.toFixed(1)}%</span>
                </div>

                <div className="saving-goal-controls">
                  <label className="tool-field">
                    <span>Saved amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={goal.savedAmount}
                      onChange={(event) => updateSavedAmount(goal.id, event.target.value)}
                    />
                  </label>
                  <div className="saving-goal-amounts">
                    <span>{formatMoney(savedAmount)} saved</span>
                    <strong>{formatMoney(targetAmount)}</strong>
                  </div>
                </div>

                <div className="saving-goal-actions">
                  <button type="button" className={goal.achieved ? 'btn-achieved active' : 'btn-achieved'} onClick={() => toggleAchieved(goal.id)}>
                    <BadgeCheck size={16} />
                    {goal.achieved ? 'Marked Achieved' : 'Mark Achieved'}
                  </button>
                  <button type="button" className="btn-goal-delete" onClick={() => deleteGoal(goal.id)} aria-label={`Delete ${goal.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
