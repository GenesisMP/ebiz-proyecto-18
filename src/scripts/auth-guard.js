import { auth } from "./firebase-config.js";
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "../index.html";
  }
});
