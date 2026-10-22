# frontend/

The student-facing website: React, with Vite for development.

**So far:** the header (blue CourseMap logo, title, and a pill-shaped tab bar with 7 tabs, plus a login icon in the top right, hidden on Dashboard, that opens a blank Login page), a Dashboard tab (the header line is hidden and the logo and title sit in a pill, which toggles the header line and the Course Catalog sidebar; below is a placeholder course map in `CourseNetwork.jsx`, with every course as a node, placeholder links, a 3D look, gentle motion, drag to pan and scroll or pinch to zoom, and the course name on hover), a Course List tab with a blank Course Catalog sidebar that shows every course and every career side by side, a Careers tab with each career shown as its own pill, four per row, and a Courses tab with a search bar (look only, for now) above each course shown as its own pill, four per row. It reads them from `../data/`, which `vite.config.js` allows.

## Run it
```
cd frontend
npm install
npm run dev
```

## Logo assets

`src/assets/branding/` contains Logo 1 (blue), Logo 2 (purple gradient), and the approved design reference. The header currently uses Logo 1 in a 44px white circle.
