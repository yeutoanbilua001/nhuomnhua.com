const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const musicImg = document.getElementById('music-img');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const volumeIcon = document.getElementById('volume-icon');

// Song List
const songs = [
    {
        name: 'Electric Chill',
        artist: 'Audio Library',
        path: 'music/song1.mp3', // Replace with your audio file path
        cover: 'https://unsplash.com'
    },
    {
        name: 'Summer Vibes',
        artist: 'Unknown',
        path: 'music/song2.mp3', // Replace with your audio file path
        cover: 'https://unsplash.com'
    }
];

let songIndex = 0;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update DOM song details
function loadSong(song) {
    title.innerText = song.name;
    artist.innerText = song.artist;
    audio.src = song.path;
    musicImg.src = song.cover;
}

// Play Song
function playSong() {
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    audio.play();
}

// Pause Song
function pauseSong() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    audio.pause();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Update progress bar and time
function updateProgressBar(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Calculate display for duration
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }
        durationEl.innerText = `${durationMinutes}:${durationSeconds}`;

        // Calculate display for current time
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;
    }
}

// Set progress bar on click
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume() {
    audio.volume = volumeSlider.value;
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = playBtn.classList.contains('fa-pause');
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time update on song
audio.addEventListener('timeupdate', updateProgressBar);

// Click on progress bar to change track time
progressContainer.addEventListener('click', setProgressBar);

// End of song -> play next
audio.addEventListener('ended', nextSong);

// Volume change
volumeSlider.addEventListener('input', setVolume);
