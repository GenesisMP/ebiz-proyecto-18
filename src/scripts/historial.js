import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
export async function agregarAlHistorial(userId, accion, factura) {
  try {
    const historialRef = collection(db, "users", userId, "historial");
    await addDoc(historialRef, {
      accion: accion,
      factura: factura,
      timestamp: serverTimestamp(),
    });
    console.log("historial guardado con exito");
  } catch (e) {
    console.error("Error al agregar al historial:", e);
  }
}
