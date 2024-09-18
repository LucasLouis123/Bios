const bgMusic = document.getElementById('background-music');
const volumeSlider = document.getElementById('volumeSlider');
const playButton = document.getElementById('playButton');
const progressBar = document.getElementById('progress');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const darkModeToggle = document.getElementById('darkModeToggle');

// Update volume based on slider
bgMusic.volume = volumeSlider.value;

// Play music and toggle button text
function playMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        playButton.textContent = 'Pause Music';
    } else {
        bgMusic.pause();
        playButton.textContent = 'Play Music';
    }
}

// Update progress bar as song plays
function updateProgress() {
    const currentTime = bgMusic.currentTime;
    const duration = bgMusic.duration;
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.style.width = progressPercentage + '%';

    // Update time display
    currentTimeElement.textContent = formatTime(currentTime);
    totalTimeElement.textContent = formatTime(duration);
}

// Format time in minutes:seconds
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Toggle dark/light mode
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
});

// Event listeners
bgMusic.addEventListener('timeupdate', updateProgress);
playButton.addEventListener('click', playMusic);
volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value;
});
