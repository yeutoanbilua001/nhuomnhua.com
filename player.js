/* ============================================================
   SÓNG Music Player — player.js

   Cover images are loaded from covers.js (base64 embedded),
   so this works when opened directly as a file:// URL —
   no local server needed.

   HOW TO ADD A SONG
   ──────────────────
   Step 1. Put your .mp3 file in the same folder as index.html
   Step 2. Add your cover image as base64 in covers.js
           OR just set cover to '' for no image
   Step 3. Add one object to the SONGS array below
   ============================================================ */

'use strict';

/* ============================================================
   ★  SONGS — edit this list to add / remove tracks  ★

   Fields:
     title   – song name shown on screen
     artist  – artist name shown on screen
     audio   – filename of the .mp3 (must be in same folder)
     cover   – use COVERS.cover1 / cover2 / cover3
               or '' for no cover image
   ============================================================ */
const SONGS = [
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'song1.mp3',
    cover:  COVERS.cover1,
  },
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'song2.mp3',
    cover:  COVERS.cover2,
  },
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'song3.mp3',
    cover:  COVERS.cover3,
  },
  /* ── ADD MORE SONGS BELOW ────────────────────────────────
  {
    title:  'Your Song Title',
    artist: 'Artist Name',
    audio:  'your-file.mp3',
    cover:  '',
  },
  ────────────────────────────────────────────────────────── */
];

/* ============================================================
   PLAYER — no need to edit below this line
   ============================================================ */

const state = {
  index:            0,
  isPlaying:        false,
  isShuffle:        false,
  repeatMode:       'none',  // 'none' | 'one' | 'all'
  volume:           0.75,
  draggingProgress: false,
  draggingVolume:   false,
};

/* ── DOM ──────────────────────────────────────────────────── */
const $          = id => document.getElementById(id);
const audio      = $('audioEl');
const coverImg   = $('coverImg');
const bgArt      = $('bgArt');
const trackTitle = $('trackTitle');
const trackArtist= $('trackArtist');
const progressBar= $('progressBar');
const progressFill=$('progressFill');
const timeCurrent= $('timeCurrent');
const timeTotal  = $('timeTotal');
const playBtn    = $('playBtn');
const prevBtn    = $('prevBtn');
const nextBtn    = $('nextBtn');
const shuffleBtn = $('shuffleBtn');
const repeatBtn  = $('repeatBtn');
const volumeBar  = $('volumeBar');
const volumeFill = $('volumeFill');
const playlistEl = $('playlist');
const plCount    = $('playlistCount');
const iconPlay   = playBtn.querySelector('.icon-play');
const iconPause  = playBtn.querySelector('.icon-pause');

/* ── Load track ───────────────────────────────────────────── */
function loadTrack(index) {
  state.index = index;
  const song = SONGS[index];

  audio.src = song.audio;
  audio.load();

  trackTitle.textContent  = song.title;
  trackArtist.textContent = song.artist;
  document.title = `${song.title} — SÓNG`;

  /* Cover image — crossfade */
  coverImg.classList.add('fade');
  setTimeout(() => {
    if (song.cover) {
      coverImg.src = song.cover;               // base64 data URI — always works
      bgArt.style.backgroundImage = `url("${song.cover}")`;
      coverImg.style.display = '';
    } else {
      coverImg.src = '';
      bgArt.style.backgroundImage = 'none';
      coverImg.style.display = 'none';
    }
    coverImg.classList.remove('fade');
  }, 280);

  /* Reset progress */
  progressFill.style.width = '0%';
  timeCurrent.textContent  = '0:00';
  timeTotal.textContent    = '0:00';

  /* Highlight playlist row */
  document.querySelectorAll('.pl-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.remove('playing');
  });

  const active = playlistEl.querySelector('.pl-item.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Play / Pause ─────────────────────────────────────────── */
function play() {
  audio.play().then(() => {
    state.isPlaying = true;
    iconPlay.style.display  = 'none';
    iconPause.style.display = '';
    document.body.classList.add('playing');
    const active = playlistEl.querySelector('.pl-item.active');
    if (active) active.classList.add('playing');
  }).catch(err => console.warn('Playback blocked:', err));
}

function pause() {
  audio.pause();
  state.isPlaying = false;
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
  document.body.classList.remove('playing');
  document.querySelectorAll('.pl-item').forEach(el => el.classList.remove('playing'));
}

function togglePlay() {
  if (!SONGS.length) return;
  state.isPlaying ? pause() : play();
}

/* ── Next / Prev ──────────────────────────────────────────── */
function randomExcluding(exclude) {
  if (SONGS.length === 1) return 0;
  let r;
  do { r = Math.floor(Math.random() * SONGS.length); } while (r === exclude);
  return r;
}

function next() {
  const i = state.isShuffle
    ? randomExcluding(state.index)
    : (state.index + 1) % SONGS.length;
  loadTrack(i);
  play();
}

function prev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const i = state.isShuffle
    ? randomExcluding(state.index)
    : (state.index - 1 + SONGS.length) % SONGS.length;
  loadTrack(i);
  play();
}

/* ── Song ended ───────────────────────────────────────────── */
audio.addEventListener('ended', () => {
  if (state.repeatMode === 'one') { audio.currentTime = 0; play(); return; }
  if (state.repeatMode === 'all' || state.isShuffle || state.index < SONGS.length - 1) {
    next(); return;
  }
  pause();
});

/* ── Progress bar ─────────────────────────────────────────── */
audio.addEventListener('timeupdate', () => {
  if (state.draggingProgress || !audio.duration) return;
  progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  timeCurrent.textContent  = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(audio.duration);
  const rows = playlistEl.querySelectorAll('.pl-duration');
  if (rows[state.index]) rows[state.index].textContent = fmt(audio.duration);
});

function seekAt(e) {
  const rect = progressBar.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const pct  = Math.max(0, Math.min(1, x / rect.width));
  audio.currentTime        = pct * (audio.duration || 0);
  progressFill.style.width = `${pct * 100}%`;
  timeCurrent.textContent  = fmt(audio.currentTime);
}

progressBar.addEventListener('mousedown',  e => { state.draggingProgress = true; seekAt(e); });
progressBar.addEventListener('touchstart', e => { state.draggingProgress = true; seekAt(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (state.draggingProgress) seekAt(e); });
document.addEventListener('touchmove',  e => { if (state.draggingProgress) seekAt(e); }, { passive: true });
document.addEventListener('mouseup',   () => { state.draggingProgress = false; });
document.addEventListener('touchend',  () => { state.draggingProgress = false; });

/* ── Volume ───────────────────────────────────────────────── */
function setVolume(v) {
  v = Math.max(0, Math.min(1, v));
  state.volume = v;
  audio.volume = v;
  volumeFill.style.width = `${v * 100}%`;
}

function volAt(e) {
  const rect = volumeBar.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  setVolume(x / rect.width);
}

volumeBar.addEventListener('mousedown',  e => { state.draggingVolume = true; volAt(e); });
volumeBar.addEventListener('touchstart', e => { state.draggingVolume = true; volAt(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (state.draggingVolume) volAt(e); });
document.addEventListener('touchmove',  e => { if (state.draggingVolume) volAt(e); }, { passive: true });
document.addEventListener('mouseup',   () => { state.draggingVolume = false; });
document.addEventListener('touchend',  () => { state.draggingVolume = false; });
setVolume(0.75);

/* ── Shuffle ──────────────────────────────────────────────── */
shuffleBtn.addEventListener('click', () => {
  state.isShuffle = !state.isShuffle;
  shuffleBtn.classList.toggle('active', state.isShuffle);
});

/* ── Repeat ───────────────────────────────────────────────── */
repeatBtn.addEventListener('click', () => {
  const cycle = { none: 'one', one: 'all', all: 'none' };
  state.repeatMode = cycle[state.repeatMode];
  repeatBtn.classList.toggle('active', state.repeatMode !== 'none');

  let badge = repeatBtn.querySelector('.rpt-badge');
  if (state.repeatMode === 'one') {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'rpt-badge';
      Object.assign(badge.style, {
        position: 'absolute', top: '0', right: '0',
        fontSize: '8px', fontWeight: '700',
        color: 'var(--gold)', lineHeight: '1',
      });
      repeatBtn.style.position = 'relative';
      repeatBtn.appendChild(badge);
    }
    badge.textContent = '1';
  } else if (badge) {
    badge.remove();
  }
});

/* ── Keyboard shortcuts ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'Space')     { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowUp')   { e.preventDefault(); setVolume(state.volume + 0.05); }
  if (e.code === 'ArrowDown') { e.preventDefault(); setVolume(state.volume - 0.05); }
  if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); next(); }
  if (e.code === 'ArrowLeft'  && (e.ctrlKey || e.metaKey)) { e.preventDefault(); prev(); }
  if (e.code === 'KeyM') audio.muted = !audio.muted;
  if (e.code === 'KeyS') shuffleBtn.click();
});

/* ── Media Session API ────────────────────────────────────── */
function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const s = SONGS[state.index];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: s.title, artist: s.artist,
  });
  navigator.mediaSession.setActionHandler('play',          play);
  navigator.mediaSession.setActionHandler('pause',         pause);
  navigator.mediaSession.setActionHandler('nexttrack',     next);
  navigator.mediaSession.setActionHandler('previoustrack', prev);
}
audio.addEventListener('play',  updateMediaSession);
audio.addEventListener('pause', updateMediaSession);

/* ── Button listeners ─────────────────────────────────────── */
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

/* ── Build playlist ───────────────────────────────────────── */
function buildPlaylist() {
  playlistEl.innerHTML = '';
  plCount.textContent  = `${SONGS.length} song${SONGS.length !== 1 ? 's' : ''}`;

  SONGS.forEach((song, i) => {
    const li = document.createElement('li');
    li.className   = 'pl-item' + (i === state.index ? ' active' : '');
    li.dataset.index = i;

    const coverSrc = song.cover || '';
    li.innerHTML = `
      <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
      ${coverSrc
        ? `<img class="pl-cover" src="${coverSrc}" alt="" />`
        : `<div class="pl-cover pl-cover-empty"></div>`}
      <div class="pl-info">
        <div class="pl-title">${escHtml(song.title)}</div>
        <div class="pl-artist">${escHtml(song.artist)}</div>
      </div>
      <span class="pl-duration">—</span>
      <span class="pl-dot"></span>
    `;

    li.addEventListener('click', () => {
      if (i === state.index) { togglePlay(); return; }
      loadTrack(i);
      play();
    });

    playlistEl.appendChild(li);
  });
}

/* ── Helpers ──────────────────────────────────────────────── */
function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Init ─────────────────────────────────────────────────── */
buildPlaylist();
loadTrack(0);
