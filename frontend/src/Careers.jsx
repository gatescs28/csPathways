import careers from '../../data/careers/careers.json'

// Every career as its own pill, four to a row, grouped by source.
// Uses the same layout classes as the Courses page.
function Careers() {
  const total = careers.groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <section className="courses-page">
      <h2 className="list-title">
        Careers <span className="list-count">{total}</span>
      </h2>
      {careers.groups.map((group) => (
        <div key={group.name} className="list-group">
          <h3 className="group-title">
            {group.name} <span className="list-count">{group.items.length}</span>
          </h3>
          <ul className="course-grid">
            {group.items.map((career, i) => (
              <li key={i} className="course-pill">
                <span className="course-pill-title">{career}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

export default Careers
