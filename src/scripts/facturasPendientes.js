import { db, auth } from "./firebase-config.js";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { agregarAlHistorial } from "./historial.js";

function obtenerFacturasPendientes(user) {
  if (!user) return;

  const facturasRef = collection(db, "users", user.uid, "facturas_reservadas");

  getDocs(facturasRef)
    .then((querySnapshot) => {
      const contenedor = document.getElementById("facturasPendientes");
      contenedor.innerHTML = "";

      querySnapshot.forEach((docSnapshot) => {
        const factura = docSnapshot.data();
        const facturaId = docSnapshot.id;

        const card = document.createElement("div");
        card.classList.add("factura-card");

        card.innerHTML = `
          <img src="${
            factura.imagen || "placeholder.jpg"
          }" alt="factura" class="factura-img">
          <div class="factura-info">
            <h3>${factura.empresa}</h3>
            <p><strong>Número:</strong> ${factura.numero_factura}</p>
            <p><strong>Fecha:</strong> ${factura.fecha}</p>
            <p><strong>Valor:</strong> $${factura.valor}</p>
            <div class="factura-buttons">
              <button onclick="eliminarFactura('${facturaId}')">Eliminar</button>
              <button onclick="pagarFactura('${facturaId}')">Pagar</button>
            </div>
          </div>
        `;

        contenedor.appendChild(card);
      });
    })
    .catch((e) => console.error("Error al obtener facturas pendientes:", e));
}

async function eliminarFactura(facturaId) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const facturaRef = doc(
      db,
      "users",
      user.uid,
      "facturas_reservadas",
      facturaId
    );
    await deleteDoc(facturaRef);

    await agregarAlHistorial(user.uid, "eliminó", facturaData);

    alert("Factura eliminada correctamente.");
    obtenerFacturasPendientes(user);
  } catch (e) {
    console.error("Error al eliminar factura:", e);
  }
}

async function pagarFactura(facturaId) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const facturaRef = doc(
      db,
      "users",
      user.uid,
      "facturas_reservadas",
      facturaId
    );
    const carritoRef = doc(db, "users", user.uid, "carrito_compras", facturaId);

    const facturaSnap = await getDoc(facturaRef);
    if (!facturaSnap.exists()) {
      console.error("La factura no existe.");
      return;
    }

    const facturaData = facturaSnap.data();

    // Mover la factura al carrito
    await setDoc(carritoRef, {
      ...facturaData,
      estado: "en_carrito",
    });

    // Eliminarla de las facturas reservadas
    await deleteDoc(facturaRef);

    await agregarAlHistorial(user.uid, "pagó", facturaData);

    alert("Factura añadida al carrito.");
    obtenerFacturasPendientes(user); // Refrescar la vista
  } catch (e) {
    console.error("Error al pagar la factura:", e);
  }
}

window.eliminarFactura = eliminarFactura;
window.pagarFactura = pagarFactura;

onAuthStateChanged(auth, (user) => {
  if (user) {
    obtenerFacturasPendientes(user);
  } else {
    alert("Debes iniciar sesión para ver tus facturas pendientes.");
  }
});
