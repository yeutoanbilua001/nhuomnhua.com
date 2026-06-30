const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");

const songSlider = document.getElementById("slider-song");

const playpauseButton = document.getElementById("playpause-song");
const prevSongButton = document.getElementById("prev-song");
const nextSongButton = document.getElementById("next-song");
const shuffleButton = document.getElementById("shuffle-song");
const repeatButton = document.getElementById("repeat-song");

const songs = [
    {
        image: "./album-art1.jpg",
        name: "Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)",
        artist: "Chu Thúy Quỳnh, HITStory",
        audio: "./song1.mp3"
    },
    {
        image: "./album-art2.jpg",
        name: "Mong Người Ta Luôn Tốt Luôn Yêu Em",
        artist: "Lưu Chí Vỹ",
        audio: "./song2.mp3"
    },
    {
        image: "./album-art3.jpg",
        name: "Nếu Em Không Về",
        artist: "Beta Music, Thành Đạt & PhongG",
        audio: "./song3.mp3",
    },
];

const audio = document.createElement("audio");
let currentSongIndex = 0;
let isShuffleOn = false;
let isRepeatOn = false;

updateSong();

prevSongButton.addEventListener("click", function() {
    if (isShuffleOn) {
        currentSongIndex = getRandomSongIndex();
        updateSong();
        playSong();
        return;
    }
    if (currentSongIndex == 0) {
        return;
    }
    currentSongIndex--;
    updateSong();
    playSong();
});

nextSongButton.addEventListener("click", function() {
    if (isShuffleOn) {
        currentSongIndex = getRandomSongIndex();
        updateSong();
        playSong();
        return;
    }
    if (currentSongIndex == songs.length - 1) {
        return;
    }
    currentSongIndex++;
    updateSong();
    playSong();
});

playpauseButton.addEventListener("click", function() {
    if (!audio.paused) {
        pauseSong();
    }
    else {
        playSong();
    }
});

shuffleButton.addEventListener("click", function() {
    isShuffleOn = !isShuffleOn;
    shuffleButton.classList.toggle("active", isShuffleOn);
});

repeatButton.addEventListener("click", function() {
    isRepeatOn = !isRepeatOn;
    repeatButton.classList.toggle("active", isRepeatOn);
});

function getRandomSongIndex() {
    if (songs.length === 1) return 0;
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex);
    return randomIndex;
}

function playSong() {
    audio.play();
    playpauseButton.classList.remove("fa-circle-play");
    playpauseButton.classList.add("fa-circle-pause");
}

function pauseSong() {
    audio.pause();
    playpauseButton.classList.remove("fa-circle-pause");
    playpauseButton.classList.add("fa-circle-play");
}

function updateSong() {
    const song = songs[currentSongIndex];
    songImage.src = song.image;
    songName.innerText = song.name;
    songArtist.innerText = song.artist;

    audio.src = song.audio;
    audio.onloadedmetadata = function() {
        songSlider.value = 0;
        songSlider.max = audio.duration;
    };
}

audio.addEventListener("ended", function() {
    if (isRepeatOn) {
        audio.currentTime = 0;
        playSong();
        return;
    }

    if (isShuffleOn) {
        currentSongIndex = getRandomSongIndex();
        updateSong();
        playSong();
        return;
    }

    if (currentSongIndex == songs.length - 1) {
        pauseSong();
        return;
    }

    currentSongIndex++;
    updateSong();
    playSong();
});

songSlider.addEventListener("change", function() {
    audio.currentTime = songSlider.value;
})

function moveSlider() {
    songSlider.value = audio.currentTime;
};

setInterval(moveSlider, 1000);
