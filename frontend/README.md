# frontend/

The student-facing website: React, with Vite for development.

**So far:** the header (blue CourseMap logo, title, and a pill-shaped tab bar with 8 tabs, plus a login icon in the top right, hidden on Map, that opens a blank Login page), a Map tab (the first tab, formerly named Dashboard; the header line is hidden and the logo and title sit in a pill that opens a dropdown menu of the same tabs that slides smoothly out of the pill, with options highlighted on hover and the current page in a soft blue pill, where Map also shows the header line and the Course Catalog sidebar; below, `ParallelPaths.jsx` is the default 2D design preview with six sample courses, four career paths, curved illustrative links, and blue selection highlights; a bottom-left button switches to the existing placeholder course map in `CourseNetwork.jsx`, built as a 3D model with every course as a node and placeholder links, gentle motion, drag to turn it, scroll or pinch to zoom around the mouse, and the course name on hover, plus a top-right panel with the course number and name, otherwise blank for now; clicking a node shows the header line and the Course Catalog sidebar), a Course List tab with the Course Catalog sidebar (a search box, look only for now, shared with the Courses page through `SearchField.jsx`, and the name of the course selected on the map) that shows every course and every career side by side, a Careers tab with a search bar like the Courses page's (look only) and the same filter button, narrowing by source, above each career shown as its own pill, four per row, and a Courses tab with a light blue search bar (look only, for now) and a filter button at its far right (`FilterMenu.jsx`) whose dropdown narrows the courses by level and source above each course shown as its own pill, four per row. An ACM tab (`Acm.jsx`) tests a Rondesignlab-inspired style the rest of the site doesn't use yet: frosted glass over a warm light, with a detailed black placeholder gauge and four solid white panels of placeholder stats on top, and below them a black panel with the year and hours by year and a route of placeholder classes taken, with some classes branching off it. Last is a Dashboard tab (`Dashboard.jsx`) with a "Student Stats" sidebar (`StudentStats.jsx`: the student's year, then folding sections for Classes Taken, Total Hours as a gauge out of 120 over the hours by year, and a Major Requirements grid of squares that show what each requirement is on hover, all placeholder values) and a folded map whose middle section holds a small placeholder map of a few connected nodes, each showing a sample class on hover. It reads them from `../data/`, which `vite.config.js` allows.

On Map on narrow screens, the tabs wrap and the Course Catalog sidebar stacks above the graph. The Parallel paths preview is still a visual demo, not the full catalog or decided connection logic.

## Run it
```
cd frontend
npm install
npm run dev
```

## Logo assets

`src/assets/branding/` contains Logo 1 (blue), Logo 2 (purple gradient), and the approved design reference. The header currently uses Logo 1 in a 44px white circle.
