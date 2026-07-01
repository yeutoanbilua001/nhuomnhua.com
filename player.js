/* =====================================================
   Music Player — player.js

   ╔══════════════════════════════════════════════════╗
   ║  HOW TO ADD A SONG (3 steps, no coding needed)  ║
   ╠══════════════════════════════════════════════════╣
   ║  1. Copy your .mp3 into this folder              ║
   ║  2. Copy your cover image into this folder       ║
   ║  3. Add one block to SONGS below — done!         ║
   ╚══════════════════════════════════════════════════╝

   Open this player with: double-click START.bat (Windows)
                       or double-click START.command (Mac)
   This starts a tiny local server so cover images load.
   ===================================================== */

'use strict';

/* =====================================================
   ★  EDIT THIS LIST TO ADD / REMOVE SONGS  ★
   ─────────────────────────────────────────
   Each song needs 4 things:
     title  → song name shown on screen
     artist → artist name shown on screen
     audio  → your .mp3 filename
     cover  → your cover image filename (jpg or png)
              use '' if you have no cover image

   To add a song:
     ① Copy your .mp3 into this folder
     ② Copy your cover image into this folder
     ③ Add a new block below (copy-paste an existing one)
     ④ Fill in the 4 fields
     ⑤ Save this file and refresh the browser

   ===================================================== */

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
  //
  // {
  //   title:  'My New Song',
  //   artist: 'Artist Name',
  //   audio:  'my-song.mp3',
  //   cover:  'my-cover.jpg',
  // },

];

/* =====================================================
   PLAYER ENGINE
   You do not need to edit anything below this line.
   ===================================================== */

const S = {
  idx: 0, playing: false,
  shuffle: false, repeat: 'none',
  volume: 0.75, dragProg: false, dragVol: false,
};

const $ = id => document.getElementById(id);
const audio        = $('audio');
const bg           = $('bg');
const artImg       = $('artImg');
const songTitle    = $('songTitle');
const songArtist   = $('songArtist');
const progressBar  = $('progressBar');
const progressFill = $('progressFill');
const timeCurrent  = $('timeCurrent');
const timeTotal    = $('timeTotal');
const btnPlay      = $('btnPlay');
const btnPrev      = $('btnPrev');
const btnNext      = $('btnNext');
const btnShuffle   = $('btnShuffle');
const btnRepeat    = $('btnRepeat');
const volBar       = $('volBar');
const volFill      = $('volFill');
const playlist     = $('playlist');
const plCount      = $('plCount');
const iconPlay     = btnPlay.querySelector('.icon-play');
const iconPause    = btnPlay.querySelector('.icon-pause');

// ── Load a track ──────────────────────────────────────
function loadTrack(idx) {
  S.idx = idx;
  const s = SONGS[idx];

  audio.src = s.audio;
  audio.load();

  songTitle.textContent  = s.title;
  songArtist.textContent = s.artist;
  document.title = s.title + ' — Music Player';

  // Cover image — simple filename, works with local server
  artImg.classList.add('fading');
  setTimeout(() => {
    artImg.src = s.cover || '';
    bg.style.backgroundImage = s.cover ? `url("${s.cover}")` : 'none';
    artImg.classList.remove('fading');
  }, 300);

  progressFill.style.width = '0%';
  timeCurrent.textContent  = '0:00';
  timeTotal.textContent    = '0:00';

  document.querySelectorAll('.pl-row').forEach((r, i) => {
    r.classList.toggle('active', i === idx);
    r.classList.remove('playing');
  });
  playlist.querySelector('.pl-row.active')
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ── Play ──────────────────────────────────────────────
function play() {
  audio.play().then(() => {
    S.playing = true;
    iconPlay.hidden  = true;
    iconPause.hidden = false;
    document.body.classList.add('playing');
    playlist.querySelector('.pl-row.active')?.classList.add('playing');
  }).catch(e => console.warn(e));
}

// ── Pause ─────────────────────────────────────────────
function pause() {
  audio.pause();
  S.playing = false;
  iconPlay.hidden  = false;
  iconPause.hidden = true;
  document.body.classList.remove('playing');
  document.querySelectorAll('.pl-row').forEach(r => r.classList.remove('playing'));
}

function togglePlay() { S.playing ? pause() : play(); }

// ── Next / Prev ───────────────────────────────────────
function randOther() {
  if (SONGS.length === 1) return 0;
  let r; do { r = Math.floor(Math.random() * SONGS.length); } while (r === S.idx);
  return r;
}

function playNext() {
  loadTrack(S.shuffle ? randOther() : (S.idx + 1) % SONGS.length);
  play();
}

function playPrev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  loadTrack(S.shuffle ? randOther() : (S.idx - 1 + SONGS.length) % SONGS.length);
  play();
}

audio.addEventListener('ended', () => {
  if (S.repeat === 'one') { audio.currentTime = 0; play(); }
  else if (S.repeat === 'all' || S.shuffle || S.idx < SONGS.length - 1) playNext();
  else pause();
});

// ── Progress bar ──────────────────────────────────────
audio.addEventListener('timeupdate', () => {
  if (S.dragProg || !audio.duration) return;
  progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  timeCurrent.textContent  = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(audio.duration);
  const durs = playlist.querySelectorAll('.pl-dur');
  if (durs[S.idx]) durs[S.idx].textContent = fmt(audio.duration);
});

function seekAt(e) {
  const r = progressBar.getBoundingClientRect();
  const x = (e.touches?.[0]?.clientX ?? e.clientX) - r.left;
  const p = Math.max(0, Math.min(1, x / r.width));
  audio.currentTime        = p * (audio.duration || 0);
  progressFill.style.width = `${p * 100}%`;
  timeCurrent.textContent  = fmt(audio.currentTime);
}

progressBar.addEventListener('mousedown',  e => { S.dragProg = true; seekAt(e); });
progressBar.addEventListener('touchstart', e => { S.dragProg = true; seekAt(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (S.dragProg) seekAt(e); });
document.addEventListener('touchmove',  e => { if (S.dragProg) seekAt(e); }, { passive: true });
document.addEventListener('mouseup',   () => { S.dragProg = false; });
document.addEventListener('touchend',  () => { S.dragProg = false; });

// ── Volume ────────────────────────────────────────────
function setVol(v) {
  v = Math.max(0, Math.min(1, v));
  S.volume = audio.volume = v;
  volFill.style.width = `${v * 100}%`;
}

function volAt(e) {
  const r = volBar.getBoundingClientRect();
  setVol(((e.touches?.[0]?.clientX ?? e.clientX) - r.left) / r.width);
}

volBar.addEventListener('mousedown',  e => { S.dragVol = true; volAt(e); });
volBar.addEventListener('touchstart', e => { S.dragVol = true; volAt(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (S.dragVol) volAt(e); });
document.addEventListener('touchmove',  e => { if (S.dragVol) volAt(e); }, { passive: true });
document.addEventListener('mouseup',   () => { S.dragVol = false; });
document.addEventListener('touchend',  () => { S.dragVol = false; });
setVol(0.75);

// ── Shuffle & Repeat ──────────────────────────────────
btnShuffle.addEventListener('click', () => {
  S.shuffle = !S.shuffle;
  btnShuffle.classList.toggle('active', S.shuffle);
});

btnRepeat.addEventListener('click', () => {
  S.repeat = { none:'one', one:'all', all:'none' }[S.repeat];
  btnRepeat.classList.toggle('active', S.repeat !== 'none');
  let b = btnRepeat.querySelector('.rpt-b');
  if (S.repeat === 'one') {
    if (!b) {
      b = Object.assign(document.createElement('span'), { className:'rpt-b', textContent:'1' });
      Object.assign(b.style, { position:'absolute', top:'1px', right:'1px', fontSize:'8px', fontWeight:'700', color:'var(--gold)', lineHeight:'1' });
      btnRepeat.style.position = 'relative';
      btnRepeat.appendChild(b);
    }
  } else { b?.remove(); }
});

// ── Button listeners ──────────────────────────────────
btnPlay.addEventListener('click', togglePlay);
btnPrev.addEventListener('click', playPrev);
btnNext.addEventListener('click', playNext);

// ── Keyboard shortcuts ────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code==='Space')     { e.preventDefault(); togglePlay(); }
  if (e.code==='ArrowRight' && (e.ctrlKey||e.metaKey)) { e.preventDefault(); playNext(); }
  if (e.code==='ArrowLeft'  && (e.ctrlKey||e.metaKey)) { e.preventDefault(); playPrev(); }
  if (e.code==='ArrowUp')   { e.preventDefault(); setVol(S.volume + 0.05); }
  if (e.code==='ArrowDown') { e.preventDefault(); setVol(S.volume - 0.05); }
  if (e.code==='KeyM')      audio.muted = !audio.muted;
  if (e.code==='KeyS')      btnShuffle.click();
});

// ── Media Session (OS lock screen controls) ───────────
function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const s = SONGS[S.idx];
  navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist });
  navigator.mediaSession.setActionHandler('play',          play);
  navigator.mediaSession.setActionHandler('pause',         pause);
  navigator.mediaSession.setActionHandler('nexttrack',     playNext);
  navigator.mediaSession.setActionHandler('previoustrack', playPrev);
}
audio.addEventListener('play',  updateMediaSession);
audio.addEventListener('pause', updateMediaSession);

// ── Build playlist ────────────────────────────────────
function buildPlaylist() {
  playlist.innerHTML = '';
  plCount.textContent = `${SONGS.length} song${SONGS.length !== 1 ? 's' : ''}`;

  SONGS.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = `pl-row${i === 0 ? ' active' : ''}`;
    li.innerHTML = `
      <span class="pl-num">${String(i+1).padStart(2,'0')}</span>
      <img  class="pl-thumb" src="${s.cover||''}" alt="" loading="lazy" />
      <div  class="pl-meta">
        <div class="pl-name">${esc(s.title)}</div>
        <div class="pl-artist">${esc(s.artist)}</div>
      </div>
      <span class="pl-dur">—</span>
      <span class="pl-dot"></span>
    `;
    li.addEventListener('click', () => {
      if (i === S.idx) { togglePlay(); return; }
      loadTrack(i); play();
    });
    playlist.appendChild(li);
  });
}

// ── Helpers ───────────────────────────────────────────
function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
}
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
                  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──────────────────────────────────────────────
buildPlaylist();
loadTrack(0);
