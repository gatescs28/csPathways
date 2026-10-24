# Ronde Design Rules

Design rules for CourseMap's "Ronde" style, inspired by Rondesignlab. The ACM page is where the style was worked out and tested, and it's the reference implementation (`frontend/src/Acm.jsx` and the ACM section of `frontend/src/App.css`). The site's design isn't final; this is the style being tested.

**These are rules, not a template.** Use them to make new pages and elements feel like part of the same family. Don't rebuild the ACM page's layout (gauge top left, four panels top right, a black panel and a route below) on other pages. Each page should have its own composition, built from the same materials and behaviors.

## Principles
1. **Deep contrast, mostly monochrome.** Black ink and solid white surfaces do almost all the work. Color lives only in the background light, never in data or text.
2. **Structured data visualization.** Show numbers as small, precise pictures (dials, meters, segments, dots, columns, routes), drawn thin and exact, with quiet detail like ticks and dotted guides.
3. **Bento modularity.** Content sits in clean tiles on a shared grid, with consistent gaps and proportional regions.
4. **One standout piece per region, standing alone.** The main visual of a region (a gauge, a route) sits straight on the background, not in a tile. Tiles hold the supporting stats.
5. **Tactile micro-interactions.** Things lift, sink, glow softly, and draw in, always subtly.
6. **Generous negative space and clear hierarchy.** Leave room to breathe. Every tile has a single clear focus: a label, one value, and one small picture.
7. **No clutter.** Avoid busy form elements, borders around everything, extra colors, and labels on every point.

## Background
- The page sits on a **light glowing behind frosted glass**. Make it mostly white, with soft warm glows (amber, coral, gold, a little pink) that have white centers, plus a dark spot or two for depth.
- Build it with two fixed layers behind the content. The first is the light: radial gradients on an off-white base (`#faf8f5`), larger than the window, drifting slowly (about 24s, alternating). The second is the glass: `backdrop-filter: blur(36px) saturate(170%) brightness(1.14)`, with a pale sheen across the top, one or two faint diagonal streaks, and a thin bright rim.
- **Vary the composition per page.** Move, reshape, or recolor the glows within the warm family so pages don't all look identical. Keep the glows away from where small text sits.
- Turn the drift off when the system's reduce-motion setting is on.

## Color
| Role | Value |
|---|---|
| Ink (text, data, lines) | `#000` |
| Light surface (panels, pills) | `#fff`, solid |
| Dark surface (accent panel) | `#000` |
| Muted text | `#5a5a5a` (labels, notes); `#6b6b6b` for "out of" totals |
| Pale track or remainder | `rgba(0, 0, 0, 0.1)` |
| Route channel | `rgba(0, 0, 0, 0.08)` |
| On dark: emphasis | `#fff` |
| On dark: de-emphasis marks | `rgba(255, 255, 255, 0.32)` |
| On dark: muted text | `rgba(255, 255, 255, 0.6)` |
| On dark: hairline | `rgba(255, 255, 255, 0.2)` |
| Focus outline | `2px solid #000`, offset 2–3px |

- Data is black on a pale track, or white over gray on the dark panel. To highlight one item, make it full ink and leave the rest pale (the emphasis form). Don't add a hue to tell series apart.
- The warm glow colors are only for the background. Never use them for marks or text.

## Layout
- Pages in this style fill the window below the header (use the `main fill` pattern) and split into **proportional regions** with grid `fr` tracks, such as halves, or 35/65. Choose the proportions for each page.
- Page padding is 24px top and bottom and 32px at the sides (16px on phones). Gaps between tiles and between regions are 16px.
- Center a standout visual optically within its region, and let it grow with the window (`clamp()` with `vw`/`vh`), but keep it well inside its region (about 70% at most).
- Tiles keep their share of the space no matter what they hold (`container-type: size`), and their contents adapt. On very short windows, secondary notes give way before anything overflows.
- **Breakpoints:**
  - At 1100px and below, the brand sits above the tabs, which wrap.
  - At 720px and below, everything stacks in one column, and horizontal routes run down the page.
  - At 600px and below, the gutters are 16px.
  - There's never a horizontal scroll.

## Surfaces
- **White panel:** solid `#fff`, 20px radius, no border. Shadow: `inset 0 -1px 0 rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.04), 0 10px 28px rgba(0,0,0,.08)`.
- **Black panel:** solid `#000`, the same shape, with a faint rim of light along its top edge (`inset 0 1px 0 rgba(255,255,255,.14)`) and a slightly deeper shadow. Use about one per view, as the contrast anchor.
- **Pill:** white, fully rounded, with the soft panel shadow. It's used for tooltips and names.
- Panels are solid, not glass. Separate things with space and shadow, not outlines.

## Typography
System sans throughout.

| Element | Style |
|---|---|
| Label | 0.8125rem, muted, sentence case, no trailing colon |
| Value | Large semibold, `letter-spacing: -0.02em`, `line-height: 1.1`, sized with `clamp()` against `vh` so it fits short windows; proportional figures |
| "Out of" total | 0.45em of the value, regular weight, muted, e.g. "80 / 120" |
| Note | 0.75rem, muted, under the chart |
| Course numbers and small figures | 0.8125rem, weight 500, `tabular-nums` |
| Tabs | 0.875rem, weight 300 |

## Data visualization
- **Stat tile:** a label, then the value, then at the bottom one small picture with a note under it. Use one stat per tile.
- **Mark specs:**
  - Columns are at most 24px wide, with a 4px rounded top and a square end at a hairline baseline.
  - Meters are 6px tall with 3px rounded ends.
  - Segments in a meter have a 2px gap between them.
  - Dots are 10px.
  - Squares are 12px with a 3px radius.
  - Lines are 2–3px with round caps.
- **Labels:** put values directly on marks (at a column's top, for example) and skip legends for a single series. When fill versus outline carries meaning (filled for main, hollow for branch), add a small inline key, keeping each key's dot with its words (`white-space: nowrap`).
- **Dials and gauges:**
  - fine ticks around the outside, longer every 30°, black where the fill has passed and pale after
  - a thick channel filled black up to the value, pale for the rest
  - a dotted arc inside, and a white dot at the end of the fill
  - a needle with a short tail behind a black hub with a white pin
  - no numbers on the dial unless it measures something real
- Don't use dual axes, rainbows, or 3D effects.

## Nodes, routes, and maps
- **Node:**
  - A normal node is a black hub with a white pin (22px, with a 7px pin).
  - A secondary node is smaller (16px).
  - The origin or start is a hollow ring (white with a 5px black ring), like the logo's nodes.
  - The current or latest item has a thin ring that slowly pulses out from it.
- **Lines:**
  - The main path is 3px black inside a 14px pale channel.
  - Secondary paths (branches) are 2px inside a 10px channel. They leave the main path square to it and bend into their nodes.
  - Draw all channels under all lines.
  - A dotted line that fades out means "this keeps going".
- **Labels:** put the short label (a course number) beside each node, on the side away from the lines. Show the full name in a white pill on the other side on hover and focus, easing 4px toward the node.
- **Drawing:** draw lines in percentage coordinates (`viewBox="0 0 100 100"`, `preserveAspectRatio="none"`) with `vector-effect: non-scaling-stroke`, and place nodes as HTML so they never stretch. Give phones their own positions rather than squeezing the desktop layout.

## Header and tabs
- On these pages, the header loses its bottom line, and the tabs lose their shared pill. Each tab is its own pill with a 1px black outline and light black text.
- On hover, a tab gets a 5% black fill. The current tab gets the site's gray (`#e5e5e5`). Pressing a tab sinks it (`scale: 0.96`).

## Motion and micro-interactions
| Interaction | Behavior |
|---|---|
| Tile entrance | Tiles rise 10px and fade in over 0.6s with `cubic-bezier(0.2, 0.8, 0.2, 1)`, staggered about 60ms apart. Use `animation-fill-mode: backwards` so hover transforms still work afterward |
| Value entrance | Dials sweep their fill out, with the needle turning alongside (1.4s, `cubic-bezier(0.22, 1, 0.36, 1)`) |
| Route entrance | Routes draw in from the start (a clip wipe), and each node pops in as the line reaches it |
| Tile hover | Tiles lift 3px and their shadow deepens (0.35s) |
| Node hover | Nodes get a soft 5px halo and come forward |
| Bar hover | Bars lighten a step |
| Press | Things sink slightly |
| Ambient | Only one thing moves on its own: the slow background drift, plus a pulse on the latest item |

**Always** include a `prefers-reduced-motion` fallback: entrances, pulses, and drift off, and hover changes instant. Static states must look finished (a pulse ring holds still, partway out).

## Accessibility
- Interactive or informational nodes are focusable (`tabIndex={0}`), and focus shows the same details as hover.
- Decorative pictures in tiles are `aria-hidden`; the numbers next to them carry the meaning. Charts and routes have an `aria-label`, and lists use `ol` and `li`.
- Keep text at full contrast: black on white, white or 60% white on black. Never rely on hover alone for information that matters.

## Building it
- Scope a page's styles under its app class and a page prefix (like `.app.acm` and `.acm-*`). If a second page adopts the style, pull the shared pieces into shared classes or tokens rather than copying the ACM rules wholesale.
- Placeholder data must be clearly placeholder (say so in code comments and the docs) and agree with the placeholders on other pages, for example the same student year, hours, and classes as the Dashboard.
- Check every change in the real app at about 1920×1080, 1440×900, 1280×720, 1100, 900, and phone widths. Look for overlaps, overflow, and anything clipped.

## Tried and rejected
- **A dark smoked-glass version** (near-black background, glass tiles, white text): the owner preferred the mostly white background.
- **Putting the standout visual (the gauge) on its own tile:** it should stand alone.
- **Glass or translucent panels:** panels are solid white (or solid black).
- **Warm gradient fills on data:** data stays black and white.
