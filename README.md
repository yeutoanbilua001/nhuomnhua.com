# ◈ Wavelength — Music Player

A sleek, fully featured browser-based music player. No frameworks, no build tools — just HTML, CSS, and vanilla JavaScript.

![Wavelength Music Player](https://img.shields.io/badge/status-ready-6C63FF?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-A89FFF?style=flat-square)

---

## Features

- **Drag & drop** or file picker to add audio files
- **Waveform visualizer** powered by the Web Audio API
- **Shuffle** and **repeat** (off / all / one)
- **Playback speed** control (0.5× – 2×)
- **Volume** control with mute toggle
- **Seek** by clicking or dragging the progress bar
- **Favorites** toggle per track
- **Media Session API** — controls work from lock screen / OS media keys
- **Keyboard shortcuts** (see below)
- Responsive — works on mobile, tablet, and desktop
- Zero dependencies, zero build step

---

## Getting Started

```bash
git clone https://github.com/your-username/wavelength-player.git
cd wavelength-player

# Open directly in browser — no server needed for basic use
open index.html

# Or serve locally for full Web Audio API support
npx serve .
# then visit http://localhost:3000
```

> **Note:** Some browsers require a local server (not `file://`) for the Web Audio API visualizer to work correctly. `npx serve .` is the quickest way.

---

## Usage

| Action | How |
|--------|-----|
| Add tracks | Click **Add audio files** or drag files onto the window |
| Play / Pause | Click the large play button or press `Space` |
| Seek | Click or drag the progress bar |
| Volume | Drag the volume bar or press `↑` / `↓` |
| Next / Prev | Click arrows or press `Ctrl + →` / `Ctrl + ←` |
| Mute | Click the speaker icon or press `M` |
| Shuffle | Click the shuffle icon or press `S` |
| Playlist | Click the ☰ menu icon |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |
| `Ctrl + →` | Next track |
| `Ctrl + ←` | Previous track |
| `M` | Toggle mute |
| `S` | Toggle shuffle |

---

## Project Structure

```
wavelength-player/
├── index.html       # App shell & markup
├── css/
│   └── style.css    # All styles (CSS custom properties + responsive)
├── js/
│   └── app.js       # All logic (Audio API, UI, playlist)
└── README.md
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge 80+ | ✅ Full |
| Firefox 75+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Mobile Chrome / Safari | ✅ Full |

---

## License

MIT — free to use, modify, and distribute.
