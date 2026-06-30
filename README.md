# 🎵 Music Player

A simple music player built with vanilla HTML, CSS, and JavaScript. Based on [Kenny Yip's Music Player tutorial](https://youtu.be/APjb5Er03UE), extended with working shuffle, repeat, autoplay-next, and a play/pause icon swap.

## Features

- Play / pause with icon swap (▶ ↔ ⏸)
- Next / previous track navigation
- **Shuffle** — plays a random track instead of the next one in order
- **Repeat** — replays the current track when it ends instead of advancing
- **Autoplay next** — automatically moves to the next song when one finishes
- Seekable progress slider synced to playback
- 3 bundled tracks with album art

## Tracks

| Song | Artist |
|------|--------|
| Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version) | Chu Thúy Quỳnh, HITStory |
| Mong Người Ta Luôn Tốt Luôn Yêu Em | Lưu Chí Vỹ |
| Nếu Em Không Về | Beta Music, Thành Đạt & PhongG |

> **Note:** The placeholder album art (Christmas tree, bells, reindeer) is decorative and unrelated to these tracks — swap in your own cover images in `album-art1.jpg` / `2.jpg` / `3.jpg` if you'd like art that matches the songs.

## Run it

\`\`\`bash
git clone https://github.com/your-username/music-player.git
cd music-player
open index.html
\`\`\`

No build step or server required — just open \`index.html\` in a browser.

## Project Structure

\`\`\`
music-player/
├── index.html
├── music-player.css
├── music-player.js
├── album-art1.jpg
├── album-art2.jpg
├── album-art3.jpg
├── song1.mp3
├── song2.mp3
├── song3.mp3
└── README.md
\`\`\`

## ⚠️ A note on the bundled audio

The 3 MP3 files in this repo were supplied directly by the project owner and are **not verified as royalty-free or licensed for redistribution**. Their ID3 metadata indicates they are commercially released tracks (sourced from NhacCuaTui.com). **Before pushing this repo to a public GitHub page, confirm you have the rights to distribute these files**, or replace them with your own licensed/royalty-free audio and update the track list in \`music-player.js\`.

## Credits

Icons by [Font Awesome](https://fontawesome.com/icons). Original tutorial and base structure by [Kenny Yip](https://youtu.be/APjb5Er03UE).

## License

The **player code** (HTML/CSS/JS) is MIT — free to use, modify, and distribute. The bundled audio files are **not** covered by this license; see the note above.
