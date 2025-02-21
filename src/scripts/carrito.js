import { db, auth } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { agregarAlHistorial } from "./historial.js";

async function obtenerCarrito(user) {
  if (!user) {
    alert("Debes iniciar sesión para ver tu carrito.");
    return;
  }

  try {
    const carritoRef = collection(db, "users", user.uid, "carrito_compras");
    const querySnapshot = await getDocs(carritoRef);

    const contenedorCarrito = document.getElementById("contenedorCarrito");
    contenedorCarrito.innerHTML = "";

    let totalPagar = 0;

    querySnapshot.forEach((docSnapshot) => {
      const factura = docSnapshot.data();
      const facturaId = docSnapshot.id;
      totalPagar += factura.valor;

      const card = document.createElement("div");
      card.classList.add("factura-card");

      card.innerHTML = `
        <img src="${factura.imagen || "placeholder.jpg"}" alt="Factura">
        <p><strong>Empresa:</strong> ${factura.empresa}</p>
        <p><strong>Número:</strong> ${factura.numero_factura}</p>
        <p><strong>Fecha:</strong> ${factura.fecha}</p>
        <p><strong>Valor:</strong> $${factura.valor}</p>
        <button onclick="eliminarDelCarrito('${facturaId}')">Eliminar</button>
      `;

      contenedorCarrito.appendChild(card);
    });

    // total de monto
    document.getElementById("totalPagar").innerText = `Total: $${totalPagar}`;
  } catch (e) {
    console.error("Error al obtener el carrito:", e);
  }
}

async function eliminarDelCarrito(facturaId) {
  const user = auth.currentUser;
  if (!user) {
    alert("Debes iniciar sesión.");
    return;
  }

  try {
    const facturaRef = doc(db, "users", user.uid, "carrito_compras", facturaId);
    await deleteDoc(facturaRef);
    await agregarAlHistorial(user.uid, "elimino del carrito", facturaData);

    alert("Factura eliminada del carrito.");
    obtenerCarrito(user); // Refrescar la vista con el usuario correcto
  } catch (e) {
    console.error("Error al eliminar la factura:", e);
  }
}

window.eliminarDelCarrito = eliminarDelCarrito;

// ✅ Detectar usuario antes de llamar a `obtenerCarrito()`
onAuthStateChanged(auth, (user) => {
  if (user) {
    obtenerCarrito(user);
  } else {
    alert("Debes iniciar sesión para ver tu carrito.");
  }
});
