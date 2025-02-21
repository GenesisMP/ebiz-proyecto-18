import { auth, db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

async function obtenerFacturas() {
  try {
    const facturasRef = collection(db, "facturas");
    const q = query(facturasRef, where("estado", "==", "disponible"));
    const querySnapshot = await getDocs(q);

    const tablaFacturas = document.getElementById("tablaFacturas");
    const tbody = document.getElementById("tbodyFacturas");
    tbody.innerHTML = ""; // Limpiar antes de mostrar nuevas facturas

    querySnapshot.forEach((docSnapshot) => {
      const factura = docSnapshot.data();
      const facturaId = docSnapshot.id;
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${factura.empresa}</td>
        <td>${factura.numero_factura}</td>
        <td>${factura.fecha}</td>
        <td>$${factura.valor}</td>
        <td><img src="${
          factura.imagen || "placeholder.jpg"
        }" alt="factura-imagen" width="50"/></td>
        <td><button onclick="reservarFactura('${facturaId}')">Reservar</button></td>
      `;

      tbody.appendChild(fila);
    });

    // Mostrar la tabla si hay facturas
    tablaFacturas.style.display = querySnapshot.empty ? "none" : "table";
  } catch (e) {
    console.error("error:", e);
  }
}

async function reservarFactura(facturaId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para reservar una factura.");
      return;
    }

    console.log("Reservando factura con ID:", facturaId);

    // Referencia a la factura en la colección principal
    const facturaRef = doc(db, "facturas", facturaId);

    // Referencia a la subcolección "reservadas" dentro del usuario
    const userFacturaRef = doc(
      collection(db, "users", user.uid, "facturas_reservadas"),
      facturaId
    );

    // Obtener la factura actual para copiar sus datos
    const facturaSnap = await getDoc(facturaRef);
    if (!facturaSnap.exists()) {
      console.error("La factura no existe.");
      return;
    }

    const facturaData = facturaSnap.data();

    // Guardar la factura en la subcolección del usuario
    await setDoc(userFacturaRef, {
      ...facturaData,
      estado: "reservada",
      usuario_reservado: user.uid,
    });

    // Actualizar el estado de la factura en la colección principal
    await updateDoc(facturaRef, {
      estado: "reservada",
      usuario_reservado: user.uid,
    });

    alert("Factura reservada con éxito");
    obtenerFacturas(); // Refrescar la vista
  } catch (e) {
    console.error("Error al reservar la factura:", e);
  }
}

window.reservarFactura = reservarFactura;

document.addEventListener("DOMContentLoaded", obtenerFacturas);
