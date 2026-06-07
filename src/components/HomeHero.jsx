import { ArrowRight, BadgeCheck, LineChart, ShieldCheck, Sparkles, Target, Wallet, Zap } from 'lucide-react'

export default function HomeHero({ onStart, onExplore }) {
  return (
    <section className="hero home-hero">
      <div className="bg-grid"></div>

      <div className="container home-hero-grid">
        <div className="home-hero-copy js-text-animation">
          <div className="hero-badge">
            <Sparkles size={16} /> AI Budget Planning Now Live
          </div>
          <h1>
            GREEN FINANCE
            <span> Plan smarter. Spend calmer.</span>
          </h1>
          <p>
            Track expenses, create monthly targets, compare income against spending, and turn your data into clear next actions.
          </p>

          <div className="hero-actions">
            <button className="btn-main" type="button" onClick={onStart}>
              Start Free <ArrowRight size={20} />
            </button>
            <button className="btn-ghost" type="button" onClick={onExplore}>
              View Tools
            </button>
          </div>

          <div className="hero-stats-row">
            <article className="hero-stat-pill">
              <span>Monthly control</span>
              <strong>Budgets</strong>
            </article>
            <article className="hero-stat-pill">
              <span>Smart guidance</span>
              <strong>AI Tips</strong>
            </article>
            <article className="hero-stat-pill">
              <span>Local database</span>
              <strong>MySQL</strong>
            </article>
          </div>
        </div>

        <div className="hero-product-panel js-text-animation">
          <div className="hero-product-top">
            <div>
              <span>June Overview</span>
              <strong>LKR 82,450 left</strong>
            </div>
            <BadgeCheck size={26} />
          </div>

          <div className="hero-balance-card">
            <div>
              <span>Income</span>
              <strong>LKR 240,000</strong>
            </div>
            <div>
              <span>Expenses</span>
              <strong>LKR 157,550</strong>
            </div>
          </div>

          <div className="hero-mini-chart" aria-hidden="true">
            <span style={{ height: '46%' }}></span>
            <span style={{ height: '70%' }}></span>
            <span style={{ height: '38%' }}></span>
            <span style={{ height: '82%' }}></span>
            <span style={{ height: '58%' }}></span>
            <span style={{ height: '74%' }}></span>
          </div>

          <div className="hero-goal-list">
            <article>
              <Target size={18} />
              <div>
                <strong>Food target</strong>
                <span>62% used</span>
              </div>
            </article>
            <article>
              <Wallet size={18} />
              <div>
                <strong>Savings plan</strong>
                <span>On track</span>
              </div>
            </article>
            <article>
              <Zap size={18} />
              <div>
                <strong>AI suggestion</strong>
                <span>Reduce transport by 8%</span>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className="hero-feature-strip container">
        <article>
          <ShieldCheck size={19} />
          <span>Secure account access</span>
        </article>
        <article>
          <LineChart size={19} />
          <span>Income vs expense trends</span>
        </article>
        <article>
          <Target size={19} />
          <span>Target achievement marking</span>
        </article>
      </div>
    </section>
  )
}
