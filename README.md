# griffinrutherford-portfolio

# Griffin Rutherford - Personal Portfolio

Welcome to my personal portfolio website! This site serves as a digital hub for what I'm building — Coherascent Labs, Lune Synth, and Breakwater Operations — along with my technical background and passions. Built with modern web technologies, it reflects my technical skills and love for clean, interactive design. The original resume-style site lives on at [`/legacy`](legacy/index.html).

## Table of Contents
- [About Me](#about-me)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Projects Highlight](#projects-highlight)
- [Contact](#contact)

## About Me
I'm Griffin Rutherford, Chief Technology Officer at Coherascent Labs, where I've architected Lune Synth, an edtech app built to give people honest, useful feedback instead of empty praise. What drives me is connecting people to technology rigorous enough to actually trust, rather than chasing flashy demos. I also co-founded Breakwater Operations, an AI strategy advisory practice. B.S./M.S. in Computer Science from Colorado School of Mines. Beyond tech, I'm an athlete, adventurer, and community builder.

## Features
- **Retro Themes**: **Retro Mode** (`90s.html`) opens in Windows Vista / Frutiger Aero. An icon dropdown selects Vista, Windows XP, Kirby, Matrix, or Hypercube directly. XP includes the Bliss wallpaper, original Windows flag, nine original shell icons, XP cursors, and extracted Luna taskbar/tray/Start-button sprites with hover and pressed states. Desktop shortcuts, window controls, and project search remain functional. Matrix uses translucent panels and a digital-rain icon; the selected theme also supplies the browser favicon. Vista is the default; an explicit `?theme=hypercube` (or another valid theme name) opens that theme directly. Asset sources are documented in `images/vista/README.md` and `images/xp/README.md`.
- **Responsive Design**: Optimized for desktop and mobile viewing.
- **Interactive Elements**: Collapsible sections for Experience, Labs, and more.
- **Video Header**: A dynamic intro video with my name overlay.
- **Social Integration**: Links to LinkedIn and Instagram for professional and personal insights.
- **Quick Links Menu**: Easy navigation to key sections like About, Ventures, and Experience.

## Technologies Used
- **HTML5**: Structure and content.
- **CSS3**: Styling, with custom styles in `css/styles.css`.
- **JavaScript**: Interactivity, managed via `js/script.js`.
- **Google Fonts**: Russo One font for a bold, modern look.
- **Media**: Video (`videos/hook-video-720.mp4`) and images for visual storytelling.

## Setup and Installation
To run this portfolio locally:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git

To check the retro theme picker and Vista interactions, serve the site locally and run `node tests/vista-aero.browser.cjs` with Playwright installed. Set `PAGE_URL` to the served `90s.html` route and `CHROME_PATH` to an installed Chrome executable if needed. The check exercises keyboard navigation, real Start-menu shortcuts, window minimize/restore/expand, project search and empty results, theme cleanup, reduced motion, and 320/390/768-pixel layouts, and saves screenshots to `/tmp/vista-aero-review` (or `SCREENSHOT_DIR`).

Run `node tests/retro-themes.browser.cjs` with the same browser environment to check icon dropdown keyboard navigation, all five themes, XP desktop controls/search/Start shortcuts, cleanup between themes, mobile layouts, and reduced motion. Screenshots are saved to `/tmp/retro-themes-review` (or `SCREENSHOT_DIR`).

Hypercube opens directly at [`90s.html?theme=hypercube`](https://griffinrutherford.com/90s.html?theme=hypercube). It pairs translucent dark panels with a floating neon cube constellation and an interactive 3D–6D coordinate observatory. The tesseract uses the same coordinate geometry as the [Beyond 3D lecture](gradient-descent-worksheet/?version=dimensions). Cyan marks XYZ edges; pink, gold, and lime mark additional directions. One XYZ cube is highlighted, and nearby text explains that these are projections, including their overlapping vertices. Orbit with a pointer or the arrow keys, choose Front/Reverse/Overhead, turn the extra planes, or pause all theme motion. Reduced motion starts with a still scene; switching themes or hiding the tab stops its animation work. The icon and visuals are original SVG/canvas assets.

Run `node --test tests/hypercube-core.test.cjs` to verify topology, rotation invariants, finite projections, agreement with the lecture’s perspective equation, and continuity across full turns. Run `node tests/hypercube.browser.cjs` with the browser environment above to verify controls, keyboard/pointer orbit, pause and reduced motion, theme links, cleanup, and 320–1440px/landscape layouts. It saves 38 screenshots and a local review gallery to `/tmp/hypercube-review` (or `SCREENSHOT_DIR`), including 3D–6D from three viewpoints on phone and desktop, plus three extra-direction turns. The recorded visual review is in [`tests/hypercube-review.json`](tests/hypercube-review.json), with screenshot sheets under `images/hypercube-review/`. Scores are subjective design assessments, separate from automated test results.
