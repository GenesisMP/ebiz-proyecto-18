import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

//🔹 LOGIN CON CORREO Y CONTRASEÑA (EL BÁSICO)

document.getElementById("Login-Form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorMessage = document.getElementById("login-error");
  errorMessage.textContent = "";

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    window.location.href = "../../holi/html/index.html";
  } catch (error) {
    console.error("Error en el login:", error.message);

    //MANEJA ERRORES Y LO MOSTRAMOS EN EL FORM PARA QUE EL USUARIO SEPA DONDE ESTA EL ERROR
    if (error.code === "auth/user-not-found") {
      errorMessage.textContent = "El usuario no existe, Registrate :D";
    } else if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Contraseña Incorrecta. Intentalo de Nuevo";
    } else if (error.code === "auth/invalid-email") {
      errorMessage.textContent = "Correo Incorrecto, revíselo";
    } else if (error.code === "auth/invalid-credential") {
      errorMessage.textContent = "Correo o Contraseña Invalidos, Reviselos";
    } else {
      errorMessage.textContent = "Ocurrio un error, Intentelo mas tarde";
    }
  }
});

//🔹 LOGIN CON GOOGLE (OMG OWO)

document.getElementById("login-google").addEventListener("click", async () => {
  const errorMessage = document.getElementById("login-error");
  errorMessage.textContent = "";
  try {
    const result = await signInWithPopup(auth, googleProvider);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error en el login con Google:", error.message);
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage.textContent =
        "Cerraste el popup antes de completar el login.";
    } else if (error.code === "auth/cancelled-popup-request") {
      errorMessage.textContent =
        "Se canceló el inicio de sesión. Inténtalo de nuevo.";
    } else if (error.code === "auth/popup-blocked") {
      errorMessage.textContent =
        "El popup fue bloqueado. Habilítalo en tu navegador.";
    } else if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage.textContent =
        "Este correo ya está registrado con otro método. Intenta con otro login.";
    } else {
      errorMessage.textContent = "Ocurrió un error, inténtalo más tarde.";
    }
  }
});

// 🔹 LOGIN CON FACEBOOK
document
  .getElementById("login-facebook")
  .addEventListener("click", async () => {
    const errorMessage = document.getElementById("login-error");
    errorMessage.textContent = "";
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Error en el login con Facebook:", error.message);
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage.textContent =
          "Cerraste el popup antes de completar el login.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage.textContent =
          "Se canceló el inicio de sesión. Inténtalo de nuevo.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage.textContent =
          "El popup fue bloqueado. Habilítalo en tu navegador.";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage.textContent =
          "Este correo ya está registrado con otro método. Intenta con otro login.";
      } else {
        errorMessage.textContent = "Ocurrió un error, inténtalo más tarde.";
      }
    }
  });
