# 🎵 SÓNG — Music Player

A clean, modern browser-based music player. No frameworks, no build step — pure HTML, CSS, and JavaScript.

## Features

- Smooth album art crossfade + blurred background on track change
- Play / pause / next / prev
- Shuffle and Repeat (one / all / off)
- Seekable progress bar + volume control
- Scrollable playlist with cover thumbnails
- Media Session API — works with OS lock screen controls
- Keyboard shortcuts
- Fully responsive (mobile-friendly)

## How to run

```bash
git clone https://github.com/your-username/song-player.git
cd song-player
open index.html        # macOS
# or just double-click index.html on Windows/Linux
```

No server required.

## How to add a song

See **[GUIDE.md](GUIDE.md)** for full step-by-step instructions.

Short version:
1. Put your `.mp3` in `assets/audio/`
2. Put your cover image in `assets/covers/`
3. Add one entry to the `SONGS` array in `player.js`

## Project structure

```
song-player/
├── index.html
├── style.css
├── player.js       ← add songs here (SONGS array at the top)
├── GUIDE.md        ← step-by-step guide for adding songs
├── README.md
└── assets/
    ├── audio/
    └── covers/
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume |
| `Ctrl+→` | Next track |
| `Ctrl+←` | Prev track |
| `M` | Mute |
| `S` | Shuffle |

## License

MIT — code is free to use and modify. Verify rights for any bundled audio files before distributing publicly.
