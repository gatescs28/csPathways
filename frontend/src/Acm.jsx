// The ACM page: a gauge in the top left, four white panels of stats in the top
// right, and below them a black panel with the student's year and the
// student's route of classes taken. All placeholders; the gauge doesn't
// measure anything, and its needle's position is only for the look.

// The gauge's half circle, centered on its hub.
const CX = 150
const CY = 150
const R = 120
// Where the needle points, in degrees counterclockwise from the right end.
const NEEDLE = 39.8

function point(deg, r) {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)]
}

function arc(r, toDeg) {
  const [x, y] = point(toDeg, r)
  return `M${CX - r} ${CY} A${r} ${r} 0 0 1 ${x} ${y}`
}

// A tick every 5 degrees, longer every 30. Ticks the fill has passed are darker.
const TICKS = Array.from({ length: 37 }, (_, i) => {
  const deg = 180 - i * 5
  const major = i % 6 === 0
  return { deg, major, passed: deg >= NEEDLE, from: point(deg, 134), to: point(deg, major ? 146 : 139) }
})

const [endX, endY] = point(NEEDLE, R)
const [tipX, tipY] = point(NEEDLE, 96)
const [tailX, tailY] = point(NEEDLE + 180, 18)


// The student's route so far: a node for each class taken, starting from the
// intro class. The main route runs through the core classes in the order
// taken, and electives branch off the class they followed. Placeholders for a
// junior (the main route is the classes the Dashboard marks complete) until
// there's sign-in. x and y are percentages of the route's area, and label is
// the side of the node its number sits on, out of the line's way. On phones
// the route runs down the page, and each branch class has its own place (down)
// to the left of the main route.
const ROUTE = [
  { code: 'CSC 111', title: 'Introduction to Computer Science', x: 6, y: 70, label: 'below' },
  {
    code: 'CSC 112',
    title: 'Fundamentals of Computer Science',
    x: 18,
    y: 56,
    label: 'below',
    branch: [
      { code: 'CSC 195', title: 'Data Visualization', x: 22, y: 16, label: 'above', down: { x: 12, y: 24, label: 'below' } },
    ],
  },
  { code: 'CSC 201', title: 'Data Structures and Algorithms', x: 30, y: 38, label: 'above' },
  {
    code: 'CSC 250',
    title: 'Computer Systems I',
    x: 43,
    y: 34,
    label: 'above',
    branch: [
      {
        code: 'CSC 270',
        title: 'Foundations of Artificial Intelligence',
        x: 47,
        y: 68,
        label: 'right',
        down: { x: 12, y: 49, label: 'above' },
      },
      { code: 'CSC 371', title: 'Artificial Intelligence', x: 56, y: 86, label: 'right', down: { x: 12, y: 60, label: 'below' } },
    ],
  },
  { code: 'CSC 231', title: 'Programming Languages', x: 55, y: 48, label: 'below' },
  {
    code: 'CSC 251',
    title: 'Computer Systems II',
    x: 67,
    y: 62,
    label: 'below',
    branch: [
      {
        code: 'CSC 321',
        title: 'Database Management Systems',
        x: 71,
        y: 20,
        label: 'above',
        down: { x: 12, y: 73, label: 'below' },
      },
    ],
  },
  { code: 'CSC 280', title: 'Computing Ethics', x: 80, y: 50, label: 'below' },
]
// Where the dotted line past the latest class fades out, since the route keeps going.
const ROUTE_END = { x: 97, y: 26 }
// On phones the main route runs down the middle of the page.
const downward = ({ x, y }) => ({ x: 30 + (y - 26) * 0.3, y: x })
// The route draws in from the start over this long, and each node appears as the line reaches it.
const DRAW_DELAY = 0.2
const DRAW_TIME = 1.6

// Every class on the route, each branch class just after the class it branches from.
const CLASSES = ROUTE.flatMap((course, i) => [
  { ...course, main: true, start: i === 0, latest: i === ROUTE.length - 1, down: downward(course) },
  ...(course.branch ?? []).map((elective) => ({ ...elective, main: false })),
])

// A smooth curve through the points, one cubic Bézier per gap (Catmull-Rom).
function curves(points) {
  return points.slice(1).map((p, i) => {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p3 = points[i + 2] ?? p
    const c1 = [p1.x + (p.x - p0.x) / 6, p1.y + (p.y - p0.y) / 6]
    const c2 = [p.x - (p3.x - p1.x) / 6, p.y - (p3.y - p1.y) / 6]
    return `C${c1} ${c2} ${p.x},${p.y}`
  })
}

// The route through the classes, and the dotted tail past the latest one to
// the route's end, the last point.
function routePaths(points) {
  const gaps = curves(points)
  const first = points[0]
  const last = points.at(-2)
  return {
    route: `M${first.x},${first.y} ${gaps.slice(0, -1).join(' ')}`,
    tail: `M${last.x},${last.y} ${gaps.at(-1)}`,
  }
}

// A branch leaves its class square to the main route (upright: straight up or
// down; otherwise sideways) and bends into each of its classes in turn.
function branchPath(points, upright) {
  return points.slice(1).reduce((d, p, i) => {
    const q = points[i]
    const bend = upright
      ? `${q.x},${(q.y + p.y) / 2} ${p.x},${(q.y + p.y) / 2}`
      : `${(q.x + p.x) / 2},${q.y} ${(q.x + p.x) / 2},${p.y}`
    return `${d} C${bend} ${p.x},${p.y}`
  }, `M${points[0].x},${points[0].y}`)
}

const BRANCHES = ROUTE.filter((course) => course.branch)
const PATHS = {
  across: {
    ...routePaths([...ROUTE, ROUTE_END]),
    branches: BRANCHES.map((course) => branchPath([course, ...course.branch], true)),
  },
  down: {
    ...routePaths([...ROUTE, ROUTE_END].map(downward)),
    branches: BRANCHES.map((course) => branchPath([downward(course), ...course.branch.map((c) => c.down)], false)),
  },
}

function Route() {
  return (
    <div className="acm-route">
      <svg className="acm-route-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="acm-tail-across" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.6" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="acm-tail-down" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.6" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* All the pale channels go under all the black lines, so they don't
            wash out the lines where they meet. */}
        {Object.entries(PATHS).map(([way, { route, tail, branches }]) => (
          <g key={way} className={`acm-route-${way}`}>
            {branches.map((d) => (
              <path key={d} className="acm-route-channel branch" d={d} />
            ))}
            <path className="acm-route-channel" d={route} />
            {branches.map((d) => (
              <path key={d} className="acm-route-line branch" d={d} />
            ))}
            <path className="acm-route-line" d={route} />
            <path className="acm-route-tail" d={tail} stroke={`url(#acm-tail-${way})`} />
          </g>
        ))}
      </svg>
      <ol className="acm-route-nodes" aria-label="Classes taken">
        {CLASSES.map((course) => (
          <li
            key={course.code}
            className={[
              course.main ? 'main' : 'branch',
              course.start && 'start',
              course.latest && 'latest',
              `label-${course.label}`,
              !course.main && `down-label-${course.down.label}`,
            ]
              .filter(Boolean)
              .join(' ')}
            tabIndex={0}
            style={{
              '--x': `${course.x}%`,
              '--y': `${course.y}%`,
              '--down-x': `${course.down.x}%`,
              '--down-y': `${course.down.y}%`,
              '--delay': `${DRAW_DELAY + (DRAW_TIME * course.x) / 100}s`,
            }}
          >
            <span className="acm-node-code">{course.code}</span>
            <span className="acm-node-title">{course.title}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Placeholder stats for the same junior as the route and the Dashboard, until
// there's sign-in.
const HOURS_BY_YEAR = [
  { year: 'First Year', hours: 32 },
  { year: 'Sophomore', hours: 32 },
  { year: 'Junior', hours: 16 },
  { year: 'Senior', hours: 0 },
]
const CURRENT_YEAR = 2
const HOURS_NEEDED = 120
const REQUIREMENTS_MET = 7
const REQUIREMENTS = 12
// The 300-level classes on the route count toward 12 hours of them, 3 hours each.
const UPPER_CLASSES = CLASSES.filter((course) => course.code.startsWith('CSC 3'))
  .map((course) => course.code)
  .sort()
const UPPER_HOURS_NEEDED = 12
const CLASS_HOURS = 3

const TOTAL_HOURS = HOURS_BY_YEAR.reduce((sum, { hours }) => sum + hours, 0)
const MOST_HOURS = Math.max(...HOURS_BY_YEAR.map(({ hours }) => hours))
const MAIN_COUNT = CLASSES.filter((course) => course.main).length
const BRANCH_COUNT = CLASSES.length - MAIN_COUNT

// A white panel's stat: a label, the value (out of a total, if it has one), and
// a small picture of it with a note under it.
function Stat({ label, value, total, children }) {
  return (
    <div className="acm-panel acm-stat">
      <span className="acm-stat-label">{label}</span>
      <span className="acm-stat-value">
        {value}
        {total !== undefined && <span className="acm-stat-total"> / {total}</span>}
      </span>
      <div className="acm-stat-detail">{children}</div>
    </div>
  )
}

function Panels() {
  const upperHours = UPPER_CLASSES.length * CLASS_HOURS
  return (
    <div className="acm-panels">
      <Stat label="Classes taken" value={CLASSES.length}>
        <div className="acm-dots" aria-hidden="true">
          {[...CLASSES].sort((a, b) => b.main - a.main).map((course) => (
            <span key={course.code} className={course.main ? 'acm-dot' : 'acm-dot hollow'} />
          ))}
        </div>
        <span className="acm-stat-note">
          <span className="acm-key">
            <span className="acm-dot" aria-hidden="true" /> {MAIN_COUNT} main route
          </span>
          <span className="acm-key">
            <span className="acm-dot hollow" aria-hidden="true" /> {BRANCH_COUNT} branches
          </span>
        </span>
      </Stat>
      <Stat label="Credit hours" value={TOTAL_HOURS} total={HOURS_NEEDED}>
        <div className="acm-meter" aria-hidden="true">
          <span style={{ '--share': TOTAL_HOURS / HOURS_NEEDED }} />
        </div>
        <span className="acm-stat-note">{HOURS_NEEDED - TOTAL_HOURS} hours to go</span>
      </Stat>
      <Stat label="Major requirements" value={REQUIREMENTS_MET} total={REQUIREMENTS}>
        <div className="acm-squares" aria-hidden="true">
          {Array.from({ length: REQUIREMENTS }, (_, i) => (
            <span key={i} className={i < REQUIREMENTS_MET ? 'met' : undefined} />
          ))}
        </div>
        <span className="acm-stat-note">{REQUIREMENTS - REQUIREMENTS_MET} to go</span>
      </Stat>
      <Stat label="300-level hours" value={upperHours} total={UPPER_HOURS_NEEDED}>
        <div className="acm-segments" aria-hidden="true">
          {Array.from({ length: UPPER_HOURS_NEEDED / CLASS_HOURS }, (_, i) => (
            <span key={i} className={i < UPPER_CLASSES.length ? 'done' : undefined} />
          ))}
        </div>
        <span className="acm-stat-note">{UPPER_CLASSES.join(' and ')}</span>
      </Stat>
    </div>
  )
}

// The black panel: the student's year, and their hours in each year as a
// column, the current year's in white and the rest in gray.
function YearPanel() {
  return (
    <div className="acm-panel dark acm-year">
      <span className="acm-stat-label">Year</span>
      <span className="acm-stat-value">{HOURS_BY_YEAR[CURRENT_YEAR].year}</span>
      <span className="acm-stat-note">
        Year {CURRENT_YEAR + 1} of {HOURS_BY_YEAR.length}
      </span>
      <div className="acm-year-chart">
        <span className="acm-stat-label">Hours by year</span>
        <ol className="acm-columns">
          {HOURS_BY_YEAR.map(({ year, hours }, i) => (
            <li
              key={year}
              className={i === CURRENT_YEAR ? 'current' : undefined}
              style={{ '--share': hours / MOST_HOURS }}
            >
              <span className="acm-column-plot">
                <span className="acm-column-bar" />
                <span className="acm-column-value">{hours}</span>
              </span>
              <span className="acm-column-label">{year}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function Acm() {
  return (
    <section className="acm-page">
      <svg className="acm-gauge" viewBox="0 0 300 172" role="img" aria-label="Gauge">
        <g className="acm-gauge-ticks">
          {TICKS.map((t) => (
            <line
              key={t.deg}
              className={[t.major && 'major', t.passed && 'passed'].filter(Boolean).join(' ') || undefined}
              x1={t.from[0]}
              y1={t.from[1]}
              x2={t.to[0]}
              y2={t.to[1]}
            />
          ))}
        </g>
        <path className="acm-gauge-track" d={arc(R, 0)} />
        <path className="acm-gauge-fill" d={arc(R, NEEDLE)} pathLength="1" />
        <path className="acm-gauge-inner" d={arc(104, 0)} />
        {/* The needle and the dot at the end of the fill turn together. */}
        <g className="acm-gauge-needle">
          <line x1={tailX} y1={tailY} x2={tipX} y2={tipY} />
          <circle className="acm-gauge-dot" cx={endX} cy={endY} r="3" />
        </g>
        <circle className="acm-gauge-hub" cx={CX} cy={CY} r="11" />
        <circle className="acm-gauge-pin" cx={CX} cy={CY} r="3.5" />
      </svg>
      <Panels />
      <YearPanel />
      <Route />
    </section>
  )
}

export default Acm
