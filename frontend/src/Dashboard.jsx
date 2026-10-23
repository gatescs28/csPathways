// A small map of a few connected nodes on its own panel, drawn like the course
// map. Placeholder only: the nodes aren't courses yet.
const NODES = [
  { x: 120, y: 110 },
  { x: 300, y: 70 },
  { x: 470, y: 150 },
  { x: 220, y: 250 },
  { x: 400, y: 300 },
  { x: 560, y: 260 },
  { x: 110, y: 330 },
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
      <div className="dashboard-map">
        <svg viewBox="0 0 680 400" role="img" aria-label="Map of connected nodes">
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
    </section>
  )
}

export default Dashboard
