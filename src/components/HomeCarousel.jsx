import React from 'react'

export default function HomeCarousel() {
  const quantity = 10
  const items = [
    { pos: 1, img: '/assets/income_tracking.png', title: 'Income Tracking', desc: 'Monitor your monthly salary and extra earnings.' },
    { pos: 2, img: '/assets/budget_planning.png', title: 'Smart Budgets', desc: 'Create custom targets per category easily.' },
    { pos: 3, img: '/assets/ai_insights.png', title: 'AI Insights', desc: 'Receive daily tailored financial advice.' },
    { pos: 4, img: '/assets/savings_vault.png', title: 'Goal Vaults', desc: 'Lock funds for your future milestones.' },
    { pos: 5, img: '/assets/currency_converter.png', title: 'Multi-Currency', desc: 'Live exchange rates and fast conversion.' },
    { pos: 6, img: '/assets/income_tracking.png', title: 'Financial Command', desc: 'Keep cash flow stable month-over-month.' },
    { pos: 7, img: '/assets/budget_planning.png', title: 'Overspend Alerts', desc: 'Get notified before crossing budget limits.' },
    { pos: 8, img: '/assets/ai_insights.png', title: 'Smart Advice', desc: 'AI tips to improve savings rate by 15%.' },
    { pos: 9, img: '/assets/savings_vault.png', title: 'Milestones', desc: 'Achieve your financial freedom step-by-step.' },
    { pos: 10, img: '/assets/currency_converter.png', title: 'LKR & Foreign Coins', desc: 'Support local LKR and major global currencies.' }
  ]

  return (
    <section className="section carousel-section" id="showcase">
      <div className="container">
        <div className="section-head js-text-animation">
          <span className="ai-tag">Dynamic Platform Showcase</span>
          <h2>Experience Green Finance</h2>
          <p>Rotate through our interactive suite of modules designed to give you absolute control over your money.</p>
        </div>

        <div className="carousel-banner-wrapper">
          <div className="carousel-banner">
            <div className="carousel-slider" style={{ '--quantity': quantity }}>
              {items.map((item) => (
                <div
                  key={item.pos}
                  className="carousel-item"
                  style={{ '--position': item.pos }}
                >
                  <div className="carousel-card-inner">
                    <img src={item.img} alt={item.title} draggable="false" />
                    <div className="carousel-card-overlay">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="carousel-center-text">
              <h3>GREEN</h3>
              <span>FINANCE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
