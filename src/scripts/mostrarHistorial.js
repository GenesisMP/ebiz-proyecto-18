import { db, auth } from "./firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

async function mostrarHistorial(user) {
  if (!user) {
    console.error("No hay usuario autenticado.");
    return;
  }

  try {
    const historialRef = collection(db, "users", user.uid, "historial");
    const q = query(historialRef, orderBy("timestamp", "desc")); // Ordenado por fecha
    const querySnapshot = await getDocs(q);

    const contenedorHistorial = document.getElementById("contenedorHistorial");
    contenedorHistorial.innerHTML = "";

    querySnapshot.forEach((docSnapshot) => {
      const registro = docSnapshot.data();
      console.log("Registro obtenido:", registro);

      const item = document.createElement("div");
      item.classList.add("historial-item");

      item.innerHTML = `
        <style>
        .historial-item {
  margin-bottom: 15px;
}

.historial-card {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.historial-card p {
  margin: 5px 0;
}

        
        </style>
          <div class="historial-card">
            <p><strong>Acción:</strong> ${registro.accion}</p>
            <p><strong>Factura:</strong> ${
              registro.factura?.numero_factura || "Desconocida"
            } - ${registro.factura?.empresa || "Desconocida"}</p>
            <p><strong>Fecha:</strong> ${
              registro.timestamp?.seconds
                ? new Date(registro.timestamp.seconds * 1000).toLocaleString()
                : "Sin fecha"
            }</p>
          </div>
        `;

      contenedorHistorial.appendChild(item);
    });
  } catch (e) {
    console.error("Error al obtener historial:", e);
  }
}

// Esperar autenticación del usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
    mostrarHistorial(user);
  } else {
    console.warn("Usuario no autenticado.");
  }
});
