// The ACM page's placeholders: a gauge in the top left and four blank panels in
// the top right. Nothing is measured or filled in yet.
function Acm() {
  return (
    <section className="acm-page">
      <svg className="acm-gauge" viewBox="0 0 200 110" role="img" aria-label="Gauge">
        <path className="acm-gauge-arc" d="M15 100 A85 85 0 0 1 185 100" />
        <line className="acm-gauge-needle" x1="100" y1="100" x2="154" y2="55" />
      </svg>
      <div className="acm-panels">
        <div className="acm-panel" />
        <div className="acm-panel" />
        <div className="acm-panel" />
        <div className="acm-panel" />
      </div>
    </section>
  )
}

export default Acm
