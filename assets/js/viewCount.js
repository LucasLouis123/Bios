// Define a constant for fake viewer count
const FAKE_VIEWER_COUNT = 666; // You can change this to whatever number you want

function get_viewers_ip(json) {
  let ip = json.ip;

  if (json.security.vpn || json.security.proxy) {
    document.getElementById("check-p").innerHTML =
      "vpn/proxy detected.<br>click to enter.";
    document.getElementById("entry-overlay").style.display = "flex";
    window.addEventListener("click", enterSite);
  } else {
    countViews(ip);
    enterSite();
  }
}

function enterSite() {
  const mainContent = document.querySelector("main");

  document.getElementById("entry-overlay").style.display = "none";
  document.getElementById("entry-overlay").style.visibility = "hidden";
  document.getElementById("entry-overlay").style.opacity = 0;

  mainContent.style.display = "flex";
  mainContent.classList.add("fade-in");

  window.removeEventListener("click", enterSite);

  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ip = data.ip;
      countViews(ip);
    })
    .catch((error) => {
      console.error("Error fetching IP:", error);
    });
}

function countViews(ip) {
  fetch('http://api.wxrn.lol/api/views', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'feC1ftqAcNp9hbY1mKQzWowTrraGjKEuQuioUmYfcMp3Tdk0ZBS38gXRSfVbp2H2',
    },
    body: JSON.stringify({ ip }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const actualViews = data.views;
    const totalViews = actualViews + FAKE_VIEWER_COUNT; // Add fake viewer count
    updateViewCount(totalViews); // Use the total views for display
  })
  .catch(error => {
    console.error("Error recording view:", error);
  });
}

// Fetch IP and pass it for VPN/Proxy check
fetch("https://api.ipify.org/?format=json")
  .then((response) => response.json())
  .then((data) => {
    fetch(
      `https://vpnapi.io/api/${data.ip}?key=6ad971dabb4343d484770927dcb3e666`
    )
      .then((response) => response.json())
      .then((securityData) => {
        get_viewers_ip(securityData);
      });
  })
  .catch((error) => {
    console.error("Error fetching IP:", error);
  });

// Function to update the viewer count directly
function updateViewCount(totalViews) {
  const pageViewsElement = document.getElementById("page_views");
  pageViewsElement.innerHTML = totalViews; // Set the total views directly
}

// Optional: If you want to keep the animated count-up effect
function animateCountUp(targetNumber) {
  const pageViewsElement = document.getElementById("page_views");
  const currentNumber = parseInt(pageViewsElement.innerHTML);
  const increment = Math.ceil((targetNumber - currentNumber) / 100);
  const duration = 1000;
  const steps = Math.ceil(duration / 50);
  let count = currentNumber;

  const interval = setInterval(() => {
    count += increment;
    if (increment > 0 && count >= targetNumber) {
      count = targetNumber;
      clearInterval(interval);
    } else if (increment < 0 && count <= targetNumber) {
      count = targetNumber;
      clearInterval(interval);
    }
    pageViewsElement.innerHTML = count;
  }, 40);
}
