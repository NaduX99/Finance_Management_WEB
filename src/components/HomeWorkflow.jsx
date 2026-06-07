import { BadgeCheck, BrainCircuit, CircleDollarSign, ListChecks } from 'lucide-react'

const workflowItems = [
  {
    icon: CircleDollarSign,
    title: 'Record money flow',
    detail: 'Add salary, extra income, and daily expenses for the selected month.'
  },
  {
    icon: BrainCircuit,
    title: 'Generate a plan',
    detail: 'Use AI budget suggestions to create category targets from real spending data.'
  },
  {
    icon: ListChecks,
    title: 'Track utilization',
    detail: 'See spent, target, remaining, and over-budget status in one clean view.'
  },
  {
    icon: BadgeCheck,
    title: 'Mark targets achieved',
    detail: 'Complete a target when you are satisfied with the result for that month.'
  }
]

export default function HomeWorkflow() {
  return (
    <section className="section workflow-section" id="analytics">
      <div className="container">
        <div className="section-head js-text-animation">
          <h2>From daily spending to clear decisions</h2>
          <p>GREEN FINANCE keeps the workflow practical: enter data, get targets, watch progress, and close the month with confidence.</p>
        </div>

        <div className="workflow-grid js-text-animation">
          {workflowItems.map((item, index) => {
            const Icon = item.icon
            return (
              <article className="workflow-card" key={item.title}>
                <span className="workflow-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="workflow-icon">
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
