// A small map of a few connected nodes on its own panel, drawn like the course
// map and laid out taller than wide. Placeholder only: the nodes aren't courses yet.
const NODES = [
  { x: 110, y: 120 },
  { x: 70, y: 300 },
  { x: 150, y: 470 },
  { x: 250, y: 220 },
  { x: 300, y: 400 },
  { x: 260, y: 560 },
  { x: 330, y: 110 },
]
const LINKS = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [3, 4],
  [2, 4],
  [2, 5],
  [4, 5],
  [3, 6],
]

function Dashboard() {
  return (
    <section className="dashboard-page">
      {/* A folded map in three sections: blank panels on either side of the
          route map, two on the left and three on the right. */}
      <div className="dashboard-map">
        <div className="dashboard-fold">
          <div className="dashboard-subpanel" />
          <div className="dashboard-subpanel" />
        </div>
        <div className="dashboard-fold dashboard-fold-route">
          <svg viewBox="0 0 400 680" role="img" aria-label="Map of connected nodes">
            <g className="dashboard-map-links">
              {LINKS.map(([from, to], i) => (
                <line key={i} x1={NODES[from].x} y1={NODES[from].y} x2={NODES[to].x} y2={NODES[to].y} />
              ))}
            </g>
            {NODES.map((node, i) => (
              <circle key={i} className="dashboard-map-node" cx={node.x} cy={node.y} r="11" />
            ))}
          </svg>
        </div>
        <div className="dashboard-fold">
          <div className="dashboard-subpanel" />
          <div className="dashboard-subpanel" />
          <div className="dashboard-subpanel" />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
