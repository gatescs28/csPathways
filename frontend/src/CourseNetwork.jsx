import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import courses from '../../data/courses/courses.json'

// Placeholder: how courses connect isn't decided yet (Phase 2), so each course
// is joined to its nearest neighbors on the page just to give the chart a shape.

// The graph's own size, before zooming. It opens zoomed out, like GSU's, and
// the user can drag to pan and scroll (or pinch) to zoom.
const GRAPH_WIDTH = 1000
const GRAPH_HEIGHT = 684
const ASPECT = GRAPH_WIDTH / GRAPH_HEIGHT
const PADDING = 48
const NEIGHBORS = 2
const START_ZOOM = 0.6
const MIN_ZOOM = 0.3
const MAX_ZOOM = 3
const NODE_RADIUS = 7
// Each node sits at a depth: near ones are drawn bigger and on top, far ones
// smaller and hazier, and near ones shift a little more when panning.
const DEPTH = 0.3 // near nodes up to 30% bigger, far ones 30% smaller
const PARALLAX = 0.06 // near nodes move up to 6% more than the rest when panning
const MAX_HAZE = 0.55
const DRIFT = 7 // how far each node wanders around its spot
const DEPTH_DRIFT = 0.08 // how far each node drifts nearer and farther
const LINK_BOW = 10 // how far a link's curve bows in and out
const MOUSE_RADIUS = 180
const MOUSE_PULL = 16

// Seeded random numbers, so the layout is the same on every visit.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function distance(a, b) {
  return Math.hypot((a.x - b.x) * ASPECT, a.y - b.y)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function buildLayout() {
  const rand = seededRandom(7)
  const depthRand = seededRandom(11)
  const nodes = []
  for (const course of courses.groups.flatMap((group) => group.items)) {
    // Of 20 random spots, keep the one farthest from every node placed so far.
    let best = null
    let bestGap = -1
    for (let i = 0; i < 20; i++) {
      const spot = { x: rand(), y: rand() }
      const gap = Math.min(Infinity, ...nodes.map((node) => distance(spot, node)))
      if (gap > bestGap) {
        best = spot
        bestGap = gap
      }
    }
    nodes.push({
      ...best,
      worldX: (best.x - 0.5) * GRAPH_WIDTH,
      worldY: (best.y - 0.5) * GRAPH_HEIGHT,
      depth: depthRand() * 2 - 1, // -1 is farthest, 1 is nearest
      course,
      phase: rand() * Math.PI * 2,
      rate: 0.5 + rand() * 0.5,
    })
  }

  const seen = new Set()
  const links = []
  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((other, j) => ({ j, d: distance(node, other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBORS)
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ from: i, to: j, phase: rand() * Math.PI * 2, rate: 0.4 + rand() * 0.4 })
    }
  })

  // Far nodes are drawn first so near ones sit on top.
  const drawOrder = nodes.map((_, i) => i).sort((a, b) => nodes[a].depth - nodes[b].depth)
  return { nodes, links, drawOrder }
}

// 0 for the farthest nodes, 1 for the nearest.
function nearness(node) {
  return (node.depth + 1) / 2
}

// Above the node, or below it near the top, and never past the sides.
function placeLabel(label, p, width) {
  const gap = p.scale * NODE_RADIUS * 1.4 + 10
  const half = label.offsetWidth / 2
  const x = clamp(p.x, half + 8, Math.max(width - half - 8, half + 8))
  const above = p.y - gap - label.offsetHeight > 8
  const y = above ? p.y - gap - label.offsetHeight : p.y + gap
  label.style.transform = `translate(${x - half}px, ${y}px)`
}

function CourseNetwork() {
  const layout = useMemo(buildLayout, [])
  const containerRef = useRef(null)
  const nodeRefs = useRef([])
  const linkRefs = useRef([])
  const glowLinkRefs = useRef([])
  const gradientRefs = useRef([])
  const pathsRef = useRef([])
  const labelRef = useRef(null)
  const mouseRef = useRef(null)
  const hoveredRef = useRef(null)
  const positionsRef = useRef([])
  // Pan and zoom: the graph point at the center of the area, and the zoom level.
  const viewRef = useRef(null)
  const dragRef = useRef(null)
  const redrawRef = useRef(null)
  // Kept across resizes so the motion doesn't jump.
  const motionRef = useRef({ time: 0, speed: 1, pulls: layout.nodes.map(() => ({ x: 0, y: 0 })) })
  const [size, setSize] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [dragging, setDragging] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = () => setSize({ width: container.clientWidth, height: container.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!size) return
    if (!viewRef.current) {
      // Start zoomed out, and further if the graph wouldn't fit.
      const fit = Math.min((size.width - PADDING * 2) / GRAPH_WIDTH, (size.height - PADDING * 2) / GRAPH_HEIGHT)
      viewRef.current = { x: 0, y: 0, zoom: clamp(Math.min(START_ZOOM, fit), MIN_ZOOM, MAX_ZOOM) }
    }
    const view = viewRef.current
    const motion = motionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const positions = layout.nodes.map(() => ({ x: 0, y: 0, scale: 1 }))
    positionsRef.current = positions
    const centerX = size.width / 2
    const centerY = size.height / 2
    let last = performance.now()
    let frame = null

    function draw(now) {
      frame = null
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // Motion slows to a stop while a node is hovered and picks back up after.
      const target = reduceMotion || hoveredRef.current !== null ? 0 : 1
      motion.speed = reduceMotion ? 0 : motion.speed + (target - motion.speed) * Math.min(1, dt * 6)
      motion.time += dt * motion.speed
      const time = motion.time
      const zoom = view.zoom

      // The mouse's spot on the graph.
      const screenMouse = mouseRef.current
      const mouse = screenMouse && {
        x: view.x + (screenMouse.x - centerX) / zoom,
        y: view.y + (screenMouse.y - centerY) / zoom,
      }

      layout.nodes.forEach((node, i) => {
        const x = node.worldX + Math.sin(time * node.rate + node.phase) * DRIFT
        const y = node.worldY + Math.cos(time * node.rate * 0.8 + node.phase * 1.3) * DRIFT
        const depth = node.depth + Math.sin(time * node.rate * 0.6 + node.phase * 0.7) * DEPTH_DRIFT

        // Nodes near the mouse lean toward it, never past it.
        let pullX = 0
        let pullY = 0
        if (mouse) {
          const dx = mouse.x - x
          const dy = mouse.y - y
          const d = Math.hypot(dx, dy)
          if (d > 0 && d < MOUSE_RADIUS) {
            const force = Math.min((1 - d / MOUSE_RADIUS) * MOUSE_PULL, d * 0.5)
            pullX = (dx / d) * force
            pullY = (dy / d) * force
          }
        }
        const pull = motion.pulls[i]
        const ease = Math.min(1, dt * 4) * motion.speed
        pull.x += (pullX - pull.x) * ease
        pull.y += (pullY - pull.y) * ease

        // Nearer nodes are drawn bigger and sit a little farther from the center.
        const scale = zoom * (1 + depth * DEPTH)
        const spread = zoom * (1 + depth * PARALLAX)
        const p = positions[i]
        p.x = centerX + (x + pull.x - view.x) * spread
        p.y = centerY + (y + pull.y - view.y) * spread
        p.scale = scale
        nodeRefs.current[i]?.setAttribute(
          'transform',
          `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${scale.toFixed(3)})`,
        )
      })

      // Each link is a curve whose middle bows slowly from side to side.
      const h = hoveredRef.current
      layout.links.forEach((link, i) => {
        const a = positions[link.from]
        const b = positions[link.to]
        const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
        const bow = Math.sin(time * link.rate + link.phase) * LINK_BOW * zoom
        const cx = (a.x + b.x) / 2 - ((b.y - a.y) / length) * bow
        const cy = (a.y + b.y) / 2 + ((b.x - a.x) / length) * bow
        const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
        const width = (a.scale + b.scale) / 2
        pathsRef.current[i] = d
        const path = linkRefs.current[i]
        if (path) {
          path.setAttribute('d', d)
          path.style.strokeWidth = (2 * width).toFixed(2)
        }
        const glowPath = glowLinkRefs.current[i]
        if (glowPath) {
          glowPath.setAttribute('d', d)
          glowPath.style.strokeWidth = (2.5 * width).toFixed(2)
        }
        const gradient = gradientRefs.current[i]
        if (gradient && h !== null) {
          const [start, end] = link.from === h ? [a, b] : [b, a]
          gradient.setAttribute('x1', start.x)
          gradient.setAttribute('y1', start.y)
          gradient.setAttribute('x2', end.x)
          gradient.setAttribute('y2', end.y)
        }
      })

      if (h !== null && labelRef.current) placeLabel(labelRef.current, positions[h], size.width)

      if (!reduceMotion) redraw()
    }

    function redraw() {
      if (frame === null) frame = requestAnimationFrame(draw)
    }

    redrawRef.current = redraw
    draw(performance.now())
    return () => {
      cancelAnimationFrame(frame)
      redrawRef.current = null
    }
  }, [layout, size])

  useLayoutEffect(() => {
    if (hovered !== null && labelRef.current) placeLabel(labelRef.current, positionsRef.current[hovered], size.width)
  }, [hovered, size])

  // Scrolling or pinching zooms in and out around the mouse.
  useEffect(() => {
    const container = containerRef.current
    function zoom(e) {
      const view = viewRef.current
      if (!view) return
      e.preventDefault()
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left - rect.width / 2
      const my = e.clientY - rect.top - rect.height / 2
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
      const next = clamp(view.zoom * Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.002)), MIN_ZOOM, MAX_ZOOM)
      view.x += mx / view.zoom - mx / next
      view.y += my / view.zoom - my / next
      view.zoom = next
      redrawRef.current?.()
    }
    container.addEventListener('wheel', zoom, { passive: false })
    return () => container.removeEventListener('wheel', zoom)
  }, [])

  function hover(i) {
    if (dragRef.current?.moved) return
    hoveredRef.current = i
    setHovered(i)
    redrawRef.current?.()
  }

  function startDrag(e) {
    if (e.button !== 0 || !viewRef.current) return
    dragRef.current = {
      pointer: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      viewX: viewRef.current.x,
      viewY: viewRef.current.y,
      moved: false,
    }
  }

  function moveMouse(e) {
    const drag = dragRef.current
    if (!drag) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      return
    }
    // Dragging pans the graph, which follows the mouse.
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 3) return
      hover(null)
      drag.moved = true
      containerRef.current.setPointerCapture(drag.pointer)
      mouseRef.current = null
      setDragging(true)
    }
    const view = viewRef.current
    view.x = drag.viewX - dx / view.zoom
    view.y = drag.viewY - dy / view.zoom
    redrawRef.current?.()
  }

  function endDrag() {
    if (dragRef.current?.moved) setDragging(false)
    dragRef.current = null
  }

  const hoveredCourse = hovered !== null ? layout.nodes[hovered].course : null
  const hoveredLinks =
    hovered !== null ? layout.links.flatMap((link, i) => (link.from === hovered || link.to === hovered ? [i] : [])) : []

  return (
    <div
      ref={containerRef}
      className={dragging ? 'network dragging' : 'network'}
      onPointerDown={startDrag}
      onPointerMove={moveMouse}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => (mouseRef.current = null)}
    >
      {size && (
        <svg className="network-chart" width={size.width} height={size.height} role="img" aria-label="Course map">
          <defs>
            {/* Logo 2's purple gradient, for the hovered node. */}
            <linearGradient id="node-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#bd7cf4" />
              <stop offset="0.5" stopColor="#8750f5" />
              <stop offset="1" stopColor="#535cf6" />
            </linearGradient>
            {/* The logo's blue, lit from the top left so each ring looks rounded. */}
            <linearGradient id="node-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6aaaf7" />
              <stop offset="0.5" stopColor="#398df3" />
              <stop offset="1" stopColor="#2373da" />
            </linearGradient>
            <radialGradient id="node-fill" cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#dbe9fc" />
            </radialGradient>
            <radialGradient id="node-shadow">
              <stop offset="0" stopColor="#1d3a66" stopOpacity="0.28" />
              <stop offset="1" stopColor="#1d3a66" stopOpacity="0" />
            </radialGradient>
            {/* The same purple gradient along each of the hovered node's links,
                running out from the node. */}
            {hoveredLinks.map((i) => {
              const link = layout.links[i]
              const start = positionsRef.current[hovered]
              const end = positionsRef.current[link.from === hovered ? link.to : link.from]
              return (
                <linearGradient
                  key={i}
                  ref={(el) => (gradientRefs.current[i] = el)}
                  id={`link-gradient-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                >
                  <stop offset="0" stopColor="#bd7cf4" />
                  <stop offset="0.5" stopColor="#8750f5" />
                  <stop offset="1" stopColor="#535cf6" />
                </linearGradient>
              )
            })}
            <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="network-links">
            {layout.links.map((link, i) => (
              <path
                key={i}
                ref={(el) => (linkRefs.current[i] = el)}
                opacity={0.45 + 0.55 * ((nearness(layout.nodes[link.from]) + nearness(layout.nodes[link.to])) / 2)}
              />
            ))}
          </g>
          <g className="network-links-hovered">
            {hoveredLinks.map((i) => (
              <path
                key={i}
                ref={(el) => (glowLinkRefs.current[i] = el)}
                d={pathsRef.current[i]}
                stroke={`url(#link-gradient-${i})`}
              />
            ))}
          </g>
          <g>
            {layout.drawOrder.map((i) => {
              const near = nearness(layout.nodes[i])
              // Nearer nodes float higher, so their shadows fall farther away.
              const lift = 1.5 + near * 2.5
              return (
                <g
                  key={i}
                  ref={(el) => (nodeRefs.current[i] = el)}
                  className={i === hovered ? 'network-node hovered' : 'network-node'}
                  onPointerEnter={() => hover(i)}
                  onPointerLeave={() => hover(null)}
                >
                  <circle className="node-shadow" cx={lift * 0.5} cy={lift} r={NODE_RADIUS + 3} />
                  <circle className="node-hit" r={NODE_RADIUS + 5} />
                  <circle className="node-ring" r={NODE_RADIUS} />
                  <circle className="node-haze" r={NODE_RADIUS + 2} opacity={MAX_HAZE * (1 - near)} />
                </g>
              )
            })}
          </g>
        </svg>
      )}
      {hoveredCourse && (
        <div ref={labelRef} className="network-label">
          <span className="network-label-code">{hoveredCourse.code}</span>
          {hoveredCourse.title}
        </div>
      )}
    </div>
  )
}

export default CourseNetwork
