const firebaseConfig = {
    apiKey: "",
    authDomain: "wxrnlol-eb507.firebaseapp.com",
    projectId: "wxrnlol-eb507",
    storageBucket: "wxrnlol-eb507.appspot.com",
    messagingSenderId: "130600299639",
    appId: "1:130600299639:web:8c24f992f6be60898a6a72",
    measurementId: "G-4MHBKXVH15"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  fucntion get_viewers_ip(json) {
    let ip = json.ip;
    countViews(ip);
  }
  
  function countViews(ip) {
    var views;
    var ip_to_string = viewers_ip.toString();
  
    for(var i, i = 0; i < ip_to_string.length; i++){
      ip_to_string = ip_to_string.replace(".", "-");
    }
    
    firebase.database().ref().child("page_views/" + ip_to_string).set({
      viewers_ip: viewers_ip
    });
  
    firebase.database().ref().child("page_views").on("value", function (snapshot) {
      views = snapshot.numChildren();
      document.getElementById("page_views").innerHTML = views;
    });
  }