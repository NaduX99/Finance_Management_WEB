import { Target, Zap } from 'lucide-react'

export default function AiBudgetPlan({
  month,
  aiBudgetPlan,
  aiPlanSource,
  aiPlanLoading,
  aiPlanSaving,
  onGenerate,
  onApplyAll,
  onApplyTarget,
  formatMoney
}) {
  return (
    <div className="panel ai-budget-panel">
      <div className="ai-budget-head">
        <div>
          <span className="auth-kicker">AI Suggestion</span>
          <h3>Budget Plan Targets</h3>
        </div>
        <Zap size={24} color="#3b82f6" />
      </div>
      <p className="ai-budget-copy">
        Generate category targets for {month} from your income, spending pattern, and current budgets.
      </p>
      <div className="ai-budget-actions">
        <button type="button" className="btn-main" onClick={onGenerate} disabled={aiPlanLoading || aiPlanSaving}>
          {aiPlanLoading ? 'Generating...' : 'Generate AI Plan'}
        </button>
        <button type="button" className="btn-ghost" onClick={onApplyAll} disabled={aiPlanSaving || aiBudgetPlan.length === 0}>
          {aiPlanSaving ? 'Saving...' : 'Create All Targets'}
        </button>
      </div>
      {aiPlanSource && (
        <span className="ai-plan-source">
          {aiPlanSource === 'ai' ? 'Powered by AI' : 'Rule-based plan'}
        </span>
      )}
      <div className="ai-budget-list">
        {aiBudgetPlan.map((target) => (
          <article className="ai-budget-item" key={target.category_id}>
            <div>
              <strong>{target.category_name}</strong>
              <span>{target.reason}</span>
            </div>
            <div className="ai-budget-target">
              <strong>{formatMoney(target.suggested_amount)}</strong>
              <button
                type="button"
                className="icon-button"
                onClick={() => onApplyTarget(target)}
                disabled={aiPlanSaving}
                aria-label={`Create ${target.category_name} budget target`}
                title={`Create ${target.category_name} target`}
              >
                <Target size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
