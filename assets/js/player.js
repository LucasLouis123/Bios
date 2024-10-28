const mainContent = document.querySelector("main");
const overlay = document.getElementById('overlay');
const audioPlayer = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const footer = document.getElementById("footer");
const platformsBtn = document.getElementById("platform-button");
const linksPopup = document.getElementById("pf-links");
const seekBar = document.getElementById("seek-bar");
const volumeSlider = document.getElementById("volume-slider");
const volumeButton = document.getElementById("volume-button");
const lyricsPopup = document.getElementById("lyrics-popup");
const lyricsDisplay = document.getElementById("lyricsDisplay");
const lyricsCloseBtn = document.getElementById("lyrics-close");
const lyricsButton = document.getElementById("lyrics-button");

const API_URL = "https://api.wxrn.lol/api/lyrics";

const defaultFooterText = "〤 CutNation 〤";

const tracks = [
  { title: "Ndotz - Embrace It", path: "assets/music/EmbraceIt.mp3" },
  { title: "King Von - 2AM", path: "assets/music/2AM.mp3" },
  { title: "Ken Carson - mewtwo", path: "assets/music/mewtwo.mp3" },
  { title: "LeoStayTrill - Pink Lemonade", path: "assets/music/PinkLemonade.mp3" },
  { title: "Nle Choppa x 41 - Or What", path: "assets/music/nle.mp3" },
  { title: "Tiakola - MANON B", path: "assets/music/MANONB.mp3" }, 
  { title: "Chii Wvttz - Shoot Pt.2", path: "assets/music/music.mp3" },
  { title: "Ken Carson - Lose It", path: "assets/music/LoseIt.mp3" },
  { title: "Don Toliver - Bandit", path: "assets/music/Bandit.mp3" },
  { title: "Ken Carson - Succubus", path: "assets/music/Succubus.mp3" },
  { title: "uglyandz - HayFever", path: "assets/music/HeyFever.mp3" },
  { title: "Blue Bills", path: "assets/music/BlueBills.mp3" },
  { title: "Ken Carson - Green Room", path: "assets/music/GreenRoom.mp3" },
  { title: "che - GET NAKED", path: "assets/music/GetNaked.mp3" },
  { title: "Destroy Lonely - if looks could kill", path: "assets/music/iflookscouldkill.mp3" },
  { title: "Yeat - Shade", path: "assets/music/Shade.mp3" },
  { title: "Sugarhill Ddot x STAR BANDZ - My Baby", path: "assets/music/baby.mp3" }
];

audioPlayer.volume = 0.1;
let currentTrack = 0;
let isDragging = false;
let lastTrackPlayed = null;
let lastRenderedIndex = -1;
let cachedLyrics = null;
let abortController;

function showSlider() {
  volumeSlider.style.display = "block";
  setTimeout(() => volumeSlider.classList.add("show"), 10);
}

function hideSlider() {
  volumeSlider.classList.remove("show");
  setTimeout(() => (volumeSlider.style.display = "none"), 300);
}

function playNextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  playPauseBtn.innerHTML = '<i class="icon fa-solid fa-pause"></i>';
  loadTrack(currentTrack, "slide-in-right");
  audioPlayer.play();
}

function playPrevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playPauseBtn.innerHTML = '<i class="icon fa-solid fa-pause"></i>';
  loadTrack(currentTrack, "slide-in-left");
  audioPlayer.play();
}

function updateSeekBar() {
  if (!isDragging) {
    const seekPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekBar.value = seekPercentage || 0;
  }
}

function shuffleTracks() {
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }
}

function loadRandomTrack() {
  shuffleTracks();
  loadTrack(0, "slide-in-right");
}

seekBar.addEventListener("input", (e) => {
  isDragging = true;
  const seekTo = (e.target.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTo;
  isDragging = false;
});

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

function loadTrack(index, animationClass) {
  currentTrack = index;
  audioPlayer.src = tracks[currentTrack].path;
  footer.textContent = `〤 ${tracks[currentTrack].title} 〤`;
  footer.classList.remove("slide-in-right", "slide-in-left");
  void footer.offsetWidth;
  footer.classList.add(animationClass);
  displayLyrics(currentTrack);
}

async function fetchLyrics(track, options = {}) {
  const response = await fetch(`${API_URL}?query=${encodeURIComponent(track)}`, options);
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  return data;
}

async function displayLyrics() {
  // Extract song title without artist name
  const fullTitle = tracks[currentTrack].title;
  const songTitle = fullTitle.includes(" - ") ? fullTitle.split(" - ")[1] : fullTitle;

  lyricsDisplay.innerHTML = "<div class='loading'></div>";
  lyricsDisplay.style.color = "white";
  isLoading = true;

  try {
    // Fetch lyrics using only the song title
    const lyricsArray = await fetchLyrics(songTitle);

    if (!lyricsArray || lyricsArray.error) {
      lyricsDisplay.innerHTML = "No lyrics available.";
      isLoading = false;
      return;
    }

    // Update the lyrics display
    updateLyricsDisplay(lyricsArray, fullTitle);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    lyricsDisplay.innerHTML = "<div class='error-display'>Error fetching lyrics.</div>";
  } finally {
    isLoading = false;
  }
}

// Helper function to update lyrics display
function updateLyricsDisplay(lyricsArray, fullTitle) {
  const lyricsWrapper = document.createElement("div");
  lyricsWrapper.className = "lyrics-wrapper";
  lyricsDisplay.appendChild(lyricsWrapper);

  // Display song title
  lyricsWrapper.innerHTML = `<div class="lyric-line title">${fullTitle}</div>`;

  const updateDisplayedLyrics = () => {
    const currentTime = audioPlayer.currentTime;
    let currentIndex = 0;

    for (let i = 0; i < lyricsArray.length; i++) {
      if (currentTime >= lyricsArray[i].seconds) {
        currentIndex = i;
      } else {
        break;
      }
    }

    // Update lyrics display if the line changed
    if (currentIndex !== lastRenderedIndex) {
      lastRenderedIndex = currentIndex;
      lyricsWrapper.innerHTML = "";
      lyricsWrapper.innerHTML = `<div class="lyric-line">${lyricsArray[currentIndex].lyrics}</div>`;
      lyricsWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  audioPlayer.removeEventListener("timeupdate", updateDisplayedLyrics);
  audioPlayer.addEventListener("timeupdate", updateDisplayedLyrics);
}

  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn("Fetch aborted for lyrics.");
    } else {
      lyricsDisplay.innerHTML = "<div class='loading'>Error fetching lyrics.</div>";
      console.error("Error fetching lyrics:", error);
      setTimeout(() => {
        lyricsDisplay.innerHTML = "<div class='error-display'>Error fetching lyrics.</div>";
      }, 1000);
    }
  } finally {
    isLoading = false;
  }
}

lyricsCloseBtn.addEventListener("click", () => {
  lyricsPopup.classList.remove("show");
  mainContent.classList.remove('no-click');
  overlay.style.display = 'block';
  overlay.classList.remove('show');
  setTimeout(() => {
    lyricsPopup.style.display = "none"
    overlay.style.display = 'none';
  }, 250);
});

lyricsButton.addEventListener("click", () => {
  lyricsPopup.style.display = "block";
  overlay.style.display = 'block';
  mainContent.classList.add('no-click');
  lyricsPopup.classList.add("show");
  overlay.classList.add('show');
});

footer.addEventListener("click", () => {
  lyricsPopup.style.display = "block";
  overlay.style.display = 'block';
  mainContent.classList.add('no-click');
  lyricsPopup.classList.add("show");
  overlay.classList.add('show');
});

function showDefaultFooter(animationClass) {
  footer.textContent = defaultFooterText;
  footer.classList.remove("slide-in-right", "slide-in-left");
  void footer.offsetWidth;
  footer.classList.add(animationClass);
}

window.onload = function () {
  loadRandomTrack();
  displayLyrics(currentTrack);

  nextBtn.addEventListener("click", playNextTrack);
  prevBtn.addEventListener("click", playPrevTrack);

  audioPlayer.addEventListener("ended", () => {
    playNextTrack();
  });

  audioPlayer.addEventListener("timeupdate", updateSeekBar);

  volumeSlider.addEventListener("input", function () {
    volumeValue = this.value / 100;
    document.documentElement.style.setProperty("--volume", volumeValue);
  });
  
  volumeButton.addEventListener("mouseenter", showSlider);
  volumeButton.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!volumeSlider.matches(":hover")) {
        hideSlider();
      }
    }, 100);
  });
  
  volumeSlider.addEventListener("mouseenter", () => {
    isHovering = true;
  });
  
  volumeSlider.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!volumeButton.matches(":hover")) {
        hideSlider();
      }
    }, 100);
  });
  
  volumeSlider.addEventListener("input", (e) => {
    audioPlayer.volume = e.target.value;
  });
  
  volumeSlider.value = audioPlayer.volume;

  showDefaultFooter('slide-in-right');
};
