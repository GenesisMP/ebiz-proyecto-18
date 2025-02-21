import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

//EVENTO PARA CREAR USUARIO CON NOMBRE, CORREO Y CONTRASEÑA (BÁSICO) Y MANEJO DE ERRORES EN PANTALLA

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("register-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const errorMessage = document.getElementById("register-error"); //ESTE WEY ES EL DE LOS MENSAJES EN ROJITO
      const succesMessage = document.getElementById("register-succesful"); //ESTE WEY VA A DAR LOS MENSAJES EN VERDE (SI FUNCIONÓ)

      //LIMPIAMOS CUALQUIER MENSAJE ANTERIOR
      errorMessage.textContent = "";
      succesMessage.textContent = "";

      const name = document.getElementById("register-name").value.trim();
      const email = document.getElementById("register-email").value.trim();
      const password = document.getElementById("register-password").value;

      if (!name || !email || !password) {
        //COMPRUEBA QUE LOS CAMPOS ESTÉN CON CONTENIDO SINO
        errorMessage.textContent = "Por favor Complete los Campos"; //SE LE ENVIA EL MENSAJE AL USUARIO
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await saveUserToFirestore(user, "email");
        succesMessage.textContent = `✅ Registro exitoso, bienvenido ${name}! Redirigiendo al login :D`;
        //RECARGA LA PAGINA PARA QUE UNA VEZ REGISTRADO SE LOGUEE
        setTimeout(() => {
          location.reload();
        }, 1500);
        //MANEJO DE ERRORES A PARTIR DE AQUI, DOBLE USUARIO/CONTRASEÑA, FORMATO NO VALIDO, INTERNET, ETC.
      } catch (error) {
        console.error("⚠️ Error en el registro:", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage.textContent = "El correo ya está registrado.";
            break;
          case "auth/invalid-email":
            errorMessage.textContent = "Formato de correo inválido.";
            break;
          case "auth/weak-password":
            errorMessage.textContent =
              "Contraseña débil. Use más de 6 caracteres.";
            break;
          case "auth/network-request-failed":
            errorMessage.textContent =
              "Error de conexión. Inténtalo más tarde.";
            break;
          default:
            errorMessage.textContent = "Error inesperado. Inténtalo más tarde.";
        }
      }
    });
});

document
  .getElementById("register-google")
  .addEventListener("click", async () => {
    const errorMessage = document.getElementById("register-error"); //ESTE WEY ES EL DE LOS MENSAJES EN ROJITO
    const succesMessage = document.getElementById("register-succesful"); //ESTE WEY VA A DAR LOS MENSAJES EN VERDE (SI FUNCIONÓ)

    //LIMPIAMOS CUALQUIER MENSAJE ANTERIOR
    errorMessage.textContent = "";
    succesMessage.textContent = "";
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToFirestore(user, "google");
      succesMessage.textContent = `registro exitoso con Google: ${user.displayName}`;
    } catch (error) {
      console.error(error);
      // Personalizamos el mensaje según el tipo de error
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage.textContent =
            "El popup de Google fue cerrado. Inténtalo de nuevo.";
          break;
        case "auth/network-request-failed":
          errorMessage.textContent =
            "Error de red. Verifica tu conexión a Internet.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage.textContent =
            "Ya existe una cuenta con este correo. Inicia sesión con otro método.";
          break;
        default:
          errorMessage.textContent = error.message; // Mostramos el mensaje de error por defecto
      }
    }
  });

document
  .getElementById("register-facebook")
  .addEventListener("click", async () => {
    const errorMessage = document.getElementById("register-error"); //ESTE WEY ES EL DE LOS MENSAJES EN ROJITO
    const succesMessage = document.getElementById("register-succesful"); //ESTE WEY VA A DAR LOS MENSAJES EN VERDE (SI FUNCIONÓ)

    //LIMPIAMOS CUALQUIER MENSAJE ANTERIOR
    errorMessage.textContent = "";
    succesMessage.textContent = "";
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      await saveUserToFirestore(user, "facebook");
      succesMessage.textContent = `registro exitoso con Google: ${user.displayName}`;
    } catch (e) {
      console.error(e);
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage.textContent =
            "El popup de Google fue cerrado. Inténtalo de nuevo.";
          break;
        case "auth/network-request-failed":
          errorMessage.textContent =
            "Error de red. Verifica tu conexión a Internet.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage.textContent =
            "Ya existe una cuenta con este correo. Inicia sesión con otro método.";
          break;
        default:
          errorMessage.textContent = error.message; // Mostramos el mensaje de error por defecto
      }
    }
  });

async function saveUserToFirestore(user, provider) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name:
        user.displayName ||
        document.getElementById("register-name").value ||
        "Usuario Nuevo",
      email: user.email,
      provider: provider,
    });
    console.log("✅ Usuario registrado con éxito en Firestore");
  } else {
    console.log("⚠️ El usuario ya estaba registrado en Firestore");
  }
}
