# 🎵 Music Player

A modern browser music player. **Just double-click `index.html`** — no server, no install, no setup.

Cover images are embedded as base64 in `covers.js` so they always display correctly on `file://`.

---

## Run it

```
Double-click index.html
```

That's it.

---

## Add a song

See **[GUIDE.md](GUIDE.md)** for full step-by-step instructions.

Quick version:
1. Put your `.mp3` in this folder
2. Convert your cover image to base64 → paste into `covers.js`
3. Add one `{ }` block to the `SONGS` array in `player.js`

---

## Features

- Album art with crossfade + animated ring while playing
- Blurred art as dynamic background
- Play / Pause / Next / Prev
- Shuffle & Repeat (one song / all songs / off)
- Click or drag progress bar to seek
- Volume slider
- Scrollable playlist with thumbnails
- OS media controls (lock screen buttons work)
- Keyboard shortcuts
- Works on mobile

---

## Project files

```
music-player/
├── index.html   ← open this
├── style.css    ← design
├── player.js    ← SONGS list + logic
├── covers.js    ← cover images (base64)
├── GUIDE.md     ← how to add songs
├── README.md
├── song1.mp3
├── song2.mp3
└── song3.mp3
```

---

## License

MIT — code is free to use. Verify rights for bundled audio before distributing publicly.
