# 🎵 Music Player

3 songs, cover art, full controls. Works locally and live on GitHub Pages.

---

## 🌐 Live on GitHub Pages (recommended)

Push this repo to GitHub, then enable GitHub Pages:

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under *Branch*, select `main` → `/ (root)` → click **Save**
4. Your player is live at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

✅ Covers work perfectly — GitHub Pages is a real server.

---

## 💻 Run locally

| System | How |
|--------|-----|
| **Windows** | Double-click `START.bat` |
| **Mac** | Double-click `START.command` |

Browser opens automatically. Keep the terminal window open while listening.

> Python is required (comes pre-installed on Mac; get it free at [python.org](https://python.org) on Windows).

---

## ➕ Add a song

1. Copy your `.mp3` and cover image into this folder
2. Open `player.js` in any text editor (Notepad is fine)
3. Add one block to the `SONGS` list at the top:

```javascript
{
  title:  'My New Song',
  artist: 'Artist Name',
  audio:  'my-song.mp3',
  cover:  'my-cover.jpg',
},
```

4. Save → refresh browser (or `git push` to update GitHub Pages)

Full step-by-step: **[GUIDE.md](GUIDE.md)**

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: music player"
git remote add origin https://github.com/YOUR-USERNAME/music-player.git
git push -u origin main
```

---

## Features

- Play / Pause / Next / Prev
- Shuffle & Repeat (one / all / off)
- Seek bar + Volume control
- Playlist with cover thumbnails
- Blurred art background
- Keyboard shortcuts (`Space`, `↑↓`, `Ctrl+←→`, `M`, `S`)
- Mobile friendly

---

## File structure

```
music-player/
├── index.html        ← the page
├── player.js         ← SONGS list (edit to add songs)
├── style.css         ← design
├── START.bat         ← open locally on Windows
├── START.command     ← open locally on Mac
├── GUIDE.md          ← how to add songs
├── README.md
├── cover1.jpg
├── cover2.jpg
├── cover3.jpg
├── song1.mp3
├── song2.mp3
└── song3.mp3
```

## License

MIT — code is free to use. Verify rights for bundled audio before distributing publicly.
