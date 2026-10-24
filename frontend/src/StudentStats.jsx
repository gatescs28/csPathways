import { useLayoutEffect, useRef, useState } from 'react'

// Dashboard's side panel: the student's year and progress. Placeholder values
// until there's sign-in.
const CLASSES_TAKEN = [
  { code: 'CSC 111', title: 'Introduction to Computer Science' },
  { code: 'CSC 112', title: 'Fundamentals of Computer Science' },
  { code: 'CSC 201', title: 'Data Structures and Algorithms' },
  { code: 'CSC 231', title: 'Programming Languages' },
]

const HOURS_BY_YEAR = [
  { year: 'First Year', hours: 32 },
  { year: 'Sophomore', hours: 32 },
  { year: 'Junior', hours: 16 },
  { year: 'Senior', hours: 0 },
]
const HOURS_NEEDED = 120

// Major requirements: specific classes, plus a number of 300-level hours.
// Placeholders, not the real WFU requirements.
const REQUIREMENTS = [
  { name: 'CSC 111', detail: 'Introduction to Computer Science', complete: true },
  { name: 'CSC 112', detail: 'Fundamentals of Computer Science', complete: true },
  { name: 'CSC 201', detail: 'Data Structures and Algorithms', complete: true },
  { name: 'CSC 231', detail: 'Programming Languages', complete: true },
  { name: 'CSC 250', detail: 'Computer Systems I', complete: true },
  { name: 'CSC 251', detail: 'Computer Systems II', complete: true },
  { name: 'CSC 280', detail: 'Computing Ethics', complete: true },
  { name: 'CSC 301', detail: 'Algorithm Design and Analysis', complete: false },
  { name: 'CSC 311', detail: 'Computer Architecture', complete: false },
  { name: 'CSC 331', detail: 'Software Engineering', complete: false },
  { name: 'CSC 341', detail: 'Operating Systems', complete: false },
  { name: '300-level hours', detail: '6 of 12 hours of 300-level CSC courses', complete: false },
]
const GRID_COLUMNS = 6
const SQUARE_STEP = 28 // a square's size plus the gap after it, in px

function ClassesTaken() {
  return (
    <ul className="class-list">
      {CLASSES_TAKEN.map((course) => (
        <li key={course.code} className="class-item">
          <span className="class-code">{course.code}</span>
          {course.title}
        </li>
      ))}
    </ul>
  )
}

// A half-circle gauge in the page's blue: the arc fills up to the student's
// total, and the needle points at it. A full gauge is HOURS_NEEDED. In the
// Ronde style (Skill Groupings) it also has ticks, longer every quarter and
// darker up to the total, and a dotted arc inside; --turn-from is where the
// needle starts when it sweeps in.
const GAUGE_TICKS = 24

function HoursGauge({ total, ronde }) {
  const share = Math.min(total / HOURS_NEEDED, 1)
  const angle = Math.PI * (1 - share)
  const point = (r, a = angle) => [100 + r * Math.cos(a), 100 - r * Math.sin(a)]
  const [arcX, arcY] = point(80)
  const [tipX, tipY] = point(62)
  return (
    <svg
      className="hours-gauge"
      viewBox="0 0 200 146"
      role="img"
      aria-label={`${total} of ${HOURS_NEEDED} hours`}
      style={{ '--turn-from': `${-share * 180}deg` }}
    >
      {ronde && (
        <g className="gauge-ticks">
          {Array.from({ length: GAUGE_TICKS + 1 }, (_, i) => {
            const a = Math.PI * (1 - i / GAUGE_TICKS)
            const major = i % (GAUGE_TICKS / 4) === 0
            const [x1, y1] = point(91, a)
            const [x2, y2] = point(major ? 99 : 95, a)
            const className = [major && 'major', i / GAUGE_TICKS <= share && 'passed'].filter(Boolean).join(' ')
            return <line key={i} className={className || undefined} x1={x1} y1={y1} x2={x2} y2={y2} />
          })}
        </g>
      )}
      <path className="gauge-track" d="M 20 100 A 80 80 0 0 1 180 100" />
      {share > 0 && <path className="gauge-fill" d={`M 20 100 A 80 80 0 0 1 ${arcX} ${arcY}`} pathLength="1" />}
      {ronde && <path className="gauge-inner" d="M 30 100 A 70 70 0 0 1 170 100" />}
      <line className="gauge-needle" x1="100" y1="100" x2={tipX} y2={tipY} />
      <circle className="gauge-hub" cx="100" cy="100" r="6" />
      <text className="gauge-end" x="20" y="120">0</text>
      <text className="gauge-end" x="180" y="120">{HOURS_NEEDED}</text>
      <text className="gauge-value" x="100" y="128">{total}</text>
      <text className="gauge-label" x="100" y="143">of {HOURS_NEEDED} hours</text>
    </svg>
  )
}

function TotalHours({ ronde }) {
  const total = HOURS_BY_YEAR.reduce((sum, { hours }) => sum + hours, 0)
  return (
    <>
      <HoursGauge total={total} ronde={ronde} />
      <ul className="hours-list">
        {HOURS_BY_YEAR.map(({ year, hours }) => (
          <li key={year} className="hours-year">
            <span>{year}</span>
            <span className="hours-count">{hours}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

// A calendar-style grid with one square per requirement: filled once it's
// complete, pale and outlined until then. Hovering or focusing a square opens
// a panel under its row saying what the requirement is, or over the row when
// there isn't room below it in the window or in the side panel, where that
// scrolls inside itself (on Skill Groupings).
function MajorRequirements() {
  const [active, setActive] = useState(null)
  const [above, setAbove] = useState(false)
  const popupRef = useRef(null)
  const met = REQUIREMENTS.filter((r) => r.complete).length
  const shown = REQUIREMENTS[active]
  const row = Math.floor(active / GRID_COLUMNS)

  // Measured before the panel is painted, so it never shows cut off first.
  useLayoutEffect(() => {
    if (active === null) {
      setAbove(false)
    } else if (!above) {
      const panel = popupRef.current.closest('.sidebar')
      const bottom = Math.min(window.innerHeight, panel.getBoundingClientRect().bottom)
      if (popupRef.current.getBoundingClientRect().bottom > bottom - 8) setAbove(true)
    }
  }, [active, above])

  function show(i) {
    setAbove(false)
    setActive(i)
  }
  return (
    <>
      <div className="requirement-chart">
        <ul className="requirement-grid">
          {REQUIREMENTS.map((req, i) => (
            <li
              key={req.name}
              className={req.complete ? 'requirement complete' : 'requirement'}
              tabIndex={0}
              aria-label={`${req.name}: ${req.complete ? 'complete' : 'not complete'}`}
              aria-describedby={active === i ? 'requirement-popup' : undefined}
              onMouseEnter={() => show(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => show(i)}
              onBlur={() => setActive(null)}
            />
          ))}
        </ul>
        {shown && (
          <div
            id="requirement-popup"
            role="tooltip"
            ref={popupRef}
            className={above ? 'requirement-popup above' : 'requirement-popup'}
            style={{
              top: above ? row * SQUARE_STEP - 10 : (row + 1) * SQUARE_STEP + 4,
              '--pointer-left': `${(active % GRID_COLUMNS) * SQUARE_STEP + 11}px`,
            }}
          >
            <p className="requirement-name">{shown.name}</p>
            <p className="requirement-detail">{shown.detail}</p>
            <p className={shown.complete ? 'requirement-status complete' : 'requirement-status'}>
              {shown.complete ? 'Complete' : 'Not complete'}
            </p>
          </div>
        )}
      </div>
      <p className="stat-note">
        {met} of {REQUIREMENTS.length} requirements met
      </p>
    </>
  )
}

const STATS = [
  { title: 'Classes Taken', Body: ClassesTaken },
  { title: 'Total Hours', Body: TotalHours },
  { title: 'Major Requirements', Body: MajorRequirements },
]

// ronde draws the extra detail the Ronde style uses (Skill Groupings).
function StudentStats({ ronde = false }) {
  // Every section starts open; clicking its header bar folds it away.
  const [closed, setClosed] = useState([])

  function toggle(i) {
    setClosed(closed.includes(i) ? closed.filter((j) => j !== i) : [...closed, i])
  }

  return (
    <>
      <h2 className="sidebar-title">Student Stats</h2>
      <span className="student-year">Junior</span>
      {STATS.map(({ title, Body }, i) => {
        const open = !closed.includes(i)
        return (
          <section key={title} className="stat-section">
            <h3 className="stat-heading">
              <button
                type="button"
                className="stat-toggle"
                aria-expanded={open}
                aria-controls={`stat-${i}`}
                onClick={() => toggle(i)}
              >
                {title}
                <svg className="stat-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5l10 7-10 7z" />
                </svg>
              </button>
            </h3>
            {open && (
              <div id={`stat-${i}`} className="stat-body">
                <Body ronde={ronde} />
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}

export default StudentStats
