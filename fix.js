const bgMusic = document.getElementById('background-music');
const volumeSlider = document.getElementById('volumeSlider');
const playButton = document.getElementById('playButton');
const progressBar = document.getElementById('progress');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');

bgMusic.volume = volumeSlider.value;

// Play music and update progress bar
function playMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        playButton.textContent = 'Pause Music';
    } else {
        bgMusic.pause();
        playButton.textContent = 'Play Music';
    }
}

function updateProgress() {
    const currentTime = bgMusic.currentTime;
    const duration = bgMusic.duration;
    
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.style.width = progressPercentage + '%';

    // Update the time display
    currentTimeElement.textContent = formatTime(currentTime);
    totalTimeElement.textContent = formatTime(duration);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

bgMusic.addEventListener('timeupdate', updateProgress);
playButton.addEventListener('click', playMusic);
volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value;
});

// Dark/Light mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
});
