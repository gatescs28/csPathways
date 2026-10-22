import courses from '../../data/courses/courses.json'
import careers from '../../data/careers/careers.json'

// Two side-by-side lists. Courses and careers aren't connected yet.
function CourseList() {
  return (
    <div className="split">
      <ListColumn
        title="Courses"
        groups={courses.groups}
        renderItem={(course) => <CourseItem course={course} />}
      />
      <ListColumn title="Careers" groups={careers.groups} renderItem={(career) => career} />
    </div>
  )
}

function CourseItem({ course }) {
  return (
    <div className="course-item">
      <span className="course-code">{course.code}</span>
      <span>{course.title}</span>
    </div>
  )
}

function ListColumn({ title, groups, renderItem }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <section className="list-column">
      <h2 className="list-title">
        {title} <span className="list-count">{total}</span>
      </h2>
      {groups.map((group) => (
        <div key={group.name} className="list-group">
          <h3 className="group-title">
            {group.name} <span className="list-count">{group.items.length}</span>
          </h3>
          <ul className="list">
            {group.items.map((item, i) => (
              <li key={i}>{renderItem(item)}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

export default CourseList
