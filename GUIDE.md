# 🎵 Music Player — How to Use & Add Songs

## ▶ How to open the player

### Windows
Double-click **`START.bat`**
→ A black window opens (keep it open) → browser opens automatically

### Mac
Double-click **`START.command`**
→ A terminal opens (keep it open) → browser opens automatically

> **Why do I need this?**
> Browsers block loading cover images from local files for security.
> The START file runs a tiny built-in Python server that fixes this.
> Python comes pre-installed on Mac and most Windows 11 machines.
> If Windows says Python is missing, install it free from python.org.

---

## 🎵 How to add a song

### Step 1 — Copy your files into the music-player folder

Put your `.mp3` and cover image (`.jpg` or `.png`) in the **same folder** as `index.html`:

```
music-player/
├── index.html
├── player.js       ← you will edit this
├── style.css
├── START.bat
├── START.command
├── song1.mp3
├── song2.mp3
├── song3.mp3
├── cover1.jpg
├── cover2.jpg
├── cover3.jpg
│
├── my-new-song.mp3    ← copy here
└── my-new-cover.jpg   ← copy here
```

---

### Step 2 — Open player.js in a text editor

Right-click `player.js` → **Open With** → Notepad (Windows) or TextEdit (Mac)

At the top of the file you'll see the **SONGS list**:

```javascript
const SONGS = [

  // ── Song 1 ──────────────────────────────────────────
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'song1.mp3',
    cover:  'cover1.jpg',
  },

  // ── Song 2 ──────────────────────────────────────────
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'song2.mp3',
    cover:  'cover2.jpg',
  },

  // ── Song 3 ──────────────────────────────────────────
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'song3.mp3',
    cover:  'cover3.jpg',
  },

  // ── ADD MORE SONGS HERE ─────────────────────────────

];
```

---

### Step 3 — Add your song

Copy one of the existing blocks and paste it **before** the closing `];`

Then fill in your song's details:

```javascript
  // ── Song 4 ──────────────────────────────────────────
  {
    title:  'My New Song',
    artist: 'Artist Name',
    audio:  'my-new-song.mp3',    ← must match filename exactly
    cover:  'my-new-cover.jpg',   ← must match filename exactly
  },
```

⚠️ **Important:** Make sure there is a **comma** after the `}` of every song block.

---

### Step 4 — Save and refresh

1. Save `player.js`
2. Go to the browser
3. Press `Ctrl + R` (Windows) or `Cmd + R` (Mac) to refresh
4. Your new song appears at the bottom of the playlist ✅

---

## ❌ How to remove a song

Delete the entire block for that song from `player.js`:

```javascript
  // Delete from here...
  {
    title:  'Song to Remove',
    artist: 'Artist',
    audio:  'file.mp3',
    cover:  'cover.jpg',
  },
  // ...to here
```

---

## 🔄 How to replace a song

Update the fields in an existing block. Change any of the 4 fields:

```javascript
  {
    title:  'New Title',       ← changed
    artist: 'New Artist',      ← changed
    audio:  'new-file.mp3',    ← changed (and copy the new .mp3 to the folder)
    cover:  'new-cover.jpg',   ← changed (and copy the new image to the folder)
  },
```

---

## 🎹 Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |
| `Ctrl + →` | Next track |
| `Ctrl + ←` | Previous track |
| `M` | Mute / Unmute |
| `S` | Toggle Shuffle |

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| Covers not showing | Make sure you opened with START.bat or START.command (not index.html directly) |
| No sound | Check that the `audio:` filename exactly matches the `.mp3` in the folder |
| Song not appearing | Make sure you saved `player.js` and refreshed the browser |
| START.bat won't open | Install Python from [python.org](https://python.org) — it's free |
| Port already in use | Close the old black window first, then try START again |

---

## 📁 File reference

| File | Purpose | Edit? |
|------|---------|-------|
| `index.html` | Page structure | No |
| `style.css` | Visual design | Optional |
| `player.js` | Song list + player logic | **Yes — add songs here** |
| `START.bat` | Launch on Windows | No |
| `START.command` | Launch on Mac | No |
| `GUIDE.md` | This guide | No |
| `*.mp3` | Audio files | Add yours |
| `*.jpg/png` | Cover images | Add yours |

---

## 🌐 Share it online with GitHub Pages

Once pushed to GitHub, enable GitHub Pages and your player is public at a real URL — no START.bat needed, covers work perfectly.

1. Push the repo to GitHub (see README)
2. Go to **Settings → Pages**
3. Set Branch: `main` / folder: `/ (root)` → **Save**
4. Done — live at `https://YOUR-USERNAME.github.io/REPO-NAME/`

After adding a new song locally: `git add . && git commit -m "add song" && git push` — it updates the live site too.
