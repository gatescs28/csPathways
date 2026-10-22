import courses from '../../data/courses/courses.json'

// Every course as its own pill, four to a row, grouped by source.
function Courses() {
  const total = courses.groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <>
      <div className="search-bar">
        <label className="search-field">
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input type="search" placeholder="Search for a course..." aria-label="Search for a course" />
        </label>
      </div>

      <section className="courses-page">
        <h2 className="list-title">
          Courses <span className="list-count">{total}</span>
        </h2>
        {courses.groups.map((group) => (
          <div key={group.name} className="list-group">
            <h3 className="group-title">
              {group.name} <span className="list-count">{group.items.length}</span>
            </h3>
            <ul className="course-grid">
              {group.items.map((course, i) => (
                <li key={i} className="course-pill">
                  <span className="course-pill-title">{course.title}</span>
                  <span className="course-pill-code">{course.code}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

export default Courses
