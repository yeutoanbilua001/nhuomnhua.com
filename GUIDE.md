# 🎵 How to Add a Song — Step-by-Step Guide

This guide explains exactly how to add new songs to the SÓNG music player.

---

## What you need

- An audio file (`.mp3`, `.ogg`, `.wav`, or `.flac`)
- A cover image (`.jpg` or `.png`) — at least 200×200 px, square works best
- A text editor (VS Code, Notepad, etc.)

---

## Step 1 — Copy your audio file into the project

Place your `.mp3` file inside the `assets/audio/` folder.

```
song-player/
└── assets/
    └── audio/
        ├── song1.mp3
        ├── song2.mp3
        ├── song3.mp3
        └── my-new-song.mp3   ← put it here
```

> **Tip:** Use a simple filename with no spaces — e.g. `my-song.mp3` instead of `My Song (2024).mp3`.

---

## Step 2 — Copy your cover image into the project

Place your image file inside the `assets/covers/` folder.

```
song-player/
└── assets/
    └── covers/
        ├── cover1.jpg
        ├── cover2.jpg
        ├── cover3.jpg
        └── my-cover.jpg    ← put it here
```

> Don't have a cover? You can reuse one that's already there, or use any square `.jpg` image.

---

## Step 3 — Open `player.js` in a text editor

Find the `SONGS` array near the top of the file. It looks like this:

```javascript
const SONGS = [
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'assets/audio/song1.mp3',
    cover:  'assets/covers/cover1.jpg',
  },
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'assets/audio/song2.mp3',
    cover:  'assets/covers/cover2.jpg',
  },
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'assets/audio/song3.mp3',
    cover:  'assets/covers/cover3.jpg',
  },
  /* ── ADD MORE SONGS BELOW THIS LINE ── */
];
```

---

## Step 4 — Add your song as a new entry

Add a new `{ }` block **before** the closing `];`.  
Make sure the entry **above it** ends with a **comma** `,`.

```javascript
const SONGS = [
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'assets/audio/song1.mp3',
    cover:  'assets/covers/cover1.jpg',
  },
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'assets/audio/song2.mp3',
    cover:  'assets/covers/cover2.jpg',
  },
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'assets/audio/song3.mp3',
    cover:  'assets/covers/cover3.jpg',
  },
  {                                            ← new entry starts here
    title:  'My New Song',
    artist: 'Artist Name',
    audio:  'assets/audio/my-new-song.mp3',   ← must match filename in Step 1
    cover:  'assets/covers/my-cover.jpg',     ← must match filename in Step 2
  },
];
```

---

## Step 5 — Save and open in browser

Save `player.js`, then open (or refresh) `index.html` in your browser.

Your new song will appear at the bottom of the playlist automatically. ✅

---

## Common mistakes

| Problem | Fix |
|---------|-----|
| Song doesn't appear | Check that you saved `player.js` |
| "Cannot play" / silence | Check the `audio:` path exactly matches the filename in `assets/audio/` |
| Broken image | Check the `cover:` path exactly matches the filename in `assets/covers/` |
| JavaScript error in console | Check that every `{ }` block except the last ends with a comma `,` |

---

## How to replace an existing song

Instead of adding a new block, just edit the fields of an existing one:

```javascript
{
  title:  'Replaced Song',
  artist: 'New Artist',
  audio:  'assets/audio/replacement.mp3',
  cover:  'assets/covers/replacement.jpg',
},
```

And drop `replacement.mp3` / `replacement.jpg` into the right folders.

---

## How to remove a song

Delete the entire `{ … },` block for that song from the `SONGS` array.

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |
| `Ctrl + →` | Next track |
| `Ctrl + ←` | Previous track |
| `M` | Mute toggle |
| `S` | Shuffle toggle |

---

## Project folder structure (for reference)

```
song-player/
├── index.html          ← open this in your browser
├── style.css           ← all visual styles
├── player.js           ← all player logic + SONGS list
├── GUIDE.md            ← this file
├── README.md
└── assets/
    ├── audio/
    │   ├── song1.mp3
    │   ├── song2.mp3
    │   └── song3.mp3
    └── covers/
        ├── cover1.jpg
        ├── cover2.jpg
        └── cover3.jpg
```
