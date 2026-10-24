import { useState } from 'react'
import courses from '../../data/courses/courses.json'
import FilterMenu from './FilterMenu.jsx'
import SearchField from './SearchField.jsx'

// A course's level from its number: CSC 231 is 200-level.
const levelOf = (course) => `${course.code.match(/\d/)[0]}00`

const LEVELS = [...new Set(courses.groups.flatMap((group) => group.items.map(levelOf)))].sort()

const FILTERS = [
  { key: 'level', title: 'Level', options: LEVELS.map((level) => ({ value: level, label: `${level}-level` })) },
  { key: 'source', title: 'Source', options: courses.groups.map((group) => ({ value: group.name, label: group.name })) },
]

// Every course as its own pill, four to a row, grouped by source. The filter
// menu narrows them by level and source.
function Courses() {
  const [selected, setSelected] = useState({ level: [], source: [] })

  const groups = courses.groups
    .filter((group) => !selected.source.length || selected.source.includes(group.name))
    .map((group) => ({
      ...group,
      items: group.items.filter((course) => !selected.level.length || selected.level.includes(levelOf(course))),
    }))
    .filter((group) => group.items.length)
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <>
      <div className="search-bar">
        <SearchField />
        <FilterMenu filters={FILTERS} selected={selected} onChange={setSelected} />
      </div>

      <section className="courses-page">
        <h2 className="list-title">
          Courses <span className="list-count">{total}</span>
        </h2>
        {groups.map((group) => (
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
        {!groups.length && <p className="list-empty">No courses match these filters.</p>}
      </section>
    </>
  )
}

export default Courses
