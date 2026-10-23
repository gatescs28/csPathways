# frontend/

The student-facing website: React, with Vite for development.

**So far:** the header (blue CourseMap logo, title, and a pill-shaped tab bar with 8 tabs, plus a login icon in the top right, hidden on Map, that opens a blank Login page), a Map tab (the first tab, formerly named Dashboard; the header line is hidden and the logo and title sit in a pill that opens a dropdown menu of the same tabs that slides smoothly out of the pill, with options highlighted on hover and the current page in a soft blue pill, where Map also shows the header line and the Course Catalog sidebar; below, `ParallelPaths.jsx` is the default 2D design preview with six sample courses, four career paths, curved illustrative links, and blue selection highlights; a bottom-left button switches to the existing placeholder course map in `CourseNetwork.jsx`, built as a 3D model with every course as a node and placeholder links, gentle motion, drag to turn it, scroll or pinch to zoom around the mouse, and the course name on hover, plus a top-right panel with the course number and name, otherwise blank for now; clicking a node shows the header line and the Course Catalog sidebar), a Course List tab with the Course Catalog sidebar (a search box, look only for now, shared with the Courses page through `SearchField.jsx`, and the name of the course selected on the map) that shows every course and every career side by side, a Careers tab with each career shown as its own pill, four per row, and a Courses tab with a search bar (look only, for now) above each course shown as its own pill, four per row. Last is a Dashboard tab (`Dashboard.jsx`) with a "Current Stats" sidebar and a panel holding a small placeholder map of a few connected nodes. It reads them from `../data/`, which `vite.config.js` allows.

On Map on narrow screens, the tabs wrap and the Course Catalog sidebar stacks above the graph. The Parallel paths preview is still a visual demo, not the full catalog or decided connection logic.

## Run it
```
cd frontend
npm install
npm run dev
```

## Logo assets

`src/assets/branding/` contains Logo 1 (blue), Logo 2 (purple gradient), and the approved design reference. The header currently uses Logo 1 in a 44px white circle.
