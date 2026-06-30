# ◈ Wavelength — Music Player

A sleek, fully featured browser-based music player with a bundled 3-track playlist. No frameworks, no build tools — just HTML, CSS, and vanilla JavaScript.

![Wavelength Music Player](https://img.shields.io/badge/status-ready-6C63FF?style=flat-square) ![License](https://img.shields.io/badge/license-MIT%20%28code%20only%29-A89FFF?style=flat-square)

---

## Features

- **3 bundled tracks** with real metadata and album art, ready to play on load
- **Drag & drop** or file picker to add more audio files
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
| Play / Pause | Click the large play button or press `Space` |
| Seek | Click or drag the progress bar |
| Volume | Drag the volume bar or press `↑` / `↓` |
| Next / Prev | Click arrows or press `Ctrl + →` / `Ctrl + ←` |
| Mute | Click the speaker icon or press `M` |
| Shuffle | Click the shuffle icon or press `S` |
| Add tracks | Click **Add audio files** or drag files onto the window |
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
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── audio/
│   │   ├── track1.mp3
│   │   ├── track2.mp3
│   │   └── track3.mp3
│   └── covers/
│       └── track1.jpg
└── README.md
```

---

## ⚠️ A note on the bundled audio

The 3 MP3 files included in `assets/audio/` are tracks the project owner supplied directly and are **not verified as royalty-free or licensed for redistribution**. Their ID3 metadata indicates they are commercially released Vietnamese pop songs (sourced from NhacCuaTui.com). **Before pushing this repo to a public GitHub page, confirm you have the rights to distribute these files**, or swap them out for your own licensed/royalty-free audio in `assets/audio/` and update the track list in `js/app.js` (`BUNDLED_TRACKS`).

If you don't have redistribution rights, two safer options:
1. Keep the repo **private**.
2. Replace the bundled files with royalty-free placeholders and let users add their own music via the upload button.

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

The **player code** (HTML/CSS/JS) is MIT — free to use, modify, and distribute. The bundled audio files are **not** covered by this license; see the note above.
