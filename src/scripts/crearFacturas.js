import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.getElementById("facturaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const empresa = document.getElementById("form-empresa").value;
  const numeroFactura = document.getElementById("form-numero-factura").value;
  const fecha = document.getElementById("form-fecha").value;
  const valor = parseFloat(document.getElementById("form-valor").value);

  try {
    console.log(db);
    const docRef = await addDoc(collection(db, "facturas"), {
      empresa,
      numero_factura: numeroFactura,
      fecha,
      valor,
      estado: "disponible",
      usuario_reservado: null,
    });

    console.log("factura registrada con ID: ", docRef.id);
    alert("factura registrada");

    document.getElementById("facturaForm").reset();
  } catch (e) {
    console.error("error en la factura", e);
  }
});
