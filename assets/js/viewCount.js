const firebaseConfig = {
  apiKey: "AIzaSyBbn354xnVZYER3UJKIlw3xixzlf2cE8Yg",
  authDomain: "x1nf-31fb9.firebaseapp.com",
  databaseURL: "https://x1nf-31fb9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "x1nf-31fb9",
  storageBucket: "x1nf-31fb9.appspot.com",
  messagingSenderId: "571498127982",
  appId: "1:571498127982:web:9b7263698bf077d1567c7f",
  measurementId: "G-828VWJMZXJ",
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

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
  var views;
  var ip_to_string = ip.toString().replace(/\./g, "-");

  firebase
    .database()
    .ref()
    .child("page_views/" + ip_to_string)
    .set({
      viewers_ip: ip,
    });

  firebase
    .database()
    .ref()
    .child("page_views")
    .on("value", function (snapshot) {
      views = snapshot.numChildren();
      // Add a random number to fake viewer count
      const fakeViewerCount = Math.floor(Math.random() * 100) + views;
      animateCountUp(fakeViewerCount);
    });
}

fetch("https://api.ipify.org/?format=json")
  .then((response) => response.json())
  .then((data) => {
    fetch(`https://vpnapi.io/api/${data.ip}?key=6ad971dabb4343d484770927dcb3e666`)
      .then((response) => response.json())
      .then((securityData) => {
        get_viewers_ip(securityData);
      });
  })
  .catch((error) => {
    console.error("Error fetching IP:", error);
  });

function animateCountUp(targetNumber) {
  const pageViewsElement = document.getElementById("page_views");
  const currentNumber = parseInt(pageViewsElement.innerHTML);
  const increment = Math.ceil((targetNumber - currentNumber) / 100); // Increment step
  const duration = 1000; // Duration of the animation in milliseconds
  const steps = Math.ceil(duration / 50); // Number of steps for the animation
  let count = currentNumber;

  const interval = setInterval(() => {
    count += increment;
    if (increment > 0 && count >= targetNumber) {
      count = targetNumber; // Stop at target number
      clearInterval(interval);
    } else if (increment < 0 && count <= targetNumber) {
      count = targetNumber; // Stop at target number
      clearInterval(interval);
    }
    pageViewsElement.innerHTML = count;
  }, 40);
}
