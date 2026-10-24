import { useEffect, useRef, useState } from 'react'

// The square filter button at the right end of a search bar. Pressing it opens a
// dropdown with a set of checkboxes per filter. Nothing checked in a set means
// that set doesn't narrow anything.
function FilterMenu({ filters, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const area = useRef(null)
  const count = Object.values(selected).reduce((sum, values) => sum + values.length, 0)

  // Close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!area.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle(key, value) {
    const values = selected[key]
    onChange({
      ...selected,
      [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value],
    })
  }

  function clear() {
    onChange(Object.fromEntries(Object.keys(selected).map((key) => [key, []])))
  }

  return (
    <div ref={area} className="filter-area">
      <button
        type="button"
        className="filter-button"
        aria-label={count ? `Filters, ${count} on` : 'Filters'}
        aria-expanded={open}
        aria-controls="filter-menu"
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {/* Each line stops at its ring's edge so the ring stays empty inside. */}
          <path d="M4 6h9.25M16.75 6H20M4 12h2.25M9.75 12H20M4 18h7.25M14.75 18H20" />
          <circle cx="15" cy="6" r="1.75" />
          <circle cx="8" cy="12" r="1.75" />
          <circle cx="13" cy="18" r="1.75" />
        </svg>
        {count > 0 && <span className="filter-count">{count}</span>}
      </button>
      {open && (
        <div id="filter-menu" className="filter-menu">
          {filters.map((filter) => (
            <div key={filter.key} className="filter-set" role="group" aria-labelledby={`filter-${filter.key}`}>
              <p id={`filter-${filter.key}`} className="filter-title">
                {filter.title}
              </p>
              {filter.options.map((option) => (
                <label key={option.value} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selected[filter.key].includes(option.value)}
                    onChange={() => toggle(filter.key, option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          ))}
          <button type="button" className="filter-clear" onClick={clear} disabled={!count}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterMenu
