import { useEffect, useRef, useState } from 'react'
import './App.css'
import logo from './assets/branding/logo-1.svg'
import Acm from './Acm.jsx'
import Careers from './Careers.jsx'
import CourseList from './CourseList.jsx'
import CourseNetwork from './CourseNetwork.jsx'
import ParallelPaths from './ParallelPaths.jsx'
import Courses from './Courses.jsx'
import Dashboard from './Dashboard.jsx'
import SearchField from './SearchField.jsx'
import StudentStats from './StudentStats.jsx'

const TABS = [
  'Map',
  'Courses',
  'Careers',
  'Skill Groupings',
  'ACM',
  'Source Analysis',
  'Course List',
  'Dashboard',
]
const HOME_TAB = 0
const COURSES_TAB = 1
const CAREERS_TAB = 2
const ACM_TAB = 4
const COURSE_LIST_TAB = 6
const DASHBOARD_TAB = 7
// Not tabs: reached from the login icon and, on Map, the profile picture in the header.
const LOGIN_PAGE = 'login'
const PROFILE_PAGE = 'profile'

function App() {
  const [activeTab, setActiveTab] = useState(0)
  // On Map, the logo and title toggle the header line and the side panel.
  const [revealed, setRevealed] = useState(false)
  // On Map, clicking the logo and title opens a menu of the same tabs.
  const [menuOpen, setMenuOpen] = useState(false)
  // The course clicked on the map, kept highlighted and named in the side panel.
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [graphView, setGraphView] = useState('3d')
  const brandArea = useRef(null)
  const isHome = activeTab === HOME_TAB
  const DashboardGraph = graphView === 'parallel' ? ParallelPaths : CourseNetwork

  // Close the menu on a click outside it or on Escape.
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e) {
      if (!brandArea.current.contains(e.target)) setMenuOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

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
    setMenuOpen(false)
  }

  // Same as the tab bar, except Map also shows the side panel.
  function selectMenuTab(i) {
    selectTab(i)
    if (i === HOME_TAB) setRevealed(true)
  }

  return (
    <div className={isHome ? 'app dashboard' : activeTab === ACM_TAB ? 'app acm' : 'app'}>
      <header className={isHome && !revealed ? 'header home' : 'header'}>
        <div className={menuOpen ? 'brand-area open' : 'brand-area'} ref={brandArea}>
          <h1 className="site-heading">
            {isHome ? (
              <button
                className="brand"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {brandContent}
              </button>
            ) : (
              <span className="brand">{brandContent}</span>
            )}
          </h1>
          {/* Kept on the page while closed, so it can slide in and out. */}
          {isHome && (
            <nav className="brand-menu" aria-hidden={!menuOpen}>
              {TABS.map((tab, i) => (
                <button
                  key={i}
                  className={i === activeTab ? 'tab active' : 'tab'}
                  onClick={() => selectMenuTab(i)}
                >
                  {tab}
                </button>
              ))}
            </nav>
          )}
        </div>
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
        {/* Map shows a profile picture here instead, a placeholder for now. */}
        {isHome && (
          <button
            className="profile-button"
            aria-label="Profile"
            onClick={() => setActiveTab(PROFILE_PAGE)}
          >
            <svg className="profile-placeholder" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="9.5" r="4.5" />
              <path d="M2 24c0-5.5 4.5-8.5 10-8.5s10 3 10 8.5z" />
            </svg>
          </button>
        )}
        {/* Hidden on Map, where the header bar is hidden. */}
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
            <SearchField className="sidebar-search" />
            {selectedCourse && (
              <h3 className="sidebar-subtitle">
                <span className="sidebar-subtitle-code">{selectedCourse.code}</span>
                {selectedCourse.title}
              </h3>
            )}
          </aside>
        )}
        {activeTab === DASHBOARD_TAB && (
          <aside className="sidebar">
            <StudentStats />
          </aside>
        )}
        {/* On Dashboard the page stretches to the bottom of the window. */}
        <main className={activeTab === DASHBOARD_TAB ? 'main fill' : 'main'}>
          {/* Clicking a course on the map selects it and shows the header line
              and the side panel. */}
          {isHome && (
            <DashboardGraph
              selected={selectedCourse}
              onSelect={(course) => {
                setSelectedCourse(course)
                if (course) setRevealed(true)
              }}
            />
          )}
          {isHome && (
            <button
              type="button"
              className="dashboard-view-switch"
              onClick={() => setGraphView(graphView === 'parallel' ? '3d' : 'parallel')}
            >
              {graphView === 'parallel' ? 'Switch to 3D graph' : 'Switch to Parallel paths'}
            </button>
          )}
          {activeTab === COURSES_TAB && <Courses />}
          {activeTab === CAREERS_TAB && <Careers />}
          {activeTab === ACM_TAB && <Acm />}
          {activeTab === COURSE_LIST_TAB && <CourseList />}
          {activeTab === DASHBOARD_TAB && <Dashboard />}
          {activeTab === LOGIN_PAGE && (
            <section className="courses-page">
              <h2 className="list-title">Login</h2>
            </section>
          )}
          {activeTab === PROFILE_PAGE && (
            <section className="courses-page">
              <h2 className="list-title">Profile</h2>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
