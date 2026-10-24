import { useState } from 'react'
import careers from '../../data/careers/careers.json'
import FilterMenu from './FilterMenu.jsx'
import SearchField from './SearchField.jsx'

const FILTERS = [
  { key: 'source', title: 'Source', options: careers.groups.map((group) => ({ value: group.name, label: group.name })) },
]

// Every career as its own pill, four to a row, grouped by source, under the
// same search bar as the Courses page. Uses the Courses page's layout classes.
// The filter menu narrows them by source.
function Careers() {
  const [selected, setSelected] = useState({ source: [] })

  const groups = careers.groups.filter((group) => !selected.source.length || selected.source.includes(group.name))
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <>
      <div className="search-bar">
        <SearchField placeholder="Search for a career..." />
        <FilterMenu filters={FILTERS} selected={selected} onChange={setSelected} />
      </div>

      <section className="courses-page">
        <h2 className="list-title">
          Careers <span className="list-count">{total}</span>
        </h2>
        {groups.map((group) => (
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
    </>
  )
}

export default Careers
