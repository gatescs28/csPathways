// The pill-shaped search box: magnifying glass on the left, then the input.
// Look only for now; it doesn't filter anything yet.
function SearchField({ className }) {
  return (
    <label className={className ? `search-field ${className}` : 'search-field'}>
      <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input type="search" placeholder="Search for a course..." aria-label="Search for a course" />
    </label>
  )
}

export default SearchField
