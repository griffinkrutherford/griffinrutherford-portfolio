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
- **Retro Themes**: **Retro Mode** (`90s.html`) opens in Windows Vista / Frutiger Aero. An icon dropdown selects Vista, Windows XP, Kirby, or Matrix directly. XP includes the Bliss wallpaper, blue Luna window borders, cream panels, a green Start button, and working desktop shortcuts, window controls, and project search. Vista remains the initial theme on every visit. Asset sources are documented in `images/vista/README.md` and `images/xp/README.md`.
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

Run `node tests/retro-themes.browser.cjs` with the same browser environment to check icon dropdown keyboard navigation, all four themes, XP desktop controls/search/Start shortcuts, cleanup between themes, mobile layouts, and reduced motion. Screenshots are saved to `/tmp/retro-themes-review` (or `SCREENSHOT_DIR`).
