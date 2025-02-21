
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAGKI3hINk1ooj7NNkFate1QJAKIUM6JQM",
    authDomain: "ebiz-3bbac.firebaseapp.com",
    projectId: "ebiz-3bbac",
    storageBucket: "ebiz-3bbac.firebasestorage.app",
    messagingSenderId: "1018049415817",
    appId: "1:1018049415817:web:f9ed178bb7aaa4b8499458",
    measurementId: "G-S1KW75JT67"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const auth = getAuth(app);


export { auth, db };
