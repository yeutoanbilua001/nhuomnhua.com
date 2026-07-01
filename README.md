# 🎵 SÓNG — Music Player

A clean, dark music player that works by **double-clicking index.html** — no server, no setup.

Cover images are embedded as base64 inside `covers.js` so they always load correctly on `file://`.

## Run it

Just double-click `index.html`. That's it.

## Add a song

See **[GUIDE.md](GUIDE.md)** for full instructions.

Short version:
1. Convert your cover image to base64 → paste into `covers.js`
2. Put your `.mp3` in the project folder
3. Add one entry to the `SONGS` array in `player.js`

## Features

- Album art with blurred background (base64 — no server needed)
- Play / Pause / Next / Prev
- Shuffle & Repeat (one / all / off)
- Seekable progress bar & volume slider
- Scrollable playlist with thumbnails
- Keyboard shortcuts (`Space`, `↑↓`, `Ctrl+←→`, `M`, `S`)
- Mobile responsive

## Structure

```
song-player/
├── index.html    ← open this
├── style.css
├── player.js     ← SONGS list is here
├── covers.js     ← cover images as base64
├── GUIDE.md
├── README.md
├── song1.mp3
├── song2.mp3
└── song3.mp3
```

## License

MIT — code only. Verify rights for any bundled audio before distributing publicly.
