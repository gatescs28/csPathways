import { useLayoutEffect, useRef, useState } from 'react'

// A small map of a few connected nodes on its own panel, drawn like the course
// map and laid out taller than wide. Placeholder only: each node has a sample
// class to show on hover, and the links don't mean anything yet. In the Ronde
// style (Skill Groupings) the links also get pale channels under them, each
// node a white pin (a wider one for the intro class, a hollow ring), and each
// node a --delay for appearing as the map draws in.
const NODES = [
  { x: 110, y: 120, code: 'CSC 111', title: 'Introduction to Computer Science' },
  { x: 70, y: 300, code: 'CSC 112', title: 'Fundamentals of Computer Science' },
  { x: 150, y: 470, code: 'CSC 250', title: 'Computer Systems I' },
  { x: 250, y: 220, code: 'CSC 201', title: 'Data Structures and Algorithms' },
  { x: 300, y: 400, code: 'CSC 301', title: 'Algorithm Design and Analysis' },
  { x: 260, y: 560, code: 'CSC 331', title: 'Software Engineering' },
  { x: 330, y: 110, code: 'CSC 231', title: 'Programming Languages' },
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

// The hovered node's class in a pill just above it, like the course map's, kept
// inside the fold.
function NodeLabel({ index, ringRef, foldRef }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const label = ref.current
    const area = foldRef.current.getBoundingClientRect()
    const ring = ringRef.current.getBoundingClientRect()
    const gap = 8
    const half = label.offsetWidth / 2
    const center = ring.left - area.left + ring.width / 2
    const x = Math.min(Math.max(center - half, gap), area.width - label.offsetWidth - gap)
    const above = ring.top - area.top - gap - label.offsetHeight > gap
    const y = above ? ring.top - area.top - gap - label.offsetHeight : ring.bottom - area.top + gap
    label.style.transform = `translate(${x}px, ${y}px)`
  }, [index, ringRef, foldRef])

  const { code, title } = NODES[index]
  return (
    <div ref={ref} className="network-label">
      <span className="network-label-code">{code}</span>
      {title}
    </div>
  )
}

function Dashboard({ ronde = false }) {
  const foldRef = useRef(null)
  const ringRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  return (
    <section className="dashboard-page">
      {/* A folded map in three sections: blank panels on either side of the
          route map, two on the left and three on the right. */}
      <div className="dashboard-map">
        <div className="dashboard-fold">
          <div className="dashboard-subpanel" />
          <div className="dashboard-subpanel" />
        </div>
        <div ref={foldRef} className="dashboard-fold dashboard-fold-route">
          <svg viewBox="0 0 400 680" role="img" aria-label="Map of connected classes">
            {ronde && (
              <g className="dashboard-map-channels">
                {LINKS.map(([from, to], i) => (
                  <line key={i} x1={NODES[from].x} y1={NODES[from].y} x2={NODES[to].x} y2={NODES[to].y} />
                ))}
              </g>
            )}
            <g className="dashboard-map-links">
              {LINKS.map(([from, to], i) => (
                <line key={i} x1={NODES[from].x} y1={NODES[from].y} x2={NODES[to].x} y2={NODES[to].y} />
              ))}
            </g>
            {NODES.map((node, i) => (
              <g
                key={i}
                className="dashboard-map-stop"
                style={ronde ? { '--delay': `${0.2 + (1.2 * node.y) / 680}s` } : undefined}
              >
                <circle
                  className={i === 0 ? 'dashboard-map-node start' : 'dashboard-map-node'}
                  cx={node.x}
                  cy={node.y}
                  r="11"
                  ref={hovered === i ? ringRef : undefined}
                  aria-label={`${node.code} ${node.title}`}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                />
                {ronde && <circle className="dashboard-map-pin" cx={node.x} cy={node.y} r={i === 0 ? 6 : 3.5} />}
              </g>
            ))}
          </svg>
          {hovered !== null && <NodeLabel index={hovered} ringRef={ringRef} foldRef={foldRef} />}
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
