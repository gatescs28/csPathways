# CourseMap logos

- `logo-1.svg`: blue logo, used in the header on every page except the Ronde-style ones.
- `logo-2.svg`: purple gradient variant with the same geometry.
- `rondeLogo.png`: standalone transparent PNG of the selected smoked-glass treatment (bottom-left concept in the Ronde comparison). Kept as the full-size source.
- `rondeLogo-header.png`: `rondeLogo.png` trimmed to its visible edges (with a 4px margin) and reduced to 256px wide, about 58KB instead of 748KB. It's the header logo on the Ronde-style pages (ACM and Skill Groupings), drawn 52px wide so it matches Logo 1's size and position.
- `rondeLogo-reference.png`: unchanged Ronde comparison sheet, preserving the selected bottom-left design in context.
- `approved-reference.png`: original approved generated comparison, preserved unchanged.

The SVGs are scalable recreations for screen use. Both use aligned, consistent-width crease segments with clearance around the course paths and nodes. They have transparent backgrounds; the header supplies the white circular background. The reference image contains presentation circles and labels, which are not part of the standalone logos.

`rondeLogo.png` was prepared with the built-in imagegen tool. Extraction prompt: isolate the bottom-left smoked-glass map mark, preserve its gray material and original routes/nodes, and remove all labels, presentation disc, background, and halo to transparency.
