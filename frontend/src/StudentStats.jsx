import { useState } from 'react'

// Dashboard's side panel: the student's year and progress. Placeholder values
// until there's sign-in.
const STATS = [
  { title: 'Classes Taken', value: '18', note: 'classes' },
  { title: 'Total Hours', value: '64', note: 'credit hours' },
  { title: 'Major Requirements', value: '7 of 12', note: 'requirements met' },
]

function StudentStats() {
  // Every section starts open; clicking its header bar folds it away.
  const [closed, setClosed] = useState([])

  function toggle(i) {
    setClosed(closed.includes(i) ? closed.filter((j) => j !== i) : [...closed, i])
  }

  return (
    <>
      <h2 className="sidebar-title">Student Stats</h2>
      <span className="student-year">Junior</span>
      {STATS.map((stat, i) => {
        const open = !closed.includes(i)
        return (
          <section key={stat.title} className="stat-section">
            <h3 className="stat-heading">
              <button
                type="button"
                className="stat-toggle"
                aria-expanded={open}
                aria-controls={`stat-${i}`}
                onClick={() => toggle(i)}
              >
                {stat.title}
                <svg className="stat-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5l10 7-10 7z" />
                </svg>
              </button>
            </h3>
            {open && (
              <div id={`stat-${i}`} className="stat-body">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-note">{stat.note}</p>
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}

export default StudentStats
