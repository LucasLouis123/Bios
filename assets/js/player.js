const audioPlayer = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const footer = document.getElementById("footer");
const lyricsBtn = document.getElementById("lyrics");
const seekBar = document.getElementById("seek-bar");
const volumeSlider = document.getElementById("volume-slider");
const volumeButton = document.getElementById("volume-button");

const defaultFooterText = "〤 CutNation 〤";

const defaultFooterText = '〤 CutNation 〤';

const tracks = [
    { title: "Destroy Lonely - if looks could kill", path: "assets/music/iflookscouldkill.mp3" },
    { title: "Ken Carson - Succubus", path: "assets/music/Succubus.mp3" },
    { title: "Chii Wvttz - Shoot Pt.2", path: "assets/music/music.mp3" },
    { title: "UglyEnd - Heyfever", path: "assets/music/Heyfever.mp3" },
    { title: "LeoStayTrill - Pink Lemonade", path: "assets/music/PinkLemonade.mp3" },
    { title: "Ken Carson - mewtwo", path: "assets/music/mewtwo.mp3" },
    { title: "Tiakola - MANON B", path: "assets/music/MANONB.mp3" },
    { title: "Don Toliver - Bandit", path: "assets/music/Bandit.mp3" },
    { title: "Yeat - Shade", path: "assets/music/Shade.mp3" },
    { title: "che x SEMATARY - 666", path: "assets/music/666.mp3" },
    { title: "SGGKobe - thrax", path: "assets/music/thrax.mp3" },
    { title: "Ndotz - Embrace It", path: "assets/music/EmbraceIt.mp3" },
    { title: "Ddot x starbandz - Baby", path: "assets/music/baby.mp3" },
    { title: "Nle Choppa x 41 - Or What", path: "assets/music/nle.mp3" },
    { title: "DJ Scheme - Blue Bills", path: "assets/music/BlueBills.mp3" },
    { title: "Ken Carson - Green Room", path: "assets/music/GreenRoom.mp3" },
    { title: "Ken Carson - RICK OWENS", path: "assets/music/RickOwens.mp3" },
    { title: "Never Get Used To People - Life Letters", path: "assets/music/LifeLetters.mp3" },
    { title: "lucidbeatz - Let U Go", path: "assets/music/LetUGo.mp3" },
    { title: "Ken Carson - Lose It", path: "assets/music/LoseIt.mp3" },
    { title: "NXVAMANE - Fresh (Slowed)", path: "assets/music/Fresh.mp3" },
    { title: "King Von - 2AM", path: "assets/music/2AM.mp3" },
    { title: "che - GET NAKED", path: "assets/music/GetNaked.mp3" }
];

let currentTrack = 0;
audioPlayer.volume = 0.1;
let isDragging = false;
let sliderVisible = false;
let isHovering = false;

function showSlider() {
  isHovering = true;
  volumeSlider.style.display = 'block';
  setTimeout(() => {
    if (isHovering) {
      volumeSlider.classList.add('show');
    }
  }, 10);
}

function hideSlider() {
  isHovering = false;
  volumeSlider.classList.remove('show');
  setTimeout(() => {
    if (!isHovering) {
      volumeSlider.style.display = 'none';
    }
  }, 300);
}

function shuffleTracks() {
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }
}

function loadTrack(index, animationClass) {
  currentTrack = index;
  audioPlayer.src = tracks[currentTrack].path;
  footer.textContent = `〤 ${tracks[currentTrack].title} 〤`;

  // Apply animation
  footer.classList.remove("slide-in-right", "slide-in-left");
  void footer.offsetWidth;
  footer.classList.add(animationClass);
}

function loadRandomTrack() {
  shuffleTracks();
  loadTrack(0, "slide-in-right");
}

function showDefaultFooter(animationClass) {
  footer.textContent = defaultFooterText;

  // Apply animation
  footer.classList.remove("slide-in-right", "slide-in-left");
  void footer.offsetWidth;
  footer.classList.add(animationClass);
}

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="icon fa-solid fa-pause"></i>';
    footer.textContent = `ʚ ${tracks[currentTrack].title} ɞ`;
    footer.classList.remove("slide-in-right", "slide-in-left");
    void footer.offsetWidth;
    footer.classList.add("slide-in-right");
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = '<i class="icon fa-solid fa-play"></i>';
    showDefaultFooter("slide-in-right");
  }
});

function playNextTrack() {
  const nextTrack = (currentTrack + 1) % tracks.length;
  loadTrack(nextTrack, "slide-in-right");
  audioPlayer.play();
  playPauseBtn.innerHTML = '<i class="icon fa-solid fa-pause"></i>';
}

nextBtn.addEventListener("click", playNextTrack);

prevBtn.addEventListener("click", () => {
  const prevTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(prevTrack, "slide-in-left");
  audioPlayer.play();
  playPauseBtn.innerHTML = '<i class="icon fa-solid fa-pause"></i>';
});

function updateSeekBar() {
  if (!isDragging) {
    seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  }
}

seekBar.addEventListener("input", () => {
  isDragging = true;
  audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
});

seekBar.addEventListener("change", () => {
  isDragging = false;
});

lyricsBtn.addEventListener("click", () => {
  const currentGeniusId = tracks[currentTrack].geniusId;
  if (currentGeniusId) {
    const popup = window.open("", "LyricsPopup", "width=600,height=400");
    popup.document.write(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="assets/css/variables.css">
          <title>${tracks[currentTrack].title} | Lyrics</title>
          <style>
            body {
              background-color: var(--bg-color); /* Use variable from CSS */
              font-family: monospace;
              padding: 20px;
              color: var(--text-color);
            }
            a {
              color: var(--ahref-color);
              text-decoration: none;
            }
            a:hover {
              color: var(--ahref-hover-color);
            }
            .lyrics-container {
              background-color: var(--bg-color-light);
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              overflow-y: auto;
              max-height: 80%;
              margin-top: 20px;
            }
            button {
              background-color: var(--btn-bg);
              border: var(--btn-border);
              border-radius: 5px;
              padding: 10px;
              color: var(--btn-color);
              cursor: pointer;
              width: 100%;
              margin-top: 10px;
              font-family: monospace;
            }
            button:hover {
              background-color: var(--btn-hover-bg);
            }
          </style>
        </head>
        <body>
          <h2>${tracks[currentTrack].title} Lyrics</h2>
          <div class="lyrics-container">
            <div id='rg_embed_link_${currentGeniusId}' class='rg_embed_link' data-song-id='${currentGeniusId}'>
              Read <a href='https://genius.com/songs/${currentGeniusId}'>Lyrics on Genius</a>
            </div>
          </div>
          <button onclick="window.close()">Close</button>
          <script crossorigin src='//genius.com/songs/${currentGeniusId}/embed.js'></script>
        </body>
      </html>
    `);
  }
});

audioPlayer.addEventListener("timeupdate", updateSeekBar);

audioPlayer.addEventListener("ended", playNextTrack);

volumeSlider.addEventListener("input", function () {
  volumeValue = this.value / 100;
  document.documentElement.style.setProperty("--volume", volumeValue);
});

volumeButton.addEventListener('mouseenter', showSlider);
volumeButton.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!volumeSlider.matches(':hover')) {
      hideSlider();
    }
  }, 100);
});

volumeSlider.addEventListener('mouseenter', () => {
  isHovering = true;
});

volumeSlider.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!volumeButton.matches(':hover')) {
      hideSlider();
    }
  }, 100);
});

volumeSlider.addEventListener("input", (e) => {
  audioPlayer.volume = e.target.value;
});

volumeSlider.value = audioPlayer.volume;

window.addEventListener("load", () => showDefaultFooter("slide-in-right"));

loadRandomTrack();
