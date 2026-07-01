# 🎵 Music Player

One file. No setup. No terminal. No conversion.

---

## ▶ Open it

Just **double-click `index.html`** — the player opens in your browser.

> 📝 **Covers:** When opened locally (double-click), covers show as a letter placeholder (e.g. **A**) due to browser security. On GitHub Pages they show as real images. This is normal — the player works perfectly either way.

---

## ➕ Add a song — 4 steps

**Step 1** — Copy your `.mp3` into this folder

**Step 2** — Copy your cover image (`.jpg` or `.png`) into this folder

**Step 3** — Open `index.html` in Notepad / any text editor

**Step 4** — Find the `SONGS` list near the top and add a block:

```js
{
  title:  'My Song',
  artist: 'My Artist',
  audio:  'my-song.mp3',
  cover:  'my-cover.jpg',
},
```

Save → refresh browser. Done ✅

---

## 🌐 GitHub Pages (covers show as real images)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/music-player.git
git push -u origin main
```

Then: **Settings → Pages → Branch: main → Save**

Live at: `https://YOUR-USERNAME.github.io/music-player/`

---

## 🎹 Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume |
| `Ctrl+→` | Next track |
| `Ctrl+←` | Prev track |
| `M` | Mute |
| `S` | Shuffle |

---

## 📁 Files

```
music-player/
├── index.html   ← everything is here (open this)
├── song1.mp3
├── song2.mp3
├── song3.mp3
├── cover1.jpg
├── cover2.jpg
└── cover3.jpg
```

## License
MIT — verify rights for bundled audio before sharing publicly.
