const firebaseConfig = {
  apiKey: "AIzaSyCTzKMUnEqwoEiiYN-NEqZO5fbcUPJFYxY",
  authDomain: "wxrnlol-eb507.firebaseapp.com",
  databaseURL:
    "https://wxrnlol-eb507-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "wxrnlol-eb507",
  storageBucket: "wxrnlol-eb507.appspot.com",
  messagingSenderId: "130600299639",
  appId: "1:130600299639:web:8c24f992f6be60898a6a72",
  measurementId: "G-4MHBKXVH15",
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
      animateCountUp(views);
    });
}

fetch("https://api.ipify.org/?format=json")
  .then((response) => response.json())
  .then((data) => {
    fetch(
      `https://vpnapi.io/api/${data.ip}?key=09743a6399ca4bc4a635c51ecb847a6c`
    )
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
  }, 50);
}
