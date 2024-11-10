const mainContent = document.querySelector("main");
const overlay = document.getElementById("overlay");
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
const defaultFooterText = "〤 X1nf PlayList  〤";

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
  { title: "uglyandz - HayFever", path: "assets/music/Heyfever.mp3" },
  { title: "Blue Bills", path: "assets/music/BlueBills.mp3" },
  { title: "Ken Carson - Green Room", path: "assets/music/GreenRoom.mp3" },
  { title: "che - GET NAKED", path: "assets/music/GetNaked.mp3" },
  { title: "Destroy Lonely - if looks could kill", path: "assets/music/iflookscouldkill.mp3" },
  { title: "Yeat - Shade", path: "assets/music/Shade.mp3" },
  { title: "Sugarhill Ddot x STAR BANDZ - My Baby", path: "assets/music/baby.mp3" }
  { title: "Leblanco - U23", path: "assets/music/Leblanco.mp3" },
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
    const seekPercentage =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;
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

function createLyricsQuery(track) {
  const accentsMap = {
    à: "a",
    á: "a",
    â: "a",
    ä: "a",
    å: "a",
    æ: "ae",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ð: "d",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    ö: "o",
    ø: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    ý: "y",
    ÿ: "y",
    ß: "ss",
  };

  const normalizedTitle = track.title
    .toLowerCase()
    .replace(/ - /g, " ")
    .split("")
    .map((char) => accentsMap[char] || char)
    .join("");
  
  track.lyricsQuery = normalizedTitle;
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
  const response = await fetch(
    `${API_URL}?query=${encodeURIComponent(track)}`,
    options
  );
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  return data;
}

async function displayLyrics() {
  const playingTrack = tracks[currentTrack].lyricsQuery;
  lyricsDisplay.innerHTML = "<div class='loading'></div>";
  lyricsDisplay.style.color = "white";
  isLoading = true;

  try {
    const lyricsArray = await fetchLyrics(playingTrack);
    if (!lyricsArray || lyricsArray.error) {
      lyricsDisplay.innerHTML = "No lyrics available.";
      isLoading = false;
      return;
    }

    lyricsDisplay.textContent = "";

    const lyricsWrapper = document.createElement("div");
    lyricsWrapper.className = "lyrics-wrapper";
    lyricsDisplay.appendChild(lyricsWrapper);
    const fullTitle = tracks[currentTrack].title;
    const songArtist = fullTitle.includes(" - ")
      ? fullTitle.split(" - ")[0]
      : fullTitle;
    const songTitle = fullTitle.includes(" - ")
      ? fullTitle.split(" - ")[1]
      : fullTitle;

    lyricsWrapper.innerHTML = `<div class="lyric-line title">${songArtist}<br><br>${songTitle}</div>`;
    const firstLyricTimestamp =
      lyricsArray.length > 0 ? lyricsArray[0].seconds : 0;
    let lastRenderedIndex = -1;

    const updateDisplayedLyrics = () => {
      const currentTime = audioPlayer.currentTime;
      if (currentTime < firstLyricTimestamp) {
        lyricsWrapper.innerHTML = `<div class="lyric-line title">${songArtist}<br><br>${songTitle}</div>`;
        return;
      }

      let currentIndex = 0;
      for (let i = 0; i < lyricsArray.length; i++) {
        if (currentTime >= lyricsArray[i].seconds) {
          currentIndex = i;
        } else {
          break;
        }
      }

      if (currentIndex !== lastRenderedIndex) {
        lastRenderedIndex = currentIndex;
        lyricsWrapper.innerHTML = "";
        if (currentIndex > 0) {
          const prevLine = document.createElement("div");
          prevLine.className = "lyric-line previous";
          prevLine.textContent = lyricsArray[currentIndex - 1].lyrics;
          lyricsWrapper.appendChild(prevLine);
        }
        const currentLine = document.createElement("div");
        currentLine.className = "lyric-line highlight slide-in";
        currentLine.textContent = lyricsArray[currentIndex].lyrics;
        lyricsWrapper.appendChild(currentLine);
        if (currentIndex < lyricsArray.length - 1) {
          const nextLine = document.createElement("div");
          nextLine.className = "lyric-line next slide-in";
          nextLine.textContent = lyricsArray[currentIndex + 1].lyrics;
          lyricsWrapper.appendChild(nextLine);
        }

        lyricsWrapper.style.display = "block";
        currentLine.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    updateDisplayedLyrics();
    audioPlayer.removeEventListener("timeupdate", updateDisplayedLyrics);
    audioPlayer.addEventListener("timeupdate", updateDisplayedLyrics);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Fetch aborted for lyrics.");
    } else {
      lyricsDisplay.innerHTML =
        "<div class='loading'>Error fetching lyrics.</div>";
      console.error("Error fetching lyrics:", error);
      setTimeout(() => {
        lyricsDisplay.innerHTML =
          "<div class='error-display'>Error fetching lyrics.</div>";
      }, 1000);
    }
  } finally {
    isLoading = false;
  }
}

lyricsCloseBtn.addEventListener("click", () => {
  lyricsPopup.classList.remove("show");
  mainContent.classList.remove("no-click");
  overlay.style.display = "block";
  overlay.classList.remove("show");
  setTimeout(() => {
    lyricsPopup.style.display = "none";
    overlay.style.display = "none";
  }, 250);
});

lyricsButton.addEventListener("click", () => {
  lyricsPopup.style.display = "block";
  overlay.style.display = "block";
  mainContent.classList.add("no-click");
  lyricsPopup.classList.add("show");
  overlay.classList.add("show");
});

footer.addEventListener("click", () => {
  lyricsPopup.style.display = "block";
  overlay.style.display = "block";
  mainContent.classList.add("no-click");
  lyricsPopup.classList.add("show");
  overlay.classList.add("show");
});

function showDefaultFooter(animationClass) {
  footer.textContent = defaultFooterText;
  footer.classList.remove("slide-in-right", "slide-in-left");
  void footer.offsetWidth;
  footer.classList.add(animationClass);
}

window.onload = function () {
  tracks.forEach((track) => {
    createLyricsQuery(track);
  });

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

  showDefaultFooter("slide-in-right");
};
