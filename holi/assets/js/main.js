/**
 * Main
 */

'use strict';

let menu, animate;

(function () {
  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll('#layout-menu');
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: 'vertical',
      closeChildren: false
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
    });
  });

  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  window.Helpers.setCollapsed(true, false);
})();

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
      let product = {
        id: this.getAttribute("data-id"),
        name: this.getAttribute("data-name"),
        price: parseFloat(this.getAttribute("data-price"))
      };

      // Obtener carrito del localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Verificar si el producto ya está en el carrito
      let existingProduct = cart.find(item => item.id === product.id);
      if (!existingProduct) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Mostrar notificación
      let notification = document.getElementById("cart-notification");
      notification.style.display = "block";
      notification.textContent = `"${product.name}" añadido al carrito`;

      // Ocultar la notificación después de 2.5 segundos
      setTimeout(() => {
        notification.style.display = "none";
      }, 2500);

      // Cambiar texto y deshabilitar botón
      this.textContent = "Añadido";
      this.classList.add("added");
      this.disabled = true;
    });
  });
});
//carrito
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cart-items");

  if (cart.length === 0) {
    cartItems.innerHTML = `<tr><td colspan="2">El carrito está vacío.</td></tr>`;
    return;
  }

  cart.forEach(product => {
    let row = document.createElement("tr");

    // Asegurar que el precio sea número antes de usar .toFixed()
    let price = parseFloat(product.price) || 0;

    row.innerHTML = `
      <td>${product.name}</td>
      <td>S/ ${price.toFixed(2)}</td>
    `;

    cartItems.appendChild(row);
  });
});
 // boleta 
 document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("fecha").textContent = new Date().toLocaleDateString();
  generarBoleta();
});

function generarBoleta() {
  let carrito = JSON.parse(localStorage.getItem("cart")) || [];
  let detalleCompra = document.getElementById("detalle-compra");
  let totalElement = document.getElementById("total");

  // Verificar si existe el elemento antes de modificarlo
  if (!detalleCompra || !totalElement) {
    console.error("⚠️ Error: Elementos de la boleta no encontrados en el DOM.");
    return;
  }

  if (carrito.length === 0) {
    detalleCompra.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalElement.textContent = "0.00";
    return;
  }

  let total = 0;
  let html = `<table class="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>`;

  carrito.forEach(item => {
    let precio = parseFloat(item.price) || 0;
    let cantidad = item.cantidad || 1; // Si no hay cantidad, asumir 1
    let subtotal = precio * cantidad;
    total += subtotal;

    html += `<tr>
              <td>${item.name}</td>
              <td>${cantidad}</td>
              <td>S/ ${precio.toFixed(2)}</td>
            </tr>`;
  });

  html += `</tbody></table>`;

  detalleCompra.innerHTML = html;
  totalElement.textContent = total.toFixed(2);
}

function procesarPago() {
  alert("✅ Solicitud Realizada!");
  localStorage.removeItem("cart"); // Vaciar carrito después del pago
  window.location.href = "index.html"; // Redirigir a la página principal
}
//historial
document.addEventListener("DOMContentLoaded", function () {
  let historial = JSON.parse(localStorage.getItem("historial")) || {
    disponibles: [],
    pendientes: [],
    pagadas: []
  };

  function cargarHistorial(tipo, elementoId) {
    const lista = document.getElementById(elementoId);
    if (!lista) return; // Verificar que el elemento existe

    lista.innerHTML = "";
    historial[tipo].forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = item;
      lista.appendChild(li);
    });
  }

  function registrarHistorial(tipo, detalle) {
    const timestamp = new Date().toLocaleString();
    historial[tipo].push(`${detalle} - ${timestamp}`);
    localStorage.setItem("historial", JSON.stringify(historial));
    cargarHistorial(tipo, `lista-${tipo}`);
  }

  // Cargar historial en las pestañas
  cargarHistorial("disponibles", "lista-productos");
  cargarHistorial("pendientes", "lista-carritos");
  cargarHistorial("pagadas", "lista-boletas");

  // Almacenar productos disponibles al inicio
  let carrito = JSON.parse(localStorage.getItem("cart")) || [];
  carrito.forEach(product => registrarHistorial("disponibles", product.name));

  // Exponer la función para registrar desde otros eventos
  window.registrarHistorial = registrarHistorial;
});

// Registrar carritos pendientes antes de pagar
function guardarCarritoPendiente() {
  let carrito = JSON.parse(localStorage.getItem("cart")) || [];
  if (carrito.length === 0) return;

  let productos = carrito.map(item => item.name).join(", ");
  window.registrarHistorial("pendientes", `Carrito: ${productos}`);
}

// Mover compras pagadas a historial
function procesarPago() {
  let carrito = JSON.parse(localStorage.getItem("cart")) || [];
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let productos = carrito.map(item => item.name).join(", ");
  window.registrarHistorial("pagadas", `Compra pagada: ${productos}`);

  alert("✅ Solicitud Realizado Con Exito!");
  localStorage.removeItem("cart"); // Vaciar carrito después del pago
  window.location.href = "index.html"; // Redirigir a la página principal
}
