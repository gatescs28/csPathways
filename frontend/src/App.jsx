import { useState } from 'react'
import './App.css'
import logo from './assets/branding/logo-1.svg'
import Careers from './Careers.jsx'
import CourseList from './CourseList.jsx'
import CourseNetwork from './CourseNetwork.jsx'
import Courses from './Courses.jsx'

const TABS = [
  'Dashboard',
  'Courses',
  'Careers',
  'Skill Groupings',
  'ACM',
  'Source Analysis',
  'Course List',
]
const HOME_TAB = 0
const COURSES_TAB = 1
const CAREERS_TAB = 2
const COURSE_LIST_TAB = 6
// Not a tab: reached from the login icon in the header.
const LOGIN_PAGE = 'login'

function App() {
  const [activeTab, setActiveTab] = useState(0)
  // On Dashboard, the logo and title toggle the header line and the side panel.
  const [revealed, setRevealed] = useState(false)
  const isHome = activeTab === HOME_TAB

  const brandContent = (
    <>
      <span className="logo">
        <img src={logo} alt="" width="64" height="48" />
      </span>
      <span className="site-title">CourseMap</span>
    </>
  )

  function selectTab(i) {
    setActiveTab(i)
    setRevealed(false)
  }

  return (
    <div className="app">
      <header className={isHome && !revealed ? 'header home' : 'header'}>
        <h1 className="site-heading">
          {isHome ? (
            <button
              className="brand"
              aria-expanded={revealed}
              onClick={() => setRevealed(!revealed)}
            >
              {brandContent}
            </button>
          ) : (
            <span className="brand">{brandContent}</span>
          )}
        </h1>
        <nav className="tab-bar">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={i === activeTab ? 'tab active' : 'tab'}
              onClick={() => selectTab(i)}
            >
              {tab}
            </button>
          ))}
        </nav>
        {/* Hidden on Dashboard, where the header bar is hidden. */}
        {activeTab !== HOME_TAB && (
          <button
            className="login-button"
            aria-label="Log in"
            onClick={() => setActiveTab(LOGIN_PAGE)}
          >
            <svg className="login-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </button>
        )}
      </header>

      <div className="body">
        {(activeTab === COURSE_LIST_TAB || (isHome && revealed)) && (
          <aside className="sidebar">
            <h2 className="sidebar-title">Course Catalog</h2>
          </aside>
        )}
        <main className="main">
          {isHome && <CourseNetwork />}
          {activeTab === COURSES_TAB && <Courses />}
          {activeTab === CAREERS_TAB && <Careers />}
          {activeTab === COURSE_LIST_TAB && <CourseList />}
          {activeTab === LOGIN_PAGE && (
            <section className="courses-page">
              <h2 className="list-title">Login</h2>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
