import { useLayoutEffect, useRef, useState } from 'react'
import courses from '../../data/courses/courses.json'
import './ParallelPaths.css'

// The approved visual demo only: these fixtures do not represent matching,
// ranking, prerequisites, or verified course-to-career relationships.
const SAMPLE_CODES = ['CSC 102', 'CSC 103', 'CSC 111', 'CSC 112', 'CSC 195', 'CSC 201']
const sampleCourses = SAMPLE_CODES.map((code) => courses.groups[0].items.find((course) => course.code === code))
const samplePaths = ['Software development', 'Data science', 'Cybersecurity', 'UX engineering']
const SAMPLE_LINKS = [[0, 0], [0, 1], [1, 0], [1, 3], [2, 0], [2, 2], [3, 0], [3, 2], [4, 1], [4, 3], [5, 0], [5, 1], [5, 2]]

export default function ParallelPaths({ selected, onSelect }) {
  const [selectedPath, setSelectedPath] = useState(null)
  const [width, setWidth] = useState(0)
  const graph = useRef(null)
  const courseIndex = sampleCourses.findIndex((course) => course.code === selected?.code)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(graph.current)
    return () => observer.disconnect()
  }, [])

  const activeLink = ([course, path]) => course === courseIndex || path === selectedPath
  const relatedCourses = SAMPLE_LINKS.filter(([, path]) => path === selectedPath).map(([course]) => course)
  const relatedPaths = SAMPLE_LINKS.filter(([course]) => course === courseIndex).map(([, path]) => path)
  const nodeWidth = width < 520 ? 124 : 190
  const inset = nodeWidth / 2 + 4
  const courseY = (i) => 52 + i * 80
  const pathY = (i) => 92 + i * 107

  function chooseCourse(course) {
    setSelectedPath(null)
    onSelect(selected?.code === course.code ? null : course)
  }

  function choosePath(index) {
    onSelect(null)
    setSelectedPath(selectedPath === index ? null : index)
  }

  return (
    <section className="parallel-paths" aria-label="Parallel paths design preview">
      <div className="parallel-heading">
        <h2>Parallel paths</h2>
        <p>Design preview · 6 courses · 4 career paths</p>
      </div>
      <div className="parallel-column-labels"><span>Courses</span><span>Career paths</span></div>
      <div className="parallel-graph" ref={graph}>
        <svg width={width} height="510" aria-hidden="true">
          {[false, true].map((active) => (
            <g key={String(active)} className={active ? 'parallel-links selected' : 'parallel-links'}>
              {SAMPLE_LINKS.filter((link) => activeLink(link) === active).map(([course, path]) => (
                <path key={`${course}-${path}`} d={`M ${nodeWidth + 4} ${courseY(course)} C ${width * 0.48} ${courseY(course)}, ${width * 0.52} ${pathY(path)}, ${width - nodeWidth - 4} ${pathY(path)}`} />
              ))}
            </g>
          ))}
        </svg>
        {sampleCourses.map((course, i) => (
          <button
            key={course.code}
            type="button"
            className={`parallel-node parallel-course${relatedCourses.includes(i) ? ' connected' : ''}`}
            style={{ left: inset, top: courseY(i), width: nodeWidth }}
            aria-pressed={courseIndex === i}
            onClick={() => chooseCourse(course)}
          >
            <span className="parallel-ring" aria-hidden="true" />
            <span><span className="parallel-code">{course.code}</span>{course.title}</span>
          </button>
        ))}
        {samplePaths.map((path, i) => (
          <button
            key={path}
            type="button"
            className={`parallel-node parallel-career${relatedPaths.includes(i) ? ' connected' : ''}`}
            style={{ right: inset, top: pathY(i), width: nodeWidth }}
            aria-pressed={selectedPath === i}
            onClick={() => choosePath(i)}
          >{path}</button>
        ))}
      </div>
      <div className="parallel-caption">
        <p className="parallel-selection" aria-live="polite">
          {courseIndex >= 0
            ? `${sampleCourses[courseIndex].code} — ${relatedPaths.map((i) => samplePaths[i]).join(' · ')}`
            : selectedPath !== null
              ? `${samplePaths[selectedPath]} — ${relatedCourses.map((i) => sampleCourses[i].code).join(' · ')}`
              : 'Select a course or career path to highlight its sample connections.'}
        </p>
        <p>Illustrative links only · Blue shows selected connections</p>
      </div>
    </section>
  )
}
